const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, admin, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { orderOne, orderTwo, insertOrders } = require('../fixtures/order.fixture');
const { productOne, productTwo, insertProducts } = require('../fixtures/product.fixture');
const { categoryOne, categoryTwo, insertcategory } = require('../fixtures/category.fixture');
const { orderItemOne, orderItemTwo, insertOrderItems } = require('../fixtures/orderItem.fixture');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

describe('Orders routes', () => {
  //Create User

  describe('POST /v1/orders', () => {
    let newOrder;
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      newOrder = {
        date: faker.date.recent(),
        totalPrice: faker.datatype.float({ min: 50, max: 1000, precision: 0.1 }),
        customerName: faker.name.findName(),
        customerEmail: faker.internet.email(),
        userId: userOne.id,
      };
    });

    test('should return 201 and successfully add order if request data is ok', async () => {
      const res = await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrder)
        .expect(httpStatus.CREATED);

      const orderData = res.body.data;

      expect(orderData).toEqual({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: newOrder.totalPrice,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        userId: newOrder.userId,
        orderItems: expect.arrayContaining([]),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrder = await prisma.order.findUnique({
        where: {
          id: orderData.id,
        },
      });

      expect(dbOrder).toBeDefined();

      expect(dbOrder).toMatchObject({
        id: expect.anything(),
        date: newOrder.date,
        totalPrice: newOrder.totalPrice,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        userId: newOrder.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 error if customer name is undefined or null', async () => {
      newOrder.customerName = undefined;

      await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrder)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 403 error forbidden if user not admin', async () => {
      await request(app)
        .post('/v1/orders')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newOrder)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).post('/v1/orders').send(newOrder).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET v1/orders', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
      await insertOrders([orderOne, orderTwo]);
    });

    test('should return 200 and successfully get orders', async () => {
      const res = await request(app)
        .get('/v1/orders?take=1&&skip=1')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data).toBeDefined();
      expect(res.body.data).not.toBeNull();
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).get('/v1/orders').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app).get('/v1/orders').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.FORBIDDEN);
    });
  });

  describe('UPDATE v1/orders/:orderId', () => {
    let newOrder;
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await insertOrders([orderOne]);
      newOrder = {
        date: faker.date.recent(),
        totalPrice: faker.datatype.float({ min: 50, max: 1000, precision: 0.1 }),
        customerName: faker.name.findName(),
        customerEmail: faker.internet.email(),
        userId: userOne.id,
      };
    });

    test('should return 200 and successfully update order', async () => {
      const res = await request(app)
        .patch(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrder)
        .expect(httpStatus.OK);

      const orderData = res.body.data;

      expect(orderData).toEqual({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: newOrder.totalPrice,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        userId: newOrder.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrder = await prisma.order.findUnique({
        where: {
          id: orderData.id,
        },
      });

      expect(dbOrder).toBeDefined();

      expect(dbOrder).toMatchObject({
        id: expect.anything(),
        date: newOrder.date,
        totalPrice: newOrder.totalPrice,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        userId: newOrder.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).patch(`/v1/orders/${orderOne.id}`).send(newOrder).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .patch(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newOrder)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error Not found if order not found', async () => {
      await request(app)
        .patch(`/v1/orders/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrder)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET v1/orders/:orderId', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin]);
      await insertOrders([orderOne]);
    });

    test('should return 200 and successfully get order', async () => {
      const res = await request(app)
        .get(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      const orderData = res.body.data;

      expect(orderData).toEqual({
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: orderOne.totalPrice,
        customerName: orderOne.customerName,
        customerEmail: orderOne.customerEmail,
        userId: orderOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrder = await prisma.order.findUnique({
        where: {
          id: orderData.id,
        },
      });

      expect(dbOrder).toBeDefined();

      expect(dbOrder).toMatchObject({
        id: expect.anything(),
        date: orderOne.date,
        totalPrice: orderOne.totalPrice,
        customerName: orderOne.customerName,
        customerEmail: orderOne.customerEmail,
        userId: orderOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).get(`/v1/orders/${orderOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if order not found', async () => {
      await request(app)
        .get(`/v1/orders/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .get(`/v1/orders/${userTwo.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('DELETE v1/orders/:orderId', () => {
    beforeEach(async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertOrders([orderOne]);
    });

    test('should return 200 and successfully delete order', async () => {
      const res = await request(app)
        .delete(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).delete(`/v1/orders/${orderOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if order not found', async () => {
      await request(app)
        .delete(`/v1/orders/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .delete(`/v1/orders/${orderOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });


  describe('GET v1/orders/:orderId/order-items', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertOrders([orderOne]);
      await insertProducts([productOne]);
      await insertOrderItems([orderItemOne]);
    });

    test('should return 200 and successfully get order item by order', async () => {
      const res = await request(app)
        .get(`/v1/orders/${orderOne.id}/order-items`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

        const orderItemData = res.body.data;

        expect(orderItemData).toEqual([{
          id: expect.anything(),
          orderId: orderOne.id,
          productId: orderItemOne.productId,
          quantity: orderItemOne.quantity,
          unitPrice: orderItemOne.unitPrice,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        }]);
  
        const dbOrderItem = await prisma.orderItem.findMany({
          where: {
            id: orderItemData.id,
          },
        });
  
        expect(dbOrderItem).toBeDefined();
  
        expect(dbOrderItem).toMatchObject([{
          id: expect.anything(),
          orderId: orderOne.id,
          productId: orderItemOne.productId,
          quantity: orderItemOne.quantity,
          unitPrice: orderItemOne.unitPrice,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        }]);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).get(`/v1/orders/${orderOne.id}/order-items`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if order not found', async () => {
      await request(app)
        .get(`/v1/orders/${v4()}/order-items`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .get(`/v1/orders/${orderOne.id}/order-items`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });
});
