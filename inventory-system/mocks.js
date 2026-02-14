require('dotenv').config(); // jika Anda menggunakan dotenv untuk mengatur environment variables
global.atob = require('atob');

jest.mock('./prisma/index');
jest.setTimeout(30000);
