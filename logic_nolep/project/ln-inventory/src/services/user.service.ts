import {
  RegisterUserDto,
  SelectUserDto,
  UpdateUserDto,
  type RegisterUserRequest,
  type UpdateUserRequest,
} from "@models/user.model";
import { prisma } from "@applications/prisma";
import bcrypt from "bcrypt";
import { ResponseError } from "@errors/response.error";
import { logger } from "@applications/logger";

export class UserService {
  public static async createUser(request: RegisterUserRequest) {
    request.password = await bcrypt.hash(request.password, 10);

    const user = await prisma.user.create({
      data: request,
    });

    return new RegisterUserDto(user);
  }

  public static async updateUser(userId: string, request: UpdateUserRequest) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: request,
    });

    return new UpdateUserDto(user);
  }

  public static async deleteUser(userId: string) {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  public static async getAllUser(page: number) {
    logger.debug("incoming request");
    const limit = 20;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: "asc",
        },
      }),
      prisma.user.count(),
    ]);
    const data = users.map((user) => new SelectUserDto(user));
    return { users: data, totalPage: total >= limit ? total / limit : 1 };
  }

  public static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user)
      throw new ResponseError(404, "Not Foud", {
        id: `user with id:${userId} is not found`,
      });
    return new SelectUserDto(user);
  }
}
