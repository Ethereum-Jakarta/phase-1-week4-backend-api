import express from "express";
import { AuthController } from "@controllers/auth.controller";
import { UserController } from "@controllers/user.controller";
import { UserValidation } from "@validations/user.validation";
import { validator } from "@middlewares/validator.middleware";
import { catchPromise } from "@middlewares/catch-promise.middleware";
import { AuthMiddleware } from "@middlewares/auth.middleware";
import { requireRole } from "@middlewares/require-role.middleware";

export const apiRouter = express.Router();

//AUTH API
apiRouter.post(
  "/api/auth/logout",
  AuthMiddleware.authorizeSession,
  catchPromise(AuthController.logout),
);
apiRouter.post(
  "/api/auth/refresh",
  AuthMiddleware.authorizeSession,
  catchPromise(AuthController.refresh),
);

//USER API (ADMIN ONLY)
apiRouter.post(
  "/api/users",
  AuthMiddleware.authorizeAccess,
  validator(UserValidation.REGISTER),
  requireRole("admin"),
  catchPromise(UserController.createUser),
);
apiRouter.get(
  "/api/users",
  AuthMiddleware.authorizeAccess,
  requireRole("admin"),
  catchPromise(UserController.getAllUser),
);
apiRouter.get(
  "/api/users/:userId",
  AuthMiddleware.authorizeAccess,
  requireRole("admin"),
  catchPromise(UserController.getUserById),
);
apiRouter.put(
  "/api/users/:userId",
  AuthMiddleware.authorizeAccess,
  validator(UserValidation.UPDATE),
  requireRole("admin"),
  catchPromise(UserController.updateUser),
);
apiRouter.delete(
  "/api/users/:userId",
  AuthMiddleware.authorizeAccess,
  requireRole("admin"),
  catchPromise(UserController.deleteUser),
);
