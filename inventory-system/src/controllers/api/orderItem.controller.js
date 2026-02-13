const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { orderItemService } = require('../../services');

const createOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.createOrderItem(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create OrderItem Success',
    data: orderItem,
  });
});

const getOrderItems = catchAsync(async (req, res) => {
  const { skip, take } = req.query;
  const result = await orderItemService.getAllOrderItems(skip, take);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get OrderItems Success',
    data: result,
  });
});

const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get OrderItem Success',
    data: orderItem,
  });
});

const updateOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update OrderItem Success',
    data: orderItem,
  });
});

const deleteOrderItem = catchAsync(async (req, res) => {
  await orderItemService.deleteOrderItemById(req.params.orderItemId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete OrderItem Success',
    data: null,
  });
});

module.exports = {
  createOrderItem,
  getOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
