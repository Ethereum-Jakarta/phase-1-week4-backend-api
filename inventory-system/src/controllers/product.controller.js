const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(status.CREATED).send({
    status: status.CREATED,
    message: 'Create Product Success',
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await productService.getAllProducts(page, limit);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Products Success',
    data: result.products,
    pagination: {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    },
  });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Product not found');
  }

  res.status(status.OK).send({
    status: status.OK,
    message: 'Get Category Success',
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Update Product Success',
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);

  res.status(status.OK).send({
    status: status.OK,
    message: 'Delete User Success',
    data: null,
  });
});


const getProductsByCategory = catchAsync(async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(status.BAD_REQUEST).send({
      status: status.BAD_REQUEST,
      message: 'Category query is required',
    });
  }

  const products = await productService.getProductsByCategory(category);

  res.status(status.OK).send({
    status: status.OK,
    message: `Found ${products.length} product(s) in category '${category}'`,
    data: products,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};
