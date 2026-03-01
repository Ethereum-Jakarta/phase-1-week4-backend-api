const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');
const prisma = require('../../prisma/client');

const password = 'password';
const hashedPassword = bcrypt.hashSync(password, 10);

const userOne = {
  id: v4(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: hashedPassword,
  role: 'user',
};

const userTwo = {
  id: v4(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: hashedPassword,
  role: 'user',
};

const admin = {
  id: v4(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: hashedPassword,
  role: 'admin',
};

const insertUsers = async (users) => {
  const updatedUsers = users.map((user) => ({ ...user, password: hashedPassword }));
  await prisma.user.createMany({
    data: updatedUsers,
    skipDuplicates: true,
  });
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
