const express = require('express');
const { register, login } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validations');

const router = express.Router();

router.post('/register', validate(authValidation.register), register);
router.post('/login', validate(authValidation.login), login);

module.exports = router;
