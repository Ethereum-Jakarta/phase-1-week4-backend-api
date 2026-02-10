const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, insertCategory } = require('../fixtures/category.fixture');
const prisma = require('../../prisma');

describe('Category Route', () => {
  let category;

  beforeEach(async () => {
    await insertUsers([userOne]);

    category = {
      name: faker.music.genre(),
    };
  });

  describe('Authorization', () => {
    test('should return 401 if no access token', async () => {
      await request(app).post('/v1/category').send(category).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /v1/category', () => {
    test('should return 201 if category is created', async () => {
      const res = await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(category)
        .expect(httpStatus.CREATED);

      const categoryData = res.body.data;

      expect(categoryData).toEqual({
        id: expect.anything(),
        name: category.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

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

    test('should return 400 if data is invalid', async () => {
      await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({})
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('/v1/category/:categoryId', () => {
    beforeEach(async () => {
      await insertCategory([categoryOne]);
    });

    describe('GET /v1/category/:categoryId', () => {
      test('Should return 200 and category by id given', async () => {
        const res = await request(app)
          .get(`/v1/category/${categoryOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.OK);
        const categoryData = res.body.data;

        expect(categoryData).toEqual({
          id: expect.anything(),
          name: categoryOne.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });

    test('Should return 400 if id not found', async () => {
      await request(app)
        .get(`/v1/category/${123}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);
    });

    describe('PATCH /v1/category/:categoryId', () => {
      test('Should return 200 and updated category', async () => {
        const res = await request(app)
          .patch(`/v1/category/${categoryOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send({ name: category.name })
          .expect(httpStatus.OK);

        const categoryData = res.body.data;

        expect(categoryData).toEqual({
          id: expect.anything(),
          name: category.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });

    describe('DELETE /v1/category/:categoryId', () => {
      test('should return 200 if success delete data', async () => {
        const res = await request(app)
          .delete(`/v1/category/${categoryOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.OK);

        const categoryData = res.body.data;

        expect(categoryData).toBeNull();
      });
      test('should return 400 if id not found', async () => {
        await request(app)
          .get(`/v1/category/${123}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.BAD_REQUEST);
      });
    });
  });
});
