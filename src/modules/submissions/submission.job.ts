import { SubmissionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { runCodeAgainstTestCases } from "../../services/execution.service";
import { checkAndAwardBadges } from "../badges/badges.service";
import { updateUserChallengeProgress } from "../progression/userChallengeProgress.service";

export async function executeSubmissionJob(submissionId: string) {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      user: true,
      challenge: {
        include: {
          testCases: {
            orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });

  if (!submission) {
    throw new Error("Submission introuvable");
  }

  if (submission.challenge.testCases.length === 0) {
    throw new Error("Aucun test case trouvé pour ce challenge");
  }

  await prisma.submission.update({
    where: { id: submission.id },
    data: {
      status: SubmissionStatus.RUNNING,
    },
  });

  try {
    const rawResults = await runCodeAgainstTestCases(
      submission.sourceCode,
      submission.challenge.functionName,
      submission.challenge.testCases.map((testCase) => ({
        testCaseId: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
      })),
    );

    const executionResults = rawResults.map((result) => {
      const testCase = submission.challenge.testCases.find(
        (testCase) => testCase.id === result.testCaseId,
      );

      if (!testCase) {
        throw new Error("Test case introuvable après exécution");
      }

      return {
        testCaseId: testCase.id,
        passed: result.passed,
        actualOutput: result.actualOutput,
        expectedOutput: testCase.expectedOutput,
        errorMessage: result.errorMessage,
        executionTimeMs: result.executionTimeMs,
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

    await prisma.submission.update({
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
    });

    await updateUserChallengeProgress({
      userId: submission.userId,
      challengeId: submission.challengeId,
      score,
    });

    await checkAndAwardBadges(submission.userId);
  } catch (error) {
    console.error("SUBMISSION JOB ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue pendant l'exécution";

    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: SubmissionStatus.FAILED,
        errorMessage: message,
        passedCount: 0,
        failedCount: submission.challenge.testCases.length,
        totalCount: submission.challenge.testCases.length,
        score: 0,
        executionTimeMs: 0,
      },
    });

    throw error;
  }
}
