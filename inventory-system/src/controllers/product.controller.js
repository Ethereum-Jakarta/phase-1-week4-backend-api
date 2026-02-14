const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Product Success',
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const filters = {
    name: req.query.name,
    price: req.query.price,
    category: req.query.category,
    user: req.query.user,
  };

  const options = {
    take: req.query.take || 10,
    page: req.query.page || 1,
    sort: req.query.sort === 'latest' ? { createdAt: 'desc' } : { createdAt: 'asc' },
  };

  options.skip = (options.page - 1) * (options.take || 10);

  const { sort } = req.query;

  // If sort a-z or z-a
  if (sort === 'a-z') options.sort = { name: 'asc' };
  if (sort === 'z-a') options.sort = { name: 'desc' };

  const products = await productService.queryProducts(filters, options);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Products Success',
    data: products,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);

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

const getProductsByUser = catchAsync(async (req, res) => {
  const reqUserId = req.user.id;

  const products = await productService.getProductsByUser(reqUserId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Products Success',
    data: products,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByUser,
};
