export type CreateChallengeInput = {
  title: string;
  description: string;
  instructions: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  functionName: string;
  starterCode?: string;
  solutionCode?: string;
  returnType?: string;
  parameters?: unknown;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  orderIndex?: number;
  categoryId: string;
};