const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const { v4 } = require('uuid');
const app = require('../../src/app');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, insertCategories } = require('../fixtures/category.fixture');
const prisma = require('../../prisma');

describe('Categories routes', () => {
  let category;

  beforeEach(async () => {
    await insertUsers([userOne]);

    category = {
      name: faker.word.adjective(),
    };
  });

  describe('Authentication', () => {
    test('Should return 401 if no access token', async () => {
      await request(app).post('/v1/categories').send(category).expect(httpStatus.UNAUTHORIZED);
    });

    test('Should return 200 if access token is valid', async () => {
      await insertCategories([categoryOne]);
      await request(app).get('/v1/categories').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.OK);
    });
  });

  describe('POST /v1/categories', () => {
    test('Should return 201 if category is created', async () => {
      const res = await request(app)
        .post('/v1/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(category)
        .expect(httpStatus.CREATED);

      // Response Body Macthup
      const categoryData = res.body.data;

      expect(categoryData).toEqual({
        id: expect.anything(),
        name: category.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      // Database Macthup
      const dbCategory = await prisma.category.findUnique({
        where: {
          id: categoryData.id,
        },
      });

      expect(dbCategory).toMatchObject({
        id: expect.anything(),
        name: category.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('Should return 400 if no data provided', async () => {
      await request(app)
        .post('/v1/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({})
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/categories', () => {
    test('Should return 200 and all categories', async () => {
      await insertCategories([categoryOne]);
      const res = await request(app)
        .get('/v1/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      // Response Body Macthup
      const categoryData = res.body.data;

      expect(categoryData).toEqual([
        {
          id: expect.anything(),
          name: categoryOne.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
          products: expect.any(Array),
        },
      ]);
    });
  });

  describe('/v1/categories/:categoryId', () => {
    beforeEach(async () => {
      await insertCategories([categoryOne]);
    });

    describe('GET /v1/categories/:categoryId', () => {
      test('Should return 200 and category', async () => {
        const res = await request(app)
          .get(`/v1/categories/${categoryOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.OK);

        // Response Body Macthup
        const categoryData = res.body.data;

        expect(categoryData).toEqual({
          id: expect.anything(),
          name: categoryOne.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
          products: expect.any(Array),
        });
      });
    });

    test('Should return 404 if category is not found', async () => {
      await request(app)
        .get(`/v1/categories/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('Should return 400 if category id is not a valid uuid', async () => {
      await request(app)
        .get(`/v1/categories/123`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    describe('PATCH /v1/categories/:categoryId', () => {
      test('Should return 200 and updated category', async () => {
        const res = await request(app)
          .patch(`/v1/categories/${categoryOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send({ name: category.name })
          .expect(httpStatus.OK);

        // Response Body Macthup
        const categoryData = res.body.data;

        expect(categoryData).toEqual({
          id: expect.anything(),
          name: category.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });

    describe('DELETE /v1/categories/:categoryId', () => {
      test('Should return 200 and null data', async () => {
        const res = await request(app)
          .delete(`/v1/categories/${categoryOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.OK);

        // Response Body Macthup
        const categoryData = res.body.data;

        expect(categoryData).toBeNull();
      });
    });
  });
});
