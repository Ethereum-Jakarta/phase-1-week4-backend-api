const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService, userService } = require('../services');


const viewOrder = catchAsync(async (req, res)=>{
  const messages = await req.flash('info');
  let { page, limit } = req.query;
  
  // Set default values jika page dan limit tidak diberikan atau tidak valid
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  
  const skip = (page - 1) * limit; // Calculate the value of skip based on page and limit

    // Get total count of orders
  const totalCount = await orderService.getOrderCount();
  const lastPage = Math.ceil(totalCount / limit);

  const orders = await orderService.getAllOrder(skip, limit);
    res.render('./order/view', {messages, orders, page, limit, lastPage});
})

const addOrder = catchAsync(async (req, res)=>{
  const user = await userService.queryUsers();
  res.render('./order/add', {user});

})

const postOrder = catchAsync(async (req, res)=>{
  try{
    await orderService.createOrder(req.body);
    await req.flash('info', 'New order has been added!');
    res.redirect('/order');

  }
  catch(error){
    console.log(error);
  }
})

const detailOrder = catchAsync(async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(order)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./order/detail', { order });
    } else if (typeof order === 'object' && order !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./order/detail', { order: [order] });
    } else {
      throw new Error("Invalid order data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


const editOrder = catchAsync(async (req, res) => {
  try {
    const user = await userService.queryUsers();
    const order = await orderService.getOrderById(req.params.orderId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(order)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./order/edit', { order, category, user });
    } else if (typeof order === 'object' && order !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./order/edit', { order: [order], user });
    } else {
      throw new Error("Invalid order data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);

  res.redirect('/order')
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);

  res.redirect('/order')
});

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Order Success',
    data: order,
  });
});

const searchOrder = catchAsync(async (req, res) => {
  const { customerName } = req.query;
  const order = await orderService.getOrderByCustomerName(customerName);
  res.render('./order/search', {order})
})

//controller sebelumnya
const getOrders = catchAsync(async (req, res) => {
  const { skip, take } = req.query;
  const result = await orderService.getAllOrder(skip, take);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Orders Success',
    data: result,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Order Success',
    data: order,
  });
});


module.exports = {
  viewOrder,
  addOrder,
  postOrder,
  detailOrder,
  editOrder,
  searchOrder,
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
