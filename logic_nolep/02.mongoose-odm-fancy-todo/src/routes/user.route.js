import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const router = Router()

router
    .route("/user")
    .post(UserController.create)
    .get(UserController.show)

router.put("/user/:id", UserController.update);
router.delete("/user/:id", UserController.delete);
router.get("/user/:id", UserController.find);



export default router;