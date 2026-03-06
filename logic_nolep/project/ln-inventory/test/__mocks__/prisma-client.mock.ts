import { mockDeep } from "jest-mock-extended";
import { jest } from "@jest/globals";

export const PrismaClient = jest.fn(() => mockDeep());
