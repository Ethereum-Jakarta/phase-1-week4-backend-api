import type { Request, Response, NextFunction } from "express";
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
      next();
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
      req.user = { ...decoded!, token: refreshToken };
      next();
    } catch (err) {
      next();
    }
  }
}
