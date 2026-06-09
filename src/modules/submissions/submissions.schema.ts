import { z } from "zod";

export const createSubmissionSchema = z.object({
  challengeId: z.string().uuid("challengeId invalide"),

  sourceCode: z
    .string()
    .trim()
    .min(1, "Le code source est requis")
    .max(20_000, "Le code source ne peut pas dépasser 20 000 caractères"),

  language: z.enum(["javascript"]),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
