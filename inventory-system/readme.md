# Create Inventory System | Using Node.js, Express.js, Prisma, Mysql, Joi, Passport, Jest, etc...

## End Point

Each Endpoint has authentication and Validate middleware using Joi.
The Inventory System application has 2 roles, admin and user.
**All Endpoints**

```bash
/api/auth
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout ( not yet stable )
/api/users
- GET /api/users
- POST /api/users
- GET /api/users/:userId
- PUT /api/users/:userId
- DELETE /api/users/:userId
- GET /api/users/:userId/products
- GET /api/users/:userId/orders
/api/category
- GET /api/category
- POST /api/category
- GET /api/category/:categoryId
- PATCH /api/category/:categoryId
- DELETE /api/category/:categoryId
/api/products
- GET /api/products
- POST /api/products
- GET /api/products/:productId
- PUT /api/products/:productId
- DELETE /api/products/:productId
/api/orders
- GET /api/orders
- POST /api/orders
- GET /api/orders/:orderId
- PUT /api/orders/:orderId
- DELETE /api/orders/:orderId
- GET /api/orders/:orderId/order-items
/api/order-items
- GET /api/order-items
- POST /api/order-items
- GET /api/order-items/:orderItemId
- PUT /api/order-items/:orderItemId
- DELETE /api/order-items/:orderItemId
```

**Admin:**

```bash
[*]
```

**User:**

```bash
/api/auth/*
/api/products/*
/api/category/*
```

\*_example of user routes_

```js
router
  .route('/')
  .get(adminAuth(), userController.getAllUsers)
  .post(adminAuth(), validate(userValidation.createUser), userController.createUser);

router
  .route('/:userId')
  .get(adminAuth(), validate(userValidation.getUser), userController.getUser)
  .put(adminAuth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(adminAuth(), validate(userValidation.deleteUser), userController.deleteUser);

router
  .route('/:userId/products')
  .get(adminAuth(), validate(userValidation.getProductsByUser), userController.getProductsByUser);

router.route('/:userId/orders').get(adminAuth(), validate(userValidation.getOrdersByUser), userController.getOrdersByUser);

module.exports = router;
```

## All Successful Responses From Each Route | Not With /api/auth/\*

### /api/users

**GET /api/users**

```bash
@QUERY:
- skip
- limit

{
    "status": 200,
    "message": "Get Users Succesfully",
    "totalPage": 2,
    "totalData": 25,
    "data": [
        {
            "id": "06217082-5735-4e3d-9123-287f751ad69a",
            "name": "zexo",
            "email": "e@gmail.com",
            "password": "$2a$08$koXD1v2bhz9Cl11cZBSElOLnwOlLwp7Pnjh3HNJJKawVAEf9TqDnu",
            "role": "user",
            "createdAt": "2023-09-26T05:07:11.213Z",
            "updatedAt": "2023-09-26T05:07:11.213Z",
            "isEmailVerified": false
        },
        ...
    ]
}
```

**POST /api/users**

```bash
{
    "status": 201,
    "message": "Create User Successfully",
    "data": {
        "id": "b543c3fb-e3a6-46e8-bce5-897bc426501d",
        "name": "string",
        "email": "string@gmail.com",
        "password": "$2a$08$lVReEw0pK980g93h3lU3i.hAmp1tB387hZigZo1BPHBmV8T4XGwc2",
        "role": "user",
        "createdAt": "2023-09-26T01:54:06.036Z",
        "updatedAt": "2023-09-26T01:54:06.036Z",
        "isEmailVerified": false
    }
}
```

**GET /api/users/:userId**

```bash
{
    "status": 200,
    "message": "Get User Succesfully",
    "data": {
        "id": "1f4bafc6-e730-4a4b-9b61-046c10695cab",
        "name": "string",
        "email": "string@gmail.com",
        "password": "$2a$08$2pyKl/eVAmnIzQrDqknU6Ow8vuVohgU553QlYONmaAebX2us6Vt6m",
        "role": "admin",
        "createdAt": "2023-09-24T23:24:34.064Z",
        "updatedAt": "2023-09-24T23:24:34.064Z",
        "isEmailVerified": false
    }
}
```

**PUT /api/users/:userId**

```bash
{
    "status": 201,
    "message": "Update User Succesfully",
    "data": {
        "id": "1f4bafc6-e730-4a4b-9b61-046c10695cab",
        "name": "string",
        "email": "string@gmail.com",
        "password": "validPassword@1",
        "role": "admin",
        "createdAt": "2023-09-24T23:24:34.064Z",
        "updatedAt": "2023-09-26T01:58:34.200Z",
        "isEmailVerified": false
    }
}
```

