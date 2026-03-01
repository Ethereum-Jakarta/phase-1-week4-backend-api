const categoryService = require('../services/category.service');
const { categoryValidationSchema } = require('../validations/category.validation');
const handleResponse = require('../utils/responseHandler');
const catchAsync = require('../utils/catchAsync');

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories();

  if (!categories) {
    return handleResponse(res, 404, 'Categories not found.');
  }

  handleResponse(res, 200, 'Success get Categories!', categories);
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategory(req.params.id);

  if (!category) {
    return handleResponse(res, 404, 'Category not found.');
  }

  handleResponse(res, 200, 'Success get Category!', category);
});

const createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const { error } = categoryValidationSchema.validate(req.body);
  const allCategories = await categoryService.getCategories();
  const isNameTaken = allCategories.some((cat) => cat.name === name);

  if (isNameTaken) {
    return handleResponse(res, 400, 'Category name already exists.');
  }

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const createdCategory = await categoryService.createCategory({ name });

  handleResponse(res, 201, 'Success create Category!', createdCategory);
});

const updateCategory = catchAsync(async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  const { error } = categoryValidationSchema.validate(req.body);
  const existingCategory = await categoryService.getCategory(categoryId);
  const isNameChanged = name && name !== existingCategory.name;

  if (isNameChanged) {
    const allCategories = await categoryService.getCategories();
    const isNameTaken = allCategories.some((category) => category.name === name);

    if (isNameTaken) {
      return handleResponse(res, 400, 'Category name already exists.');
    }
  }

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const updatedCategory = await categoryService.updateCategory(categoryId, {
    name,
  });

  handleResponse(res, 200, 'Success update Category!', updatedCategory);
});

const deleteCategory = catchAsync(async (req, res) => {
  const deletedCategory = await categoryService.deleteCategory(req.params.id);

  if (!deletedCategory) {
    return handleResponse(res, 404, 'Category not found.');
  }

  handleResponse(res, 200, 'Success delete Category!', deletedCategory);
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
