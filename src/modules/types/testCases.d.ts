import type { Prisma } from "@prisma/client";

// Types pour les inputs
export type CreateTestCaseInput = {
  challengeId: string;
  input: Prisma.InputJsonValue;
  expectedOutput: Prisma.InputJsonValue;
  explanation?: string;
  isHidden?: boolean;
  orderIndex?: number;
};

export type UpdateTestCaseInput = {
  input?: Prisma.InputJsonValue;
  expectedOutput?: Prisma.InputJsonValue;
  explanation?: string | null;
  isHidden?: boolean;
  orderIndex?: number;
};

// Types pour les controllers
export type CreateTestCaseBody = {
  challengeId?: string;
  input?: Prisma.InputJsonValue;
  expectedOutput?: Prisma.InputJsonValue;
  expected?: Prisma.InputJsonValue;
  explanation?: string;
  isHidden?: boolean;
  orderIndex?: number;
};

export type UpdateTestCaseBody = {
  input?: Prisma.InputJsonValue;
  expectedOutput?: Prisma.InputJsonValue;
  expected?: Prisma.InputJsonValue;
  explanation?: string | null;
  isHidden?: boolean;
  orderIndex?: number;
};
