const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const prisma = require('../../prisma');
const { adminAccessToken } = require('../fixtures/token.fixture');
const { insertUsers, admin } = require('../fixtures/user.fixture');
const { insertOrders } = require('../fixtures/order.fixture');
const { v4 } = require('uuid');

describe('Orders Route', () => {
  let createOrder, newOrder;
  beforeEach(async () => {
    await insertUsers([admin]);

    createOrder = {
      date: '2023-09-30T04:20:37.556Z',
      customerName: 'string',
      customerEmail: 'string@gmail.com',
      userId: admin.id,
    };

    newOrder = {
      id: v4(),
      date: '2023-09-30T04:20:37.556Z',
      customerName: 'string',
      customerEmail: 'string@gmail.com',
      userId: admin.id,
    };
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('Authentication', () => {
    test('should return 401 error if token not exist', async () => {
      await request(app).get('/api/orders').set('Authorization', `Bearer invalid-token`).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('/api/orders', () => {
    describe('GET', () => {
      test('should return 200 ok', async () => {
        await request(app).get('/api/products').set('Authorization', `Bearer ${adminAccessToken}`).expect(httpStatus.OK);
      });
    });

    describe('POST', () => {
      test('should return 201 created', async () => {
        const res = await request(app)
          .post('/api/orders')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(createOrder)
          .expect(httpStatus.CREATED);

        const order = res.body.data;

        expect(order).toEqual({
          ...order,
          id: expect.anything(),
          date: expect.anything(),
          userId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbOrder = await prisma.order.findUnique({
          where: { id: order.id },
        });

        expect(dbOrder).toBeDefined();
        expect(dbOrder).toMatchObject({
          ...order,
          id: expect.anything(),
          date: expect.anything(),
          userId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });
  });

  describe('/api/orders/:orderId', () => {
    describe('GET', () => {
      test('should return 200 ok', async () => {
        await insertOrders([newOrder]);

        const res = await request(app)
          .get(`/api/orders/${newOrder.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK);

        const order = res.body.data;

        expect(order).toEqual({
          ...order,
          id: expect.anything(),
          date: expect.anything(),
          userId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbOrder = await prisma.order.findUnique({
          where: { id: order.id },
        });

        expect(dbOrder).toBeDefined();
        expect(dbOrder).toMatchObject({
          ...order,
          id: expect.anything(),
          date: expect.anything(),
          userId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });

    describe('PUT', () => {
      test('should return 201 created', async () => {
        await insertOrders([newOrder]);

        const updateOrder = {
          customerName: 'new string',
          customerEmail: 'newstring@email.com',
          date: newOrder.date,
          userId: newOrder.userId
        };

        const res = await request(app)
          .put(`/api/orders/${newOrder.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateOrder)
          .expect(httpStatus.CREATED);

        const order = res.body.data;

        expect(order).toEqual({
          customerName: updateOrder.customerName,
          customerEmail: updateOrder.customerEmail,
          id: expect.anything(),
          date: expect.anything(),
          totalPrice: expect.anything(),
          userId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbOrder = await prisma.order.findUnique({
          where: { id: order.id },
        });

        expect(dbOrder).toBeDefined();
        expect(dbOrder).toMatchObject({
          ...order,
          id: expect.anything(),
          date: expect.anything(),
          userId: expect.anything(),
          totalPrice: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });

    describe('DELETE', () => {
      test('should return 204 no content', async () => {
        await insertOrders([newOrder]);
        await request(app)
          .delete(`/api/orders/${newOrder.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(204);
      });
    });

    describe('/api/orders/:orderId/order-item', () => {
      describe('GET', () => {
        test('should return 200 ok', async () => {
          await insertOrders([newOrder])
          await request(app)
            .get(`/api/orders/${newOrder.id}/order-items`)
            .set("Authorization", `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK)
        })
      })
    })
  });
});
