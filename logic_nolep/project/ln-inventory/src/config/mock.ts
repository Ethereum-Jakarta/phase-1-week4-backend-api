import { mockReset } from "jest-mock-extended";
import { beforeEach, jest } from "@jest/globals";
import * as prismaMod from "../applications/prisma";

// Get the mocked prisma instance
export const prismaMock = prismaMod.prisma;

beforeEach(() => {
  mockReset(prismaMock);
});
