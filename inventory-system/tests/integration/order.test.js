const request = require('supertest');
const httpStatus = require('http-status');
const { faker } = require('@faker-js/faker');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');
const { insertOrders, orderOne } = require('../fixtures/order.fixture');

describe('Order Routes', () => {
  let newOrder;
  beforeEach(async () => {
    await insertUsers([admin]);
    await insertOrders(userOne, [orderOne]);

    newOrder = {
      date: faker.date.recent(),
      totalPrice: 0,
    };
  });

  describe('Authorization', () => {
    test('should return 403 if access token is not admin', async () => {
      await request(app).get('/v1/orders').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.FORBIDDEN);
    });
    test('should return 401 if no access token', async () => {
      await request(app).get('/v1/orders').expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /v1/orders', () => {
    test('Should return 200 and success create order', async () => {
      const res = await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ ...newOrder, customerName: userOne.name, customerEmail: userOne.email, userId: userOne.id })
        .expect(httpStatus.OK);

      const orderData = res.body.data;

      expect(orderData).toMatchObject({
        date: expect.anything(),
        totalPrice: newOrder.totalPrice,
        customerName: userOne.name,
        customerEmail: userOne.email,
        userId: userOne.id,
      });
    });
  });

  describe('GET /v1/orders/', () => {
    test('should return 200 and all orders', async () => {
      await request(app).get('/v1/orders').set('Authorization', `Bearer ${adminAccessToken}`).expect(httpStatus.OK);
    });
  });

  describe('GET /v1/orders/:orderId', () => {
    test('should return 200 and order based on the given id', async () => {
      await request(app)
        .get(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);
    });
    test('Should return 404 if id is invalid', async () => {
      await request(app)
        .get(`/v1/orders/${123}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /v1/orders/:orderId', () => {
    test('should return 200 and success update order', async () => {
      const res = await request(app)
        .patch(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ customerName: 'example' })
        .expect(httpStatus.OK);

      const orderData = res.body.data;

      expect(orderData).toMatchObject({
        date: expect.anything(),
        totalPrice: newOrder.totalPrice,
        customerName: 'example',
        customerEmail: userOne.email,
        userId: userOne.id,
      });
    });

    test('should return 400 if id is invalid', async () => {
      await prisma.order.deleteMany({});
      await request(app)
        .patch(`/v1/orders/${123}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ customerName: 'example' })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/orders/:orderId', () => {
    test('should return 200 and success delete data', async () => {
      const res = await request(app)
        .delete(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      const orderData = res.body.data;
      const dbData = await prisma.order.findUnique({
        where: { id: orderData.id },
      });

      expect(dbData).toEqual(null);
    });

    test('should return 400 if id is invalid', async () => {
      await request(app)
        .delete(`/v1/orders/${123}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
