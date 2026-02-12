const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const prisma = require('../../prisma');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { insertUsers, userOne } = require('../fixtures/user.fixture');
const { insertCategory, categoryOne } = require('../fixtures/category.fixture');
const { insertProducts } = require('../fixtures/product.fixture');
const { v4 } = require('uuid');

describe('Products Route', () => {
  let newProduct, newProductTwo;
  beforeEach(async () => {
    await insertUsers([userOne]);
    await insertCategory([categoryOne]);

    newProduct = {
      id: v4(),
      name: 'string',
      description: 'string',
      price: 100,
      quantityInStock: 100,
      categoryId: categoryOne.id,
      userId: userOne.id,
    };

    newProductTwo = {
      name: 'string',
      description: 'string',
      price: 100,
      quantityInStock: 100,
      categoryId: categoryOne.id,
      userId: userOne.id,
    };
  });

  afterEach(async () => {
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Authentication', () => {
    test('should return 401 error if token not exist', async () => {
      await request(app).get('/api/products').set('Authorization', `Bearer invalid-token`).expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('/api/products', () => {
    describe('GET', () => {
      test('should return 200 ok', async () => {
        await request(app).get('/api/products').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.OK);
      });
    });

    describe('POST', () => {
      test('should return 201 create', async () => {
        const res = await request(app)
          .post(`/api/products`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send(newProductTwo)
          .expect(httpStatus.CREATED);

        const product = res.body.data;

        expect(product).toEqual({
          ...newProductTwo,
          id: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbProduct = await prisma.product.findUnique({
          where: { id: product.id },
        });

        expect(dbProduct).toBeDefined();
        expect(dbProduct).toMatchObject({
          ...product,
          id: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });
  });

  describe('/api/products/:productId', () => {
    describe('INVALID REQUEST /:productId', () => {
      test('should return 400 error if productId invalid', async () => {
        await request(app)
          .get('/api/products/invalid-productId')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.BAD_REQUEST);
      });
    });

    describe('GET', () => {
      test('should return 200 ok', async () => {
        await insertProducts([newProduct]);

        const res = await request(app)
          .get(`/api/products/${newProduct.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(httpStatus.OK);

        const product = res.body.data;

        expect(product).toEqual({
          ...newProduct,
          id: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbProduct = await prisma.product.findUnique({
          where: { id: product.id },
        });

        expect(dbProduct).toBeDefined();
        expect(dbProduct).toMatchObject({
          ...product,
          id: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });

    describe('PUT', () => {
      test('should return 201 create', async () => {
        await insertProducts([newProduct]);

        let updateProduct = {
          name: 'new string',
          description: 'new string',
          price: 50,
          quantityInStock: 50,
        };

        const res = await request(app)
          .put(`/api/products/${newProduct.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send(updateProduct)
          .expect(httpStatus.CREATED);

        const product = res.body.data;

        expect(product).toEqual({
          ...updateProduct,
          id: expect.anything(),
          categoryId: expect.anything(),
          userId: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbProduct = await prisma.product.findUnique({
          where: { id: product.id },
        });

        expect(dbProduct).toBeDefined();
        expect(dbProduct).toMatchObject({
          ...product,
          id: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });

    describe('DELETE', () => {
      test('should return 204 no content', async () => {
        await insertProducts([newProduct]);
        await request(app)
          .delete(`/api/products/${newProduct.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(204);
      });
    });
  });
});
