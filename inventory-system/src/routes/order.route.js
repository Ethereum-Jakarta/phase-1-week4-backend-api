const express = require('express');
const { auth, adminAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orderValidation = require('../validations/order.validation');
const orderController = require('../controllers/order.controller');
const { adminRoleLocal } = require('../middlewares/checkAuth');

const router = express.Router();

router
  .route('/')
  .get(adminRoleLocal,orderController.viewOrder);

router
  .route('/add')
  .get(adminRoleLocal,orderController.addOrder)
  .post(adminRoleLocal,orderController.postOrder);

router
  .route('/detail/:orderId')
  .get(adminRoleLocal,orderController.detailOrder)

router
  .route('/edit/:orderId')
  .get(adminRoleLocal,orderController.editOrder)
  .patch(adminRoleLocal,orderController.updateOrder)
  .delete(adminRoleLocal,orderController.deleteOrder)

router
  .route('/search')
  .get(adminRoleLocal,orderController.searchOrder)


// router
//   .route('/')
//   .post(
//     //adminAuth(), 
//     validate(orderValidation.createOrder), orderController.createOrder)
//   .get(
//     //adminAuth(), 
//     orderController.getOrders);

// router
//   .route('/:orderId')
//   .get(
//     //adminAuth(),
//      validate(orderValidation.getOrder), orderController.getOrder)
//   .patch(
//     //adminAuth(),
//      validate(orderValidation.updateOrder), orderController.updateOrder)
//   .delete(
//     //adminAuth(),
//      validate(orderValidation.deleteOrder), orderController.deleteOrder);

module.exports = router;
