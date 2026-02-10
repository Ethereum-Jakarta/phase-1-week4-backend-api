const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');
const prisma = require('../../prisma/index');
const { userOne } = require('./user.fixture');
const { insertProducts, productOne } = require('./product.fixture');
const { categoryOne } = require('./category.fixture');

const orderItemOne = {
  id: v4(),
  quantity: 1,
};

module.exports = {
  orderItemOne,
};
