const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');

const createCategory = async (categoryBody) => {
  return prisma.category.create({
    data: categoryBody,
  });
};

const queryCategorys = async (option) => {
  const categorys = await prisma.category.findMany({
    ...option,
  });
  return categorys;
};

const getCategoryById = async (id) => {
  return prisma.category.findFirst({
    where: {
      id: id,
    },
  });
};

const updateCategoryById = async (categoryId, categoryBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found');
  }
  const updateCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: categoryBody,
  });

  return updateCategory;
};

const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found');
  }

  const deleteCategory = await prisma.category.deleteMany({
    where: {
      id: categoryId,
    },
  });
  return deleteCategory;
};

module.exports = {
  createCategory,
  queryCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
