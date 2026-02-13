import { Router } from "express";
import TodoController from "../controllers/todo.controller.js";

const router = Router();

router
    .route("/todos")
    .post(TodoController.create)
    .get(TodoController.show)

router.put("/todos/:id", TodoController.update)
router.delete("/todos/:id", TodoController.delete)
router.get("/todos/:id", TodoController.find)



export default router;