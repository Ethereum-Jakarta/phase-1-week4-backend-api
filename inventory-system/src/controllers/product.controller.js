const httpStatus = require("http-status");
const { productService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getAllProducts = catchAsync(async (req, res) => {
  const { category, skip, limit } = req.query

  const responsed = await productService.getAllProducts(category, skip, limit);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Get Products Succesfully",
    totalPage: responsed.totalPage,
    totalData: responsed.totalData,
    data: responsed.data,
  })
})

const getProduct = catchAsync(async (req, res) => {
  const productId = req.params.productId
  const data = await productService.getProduct(productId)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: "Get Product Succesfully",
    data
  })
})

const deleteProduct = catchAsync(async (req, res) => {
  const productId = req.params.productId

  const existingProduct = await productService.getProduct(productId)

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await productService.deleteProduct(productId)

  res.status(204).json(null)
})

const createProduct = catchAsync(async (req, res) => {
  const productBody = req.body

  const data = await productService.createProduct(productBody)

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: "Create Product Succesfully",
    data
  })
})

const updateProduct = catchAsync(async (req, res) => {
  const productId = req.params.productId
  const productBody = req.body

  const data = await productService.updateProduct(productId, productBody)

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    message: "Update Product Succesfully",
    data
  })
})

module.exports = {
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  createProduct,
}
