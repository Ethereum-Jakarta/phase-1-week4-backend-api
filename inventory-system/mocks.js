require('dotenv').config();
global.atob = require('atob');

jest.mock('./prisma/index');
jest.setTimeout(30000);
