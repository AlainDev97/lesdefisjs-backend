import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import type {
  CreateTestCaseInput,
  UpdateTestCaseInput,
} from "../types/testCases";

export async function createTestCaseService(data: CreateTestCaseInput) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: data.challengeId },
  });

  if (!challenge) {
    throw new ApiError(404, "Challenge introuvable");
  }

  const testCase = await prisma.testCase.create({
    data: {
      challengeId: data.challengeId,
      input: data.input,
      expectedOutput: data.expectedOutput,
      explanation: data.explanation,
      isHidden: data.isHidden ?? true,
      orderIndex: data.orderIndex ?? 0,
    },
  });

  return testCase;
}

export async function getAllTestCasesService() {
  return prisma.testCase.findMany({
    orderBy: [{ challengeId: "asc" }, { orderIndex: "asc" }, { createdAt: "asc" }],
  });
}

export async function getTestCaseByIdService(id: string) {
  const testCase = await prisma.testCase.findUnique({
    where: { id },
  });

  if (!testCase) {
    throw new ApiError(404, "Test case introuvable");
  }

  return testCase;
}

export async function getTestCasesByChallengeService(challengeId: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) {
    throw new ApiError(404, "Challenge introuvable");
  }

  return prisma.testCase.findMany({
    where: { challengeId },
    orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
  });
}

export async function updateTestCaseService(
  id: string,
  data: UpdateTestCaseInput
) {
  const existingTestCase = await prisma.testCase.findUnique({
    where: { id },
  });

  if (!existingTestCase) {
    throw new ApiError(404, "Test case introuvable");
  }

  const updatedTestCase = await prisma.testCase.update({
    where: { id },
    data: {
      ...(data.input !== undefined && { input: data.input }),
      ...(data.expectedOutput !== undefined && {
        expectedOutput: data.expectedOutput,
      }),
      ...(data.explanation !== undefined && { explanation: data.explanation }),
      ...(data.isHidden !== undefined && { isHidden: data.isHidden }),
      ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
    },
  });

  return updatedTestCase;
}

export async function deleteTestCaseService(id: string) {
  const existingTestCase = await prisma.testCase.findUnique({
    where: { id },
  });

  if (!existingTestCase) {
    throw new ApiError(404, "Test case introuvable");
  }

  await prisma.testCase.delete({
    where: { id },
  });

  return {
    message: "Test case supprimé avec succès",
  };
}
