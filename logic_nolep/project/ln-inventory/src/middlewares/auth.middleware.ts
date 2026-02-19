import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "@models/auth.model";
import { JwtHelper } from "@utils/jwt.util";
import { ResponseError } from "@errors/response.error";

export class AuthMiddleware {
  public static authorizeAccess(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.split(" ")[1];
    if (!accessToken) {
      throw new ResponseError(401, "Unauthorized Acces", {
        token: "AccesToken is required!",
      });
    }
    try {
      const decoded = JwtHelper.verifyAccessToken(accessToken!);
      req.user = decoded!;
      next();
    } catch (err) {
      next(err);
    }
  }

  public static authorizeSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      throw new ResponseError(401, "Unauthorized Acces", {
        token: "RefreshToken is required!",
      });
    }
    try {
      const decoded = JwtHelper.verifyRefreshToken(refreshToken);
      const payload = {
        id: decoded!.id,
        name: decoded!.name,
        email: decoded!.email,
      } as JwtPayload;
      req.user = { ...payload, token: refreshToken };
      next();
    } catch (err) {
      next(err);
    }
  }
}
