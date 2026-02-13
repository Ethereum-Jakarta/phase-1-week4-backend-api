const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const orderRoute = require('./order.route');
const productRoute = require('./product.route');
const categoryRoute = require('./category.route')

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
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
    path: '/products',
    route: productRoute,
  },
  {
    path: '/categorys',
    route: categoryRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;