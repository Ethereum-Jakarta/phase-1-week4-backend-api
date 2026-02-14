const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');
const prisma = require('../../prisma/index');
const { userOne } = require('./user.fixture');
const { insertProducts, productOne } = require('./product.fixture');
const { insertOrdersTwo } = require('./order.fixture');
const { categoryOne } = require('./category.fixture');

const orderItemOne = {
  id: v4(),
  quantity: faker.number.int({ min: 10, max: 20 }),
};
const insertOrderItems = async (products, orders, orderItem) => {
  await insertProducts(userOne, categoryOne, [products]);
  await insertOrdersTwo(userOne, [orders]);

  const orderItemMapped = orderItem.map((el) => {
    return {
      ...el,
      orderId: orders.id,
      productId: products.id,
      unitPrice: products.price,
    };
  });

  await prisma.orderItem.createMany({
    data: orderItemMapped,
    skipDuplicates: true,
  });
};

module.exports = {
  orderItemOne,
  insertOrderItems,
};
