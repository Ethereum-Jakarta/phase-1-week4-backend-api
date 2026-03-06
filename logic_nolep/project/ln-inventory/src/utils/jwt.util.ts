import { ResponseError } from "@errors/response.error";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { JwtPayload } from "@models/auth.model";
import { logger } from "@applications/logger";

export class JwtHelper {
  private static ACCESS_SECRET = process.env.ACCESS_SECRET_KEY;
  private static REFRESH_SECRET = process.env.REFRESH_SECRET_KEY;

  private static ensureSecret(secret: string | undefined): string {
    if (!secret) {
      throw new Error("JWT secret is not defined in environment variables");
    }
    return secret;
  }

  public static createAccessToken(payload: JwtPayload): string {
    const secret = this.ensureSecret(this.ACCESS_SECRET);

    const options: SignOptions = {
      expiresIn: "10m",
    };

    return jwt.sign(payload, secret, options);
  }

  public static createRefreshToken(payload: JwtPayload): string {
    const secret = this.ensureSecret(this.REFRESH_SECRET);

    const options: SignOptions = {
      expiresIn: "2d",
    };

    return jwt.sign(payload, secret, options);
  }

  public static verifyAccessToken(token: string): JwtPayload | void {
    const secret = this.ensureSecret(this.ACCESS_SECRET);
    return jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          logger.debug("TOKEN SUDAH EXPIRED");
          throw new ResponseError(401, "Unauthorized", {
            token: "Acess token is expired!",
          });
        }
        if (err.name === "JsonWebTokenError") {
          throw new ResponseError(403, "Forbidden", {
            token: "Invalid acess token!",
          });
        }
      }
      return decoded as JwtPayload;
    });
  }

  public static verifyRefreshToken(token: string): JwtPayload | void {
    const secret = this.ensureSecret(this.REFRESH_SECRET);
    return jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new ResponseError(401, "Unauthorized", {
            token: "Refresh token is expired, please login again!",
          });
        }
        if (err.name === "JsonWebTokenError") {
          throw new ResponseError(403, "Forbidden", {
            token: "Invalid refresh token!",
          });
        }
      }
      return decoded as JwtPayload;
    });
  }
}
