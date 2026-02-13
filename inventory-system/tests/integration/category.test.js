const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { categoryOne, insertCategorys } = require('../fixtures/category.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');
const { auth } = require('../../src/middlewares/auth');
const ApiError = require('../../src/utils/ApiError');
const config = require('../../src/config/config');
const { tokenService } = require('../../src/services');
const { tokenTypes } = require('../../src/config/tokens');
const { getAllCategory, getCategoryById } = require('../../src/services/category.service');
const { v4 } = require('uuid');

describe('Category routes', ()=>{

    describe('GET /v1/category', ()=>{
        
        beforeEach(async ()=>{
            await insertUsers([userOne]);
            await insertCategorys([categoryOne]); 
        });

        test('should return 200 and successfully get all categories', async ()=>{
            const res = await request(app)
            .get('/v1/category')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);

        });

        test('should return 401 unauthorized if token not set', async () => {
            const res =await request(app)
                .get('/v1/category')
                .expect(httpStatus.UNAUTHORIZED);
        });

    })

    describe('POST /v1/category', ()=>{
        let newCategory;
    
        beforeEach(async ()=>{
            await insertUsers([userOne]);
            newCategory = {
                name: faker.commerce.productMaterial(),
            };
            
        });

        test('should return 201 and successfully create category if request data is ok', async () => {
            const res = await request(app)
                .post('/v1/category')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(newCategory)
                .expect(httpStatus.CREATED);

               
            const categoryData = res.body.data;
           

            expect(categoryData).toEqual({
                id: expect.anything(),
                name: newCategory.name,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            })

            const dbCategory = await prisma.category.findUnique({
                where: {
                  id: categoryData.id,
                },
              });
        
              expect(dbCategory).toBeDefined();
        
              expect(dbCategory).toMatchObject({
                id: expect.anything(),
                name: newCategory.name,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });
        

           
          
        });

        test('should return 400 data is invalid', async () =>{
            const res = await request(app)
            .post('/v1/category')
            .set('Authorization', `Bearer ${userOneAccessToken}`) 
            .expect(httpStatus.BAD_REQUEST);

            const errorResponse = res.body;
           

            expect(errorResponse).toEqual({
                code: httpStatus.BAD_REQUEST,
                message: expect.anything(),
            })

        })

        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
                .post('/v1/category')
                
                .send(newCategory)
                .expect(httpStatus.UNAUTHORIZED);

               
        });

    
    })

    describe('PATCH /v1/category/:categoryId', ()=>{
        let updatedCategory;

        beforeEach(async () =>{
            await insertUsers([userOne]);
            const insertedCategory = await insertCategorys([categoryOne]);
            updatedCategory = {
                name: faker.commerce.productMaterial(),
            }
        })

        test('should return 200 and successfully update category if request data is ok', async ()=>{
            const res = await request(app)
            .patch(`/v1/category/${categoryOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(updatedCategory)
            .expect(httpStatus.OK);

            const categoryData = res.body.data;

            expect(categoryData).toEqual({
              id: categoryOne.id,
              name: updatedCategory.name,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            });

            const dbCategory = await prisma.category.findUnique({
                where: {
                  id: categoryData.id,
                },
              });

            expect(dbCategory).toBeDefined();
            expect(dbCategory).toMatchObject({
                id: categoryOne.id,
                name: updatedCategory.name,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });

        })

        test('should return 400 if data is invalid', async () => {
            const res = await request(app)
              .patch(`/v1/category/${categoryOne.id}`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .expect(httpStatus.BAD_REQUEST);
        
            const errorResponse = res.body;
        
            expect(errorResponse).toEqual({
              code: httpStatus.BAD_REQUEST,
              message: expect.anything(),
            });
        });

        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
              .patch(`/v1/category/${categoryOne.id}`)
              .send(updatedCategory)
              .expect(httpStatus.UNAUTHORIZED);
        }); 

        test('should return 404 if category not found', async () => {
            
            const res = await request(app)
              .patch(`/v1/category/`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .send(updatedCategory)
              .expect(httpStatus.NOT_FOUND);
          });

        
    })

    describe('DELETE /v1/category/:categoryId', () => {
        beforeEach(async () => {
          await insertUsers([userOne]);
          await insertCategorys([categoryOne]);
        });
      
        test('should return 200 and successfully delete category if request is valid', async () => {
          const res = await request(app)
            .delete(`/v1/category/${categoryOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);
      
          const dbCategory = await prisma.category.findUnique({
            where: {
              id: categoryOne.id,
            },
          });
      
          expect(dbCategory).toBeNull();
        });
      
        test('should return 401 unauthorized if token not set', async () => {
          await request(app)
            .delete(`/v1/category/${categoryOne.id}`)
            .expect(httpStatus.UNAUTHORIZED);
        });
      
        test('should return 404 if category not found', async () => {
          await request(app)
            .delete(`/v1/category/`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.NOT_FOUND);
        });
    });
      

});