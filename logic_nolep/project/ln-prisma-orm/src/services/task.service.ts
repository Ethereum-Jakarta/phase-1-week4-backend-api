import { prisma } from "../application/prisma";
import {
  type createTaskRequest,
  type changeTaskContentRequest,
  findAllTaskByUserIdResponse,
  findAllTaskByCategoryResponse,
  toTaskResponse,
  toTrashResponse,
} from "../models/task.model";
import { TaskValidation } from "../validations/task.validation";
import { validate } from "../validations/validation";
import { Status } from "../../generated/prisma/enums";
import { ResponseError } from "../errors/response.error";

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export class TaskService {
  // HELPER GENERICS UNTUK CEK TASK ADA ATAU TIDAK
  private static async checkTaskIfExist<K>(clause: Record<string, K>) {
    return await prisma.task.count({
      where: clause,
    });
  }
  // HELPER UNTUK CEK USER ADA ATAU TIDAK
  private static async checkIfUserExist(userId: number) {
    return await prisma.user.count({
      where: {
        id: userId,
      },
    });
  }

  public static async addTask(userId: number, request: createTaskRequest) {
    const createTaskRequest = validate(TaskValidation.CREATE_TASK, request);
    const task = await prisma.task.create({
      data: {
        title: createTaskRequest.title,
        description: createTaskRequest.description ?? null,
        status: createTaskRequest.status,
        expiredAt: null,
        userId: userId,
      },
    });
    return toTaskResponse(task);
  }

  public static async updateTaskContent(
    userId: number,
    taskId: number,
    request: changeTaskContentRequest,
  ) {
    const updateTaskRequest = validate(
      TaskValidation.UPDATE_TASK_CONTENT,
      request,
    );

    const isTaskExist = await this.checkTaskIfExist<number>({
      id: taskId,
      userId: userId,
    });

    if (!isTaskExist) {
      throw new ResponseError(404, "Not Found", {
        id: `task tidak ditemukan, pastikan anda sudah membuat task terlebih dahulu!`,
      });
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
        userId: userId,
      },
      data: updateTaskRequest,
    });

    return toTaskResponse(task);
  }

  public static async changeTaskStatus(
    userId: number,
    taskId: number,
    request: { status: Status },
  ) {
    const changeTaskStatusRequest = validate(
      TaskValidation.CHANGE_STATUS,
      request,
    );
    const isTaskExist = await this.checkTaskIfExist<number>({
      id: taskId,
      userId: userId,
    });

    if (!isTaskExist) {
      throw new ResponseError(404, "Not Found", {
        id: `task tidak ditemukan, pastikan anda sudah membuat task terlebih dahulu!`,
      });
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
        userId: userId,
      },
      data: { status: changeTaskStatusRequest.status },
    });

    return toTaskResponse(task);
  }

  public static async moveToTrash(userId: number, taskId: number) {
    const isTaskExist = await this.checkTaskIfExist<number>({
      id: taskId,
      userId: userId,
    });

    if (!isTaskExist) {
      throw new ResponseError(404, "Not Found", {
        id: `task tidak ditemukan, pastikan anda sudah membuat task terlebih dahulu!`,
      });
    }

    await prisma.task.update({
      where: {
        id: taskId,
        userId: userId,
      },
      data: { status: "REMOVE", expiredAt: new Date(Date.now() + THIRTY_DAYS) },
    });

    return "Task berhasil dipindahkan ke trash!";
  }

  public static async restoreTask(userId: number, taskId: number) {
    const isTaskExist = await this.checkTaskIfExist<number | string>({
      id: taskId,
      userId: userId,
      status: "REMOVE",
    });

    if (!isTaskExist) {
      throw new ResponseError(404, "Not Found", {
        id: `task tidak ditemukan, pastikan task sudah dihapus dan masuk kedalam trash!`,
      });
    }

    await prisma.task.update({
      where: {
        id: taskId,
        userId: userId,
      },
      data: { status: "ACTIVE", expiredAt: null },
    });

    return "Task berhasil dipulihkan!";
  }

  public static async findAllTaskByUserId(userId: number) {
    const isUserExist = await this.checkIfUserExist(userId);
    if (!isUserExist) {
      throw new ResponseError(404, "Not Found", {
        userId: `user dengan id: ${userId} belum terdaftar!`,
      });
    }
    const allTask = await prisma.task.findMany({
      where: {
        userId: userId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        title: true,
        status: true,
        description: true,
        categories: {
          select: {
            category: {
              select: {
                categoryName: true,
              },
            },
          },
        },
      },
    });

    return allTask.map((task) => findAllTaskByUserIdResponse(task));
  }

  public static async findAllTaskByCategory(
    userId: number,
    categoryId: number,
  ) {
    const isUserExist = await this.checkIfUserExist(userId);
    if (!isUserExist) {
      throw new ResponseError(404, "Not Found", {
        userId: `user dengan id: ${userId} belum terdaftar!`,
      });
    }
    const task = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        categoryName: true,
        tasks: {
          where: {
            task: {
              status: "ACTIVE",
            },
          },
          select: {
            task: {
              select: {
                id: true,
                title: true,
                status: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new ResponseError(404, "Not Found", {
        categoryId: "Category tidak ditemukan atau belum terdaftar",
      });
    }
    return findAllTaskByCategoryResponse(task);
  }

  public static async findAllTrashByUserId(userId: number) {
    const isUserExist = await this.checkIfUserExist(userId);
    if (!isUserExist) {
      throw new ResponseError(404, "Not Found", {
        userId: `user dengan id: ${userId} belum terdaftar!`,
      });
    }
    const allTrash = await prisma.task.findMany({
      where: {
        userId: userId,
        status: "REMOVE",
      },
    });

    return allTrash.map((task) => toTrashResponse(task));
  }

  public static async deleteAllTrash() {
    await prisma.task.deleteMany({
      where: {
        status: "REMOVE",
      },
    });
    return "Berhasil menghapus semua task";
  }

  public static async deleteTrash(userId: number, taskId: number) {
    const isTaskExist = await this.checkTaskIfExist<number | string>({
      id: taskId,
      userId: userId,
      status: "REMOVE",
    });

    if (!isTaskExist) {
      throw new ResponseError(404, "Not Found", {
        id: `task tidak ditemukan, pastikan task sudah dihapus dan masuk kedalam trash!`,
      });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
        userId: userId,
        status: "REMOVE",
      },
    });

    return "Task di trash berhasil dihapus secara permanen!";
  }
}
