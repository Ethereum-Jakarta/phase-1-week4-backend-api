const express = require('express');
const authRoute = require('./auth.route');
const categoryRoute = require('./category.route');
const productRoute = require('./product.route');
const userRoute = require('./user.route');
const orderRoute = require('./order.route');
const orderItemRoute = require('./orderItem.route');

const router = express.Router();

const defaultRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/users',
    route: userRoute,
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

defaultRoute.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
