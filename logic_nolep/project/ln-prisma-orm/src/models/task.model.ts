import type { Task, Status } from "../../generated/prisma/client";
import { Prisma } from "../../generated/prisma/client";

export type TaskResponse = {
  taskId: number;
  title: string;
  description?: string;
  status: Status;
};

export type createTaskRequest = {
  title: string;
  description?: string;
  status: Status;
};

export type changeTaskContentRequest = {
  title: string;
  description?: string;
};

export type FindAllTaskResponse = {
  id: number;
  title: string;
  status: "ACTIVE" | "DONE" | "REMOVE";
  description: string | null;
  category: string[];
};

export type FindAllTrashResponse = {
  id: number;
  title: string;
  status: Status;
  description: string | null;
  category: string[];
};

export type TaskInCategoryDTO = {
  id: number;
  title: string;
  status: "ACTIVE" | "DONE" | "REMOVE";
  description: string | null;
};

export type CategoryWithTasksDTO = {
  category_name: string;
  tasks: TaskInCategoryDTO[];
};

type TaskWithCategories = Prisma.TaskGetPayload<{
  select: {
    id: true;
    title: true;
    status: true;
    description: true;
    categories: {
      select: {
        category: {
          select: {
            categoryName: true;
          };
        };
      };
    };
  };
}>;

type CategoryWithTasks = Prisma.CategoryGetPayload<{
  select: {
    categoryName: true;
    tasks: {
      select: {
        task: {
          select: {
            id: true;
            title: true;
            status: true;
            description: true;
          };
        };
      };
    };
  };
}>;

export function toTaskResponse(task: Task) {
  return {
    taskId: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
  };
}
export function toTrashResponse(task: Task) {
  return {
    taskId: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    expiredAt: task.expiredAt,
  };
}

export function findAllTaskByUserIdResponse(
  task: TaskWithCategories,
): FindAllTaskResponse {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    description: task.description,
    category: task.categories.map((c) => c.category.categoryName),
  };
}

export function findAllTaskByCategoryResponse(
  category: CategoryWithTasks,
): CategoryWithTasksDTO {
  return {
    category_name: category.categoryName,
    tasks: category.tasks.map((t) => ({
      id: t.task.id,
      title: t.task.title,
      status: t.task.status,
      description: t.task.description,
    })),
  };
}
