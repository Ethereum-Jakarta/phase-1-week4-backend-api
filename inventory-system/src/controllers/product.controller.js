const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService,categoryService } = require('../services');

const createProduct = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.body.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  const product = await productService.createProduct(req.body,req.user.id);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Create Product Success",
    data: product
  });
});

const getProducts = catchAsync(async (req, res) => {
  var page = 1;
  var take = 5;
  var skip = (page-1)*take;
  const result = await productService.queryProducts(skip,take);
  
  res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: "Get Products Success",
      data: result
    });
  });
const getProductsByUser = catchAsync(async (req, res) => {
  var page = 1;
  var take = 5;
  var skip = (page-1)*take;
  const result = await productService.queryProductsByUserId(req.user.id,skip,take);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Products Success",
    data: result
  });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Product Success",
    data: product
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.body.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  req.body.userId = req.user.id;
  const product = await productService.updateProductById(req.params.productId, req.body);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Update Product Success",
    data: product
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Delete Product Success",
    data: null
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProductsByUser,
  getProduct,
  updateProduct,
  deleteProduct,
};