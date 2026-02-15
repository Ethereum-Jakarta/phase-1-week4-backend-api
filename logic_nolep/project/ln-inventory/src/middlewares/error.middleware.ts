import { logger } from "@applications/logger";
import { ResponseError } from "@errors/response.error";
import type { NextFunction, Request, Response } from "express";

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ResponseError) {
    logger.warn(`Client Error: ${err.message}`, {
      statusCode: err.statusCode,
      details: err.details,
    });
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details,
    });
  } else {
    logger.error(err.message, err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
