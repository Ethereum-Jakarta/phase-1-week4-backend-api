const request = require('supertest'); // Request HTTP
const faker = require('faker'); // Fake data
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { orderOne, insertOrders, deleteOrders } = require('../fixtures/order.fixture');
const prisma = require('../../prisma');

describe('Order Routes', () => {
  let newOrder = null;
  beforeEach(async () => {
    await insertUsers([userOne, admin]);
    await insertOrders(userOne.id, [orderOne]);

    newOrder = {
      date: faker.date.recent(),
      totalPrice: 0,
      customerName: faker.name.findName(),
      customerEmail: faker.internet.email().toLowerCase(),
      userId: userOne.id,
    };
  });
  afterEach(async () => {
    await deleteOrders();
  });

  describe('Authentication and CRUD test', () => {
    describe('Authentication', () => {
      test('Should return 401 error if no access token', async () => {
        await request(app).get('/v1/orders').expect(httpStatus.UNAUTHORIZED);
      });

      // POST
      test('Should return 401 if role is not admin', async () => {
        await request(app)
          .post('/v1/orders')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.UNAUTHORIZED);
      });

      // GET
      test('Should return 401 if role is not admin', async () => {
        await request(app)
          .get('/v1/orders')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.UNAUTHORIZED);
      });

      // PUT
      test('Should return 401 if role is not admin', async () => {
        await request(app)
          .put(`/v1/orders/${orderOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.UNAUTHORIZED);
      });

      // DELETE
      test('Should return 401 if role is not admin', async () => {
        await request(app)
          .delete(`/v1/orders/${orderOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.UNAUTHORIZED);
      });
    });

    describe('CRUD test', () => {
      describe('POST Order', () => {
        test('Should return 201 if request body is valid and role is admin', async () => {
          const res = await request(app)
            .post('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrder)
            .expect(httpStatus.CREATED);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            date: expect.anything(),
            totalPrice: newOrder.totalPrice,
            customerName: newOrder.customerName,
            customerEmail: newOrder.customerEmail,
            userId: newOrder.userId,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbOrder = await prisma.orders.findUnique({
            where: {
              id: resData.id,
            },
          });

          expect(dbOrder).toBeDefined();
          expect(dbOrder).toMatchObject({
            id: expect.anything(),
            date: expect.anything(),
            totalPrice: newOrder.totalPrice,
            customerName: newOrder.customerName,
            customerEmail: newOrder.customerEmail,
            userId: newOrder.userId,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 404 if userId is not found', async () => {
          newOrder.userId = faker.datatype.uuid();
          await request(app)
            .post('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrder)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 400 if userId is not a valid UUID', async () => {
          newOrder.userId = 'invalidUUID';
          await request(app)
            .post('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrder)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body is not valid data type', async () => {
          newOrder.date = 'invalidDate';
          await request(app)
            .post('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrder)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body is not complete', async () => {
          delete newOrder.customerName;
          await request(app)
            .post('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(newOrder)
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('GET Orders', () => {
        test('Should return 200 if database is not empty and role is admin', async () => {
          const res = await request(app)
            .get('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).not.toBeNull();
          expect(resData).toEqual([
            {
              id: expect.anything(),
              date: expect.anything(),
              totalPrice: orderOne.totalPrice,
              customerName: orderOne.customerName,
              customerEmail: orderOne.customerEmail,
              userId: userOne.id,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            },
          ]);
        });

        test('Should return 200 if role is admin and params orderId is exists', async () => {
          const res = await request(app)
            .get(`/v1/orders/${orderOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).not.toBeNull();
          expect(resData).toEqual({
            id: expect.anything(),
            date: expect.anything(),
            totalPrice: orderOne.totalPrice,
            customerName: orderOne.customerName,
            customerEmail: orderOne.customerEmail,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 200 if role is admin and request query is ok', async () => {
          const arrayOfValidOrderBy = [
            'date:asc',
            'date:desc',
            'totalPrice:asc',
            'totalPrice:desc',
            'customerName:asc',
            'customerName:desc',
            'customerEmail:asc',
            'customerEmail:desc',
          ];
          // Get the random index
          const randomIndex = Math.floor(Math.random() * arrayOfValidOrderBy.length);
          const res = await request(app)
            .get('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .query({
              page: 0,
              size: 10,
              userId: userOne.id,
              orderBy: arrayOfValidOrderBy[randomIndex],
            })
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).not.toBeNull();
          expect(resData).toEqual([
            {
              id: expect.anything(),
              date: expect.anything(),
              totalPrice: orderOne.totalPrice,
              customerName: orderOne.customerName,
              customerEmail: orderOne.customerEmail,
              userId: userOne.id,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            },
          ]);
        });

        test('Should return 404 if database is empty', async () => {
          await deleteOrders();
          await request(app)
            .get('/v1/orders')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 404 if params orderId is not exists', async () => {
          await request(app)
            .get(`/v1/orders/${faker.datatype.uuid()}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 400 if params is not a valid UUID', async () => {
          const res = await request(app)
            // Set invalid UUID
            .get('/v1/orders/invalidUUID')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if query is not valid', async () => {
          await request(app)
            .get('/v1/orders')
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
            })
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('Put Orders', () => {
        test('Should return 200 if id is found and request body is valid', async () => {
          const res = await request(app)
            .put(`/v1/orders/${orderOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({
              customerName: 'updatedCustomerName',
            })
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            date: expect.anything(),
            totalPrice: orderOne.totalPrice,
            customerName: 'updatedCustomerName',
            customerEmail: orderOne.customerEmail,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbOrder = await prisma.orders.findUnique({
            where: {
              id: orderOne.id,
            },
          });

          expect(dbOrder).toBeDefined();
          expect(dbOrder).toMatchObject({
            id: expect.anything(),
            date: expect.anything(),
            totalPrice: orderOne.totalPrice,
            customerName: 'updatedCustomerName',
            customerEmail: orderOne.customerEmail,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 404 if id is not found', async () => {
          await request(app)
            .put(`/v1/orders/${faker.datatype.uuid()}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({
              customerName: 'updatedCustomerName',
            })
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 400 if request body is empty', async () => {
          await request(app)
            .put(`/v1/orders/${orderOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({})
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body is not valid', async () => {
          await request(app)
            .put(`/v1/orders/${orderOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({
              notValidKey: 'notValidValue',
            })
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body data type is not valid', async () => {
          await request(app)
            .put(`/v1/orders/${orderOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send({
              customerName: 12345,
            })
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('Delete Orders', () => {
        test('Should return 200 if id is found', async () => {
          const res = await request(app)
            .delete(`/v1/orders/${orderOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toBeNull();

          const dbOrder = await prisma.orders.findUnique({
            where: {
              id: orderOne.id,
            },
          });

          expect(dbOrder).toBeNull();
        });

        test('Should return 400 if id is not a valid UUID', async () => {
          await request(app)
            .delete('/v1/orders/notValidUUID')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 404 if id is not found', async () => {
          await request(app)
            .delete(`/v1/orders/${faker.datatype.uuid()}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });
      });
    });
  });
});
