const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const createProduct = catchAsync( async (req, res) => {
    const product = await productService.createProduct(req.body)

    res.status(httpStatus.CREATED).send({
        status: httpStatus.CREATED,
        messsage: "Create Product Success",
        data: product
    });
});

const getProduct = catchAsync( async (req, res) => {
    const options = {
        take: parseInt(req.query.take) || 5,
        skip: parseInt(req.query.skip) || 0   
      };
    const result = await productService.getProduct(options);

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: "Get Products Success",
        data: result
    });
});

const getProductById = catchAsync( async (req, res) => {
    const result = await productService.getProductById(req.params.productId);
    if(!result){
        throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found');
    }

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Get Product Success',
        data: result
    });
});

const updateProduct = catchAsync( async (req, res) => {
    const updatedProduct = await productService.updateProduct(req.params.productId, req.body)

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Update Product Success',
        data: updatedProduct
    });
});

const deleteProduct = catchAsync( async (req, res) => {
    await productService.deleteProduct(req.params.productId);

    res.status(httpStatus.OK).send({
        status:httpStatus.OK,
        messsage: 'Delete Product Success',
        data: null
    });
});

const getProductByUser = catchAsync( async (req, res) => {
    const userProduct = await productService.getProductbyUser(req.params.userId);
    if(!userProduct){
        throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found');
    }

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Get Product Success',
        data: userProduct
    });
});

const searchProductByCategory = catchAsync( async (req, res) => {
    const searchProduct = await productService.searchProductByCategory(req.query);

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Get Product By Category Success',
        data: searchProduct
    });
})

module.exports = {
    getProduct, 
    getProductById, 
    getProductByUser, 
    deleteProduct, 
    updateProduct, 
    createProduct,
    searchProductByCategory
};