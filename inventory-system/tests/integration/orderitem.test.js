const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { insertUsers, admin } = require('../fixtures/user.fixture');

describe('OrderItem Routes', () => {
  beforeEach(async () => {
    await insertUsers([admin]);
  });

  describe('Authorization', () => {
    test('should return 401 if access token is invalid', async () => {
      await request(app).get('/v1/order-items').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if role is not admin', async () => {
      await request(app).get('/v1/order-items').send(`Bearer ${userOneAccessToken}`).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /v1/order-items', () => {
    test('should return 400 if one of the data is missing', async () => {
      await request(app)
        .post('/v1/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/order-items', () => {
    test('should return 200 and list of orderItems', async () => {
      await request(app).get('/v1/order-items').set('Authorization', `Bearer ${adminAccessToken}`).expect(httpStatus.OK);
    });
  });

  describe('GET /v1/order-items/:orderItemId', () => {
    test('should return 400 if orderItem is not found', async () => {
      await request(app)
        .get(`/v1/order-items/${123}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
  describe('PATCH /v1/order-items/:orderItemId', () => {
    test('should return 404 if orderItem is not found', async () => {
      await request(app)
        .patch(`/v1/order-items/${123}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/order-items/:orderItemId', () => {
    test('should return 400 if orderItem is not found', async () => {
      await request(app)
        .delete(`/v1/order-items/${123}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
