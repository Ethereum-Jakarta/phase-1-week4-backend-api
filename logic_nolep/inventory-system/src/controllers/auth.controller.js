const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const { authValidationSchema } = require('../validations/auth.validation');
const handleResponse = require('../utils/responseHandler');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { error } = authValidationSchema.validate(req.body);
  const allUsers = await userService.getUsers();
  const isEmailTaken = allUsers.some((cat) => cat.email === email);

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  if (isEmailTaken) {
    return handleResponse(res, 400, 'User email already exists.');
  }

  const user = await authService.register({ name, email, password, role });
  handleResponse(res, 201, 'Registration successful!', user);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { error } = authValidationSchema.validate(req.body);

  if (error) {
    return handleResponse(res, 400, 'Validation Error', null, error.details[0].message);
  }

  const { token, user } = await authService.login({ email, password });
  handleResponse(res, 200, 'Login successful!', { token, user });
});

module.exports = { register, login };
