import { NextFunction, Request, Response, RequestHandler } from "express";

type Params = {
  id: string;
};

type AsyncHandler = (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const asyncHandler =
  <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
    fn: (
      req: Request<P, ResBody, ReqBody, ReqQuery>,
      res: Response<ResBody>,
      next: NextFunction,
    ) => Promise<void>,
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
