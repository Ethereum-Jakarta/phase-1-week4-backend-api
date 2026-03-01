const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../src/app');
const { admin, insertUsers, userOne } = require('../fixtures/user.fixture');
const { productOne, insertProducts } = require('../fixtures/product.fixture');
const { categoryOne, insertCategory } = require('../fixtures/category.fixture');
const { adminAccessToken, userOneAccessToken } = require('../fixtures/token.fixture');

describe('Product routes', () => {
  let newProduct;

  beforeEach(async () => {
    await insertUsers([admin, userOne]);
    await insertCategory([categoryOne]);
    await insertProducts([productOne]);

    newProduct = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.float({ min: 1, max: 1000 }),
      quantityInStock: faker.number.int({ min: 10, max: 100 }),
      categoryId: categoryOne.id,
      userId: userOne.id,
    };
  });

  describe('GET & POST /api/products', () => {
    test('should return 200 OK if success get products', async () => {
      await request(app).get('/api/products').set('Authorization', `Bearer ${userOneAccessToken}`);
    });

    test('should return 201 CREATED if success create product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProduct);

      expect(res.body.status).toBe(201);
      expect(res.body.data).toMatchObject({
        name: newProduct.name,
        description: newProduct.description,
      });
    });
  });

  describe('/api/products/:id', () => {
    test('should return 200 OK, if success get product by id', async () => {
      await request(app).get(`/api/products/${productOne.id}`).set('Authorization', `Bearer ${userOneAccessToken}`);
    });

    test('should return 200 OK, if success update product by id', async () => {
      const updatedProductData = {
        name: 'Updated Product Name',
        description: 'Updated description',
        price: faker.number.float({ min: 10, max: 1000 }),
        quantityInStock: faker.number.int({ min: 1, max: 100 }),
        categoryId: productOne.categoryId,
        userId: productOne.userId,
      };

      const res = await request(app)
        .put(`/api/products/${productOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedProductData);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success update Product!',
        data: expect.objectContaining({
          id: productOne.id,
          name: updatedProductData.name,
          description: updatedProductData.description,
          price: expect.any(Number),
          quantityInStock: updatedProductData.quantityInStock,
          categoryId: updatedProductData.categoryId,
          userId: updatedProductData.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        error: null,
      });
    });

    test('should return 200 and delete product by id', async () => {
      const res = await request(app)
        .delete(`/api/products/${productOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual({
        status: 200,
        message: 'Success delete Product!',
        data: expect.objectContaining({
          id: productOne.id,
        }),
        error: null,
      });
    });
  });

  describe('ERROR TEST', () => {
    test('should return 400 BAD REQUEST if categoryId is missing', async () => {
      delete newProduct.categoryId;

      await request(app).post('/api/products').set('Authorization', `Bearer ${userOneAccessToken}`).send(newProduct);
    });

    test('should return 400 if creating product without required fields', async () => {
      const res = await request(app).post('/api/products').set('Authorization', `Bearer ${adminAccessToken}`);

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
      const res = await request(app).get('/api/products');
      expect(res.body.message).toBe('Authorization header missing');
    });

    test('should return 404 if product ID not found', async () => {
      const res = await request(app).get(`/api/products/invalid-id`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 404,
          message: 'Product not found.',
          data: null,
          error: null,
        })
      );
    });
  });
});
