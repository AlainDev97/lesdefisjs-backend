import { NextFunction, Request, Response } from "express";

type Params = {
  id: string;
};

type AsyncHandler = (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const asyncHandler =
  (fn: AsyncHandler) =>
  (req: Request<Params>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
