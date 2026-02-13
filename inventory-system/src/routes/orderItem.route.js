const express = require('express');
const { adminAuth, auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const orderItemValidation = require('../validations/orderItem.validation');
const orderItemController = require('../controllers/orderItem.controller');
const { checkAuthenticate } = require('../middlewares/checkAuth');

const router = express.Router();

router
  .route('/')
  .get(checkAuthenticate, orderItemController.viewOrderItem);

router
  .route('/add')
  .get(checkAuthenticate, orderItemController.addOrderItem)
  .post(checkAuthenticate, orderItemController.postOrderItem);

router
  .route('/detail/:orderItemId')
  .get(checkAuthenticate, orderItemController.detailOrderItem);

  router
  .route('/edit/:orderItemId')
  .get(checkAuthenticate, orderItemController.editOrderItem)
  .patch(checkAuthenticate, orderItemController.updateOrderItem)
  .delete(checkAuthenticate, orderItemController.deleteOrderItem)

  router
  .route('/search')
  .get(checkAuthenticate, orderItemController.searchOrderItem)


// router
//   .route('/')
//   .post(
//     //auth(),
//      validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
//   .get(
//     //auth(),
//      orderItemController.getOrderItems);

// router
//   .route('/:orderItemId')
//   .get(
//     //auth(),
//      validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
//   .patch(
//     //auth(),
//      validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
//   .delete(//auth(),
//    validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);

module.exports = router;
