const prisma = require("../../prisma/client");

const getAllUsers = async () => {
  try {
    const showAll = await prisma.user.findMany({ include: { todos: true } });
    return showAll

  } catch(err) {
      console.error("Error getting all users:", err.message);
      throw new Error(err.message);
  }
}

const getUserById = async (id) => {
  try {
    const getUser = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { todos: true },
    });

    if (!getUser) {
      throw new Error("User not found!");
    }
    return getUser
  } catch (err) {
    console.error("Error findout user:", err.message);
    throw new Error(err.message);
  }
};

const createUser = async (datas) => {
  try {
    const { name, email, phone } = datas;
    const create = await prisma.user.create({ data: { name, email, phone } });
    return create;
  } catch (err) {
    console.error("Error creating user:", err.message);
    throw new Error(err.message);
  }
};

const updateUser = async (id, data) => {
  try {
    const update = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });
    return update;
  } catch (err) {
      if (err.code === "P2025") {
        throw new Error("User not found!");
      }
    console.error("Error updating user:", err.message);
    throw new Error(err.message);
  }
};

const deleteUser = async (id) => {
  try {
    const deleted = await prisma.user.delete({ where: { id: Number(id) } });
    return deleted;
  } catch (err) {
     if (err.code === "P2025") {
       throw new Error("User not found!");
     }
    console.error("Error deleting user:", err.message);
    throw new Error(err.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
