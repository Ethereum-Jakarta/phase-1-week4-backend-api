const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { adminAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');

describe('User Routes', () => {
  beforeEach(async () => {
    await insertUsers([userOne]);
    await insertUsers([admin]);
  });

  describe('Authorization', () => {
    test('Should return 401 if access token is missing', async () => {
      await request(app).get('/v1/users').expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/users', () => {
    test('should return 200 and list of users', async () => {
      await request(app).get('/v1/users').set('Authorization', `Bearer ${adminAccessToken}`).expect(httpStatus.OK);
    });
  });

  describe('GET /v1/users/:userId', () => {
    test('should return 200 and the user by id given', async () => {
      const res = await request(app)
        .get(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      const userData = res.body.data;
      const dbUser = await prisma.user.findUnique({
        where: { id: userData.id },
      });
      expect(dbUser).toBeDefined();
    });
    test('should return 400 if id is not found', async () => {
      await request(app)
        .get(`/v1/users/${123}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
