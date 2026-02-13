const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const { render } = require('../app');
const prisma = require('../../prisma');



const viewCategory = catchAsync(async (req, res)=>{
  const messages = await req.flash('info');
  let { page, limit } = req.query;
  
  // Set default values jika page dan limit tidak diberikan atau tidak valid
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  
  const skip = (page - 1) * limit; // Calculate the value of skip based on page and limit

    // Get total count of categories
  const totalCount = await categoryService.getCategoryCount();
  const lastPage = Math.ceil(totalCount / limit);

  const categorys = await categoryService.getAllCategory(skip, limit);
  res.render('./category/view', {messages, categorys, page, limit, lastPage});
})

const addCategory = catchAsync(async (req, res)=>{
  res.render('./category/add');
})

const postCategory = catchAsync(async (req, res)=>{
  try{
      await categoryService.createCategory(req.body);
      await req.flash('info', 'New category has been added!');
      res.redirect('/category');

  }
  catch(error){
      console.log(error);
  }
  
})

const detailCategory = catchAsync(async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.categoryId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(category)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./category/detail', { category });
    } else if (typeof category === 'object' && category !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./category/detail', { category: [category] });
    } else {
      throw new Error("Invalid category data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const editCategory = catchAsync(async (req, res)=>{
  try {
    const category = await categoryService.getCategoryById(req.params.categoryId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(category)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./category/edit', { category });
    } else if (typeof category === 'object' && category !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./category/edit', { category: [category] });
    } else {
      throw new Error("Invalid category data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.redirect(`/category/edit/${req.params.categoryId}`);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.redirect('/category');
});

const searchCategory = catchAsync(async (req, res) => {
    const { name } = req.query;
    const category = await categoryService.getCategoryByName(name);
    res.render('./category/search', {category})
})



//controller sebelumnya

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Category Success',
    data: category,
  });

});

const getCategorys = catchAsync(async (req, res) => {
  const { skip, take } = req.query;
  const result = await categoryService.getAllCategory(skip, take);

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





module.exports = {
  viewCategory,
  addCategory,
  postCategory,
  detailCategory,
  editCategory,
  searchCategory,
  createCategory,
  getCategorys,
  getCategory,
  updateCategory,
  deleteCategory,
};
