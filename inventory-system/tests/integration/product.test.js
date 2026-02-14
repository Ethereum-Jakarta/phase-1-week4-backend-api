const request = require('supertest');
const httpStatus = require('http-status');
const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');
const app = require('../../src/app');
const { userOne } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { categoryOne } = require('../fixtures/category.fixture');
const prisma = require('../../prisma');
const { insertProducts, productOne } = require('../fixtures/product.fixture');

describe('Products Route', () => {
  let newProduct;
  beforeEach(async () => {
    await insertProducts(userOne, categoryOne, [productOne]);

    newProduct = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.float({ max: 50 }),
      quantityInStock: faker.number.int({ max: 100 }),
    };
  });
  describe('POST Method on /products', () => {
    test('Should return 201 if product is created', async () => {
      const res = await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ ...newProduct, categoryId: categoryOne.id, userId: userOne.id })
        .expect(httpStatus.CREATED);

      const productData = res.body.data;

      expect(productData).toMatchObject({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        price: expect.anything(),
        quantityInStock: newProduct.quantityInStock,
        categoryId: expect.anything(),
        userId: expect.anything(),
      });
    });
    test('Should return 404 if user not logged in', async () => {
      const res = await request(app)
        .get('/v1/products')
        .set('Authorization', `Bearer invalidToken `)
        .expect(httpStatus.UNAUTHORIZED);

      const resData = res.body.message;

      expect(resData).toContain('Please authenticate');
    });
    test('Should return 400 if given invalid data', async () => {
      const res = await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ ...newProduct, categoryId: 'invalid-id', userId: 'invalid-id' })
        .expect(httpStatus.BAD_REQUEST);

      const resData = res.body.message;

      expect(resData).toContain('must be a valid UUID');
    });
  });
  describe('GET Method on /products & /products:id', () => {
    describe('GET /products route', () => {
      test('Should return 200 and all products', async () => {
        const res = await request(app)
          .get('/v1/products')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.OK);

        const productsData = res.body.data;

        expect(productsData).toMatchObject([
          {
            id: expect.anything(),
            name: productOne.name,
            description: productOne.description,
            price: expect.anything(),
            quantityInStock: productOne.quantityInStock,
            categoryId: categoryOne.id,
            userId: userOne.id,
            category: expect.anything(),
            user: expect.anything(),
          },
        ]);
      });

      test('Should return 404 if no product has been found', async () => {
        await prisma.product.deleteMany();
        const res = await request(app)
          .get('/v1/products')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.NOT_FOUND);

        const resData = res.body.message;

        expect(resData).toContain('Product not found');
      });
      test('Should return 404 if user not logged in', async () => {
        const res = await request(app)
          .get('/v1/products')
          .set('Authorization', `Bearer invalidToken `)
          .expect(httpStatus.UNAUTHORIZED);

        const resData = res.body.message;

        expect(resData).toContain('Please authenticate');
      });
    });

    describe('GET /product:id route', () => {
      test('Should return 200 and product data if id valid', async () => {
        const res = await request(app)
          .get(`/v1/products/${productOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.OK);

        const productData = res.body.data;

        expect(productData).toMatchObject({
          id: expect.anything(),
          name: productOne.name,
          description: productOne.description,
          price: expect.anything(),
          quantityInStock: productOne.quantityInStock,
          categoryId: categoryOne.id,
          userId: userOne.id,
          category: expect.anything(),
          user: expect.anything(),
        });
      });
      test('Should return 404 if product not found', async () => {
        const res = await request(app)
          .get(`/v1/products/${v4()}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.NOT_FOUND);

        const resData = res.body.message;

        expect(resData).toEqual('Product not found');
      });
      test('Should return 400 if invalid id given', async () => {
        const res = await request(app)
          .get(`/v1/products/123`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.BAD_REQUEST);

        const resData = res.body.message;

        expect(resData).toContain('must be a valid UUID');
      });
      test('Should return 404 if user not logged in', async () => {
        const res = await request(app)
          .get('/v1/products')
          .set('Authorization', `Bearer invalidToken `)
          .expect(httpStatus.UNAUTHORIZED);

        const resData = res.body.message;

        expect(resData).toContain('Please authenticate');
      });
    });
  });
  describe('DELETE Method on /products:id', () => {
    test('Should return 200 and null data', async () => {
      const res = await request(app)
        .delete(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      const productData = res.body.data;

      expect(productData).toEqual(null);
    });
    test('Should return 400 if invalid id given', async () => {
      const res = await request(app)
        .delete(`/v1/products/123`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);

      const resData = res.body.message;

      expect(resData).toContain('must be a valid UUID');
    });
    test('Should return 404 if user not logged in', async () => {
      const res = await request(app)
        .delete(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer invalidToken `)
        .expect(httpStatus.UNAUTHORIZED);

      const resData = res.body.message;

      expect(resData).toContain('Please authenticate');
    });
    test('Should return 404 if product not found', async () => {
      const res = await request(app)
        .delete(`/v1/products/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);

      const resData = res.body.message;

      expect(resData).toEqual('Product not found');
    });
  });
  describe('PATCH Method on /products:id', () => {
    test('Should return 200 and updated product', async () => {
      const res = await request(app)
        .patch(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: 'sir' })
        .expect(httpStatus.OK);

      const productData = res.body.data;

      expect(productData).toMatchObject({
        id: expect.anything(),
        name: 'sir',
        description: productOne.description,
        price: expect.anything(),
        quantityInStock: productOne.quantityInStock,
        categoryId: categoryOne.id,
        userId: userOne.id,
      });
    });
    test('Should return 400 if invalid id given', async () => {
      const res = await request(app)
        .patch(`/v1/products/123`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: 'sir' })
        .expect(httpStatus.BAD_REQUEST);

      const resData = res.body.message;

      expect(resData).toContain('must be a valid UUID');
    });
    test('Should return 404 if user not logged in', async () => {
      const res = await request(app)
        .patch(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer invalidToken `)
        .send({ name: 'sir' })
        .expect(httpStatus.UNAUTHORIZED);

      const resData = res.body.message;

      expect(resData).toContain('Please authenticate');
    });
    test('Should return 404 if product not found', async () => {
      const res = await request(app)
        .patch(`/v1/products/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: 'sir' })
        .expect(httpStatus.NOT_FOUND);

      const resData = res.body.message;

      expect(resData).toEqual('Product not found');
    });
  });
});
