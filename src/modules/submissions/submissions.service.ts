import { prisma } from "../../lib/prisma";
import { SubmissionStatus, UserRole } from "@prisma/client";
import { runCodeAgainstTestCases } from "../../services/execution.service";
import { filterSubmissionResultsForUser } from "../../utils/function";
import { checkAndAwardBadges } from "../badges/badges.service";
import { updateUserChallengeProgress } from "../progression/userChallengeProgress.service";
import { submissionQueue } from "../../queues/submission.queue";

type CreateSubmissionInput = {
  userId: string;
  challengeId: string;
  sourceCode: string;
  language?: string;
};

const publicUserSelect = {
  id: true,
  username: true,
  role: true,
};

const publicChallengeSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  instructions: true,
  starterCode: true,
  difficulty: true,
  status: true,
  functionName: true,
  parameters: true,
  returnType: true,
  orderIndex: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
};

const MAX_SOURCE_CODE_SIZE = 20 * 1024; // 20 KB
const SUBMISSION_COOLDOWN_MS = 10_000; // 10 secondes

export async function createSubmissionService(data: CreateSubmissionInput) {
  if (!data.sourceCode?.trim()) {
    throw new Error("Le code source est obligatoire");
  }

  if (Buffer.byteLength(data.sourceCode, "utf8") > MAX_SOURCE_CODE_SIZE) {
    throw new Error("Le code source est trop long. Limite maximale : 20 KB.");
  }

  const challenge = await prisma.challenge.findUnique({
    where: { id: data.challengeId },
    include: {
      testCases: true,
    },
  });

  if (!challenge) {
    throw new Error("Challenge introuvable");
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  if (challenge.testCases.length === 0) {
    throw new Error("Aucun test case trouvé pour ce challenge");
  }

  const lastSubmission = await prisma.submission.findFirst({
    where: {
      userId: data.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (
    lastSubmission &&
    Date.now() - lastSubmission.createdAt.getTime() < SUBMISSION_COOLDOWN_MS
  ) {
    throw new Error(
      "Merci d'attendre quelques secondes avant de soumettre à nouveau.",
    );
  }

  const submission = await prisma.submission.create({
    data: {
      userId: data.userId,
      challengeId: data.challengeId,
      sourceCode: data.sourceCode,
      language: data.language ?? "javascript",
      status: SubmissionStatus.PENDING,
    },
    include: {
      challenge: {
        select: publicChallengeSelect,
      },
      user: {
        select: publicUserSelect,
      },
      results: true,
    },
  });

  await submissionQueue.add("run-submission", {
    submissionId: submission.id,
  });

  return {
    submission,
    summary: {
      status: submission.status,
      passedCount: 0,
      failedCount: 0,
      totalCount: challenge.testCases.length,
      score: 0,
      executionTimeMs: 0,
      errorMessage: null,
    },
    results: [],
    earnedBadges: [],
    challengeProgress: null,
  };
}

export async function getSubmissionByIdService(
  id: string,
  currentUser: { id: string; role: UserRole },
) {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      results: {
        include: {
          testCase: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      challenge: {
        select: publicChallengeSelect,
      },
      user: {
        select: publicUserSelect,
      },
    },
  });

  if (!submission) {
    throw new Error("Submission introuvable");
  }

  const isOwner = submission.userId === currentUser.id;
  const isAdmin = currentUser.role === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("Accès refusé");
  }

  return filterSubmissionResultsForUser(submission, currentUser);
}

export async function getMySubmissionsService(userId: string) {
  return prisma.submission.findMany({
    where: { userId },
    include: {
      challenge: {
        select: publicChallengeSelect,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSubmissionsByChallengeService(
  challengeId: string,
  currentUser: { id: string; role: UserRole },
) {
  const isAdmin = currentUser.role === UserRole.ADMIN;

  return prisma.submission.findMany({
    where: {
      challengeId,
      ...(isAdmin ? {} : { userId: currentUser.id }),
    },
    include: {
      user: {
        select: publicUserSelect,
      },
      challenge: {
        select: publicChallengeSelect,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSubmissionsByUserService(
  userId: string,
  currentUser: { id: string; role: UserRole },
) {
  const isOwner = userId === currentUser.id;
  const isAdmin = currentUser.role === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("Accès refusé");
  }

  return prisma.submission.findMany({
    where: { userId },
    include: {
      challenge: {
        select: publicChallengeSelect,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
