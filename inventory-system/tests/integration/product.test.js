const request = require('supertest'); // Request HTTP
const faker = require('faker'); // Fake data
const httpStatus = require('http-status');
const app = require('../../src/app');
const { productOne, insertProducts, deleteProducts } = require('../fixtures/product.fixture');
const { categoryOne, insertCategories, deleteCategories } = require('../fixtures/category.fixture');
const { userOne, insertUsers, deleteUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');

describe('Product Routes', () => {
  let product = null;
  beforeEach(async () => {
    await insertUsers([userOne]);
    await insertCategories([categoryOne]);
    await insertProducts(userOne.id, categoryOne.id, [productOne]);

    product = {
      name: faker.vehicle.vehicle(),
      description: faker.lorem.sentence(),
      price: faker.datatype.float({ min: 10, max: 100, precision: 2 }),
      quantityInStock: faker.datatype.number({ min: 10, max: 100 }),
      categoryId: categoryOne.id,
      userId: userOne.id,
    };
  });
  afterEach(async () => {
    await deleteProducts();
    await deleteCategories();
    await deleteUsers();
  });

  describe('Authentication and CRUD test', () => {
    describe('Authentication', () => {
      test('Should return 401 error if no access token', async () => {
        await request(app).post('/v1/products').send(product).expect(httpStatus.UNAUTHORIZED);
      });

      test('Should return 200 if token is valid', async () => {
        await request(app).get('/v1/products').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.OK);
      });
    });

    describe('CRUD test', () => {
      /*
      describe('POST Product', () => {
        test('Should return 201 if request body is OK and token is valid', async () => {
          const res = await request(app)
            .post('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(product)
            .expect(httpStatus.CREATED);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            name: product.name,
            description: product.description,
            price: product.price,
            quantityInStock: product.quantityInStock,
            categoryId: product.categoryId,
            userId: product.userId,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbProduct = await prisma.product.findUnique({
            where: {
              id: resData.id,
            },
          });

          expect(dbProduct).toBeDefined();
          expect(dbProduct).toMatchObject({
            id: expect.anything(),
            name: product.name,
            description: product.description,
            price: product.price,
            quantityInStock: product.quantityInStock,
            categoryId: product.categoryId,
            userId: product.userId,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 400 error if no request body', async () => {
          await request(app)
            .post('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if one of the request body is empty', async () => {
          // Empty the product.categoryId
          product.categoryId = '';
          await request(app)
            .post('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(product)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if request body is not a valid data type', async () => {
          // Set the one of the request body to the wrong data type
          product.name = 123;
          await request(app)
            .post('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(product)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if price is not a positive number', async () => {
          // Set the product.price to 0 or less
          product.price = -1;
          await request(app)
            .post('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(product)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if categoryId or userId is not a valid UUID', async () => {
          // Invalid the product.categoryId and userId
          product.categoryId = 12345;
          product.userId = 54321;
          await request(app)
            .post('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(product)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 404 not found if categoryId or userId is not found', async () => {
          // Use the dummy UUID
          product.categoryId = '4fde5d95-b514-44a9-8617-cc445cf414c3';
          product.userId = '94cf7d8e-5e37-4653-ac34-204e2d428ab3';
          await request(app)
            .post('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(product)
            .expect(httpStatus.NOT_FOUND);
        });
      });

      describe('GET Product', () => {
        test('Should return 200 if database is not empty and token is valid', async () => {
          const res = await request(app)
            .get('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toEqual([
            {
              id: expect.anything(),
              name: productOne.name,
              description: productOne.description,
              price: productOne.price,
              quantityInStock: productOne.quantityInStock,
              categoryId: categoryOne.id,
              userId: userOne.id,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            },
          ]);

          const dbProduct = await prisma.product.findUnique({
            where: {
              id: resData[0].id,
            },
          });

          expect(dbProduct).toBeDefined();
          expect(dbProduct).toMatchObject({
            id: expect.anything(),
            name: productOne.name,
            description: productOne.description,
            price: productOne.price,
            quantityInStock: productOne.quantityInStock,
            categoryId: categoryOne.id,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 200 if database is not empty and params productId is exists', async () => {
          const res = await request(app)
            .get(`/v1/products/${productOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            name: productOne.name,
            description: productOne.description,
            price: productOne.price,
            quantityInStock: productOne.quantityInStock,
            categoryId: categoryOne.id,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbProduct = await prisma.product.findUnique({
            where: {
              id: resData.id,
            },
          });

          expect(dbProduct).toBeDefined();
          expect(dbProduct).toMatchObject({
            id: expect.anything(),
            name: productOne.name,
            description: productOne.description,
            price: productOne.price,
            quantityInStock: productOne.quantityInStock,
            categoryId: categoryOne.id,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 200 if request query is ok and token is valid', async () => {
          const arrayOfValidOrderBy = [
            'name:asc',
            'name:desc',
            'description:asc',
            'description:desc',
            'price:asc',
            'price:desc',
            'quantityInStock:asc',
            'quantityInStock:desc',
          ];
          // Get the random index
          const randomIndex = Math.floor(Math.random() * arrayOfValidOrderBy.length);

          const res = await request(app).get('/v1/products').set('Authorization', `Bearer ${userOneAccessToken}`).query({
            page: 0,
            size: 10,
            name: productOne.name,
            orderBy: arrayOfValidOrderBy[randomIndex],
          });
          const resData = res.body.data;

          expect(resData).toEqual([
            {
              id: expect.anything(),
              name: productOne.name,
              description: productOne.description,
              price: productOne.price,
              quantityInStock: productOne.quantityInStock,
              categoryId: categoryOne.id,
              userId: userOne.id,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            },
          ]);

          const dbProduct = await prisma.product.findUnique({
            where: {
              id: resData[0].id,
            },
          });

          expect(dbProduct).toBeDefined();
          expect(dbProduct).toMatchObject({
            id: expect.anything(),
            name: productOne.name,
            description: productOne.description,
            price: productOne.price,
            quantityInStock: productOne.quantityInStock,
            categoryId: categoryOne.id,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 404 not found if the database is empty', async () => {
          await deleteProducts();
          await request(app)
            .get('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 404 not found if the params productId is not found', async () => {
          await request(app)
            // Set the dummy UUID
            .get('/v1/products/94cf7d8e-5e37-4653-ac34-204e2d428ab2')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 400 error if query is not valid', async () => {
          await request(app)
            .get('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .query({
              notValidQuery: productOne.name,
            })
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 error if query data is not a valid data types', async () => {
          await request(app)
            .get('/v1/products')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .query({
              page: 'notValidDataTypes',
              size: 'mustBeANumber',
              price: 'thisIsNotValidToo',
              quantityInStock: 'thisOneToo',
            })
            .expect(httpStatus.BAD_REQUEST);
        });
      });

      describe('PUT Product', () => {
        test('Should return 200 if id and request body is valid', async () => {
          const res = await request(app)
            .put(`/v1/products/${productOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({ name: 'updatedProductTest' })
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toEqual({
            id: expect.anything(),
            name: 'updatedProductTest',
            description: productOne.description,
            price: productOne.price,
            quantityInStock: productOne.quantityInStock,
            categoryId: categoryOne.id,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });

          const dbProduct = await prisma.product.findUnique({
            where: {
              id: resData.id,
            },
          });

          expect(dbProduct).toBeDefined();
          expect(dbProduct).toMatchObject({
            id: expect.anything(),
            name: 'updatedProductTest',
            description: productOne.description,
            price: productOne.price,
            quantityInStock: productOne.quantityInStock,
            categoryId: categoryOne.id,
            userId: userOne.id,
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
          });
        });

        test('Should return 404 if id is not found', async () => {
          // Set dummy UUID
          await request(app)
            .put(`/v1/products/317a9bb1-9ae9-4a47-bb79-db13dd89ef0d`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({ name: 'updatedProductTest' })
            .expect(httpStatus.NOT_FOUND);
        });

        test('Should return 400 if id is not a valid UUID', async () => {
          await request(app)
            .put('/v1/products/notValidUUID')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body is not a valid data types', async () => {
          await request(app)
            .put(`/v1/products/${productOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send({ name: 123 })
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 400 if request body is empty', async () => {
          await request(app)
            .put(`/v1/products/${productOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });
      });
*/
      describe('DELETE Product', () => {
        test('Should return 200 if id is valid', async () => {
          const res = await request(app)
            .delete(`/v1/products/${productOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
          const resData = res.body.data;

          expect(resData).toBe(null);

          const dbProduct = await prisma.product.findUnique({
            where: {
              id: productOne.id,
            },
          });

          expect(dbProduct).toBeNull();
        });

        test('Should return 400 if id is not a valid UUID', async () => {
          await request(app)
            .delete('/v1/products/notValidUUID')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.BAD_REQUEST);
        });

        test('Should return 404 if id is not found', async () => {
          // Set dummy UUID
          await request(app)
            .delete('/v1/products/317a9bb1-9ae9-4a47-bb79-db13dd89ef0d')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });
      });
    });
  });
});
