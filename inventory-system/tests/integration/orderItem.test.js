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
const { insertProducts, productOne, productTwo } = require('../fixtures/product.fixture');
const { insertCategorys, categoryOne } = require('../fixtures/category.fixture');
const { orderItemOne, insertOrderItems } = require('../fixtures/orderItem.fixture');

describe('Order Item routes', ()=>{

    describe('GET /v1/order-item', ()=>{
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
            await insertOrders([orderOne]);
            await insertProducts([productOne]);
        })
        test('should return 200 and successfully get all order items', async ()=>{
            const res = await request(app)
            .get('/v1/order-item')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .expect(httpStatus.OK);

        });

        test('should return 401 unauthorized if token not set', async () => {
            const res = await request(app)
                .get('/v1/order-item')
                .expect(httpStatus.UNAUTHORIZED);
        });

      
    })

    describe('POST /v1/order-item', ()=>{
        let newOrderItem;
        let newOrderItem2;
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
            await insertCategorys([categoryOne])
            await insertOrders([orderOne]);
            await insertProducts([productOne]);
            

            newOrderItem = {
                orderId: orderOne.id,
                productId: productOne.id,
                quantity: 1,
                unitPrice: parseFloat(faker.commerce.price()),
            };

            newOrderItem2 = {
                orderId: orderOne.id,
                productId: productOne.id,
                quantity: 200,
                unitPrice: parseFloat(faker.commerce.price()),
            };


        })

        test('should return 201 and successfully create order item if request data is ok', async () => {
            const res = await request(app)
                .post('/v1/order-item')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(newOrderItem)
                .expect(httpStatus.CREATED)

            
            const orderItemData = res.body.data;
           

            expect(orderItemData).toEqual({
                id: expect.anything(),
                orderId: newOrderItem.orderId,
                productId: newOrderItem.productId,
                quantity: newOrderItem.quantity,
                unitPrice: newOrderItem.unitPrice,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            })

            const dbOrderItem = await prisma.orderItem.findUnique({
                where: {
                  id: orderItemData.id,
                },
              });
        
              expect(dbOrderItem).toBeDefined();

        
              expect(dbOrderItem).toMatchObject({
                id: expect.anything(),
                orderId: newOrderItem.orderId,
                productId: newOrderItem.productId,
                quantity: newOrderItem.quantity,
                unitPrice: newOrderItem.unitPrice,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });
          
          
        });

        test('should return 400 if quantity more than quantityInStock', async () =>{
            const res = await request(app)
                .post('/v1/order-item')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(newOrderItem2)
                .expect(httpStatus.BAD_REQUEST)

            
            
        })



        test('should return 400 data is invalid', async () =>{
            const res = await request(app)
            .post('/v1/order-item')
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
                .post('/v1/order-item')
                
                .send(newOrderItem)
                .expect(httpStatus.UNAUTHORIZED);

               
        });

       


        
    })
    
  
    describe('PATCH /v1/order-item/:orderItemId', ()=>{
        let updatedOrderItem;
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
            await insertCategorys([categoryOne])
            await insertOrders([orderOne]);
            await insertProducts([productOne]);
            await insertOrderItems([orderItemOne]);

            updatedOrderItem = {
                orderId: orderOne.id,
                productId: productOne.id,
                quantity: 1,
                unitPrice: parseFloat(faker.commerce.price()),
            };
            
        })

        test('should return 200 and successfully update order item if request data is ok', async ()=>{
            const res = await request(app)
            .patch(`/v1/order-item/${orderItemOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(updatedOrderItem)
            .expect(httpStatus.OK);

            const orderItemData = res.body.data;

            expect(orderItemData).toEqual({
              id: orderItemOne.id,
              orderId: updatedOrderItem.orderId,
              productId: updatedOrderItem.productId,
              quantity: updatedOrderItem.quantity,
              unitPrice: updatedOrderItem.unitPrice,
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
            });

            const dbOrderItem = await prisma.orderItem.findUnique({
                where: {
                  id: orderItemData.id,
                },
              });

            expect(dbOrderItem).toBeDefined();
            expect(dbOrderItem).toMatchObject({
                id: orderItemOne.id,
                orderId: updatedOrderItem.orderId,
                productId: updatedOrderItem.productId,
                quantity: updatedOrderItem.quantity,
                unitPrice: updatedOrderItem.unitPrice,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
              });

        })

        test('should return 400 if data is invalid', async () => {
            const res = await request(app)
              .patch(`/v1/order-item/${orderItemOne.id}`)
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
              .patch(`/v1/order-item/${orderItemOne.id}`)
              .send(updatedOrderItem)
              .expect(httpStatus.UNAUTHORIZED);
        }); 

       

        test('should return 404 if order not found', async () => {
            
            const res = await request(app)
              .patch(`/v1/order-item/`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .send(updatedOrderItem)
              .expect(httpStatus.NOT_FOUND);
          });



    })

    describe('DELETE /v1/order-item/:orderItemId', ()=>{
        beforeEach(async ()=>{
            await insertUsers([admin]);
            await insertUsers([userOne]);
            await insertCategorys([categoryOne])
            await insertProducts([productOne])
            await insertOrders([orderOne]); 
            await insertOrderItems([orderItemOne]); 
        })
        test('should return 200 and successfully delete order item if request is valid', async () => {
            const res = await request(app)
              .delete(`/v1/order-item/${orderItemOne.id}`)
              .set('Authorization', `Bearer ${userOneAccessToken}`)
              .expect(httpStatus.OK);
       
            const dbOrder = await prisma.orderItem.findUnique({
              where: {
                id: orderOne.id,
              },
            });
  
            expect(dbOrder).toBeNull();
          });
        
          test('should return 401 unauthorized if token not set', async () => {
            await request(app)
              .delete(`/v1/order-item/${orderItemOne.id}`)
              .expect(httpStatus.UNAUTHORIZED);
          });

     
        
          test('should return 404 if order not found', async () => {
            await request(app)
              .delete(`/v1/order-item/`)
              .set('Authorization', `Bearer ${adminAccessToken}`)
              .expect(httpStatus.NOT_FOUND);
          });
    })

})