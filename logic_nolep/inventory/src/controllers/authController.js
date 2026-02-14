const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const logger = require('../config/logger');
const config = require('../config/config');
const status = require('http-status');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
};

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role },
        });

        const token = generateToken(user);
        logger.info(`User registered: ${user.email}`);

        res.status(201).json({ user, token }); // Perbaikan status 201
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            logger.warn(`Failed login attempt: ${email}`);
            return res.sendStatus(401);
        }
        const token = generateToken(user);
        logger.info(`User logged in: ${user.email}`);
        res.json({ user, token });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { register, login };

