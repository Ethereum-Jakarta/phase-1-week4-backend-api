import type { NextFunction, Request, Response } from "express";
import type { RequestHandler } from "express";

export function catchPromise(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
