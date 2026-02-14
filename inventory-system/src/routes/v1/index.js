const express = require('express');
const authRoute = require('./auth.route');
const categorysRoute = require('./category.route');
const productsRoute = require('./product.route');
const usersRoute = require('./user.route');
const ordersRoute = require('./order.route');
const orderItemsRoute = require('./orderItem.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/categories',
    route: categorysRoute,
  },
  {
    path: '/products',
    route: productsRoute,
  },
  {
    path: '/users',
    route: usersRoute,
  },
  {
    path: '/orders',
    route: ordersRoute,
  },
  {
    path: '/order-items',
    route: orderItemsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
