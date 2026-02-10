const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, admin, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, categoryTwo, insertcategory } = require('../fixtures/category.fixture');
const { productOne, productTwo, insertProducts } = require('../fixtures/product.fixture');
const { orderOne, orderTwo, insertOrders } = require('../fixtures/order.fixture');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

describe('User routes', () => {
  //Create User

  describe('POST /v1/users', () => {
    let newUser;
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        role: 'user',
        password: 'password1',
      };
    });

    test('should return 201 and successfully add user if request data is ok', async () => {
      const res = await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.CREATED);

      const userData = res.body.data;

      expect(userData).toEqual({
        id: expect.anything(),
        name: newUser.name,
        password: expect.anything(),
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbUser = await prisma.user.findUnique({
        where: {
          id: userData.id,
        },
      });

      expect(dbUser).toBeDefined();

      expect(dbUser).toMatchObject({
        id: expect.anything(),
        name: newUser.name,
        password: expect.anything(),
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 error if name is undefined or null', async () => {
      newUser.name = undefined;

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 403 error forbidden if user not admin', async () => {
      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUser)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).post('/v1/users').send(newUser).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalidEmail';

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is already used', async () => {
      await insertUsers([userOne]);
      newUser.email = userOne.email;

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if password does not contain both letters and numbers', async () => {
      newUser.password = 'password';

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      newUser.password = '11111111';

      await request(app)
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  // get users

  describe('GET v1/users', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin]);
    });

    test('should return 200 and successfully get users', async () => {
      const res = await request(app)
        .get('/v1/users?take=1&&skip=1')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data).toBeDefined();
      expect(res.body.data).not.toBeNull();
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).get('/v1/users').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app).get('/v1/users').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.FORBIDDEN);
    });
  });

  // Update users

  describe('UPDATE v1/users/:userId', () => {
    let newUser;
    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        role: 'user',
        password: 'password1',
      };
    });

    test('should return 200 and successfully update users', async () => {
      const res = await request(app)
        .patch(`/v1/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.OK);

      const userData = res.body.data;

      expect(userData).toEqual({
        id: userOne.id,
        name: newUser.name,
        password: expect.anything(),
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).patch(`/v1/users/${userTwo.id}`).send(newUser).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .patch(`/v1/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newUser)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error Not found if user not found', async () => {
      await request(app)
        .patch(`/v1/users/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET v1/users/:userId', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
    });

    test('should return 200 and successfully get user', async () => {
      const res = await request(app)
        .get(`/v1/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      const userData = res.body.data;

      expect(userData).toEqual({
        id: userTwo.id,
        name: userTwo.name,
        password: expect.anything(),
        email: userTwo.email,
        role: userTwo.role,
        isEmailVerified: false,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).get(`/v1/users/${userOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if user not found', async () => {
      await request(app)
        .get(`/v1/users/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .get(`/v1/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('DELETE v1/users/:userId', () => {
    beforeEach(async () => {
      await insertUsers([userOne, userTwo, admin]);
    });

    test('should return 200 and successfully delete user', async () => {
      const res = await request(app)
        .delete(`/v1/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).delete(`/v1/users/${userTwo.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if users not found', async () => {
      await request(app)
        .delete(`/v1/users/${v4()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .delete(`/v1/users/${userTwo.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET v1/users/:userId/products', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne, productTwo])
    });

    test('should return 200 and successfully get user products', async () => {
      const res = await request(app)
        .get(`/v1/users/${userOne.id}/products`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

        const productData = res.body.data;

        expect(productData).toEqual({
          id: productOne.id,
          name: productOne.name,
          description: productOne.description,
          price: productOne.price,
          quantityInStock: productOne.quantityInStock,
          categoryId: productOne.categoryId,
          userId: productOne.userId,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app)
        .get(`/v1/users/${userOne.id}/products`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if user product not found', async () => {
      await request(app)
        .get(`/v1/users/${v4()}/products`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

  });

  describe('GET v1/users/:userId/orders', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
      await insertOrders([orderOne])
    });

    test('should return 200 and successfully get user orders', async () => {
      const res = await request(app)
        .get(`/v1/users/${userOne.id}/orders`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      const orderData = res.body.data;

      expect(orderData).toMatchObject([{
        id: expect.anything(),
        date: expect.anything(),
        totalPrice: orderOne.totalPrice,
        customerName: orderOne.customerName,
        customerEmail: orderOne.customerEmail,
        userId: orderOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      }]);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app)
        .get(`/v1/users/${userOne.id}/orders`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if user order not found', async () => {
      await request(app)
        .get(`/v1/users/${v4()}/orders`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 403 error Forbidden if user not admin', async () => {
      await request(app)
        .get(`/v1/users/${userOne.id}/orders`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

});
