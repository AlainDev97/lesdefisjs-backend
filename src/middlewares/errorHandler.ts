import { NextFunction, Request, Response } from "express";

type AppError = Error & {
  status?: number;
};

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
  });
}
