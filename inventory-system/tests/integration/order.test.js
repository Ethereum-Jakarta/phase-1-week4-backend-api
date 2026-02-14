const request = require('supertest');
const httpStatus = require('http-status');
const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');
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
  describe('POST', () => {
    test('Should return 201 and created order', async () => {
      const res = await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ ...newOrder, customerName: userOne.name, customerEmail: userOne.email, userId: userOne.id })
        .expect(httpStatus.CREATED);

      const orderData = res.body.data;

      expect(orderData).toMatchObject({
        date: expect.anything(),
        totalPrice: newOrder.totalPrice,
        customerName: userOne.name,
        customerEmail: userOne.email,
        userId: userOne.id,
      });
    });
    test('Should return 401 if access token is invalid', async () => {
      await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer invalidtoken`)
        .send({ ...newOrder, customerName: userOne.name, customerEmail: userOne.email, userId: userOne.id })
        .expect(httpStatus.UNAUTHORIZED);
    });
    test('Should return 403 if access token is not admin', async () => {
      await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ ...newOrder, customerName: userOne.name, customerEmail: userOne.email, userId: userOne.id })
        .expect(httpStatus.FORBIDDEN);
    });
    test('Should return 400 if date is missing', async () => {
      delete newOrder.date;

      await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ ...newOrder, customerName: userOne.name, customerEmail: userOne.email, userId: userOne.id })
        .expect(httpStatus.BAD_REQUEST);
    });
  });
  describe('GET', () => {
    test('Should return 200 and list of orders', async () => {
      await request(app).get('/v1/orders').set('Authorization', `Bearer ${adminAccessToken}`).expect(httpStatus.OK);
    });
    test('Should return 401 if access token is invalid', async () => {
      await request(app).get('/v1/orders').set('Authorization', `Bearer invalidtoken`).expect(httpStatus.UNAUTHORIZED);
    });
    test('Should return 403 if access token is not admin', async () => {
      await request(app).get('/v1/orders').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.FORBIDDEN);
    });
    test('Should return 404 if order is not found', async () => {
      await prisma.order.deleteMany({});

      await request(app).get('/v1/orders').set('Authorization', `Bearer ${adminAccessToken}`).expect(httpStatus.NOT_FOUND);
    });
  });
  describe('GET:id', () => {
    test('Should return 200 and a order', async () => {
      await request(app)
        .get(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);
    });
    test('Should return 401 if access token is invalid', async () => {
      await request(app)
        .get(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer invalidtoken`)
        .expect(httpStatus.UNAUTHORIZED);
    });
    test('Should return 403 if access token is not admin', async () => {
      await request(app)
        .get(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
    test('Should return 404 if order is not found', async () => {
      await prisma.order.deleteMany({});
      await request(app)
        .get(`/v1/orders/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
    test('Should return 400 if ID is not an UUID', async () => {
      await request(app)
        .get(`/v1/orders/123`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
  describe('PATCH:id', () => {
    test('Should return 200 and an a order', async () => {
      const res = await request(app)
        .patch(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ customerName: 'Udin Jangor' })
        .expect(httpStatus.OK);

      const orderData = res.body.data;

      expect(orderData).toMatchObject({
        date: expect.anything(),
        totalPrice: newOrder.totalPrice,
        customerName: 'Udin Jangor',
        customerEmail: userOne.email,
        userId: userOne.id,
      });
    });
    test('Should return 401 if access token is invalid', async () => {
      await request(app)
        .patch(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer invalidtoken`)
        .send({ customerName: 'Udin Jangor' })
        .expect(httpStatus.UNAUTHORIZED);
    });
    test('Should return 403 if access token is not admin', async () => {
      await request(app)
        .patch(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ customerName: 'Udin Jangor' })
        .expect(httpStatus.FORBIDDEN);
    });
    test('Should return 404 if order is not found', async () => {
      await prisma.order.deleteMany({});

      await request(app)
        .patch(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ customerName: 'Udin Jangor' })
        .expect(httpStatus.NOT_FOUND);
    });
    test('Should return 400 if ID is not an UUID', async () => {
      await request(app)
        .patch(`/v1/orders/123`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ customerName: 'Udin Jangor' })
        .expect(httpStatus.BAD_REQUEST);
    });
  });
  describe('DELETE:id', () => {
    test('Should return 200 and an a null', async () => {
      const res = await request(app)
        .delete(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      const orderData = res.body.data;

      expect(orderData).toBeNull();
    });
    test('Should return 401 if access token is invalid', async () => {
      await request(app)
        .delete(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer invalidtoken`)
        .expect(httpStatus.UNAUTHORIZED);
    });
    test('Should return 403 if access token is not admin', async () => {
      await request(app)
        .delete(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
    test('Should return 404 if order is not found', async () => {
      await prisma.order.deleteMany({});

      await request(app)
        .delete(`/v1/orders/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
    test('Should return 400 if ID is not an UUID', async () => {
      await request(app)
        .delete(`/v1/orders/123`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
