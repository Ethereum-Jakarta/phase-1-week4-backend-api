const httpStatus = require('http-status');
const { orderItemService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const queryOrderItems = catchAsync(async (req, res) => {
  const { id, page, size } = req.query;

  const filter = {
    contains: id,
  };

  const options = {
    skip: page,
    take: size,
  };

  const orderItem = await orderItemService.getOrderItems(options, filter);

  if (!orderItem || orderItem.length == 0) throw new ApiError(httpStatus.NOT_FOUND, 'Order Items not found');

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get All Order Item Success',
    data: orderItem,
  });
});

const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order Item Success',
    data: orderItem,
  });
});

const create = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.createOrderItem(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Order Item Success',
    data: orderItem,
  });
});

const update = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.updateOrderItem(req.params.orderItemId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Order Item Success',
    data: orderItem,
  });
});

const remove = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.deleteOrderItem(req.params.orderItemId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Order Item Success',
    data: orderItem,
  });
});

module.exports = {
  queryOrderItems,
  getOrderItem,
  create,
  update,
  remove,
};
