import type { Request, Response } from "express";
import { AuthService } from "@services/auth.service";

export class AuthController {
  public static async register(req: Request, res: Response) {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({
      succes: true,
      message: "Register new user succesfully",
      data: user,
    });
  }
  public static async login(req: Request, res: Response) {
    const user = await AuthService.login(req.body);
    const { refreshToken, ...data } = user;
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 48 * 60 * 60 * 1000,
    });
    res.status(200).json({
      succes: true,
      message: "Login succes",
      data: data,
    });
  }
  public static async logout(req: Request, res: Response) {
    const { id, token } = req.user!;
    const logout = await AuthService.logout(id, token!);
    res.status(200).json({
      succes: true,
      message: logout.message,
    });
  }
  public static async refresh(req: Request, res: Response) {
    const newRefreshToken = await AuthService.refresh(req.user!);
    res.status(200).json({
      succes: true,
      message: "Succes generate new acces token!",
      data: newRefreshToken,
    });
  }
}
