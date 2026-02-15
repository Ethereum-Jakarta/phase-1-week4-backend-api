import express from "express";
import { AuthController } from "@controllers/auth.controller";
import { UserValidation } from "@validations/user.validation";
import { validator } from "@middlewares/validator.middleware";
import { catchPromise } from "@middlewares/catchPromise.middleware";

export const publicRouter = express.Router();

publicRouter.post(
  "/api/auth/register",
  validator(UserValidation.REGISTER),
  catchPromise(AuthController.register),
);
publicRouter.post(
  "/api/auth/login",
  validator(UserValidation.LOGIN),
  catchPromise(AuthController.login),
);
