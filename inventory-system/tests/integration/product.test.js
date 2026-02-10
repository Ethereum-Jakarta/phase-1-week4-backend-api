const request = require('supertest');
const httpStatus = require('http-status');
const { faker } = require('@faker-js/faker');
const app = require('../../src/app');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, insertCategory } = require('../fixtures/category.fixture');
const prisma = require('../../prisma');
const { insertProducts, productOne } = require('../fixtures/product.fixture');

describe('Products Route', () => {
  beforeEach(async () => {
    await insertUsers([userOne]);
    await insertCategory([categoryOne]);
    await insertProducts([productOne]);
  });

  describe('Authentication', () => {
    test('should return 401 if no access token', async () => {
      await request(app).get('/v1/products').expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /v1/products', () => {
    test('should return 200 and successfully get all products', async () => {
      await request(app).get('/v1/products').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.OK);
    });
  });

  describe('POST /v1/products', () => {
    let newProduct;
    beforeEach(async () => {
      newProduct = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        quantityInStock: parseInt(faker.commerce.price(), 10),
        categoryId: categoryOne.id,
        userId: userOne.id,
      };
    });
    test('should return 200 and success create product if request data is valid', async () => {
      const res = await request(app)
        .post('/v1/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.OK);
      const productData = res.body.data;
      const dbProduct = await prisma.product.findUnique({
        where: {
          id: productData.id,
        },
      });
      expect(dbProduct).toBeDefined();
      expect(dbProduct).toMatchObject({
        id: expect.anything(),
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        quantityInStock: newProduct.quantityInStock,
        categoryId: newProduct.categoryId,
        userId: newProduct.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });
  });

  describe('PATCH /v1/products/:productId', () => {
    test('should return 200 and success update product if request data is valid', async () => {
      const res = await request(app)
        .patch(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: 'example' })
        .expect(httpStatus.OK);

      const productData = res.body.data;
      expect(productData).toBeDefined();
      expect(productData).toMatchObject({
        id: expect.anything(),
        name: 'example',
        description: productOne.description,
        price: expect.anything(),
        quantityInStock: productOne.quantityInStock,
        categoryId: categoryOne.id,
        userId: userOne.id,
      });
    });
    test('should return 400 if id no found', async () => {
      const res = await request(app)
        .patch(`/v1/products/${123}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: 'example' })
        .expect(httpStatus.BAD_REQUEST);

      const productData = res.body.message;
      // eslint-disable-next-line
      expect(productData).toEqual('\"\"productId\"\" must be a valid UUID');
    });
  });

  describe('DELETE /v1/products/:productId', () => {
    test('should return 200 and success delete data if product id is valid', async () => {
      const res = await request(app)
        .delete(`/v1/products/${productOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      const productData = res.body.data;
      const dbData = await prisma.product.findUnique({
        where: { id: productData.id },
      });
      expect(dbData).toEqual(null);
    });
    test('should return 400 if product not found', async () => {
      const res = await request(app)
        .delete(`/v1/products/${123}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.BAD_REQUEST);

      const productData = res.body.message;
      // eslint-disable-next-line
      expect(productData).toEqual('\"\"productId\"\" must be a valid UUID');
    });
  });
});
