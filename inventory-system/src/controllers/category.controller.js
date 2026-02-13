const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const categoryService = require('../service/category.service');
const ApiError = require('../../utils/ApiError');
const { order } = require('../../prisma/client');

const createCategory = catchAsync(async(req, res) => {
    const category = await categoryService.createCategory(req.body)

    res.status(httpStatus.CREATED).send({
        status: httpStatus.CREATED,
        message: "Create Category Success!",
        data: category
    })
})

const getAllCategory = catchAsync(async(req, res) => {
    const category = await categoryService.queryCategorys()

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Get All category Success!",
        data: category
    })
})

const getCategoryById = catchAsync(async(req, res) => {
    const category = await categoryService.getCategoryById(req.params.id)

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Get Category By Id Success!",
        data: category
    })
})

const updateCategoryById = catchAsync(async(req, res) => {
    const categoryId = req.params.categoryId
    const category = await categoryService.updateCategoryById(categoryId, req.body)

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Update Category Success!",
        data: category
    })
})

const deleteCategorys = catchAsync(async(req, res) => {
    const categoryId = req.params.categoryId
    const category = await categoryService.deleteCategoryById(categoryId)

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Delete Category Success!",
        data: category
    })
})

module.exports = {getAllCategory, getCategoryById, createCategory, updateCategoryById, deleteCategorys}