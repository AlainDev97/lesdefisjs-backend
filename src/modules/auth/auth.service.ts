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
