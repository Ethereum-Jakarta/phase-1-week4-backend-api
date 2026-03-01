const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../src/app');
const { admin, insertUsers, userOne } = require('../fixtures/user.fixture');
const { orderOne, insertOrder } = require('../fixtures/order.fixture');
const { categoryOne, insertCategory } = require('../fixtures/category.fixture');
const { orderItemOne, insertOrderItems } = require('../fixtures/order-item.fixture');
const { productOne, insertProducts } = require('../fixtures/product.fixture');
const { adminAccessToken } = require('../fixtures/token.fixture');

describe('orderItem routes', () => {
  let newOrderItem;
  beforeEach(async () => {
    await insertUsers([admin, userOne]);
    await insertCategory([categoryOne]);
    await insertProducts([productOne]);
    await insertOrder([orderOne]);
    await insertOrderItems([orderItemOne]);

    newOrderItem = {
      orderId: orderOne.id,
      productId: productOne.id,
      quantity: faker.number.int({ min: 1, max: 100 }),
      unitPrice: faker.number.float({ min: 10, max: 10000 }),
    };
  });

  describe('GET & POST /api/order-items', () => {
    test('should return 200 OK if success get orderItems', async () => {
      const res = await request(app).get('/api/order-items').set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success get OrderItems!',
        data: expect.any(Array),
        error: null,
      });
    });

    test('should return 201 CREATED if success create orderItem', async () => {
      const res = await request(app)
        .post('/api/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem);

      expect(res.body).toEqual({
        status: 201,
        message: 'Success create OrderItem!',
        data: expect.objectContaining({
          id: expect.any(String),
          orderId: newOrderItem.orderId,
          productId: newOrderItem.productId,
          quantity: newOrderItem.quantity,
          unitPrice: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        error: null,
      });
    });
  });

  describe('/api/order-items/:id', () => {
    test('should return 200 OK, if success get orderItems by id', async () => {
      const res = await request(app)
        .get(`/api/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success get OrderItem!',
        data: expect.objectContaining({
          id: orderItemOne.id,
          orderId: orderOne.id,
          productId: productOne.id,
          quantity: orderItemOne.quantity,
          unitPrice: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        error: null,
      });
    });

    test('Should return 200 and successfully update orderItems by id', async () => {
      const updatedOrderItemData = {
        unitPrice: faker.number.float({ min: 50, max: 5000 }),
        orderId: orderItemOne.orderId,
        productId: orderItemOne.productId,
        quantity: orderItemOne.quantity,
      };

      const res = await request(app)
        .put(`/api/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedOrderItemData);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success update OrderItem!',
        data: expect.objectContaining({
          id: orderItemOne.id,
          orderId: orderItemOne.orderId,
          productId: orderItemOne.productId,
          quantity: orderItemOne.quantity,
          unitPrice: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        error: null,
      });
    });

    test('should return 200 OK if success delete orderItems by id', async () => {
      const res = await request(app)
        .delete(`/api/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success delete OrderItem!',
        data: expect.objectContaining({
          id: orderItemOne.id,
        }),
        error: null,
      });
    });
  });

  describe('ERROR TEST', () => {
    test('should return 400 BAD REQUEST if created orderItem with no orderId', async () => {
      newOrderItem = {
        productId: productOne.id,
        quantity: faker.number.int({ min: 1, max: 100 }),
        unitPrice: faker.number.float({ min: 10, max: 1000 }),
      };

      const res = await request(app)
        .post('/api/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem);

      expect(res.body).toEqual({
        status: 400,
        message: 'Validation Error',
        data: null,
        error: expect.any(String),
      });
    });

    test('should return 400 BAD REQUEST if created orderItem with no productId', async () => {
      newOrderItem = {
        orderId: orderOne.id,
        quantity: faker.number.int({ min: 1, max: 100 }),
        unitPrice: faker.number.float({ min: 10, max: 1000 }),
      };

      const res = await request(app)
        .post('/api/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem);

      expect(res.body).toEqual({
        status: 400,
        message: 'Validation Error',
        data: null,
        error: expect.any(String),
      });
    });

    test('should return 401 error unauthorized if no bearer access token', async () => {
      const res = await request(app).get('/api/order-items');
      expect(res.body.message).toBe('Authorization header missing');
    });

    test('should return 404 NOT FOUND if no orderItem is found', async () => {
      const res = await request(app).get(`/api/order-items/unknownId`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 404,
        message: 'OrderItem not found.',
        data: null,
        error: null,
      });
    });
  });
});
