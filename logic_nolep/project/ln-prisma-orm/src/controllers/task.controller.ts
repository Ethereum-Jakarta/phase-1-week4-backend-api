import type { Request, Response, NextFunction } from "express";
import type {
  createTaskRequest,
  changeTaskContentRequest,
} from "../models/task.model";
import { TaskService } from "../services/task.service";
import type { Status } from "../../generated/prisma/enums";

export class TaskController {
  public static async createTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const createTaskRequest = req.body as createTaskRequest;
      const userId = Number(req.params.userId);
      const response = await TaskService.addTask(userId, createTaskRequest);
      res.status(201).json({
        succes: true,
        message: "Berhasil menambahkan task",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async updateTaskContent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const updateTaskRequest = req.body as changeTaskContentRequest;
      const userId = Number(req.params.userId);
      const taskId = Number(req.params.taskId);
      const response = await TaskService.updateTaskContent(
        userId,
        taskId,
        updateTaskRequest,
      );
      res.status(201).json({
        succes: true,
        message: "Berhasil memperbarui content task",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async moveToTrash(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const taskId = Number(req.params.taskId);
      const response = await TaskService.moveToTrash(userId, taskId);
      res.status(201).json({
        succes: true,
        message: "Berhasil menghapus task",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async changeTaskStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const taskId = Number(req.params.taskId);
      const request = req.body as { status: Status };
      const response = await TaskService.changeTaskStatus(
        userId,
        taskId,
        request,
      );
      res.status(201).json({
        succes: true,
        message: "Berhasil memperbarui status task",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async restoreTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const taskId = Number(req.params.taskId);
      const response = await TaskService.restoreTask(userId, taskId);
      res.status(201).json({
        succes: true,
        message: "Berhasil mengembalikan task dari tempat sampah",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async findAllTaskByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const response = await TaskService.findAllTaskByUserId(userId);
      res.status(200).json({
        succes: true,
        message: "Berhasil mengambil semua task berdasarkan userId",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async findAllTaskByCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const categoryId = Number(req.params.categoryId);
      const response = await TaskService.findAllTaskByCategory(
        userId,
        categoryId,
      );
      res.status(200).json({
        succes: true,
        message: "Berhasil mengambil semua task berdasarkan category",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async findAllTrashByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const response = await TaskService.findAllTrashByUserId(userId);
      res.status(200).json({
        succes: true,
        message: "Berhasil mengambil semua task di trash berdasarkan userId",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async deleteTaskPermanently(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const taskId = Number(req.params.taskId);
      const response = await TaskService.deleteTrash(userId, taskId);
      res.status(200).json({
        succes: true,
        message: "Berhasil menghapus task secara permanen",
      });
    } catch (err) {
      next(err);
    }
  }
  public static async emptyTrash(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await TaskService.deleteAllTrash();
      res.status(200).json({
        succes: true,
        message: "Berhasil menghapus semua task di trash secara permanen",
      });
    } catch (err) {
      next(err);
    }
  }
}
