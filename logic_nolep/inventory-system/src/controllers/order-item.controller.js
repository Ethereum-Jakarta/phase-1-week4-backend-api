const orderItemService = require('../services/order-item.service');
const { orderItemValidationSchema } = require('../validations/order-item.validation');
const handleResponse = require('../utils/responseHandler');
const catchAsync = require('../utils/catchAsync');

const getOrderItems = catchAsync(async (req, res) => {
  const orderItems = await orderItemService.getOrderItems();

  if (!orderItems) {
    return handleResponse(res, 404, 'OrderItems not found.');
  }

  handleResponse(res, 200, 'Success get OrderItems!', orderItems);
});

const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItem(req.params.id);

  if (!orderItem) {
    return handleResponse(res, 404, 'OrderItem not found.');
  }

  handleResponse(res, 200, 'Success get OrderItem!', orderItem);
});

const createOrderItem = catchAsync(async (req, res) => {
  const { orderId, productId, quantity, unitPrice } = req.body;
  const { error } = orderItemValidationSchema.validate(req.body);

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const createdOrderItem = await orderItemService.createOrderItem({
    orderId,
    productId,
    quantity,
    unitPrice,
  });

  handleResponse(res, 201, 'Success create OrderItem!', createdOrderItem);
});

const updateOrderItem = catchAsync(async (req, res) => {
  const orderItemId = req.params.id;
  const { orderId, productId, quantity, unitPrice } = req.body;
  const { error } = orderItemValidationSchema.validate(req.body);
  const existingOrderItem = await orderItemService.getOrderItem(orderItemId);

  if (!existingOrderItem) {
    return handleResponse(res, 404, 'OrderItem not found.');
  }

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const updatedOrderItem = await orderItemService.updateOrderItem(orderItemId, {
    orderId,
    productId,
    quantity,
    unitPrice,
  });

  handleResponse(res, 200, 'Success update OrderItem!', updatedOrderItem);
});

const deleteOrderItem = catchAsync(async (req, res) => {
  const deletedOrderItem = await orderItemService.deleteOrderItem(req.params.id);

  if (!deletedOrderItem) {
    return handleResponse(res, 404, 'OrderItem not found.');
  }

  handleResponse(res, 200, 'Success delete OrderItem!', deletedOrderItem);
});

const getOrderItemsByOrderId = catchAsync(async (req, res) => {
  const orderItems = await orderItemService.getOrderItemsByOrderId(req.params.orderId);

  if (orderItems.length === 0) {
    return handleResponse(res, 404, 'OrderItems not found!');
  }

  handleResponse(res, 200, 'Success get OrderItems!', orderItems);
});

module.exports = {
  getOrderItems,
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getOrderItemsByOrderId,
};
