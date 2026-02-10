const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');

/**
 * Get a product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
async function getProductById(productId) {
  return prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
}

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
async function createProduct(productBody) {
  return prisma.product.create({
    data: productBody,
  });
}

/**
 * Get a product
 * @param {object} options
 * @returns {Promise<Product>}
 */
async function getProduct(options) {
  return prisma.product.findMany({
    take: +options.take || 5,
    skip: +options.skip || 0,
  });
}

/**
 * Update a product
 * @param {ObjectId} productId
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
async function updateProduct(productId, productBody) {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: productBody,
  });
  return updatedProduct;
}

/**
 * Delete a product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
async function deleteProduct(productId) {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const deletedProduct = await prisma.product.deleteMany({
    where: {
      id: productId,
    },
  });
  return deletedProduct;
}

/**
 * Get a product by user
 * @param {ObjectId} userId
 * @returns {Promise<Product>}
 */
async function getProductbyUser(userId) {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await prisma.product.findFirst({
    where: {
      userId: userId,
    },
  });

  return result;
}

/**
 * Search product by category
 * @param {string} filter
 * @returns {Promise<Product>}
 */
const searchProductByCategory = async (filter) => {
  const products = await prisma.product.findMany({
    where: {
      category: {
        name: {
          contains: filter,
          mode: "insensitive"
        }
      }
    }
  });
  return products
};

module.exports = {
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
  getProductbyUser,
  searchProductByCategory,
};
