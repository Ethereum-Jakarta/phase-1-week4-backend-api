// mock.js adalah penyambung antara config jest ke mock database
global.atob = require('atob');

jest.mock('./prisma/index');
jest.setTimeout(30000);
