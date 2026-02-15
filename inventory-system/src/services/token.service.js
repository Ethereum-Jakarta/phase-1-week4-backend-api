const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');

// Function untuk menghasilkan JWT token berdasarkan ID, waktu pembuatan, kadalursa, jenis token, dan secret key.
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

// Function untuk menyimpan token ke dalam database
/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await prisma.token.create({
    data: {
      token,
      userId: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    },
  });
  return tokenDoc;
};

// Function untuk memverifikasi token yang direquest oleh user
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  // token: Token JWT yang akan di verifikasi. type: Jenis token harus sesuai untuk verifikasi
  const payload = jwt.verify(token, config.jwt.secret); // Verifikasi tanda tangan digital token dan expired time
  const tokenDoc = await prisma.token.findFirst({
    where: { token, type, userId: payload.sub, blacklisted: false },
  });

  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  return tokenDoc;
};

// Function untuk menghasilkan access dan refresh token setelah user berhasil login
/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minute');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const refreshToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (payload.type !== tokenTypes.REFRESH) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token type');

  const dbToken = await prisma.token.findFirst({
    where: {
      token: token,
    },
  });
  if (!dbToken) throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found');
  const tokenExpires = moment(dbToken.expires).isBefore(moment());
  if (tokenExpires) throw new ApiError(httpStatus.BAD_REQUEST, 'Refresh token is expired');

  const user = await prisma.user.findFirst({
    where: {
      id: payload.sub,
    },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  // Delete old refresh token
  await prisma.token.delete({
    where: {
      id: dbToken.id,
    },
  });

  // Generate new access and refresh token
  const newToken = generateAuthTokens(user);
  return newToken;
};

const deleteToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (payload.type !== tokenTypes.ACCESS) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token type');

  const tokenDoc = await prisma.token.findFirst({
    where: {
      userId: payload.sub,
    },
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }

  const deletingToken = prisma.token.delete({
    where: {
      id: tokenDoc.id,
    },
  });
  return deletingToken;
};

module.exports = { generateToken, saveToken, verifyToken, generateAuthTokens, refreshToken, deleteToken };
