const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/index');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  
  userBody.password = bcrypt.hashSync(userBody.password, 8);

  return prisma.user.create({
    data: userBody,
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const getUserById = async (userId) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
};

const getAllUsers = async (skip = 0, take = 10) => {
  const users = await prisma.user.findMany({
    skip: parseInt(skip),
    take: parseInt(take),
  });

  return users;
};

const updateUserById = async (userId, updateBody) => {
  if(updateBody.password){
    updateBody.password = bcrypt.hashSync(updateBody.password, 8);
  }
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateBody,
  });

  return updateUser;
};

const deleteUserById = async (userId) => {
  const deleteUser = await prisma.user.deleteMany({
    where: {
      id: userId,
    },
  });

  return deleteUser;
};

const queryUsers = async (filter, options) => {
  const users = await prisma.user.findMany();

  return users;
};

const getUserCount = async () =>{
  const count = await prisma.user.count();
  return count;
}

const getUserByName = async (name) => {
  return prisma.user.findMany({
    where: {
      name: {
        contains:name
      },
    },
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
  queryUsers,
  getUserCount,
  getUserByName,
};
