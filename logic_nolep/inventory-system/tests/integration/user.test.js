const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../src/app');
const { admin, insertUsers, userOne } = require('../fixtures/user.fixture');
const { adminAccessToken } = require('../fixtures/token.fixture');

describe('User routes', () => {
  let newUser;

  beforeEach(async () => {
    await insertUsers([admin, userOne]);
    newUser = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password',
      role: 'admin',
    };
  });

  describe('GET /api/users', () => {
    test('should return 200 OK and list of users', async () => {
      const res = await request(app).get('/api/users').set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success get users!',
        data: expect.any(Array),
        error: null,
      });
    });
  });

  describe('/api/users/:id', () => {
    test('should return 200 and success get user by id', async () => {
      const res = await request(app).get(`/api/users/${userOne.id}`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success get user!',
        data: expect.objectContaining({
          id: userOne.id,
          email: userOne.email,
        }),
        error: null,
      });
    });

    test('should return 201 and create a user', async () => {
      const res = await request(app).post('/api/users').set('Authorization', `Bearer ${adminAccessToken}`).send(newUser);

      expect(res.body).toEqual({
        status: 201,
        message: 'Success create user!',
        data: expect.objectContaining({
          id: expect.any(String),
          email: newUser.email,
        }),
        error: null,
      });
    });

    test('should return 200 and update user by id', async () => {
      const updateUser = { name: 'Updated Name', email: userOne.email, password: 'password', role: 'admin' };

      const res = await request(app)
        .put(`/api/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateUser);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success update user!',
        data: expect.objectContaining({
          id: userOne.id,
          name: updateUser.name,
          email: updateUser.email,
          password: expect.any(String),
          role: updateUser.role,
        }),
        error: null,
      });
    });

    test('should return 200 and delete user by id', async () => {
      const res = await request(app).delete(`/api/users/${userOne.id}`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success delete user!',
        data: expect.objectContaining({
          id: userOne.id,
        }),
        error: null,
      });
    });
  });

  describe('ERROR HANDLING', () => {
    test('should return 400 if creating product without required fields', async () => {
      const res = await request(app).post('/api/users').set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 400,
          message: 'Validation Error',
          data: null,
          error: expect.any(String),
        })
      );
    });

    test('should return 401 error unauthorized if no bearer access token', async () => {
      const res = await request(app).get('/api/users');
      expect(res.body.message).toBe('Authorization header missing');
    });

    test('should return 404 NOT_FOUND if user not found', async () => {
      const fakeUserId = '123456789abcdef123456789';
      const res = await request(app).get(`/api/users/${fakeUserId}`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 404,
        message: 'User not found.',
        data: null,
        error: null,
      });
    });
  });
});
