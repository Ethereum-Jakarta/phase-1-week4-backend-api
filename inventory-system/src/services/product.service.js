const httpStatus = require('http-status');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/ApiError');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  return prisma.product.create({
    data: {
      ...productBody,
      quantityInStock: parseInt(productBody.quantityInStock),
      price: parseFloat(productBody.price)
    }
  });
};

/**
 * Query for products
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await prisma.product.findMany();
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
      id,
    },
    include:{
      category:true,
      user:true
    }
  });
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
    data: {
      ...updateBody,
      quantityInStock: parseInt(updateBody.quantityInStock),
      price: parseFloat(updateBody.price)},
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const deleteProducts = await prisma.product.deleteMany({
    where: {
      id: productId,
    },
  });

  return deleteProducts;
};

const getAllProducts = async (skip = 0, take = 10) => {
  const products = await prisma.product.findMany({
    include:{
      category:true,
      user:true
    },
    skip: parseInt(skip),
    take: parseInt(take),
  });

  return products;
};

const searchProductByCategory = async (category, skip = 0, take = 10) => {
  const products = await prisma.product.findMany({
    skip: parseInt(skip),
    take: parseInt(take),
    where: {
      category: {
        name: category,
      },
    },
  });

  return products;
};

const getProductCount = async () => {
  const count = await prisma.product.count();
  return count;
};

const getProductByName = async (name) => {
  return prisma.product.findMany({
    where: {
      name: {
        contains: name,
      },
    },
    include:{
      category:true,
    }
  });
};

module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  getAllProducts,
  updateProductById,
  deleteProductById,
  getProductCount,
  searchProductByCategory,
  getProductByName
};
