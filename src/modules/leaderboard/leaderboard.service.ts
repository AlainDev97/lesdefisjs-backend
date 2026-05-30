import { prisma } from "../../lib/prisma";

export async function getLeaderboardService() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      challengeProgress: {
        select: {
          solvedAt: true,
          bestScore: true,
          attempts: true,
        },
      },
    },
  });

  const leaderboard = users.map((user) => {
    const solvedChallenges = user.challengeProgress.filter(
      (progress) => progress.solvedAt !== null,
    ).length;

    const totalAttempts = user.challengeProgress.reduce(
      (total, progress) => total + progress.attempts,
      0,
    );

    const bestScores = user.challengeProgress.map(
      (progress) => progress.bestScore,
    );

    const averageScore =
      bestScores.length > 0
        ? Math.round(
            bestScores.reduce((total, score) => total + score, 0) /
              bestScores.length,
          )
        : 0;

    const bestScore = bestScores.length > 0 ? Math.max(...bestScores) : 0;

    return {
      userId: user.id,
      username: user.username,
      solvedChallenges,
      totalSubmissions: totalAttempts,
      averageScore,
      bestScore,
    };
  });

  return leaderboard
    .sort((a, b) => {
      if (b.solvedChallenges !== a.solvedChallenges) {
        return b.solvedChallenges - a.solvedChallenges;
      }

      if (b.averageScore !== a.averageScore) {
        return b.averageScore - a.averageScore;
      }

      return b.totalSubmissions - a.totalSubmissions;
    })
    .map((user, index) => ({
      rank: index + 1,
      ...user,
    }));
}
