const { v4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const prisma = require('../../prisma/client');

const categoryOne = {
  id: v4(),
  name: faker.vehicle.type(),
};

const insertCategory = async (category) => {
  await prisma.category.createMany({
    data: category,
    skipDuplicates: true,
  });
};

module.exports = {
  categoryOne,
  insertCategory,
};
