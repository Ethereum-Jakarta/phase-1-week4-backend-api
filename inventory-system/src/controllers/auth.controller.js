const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
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
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(httpStatus.FORBIDDEN).json({
        status: httpStatus.FORBIDDEN,
        message: 'Authorization fail!',
      });
    }

    await authService.logout(token);

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: 'Sign out succesfully!',
    });
  } else {
    res.status(httpStatus.NOT_FOUND).json({
      status: httpStatus.NOT_FOUND,
      message: 'Authorization not existing',
    });
  }
});

module.exports = {
  register,
  login,
  logout,
};
