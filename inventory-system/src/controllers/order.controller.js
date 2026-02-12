const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { orderService } = require('../services');
const ApiError = require('../utils/ApiError');

const getAllOrders = catchAsync(async (req, res) => {
  const { skip, limit } = req.query;

  const responsed = await orderService.getAllOrders(skip, limit);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Get Orders Succesfully',
    totalPage: responsed.totalPage,
    totalData: responsed.totalData,
    data: responsed.data,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;

  const data = await orderService.getOrder(orderId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  res.status(httpStatus.OK).json({
    statsu: httpStatus.OK,
    message: 'Get Order Succesfully',
    data,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;

  const existingOrder = await orderService.deleteOrder(orderId);
  if (!existingOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  res.status(204).json(null);
});

const updateOrder = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const bodyOrder = req.body;

  const data = await orderService.updateOrder(orderId, bodyOrder);

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: 'Update Order Succesfully',
    data,
  });
});

const createOrder = catchAsync(async (req, res) => {
  const bodyOrder = req.body;

  const data = await orderService.createOrder(bodyOrder);

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: 'Create Order Succesfully',
    data,
  });
});

const getOrderItemsByOrder = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;

  const data = await orderService.getOrderItemsByOrder(orderId);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Get Orders Succesfully',
    data,
  });
});

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrder,
  getOrderItemsByOrder,
};
