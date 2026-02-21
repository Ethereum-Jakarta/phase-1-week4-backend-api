import { mockDeep } from "jest-mock-extended";
import { jest } from "@jest/globals";

// Set environment variables for tests
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRATION = "24h";

jest.mock(
  "../../generated/prisma/client",
  () => ({
    PrismaClient: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  "../applications/prisma",
  () => ({
    __esModule: true,
    prisma: mockDeep(),
  }),
  { virtual: true },
);
