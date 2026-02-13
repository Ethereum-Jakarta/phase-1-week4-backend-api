const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, categoryService, userService } = require('../services');



const viewProduct = catchAsync(async (req, res)=>{
  const messages = await req.flash('info');
  let { page, limit } = req.query;
  
  // Set default values jika page dan limit tidak diberikan atau tidak valid
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  
  const skip = (page - 1) * limit; // Calculate the value of skip based on page and limit

    // Get total count of products
  const totalCount = await productService.getProductCount();
  const lastPage = Math.ceil(totalCount / limit);

  const products = await productService.getAllProducts(skip, limit);

  res.render('./product/view', {messages, products, page, limit, lastPage});
})


const addProduct = catchAsync(async (req, res)=>{
  const category = await categoryService.queryCategorys();
  const user = await userService.queryUsers();
  res.render('./product/add', {category, user});
})

const postProduct = catchAsync(async (req, res)=>{
  try{
      await productService.createProduct(req.body);
      await req.flash('info', 'New product has been added!');
      res.redirect('/product');

  }
  catch(error){
      console.log(error);
  }
  
})


const detailProduct = catchAsync(async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.productId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(product)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./product/detail', { product });
    } else if (typeof product === 'object' && product !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./product/detail', { product: [product] });
    } else {
      throw new Error("Invalid product data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const editProduct = catchAsync(async (req, res) => {
  try {
    const category = await categoryService.queryCategorys();
    const user = await userService.queryUsers();
    const product = await productService.getProductById(req.params.productId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(product)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./product/edit', { product, category, user });
    } else if (typeof product === 'object' && product !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./product/edit', { product: [product], category, user });
    } else {
      throw new Error("Invalid product data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.redirect('/product')
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.redirect('/product');
});

const searchProduct = catchAsync(async (req, res) => {
  const { name } = req.query;
  const product = await productService.getProductByName(name);
  res.render('./product/search', {product})
})

//controller sebelumnya

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Product Success',
    data: product,
  });
});

const getProducts = catchAsync(async (req, res) => {
  const { category, skip, take } = req.query;

  const result = await productService.getAllProducts(category, skip, take);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Products Success',
    data: result,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Product Success',
    data: product,
  });
});




module.exports = {
  viewProduct,
  addProduct,
  postProduct,
  detailProduct,
  editProduct,
  searchProduct,
  createProduct,
  getProducts,
  getProduct,

  updateProduct,
  deleteProduct,
};
