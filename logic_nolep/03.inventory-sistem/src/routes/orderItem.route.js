import { Router } from 'express';
import OrderItemController from '../controllers/orderItem.controller.js';

const router = Router();

router.route('/order-items').post(OrderItemController.createOrderItem).get(OrderItemController.getAllOrderItems);

router.put('/order-items/:id', OrderItemController.updateOrderItem);
router.delete('/order-items/:id', OrderItemController.hardDeleteOrderItem);
router.get('/order-items/:id', OrderItemController.findOrderItemByID);
router.get('/orders/:orderId/order-items', OrderItemController.findOrderItemByOrder);

export default router;
