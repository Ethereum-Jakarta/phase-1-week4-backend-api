const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Category Success',
    data: category,
  });
});

const getAllCategorys = catchAsync(async (req, res) => {
  const filter = { name: req.query.name };
  const options = {
    take: req.query.take || 10,
    page: req.query.page || 1,
    sort: req.query.sort === 'latest' ? { createdAt: 'desc' } : { createdAt: 'asc' },
  };

  options.skip = (options.page - 1) * (options.take || 10);

  const { sort } = req.query;

  // If sort a-z or z-a
  if (sort === 'a-z') options.sort = { name: 'asc' };
  if (sort === 'z-a') options.sort = { name: 'desc' };

  const categorys = await categoryService.queryCategorys(filter, options);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Categorys Success',
    data: categorys,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);

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

module.exports = {
  createCategory,
  getAllCategorys,
  getCategory,
  updateCategory,
  deleteCategory,
};
