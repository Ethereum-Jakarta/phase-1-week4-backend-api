import { Router } from "express";
import useUserRoutes from "./user.route.js";
import useTodoRoutes from "./todo.route.js";

const router = Router();

router.use(useUserRoutes);
router.use(useTodoRoutes);


export default router;