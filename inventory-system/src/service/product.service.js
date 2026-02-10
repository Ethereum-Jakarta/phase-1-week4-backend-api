const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');

const createProduct = async (productBody) => {
  const product = await prisma.product.create({
    data: productBody,
  });

  return product;
};

const getProduct = async (filter, category, option) => {
  const result = await prisma.product.findMany({
    where: {
      ...filter,
      category: {
        name: category,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    ...option,
  });
  return result;
};

const getProductById = async (productId) => {
  const result = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found');
  }

  return result;
};

const updateProduct = async (productId, productBody) => {
  const target = await getProductById(productId);
  const result = await prisma.product.update({
    where: {
      id: productId,
    },
    data: productBody,
  });
  return result;
};

const deleteProduct = async (productId) => {
  const result = await prisma.product.delete({
    where: { id: productId },
  });

  return result;
};

module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
