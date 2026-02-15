const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

const productOne = {
  id: v4(),
  name: faker.vehicle.vehicle(),
  description: faker.lorem.sentence(),
  price: faker.datatype.float({ min: 10, max: 100, precision: 2 }),
  quantityInStock: faker.datatype.number({ min: 10, max: 100 }),
};

const insertProducts = async (userId, categoryId, products) => {
  products = products.map((product) => ({ ...product, categoryId: categoryId, userId: userId }));
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
};

const deleteProducts = async () => {
  await prisma.product.deleteMany({});
};

module.exports = {
  productOne,
  insertProducts,
  deleteProducts,
};
