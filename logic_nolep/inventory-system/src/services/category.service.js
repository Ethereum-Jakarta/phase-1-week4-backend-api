const prisma = require('../../prisma/client');

const getCategories = async () => {
  const categories = await prisma.category.findMany();

  return categories;
};

const getCategory = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  return category;
};

const createCategory = async ({ name }) => {
  const category = await prisma.category.create({
    data: { name },
  });

  return category;
};

const updateCategory = async (categoryId, { name }) => {
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { name },
  });

  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await prisma.category.delete({
    where: { id: categoryId },
  });

  return category;
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
