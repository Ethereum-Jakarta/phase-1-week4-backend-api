const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const prisma = require('../../prisma');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { insertUsers, userOne } = require('../fixtures/user.fixture');
const { insertCategory, categoryOne } = require('../fixtures/category.fixture');

describe('Category Route', () => {
  let newCategory;
  beforeEach(async () => {
    await insertUsers([userOne]);

    newCategory = {
      name: 'string'
    }
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('/api/category', () => {
    describe('Authentication', () => {
      test('should return 401 error if token not exist', async () => {
        await request(app).get('/api/category').set('Authorization', `Bearer InvalidToken`).expect(httpStatus.UNAUTHORIZED);
      });
    });

    describe('GET', () => {
      test('should return 200 ok', async () => {
        await request(app).get('/api/category').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.OK);
      });
    });

    describe('POST', () => {
      test('should return 201 created', async () => {
        const res = await request(app)
          .post('/api/category')
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send(newCategory)
          .expect(httpStatus.CREATED);

        const category = res.body.data

        expect(category).toEqual({
          id: expect.anything(),
          name: category.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        })

        const dbCategory = await prisma.category.findUnique({
          where: { id: category.id }
        })

        expect(dbCategory).toBeDefined()
        expect(dbCategory).toMatchObject({
          id: expect.anything(),
          name: category.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        })
      });
    });
  });

  describe('/api/category/:categoryId', () => {
    describe('INVALID REQUEST /:categoryId', () => {
      test('should return 400 error if categoryId invalid', async () => {
        await request(app).get('/api/category/invalid-category-id').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.BAD_REQUEST)
      })
    })

    describe('GET', () => {
      test('should return 200 ok', async () => {
        await insertCategory([categoryOne])

        const res = await request(app).get(`/api/category/${categoryOne.id}`).set("Authorization", `Bearer ${userOneAccessToken}`).expect(httpStatus.OK)

        const category = res.body.data

        expect(category).toEqual({
          id: expect.anything(),
          name: categoryOne.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        })

        const dbCategory = await prisma.category.findUnique({
          where: { id: category.id }
        })

        expect(dbCategory).toBeDefined()
        expect(dbCategory).toMatchObject({
          id: expect.anything(),
          name: category.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      })
    })

    describe('PATCH', () => {
      test('should return 200 ok', async () => {
        await insertCategory([categoryOne])

        newCategory = {
          name: 'new string'
        }

        const res = await request(app)
          .patch(`/api/category/${categoryOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .send(newCategory)
          .expect(httpStatus.OK);

        const category = res.body.data

        expect(category).toEqual({
          id: expect.anything(),
          name: newCategory.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        })

        const dbCategory = await prisma.category.findUnique({
          where: { id: category.id }
        })

        expect(dbCategory).toBeDefined()
        expect(dbCategory).toMatchObject({
          id: expect.anything(),
          name: category.name,
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        })
      })
    })

    describe('DELETE', () => {
      test('should return 200 ok', async () => {
        await insertCategory([categoryOne])

        await request(app)
          .delete(`/api/category/${categoryOne.id}`)
          .set('Authorization', `Bearer ${userOneAccessToken}`)
          .expect(200)
      })
    })
  })
});
