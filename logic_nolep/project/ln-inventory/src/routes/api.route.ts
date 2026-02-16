import express from "express";
import { AuthController } from "@controllers/auth.controller";
import { UserController } from "@controllers/user.controller";
import { UserValidation } from "@validations/user.validation";
import { validator } from "@middlewares/validator.middleware";
import { catchPromise } from "@middlewares/catch-promise.middleware";
import { AuthMiddleware } from "@middlewares/auth.middleware";
import { requireRole } from "@middlewares/require-role.middleware";

export const apiRouter = express.Router();

apiRouter.post(
  "/api/auth/logout",
  AuthMiddleware.authorizeSession,
  // validation zod
  catchPromise(AuthController.logout),
);

apiRouter.post(
  "/api/users",
  AuthMiddleware.authorizeAccess,
  // validation zod
  requireRole("admin"),
  catchPromise(UserController.createUser),
);
