import express from "express";
import { AuthController } from "@controllers/auth.controller";
import { UserValidation } from "@validations/user.validation";
import { validator } from "@middlewares/validator.middleware";
import { catchPromise } from "@middlewares/catchPromise.middleware";
import { AuthMiddleware } from "@middlewares/auth.middleware";

export const apiRouter = express.Router();

apiRouter.post(
  "/api/auth/logout",
  AuthMiddleware.authorizeSession,
  catchPromise(AuthController.logout),
);
