import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../generated/prisma/client";
import type { LoginInput, RegisterInput } from "../types/auth";

function generateToken(user: { id: string; email: string; role: UserRole }) {
  const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

  if (!jwtSecret) {
    throw new Error("JWT_SECRET manquant");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "7d" },
  );
}

export async function registerService(data: RegisterInput) {
  const username = data.username.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password;

  if (!username || !email || !password) {
    throw new Error("Tous les champs sont requis");
  }

  if (password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères");
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUserByEmail) {
    throw new Error("Email déjà utilisé");
  }

  const existingUserByUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUserByUsername) {
    throw new Error("Nom d'utilisateur déjà utilisé");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
}

export async function loginService(data: LoginInput) {
  const email = data.email.trim().toLowerCase();
  const password = data.password;

  if (!email || !password) {
    throw new Error("L'email et le mot de passe sont requis");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
}

export async function getMeService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  return user;
}
