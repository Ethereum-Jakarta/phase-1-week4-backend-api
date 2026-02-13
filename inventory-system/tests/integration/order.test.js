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
const { getAllOrder, getOrderById } = require('../../src/services/order.service');
const { v4 } = require('uuid');
const { insertOrders, orderOne, orderTwo } = require('../fixtures/order.fixture');
const { insertOrderItems, orderItemOne } = require('../fixtures/orderItem.fixture');
const { insertCategorys, categoryOne } = require('../fixtures/category.fixture');
const { insertProducts, productOne } = require('../fixtures/product.fixture');

describe('Order routes', ()=>{
 
    describe('GET /v1/order', ()=>{
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
            await insertOrders([orderOne]);    
        });
        test('should return 200 and successfully get all orders if user role is admin', async ()=>{
            const res = await request(app)
            .get('/v1/order')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(httpStatus.OK);

        });

        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
                .get('/v1/order')
                .expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 403 forbidden if user role not admin', async ()=>{
            const res = await request(app)
            .get('/v1/order')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.FORBIDDEN);

        });
    })

    describe('POST /v1/order', ()=>{
        let newOrder;
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
            await insertOrders([orderOne]);    

            newOrder = {
                date: faker.date.recent(),
                totalPrice: parseFloat(faker.commerce.price()),
                customerName: faker.name.findName(),
                customerEmail: faker.internet.email().toLowerCase(),
                userId:userOne.id
            }
        });

        test('should return 201 and successfully create order if request data is ok and user role is admin', async () => {
            const res = await request(app)
                .post('/v1/order')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newOrder)
                .expect(httpStatus.CREATED);

               
            const orderData = res.body.data;
           

            expect(orderData).toEqual({
                id: expect.anything(),
                date: newOrder.date.toISOString(),
                totalPrice: newOrder.totalPrice,
                customerName: newOrder.customerName,
                customerEmail: newOrder.customerEmail,
                userId: newOrder.userId,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            })

            const dbOrder = await prisma.order.findUnique({
                where: {
                  id: orderData.id,
                },
              });
        
              expect(dbOrder).toBeDefined();

        
              expect(dbOrder).toMatchObject({
                id: expect.anything(),
                date: newOrder.date,
                totalPrice: newOrder.totalPrice,
                customerName: newOrder.customerName,
                customerEmail: newOrder.customerEmail,
                userId: newOrder.userId,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });
          
          
        });

        test('should return 400 data is invalid', async () =>{
            const res = await request(app)
            .post('/v1/order')
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
                .post('/v1/order')
                
                .send(newOrder)
                .expect(httpStatus.UNAUTHORIZED);

               
        });

        test('should return 403 forbidden if user role not admin', async () => {
            const res = await request(app)
                .post('/v1/order')
                .set('Authorization', `Bearer ${userOneAccessToken}`) 
                .send(newOrder)
                .expect(httpStatus.FORBIDDEN);

               
        });



    })

    describe('PATCH /v1/order/:orderId', ()=>{
        let updatedOrder;
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
            await insertOrders([orderOne]); 

            updatedOrder = {
                date: faker.date.recent(),
                totalPrice: parseFloat(faker.commerce.price()),
                customerName: faker.name.findName(),
                customerEmail: faker.internet.email().toLowerCase(),
                userId:userOne.id
            }   

        })

        test('should return 200 and successfully update order if request data is ok and user role is admin', async ()=>{
            const res = await request(app)
            .patch(`/v1/order/${orderOne.id}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .send(updatedOrder)
            .expect(httpStatus.OK);

            const orderData = res.body.data;

            expect(orderData).toEqual({
              id: orderOne.id,
              date: updatedOrder.date.toISOString(),
              totalPrice: updatedOrder.totalPrice,
              customerName: updatedOrder.customerName,
              customerEmail: updatedOrder.customerEmail,
              userId: updatedOrder.userId,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            });

            const dbOrder = await prisma.order.findUnique({
                where: {
                  id: orderData.id,
                },
              });

            expect(dbOrder).toBeDefined();
            expect(dbOrder).toMatchObject({
                id: orderOne.id,
                date: updatedOrder.date,
                totalPrice: updatedOrder.totalPrice,
                customerName: updatedOrder.customerName,
                customerEmail: updatedOrder.customerEmail,
                userId: updatedOrder.userId,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });

        })

        test('should return 400 if data is invalid', async () => {
            const res = await request(app)
              .patch(`/v1/order/${orderOne.id}`)
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
              .patch(`/v1/order/${orderOne.id}`)
              .send(updatedOrder)
              .expect(httpStatus.UNAUTHORIZED);
        }); 

        test('should return 403 forbidden if user role not admin', async () => {
            const res = await request(app)
              .patch(`/v1/order/${orderOne.id}`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .send(updatedOrder)
              .expect(httpStatus.FORBIDDEN);
        }); 



        test('should return 404 if order not found', async () => {
            
            const res = await request(app)
              .patch(`/v1/order/`)
              .set('Authorization', `Bearer ${adminAccessToken}`)
              .send(updatedOrder)
              .expect(httpStatus.NOT_FOUND);
          });


    })


    describe('DELETE /v1/order/:orderId', ()=>{
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
            await insertCategorys([categoryOne])
            await insertProducts([productOne])
            await insertOrders([orderOne]); 
            await insertOrderItems([orderItemOne]); 
                  
        });

        test('should return 200 and successfully delete order if request is valid and user role is admin', async () => {
            const res = await request(app)
              .delete(`/v1/order/${orderOne.id}`)
              .set('Authorization', `Bearer ${adminAccessToken}`)
              .expect(httpStatus.OK);
       
            const dbOrder = await prisma.order.findUnique({
              where: {
                id: orderOne.id,
              },
            });
  
            expect(dbOrder).toBeNull();
          });
        
          test('should return 401 unauthorized if token not set', async () => {
            await request(app)
              .delete(`/v1/order/${orderOne.id}`)
              .expect(httpStatus.UNAUTHORIZED);
          });

          test('should return 403 forbidden if user role not admin', async () => {
            await request(app)
              .delete(`/v1/order/${orderOne.id}`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .expect(httpStatus.FORBIDDEN);
          });
        
          test('should return 404 if order not found', async () => {
            await request(app)
              .delete(`/v1/order/`)
              .set('Authorization', `Bearer ${adminAccessToken}`)
              .expect(httpStatus.NOT_FOUND);
          });
    })
})