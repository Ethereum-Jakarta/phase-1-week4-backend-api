const request = require('supertest'); // Request HTTP
const faker = require('faker'); // Fake data
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, admin, insertUsers, deleteAll } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, insertCategories } = require('../fixtures/category.fixture');
const { orderOne, insertOrders } = require('../fixtures/order.fixture');
const { productOne, insertProducts } = require('../fixtures/product.fixture');
const { orderItemOne, insertOrderItems, deleteOrderItems } = require('../fixtures/orderItem.fixture');
const prisma = require('../../prisma');

describe('Order-Item Routes', () => {
  let newOrderItem = null;
  beforeEach(async () => {
    await insertUsers([userOne, admin]);
    await insertCategories([categoryOne]);
    await insertProducts(userOne.id, categoryOne.id, [productOne]);
    await insertOrders(userOne.id, [orderOne]);
    await insertOrderItems([orderItemOne]);

    newOrderItem = {
      orderId: orderOne.id,
      productId: productOne.id,
      quantity: faker.datatype.number({ min: 1, max: 4 }),
    };
  });

  afterEach(async () => {
    await deleteAll();
  });

  describe('Authentication and CRUD test', () => {
    describe('Authentication', () => {
      test('Should return 401 error if no access token', async () => {
        await request(app).get('/v1/order-items').expect(httpStatus.UNAUTHORIZED);
      });

      // POST
      test('Should return 401 if role is not admin', async () => {
        await request(app)
          .post('/v1/order-items')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.UNAUTHORIZED);
      });

      // GET
      test('Should return 401 if role is not admin', async () => {
        await request(app)
          .get('/v1/order-items')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.UNAUTHORIZED);
      });

      // PUT
      test('Should return 401 if role is not admin', async () => {
        await request(app)
          .put(`/v1/order-items/${orderItemOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.UNAUTHORIZED);
      });

      // DELETE
      test('Should return 401 if role is not admin', async () => {
        await request(app)
          .delete(`/v1/order-items/${orderItemOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.UNAUTHORIZED);
      });
    });

    describe('CRUD test', () => {
      describe('POST Order-Item', () => {
        test('Should return 201 if request body is valid, ids are valid and role is admin', async () => {
          const res = await request(app)
            .post('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrderItem)
            .expect(httpStatus.CREATED);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            orderId: orderOne.id,
            productId: productOne.id,
            quantity: newOrderItem.quantity,
            unitPrice: productOne.price,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbOrderItem = await prisma.orderItem.findUnique({
            where: {
              id: resData.id,
            },
          });

          expect(dbOrderItem).toBeDefined();
          expect(dbOrderItem).toMatchObject({
            id: expect.anything(),
            orderId: orderOne.id,
            productId: productOne.id,
            quantity: newOrderItem.quantity,
            unitPrice: productOne.price,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 404 if one of the ids is not valid', async () => {
          newOrderItem.orderId = faker.datatype.uuid();
          await request(app)
            .post('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrderItem)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 400 if quantity exceeds available stock', async () => {
          newOrderItem.quantity = 1000;
          await request(app)
            .post('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrderItem)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if one of the ids is not a valid UUID', async () => {
          newOrderItem.productId = 'Invalid UUID';
          await request(app)
            .post('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrderItem)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body is not a valid data type', async () => {
          newOrderItem.quantity = 'Must be a number';
          await request(app)
            .post('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrderItem)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body is empty', async () => {
          await request(app)
            .post('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({})
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('GET Order-Item', () => {
        test('Should return 200 if database is not empty and role is admin', async () => {
          const res = await request(app)
            .get('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).not.toBeNull();
          expect(resData).toEqual([
            {
              id: expect.anything(),
              orderId: orderOne.id,
              productId: productOne.id,
              quantity: orderItemOne.quantity,
              unitPrice: productOne.price,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            },
          ]);
        });

        test('Should return 200 if role is admin and params orderItemId is exists', async () => {
          const res = await request(app)
            .get(`/v1/order-items/${orderItemOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).not.toBeNull();
          expect(resData).toEqual({
            id: expect.anything(),
            orderId: orderOne.id,
            productId: productOne.id,
            quantity: orderItemOne.quantity,
            unitPrice: productOne.price,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 200 if role is admin and request query is ok', async () => {
          const arrayOfValidOrderBy = ['quantity:asc', 'quantity:desc', 'unitPrice:asc', 'unitPrice:desc'];
          // Get the random index
          const randomIndex = Math.floor(Math.random() * arrayOfValidOrderBy.length);
          const res = await request(app)
            .get('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .query({
              page: 0,
              size: 10,
              quantity: orderItemOne.quantity,
              orderBy: arrayOfValidOrderBy[randomIndex],
            })
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).not.toBeNull();
          expect(resData).toEqual([
            {
              id: expect.anything(),
              orderId: orderOne.id,
              productId: productOne.id,
              quantity: orderItemOne.quantity,
              unitPrice: productOne.price,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            },
          ]);
        });

        test('Should return 404 if database is empty', async () => {
          await deleteOrderItems();
          await request(app)
            .get('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 404 if params orderItemId is not exists', async () => {
          await request(app)
            .get(`/v1/order-items/${faker.datatype.uuid()}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 400 if params is not a valid UUID', async () => {
          const res = await request(app)
            // Set invalid UUID
            .get('/v1/order-items/invalidUUID')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if query is not valid', async () => {
          await request(app)
            .get('/v1/order-items')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .query({
              notValidQuery: orderOne.customerName,
            })
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if query data is not a valid data types', async () => {
          await request(app)
            .get('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .query({
              page: 'notValidDataTypes',
              size: 'mustBeANumber',
              quantitu: 'thisMustBeANumberToo',
            })
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('PUT Order-Item', () => {
        test('Should return 200 if id is found and request body is valid', async () => {
          const res = await request(app)
            .put(`/v1/order-items/${orderItemOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({
              quantity: 2,
            })
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            orderId: orderOne.id,
            productId: productOne.id,
            quantity: 2,
            unitPrice: productOne.price,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbOrderItem = await prisma.orderItem.findUnique({
            where: {
              id: orderItemOne.id,
            },
          });

          expect(dbOrderItem).toBeDefined();
          expect(dbOrderItem).toMatchObject({
            id: expect.anything(),
            orderId: orderOne.id,
            productId: productOne.id,
            quantity: 2,
            unitPrice: productOne.price,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 404 if id is not found', async () => {
          await request(app)
            .put(`/v1/order-items/${faker.datatype.uuid()}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({
              quantity: 2,
            })
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 400 if request body is empty', async () => {
          await request(app)
            .put(`/v1/order-items/${orderItemOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({})
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body is not valid', async () => {
          await request(app)
            .put(`/v1/order-items/${orderItemOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({
              notValidKey: 'notValidValue',
            })
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body data type is not valid', async () => {
          await request(app)
            .put(`/v1/order-items/${orderItemOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({
              quatity: 'Invalid data type',
            })
            .expect(httpStatus.BAD_REQUEST);
        });
      });
      describe('DELETE Order-Item', () => {
        test('Should return 200 if id is found', async () => {
          const res = await request(app)
            .delete(`/v1/order-items/${orderItemOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toBeNull();

          const dbOrderItem = await prisma.orderItem.findUnique({
            where: {
              id: orderItemOne.id,
            },
          });

          expect(dbOrderItem).toBeNull();
        });

        test('Should return 400 if id is not a valid UUID', async () => {
          await request(app)
            .delete('/v1/order-items/notValidUUID')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 404 if id is not found', async () => {
          await request(app)
            .delete(`/v1/order-items/${faker.datatype.uuid()}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });
      });
    });
  });
});
