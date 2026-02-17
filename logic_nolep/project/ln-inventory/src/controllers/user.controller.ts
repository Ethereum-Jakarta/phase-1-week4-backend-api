import type { Request, Response } from "express";
import { UserService } from "@services/user.service";
import { logger } from "@applications/logger";

export class UserController {
  public static async createUser(req: Request, res: Response) {
    const data = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "Create new user succes!",
      data: data,
    });
  }
  public static async updateUser(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const data = await UserService.updateUser(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Success update user Data!",
      data: data,
    });
  }
  public static async deleteUser(req: Request, res: Response) {
    const userId = req.params.userId as string;
    await UserService.deleteUser(userId);
    res.status(200).json({
      success: true,
      message: "Success delete user!",
    });
  }

  public static async getAllUser(req: Request, res: Response) {
    const page = Number(req.query.page);
    logger.debug(`incoming request with page = ${page}`);
    const data = await UserService.getAllUser(page);
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
    const data = await UserService.getUserById(userId);
    res.status(201).json({
      success: true,
      message: "User retrieved!",
      data: data,
    });
  }
}
