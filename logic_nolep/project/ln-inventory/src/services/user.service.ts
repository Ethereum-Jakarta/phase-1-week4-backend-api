import {
  RegisterUserDto,
  SelectUserDto,
  UpdateUserDto,
  type RegisterUserRequest,
  type UpdateUserRequest,
} from "@models/user.model";
import bcrypt from "bcrypt";
import { ResponseError } from "@errors/response.error";
import type { PrismaClient } from "@generated/prisma/client";

export class UserService {
  constructor(private prisma: PrismaClient) {}
  public async createUser(request: RegisterUserRequest) {
    request.password = await bcrypt.hash(request.password, 10);

    const user = await this.prisma.user.create({
      data: request,
    });

    return new RegisterUserDto(user);
  }

  public async updateUser(userId: string, request: UpdateUserRequest) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: request,
    });

    return new UpdateUserDto(user);
  }

  public async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  public async getAllUser(page: number = 1, limit: number = 20) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: "asc",
        },
      }),
      this.prisma.user.count(),
    ]);
    const data = users.map((user) => new SelectUserDto(user));
    return {
      users: data,
      totalPage: total >= limit ? Math.round(total / limit) : 1,
    };
  }

  public async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
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
