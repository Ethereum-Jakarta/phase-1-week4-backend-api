const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../service');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Category Success',
    data: category,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const { page, size } = req.query;

  // Konversi ke bilangan bulat (integer)
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(size, 10);

  if (Number.isNaN(pageNumber) || Number.isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
    throw new Error('Invalid page or size parameters');
  }

  // Hitung berapa data yang perlu dilewati (skip)
  const skip = (pageNumber - 1) * pageSize;

  const result = await categoryService.getAllCategory(pageSize, skip);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Categorys Success',
    data: result,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Category Success',
    data: category,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Category Success',
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Category Success',
    data: null,
  });
});

const getProductsByCategory = catchAsync(async (req, res) => {
  const { categoryName } = req.query;

  // Panggil layanan productService untuk mencari produk berdasarkan kategori
  const products = await categoryService.getProductsByCategory(categoryName);

  res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    message: 'Get Products Success',
    data: products,
  });
});

module.exports = {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
};
