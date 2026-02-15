const bcrypt = require('bcryptjs');
const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  id: v4(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  id: v4(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  id: v4(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  users = users.map((user) => ({ ...user, password: hashedPassword }));
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
};

const deleteUsers = async () => {
  await prisma.user.deleteMany({});
};

const deleteAll = async () => {
  await prisma.orders.deleteMany({
    where: {
      userId: {
        in: [userOne.id, admin.id],
      },
    },
  });
  await prisma.product.deleteMany({
    where: {
      userId: {
        in: [userOne.id, admin.id],
      },
    },
  });
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      id: {
        in: [userOne.id, admin.id],
      },
    },
  });
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
  deleteUsers,
  deleteAll,
};
