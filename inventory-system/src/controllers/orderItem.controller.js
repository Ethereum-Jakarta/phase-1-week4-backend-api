const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderItemService, orderService, productService } = require('../services');

const viewOrderItem = catchAsync(async (req, res)=>{
  const messages = await req.flash('info');
  let { page, limit } = req.query;
  
  // Set default values jika page dan limit tidak diberikan atau tidak valid
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  
  const skip = (page - 1) * limit; // Calculate the value of skip based on page and limit

    // Get total count of orders
  const totalCount = await orderItemService.getOrderItemCount();
  const lastPage = Math.ceil(totalCount / limit);

  const orderItems = await orderItemService.getAllOrderItems(skip, limit);
  res.render('./order-item/view', {messages, orderItems, page, limit, lastPage});
})

const addOrderItem = catchAsync(async (req, res)=>{
  const order = await orderService.queryOrders();
  const product = await productService.queryProducts();
  const messages = await req.flash('error');
  res.render('./order-item/add', {messages, order, product});
})

const postOrderItem = catchAsync(async (req, res)=>{
  try{
    await orderItemService.createOrderItem(req.body);
    await req.flash('info', 'New order item has been added!');
    res.redirect('/order-item');

  }
  catch(error){
   
    await req.flash('error', error.message);
    res.redirect('/order-item/add');
    console.log(error);
  }
})


const detailOrderItem = catchAsync(async (req, res) => {
  try {
    const orderItem = await orderItemService.getOrderItemById(req.params.orderId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(orderItem)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./order-item/detail', { orderItem });
    } else if (typeof orderItem === 'object' && orderItem !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./order-item/detail', { orderItem: [orderItem] });
    } else {
      throw new Error("Invalid order item data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const editOrderItem = catchAsync(async (req, res) => {
  try {
    const order = await orderService.queryOrders();
    const product = await productService.queryProducts();
    const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
    const messages = await req.flash('error');
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(orderItem)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./order-item/edit', { orderItem, order, product, messages });
    } else if (typeof orderItem === 'object' && orderItem !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./order-item/edit', { orderItem: [orderItem], order, product, messages });
    } else {
      throw new Error("Invalid order item data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

});


const updateOrderItem = catchAsync(async (req, res) => {
  try{
    const orderItem = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);
    await req.flash('info', 'Order item has been updated!');
    res.redirect('/order-item');

  }
  catch(error){
   
    await req.flash('error', error.message);
    res.redirect(`/order-item/edit/${req.params.orderItemId}`);
    console.log(error);
  }
  
});

const deleteOrderItem = catchAsync(async (req, res) => {
  await orderItemService.deleteOrderItemById(req.params.orderItemId);

  res.redirect('/order-item')
});

const searchOrderItem = catchAsync(async (req, res) => {
  const { name } = req.query;
  const orderItem = await orderItemService.getOrderItemByName(name);
  res.render('./order-item/search', {orderItem})
})

const createOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.createOrderItem(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create OrderItem Success',
    data: orderItem,
  });
});

const getOrderItems = catchAsync(async (req, res) => {
  const { skip, take } = req.query;
  const result = await orderItemService.getAllOrderItems(skip, take);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get OrderItems Success',
    data: result,
  });
});

const getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get OrderItem Success',
    data: orderItem,
  });
});


module.exports = {
  viewOrderItem,
  addOrderItem,
  postOrderItem,
  detailOrderItem,
  editOrderItem,
  searchOrderItem,
  createOrderItem,
  getOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
