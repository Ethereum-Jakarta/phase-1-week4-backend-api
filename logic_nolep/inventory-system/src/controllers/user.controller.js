const userService = require('../services/user.service');
const { userValidationSchema } = require('../validations/user.validation');
const handleResponse = require('../utils/responseHandler');
const catchAsync = require('../utils/catchAsync');

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();

  if (!users) {
    return handleResponse(res, 404, 'Users not found.');
  }

  handleResponse(res, 200, 'Success get users!', users);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUser(req.params.id);

  if (!user) {
    return handleResponse(res, 404, 'User not found.');
  }

  handleResponse(res, 200, 'Success get user!', user);
});

const createUser = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { error } = userValidationSchema.validate(req.body);
  const allUsers = await userService.getUsers();
  const isEmailTaken = allUsers.some((cat) => cat.email === email);

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  if (isEmailTaken) {
    return handleResponse(res, 400, 'User email already exists.');
  }

  const createdUser = await userService.createUser({
    name,
    email,
    password,
    role,
  });

  handleResponse(res, 201, 'Success create user!', createdUser);
});

const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, role } = req.body;
  const { error } = userValidationSchema.validate(req.body);
  const existingUser = await userService.getUser(userId);
  const isEmailChanged = email && email !== existingUser.email;

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  if (!existingUser) {
    return handleResponse(res, 404, 'User not found.');
  }

  if (isEmailChanged) {
    const allUsers = await userService.getUsers();
    const isEmailTaken = allUsers.some((user) => user.email === email);

    if (isEmailTaken) {
      return handleResponse(res, 400, 'User email already exists.');
    }
  }

  const updatedUser = await userService.updateUser(userId, {
    name,
    email,
    password,
    role,
  });

  handleResponse(res, 200, 'Success update user!', updatedUser);
});

const deleteUser = catchAsync(async (req, res) => {
  const deletedUser = await userService.deleteUser(req.params.id);

  if (!deletedUser) {
    return handleResponse(res, 404, 'User not found!');
  }

  handleResponse(res, 200, 'Success delete user!', deletedUser);
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
