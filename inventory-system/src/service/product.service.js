const httpStatus = require('http-status');
const { prisma } = require('../../prisma');
const ApiError = require('../utils/ApiError');
// const userService = require('./user.service');

const createProduct = async (productBody) => {
  return prisma.product.create({
    data: productBody,
  });
};

const getAllProducts = async (pageSize, skip) => {
  const products = await prisma.product.findMany({
    skip,
    take: pageSize,
  });
  return products;
};

const getProductById = async (id) => {
  return prisma.product.findFirst({
    where: { id },
  });
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }

  const updateProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: updateBody,
  });

  return updateProduct;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }

  const deleteproducts = await prisma.product.deleteMany({
    where: {
      id: productId,
    },
  });

  return deleteproducts;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
