require('dotenv').config({ path: '.env.test' });
process.env.DATABASE_URL = process.env.TEST_DB_URL;

jest.mock('./prisma/index');
jest.setTimeout(30000);
