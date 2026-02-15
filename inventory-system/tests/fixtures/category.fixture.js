const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

const categoryOne = {
  id: v4(),
  name: faker.vehicle.vehicle(),
};

const insertCategories = async (categories) => {
  categories = categories.map((category) => ({ ...category }));
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
};

const deleteCategories = async () => {
  await prisma.category.deleteMany({});
};

module.exports = { categoryOne, insertCategories, deleteCategories };
