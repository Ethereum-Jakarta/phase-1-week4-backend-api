const { v4 } = require('uuid');
const prisma = require('../../prisma');

const categoryOne = {
  id: v4(),
  name: 'string'
}

const insertCategory = async (category) => {
  try {
    await prisma.category.createMany({
      data: category,
      skipDuplicates: true,
    });
  } catch (error) {
    console.info("[ERROR_INSERT_CATEGORY]", error)
  }
};

module.exports = {
  insertCategory,
  categoryOne
};
