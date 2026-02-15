const request = require('supertest'); // Request HTTP
const faker = require('faker'); // Fake data
const httpStatus = require('http-status');
const app = require('../../src/app');
const { categoryOne, insertCategories, deleteCategories } = require('../fixtures/category.fixture');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');

describe('Category Routes', () => {
  let category = null;
  beforeEach(async () => {
    await insertUsers([userOne]);
    category = {
      name: faker.vehicle.vehicle(),
    };
  });
  afterEach(async () => {
    await deleteCategories();
  });

  describe('Category route', () => {
    describe('Authentication', () => {
      test('Should return 401 error if no access token', async () => {
        await request(app).post('/v1/categories').send(category).expect(httpStatus.UNAUTHORIZED);
      });

      test('Should return 200 if token is valid', async () => {
        await insertCategories([categoryOne]);
        await request(app).get('/v1/categories').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.OK);
      });
    });

    describe('CRUD test', () => {
      describe('POST Category', () => {
        test('Should return 201 if request body is ok and token is valid', async () => {
          const res = await request(app)
            .post('/v1/categories')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(category)
            .expect(httpStatus.CREATED);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            name: category.name,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbCategory = await prisma.category.findUnique({
            where: {
              id: resData.id,
            },
          });

          expect(dbCategory).toBeDefined();
          expect(dbCategory).toMatchObject({
            id: expect.anything(),
            name: category.name,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 400 error if no request body', async () => {
          await request(app)
            .post('/v1/categories')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if request body is not a valid data type', async () => {
          category.name = 12345;
          await request(app)
            .post('/v1/categories')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(category)
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('GET Category', () => {
        test('Should return 200 if token is valid and category database is not empty', async () => {
          await insertCategories([categoryOne]);
          const res = await request(app)
            .get('/v1/categories')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toEqual([
            {
              id: expect.anything(),
              name: categoryOne.name,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            },
          ]);

          const dbCategory = await prisma.category.findUnique({
            where: {
              id: resData[0].id,
            },
          });

          expect(dbCategory).toBeDefined();
          expect(dbCategory).toMatchObject({
            id: expect.anything(),
            name: categoryOne.name,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 404 if category database is empty', async () => {
          await request(app)
            .get('/v1/categories')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 200 if request query is ok and token is valid', async () => {
          await insertCategories([categoryOne]);
          const res = await request(app).get('/v1/categories').set('Authorization', `Bearer ${userOneAccessToken}`).query({
            page: 0,
            size: 10,
            id: categoryOne.id,
            name: categoryOne.name,
            createdAt: categoryOne.createdAt,
            updatedAt: categoryOne.updatedAt,
            orderBy: 'name:asc',
          });
          const resData = res.body.data;

          expect(resData).toEqual([
            {
              id: expect.anything(),
              name: categoryOne.name,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            },
          ]);

          const dbCategory = await prisma.category.findUnique({
            where: {
              id: categoryOne.id,
            },
          });

          expect(dbCategory).toBeDefined();
          expect(dbCategory).toMatchObject({
            id: expect.anything(),
            name: categoryOne.name,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 400 error if query is not valid', async () => {
          await insertCategories([categoryOne]);
          await request(app)
            .get('/v1/categories')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .query({
              notValidQuery: categoryOne.name,
            })
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('PUT Category', () => {
        test('Should return 200 if id and request body is valid', async () => {
          await insertCategories([categoryOne]);
          const res = await request(app)
            .put(`/v1/categories/${categoryOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({ name: 'updatedCategoryTest' })
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            name: resData.name,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbCategory = await prisma.category.findUnique({
            where: {
              id: resData.id,
            },
          });

          expect(dbCategory).toBeDefined();
          expect(dbCategory).toMatchObject({
            id: expect.anything(),
            name: resData.name,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 400 if id is not a valid UUID', async () => {
          await insertCategories([categoryOne]);
          await request(app)
            .put('/v1/categories/notValidUUID')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 404 if id is not found', async () => {
          await insertCategories([categoryOne]);
          await deleteCategories();
          await request(app)
            .put(`/v1/categories/${categoryOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({ name: 'validName' })
            .expect(httpStatus.NOT_FOUND);
        });
      });

      describe('DELETE Category', () => {
        test('Should return 200 if id is valid', async () => {
          await insertCategories([categoryOne]);
          const res = await request(app)
            .delete(`/v1/categories/${categoryOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toBe(null);

          const dbCategory = await prisma.category.findUnique({
            where: {
              id: categoryOne.id,
            },
          });

          expect(dbCategory).toBeNull();
        });

        test('Should return 400 if id is not a valid UUID', async () => {
          await insertCategories([categoryOne]);
          await request(app)
            .delete('/v1/categories/notValidUUID')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 404 if id is not found', async () => {
          await insertCategories([categoryOne]);
          await deleteCategories();
          await request(app)
            .delete(`/v1/categories/${categoryOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });
      });
    });
  });
});