**DELETE /api/users/:userId**

```bash
204 No Content
```

**GET /api/users/:userId/products**

```bash
{
    "status": 200,
    "message": "Get Products Succesfully",
    "data": [
        {
            "id": "5b6a943c-cf41-4e1d-abbd-60cb8ff7c170",
            "name": "Typescript Course For Beginner",
            "description": "Fundamental Typescript",
            "price": 150.3,
            "quantityInStock": 10,
            "createdAt": "2023-09-26T04:01:32.985Z",
            "updatedAt": "2023-09-26T04:04:34.604Z",
            "categoryId": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
            "userId": "2109c487-bafc-4b30-8880-da0b1f252afc"
        }
    ]
}
```

**GET /api/users/:userId/orders**

```bash
{
    "status": 200,
    "message": "Get Orders Succesfully",
    "data": [
        {
            "id": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
            "date": "2023-09-29T08:00:00.000Z",
            "totalPrice": 258,
            "customerName": "Siska Aprilla",
            "customerEmail": "siska@gmail.com",
            "userId": "2109c487-bafc-4b30-8880-da0b1f252afc",
            "createdAt": "2023-09-26T09:57:05.698Z",
            "updatedAt": "2023-09-26T11:08:43.943Z"
        },
    ]
}
```

### /api/products

**GET /api/products**

```bash
@QUERY:
- skip
- limit
- category

{
    "status": 200,
    "message": "Get Products Succesfully",
    "totalPage": 1,
    "totalData": 1,
    "data": [
        {
            "id": "5b6a943c-cf41-4e1d-abbd-60cb8ff7c170",
            "name": "Typescript Course For Beginner",
            "description": "Fundamental Typescript",
            "price": 150.3,
            "quantityInStock": 10,
            "createdAt": "2023-09-26T04:01:32.985Z",
            "updatedAt": "2023-09-26T04:04:34.604Z",
            "categoryId": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
            "userId": "2109c487-bafc-4b30-8880-da0b1f252afc"
        },
        ...
    ]
}
```

**POST /api/products**

```bash
{
    "status": 201,
    "message": "Create Product Succesfully",
    "data": {
        "id": "5b6a943c-cf41-4e1d-abbd-60cb8ff7c170",
        "name": "Typescript Course",
        "description": "Fundamental Typescript",
        "price": 129,
        "quantityInStock": 5,
        "createdAt": "2023-09-26T04:01:32.985Z",
        "updatedAt": "2023-09-26T04:01:32.985Z",
        "categoryId": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
        "userId": "2109c487-bafc-4b30-8880-da0b1f252afc"
    }
}
```

**GET /api/products/:productId**

```bash
{
    "status": 200,
    "message": "Get Product Succesfully",
    "data": {
        "id": "5b6a943c-cf41-4e1d-abbd-60cb8ff7c170",
        "name": "Typescript Course",
        "description": "Fundamental Typescript",
        "price": 129,
        "quantityInStock": 5,
        "createdAt": "2023-09-26T04:01:32.985Z",
        "updatedAt": "2023-09-26T04:01:32.985Z",
        "categoryId": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
        "userId": "2109c487-bafc-4b30-8880-da0b1f252afc"
    }
}
```

**PUT /api/products/:productId**

```bash
{
    "status": 201,
    "message": "Update Product Succesfully",
    "data": {
        "id": "5b6a943c-cf41-4e1d-abbd-60cb8ff7c170",
        "name": "Typescript Course For Beginner",
        "description": "Fundamental Typescript",
        "price": 150.3,
        "quantityInStock": 10,
        "createdAt": "2023-09-26T04:01:32.985Z",
        "updatedAt": "2023-09-26T04:04:34.604Z",
        "categoryId": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
        "userId": "2109c487-bafc-4b30-8880-da0b1f252afc"
    }
}
```

**DELETE /api/products/:productId**

```bash
No Content
```

### /api/category

**GET /api/category**

```bash
{
    "status": 200,
    "message": "Get Categorys Success",
    "data": [
        {
            "id": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
            "name": "Programming",
            "createdAt": "2023-09-26T03:58:42.420Z",
            "updatedAt": "2023-09-26T03:58:42.420Z"
        }
    ]
}
```

**POST /api/category**

```bash
{
    "status": 201,
    "message": "Create Category Success",
    "data": {
        "id": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
        "name": "Programming",
        "createdAt": "2023-09-26T03:58:42.420Z",
        "updatedAt": "2023-09-26T03:58:42.420Z"
    }
}
```

