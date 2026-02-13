import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';

const router = Router();

router.route('/orders').post(OrderController.createOrder).get(OrderController.getAllOrders);

router.put('/orders/:id', OrderController.updateOrder);
router.delete('/orders/:id', OrderController.hardDeleteOrder);
router.get('/orders/:id', OrderController.findOrderByID);
router.get('/users/:userId/orders', OrderController.findOrderByUser);
router.patch('/orders/:id', OrderController.softDeleteOrder);

export default router;
