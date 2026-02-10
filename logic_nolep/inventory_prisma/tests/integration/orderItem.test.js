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

describe('Order-Item routes', () => {
  //Create User

  describe('POST /v1/order-items', () => {
    let newOrderItem;
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne]);
      await insertOrders([orderOne]);
      newOrderItem = {
        orderId: orderOne.id,
        productId: productOne.id,
        quantity:faker.datatype.number({ min: 1, max: 100 }),
        unitPrice: faker.datatype.float({ min: 10, max: 500, precision: 0.1 }),
      };
    });

    test('should return 201 and successfully add order items if request data is ok', async () => {
      const res = await request(app)
        .post('/v1/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.CREATED);

      const orderItemData = res.body.data;

      expect(orderItemData).toEqual({
        id: expect.anything(),
        orderId: newOrderItem.orderId,
        productId: newOrderItem.productId,
        quantity: newOrderItem.quantity,
        unitPrice: newOrderItem.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrderItem = await prisma.orderItem.findUnique({
        where: {
          id: orderItemData.id,
        },
      });

      expect(dbOrderItem).toBeDefined();

      expect(dbOrderItem).toMatchObject({
        id: expect.anything(),
        orderId: newOrderItem.orderId,
        productId: newOrderItem.productId,
        quantity: newOrderItem.quantity,
        unitPrice: newOrderItem.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 error if customer productId is undefined or null', async () => {
      newOrderItem.productId = undefined;

      await request(app)
        .post('/v1/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 403 error forbidden if user not admin', async () => {
      await request(app)
        .post('/v1/order-items')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).post('/v1/order-items').send(newOrderItem).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET v1/order-items', () => {
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne]);
      await insertOrders([orderOne]);
      await insertOrderItems([orderItemOne])
    });

    test('should return 200 and successfully get order items', async () => {
      const res = await request(app)
        .get('/v1/order-items?take=1&&skip=0')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data).toBeDefined();
      expect(res.body.data).not.toBeNull();
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).get('/v1/order-items').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .get('/v1/order-items')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('UPDATE v1/order-items/:orderItemId', () => {
    let newOrderItem;
    beforeEach(async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne, productTwo]);
      await insertOrders([orderOne, orderTwo]);
      await insertOrderItems([orderItemOne]);
      newOrderItem = {
        orderId: orderTwo.id,
        productId: productTwo.id,
        quantity: faker.datatype.number({ min: 1, max: 100 }),
        unitPrice: faker.datatype.float({ min: 10, max: 500, precision: 0.1 }),
      };
    });

    test('should return 200 and successfully update order', async () => {
      const res = await request(app)
        .patch(`/v1/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.OK);

      const orderItemData = res.body.data;

      expect(orderItemData).toEqual({
        id: expect.anything(),
        orderId: newOrderItem.orderId,
        productId: newOrderItem.productId,
        quantity: newOrderItem.quantity,
        unitPrice: newOrderItem.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbOrderItem = await prisma.orderItem.findUnique({
        where: {
          id: orderItemData.id,
        },
      });

      expect(dbOrderItem).toBeDefined();

      expect(dbOrderItem).toMatchObject({
        id: expect.anything(),
        orderId: newOrderItem.orderId,
        productId: newOrderItem.productId,
        quantity: newOrderItem.quantity,
        unitPrice: newOrderItem.unitPrice,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app)
        .patch(`/v1/order-items/${orderItemOne.id}`)
        .send(newOrderItem)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .patch(`/v1/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error Not found if order item not found', async () => {
      await request(app)
        .patch(`/v1/order-items/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newOrderItem)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET v1/order-items/:orderItemId', () => {
    beforeEach(async () => {
        await insertUsers([admin, userOne, userTwo]);
        await insertcategory([categoryOne, categoryTwo]);
        await insertProducts([productOne, productTwo]);
        await insertOrders([orderOne, orderTwo]);
        await insertOrderItems([orderItemOne]);
    });

    test('should return 200 and successfully get order', async () => {
      const res = await request(app)
        .get(`/v1/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

        const orderItemData = res.body.data;

        expect(orderItemData).toEqual({
          id: expect.anything(),
          orderId: orderItemOne.orderId,
          productId: orderItemOne.productId,
          quantity: orderItemOne.quantity,
          unitPrice: orderItemOne.unitPrice,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
  
        const dbOrderItem = await prisma.orderItem.findUnique({
          where: {
            id: orderItemData.id,
          },
        });
  
        expect(dbOrderItem).toBeDefined();
  
        expect(dbOrderItem).toMatchObject({
          id: expect.anything(),
          orderId: orderItemOne.orderId,
          productId: orderItemOne.productId,
          quantity: orderItemOne.quantity,
          unitPrice: orderItemOne.unitPrice,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app)
        .get(`/v1/order-items/${orderItemOne.id}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if order item not found', async () => {
      await request(app)
        .get(`/v1/order-items/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .get(`/v1/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('DELETE v1/order-items/:orderItemId', () => {
    beforeEach(async () => {
        await insertUsers([admin, userOne, userTwo]);
        await insertcategory([categoryOne, categoryTwo]);
        await insertProducts([productOne, productTwo]);
        await insertOrders([orderOne, orderTwo]);
        await insertOrderItems([orderItemOne]);
    });

    test('should return 200 and successfully delete order item', async () => {
      await request(app)
        .delete(`/v1/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app)
        .delete(`/v1/order-items/${orderItemOne.id}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if order item not found', async () => {
      await request(app)
        .delete(`/v1/order-items/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .delete(`/v1/order-items/${orderItemOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });
});
