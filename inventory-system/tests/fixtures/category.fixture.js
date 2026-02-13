const { v4 } = require('uuid');
const faker = require('faker');
const prisma = require('../../prisma');

const categoryOne = {
    id: v4(),
    name: faker.commerce.productMaterial(),
};

const categoryTwo = {
    id: v4(),
    name: faker.commerce.productMaterial(),
};

const insertCategorys = async (categorys) => {
    categorys = categorys.map((category) => ({ ...category}));
    await prisma.category.createMany({
      data: categorys,
      skipDuplicates: true,
    });
};

module.exports = {
    categoryOne,
    categoryTwo,
    insertCategorys,
};