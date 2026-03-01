const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../src/app');
const { insertUsers, admin, userOne, userTwo } = require('../fixtures/user.fixture');
const { orderOne, insertOrder } = require('../fixtures/order.fixture');
const { adminAccessToken } = require('../fixtures/token.fixture');

describe('Order routes', () => {
  let newOrder;

  beforeEach(async () => {
    await insertUsers([admin, userOne, userTwo]);
    newOrder = {
      customerName: faker.person.fullName(),
      customerEmail: faker.internet.email(),
      userId: userOne.id,
      totalPrice: parseFloat(faker.finance.amount(10, 1000, 2)),
    };
  });

  describe('POST & GET /api/orders', () => {
    test('should return 200 and successfully GET orders', async () => {
      await insertOrder([orderOne]);
      const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Success get Orders!',
          data: expect.any(Array),
          error: null,
        })
      );
    });

    test('should return 201 if successfully created order', async () => {
      const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${adminAccessToken}`).send(newOrder);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 201,
          message: 'Success create Order!',
          data: expect.objectContaining({
            id: expect.any(String),
            totalPrice: expect.any(Number),
            customerName: newOrder.customerName,
            customerEmail: newOrder.customerEmail,
            userId: newOrder.userId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
          error: null,
        })
      );
    });
  });

  describe('/api/orders/:id', () => {
    beforeEach(async () => {
      await insertOrder([orderOne]);
    });

    test('should return 200 and successfully get order by ID', async () => {
      const res = await request(app).get(`/api/orders/${orderOne.id}`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Success get Order!',
          data: expect.objectContaining({
            id: orderOne.id,
            customerName: orderOne.customerName,
            customerEmail: orderOne.customerEmail,
            totalPrice: expect.any(Number),
            userId: orderOne.userId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
          error: null,
        })
      );
    });

    test('should return 200 and successfully delete order by ID', async () => {
      const res = await request(app).delete(`/api/orders/${orderOne.id}`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Success delete Order!',
          data: expect.objectContaining({
            id: orderOne.id,
            customerName: orderOne.customerName,
            customerEmail: orderOne.customerEmail,
            totalPrice: expect.any(Number),
            userId: orderOne.userId,
          }),
          error: null,
        })
      );
    });
  });

  describe('ERROR HANDLING', () => {
    test('should return 400 if creating order without required fields', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ customerName: 'Test User' });

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
      const res = await request(app).get('/api/orders');
      expect(res.body.message).toBe('Authorization header missing');
    });

    test('should return 404 if order ID not found', async () => {
      const res = await request(app).get(`/api/orders/invalid-id`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 404,
          message: 'Order not found.',
          data: null,
          error: null,
        })
      );
    });
  });
});
