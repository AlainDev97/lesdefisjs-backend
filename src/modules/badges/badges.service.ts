import { BadgeCode } from "../../generated/prisma/client";
import { getLeaderboardService } from "../leaderboard/leaderboard.service";
import { prisma } from "../../lib/prisma";

export async function getUserBadgesService(userId: string) {
  return prisma.userBadge.findMany({
    where: {
      userId,
    },
    include: {
      badge: true,
    },
    orderBy: {
      earnedAt: "desc",
    },
  });
}

export async function awardBadgeToUser(userId: string, badgeCode: BadgeCode) {
  const badge = await prisma.badge.findUnique({
    where: {
      code: badgeCode,
    },
  });

  if (!badge) {
    return;
  }

  const existingUserBadge = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId: badge.id,
      },
    },
  });

  if (existingUserBadge) {
    return;
  }

  await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
    },
  });

  console.log(`🏆 Badge attribué : ${badge.name} -> ${userId}`);
}

export async function checkAndAwardBadges(userId: string) {
  /*
    PREMIER SUCCÈS
  */
  const completedSubmissions = await prisma.submission.count({
    where: {
      userId,
      status: "COMPLETED",
      score: {
        gt: 0,
      },
    },
  });

  if (completedSubmissions >= 1) {
    await awardBadgeToUser(userId, BadgeCode.FIRST_SUCCESS);
  }

  /*
    SCORE PARFAIT
  */
  const perfectSubmission = await prisma.submission.findFirst({
    where: {
      userId,
      score: 100,
    },
  });

  if (perfectSubmission) {
    await awardBadgeToUser(userId, BadgeCode.PERFECT_SCORE);
  }

  /*
    RÉGULIER
  */
  const totalSubmissions = await prisma.submission.count({
    where: {
      userId,
    },
  });

  if (totalSubmissions >= 10) {
    await awardBadgeToUser(userId, BadgeCode.REGULAR);
  }

  /*
    CONFIRMÉ
  */
  const successfulChallenges = await prisma.submission.findMany({
    where: {
      userId,
      score: 100,
    },
    distinct: ["challengeId"],
  });

  if (successfulChallenges.length >= 5) {
    await awardBadgeToUser(userId, BadgeCode.CONFIRMED);
  }

  /*
  TOP PLAYER
*/
  const leaderboard = await getLeaderboardService();

  const currentUserRank = leaderboard.find(
    (user) => user.userId === userId,
  )?.rank;

  if (currentUserRank && currentUserRank <= 3) {
    await awardBadgeToUser(userId, BadgeCode.TOP_PLAYER);
  }
}
