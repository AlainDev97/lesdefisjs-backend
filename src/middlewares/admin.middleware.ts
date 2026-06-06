import { NextFunction, Response } from "express";
import { UserRole } from "@prisma/client";
import { AuthenticatedRequest } from "./auth.middleware";

export function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Non authentifié",
    });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({
      message: "Accès refusé",
    });
  }

  next();
}
