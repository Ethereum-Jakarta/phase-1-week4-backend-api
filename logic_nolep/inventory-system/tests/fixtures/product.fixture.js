const { v4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const prisma = require('../../prisma/client');
const { userOne } = require('./user.fixture');
const { categoryOne } = require('./category.fixture');

const productOne = {
  id: v4(),
  name: faker.commerce.product(),
  description: faker.commerce.productDescription(),
  price: faker.number.float(),
  quantityInStock: faker.number.int({ min: 10, max: 100 }),
  categoryId: categoryOne.id,
  userId: userOne.id,
};

const insertProducts = async (product) => {
  await prisma.product.createMany({
    data: product,
    skipDuplicates: true,
  });
};

module.exports = {
  productOne,
  insertProducts,
};