**GET /api/category/:categoryId**

```bash
{
    "status": 200,
    "message": "Get Category Success",
    "data": {
        "id": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
        "name": "Programming",
        "createdAt": "2023-09-26T03:58:42.420Z",
        "updatedAt": "2023-09-26T03:58:42.420Z"
    }
}
```

**PATCH /api/category/:categoryId**

```bash
{
    "status": 200,
    "message": "Update Category Success",
    "data": {
        "id": "c5dfe469-0239-44ff-969f-2e4e116d4d8c",
        "name": "Typescript Course Free",
        "createdAt": "2023-09-26T03:58:42.420Z",
        "updatedAt": "2023-09-30T07:59:51.871Z"
    }
}
```

**DELETE /api/category/:categoryId**

```bash
{
    "status": 200,
    "message": "Delete Category Success",
    "data": null
}
```

### /api/orders

**GET /api/orders**

```bash
@QUERY:
- skip
- limit

{
    "status": 200,
    "message": "Get Orders Succesfully",
    "totalPage": 1,
    "totalData": 1,
    "data": [
        {
            "id": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
            "date": "2023-09-29T08:00:00.000Z",
            "totalPrice": 0,
            "customerName": "Siska",
            "customerEmail": "siska@gmail.com",
            "userId": "2109c487-bafc-4b30-8880-da0b1f252afc",
            "createdAt": "2023-09-26T09:57:05.698Z",
            "updatedAt": "2023-09-26T09:57:05.698Z"
        },
        ...
    ]
}
```

**POST /api/orders**

```bash
{
    "status": 201,
    "message": "Create Order Succesfully",
    "data": {
        "id": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
        "date": "2023-09-29T08:00:00.000Z",
        "totalPrice": 0,
        "customerName": "Siska",
        "customerEmail": "siska@gmail.com",
        "userId": "2109c487-bafc-4b30-8880-da0b1f252afc",
        "createdAt": "2023-09-26T09:57:05.698Z",
        "updatedAt": "2023-09-26T09:57:05.698Z"
    }
}
```

**GET /api/orders/:orderId**

```bash
{
    "statsu": 200,
    "message": "Get Order Succesfully",
    "data": {
        "id": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
        "date": "2023-09-29T08:00:00.000Z",
        "totalPrice": 258,
        "customerName": "Siska",
        "customerEmail": "siska@gmail.com",
        "userId": "2109c487-bafc-4b30-8880-da0b1f252afc",
        "createdAt": "2023-09-26T09:57:05.698Z",
        "updatedAt": "2023-09-26T10:57:25.240Z"
    }
}
```

**PUT /api/orders/:orderId**

```bash
{
    "status": 201,
    "message": "Update Order Succesfully",
    "data": {
        "id": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
        "date": "2023-09-29T08:00:00.000Z",
        "totalPrice": 258,
        "customerName": "Siska Aprilla",
        "customerEmail": "siska@gmail.com",
        "userId": "2109c487-bafc-4b30-8880-da0b1f252afc",
        "createdAt": "2023-09-26T09:57:05.698Z",
        "updatedAt": "2023-09-26T11:08:43.943Z"
    }
}
```

**DELETE /api/orders/:orderId**

```bash
No Content
```

**GET /api/orders/:orderId/order-items**

```bash
{
    "status": 200,
    "message": "Get Orders Succesfully",
    "data": [
        {
            "id": "e6e87b1f-c9a1-4f76-92e5-d310f1067483",
            "orderId": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
            "productId": "38964109-78af-491c-a06d-5a80d4dbbcee",
            "quantity": 2,
            "unitPrice": 129,
            "createdAt": "2023-09-26T10:17:10.817Z",
            "updatedAt": "2023-09-26T10:17:10.817Z"
        }
    ]
}
```

### /api/order-items

**GET /api/order-items**

```bash
@QUERY:
- skip
- limit

{
    "status": 200,
    "message": "Get OrderItems Succesfully",
    "totalPage": 1,
    "totalData": 3,
    "data": [
        {
            "id": "2d171c6c-d99f-43b6-bd3f-fa727d0c08af",
            "orderId": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
            "productId": "38964109-78af-491c-a06d-5a80d4dbbcee",
            "quantity": 2,
            "unitPrice": 129,
            "createdAt": "2023-09-26T10:17:42.985Z",
            "updatedAt": "2023-09-26T10:17:42.985Z"
        },
        ...
    ]
}
```

**POST /api/order-items**

