import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { slugify } from "../../utils/slugify";
import type { CreateChallengeInput } from "../types/challenges";

type UpdateChallengeInput = Partial<CreateChallengeInput>;

export async function createChallenge(data: CreateChallengeInput) {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const slug = slugify(data.title);

  const existingChallenge = await prisma.challenge.findUnique({
    where: { slug },
  });

  if (existingChallenge) {
    throw new ApiError(409, "Challenge with this title already exists");
  }

  return prisma.challenge.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      instructions: data.instructions,
      difficulty: data.difficulty,
      functionName: data.functionName,
      starterCode: data.starterCode,
      solutionCode: data.solutionCode,
      returnType: data.returnType,
      parameters: data.parameters as any,
      status: data.status ?? "DRAFT",
      orderIndex: data.orderIndex ?? 0,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
    },
  });
}

export async function getAllChallenges() {
  return prisma.challenge.findMany({
    include: {
      category: true,
      testCases: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getChallengeById(id: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      category: true,
      testCases: true,
    },
  });

  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }

  return challenge;
}

export const getChallengeBySlug = async (slug: string) => {
  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    include: {
      category: true,
      testCases: true,
    },
  });

  if (!challenge) {
    throw new ApiError(404, "Challenge not found");
  }

  return challenge;
};

export async function updateChallenge(id: string, data: UpdateChallengeInput) {
  const existingChallenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!existingChallenge) {
    throw new ApiError(404, "Challenge not found");
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }
  }

  let slug = existingChallenge.slug;

  if (data.title) {
    slug = slugify(data.title);

    const duplicateChallenge = await prisma.challenge.findFirst({
      where: {
        AND: [{ id: { not: id } }, { slug }],
      },
    });

    if (duplicateChallenge) {
      throw new ApiError(
        409,
        "Another challenge with this title already exists",
      );
    }
  }

  return prisma.challenge.update({
    where: { id },
    data: {
      title: data.title ?? existingChallenge.title,
      slug,
      description: data.description ?? existingChallenge.description,
      instructions: data.instructions ?? existingChallenge.instructions,
      difficulty: data.difficulty ?? existingChallenge.difficulty,
      functionName: data.functionName ?? existingChallenge.functionName,
      starterCode:
        data.starterCode !== undefined
          ? data.starterCode
          : existingChallenge.starterCode,
      solutionCode:
        data.solutionCode !== undefined
          ? data.solutionCode
          : existingChallenge.solutionCode,
      returnType:
        data.returnType !== undefined
          ? data.returnType
          : existingChallenge.returnType,
      parameters:
        data.parameters !== undefined
          ? (data.parameters as any)
          : existingChallenge.parameters,
      status: data.status ?? existingChallenge.status,
      orderIndex: data.orderIndex ?? existingChallenge.orderIndex,
      categoryId: data.categoryId ?? existingChallenge.categoryId,
    },
    include: {
      category: true,
      testCases: true,
    },
  });
}

export async function deleteChallenge(id: string) {
  const existingChallenge = await prisma.challenge.findUnique({
    where: { id },
  });

  if (!existingChallenge) {
    throw new ApiError(404, "Challenge not found");
  }

  await prisma.challenge.delete({
    where: { id },
  });

  return { message: "Challenge deleted successfully" };
}
