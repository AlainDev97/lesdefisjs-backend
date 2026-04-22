import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/client";

type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
};

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token manquant ou invalide",
      });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "JWT_SECRET manquant",
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Token invalide ou expiré",
    });
  }
}
