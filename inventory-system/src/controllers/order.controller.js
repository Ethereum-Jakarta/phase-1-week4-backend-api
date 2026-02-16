const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const orderService = require('../service/order.service');

const createOrder = catchAsync(async (req, res) => {
  const { totalPrice, customerName, customerEmail, userId } = req.body;
  const currentDate = new Date();
  const isoDateString = currentDate.toISOString();

  const order = await orderService.createOrder(isoDateString, totalPrice, customerName, customerEmail, userId);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create order Success',
    data: order,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const { page, size } = req.query;

  // Konversi ke bilangan bulat (integer)
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(size, 10);

  if (Number.isNaN(pageNumber) || Number.isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
    throw new Error('Invalid page or size parameters');
  }

  // Hitung berapa data yang perlu dilewati (skip)
  const skip = (pageNumber - 1) * pageSize;

  const result = await orderService.getAllOrders(pageSize, skip);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get orders Success',
    data: result,
  });
});

const getOrderItemByOrder = catchAsync(async (req, res) => {
  const result = await orderService.getOrderItemsByOrder(req.params.orderId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get OrderItem Success',
    data: result,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get order Success',
    data: order,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update order Success',
    data: order,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete order Success',
    data: null,
  });
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrderItemByOrder,
};
