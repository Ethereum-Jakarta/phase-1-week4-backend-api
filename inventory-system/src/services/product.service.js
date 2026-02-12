const httpStatus = require('http-status');
const prisma = require('../../prisma/client')
const ApiError = require('../utils/ApiError');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody,userId) => {
  productBody.userId=userId;
  // console.log(productBody);
  return prisma.product.create({
    data: productBody
  });
};

/**
 * Query for products
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (skip,take) => {
  const products = await prisma.product.findMany({
    skip: skip,
    take: take,
    include: {
      user: true, 
      category: true, 

    },
  });

  return products;
};
/**
 * Query for products by user ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<QueryResult>}
 */
const queryProductsByUserId = async (userId,skip,take) => {
  const products = await prisma.product.findMany({
    skip: skip,
    take: take,
    where: {
      userId: userId,
    },
    include: {
      category: true, 

    },
  });
  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return prisma.product.findFirst({
    where: {
      id: id
    },
    include: {
      user: true, 
      category: true, 
    },
  })
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const updateProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: updateBody
  })

  return updateProduct;
};
/**
 * Update quantity product
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateQuantityProduct = async (productId, quantity) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  product.quantityInStock += quantity;
  const updateProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {quantityInStock:product.quantityInStock}
  })

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
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const deleteProducts = await prisma.product.deleteMany({
    where: {
      id: productId
    },
  })

  return deleteProducts;
};


module.exports = {
  createProduct,
  queryProducts,
  queryProductsByUserId,
  getProductById,
  updateProductById,
  updateQuantityProduct,
  deleteProductById,
};