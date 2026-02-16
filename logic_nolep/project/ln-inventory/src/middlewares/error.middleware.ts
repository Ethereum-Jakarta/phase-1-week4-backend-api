import { logger } from "@applications/logger";
import { Prisma } from "@generated/prisma/client";
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
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan atau sudah dihapus.",
      });
    }
    if (err.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Data sudah ada (duplikat).",
        target: err.meta?.target,
      });
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Format data yang dikirimkan tidak sesuai.",
    });
  }
  logger.error(err.message, err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
