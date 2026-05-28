import { prisma } from "../../lib/prisma";

const XP_PER_SOLVED_CHALLENGE = 100;
const XP_PER_BADGE = 50;
const XP_PER_LEVEL = 250;

const LEVEL_TITLES = [
  "Débutant JavaScript",
  "Apprenti développeur",
  "Aventurier du code",
  "Chasseur de bugs",
  "Guerrier des algorithmes",
  "Maître JavaScript",
];

export async function getUserProgressionService(userId: string) {
  const challengeProgress = await prisma.userChallengeProgress.findMany({
    where: {
      userId,
    },
  });

  const badgesCount = await prisma.userBadge.count({
    where: {
      userId,
    },
  });

  const solvedChallengesCount = challengeProgress.filter(
    (progress) => progress.solvedAt !== null,
  ).length;

  const totalAttempts = challengeProgress.reduce(
    (total, progress) => total + progress.attempts,
    0,
  );

  const totalXp =
    solvedChallengesCount * XP_PER_SOLVED_CHALLENGE +
    badgesCount * XP_PER_BADGE;

  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const currentLevelXp = totalXp % XP_PER_LEVEL;
  const nextLevelXp = XP_PER_LEVEL;
  const progressPercent = Math.round((currentLevelXp / nextLevelXp) * 100);

  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  return {
    totalXp,
    level,
    title,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
    sources: {
      solvedChallenges: solvedChallengesCount,
      badges: badgesCount,
      attempts: totalAttempts,
    },
  };
}
