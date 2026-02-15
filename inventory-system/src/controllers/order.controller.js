const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const create = catchAsync(async (req, res) => {
  const order = await orderService.create(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Order Success',
    data: order,
  });
});

const getAll = catchAsync(async (req, res) => {
  const whereOptions = {};
  const orderByOptions = {};
  let pageSizeOptions = {};

  // where param
  ['date', 'totalPrice', 'customerName', 'customerEmail', 'userId'].forEach((param) => {
    if (req.query[param]) {
      whereOptions[param] = req.query[param];
    }
  });

  // orderBy param
  if (req.query.orderBy) {
    orderByOptions.orderBy = req.query.orderBy.split(':');
  }
  const sortingOptions = req.query.orderBy ? { [orderByOptions.orderBy[0]]: orderByOptions.orderBy[1] } : undefined;

  // skip & take param
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.size) || 10;
  const skip = (page - 1) * pageSize;
  pageSizeOptions = {
    skip: skip,
    take: pageSize,
  };

  const order = await orderService.getAll(whereOptions, pageSizeOptions, sortingOptions);

  if (order.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order Success',
    data: order,
  });
});

const getId = catchAsync(async (req, res) => {
  const order = await orderService.getId(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order Success',
    data: order,
  });
});

const update = catchAsync(async (req, res) => {
  const order = await orderService.update(req.params.orderId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Order Success',
    data: order,
  });
});

const deleted = catchAsync(async (req, res) => {
  await orderService.deleted(req.params.orderId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Order Success',
    data: null,
  });
});

module.exports = { create, getAll, getId, update, deleted };
