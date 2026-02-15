const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const { orderItemService } = require('../services');

const create = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.create(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Order Item Success',
    data: orderItem,
  });
});

const getAll = catchAsync(async (req, res) => {
  const whereOptions = {};
  const orderByOptions = {};
  let pageSizeOptions = {};

  // where param
  ['orderId', 'productId', 'quantity', 'unitPrice'].forEach((param) => {
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

  const orderItem = await orderItemService.getAll(whereOptions, pageSizeOptions, sortingOptions);

  if (orderItem.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Item not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order Item Success',
    data: orderItem,
  });
});

const getId = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getId(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Item not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order Item Success',
    data: orderItem,
  });
});

const update = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.update(req.params.orderItemId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Order Item Success',
    data: orderItem,
  });
});

const deleted = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.deleted(req.params.orderItemId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Order Item Success',
    data: null,
  });
});

module.exports = { create, getAll, getId, update, deleted };
