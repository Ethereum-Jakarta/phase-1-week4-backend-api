import {
  LoginDto,
  RegisterUserDto,
  type LoginRequest,
  type RegisterUserRequest,
} from "@models/user.model";
import type { User } from "@generated/prisma/client";
import type { JwtPayload, RequestUser } from "@models/auth.model";
import type { PrismaClient } from "@generated/prisma/client";
import { ResponseError } from "@errors/response.error";
import { JwtHelper } from "@utils/jwt.util";
import { generatedExpDate } from "@utils/date.util";
import bcrypt from "bcrypt";

export class AuthService {
  constructor(private prisma: PrismaClient) {}
  private async validateCredential(request: LoginRequest): Promise<User> {
    const user = await this.prisma.user.findUnique({
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

  public async registerUser(request: RegisterUserRequest) {
    request.password = await bcrypt.hash(request.password, 10);
    const user = await this.prisma.user.create({
      data: request,
    });

    return new RegisterUserDto(user);
  }

  public async login(request: LoginRequest) {
    const user = await this.validateCredential(request);
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email!,
    } as JwtPayload;

    const refreshToken = JwtHelper.createRefreshToken(payload);
    const accessToken = JwtHelper.createAccessToken(payload);

    await this.prisma.token.create({
      data: {
        token: refreshToken,
        type: "refresh",
        expires: generatedExpDate(2),
        userId: user.id,
      },
    });

    return new LoginDto(user, accessToken, refreshToken);
  }

  public async logout(UserId: string, token: string) {
    await this.prisma.token.update({
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
  public async refresh(user: RequestUser) {
    const payload = { id: user.id, name: user.name, email: user.email };
    const IsTokenValid = await this.prisma.token.findFirst({
      where: {
        token: user.token!,
        blacklisted: false,
      },
    });
    if (!IsTokenValid) {
      throw new ResponseError(401, "Unauthorized", {
        token: "Refresh token is invalid or removed, please login again!",
      });
    }
    const accessToken = JwtHelper.createAccessToken(payload);
    return { token: accessToken };
  }
}
