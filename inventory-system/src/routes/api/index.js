const express = require('express');
const authRoute = require('./auth.route');
const categoryRoute = require('./category.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const orderRoute = require('./order.route');
const orderItemRoute = require('./orderItem.route');

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
    path: '/users',
    route: userRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/order-items',
    route: orderItemRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
