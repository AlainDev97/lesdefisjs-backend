import { prisma } from "../../lib/prisma";

export async function getLeaderboardService() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      submissions: {
        select: {
          id: true,
          challengeId: true,
          score: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  const leaderboard = users.map((user) => {
    const completedSubmissions = user.submissions.filter(
      (submission) => submission.status === "COMPLETED",
    );

    const successfulSubmissions = completedSubmissions.filter(
      (submission) => submission.score === 100,
    );

    const solvedChallengeIds = new Set(
      successfulSubmissions.map((submission) => submission.challengeId),
    );

    const totalSubmissions = user.submissions.length;

    const averageScore =
      completedSubmissions.length > 0
        ? Math.round(
            completedSubmissions.reduce(
              (total, submission) => total + submission.score,
              0,
            ) / completedSubmissions.length,
          )
        : 0;

    const bestScore =
      completedSubmissions.length > 0
        ? Math.max(
            ...completedSubmissions.map((submission) => submission.score),
          )
        : 0;

    return {
      userId: user.id,
      username: user.username,
      solvedChallenges: solvedChallengeIds.size,
      totalSubmissions,
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
