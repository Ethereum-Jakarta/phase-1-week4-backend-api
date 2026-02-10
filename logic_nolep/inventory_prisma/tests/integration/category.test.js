const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, categoryTwo, insertcategory } = require('../fixtures/category.fixture');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

describe('Category routes', () => {
  //Create Category

  describe('POST /v1/category', () => {
    let newCategory;
    beforeEach(async () => {
      await insertUsers([admin, userOne]);
      await insertcategory([categoryOne]);
      newCategory = {
        name: faker.name.findName(),
      };
    });

    test('should return 201 and successfully add category if request data is ok', async () => {
      const res = await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCategory)
        .expect(httpStatus.CREATED);

      const categoryData = res.body.data;
      expect(categoryData).toEqual({
        id: expect.anything(),
        name: categoryData.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbCategory = await prisma.category.findUnique({
        where: {
          id: categoryData.id,
        },
      });

      expect(dbCategory).toBeDefined();

      expect(dbCategory).toMatchObject({
        id: expect.anything(),
        name: newCategory.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 400 error if name is undefined or null', async () => {
      newCategory.name = undefined;

      await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCategory)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 403 error forbidden if user not admin', async () => {
      await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newCategory)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).post('/v1/category').send(newCategory).expect(httpStatus.UNAUTHORIZED);
    });
  });

  // Get category

  describe('GET v1/category', () => {
    beforeEach(async () => {
      await insertUsers([userOne]);
    });

    test('should return 200 and successfully get category', async () => {
      await insertcategory([categoryOne]);
      const res = await request(app)
        .get('/v1/category?take=1&&skip=0')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).get('/v1/category').expect(httpStatus.UNAUTHORIZED);
    });
  });

  //Update Category

  describe('UPDATE v1/category/:categoryId', () => {
    let updatedCategory;
    beforeEach(async () => {
      await insertUsers([userOne]);
      await insertcategory([categoryOne]);
      updatedCategory = {
        name: faker.name.findName(),
      };
    });

    test('should return 200 and successfully update category', async () => {
      const res = await request(app)
        .patch(`/v1/category/${categoryOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updatedCategory)
        .expect(httpStatus.OK);

      const updatedCategoryData = res.body.data;

      expect(updatedCategoryData).toEqual({
        id: categoryOne.id,
        name: updatedCategory.name,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).patch(`/v1/category/${categoryOne.id}`).send(updatedCategory).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if category not found', async () => {
      await request(app)
        .patch(`/v1/category/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updatedCategory)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if name is undefined or null', async () => {
      updatedCategory.name = undefined;
      await request(app)
        .patch(`/v1/category/${categoryOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updatedCategory)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  // Get category by id

  describe('GET v1/category/:categoryId', () => {
    beforeEach(async () => {
      await insertUsers([userOne]);
      await insertcategory([categoryOne]);
    });

    test('should return 200 and successfully get category', async () => {
      const res = await request(app)
        .get(`/v1/category/${categoryOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      const categoryData = res.body.data;

      expect(categoryData).toEqual({
        id: categoryOne.id,
        name: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      const res = await request(app).get(`/v1/category/${categoryOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if category not found', async () => {
      await request(app)
        .get(`/v1/category/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  // Delete Category

  describe('DELETE v1/category/:categoryId', () => {
    beforeEach(async () => {
      await insertUsers([userOne]);
      await insertcategory([categoryOne]);
    });

    test('should return 200 and successfully delete category', async () => {
      const res = await request(app)
        .delete(`/v1/category/${categoryOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).delete(`/v1/category/${categoryOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if category not found', async () => {
      await request(app)
        .delete(`/v1/category/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
