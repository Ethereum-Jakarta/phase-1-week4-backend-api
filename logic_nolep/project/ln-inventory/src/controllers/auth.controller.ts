import type { Request, Response } from "express";
import { prisma } from "@applications/prisma";
import { AuthService } from "@services/auth.service";

const Auth = new AuthService(prisma);

export class AuthController {
  public static async register(req: Request, res: Response) {
    const user = await Auth.registerUser(req.body);
    res.status(201).json({
      succes: true,
      message: "Register new user succesfully",
      data: user,
    });
  }
  public static async login(req: Request, res: Response) {
    const user = await Auth.login(req.body);
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
    const logout = await Auth.logout(id, token!);
    res.status(200).json({
      succes: true,
      message: logout.message,
    });
  }
  public static async refresh(req: Request, res: Response) {
    const newRefreshToken = await Auth.refresh(req.user!);
    res.status(200).json({
      succes: true,
      message: "Succes generate new acces token!",
      data: newRefreshToken,
    });
  }
}
