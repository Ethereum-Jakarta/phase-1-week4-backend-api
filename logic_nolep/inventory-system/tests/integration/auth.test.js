const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../src/app');
const { userOne, insertUsers } = require('../fixtures/user.fixture');

describe('Auth routes', () => {
  describe('POST /api/auth/register', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password',
        role: 'user',
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post('/api/auth/register').send(newUser);

      expect(res.body).toEqual({
        status: 201,
        message: 'Registration successful!',
        data: expect.objectContaining({
          id: expect.any(String),
          email: newUser.email,
        }),
        error: null,
      });
    });
  });

  describe('POST /api/auth/login', () => {
    test('should return 200 and login user if email and password match', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      };

      await request(app).post('/api/auth/login').send(loginCredentials);
    });

    test('should return 401 error if password is wrong', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: 'wrongPassword1',
      };

      await request(app).post('/api/auth/login').send(loginCredentials);
    });
  });
});

describe('ERROR HANDLING', () => {
  test('should return 400 if creating register without required fields', async () => {
    const res = await request(app).post('/api/auth/register');

    expect(res.body).toEqual(
      expect.objectContaining({
        status: 400,
        message: 'Validation Error',
        data: null,
        error: expect.any(String),
      })
    );
  });

  test('should return 400 if creating login without required fields', async () => {
    const res = await request(app).post('/api/auth/login');

    expect(res.body).toEqual(
      expect.objectContaining({
        status: 400,
        message: 'Validation Error',
        data: null,
        error: expect.any(String),
      })
    );
  });

  test('should return 400 if email already exists', async () => {
    await insertUsers([userOne]);

    const duplicateUser = {
      name: 'New User',
      email: userOne.email,
      password: 'newPassword123!',
      role: 'user',
    };

    const res = await request(app).post('/api/auth/register').send(duplicateUser);

    expect(res.body).toEqual({
      status: 400,
      message: 'User email already exists.',
      data: null,
      error: null,
    });
  });
});
