const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const viewUser = catchAsync(async (req, res)=>{
  const messages = await req.flash('info');
  let { page, limit } = req.query;
  
  // Set default values jika page dan limit tidak diberikan atau tidak valid
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  
  const skip = (page - 1) * limit; // Calculate the value of skip based on page and limit

    // Get total count of products
  const totalCount = await userService.getUserCount();
  const lastPage = Math.ceil(totalCount / limit);

  const users = await userService.getAllUsers(skip, limit);

  res.render('./user/view', {messages, users, page, limit, lastPage});
})

const addUser = catchAsync(async (req, res)=>{
  res.render('./user/add')
})

const postUser = catchAsync(async (req, res)=>{
  try{
      await userService.createUser(req.body);
      await req.flash('info', 'New User has been added!');
      res.redirect('/user');

  }
  catch(error){
      console.log(error);
  }
  
})

const detailUser = catchAsync(async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(user)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./user/detail', { user });
    } else if (typeof user === 'object' && user !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./user/detail', { user: [user] });
    } else {
      throw new Error("Invalid user data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const editUser = catchAsync(async (req, res) => {
  try {
  
  
    const user = await userService.getUserById(req.params.userId);
    // Memeriksa apakah category adalah array atau objek tunggal
    if (Array.isArray(user)) {
      // Jika category adalah array, kirimkan langsung ke template
      res.render('./user/edit', { user });
    } else if (typeof user === 'object' && user !== null) {
      // Jika category adalah objek tunggal, kirimkan sebagai array satu elemen
      res.render('./user/edit', { user: [user]});
    } else {
      throw new Error("Invalid user data");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }

});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.redirect('/user')
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.redirect('/user')
});

const searchUser = catchAsync(async (req, res) => {
  const { name } = req.query;
  const user = await userService.getUserByName(name);
  res.render('./user/search', {user})
})


const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create User Success',
    data: user,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const { category, skip, take } = req.query;

  const result = await userService.getAllUsers(category, skip, take);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Users Success',
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get User Success',
    data: user,
  });
});



module.exports = {
  viewUser,
  addUser,
  postUser,
  detailUser,
  editUser,
  searchUser,
  createUser,
  getUsers,
  getUser,

  updateUser,
  deleteUser,
};
