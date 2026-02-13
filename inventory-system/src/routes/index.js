const express = require('express');
const authRoute = require('./auth.route');
const categoryRoute = require('./category.route');
const productRoute = require('./product.route');
const orderRoute = require('./order.route');
const orderItemRoute = require('./orderItem.route');
const userRoute = require('./user.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },

  {
    path: '/category',
    route: categoryRoute,
  },

  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/order-item',
    route: orderItemRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
