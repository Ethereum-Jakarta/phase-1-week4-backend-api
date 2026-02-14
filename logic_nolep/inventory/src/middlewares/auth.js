const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const  status  = require('http-status');

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return next(new ApiError(status.UNAUTHORIZED, 'Token not provided'));

    try {
        const user = jwt.verify(token, config.jwtSecret);
        req.user = await prisma.user.findUnique({ where: { id: user.id } });
        next();
    } catch (err) {
        next(new ApiError(status.UNAUTHORIZED, 'Invalid token'));
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(status.FORBIDDEN, 'You do not have permission to perform this action'));
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };
