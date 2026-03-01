const orderService = require('../services/order.service');
const { orderValidationSchema } = require('../validations/order.validation');
const handleResponse = require('../utils/responseHandler');
const catchAsync = require('../utils/catchAsync');

const getOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getOrders();

  if (!orders) {
    return handleResponse(res, 404, 'Orders not found.');
  }

  handleResponse(res, 200, 'Success get Orders!', orders);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrder(req.params.id);

  if (!order) {
    return handleResponse(res, 404, 'Order not found.');
  }

  handleResponse(res, 200, 'Success get Order!', order);
});

const createOrder = catchAsync(async (req, res) => {
  const { totalPrice, customerName, customerEmail, userId } = req.body;
  const { error } = orderValidationSchema.validate(req.body);

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const createdOrder = await orderService.createOrder({
    totalPrice,
    customerName,
    customerEmail,
    userId,
  });

  handleResponse(res, 201, 'Success create Order!', createdOrder);
});

const updateOrder = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const { totalPrice, customerName, customerEmail, userId } = req.body;
  const { error } = orderValidationSchema.validate(req.body);
  const existingOrder = await orderService.getOrder(orderId);

  if (!existingOrder) {
    return handleResponse(res, 404, 'Order not found.');
  }

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const updatedOrder = await orderService.updateOrder(orderId, {
    totalPrice,
    customerName,
    customerEmail,
    userId,
  });

  handleResponse(res, 200, 'Success update Order!', updatedOrder);
});

const deleteOrder = catchAsync(async (req, res) => {
  const deletedOrder = await orderService.deleteOrder(req.params.id);

  if (!deletedOrder) {
    return handleResponse(res, 404, 'Order not found.');
  }

  handleResponse(res, 200, 'Success delete Order!', deletedOrder);
});

const getOrdersByUserId = catchAsync(async (req, res) => {
  const orders = await orderService.getOrdersByUserId(req.params.id);

  if (orders.length === 0) {
    return handleResponse(res, 404, 'Orders not found!');
  }

  handleResponse(res, 200, 'Success get orders!', orders);
});

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
};
