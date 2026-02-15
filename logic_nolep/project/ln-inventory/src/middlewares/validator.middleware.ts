import type { Request, Response, NextFunction } from "express";
import { validateRequest } from "@validations/validation";
import { ZodType } from "zod";

export function validator<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const sanitaizedRequest = validateRequest(schema, req.body);
    req.body = sanitaizedRequest;
    next();
  };
}
