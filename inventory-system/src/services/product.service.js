const { status } = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  return prisma.product.create({
    data: productBody,
  });
};

/**
 * Get All Products
 * @returns {Promise<products>}
 */
const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // optional
    }),
    prisma.product.count(),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return prisma.product.findFirst({
    where: {
      id: id,
    },
  });
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<updateProduct>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Product not found');
  }

  const updateProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: { ...updateBody },
  });

  return updateProduct;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(status.NOT_FOUND, 'Product not found');
  }

  const deleteProduct = await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  return deleteProduct;
};

/**
 * Get Product By UserID
 * @param {ObjectId} userId
 * @returns {Promise<Product>}
 */
const getProductsByUser = async (userId) => {
  const user = await getProductById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }
  return await prisma.product.findMany({
    where: { userId: parseInt(userId) },
  });
};

const getProductsByCategory = async (category) => {
  return await prisma.product.findMany({
    where: {
      category: {
        contains: category,
        mode: 'insensitive',
      },
    },
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductsByUser,
  getProductsByCategory,
};
