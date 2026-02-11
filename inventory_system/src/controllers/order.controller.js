const httpStatus = require('http-status');
const { orderService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require(`../utils/ApiError`);

const getAll = catchAsync(async (req, res) => {
  const { page, size, name } = req.query;

  const filter = {
    contains: name,
  };

  const options = {
    skip: page,
    take: size,
  };

  const order = await orderService.getOrders(options, filter);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get All Order Success',
    data: order,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);

  if ( !order || order.length == 0 ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found')
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order Success',
    data: order,
  });
});

const update = catchAsync(async (req, res) => {
  const order = await orderService.updateOrder(req.params.orderId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Order Success',
    data: order,
  });
});

const remove = catchAsync(async (req, res) => {
  const order = await orderService.deleteOrder(req.params.orderId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Order Success',
    data: order,
  });
});

const create = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Order Success',
    data: order,
  });
});

module.exports = {
  getAll,
  getOrder,
  create,
  update,
  remove,
};
