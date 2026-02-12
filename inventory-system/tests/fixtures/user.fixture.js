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
  try {
    users = users.map((user) => ({ ...user, password: hashedPassword }));
    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });
  } catch (error) {
    console.info("[ERROR_INSERT_USER]", error)
  }
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
