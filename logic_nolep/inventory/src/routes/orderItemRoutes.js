const express = require('express');
const { createOrderItem, getAllOrderItems, getOrderItemById, updateOrderItem, deleteOrderItem } = require('../controllers/orderItemController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { orderItemValidation } = require('../validations');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('Admin'), validate(orderItemValidation.createOrderItem), createOrderItem);
router.get('/', authenticateToken, getAllOrderItems);
router.get('/:orderItemId', authenticateToken, validate(orderItemValidation.getOrderItem), getOrderItemById);
router.put('/:orderItemId', authenticateToken, authorizeRoles('Admin'), validate(orderItemValidation.updateOrderItem), updateOrderItem);
router.delete('/:orderItemId', authenticateToken, authorizeRoles('Admin'), validate(orderItemValidation.deleteOrderItem), deleteOrderItem);

module.exports = router;
