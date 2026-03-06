import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../errors/response.error";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ResponseError) {
    res
      .status(err.code)
      .json({ success: false, message: err.message, errors: err.details });
  } else {
    res.status(500).json({ success: false, message: "Internal Server Error" });
    console.log(err);
  }
}
