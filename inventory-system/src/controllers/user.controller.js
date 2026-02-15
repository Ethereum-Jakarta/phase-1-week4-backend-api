const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const create = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create User Success',
    data: user,
  });
});

const getAll = catchAsync(async (req, res) => {
  const whereOptions = {};
  const orderByOptions = {};
  let pageSizeOptions = {};

  // where param
  ['name', 'role'].forEach((param) => {
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

  const user = await userService.getAll(whereOptions, pageSizeOptions, sortingOptions);

  if (user.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get User Success',
    data: user,
  });
});

const getId = catchAsync(async (req, res) => {
  const user = await userService.getId(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get User Success',
    data: user,
  });
});

const update = catchAsync(async (req, res) => {
  const user = await userService.update(req.params.userId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update User Success',
    data: user,
  });
});

const deleted = catchAsync(async (req, res) => {
  await userService.deleted(req.params.userId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete User Success',
    data: null,
  });
});

const getProducts = catchAsync(async (req, res) => {
  const whereOptions = {};
  const orderByOptions = {};
  let pageSizeOptions = {};

  // where param
  whereOptions.userId = req.params.userId;
  if (!whereOptions.userId)
    throw new ApiError(httpStatus.NOT_FOUND, 'userId not found')[
      ('name', 'description', 'price', 'quantityInStock', 'categoryId')
    ].forEach((param) => {
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

  const product = await userService.getProducts(whereOptions, pageSizeOptions, sortingOptions);

  if (product.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product by userId Success',
    data: product,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const whereOptions = {};
  const orderByOptions = {};
  let pageSizeOptions = {};

  // where param
  whereOptions.userId = req.params.userId;
  if (!whereOptions.userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'userId not found');
  }

  ['date', 'totalPrice', 'customerName', 'customerEmail'].forEach((param) => {
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

  const order = await userService.getOrders(whereOptions, pageSizeOptions, sortingOptions);

  if (order.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order by userId Success',
    data: order,
  });
});

module.exports = { create, getAll, getId, update, deleted, getProducts, getOrders };
