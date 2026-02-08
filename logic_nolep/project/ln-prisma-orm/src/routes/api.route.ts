import express from "express";
import { UserController } from "../controllers/user.controller";
import { TaskController } from "../controllers/task.controller";

export const apiRouter = express.Router();

apiRouter.post("/todo/user/register", UserController.register);
apiRouter.patch("/todo/user/:userId", UserController.updateUser);
apiRouter.delete("/todo/user/:userId", UserController.deleteUser);

apiRouter.post("/todo/user/:userId/task", TaskController.createTask);
apiRouter.patch(
  "/todo/user/:userId/task/:taskId/content",
  TaskController.updateTaskContent,
);
apiRouter.patch(
  "/todo/user/:userId/task/:taskId/status",
  TaskController.changeTaskStatus,
);
apiRouter.delete("/todo/user/:userId/task/:taskId", TaskController.moveToTrash);
