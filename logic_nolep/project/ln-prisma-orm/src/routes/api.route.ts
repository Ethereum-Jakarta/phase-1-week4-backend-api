import express from "express";
import { UserController } from "../controllers/user.controller";
import { TaskController } from "../controllers/task.controller";
import { CategoryController } from "../controllers/category.controller";

export const apiRouter = express.Router();

// User Routes
apiRouter.post("/todo/user/register", UserController.register);
apiRouter.patch("/todo/user/:userId", UserController.updateUser);
apiRouter.delete("/todo/user/:userId", UserController.deleteUser);

// Task Routes
apiRouter.post("/todo/:userId/task", TaskController.createTask);
apiRouter.patch(
  "/todo/:userId/task/:taskId/content",
  TaskController.updateTaskContent,
);
apiRouter.patch(
  "/todo/:userId/task/:taskId/status",
  TaskController.changeTaskStatus,
);
apiRouter.delete("/todo/:userId/task/:taskId", TaskController.moveToTrash);
apiRouter.get("/todo/:userId/tasks", TaskController.findAllTaskByUserId);
apiRouter.get(
  "/todo/:userId/task/categories/:categoryId",
  TaskController.findAllTaskByCategory,
);
apiRouter.get("/todo/:userId/trash", TaskController.findAllTrashByUserId);
apiRouter.patch("/todo/:userId/trash/:taskId", TaskController.restoreTask);
apiRouter.delete(
  "/todo/:userId/trash/:taskId",
  TaskController.deleteTaskPermanently,
);
apiRouter.delete("/todo/:userId/trash", TaskController.emptyTrash);

// Category Routes
apiRouter.post("/todo/:userId/category", CategoryController.createCategory);
apiRouter.patch(
  "/todo/:userId/category/:categoryId",
  CategoryController.updateCategory,
);
apiRouter.get(
  "/todo/:userId/categories",
  CategoryController.findAllCategoriesByUserId,
);
