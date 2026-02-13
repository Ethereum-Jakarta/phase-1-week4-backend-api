const httpStatus = require('http-status');
const prisma = require('../../prisma/client')
const ApiError = require('../../utils/ApiError');
const bcrypt = require('bcryptjs');

/**
* Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const getAllUsers = async () => {
  const user = await prisma.user.findMany()
  return user
}

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({where: {id: userId}})
  return user
}

const createUser = async (userBody) => {
  userBody.password = bcrypt.hashSync(userBody.password, 8);

  return prisma.user.create({
    data: userBody
  });
};

const updateUser = async (userId, userBody) => {
  const updateuser = await prisma.user.update({
    where: {id: userId},
    data: userBody
  })
  return updateuser
}

const deleteUser = async (userId) => {
  const deleteuser = await prisma.user.delete({
    where: {id: userId}
  })
  return deleteuser
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

const getProductByUser = async (userId) => {
  const product = await prisma.product.findMany({where : {userId}})
  return product
}

const getOrderByUser = async (userId) => {
  const order = await prisma.order.findMany({where : {userId}})
  return order
}


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getProductByUser,
  getOrderByUser
};