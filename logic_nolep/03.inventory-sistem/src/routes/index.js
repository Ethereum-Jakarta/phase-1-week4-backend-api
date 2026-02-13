import { Router } from 'express';
import useUserRoutes from './user.route.js';
import useProductRoutes from './product.route.js';
import useCategoryRoutes from './category.route.js';
import useOrderRoutes from './order.route.js';
import useOrderItemRoutes from './orderItem.route.js';

const router = Router();

router.use(useUserRoutes);
router.use(useProductRoutes);
router.use(useCategoryRoutes);
router.use(useOrderRoutes);
router.use(useOrderItemRoutes);

export default router;
