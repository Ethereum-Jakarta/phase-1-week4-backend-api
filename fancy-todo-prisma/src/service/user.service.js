const prisma = require("../../prisma/client");

const getUsers = async() => {
  const user = await prisma.user.findMany({
    include: {
      todos: true
    }
  });
  return user;
}

const getUser = async(id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      todos: true,
    },
  });
  return user
}

const createUser = async(name, email, phone) => {
  const user = await prisma.user.create({
    data: {
      name,
      phone, 
      email
    },
  });
  return user
}

const updateUser = async (name, email, phone, id) => {
  const user = await prisma.user.update({
    where: {
      id: id
    },
    data: {
      name,
      email,
      phone
    }
  });
  return user;
};
const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: {
      id: id
    }
  });
  return user;
};



module.exports = {createUser, getUsers, getUser, updateUser, deleteUser}


