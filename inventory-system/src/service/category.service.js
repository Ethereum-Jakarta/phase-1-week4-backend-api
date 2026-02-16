const httpStatus = require('http-status');
const { prisma } = require('../../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  return prisma.category.create({
    data: categoryBody,
  });
};

/**
 * Query for categorys
 * @returns {Promise<QueryResult>}
 */
// eslint-disable-next-line no-unused-vars
const getAllCategory = async (pageSize, skip) => {
  const categorys = await prisma.category.findMany({
    skip,
    take: pageSize,
  });
  return categorys;
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return prisma.category.findFirst({
    where: { id },
  });
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const updateCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: updateBody,
  });

  return updateCategory;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const deleteCategorys = await prisma.category.deleteMany({
    where: {
      id: categoryId,
    },
  });

  return deleteCategorys;
};

const getProductsByCategory = async (categoryName) => {
  // Temukan kategori berdasarkan nama
  const category = await prisma.category.findFirst({
    where: {
      name: categoryName,
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // Temukan produk yang memiliki categoryId sesuai dengan kategori yang ditemukan
  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
    },
  });

  return products;
};

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getProductsByCategory,
};
