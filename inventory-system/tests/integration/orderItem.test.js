const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const prisma = require('../../prisma');
const { adminAccessToken } = require('../fixtures/token.fixture');
const { insertUsers, admin, userOne } = require('../fixtures/user.fixture');
const { insertOrders } = require('../fixtures/order.fixture');
const { insertOrderItems } = require('../fixtures/orderitem.fixture');
const { insertCategory, categoryOne } = require('../fixtures/category.fixture');
const { v4 } = require('uuid');
const { insertProducts } = require('../fixtures/product.fixture');

describe('OrderItems Route', () => {
  let newOrderItem, createOrderItem;
  beforeEach(async () => {
    const newProduct = {
      id: v4(),
      name: 'string',
      description: 'string',
      price: 100,
      quantityInStock: 100,
      categoryId: categoryOne.id,
      userId: userOne.id,
    };

    const newOrder = {
      id: v4(),
      date: '2023-09-30T04:20:37.556Z',
      customerName: 'string',
      customerEmail: 'string@gmail.com',
      userId: admin.id,
    };

    await insertUsers([admin]);
    await insertCategory([categoryOne]);
    await insertOrders([newOrder]);
    await insertProducts([newProduct]);

    createOrderItem = {
      orderId: newOrder.id,
      productId: newProduct.id,
      quantity: 100,
      unitPrice: 100,
    };

    newOrderItem = {
      id: v4(),
      orderId: newOrder.id,
      productId: newProduct.id,
      quantity: 100,
      unitPrice: 100,
    };
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.order.deleteMany();
  });

  describe('Authentication', () => {
    test('should return 401 error if token not exist', async () => {
      await request(app)
        .get('/api/order-items')
        .set('Authorization', `Bearer invalid-token`)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('/api/order-items', () => {
    describe('GET', () => {
      test('should return 200 ok', async () => {
        await request(app).get('/api/order-items').set('Authorization', `Bearer ${adminAccessToken}`).expect(httpStatus.OK);
      });
    });
    describe('POST', () => {
      test('should return 201 created', async () => {
        const res = await request(app)
          .post('/api/order-items')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(createOrderItem)
          .expect(httpStatus.CREATED);

        console.info(res);

        const orderItem = res.body.data;

        expect(orderItem).toEqual({
          id: expect.anything(),
          quantity: createOrderItem.quantity,
          unitPrice: createOrderItem.unitPrice,
          productId: expect.anything(),
          orderId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbOrderItem = await prisma.orderItem.findUnique({
          where: { id: orderItem.id },
        });

        expect(dbOrderItem).toBeDefined();
        expect(dbOrderItem).toMatchObject({
          id: expect.anything(),
          quantity: orderItem.quantity,
          unitPrice: orderItem.unitPrice,
          productId: expect.anything(),
          orderId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });
  });
  describe('/api/order-items/:orderItemId', () => {
    describe('INVALID REQUEST /:orderItemId', () => {
      test('should return 400 error if orderItemId invalid', async () => {
        await request(app)
          .get('/api/order-items/invalid-orderItemId')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.BAD_REQUEST);
      });
    });
    describe('GET', () => {
      test('should return 200 ok', async () => {
        await insertOrderItems([newOrderItem]);
        const res = await request(app)
          .get(`/api/order-items/${newOrderItem.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK);

        const orderItem = res.body.data;

        expect(orderItem).toEqual({
          id: expect.anything(),
          quantity: newOrderItem.quantity,
          unitPrice: newOrderItem.unitPrice,
          productId: expect.anything(),
          orderId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbOrderItem = await prisma.orderItem.findUnique({
          where: { id: orderItem.id },
        });

        expect(dbOrderItem).toBeDefined();
        expect(dbOrderItem).toMatchObject({
          id: expect.anything(),
          quantity: orderItem.quantity,
          unitPrice: orderItem.unitPrice,
          productId: expect.anything(),
          orderId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });
    describe('PUT', () => {
      test('should return 201 created', async () => {
        await insertOrderItems([newOrderItem]);

        const updateOrderitem = {
          quantity: 50,
          unitPrice: 50,
          orderId: newOrderItem.orderId,
          productId: newOrderItem.productId,
        };

        const res = await request(app)
          .put(`/api/order-items/${newOrderItem.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateOrderitem)
          .expect(httpStatus.CREATED);

        const orderItem = res.body.data;

        expect(orderItem).toEqual({
          id: expect.anything(),
          quantity: updateOrderitem.quantity,
          unitPrice: updateOrderitem.unitPrice,
          productId: expect.anything(),
          orderId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbOrderItem = await prisma.orderItem.findUnique({
          where: { id: orderItem.id },
        });

        expect(dbOrderItem).toBeDefined();
        expect(dbOrderItem).toMatchObject({
          id: expect.anything(),
          quantity: orderItem.quantity,
          unitPrice: orderItem.unitPrice,
          productId: expect.anything(),
          orderId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });
    describe('DELETE', () => {
      test('should return 204 no content', async () => {
        await insertOrderItems([newOrderItem]);
        await request(app)
          .delete(`/api/order-items/${newOrderItem.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(204);
      });
    });
  });
});
