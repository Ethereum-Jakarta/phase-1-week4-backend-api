import {
  LoginDto,
  RegisterUserDto,
  type LoginRequest,
  type RegisterUserRequest,
} from "@models/user.model";
import type { User } from "@generated/prisma/client";
import { prisma } from "@applications/prisma";
import { ResponseError } from "@errors/response.error";
import { JwtHelper } from "@utils/jwt.util";
import { generatedExpDate } from "@utils/date.util";
import bcrypt from "bcrypt";

export class AuthService {
  private static async validateCredential(
    request: LoginRequest,
  ): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email: request.email,
      },
    });

    const isValid =
      user && (await bcrypt.compare(request.password, user.password));

    if (!isValid) {
      throw new ResponseError(401, "Invalid Credential", {
        email: "Username or password is wrong!",
      });
    }

    return user;
  }

  public static async registerUser(request: RegisterUserRequest) {
    request.password = await bcrypt.hash(request.password, 10);
    const user = await prisma.user.create({
      data: request,
    });

    return new RegisterUserDto(user);
  }

  public static async login(request: LoginRequest) {
    const user = await this.validateCredential(request);
    const payload = { id: user.id, name: user.name, email: user.email! };

    const refreshToken = JwtHelper.createRefreshToken(payload);
    const accessToken = JwtHelper.createAccessToken(payload);

    await prisma.token.create({
      data: {
        token: refreshToken,
        type: "refresh",
        expires: generatedExpDate(2),
        userId: user.id,
      },
    });

    return new LoginDto(user, accessToken, refreshToken);
  }

  public static async logout(UserId: string, token: string) {
    await prisma.token.update({
      where: {
        userId: UserId,
        blacklisted: false,
        token: token,
      },
      data: {
        blacklisted: true,
      },
    });
    return { message: "Logout succes" };
  }
}
