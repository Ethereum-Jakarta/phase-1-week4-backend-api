import jwt, { type SignOptions } from "jsonwebtoken";

interface JwtPayload {
  id: string;
  name: string;
  email: string;
}

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

  public static verifyAccessToken(token: string): JwtPayload {
    const secret = this.ensureSecret(this.ACCESS_SECRET);
    return jwt.verify(token, secret) as JwtPayload;
  }

  public static verifyRefreshToken(token: string): JwtPayload {
    const secret = this.ensureSecret(this.REFRESH_SECRET);
    return jwt.verify(token, secret) as JwtPayload;
  }
}
