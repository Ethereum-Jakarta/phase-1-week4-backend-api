const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');
const prisma = require('../../prisma/index');
const { insertCategories } = require('./category.fixture');
const { insertUsers } = require('./user.fixture');

const productOne = {
  id: v4(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.float({ max: 50 }),
  quantityInStock: faker.number.int({ min: 21, max: 100 }),
};
const insertProducts = async (users, category, product) => {
  await insertUsers([users]);
  await insertCategories([category]);

  const productMapped = product.map((el) => {
    return {
      ...el,
      categoryId: category.id,
      userId: users.id,
    };
  });

  await prisma.product.createMany({
    data: productMapped,
    skipDuplicates: true,
  });
};

module.exports = {
  productOne,
  insertProducts,
};
