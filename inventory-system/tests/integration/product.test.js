const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const app = require('../../src/app');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { productOne, insertProducts } = require('../fixtures/product.fixture');
const { categoryOne, insertCategorys, categoryTwo } = require('../fixtures/category.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');
const { auth } = require('../../src/middlewares/auth');
const ApiError = require('../../src/utils/ApiError');
const config = require('../../src/config/config');
const { tokenService } = require('../../src/services');
const { tokenTypes } = require('../../src/config/tokens');
const { getAllProducts, getProductById } = require('../../src/services/product.service');
const { v4 } = require('uuid');


describe('Product routes', ()=>{
    describe('GET /v1/product', ()=>{
        beforeEach(async ()=>{
            await insertUsers([userOne]);
            await insertCategorys([categoryOne]);
            await insertProducts([productOne]); 
        });

        test('should return 200 and successfully get all products', async ()=>{
            const res = await request(app)
            .get('/v1/product')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);

        });

        test('should return 401 unauthorized if token not set', async () => {
            const res =await request(app)
                .get('/v1/product')
                .expect(httpStatus.UNAUTHORIZED);
        });
    })

    describe('POST /v1/product', ()=>{
        let newProduct;
        beforeEach(async ()=>{
            await insertUsers([userOne]);
            await insertCategorys([categoryOne]);
            await insertProducts([productOne]); 

            newProduct = {
                name: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price()),
                quantityInStock: parseInt(faker.commerce.price()),
                categoryId:categoryOne.id,
                userId:userOne.id 
            }
        });

        test('should return 201 and successfully create product if request data is ok', async () => {
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
            })

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

        test('should return 400 data is invalid', async () =>{
            const res = await request(app)
            .post('/v1/product')
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
                .post('/v1/product')
                
                .send(newProduct)
                .expect(httpStatus.UNAUTHORIZED);

               
        });



    })

    describe('PATCH /v1/product/:productId', ()=>{
        let updatedProduct;
        beforeEach(async ()=>{
            await insertUsers([userOne]);
            await insertCategorys([categoryOne,categoryTwo]);
            await insertProducts([productOne]); 

            updatedProduct = {
                name: faker.commerce.product(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price()),
                quantityInStock: parseInt(faker.commerce.price()),
                categoryId:categoryTwo.id,
                userId:userOne.id 
            }
        });

        test('should return 200 and successfully update product if request data is ok', async ()=>{
            const res = await request(app)
            .patch(`/v1/product/${productOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(updatedProduct)
            .expect(httpStatus.OK);

            const productData = res.body.data;
            
            expect(productData).toEqual({
              id: productOne.id,
              name: updatedProduct.name,
              description: updatedProduct.description,
              price: updatedProduct.price,
              quantityInStock: updatedProduct.quantityInStock,
              categoryId: updatedProduct.categoryId,
              userId: updatedProduct.userId,
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
                id: productOne.id,
                name: updatedProduct.name,
                description: updatedProduct.description,
                price: updatedProduct.price,
                quantityInStock: updatedProduct.quantityInStock,
                categoryId: updatedProduct.categoryId,
                userId: updatedProduct.userId,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });

        })

        test('should return 400 if data is invalid', async () => {
            const res = await request(app)
              .patch(`/v1/product/${productOne.id}`)
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
              .patch(`/v1/product/${productOne.id}`)
              .send(updatedProduct)
              .expect(httpStatus.UNAUTHORIZED);
        }); 

        test('should return 404 if product not found', async () => {
            
            const res = await request(app)
              .patch(`/v1/product/`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .send(updatedProduct)
              .expect(httpStatus.NOT_FOUND);
          });



    })

    describe('DELETE /v1/product/:productId', ()=>{
        beforeEach(async ()=>{
            await insertUsers([userOne]);
            await insertCategorys([categoryOne]);
            await insertProducts([productOne]); 
        });
        
        
        test('should return 200 and successfully delete product if request is valid', async () => {
            const res = await request(app)
              .delete(`/v1/product/${productOne.id}`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .expect(httpStatus.OK);
        
            const dbProduct = await prisma.product.findUnique({
              where: {
                id: productOne.id,
              },
            });
        
            expect(dbProduct).toBeNull();
          });
        
          test('should return 401 unauthorized if token not set', async () => {
            await request(app)
              .delete(`/v1/product/${productOne.id}`)
              .expect(httpStatus.UNAUTHORIZED);
          });
        
          test('should return 404 if product not found', async () => {
            await request(app)
              .delete(`/v1/product/`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .expect(httpStatus.NOT_FOUND);
          });
    })
})