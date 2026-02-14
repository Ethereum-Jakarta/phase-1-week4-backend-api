const httpStatus = require('http-status');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/ApiError');

const createProduct = async (data) => {
  const product = await prisma.product.create({
    data,
  });

  return product;
};

const queryProducts = async (filters, options) => {
  const { name, price, category, user } = filters;
  const { take, skip, sort: orderBy } = options;

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: name,
      },
      price: {
        equals: price,
      },
      category: {
        equals: category,
      },
      user: {
        equals: user,
      },
    },
    include: {
      category: { select: { name: true } },
      user: { select: { name: true } },
    },
    orderBy,
    skip,
    take: Number(take),
  });

  if (products.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return products;
};

const getProductById = async (id) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
    },
    include: {
      category: { select: { name: true } },
      user: { select: { name: true } },
    },
  });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return product;
};

const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const deleteProducts = await prisma.product.deleteMany({
    where: {
      id: productId,
    },
  });

  return deleteProducts;
};

const getProductsByUser = async (userId) => {
  const products = await prisma.product.findMany({
    where: {
      userId,
    },
    include: {
      category: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
    },
  });

  if (products.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return products;
};

module.exports = { createProduct, queryProducts, getProductById, updateProductById, deleteProductById, getProductsByUser };
