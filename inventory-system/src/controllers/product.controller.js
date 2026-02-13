const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const productService = require('../service/product.service');
const ApiError = require('../../utils/ApiError');

const getAllProduct = catchAsync(async(req, res) => {
    const product = await productService.getAllProducts()
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Get All product Success!',
        data: product
    })
})

const getProduct = catchAsync(async(req, res) => {
    const productId = req.params.productId
    const product = await productService.getProduct(productId)
    if(!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found!')
    }
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Get Product by id Success!',
        data: product,
    })
})

const createProduct = catchAsync(async(req,res) => {
    const productBody = req.body
    const newProduct = await productService.createProduct(productBody)
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Create Product Success!',
        data: newProduct
    })
})

const updateProduct = catchAsync(async(req, res) => {
    const productId = req.params.productId
    const updateproduct = await productService.updateProduct(productId)
    if(!updateproduct) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found!')
    }
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Update Product Success!',
        data: updateproduct
    })
})

const deleteProduct = catchAsync(async(req, res) => {
    const productId = req.params.productId
    const deleteproduct = await productService.deleteProduct(productId)
    if(!deleteproduct) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found!')
    }
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Delete Product Success!',
        data: deleteproduct
    })
})

module.exports = {getAllProduct, getProduct, createProduct, updateProduct, deleteProduct}