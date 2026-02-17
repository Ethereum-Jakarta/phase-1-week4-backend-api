import type { NextFunction, Request, Response } from "express";
import { prisma } from "@applications/prisma";
import { ResponseError } from "@errors/response.error";
import type { Role } from "@generated/prisma/enums";
import { logger } from "@applications/logger";

export function requireRole(role: Role) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user!;
    logger.debug(`incoming request id admin = ${id}`);
    const isAdmin = await prisma.user.findUnique({
      where: {
        id: id,
        role: role,
      },
    });
    if (!isAdmin) {
      throw new ResponseError(403, "Forbidden", {
        access: "You aren't have any access",
      });
    }

    next();
  };
}
