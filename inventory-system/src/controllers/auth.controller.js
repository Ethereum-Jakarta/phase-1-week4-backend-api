const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../service');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const userCreated = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(userCreated);
  res.status(httpStatus.CREATED).send({ userCreated, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authorization token is missing');
  }

  await authService.logout(token);

  res.status(httpStatus.OK).json({ message: 'Logout successful' });
});

module.exports = {
  register,
  login,
  logout,
};
