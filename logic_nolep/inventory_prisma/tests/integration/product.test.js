const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { userOne, admin, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { categoryOne, categoryTwo, insertcategory } = require('../fixtures/category.fixture');
const { productOne, productTwo, insertProducts } = require('../fixtures/product.fixture');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

describe('Product routes', () => {
  describe('POST /v1/product', () => {
    let newProduct;
    beforeEach(async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertcategory([categoryOne]);
      newProduct = {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.datatype.float({ min: 100, max: 10000000, precision: 1 }),
        quantityInStock: faker.datatype.number({ min: 1, max: 100 }),
        categoryId: categoryOne.id,
        userId: userTwo.id,
      };
    });

    test('should return 201 and successfully add product if request data is ok', async () => {
      const res = await request(app)
        .post('/v1/product')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.CREATED);

      const productData = res.body.data;

      expect(productData).toEqual({
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

    test('should return 400 error if name is undefined or null', async () => {
      newProduct.name = undefined;

      await request(app)
        .post('/v1/product')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).post('/v1/product').send(newProduct).expect(httpStatus.UNAUTHORIZED);
    });
  });

  // Get product
  describe('GET v1/product', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne, productTwo]);
    });

    test('should return 200 and successfully get products', async () => {
      const res = await request(app)
        .get('/v1/product?take=1&&skip=1')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data).toBeDefined();
      expect(res.body.data).not.toBeNull();
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).get('/v1/product').expect(httpStatus.UNAUTHORIZED);
    });
  });

  // Update product

  describe('UPDATE v1/product/:product', () => {
    let newProduct;
    beforeEach(async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne]);
      newProduct = {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.datatype.float({ min: 100, max: 10000000, precision: 1 }),
        quantityInStock: faker.datatype.number({ min: 1, max: 100 }),
        categoryId: categoryTwo.id,
        userId: userOne.id,
      };
    });

    test('should return 200 and successfully update product', async () => {
      const res = await request(app)
        .patch(`/v1/product/${productOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.OK);

      const userData = res.body.data;

      expect(userData).toEqual({
        id: productOne.id,
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

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).patch(`/v1/product/${userTwo.id}`).send(newProduct).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if product not found', async () => {
      await request(app)
        .patch(`/v1/product/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProduct)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET v1/product/:product', () => {
    beforeEach(async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne]);
    });

    test('should return 200 and successfully get product', async () => {
      const res = await request(app)
        .get(`/v1/product/${productOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
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
      await request(app).get(`/v1/product/${productOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if product not found', async () => {
      await request(app)
        .get(`/v1/product/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE v1/product/:productId', () => {
    beforeEach(async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne]);
    });

    test('should return 200 and successfully delete product', async () => {
      const res = await request(app)
        .delete(`/v1/product/${productOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);
    });

    test('should return 401 error Unauthorized if user not login or register', async () => {
      await request(app).delete(`/v1/product/${productOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error Not found if product not found', async () => {
      await request(app)
        .delete(`/v1/product/${v4()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET v1/product/categories', () => {
    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
      await insertcategory([categoryOne, categoryTwo]);
      await insertProducts([productOne, productTwo]);
    });

    test('should return 200 and successfully get products', async () => {
      const res = await request(app)
        .get(`/v1/product/categories?search=${categoryOne.name}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

        const productData = res.body.data;

      expect(productData).toEqual([{
        id: expect.anything(),
        name: productOne.name,
        description: productOne.description,
        price: productOne.price,
        quantityInStock: productOne.quantityInStock,
        categoryId: productOne.categoryId,
        userId: productOne.userId,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      }]);

      const dbProduct = await prisma.product.findFirst({
        where: {
          id: productData.id,
        },
      });

      expect(dbProduct).toBeDefined();

      expect(dbProduct).toMatchObject({
        id: expect.anything(),
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
      await request(app).get('/v1/product').expect(httpStatus.UNAUTHORIZED);
    });
  });

});
