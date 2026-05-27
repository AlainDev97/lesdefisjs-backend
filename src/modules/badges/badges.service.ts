import { BadgeCode } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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
