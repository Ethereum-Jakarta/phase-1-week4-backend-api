const express = require('express');
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { orderValidation } = require('../validations');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('Admin'), validate(orderValidation.createOrder), createOrder);
router.get('/', authenticateToken, getAllOrders);
router.get('/:orderId', authenticateToken, validate(orderValidation.getOrder), getOrderById);
router.put('/:orderId', authenticateToken, authorizeRoles('Admin'), validate(orderValidation.updateOrder), updateOrder);
router.delete('/:orderId', authenticateToken, authorizeRoles('Admin'), validate(orderValidation.deleteOrder), deleteOrder);

module.exports = router;