```bash
{
    "status": 201,
    "message": "Create OrderItem Succesfully",
    "data": {
        "id": "54f5ad76-8d08-48f8-90ce-3d602f8e41ad",
        "orderId": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
        "productId": "37f4e54b-26eb-4eec-92c4-87bb80a871e0",
        "quantity": 2,
        "unitPrice": 129,
        "createdAt": "2023-09-26T10:16:39.635Z",
        "updatedAt": "2023-09-26T10:16:39.635Z"
    }
}
```

**GET /api/order-items/:orderItemId**

```bash
{
    "status": 200,
    "message": "Get OrderItem Succesfully",
    "data": {
        "id": "2d171c6c-d99f-43b6-bd3f-fa727d0c08af",
        "orderId": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
        "productId": "38964109-78af-491c-a06d-5a80d4dbbcee",
        "quantity": 2,
        "unitPrice": 129,
        "createdAt": "2023-09-26T10:17:42.985Z",
        "updatedAt": "2023-09-26T10:17:42.985Z"
    }
}
```

**PUT /api/order-items/:orderItemId**

```bash
{
    "status": 201,
    "message": "Update OrderItem Succesfully",
    "data": {
        "id": "2d171c6c-d99f-43b6-bd3f-fa727d0c08af",
        "orderId": "02a2e76c-bdc1-44c3-8bc2-b105c4402b25",
        "productId": "38964109-78af-491c-a06d-5a80d4dbbcee",
        "quantity": 2,
        "unitPrice": 129,
        "createdAt": "2023-09-26T10:17:42.985Z",
        "updatedAt": "2023-09-26T10:49:38.896Z"
    }
}
```

**DELETE /api/order-items/:orderItemId**

```bash
No Content
```

## API TESTING

Each route already has a TESTING API.
**Example of Testing Route User**

```js
// tests/integration/user.test.js

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
```

## Error Handler

```js
// /src/middlewares/error.js
const httpStatus = require('http-status');
const { Prisma } = require('@prisma/client');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const handlePrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      // handling duplicate key errors
      return new ApiError(400, `Duplicate field value: ${err.meta.target}`, false, err.stack);
    case 'P2014':
      // handling invalid id errors
      return new ApiError(400, `Invalid ID: ${err.meta.target}`, false, err.stack);
    case 'P2003':
      // handling invalid data errors
      return new ApiError(400, `Invalid input data: ${err.meta.target}`, false, err.stack);
    default:
      // handling all other errors
      return new ApiError(500, `Something went wrong: ${err.message}`, false, err.stack);
  }
};

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    // if error from axios or http request
    if (error.response) {
      const message = err.response.data.message || err.response.data;
      const statusCode = error.response.status;

      logger.info('handleAxiosError');
      error = new ApiError(statusCode, message, false, err.stack);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // Handling Prisma Error
      logger.info('handlePrismaError');
      error = handlePrismaError(err);
    } else {
      // Handling Global Error
      const { statusCode } = error;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
```

## Dependencies:

```bash
@prisma/client (^5.3.1)
bcryptjs (^2.4.3)
compression (^1.7.4)
cors (^2.8.5)
cross-env (^7.0.0)
dotenv (^10.0.0)
express (^4.17.1)
express-rate-limit (^5.0.0)
helmet (^4.1.0)
http-status (^1.4.0)
joi (^17.10.2)
jsonwebtoken (^8.5.1)
moment (^2.24.0)
morgan (^1.9.1)
nodemailer (^6.3.1)
passport (^0.4.0)
passport-jwt (^4.0.0)
pm2 (^5.1.0)
swagger-jsdoc (^6.0.8)
swagger-ui-express (^4.1.6)
uuid (^9.0.1)
validator (^13.0.0)
winston (^3.2.1)
xss-clean (^0.1.1)
```

## Dev Dependencies

```bash
coveralls (^3.0.7)
eslint (^7.0.0)
eslint-config-airbnb-base (^14.0.0)
eslint-config-prettier (^8.1.0)
eslint-plugin-import (^2.18.2)
eslint-plugin-jest (^24.0.1)
eslint-plugin-prettier (^3.1.1)
eslint-plugin-security (^1.4.0)
faker (^5.1.0)
husky (^7.0.0)
jest (^29.7.0)
lint-staged (^11.0.0)
node-mocks-http (^1.8.0)
nodemon (^2.0.0)
prettier (^2.0.5)
prisma (^4.16.2)
supertest (^6.0.1)
```

## Locally

```bash
git clone https://github.com/weiwei2694/Week4-Backend-Server-API.git
cd inventory-system
npm install
npm run dev
```
