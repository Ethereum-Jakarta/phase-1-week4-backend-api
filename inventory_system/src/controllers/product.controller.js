const httpStatus = require('http-status');
const { productService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Product Success',
    data: product,
  });
});

const getProducts = catchAsync(async (req, res) => {
  const { sort, search, page, size } = req.query;

  const filter = {
    contains: search,
    price: sort,
  };

  const options = {
    skip: page,
    take: size,
  };

  const product = await productService.queryProduct(options, filter);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Products Success',
    data: product,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Products Success',
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Product Success',
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await productService.deleteProductById(req.params.productId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Product Success',
    data: product,
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
