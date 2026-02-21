import type { Request, Response } from "express";
import { prisma } from "@applications/prisma";
import { UserService } from "@services/user.service";

const User = new UserService(prisma);

export class UserController {
  public static async createUser(req: Request, res: Response) {
    const data = await User.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "Create new user succes!",
      data: data,
    });
  }
  public static async updateUser(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const data = await User.updateUser(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Success update user Data!",
      data: data,
    });
  }
  public static async deleteUser(req: Request, res: Response) {
    const userId = req.params.userId as string;
    await User.deleteUser(userId);
    res.status(200).json({
      success: true,
      message: "Success delete user!",
    });
  }

  public static async getAllUser(req: Request, res: Response) {
    const page = Number(req.query.page);
    const data = await User.getAllUser(page);
    res.status(201).json({
      success: true,
      message: "List users retrieved!",
      data: data.users,
      page: page,
      total_page: data.totalPage,
    });
  }

  public static async getUserById(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const data = await User.getUserById(userId);
    res.status(201).json({
      success: true,
      message: "User retrieved!",
      data: data,
    });
  }
}
