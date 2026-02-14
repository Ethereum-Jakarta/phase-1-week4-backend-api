const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  try {
    await userService.getUserByEmail(req.body.email);

    // Jika existingUser tidak melempar kesalahan, berarti email sudah ada
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  } catch (error) {
    if (error.message === 'User not found') {
      // Lanjutkan proses registrasi karena email belum ada
      const userCreated = await userService.createUser(req.body);
      const tokens = await tokenService.generateAuthTokens(userCreated);

      res.status(httpStatus.CREATED).send({
        status: httpStatus.CREATED,
        message: 'Register Success',
        data: { userCreated, tokens },
      });
    } else {
      throw error; // Melempar kembali kesalahan yang tidak terduga
    }
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Login Success',
    data: { user, tokens },
  });
});

const refreshTokens = catchAsync(async (req, res) => {
  const { token } = req.body;

  const tokens = await tokenService.refreshTokens(token);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Refresh Token Success',
    data: tokens,
  });
});

const logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized, please login/register first');
  }

  const splittedToken = token.split('Bearer ')[1];

  await tokenService.deleteToken(splittedToken);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Logout Success',
    data: null,
  });
});

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
};
