const express = require('express');

const router = express.Router();
const userController = require('../controllers/user.controller');
const productController = require('../controllers/product.controller');
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(authenticate(), authorize(['admin']), userController.getUsers)
  .post(authenticate(), authorize(['admin']), userController.createUser);

router
  .route('/:id')
  .get(authenticate(), authorize(['admin']), userController.getUser)
  .put(authenticate(), authorize(['admin']), userController.updateUser)
  .delete(authenticate(), authorize(['admin']), userController.deleteUser);

router.route('/:id/products').get(authenticate(), authorize(['admin']), productController.getProductsByUserId);

router.route('/:id/orders').get(authenticate(), authorize(['admin']), orderController.getOrdersByUserId);

module.exports = router;
