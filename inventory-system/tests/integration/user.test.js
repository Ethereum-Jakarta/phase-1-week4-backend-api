const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');
const { auth } = require('../../src/middlewares/auth');
const ApiError = require('../../src/utils/ApiError');
const config = require('../../src/config/config');
const { tokenService } = require('../../src/services');
const { tokenTypes } = require('../../src/config/tokens');
const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');


describe('User routes', ()=>{

    
    describe('GET /v1/user', ()=>{
        beforeEach(async ()=>{ 
            await insertUsers([admin]);
            await insertUsers([userOne]);
        })
        test('should return 200 and successfully get all users if user role is admin', async ()=>{
            const res = await request(app)
            .get('/v1/user')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);

        });
        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
                .get('/v1/user')
                .expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 403 forbidden if user role not admin', async ()=>{
            const res = await request(app)
            .get('/v1/user')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.FORBIDDEN);

        });
    })

    describe('POST /v1/user', ()=>{
        let newUser;
        let newAdmin;
       
        beforeEach(async ()=>{
            await insertUsers([admin, userOne]) 

            newUser = {
                name: faker.name.findName(),
                email: faker.internet.email().toLowerCase(),
                password: 'password1',
            }
          
            
        })

        test('should return 201 and successfully create user with role user if request data is ok and user role is admin', async () => {
            const res = await request(app)
                .post('/v1/user')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(httpStatus.CREATED)

            const userData = res.body.data;
           
           // console.log(userData);

            expect(userData).toEqual({
                id: expect.anything(),
                name: newUser.name,
                email: newUser.email,
                password: expect.anything(),
                role: 'user',
                isEmailVerified: false,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            })

            const dbUser = await prisma.user.findUnique({
                where: {
                  id: userData.id,
                },
              });
        
              expect(dbUser).toBeDefined();

        
              expect(dbUser).toMatchObject({
                id: expect.anything(),
                name: newUser.name,
                email: newUser.email,
                password: expect.anything(),
                role: 'user',
                isEmailVerified: false,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });
          
          
        });

        test('should return 400 data is invalid', async () =>{
            const res = await request(app)
            .post('/v1/user')
            .set('Authorization', `Bearer ${adminAccessToken}`) 
            .expect(httpStatus.BAD_REQUEST);

            const errorResponse = res.body;
           

            expect(errorResponse).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: expect.anything(),
            })

        })

      

        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
                .post('/v1/user')
                
                .send(newUser)
                .expect(httpStatus.UNAUTHORIZED);

               
        });

        test('should return 403 forbidden if user role not admin', async () => {
            const res = await request(app)
                .post('/v1/user')
                .set('Authorization', `Bearer ${userOneAccessToken}`) 
                .send(newUser)
                .expect(httpStatus.FORBIDDEN);

               
        });







    })

 

    describe('PATCH /v1/user/:userId', ()=>{
        let updatedUser;
        
       
        beforeEach(async ()=>{
            await insertUsers([admin])
            await insertUsers([userOne])
            

            updatedUser = {
                name: faker.name.findName(),
                email: faker.internet.email().toLowerCase(),
                password: 'password123',
                
            }
          
            
        })
        test('should return 200 and successfully update user if request data is ok and user role is admin', async ()=>{
            const res = await request(app)
            .patch(`/v1/user/${userOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(updatedUser)
            .expect(httpStatus.OK);

            const userData = res.body.data;
           
           // console.log(userData);

            expect(userData).toMatchObject({
                id: expect.anything(),
                name: updatedUser.name,
                email: updatedUser.email,
                password: expect.anything(),
                role: 'user',
                isEmailVerified: false,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            })

            // const dbUser = await prisma.user.findUnique({
            //     where: {
            //       id: userData.id,
            //     },
            //   });
        
            //   expect(dbUser).toBeDefined();

        
            //   expect(dbUser).toMatchObject({
            //     id: expect.anything(),
            //     name: updatedUser.name,
            //     email: userOne.email,
            //     password: expect.anything(),
            //     role: userOne.role,
            //     isEmailVerified: false,
            //     createdAt: expect.anything(),
            //     updatedAt: expect.anything(),
            //   });

          

        })

        test('should return 400 if data is invalid', async () => {
            const res = await request(app)
              .patch(`/v1/user/${userOne.id}`)
              .set('Authorization', `Bearer ${adminAccessToken}`)
              .expect(httpStatus.BAD_REQUEST);
        
            const errorResponse = res.body;
        
            expect(errorResponse).toEqual({
              code: httpStatus.BAD_REQUEST,
              message: expect.anything(),
            });
        });

        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
              .patch(`/v1/user/${userOne.id}`)
              .send(updatedUser)
              .expect(httpStatus.UNAUTHORIZED);
        }); 

        test('should return 403 forbidden if user role not admin', async () => {
            const res = await request(app)
              .patch(`/v1/user/${userOne.id}`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .send(updatedUser)
              .expect(httpStatus.FORBIDDEN);
        }); 



        test('should return 404 if user not found', async () => {
            
            const res = await request(app)
              .patch(`/v1/user/`)
              .set('Authorization', `Bearer ${adminAccessToken}`)
              .send(updatedUser)
              .expect(httpStatus.NOT_FOUND);
          });
    })

    
    
    describe('DELETE /v1/user/:userId', ()=>{
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
        })

        test('should return 200 and successfully delete order item if request is valid and user role is admin', async () => {
            const res = await request(app)
              .delete(`/v1/user/${userOne.id}`)
              .set('Authorization', `Bearer ${adminAccessToken}`)
              .expect(httpStatus.OK);
       
            const dbUser = await prisma.user.findUnique({
              where: {
                id: userOne.id,
              },
            });
  
            expect(dbUser).toBeNull();
          });
        
          test('should return 401 unauthorized if token not set', async () => {
            await request(app)
              .delete(`/v1/user/${userOne.id}`)
              .expect(httpStatus.UNAUTHORIZED);
          });

          test('should return 403 forbidden if user role not admin', async () => {
            await request(app)
              .delete(`/v1/user/${userOne.id}`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .expect(httpStatus.FORBIDDEN);
          });
        
          test('should return 404 if user not found', async () => {
            await request(app)
              .delete(`/v1/user/`)
              .set('Authorization', `Bearer ${adminAccessToken}`)
              .expect(httpStatus.NOT_FOUND);
          });
    })

    
})
