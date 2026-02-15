const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const create = catchAsync(async (req, res) => {
  const product = await productService.create(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Product Success',
    data: product,
  });
});

const read = catchAsync(async (req, res) => {
  const whereOptions = {};
  const orderByOptions = {};
  let pageSizeOptions = {};

  // where param
  ['name', 'description', 'price', 'quantityInStock', 'categoryId', 'userId'].forEach((param) => {
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

  const product = await productService.read(whereOptions, pageSizeOptions, sortingOptions);

  if (product.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product Success',
    data: product,
  });
});

const readId = catchAsync(async (req, res) => {
  const product = await productService.readId(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product Success',
    data: product,
  });
});

const update = catchAsync(async (req, res) => {
  const product = await productService.update(req.params.productId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Product Success',
    data: product,
  });
});

const deleted = catchAsync(async (req, res) => {
  await productService.deleted(req.params.productId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Product Success',
    data: null,
  });
});

const getProductByCategory = catchAsync(async (req, res) => {
  const whereOptions = {};
  const orderByOptions = {};
  let pageSizeOptions = {};

  whereOptions.category = req.query.category;

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

  const product = await productService.getProductByCategory(whereOptions, pageSizeOptions, sortingOptions);

  if (product.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product by Category Success',
    data: product,
  });
});

module.exports = { create, read, readId, update, deleted, getProductByCategory };
