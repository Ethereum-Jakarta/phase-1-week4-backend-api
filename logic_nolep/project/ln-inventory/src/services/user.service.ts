import { RegisterUserDto, type RegisterUserRequest } from "@models/user.model";
import { prisma } from "@applications/prisma";
import { ResponseError } from "@errors/response.error";
import bcrypt from "bcrypt";

export class UserService {
  public static async registerUser(request: RegisterUserRequest) {
    const checkDuplicationUser = await prisma.user.count({
      where: {
        email: request.email,
      },
    });

    if (checkDuplicationUser !== 0) {
      throw new ResponseError(400, "Validation Error", {
        email: "email is already exist!",
      });
    }

    request.password = await bcrypt.hash(request.password, 10);

    const user = await prisma.user.create({
      data: request,
    });

    return new RegisterUserDto(user);
  }
}
