const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../src/app');
const { insertUsers, admin } = require('../fixtures/user.fixture');
const { categoryOne, insertCategory } = require('../fixtures/category.fixture');
const { adminAccessToken } = require('../fixtures/token.fixture');

describe('Category routes', () => {
  let newCategory;

  beforeEach(async () => {
    await insertUsers([admin]);
    newCategory = { name: faker.vehicle.type() };
  });

  describe('POST & GET /api/categories', () => {
    test('should return 200 and successfully GET categories', async () => {
      const res = await request(app).get('/api/categories').set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success get Categories!',
        data: expect.any(Array),
        error: null,
      });
    });

    test('should return 201 if successfully created category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCategory);

      expect(res.body).toEqual({
        status: 201,
        message: 'Success create Category!',
        data: {
          id: expect.any(String),
          name: newCategory.name,
        },
        error: null,
      });
    });
  });

  describe('/api/categories/:id', () => {
    test('should return 200 and success get category by id', async () => {
      await insertCategory([categoryOne]);

      const res = await request(app)
        .get(`/api/categories/${categoryOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success get Category!',
        data: expect.objectContaining({ id: categoryOne.id, name: categoryOne.name }),
        error: null,
      });
    });

    test('should return 200 and success update category by id', async () => {
      await insertCategory([categoryOne]);
      const updatedCategory = { name: faker.word.sample() };

      const res = await request(app)
        .put(`/api/categories/${categoryOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedCategory);

      expect(res.body.data.name).toBe(updatedCategory.name);
    });

    test('should return 200 and delete category by id', async () => {
      await insertCategory([categoryOne]);
      const res = await request(app)
        .delete(`/api/categories/${categoryOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success delete Category!',
        data: expect.objectContaining({
          id: categoryOne.id,
        }),
        error: null,
      });
    });
  });

  describe('ERROR TEST', () => {
    test('should return 400 if creating category without required fields', async () => {
      const res = await request(app).post('/api/categories').set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 400,
          message: 'Validation Error',
          data: null,
          error: expect.any(String),
        })
      );
    });

    test('should return 401 error unauthorized if no bearer access token', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.body.message).toBe('Authorization header missing');
    });

    test('should return 404 if category ID not found', async () => {
      const res = await request(app).get(`/api/categories/invalid-id`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 404,
          message: 'Category not found.',
          data: null,
          error: null,
        })
      );
    });
  });
});
