const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

const categoryOne = {
  id: v4(),
  name: faker.commerce.department(),
};

const categoryTwo = {
  id: v4(),
  name: faker.commerce.department(),
};

const insertcategory = async (category) => {
  category = category.map((category) => ({ ...category }));
  await prisma.category.createMany({
    data: category,
    skipDuplicates: true,
  });
};

module.exports = {
  categoryOne,
  categoryTwo,
  insertcategory,
};
