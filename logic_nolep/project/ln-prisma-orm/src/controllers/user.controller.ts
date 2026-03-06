import type { Request, Response, NextFunction } from "express";
import type { createUserRequest } from "../models/user.model";
import { UserService } from "../services/user.service";

export class UserController {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request = req.body as createUserRequest;
      const response = await UserService.createUser(request);
      res.status(201).json({
        success: true,
        message: `Selamat datang ${response.name}, Kamu berhasil mendaftar!`,
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const response = await UserService.deleteUser(userId);
      res.status(201).json({
        success: true,
        message: `Selamat tinggal ${response.name}, Data kamu berhasil dihapus!`,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const request = req.body as createUserRequest;
      const response = await UserService.updateUser(userId, request);
      res.status(201).json({
        success: true,
        message: `Selamat ${response.name}, Data kamu berhasil diperbarui!`,
      });
    } catch (err) {
      next(err);
    }
  }
}
