const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const prisma = require('../../prisma');
const { adminAccessToken } = require('../fixtures/token.fixture');
const { insertUsers, userOne, admin, userTwo } = require('../fixtures/user.fixture');

describe('User Routes', () => {
  beforeEach(async () => {
    await insertUsers([admin]);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('Authentication', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: 'string',
        email: 'weiwei@gmail.com',
        password: 'ahdkasdhkd@A2130u',
      };
    });

    test('should return 401 error if there is no token', async () => {
      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${'invalid token'}`)
        .send(newUser)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('ROUTE /api/users', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: 'string',
        email: 'weiwei@gmail.com',
        password: 'ahdkasdhkd@A2130u',
      };
    });

    describe('POST', () => {
      test('should return 201 and successfully register user if request data is ok', async () => {
        const res = await request(app)
          .post('/api/users')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newUser)
          .expect(httpStatus.CREATED);

        const userData = res.body.data;

        expect(userData).toEqual({
          id: expect.anything(),
          name: newUser.name,
          password: expect.anything(),
          email: newUser.email,
          role: expect.anything(),
          isEmailVerified: false,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbUser = await prisma.user.findUnique({
          where: {
            id: userData.id,
          },
        });

        expect(dbUser).toBeDefined();
        expect(dbUser.password).not.toBe(newUser.password);

        expect(dbUser).toMatchObject({
          id: expect.anything(),
          name: newUser.name,
          password: expect.anything(),
          email: newUser.email,
          role: expect.anything(),
          isEmailVerified: false,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });

      test('should return 400 error if email is invalid', async () => {
        await insertUsers[admin];
        newUser.email = 'invalid email';
        await request(app)
          .post('/api/users')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newUser)
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 400 error if password is invalid', async () => {
        await insertUsers[admin];
        newUser.password = 'invalidpassword';

        await request(app)
          .post('/api/users')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newUser)
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 400 error if email is already used', async () => {
        await insertUsers([userOne]);
        newUser.email = userOne.email;
        await request(app)
          .post('/api/users')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newUser)
          .expect(httpStatus.BAD_REQUEST);
      });
    });

    describe('GET', () => {
      test('should return 200 ok', async () => {
        await insertUsers([userOne]);

        const res = await request(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK);

        const users = res.body.data;

        /**
         * @toContainEqual
         *
         * saya ga tau, ini best practices kah atau bukan
         * tapi dari docs yang saya baca, saya ketemunya ini
         * jadi saya coba implementasi dan bekerja
         * saya ga bisa matching array of object ( kurang tau cara nya )
         */
        expect(users).toContainEqual({
          id: expect.anything(),
          name: userOne.name,
          password: expect.anything(),
          email: userOne.email,
          role: expect.anything(),
          isEmailVerified: false,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });

        const dbUsers = await prisma.user.findMany();

        expect(dbUsers).toBeDefined();
        expect(dbUsers).toContainEqual({
          id: expect.anything(),
          name: userOne.name,
          password: expect.anything(),
          email: userOne.email,
          role: expect.anything(),
          isEmailVerified: false,
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
        });
      });
    });
  });

  describe('ROUTE /api/users/:userId', () => {
    describe('INVALID REQUEST /:userId', () => {
      test('should return 400 error if userId invalid', async () => {
        await request(app)
          .get(`/api/users/invalidid`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.BAD_REQUEST);
      });
    });

    describe('GET', () => {
      test('should return 200 ok', async () => {
        await insertUsers([userOne]);

        await request(app)
          .get(`/api/users/${userOne.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK);
      });
    });

    describe('PUT', () => {
      test('should return 201 created', async () => {
        await insertUsers([userOne]);

        let updateUser = {
          name: 'string',
          email: 'string@gmail.com',
          password: 'validPassword201@',
        };

        await request(app)
          .put(`/api/users/${userOne.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateUser)
          .expect(httpStatus.CREATED);
      });

      test('should return 400 error if email invalid', async () => {
        await insertUsers([userOne]);

        let updateUser = {
          name: 'string',
          email: 'invalid email',
          password: 'validPassword201@',
        };

        await request(app)
          .put(`/api/users/${userOne.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateUser)
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 400 error if password invalid', async () => {
        await insertUsers([userOne]);

        let updateUser = {
          name: 'string',
          email: 'string@gmail.com',
          password: 'invalidpassword',
        };

        await request(app)
          .put(`/api/users/${userOne.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateUser)
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 400 error if email already exist', async () => {
        await insertUsers([userOne, userTwo]);

        let updateUser = {
          name: 'string',
          email: userTwo.email,
          password: 'validPassword@21',
        };

        await request(app)
          .put(`/api/users/${userOne.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateUser)
          .expect(httpStatus.BAD_REQUEST);
      });
    });

    describe('DELETE', () => {
      test('should return 204 no content', async () => {
        await insertUsers([userOne]);

        await request(app).delete(`/api/users/${userOne.id}`).set('Authorization', `Bearer ${adminAccessToken}`).expect(204);
      });
    });

    describe('ROUTE /api/users/:userId/products', () => {
      describe('GET', () => {
        test('should return 200 ok', async () => {
          await insertUsers([userOne]);

          await request(app)
            .get(`/api/users/${userOne.id}/products`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
        });
      });
    });

    describe('ROUTE /api/users/:userId/orders', () => {
      describe('GET', () => {
        test('should return 200 ok', async () => {
          await insertUsers([userOne]);

          await request(app)
            .get(`/api/users/${userOne.id}/orders`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);
        });
      });
    });
  });
});
