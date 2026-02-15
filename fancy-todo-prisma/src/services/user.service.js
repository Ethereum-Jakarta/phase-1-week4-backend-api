const prisma = require('../../prisma/client');

const createUser = async (data) => {
  try {
    const newUser = await prisma.user.create({
      data: data,
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};

const readUser = async () => {
  try {
    const readUser = await prisma.user.findMany();
    return readUser;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, update) => {
  try {
    const updateUser = await prisma.user.update({
      data: update,
      where: {
        id: userId,
      },
    });
    return updateUser;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deleteUser;
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, readUser, updateUser, deleteUser };
