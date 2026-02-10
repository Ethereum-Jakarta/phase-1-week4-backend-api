const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');
const prisma = require('../../prisma/index');

const categoryOne = {
  id: v4(),
  name: faker.music.genre(),
};

const insertCategory = async (categories) => {
  categories = categories.map((category) => ({ ...category }));
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
};

module.exports = {
  categoryOne,
  insertCategory,
};
