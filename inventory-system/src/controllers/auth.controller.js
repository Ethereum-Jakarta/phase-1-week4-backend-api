const { status } = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);

  if (existingUser) {
    throw new ApiError(status.BAD_REQUEST, 'Email already taken');
  }

  const userBody = req.body;

  userBody.role = 'user';

  if (userBody.email === 'admin@example.com') {
    userBody.role = 'admin';
  }

  const userCreated = await userService.createUser(userBody);
  const tokens = await tokenService.generateAuthTokens(userCreated);
  res.status(status.CREATED).send({ userCreated, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(status.BAD_REQUEST).json({ message: 'Refresh token is required' });
  }

  await authService.logout(refreshToken);

  res.status(status.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
};
