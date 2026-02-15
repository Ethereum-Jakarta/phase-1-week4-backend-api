const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');

const create = async (productBody) => {
  const category = await prisma.category.findFirst({
    where: {
      id: productBody.categoryId,
    },
  });
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'categoryId not found');

  const user = await prisma.user.findFirst({
    where: {
      id: productBody.userId,
    },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'userId not found');

  return prisma.product.create({
    data: productBody,
  });
};

const read = async (filter, options, sorting) => {
  return prisma.product.findMany({
    ...options,
    where: filter,
    orderBy: sorting,
  });
};

const readId = async (id) => {
  return prisma.product.findFirst({
    where: {
      id: id,
    },
  });
};

const update = async (id, update) => {
  const product = await readId(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const updateProduct = await prisma.product.update({
    where: {
      id: id,
    },
    data: update,
  });

  return updateProduct;
};

const deleted = async (id) => {
  const product = await readId(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const deleteProduct = await prisma.product.delete({
    where: {
      id: id,
    },
  });

  return deleteProduct;
};

const getProductByCategory = async (filter, options, sorting) => {
  const category = await prisma.category.findFirst({
    where: {
      name: filter.category,
    },
  });
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');

  return prisma.product.findMany({
    ...options,
    where: {
      categoryId: category.id,
    },
    orderBy: sorting,
  });
};

module.exports = { create, read, readId, update, deleted, getProductByCategory };
