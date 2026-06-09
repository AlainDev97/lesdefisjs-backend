import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Le pseudo doit contenir au moins 3 caractères")
    .max(30, "Le pseudo ne peut pas dépasser 30 caractères"),

  email: z.string().trim().toLowerCase().email("Format d'email invalide"),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe est trop long"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format d'email invalide"),

  password: z.string().min(1, "Mot de passe requis"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
