import type { NextFunction, Request, Response } from "express";
import { prisma } from "@applications/prisma";
import { ResponseError } from "@errors/response.error";
import type { Role } from "@generated/prisma/enums";

export function requireRole(role: Role) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user!;
    const isAdmin = await prisma.user.count({
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
