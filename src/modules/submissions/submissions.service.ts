import { prisma } from "../../lib/prisma";
import { SubmissionStatus } from "../../generated/prisma/client";
import { runCodeAgainstTestCase } from "../../services/execution.service";

type CreateSubmissionInput = {
  userId: string;
  challengeId: string;
  sourceCode: string;
  language?: string;
};

export async function createSubmissionService(data: CreateSubmissionInput) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: data.challengeId },
    include: {
      testCases: {
        orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
      },
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

  const submission = await prisma.submission.create({
    data: {
      userId: data.userId,
      challengeId: data.challengeId,
      sourceCode: data.sourceCode,
      language: data.language ?? "javascript",
      status: SubmissionStatus.RUNNING,
    },
  });

  try {
    const executionResults = challenge.testCases.map((testCase) => {
      const result = runCodeAgainstTestCase(
        data.sourceCode,
        challenge.functionName,
        testCase.input,
        testCase.expectedOutput,
      );

      return {
        testCaseId: testCase.id,
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: testCase.expectedOutput,
        errorMessage: result.errorMessage,
        executionTimeMs: result.executionTimeMs,
        isHidden: testCase.isHidden,
      };
    });

    const passedCount = executionResults.filter(
      (result) => result.passed,
    ).length;
    const totalCount = executionResults.length;
    const failedCount = totalCount - passedCount;
    const score =
      totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

    const submissionExecutionTimeMs = executionResults.reduce(
      (sum, result) => sum + result.executionTimeMs,
      0,
    );

    await prisma.submissionResult.createMany({
      data: executionResults.map((result) => ({
        submissionId: submission.id,
        testCaseId: result.testCaseId,
        passed: result.passed,
        actualOutput: result.actualOutput as any,
        expectedOutput: result.expectedOutput as any,
        errorMessage: result.errorMessage,
        executionTimeMs: result.executionTimeMs,
      })),
    });

    const updatedSubmission = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: SubmissionStatus.COMPLETED,
        passedCount,
        failedCount,
        totalCount,
        score,
        errorMessage: null,
        executionTimeMs: submissionExecutionTimeMs,
      },
      include: {
        results: {
          include: {
            testCase: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        challenge: true,
        user: true,
      },
    });

    return {
      submission: updatedSubmission,
      summary: {
        status: updatedSubmission.status,
        passedCount,
        failedCount,
        totalCount,
        score,
        executionTimeMs: submissionExecutionTimeMs,
      },
      results: executionResults.map((result) => ({
        testCaseId: result.testCaseId,
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: result.expectedOutput,
        errorMessage: result.errorMessage,
        executionTimeMs: result.executionTimeMs,
      })),
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue pendant l'exécution";

    const failedSubmission = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: SubmissionStatus.FAILED,
        errorMessage: message,
      },
    });

    return {
      submission: failedSubmission,
      summary: {
        status: failedSubmission.status,
        passedCount: 0,
        failedCount: 0,
        totalCount: 0,
        score: 0,
        executionTimeMs: 0,
      },
      results: [],
    };
  }
}

export async function getSubmissionByIdService(id: string) {
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
      challenge: true,
      user: true,
    },
  });

  if (!submission) {
    throw new Error("Submission introuvable");
  }

  return submission;
}

export async function getSubmissionsByChallengeService(challengeId: string) {
  return prisma.submission.findMany({
    where: { challengeId },
    include: {
      user: true,
      challenge: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSubmissionsByUserService(userId: string) {
  return prisma.submission.findMany({
    where: { userId },
    include: {
      challenge: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
