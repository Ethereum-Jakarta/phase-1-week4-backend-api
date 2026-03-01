const express = require('express');

const router = express.Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const categoryRouter = require('./category.route');
const productRouter = require('./product.route');
const orderRouter = require('./order.route');
const orderItemRouter = require('./order-item.route');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/order-items', orderItemRouter);

module.exports = router;
