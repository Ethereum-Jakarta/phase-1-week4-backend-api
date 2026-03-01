const productService = require('../services/product.service');
const { productValidationSchema } = require('../validations/product.validation');
const handleResponse = require('../utils/responseHandler');
const catchAsync = require('../utils/catchAsync');

const getProducts = catchAsync(async (req, res) => {
  const products = await productService.getProducts();

  if (!products) {
    return handleResponse(res, 404, 'Products not found.');
  }

  handleResponse(res, 200, 'Success get Products!', products);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProduct(req.params.id);

  if (!product) {
    return handleResponse(res, 404, 'Product not found.');
  }

  handleResponse(res, 200, 'Success get Product!', product);
});

const createProduct = catchAsync(async (req, res) => {
  const { name, description, price, quantityInStock, categoryId, userId } = req.body;
  const { error } = productValidationSchema.validate(req.body);

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const createdProduct = await productService.createProduct({
    name,
    description,
    price,
    quantityInStock,
    categoryId,
    userId,
  });

  handleResponse(res, 201, 'Success create Product!', createdProduct);
});

const updateProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, quantityInStock, categoryId, userId } = req.body;
  const { error } = productValidationSchema.validate(req.body);
  const existingProduct = await productService.getProduct(productId);

  if (!existingProduct) {
    return handleResponse(res, 404, 'Product not found.');
  }

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const updatedProduct = await productService.updateProduct(productId, {
    name,
    description,
    price,
    quantityInStock,
    categoryId,
    userId,
  });

  handleResponse(res, 200, 'Success update Product!', updatedProduct);
});

const deleteProduct = catchAsync(async (req, res) => {
  const deletedProduct = await productService.deleteProduct(req.params.id);
  handleResponse(res, 200, 'Success delete Product!', deletedProduct);
});

const getProductsByUserId = catchAsync(async (req, res) => {
  const products = await productService.getProductsByUserId(req.params.id);

  if (products.length === 0) {
    return handleResponse(res, 404, 'Products not found!');
  }

  handleResponse(res, 200, 'Success get products!', products);
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByUserId,
};
