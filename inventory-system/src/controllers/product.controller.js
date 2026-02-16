const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../service/product.service');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Product Success',
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const { page, size } = req.query;

  // Konversi ke bilangan bulat (integer)
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(size, 10);

  if (Number.isNaN(pageNumber) || Number.isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
    throw new Error('Invalid page or size parameters');
  }

  // Hitung berapa data yang perlu dilewati (skip)
  const skip = (pageNumber - 1) * pageSize;

  const result = await productService.getAllProducts(pageSize, skip);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Products Success',
    data: result,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product Success',
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
  await productService.deleteProductById(req.params.productId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Product Success',
    data: null,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
