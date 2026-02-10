const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { categoryOne, categoryTwo } = require('./category.fixture');
const { userOne, userTwo } = require('./user.fixture');

const productOne = {
  id: v4(),
  name: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  price: faker.datatype.float({ min: 100, max: 10000000, precision: 1 }),
  quantityInStock: faker.datatype.number({ min: 1, max: 100 }),
  categoryId: categoryOne.id,
  userId: userOne.id,
};

const productTwo = {
  id: v4(),
  name: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  price: faker.datatype.float({ min: 100, max: 10000000, precision: 1 }),
  quantityInStock: faker.datatype.number({ min: 1, max: 100 }),
  categoryId: categoryTwo.id,
  userId: userTwo.id,
};

async function insertProducts(products) {
  products = products.map((product) => ({ ...product }));
  await prisma.product.createMany({
    data: products,
  });
}

module.exports = {
  productOne,
  productTwo,
  insertProducts,
};
