const { v4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const prisma = require('../../prisma');
const { categoryOne } = require('./category.fixture');
const { userOne } = require('./user.fixture');

const productOne = {
  id: v4(),
  name: faker.vehicle.model(),
  description: faker.vehicle.type(),
  price: parseFloat(faker.commerce.price()),
  quantityInStock: 100,
  categoryId: categoryOne.id,
  userId: userOne.id,
};

const insertProducts = async (products) => {
  products = products.map((product) => ({ ...product }));
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
};

module.exports = {
  productOne,
  insertProducts,
};
