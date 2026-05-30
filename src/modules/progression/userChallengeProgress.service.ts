import { prisma } from "../../lib/prisma";

export async function getUserChallengeProgressService(params: {
  userId: string;
  challengeId: string;
}) {
  const progress = await prisma.userChallengeProgress.findUnique({
    where: {
      userId_challengeId: {
        userId: params.userId,
        challengeId: params.challengeId,
      },
    },
  });

  return {
    isSolved: Boolean(progress?.solvedAt),
    solvedAt: progress?.solvedAt ?? null,
    bestScore: progress?.bestScore ?? 0,
    attempts: progress?.attempts ?? 0,
  };
}

export async function updateUserChallengeProgress(params: {
  userId: string;
  challengeId: string;
  score: number;
}) {
  const { userId, challengeId, score } = params;

  const existingProgress = await prisma.userChallengeProgress.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
  });

  const isFirstSolve = score === 100 && !existingProgress?.solvedAt;

  const progress = await prisma.userChallengeProgress.upsert({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
    update: {
      attempts: {
        increment: 1,
      },
      bestScore: Math.max(existingProgress?.bestScore ?? 0, score),
      solvedAt: isFirstSolve ? new Date() : existingProgress?.solvedAt,
    },
    create: {
      userId,
      challengeId,
      attempts: 1,
      bestScore: score,
      solvedAt: score === 100 ? new Date() : null,
    },
  });

  return {
    progress,
    isFirstSolve,
    earnedXp: isFirstSolve ? 100 : 0,
  };
}
