import { Router } from "express";
import UsersController from "../controllers/user.controller.js";

const router = Router();

router
    .route("/users")
    .post(UsersController.create)
    .get(UsersController.show)

router.put("/users/:id", UsersController.update)
router.delete("/users/:id", UsersController.delete)
router.get("/users/:id", UsersController.find)


export default router;