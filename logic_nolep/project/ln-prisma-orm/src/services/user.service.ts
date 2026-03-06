import { prisma } from "../application/prisma";
import {
  toUserResponse,
  type createUserRequest,
  type updateUserRequest,
  type UserResponse,
} from "../models/user.model";
import { UserValidation } from "../validations/user.validation";
import { validate } from "../validations/validation";
import { ResponseError } from "../errors/response.error";

export class UserService {
  private static async checkUserIfExist<K>(key: string, value: K) {
    return await prisma.user.count({
      where: {
        [key]: value,
      },
    });
  }

  public static async createUser(
    request: createUserRequest,
  ): Promise<UserResponse> {
    const registerRequest = validate(UserValidation.REGISTER, request);
    const totalUserWithSameName = await this.checkUserIfExist<string>(
      "name",
      request.name,
    );

    if (totalUserWithSameName !== 0) {
      throw new ResponseError(400, "Validation Error", {
        nama: "nama sudah digunakan",
      });
    }

    const user = await prisma.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }

  public static async updateUser(userId: number, request: updateUserRequest) {
    const updateUserRequest = validate(UserValidation.UPDATE, request);
    const isUserExist = await this.checkUserIfExist<number>("id", userId);
    if (!isUserExist) {
      throw new ResponseError(404, "Not Found", {
        id: `user dengan id: ${userId} tidak ditemukan`,
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserRequest,
    });

    return toUserResponse(user);
  }
  public static async deleteUser(userId: number) {
    const isUserExist = await this.checkUserIfExist<number>("id", userId);
    if (!isUserExist) {
      throw new ResponseError(404, "Not Found", {
        id: `user dengan id: ${userId} tidak ditemukan`,
      });
    }

    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return toUserResponse(user);
  }
}
