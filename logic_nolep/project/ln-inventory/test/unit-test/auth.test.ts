import { AuthService } from "../../src/services/auth.service";
import { prismaMock } from "../../src/config/mock";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { ResponseError } from "../../src/errors/response.error";
import * as bcrypt from "bcrypt";
import { JwtHelper } from "../../src/utils/jwt.util";
import { fail } from "node:assert";

jest.mock("bcrypt");
jest.mock("../../src/utils/jwt.util");

const bcryptMock = jest.mocked(bcrypt);
const jwtHelperMock = jest.mocked(JwtHelper);

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(prismaMock);
    jest.clearAllMocks();
  });

  // ============ REGISTER USER TESTS ============
  describe("registerUser", () => {
    test("should register a new user with hashed password", async () => {
      const registerRequest = {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123",
      };

      const hashedPassword = "$2b$10$hashedPassword";
      const createdUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      bcryptMock.hash.mockResolvedValue(hashedPassword);
      prismaMock.user.create.mockResolvedValue(createdUser);

      const result = await authService.registerUser(registerRequest);

      expect(bcryptMock.hash).toHaveBeenCalledWith("SecurePass123", 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
        }),
      });
      expect(result).toBeDefined();
      expect(result.email).toBe("john@example.com");
    });

    test("should throw error if email already exists", async () => {
      const registerRequest = {
        name: "Duplicate User",
        email: "existing@example.com",
        password: "Pass123",
      };

      bcryptMock.hash.mockResolvedValue("hashedPass");
      prismaMock.user.create.mockRejectedValue(
        new Error("Unique constraint failed on the fields: (`email`)"),
      );

      await expect(authService.registerUser(registerRequest)).rejects.toThrow();
    });

    test("should hash password before storing", async () => {
      const registerRequest = {
        name: "Test User",
        email: "test@example.com",
        password: "PlainPassword",
      };

      const hashedPassword = "$2b$10$hashedPasswordValue";
      bcryptMock.hash.mockResolvedValue(hashedPassword);
      prismaMock.user.create.mockResolvedValue({
        id: "user-2",
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await authService.registerUser(registerRequest);

      expect(bcryptMock.hash).toHaveBeenCalledWith("PlainPassword", 10);
      expect(registerRequest.password).toBe(hashedPassword);
    });
  });

  // ============ LOGIN TESTS ============
  describe("login", () => {
    test("should successfully login with valid credentials", async () => {
      const loginRequest = {
        email: "user@example.com",
        password: "CorrectPassword",
      };

      const user = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        password: "$2b$10$hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      bcryptMock.compare.mockResolvedValue(true);
      prismaMock.user.findUnique.mockResolvedValue(user);
      jwtHelperMock.createRefreshToken.mockReturnValue("refresh-token-123");
      jwtHelperMock.createAccessToken.mockReturnValue("access-token-123");
      prismaMock.token.create.mockResolvedValue({
        id: "token-1",
        token: "refresh-token-123",
        type: "refresh",
        expires: new Date(),
        userId: "user-123",
        blacklisted: false,
      });

      const result = await authService.login(loginRequest);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "user@example.com" },
      });
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        "CorrectPassword",
        "$2b$10$hashedPassword",
      );
      expect(result).toBeDefined();
      expect(jwtHelperMock.createAccessToken).toHaveBeenCalled();
      expect(jwtHelperMock.createRefreshToken).toHaveBeenCalled();
    });

    test("should throw ResponseError with invalid email", async () => {
      const loginRequest = {
        email: "nonexistent@example.com",
        password: "SomePassword",
      };

      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginRequest)).rejects.toThrow(
        ResponseError,
      );
    });

    test("should throw ResponseError with incorrect password", async () => {
      const loginRequest = {
        email: "user@example.com",
        password: "WrongPassword",
      };

      const user = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        password: "$2b$10$hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      bcryptMock.compare.mockResolvedValue(false);

      await expect(authService.login(loginRequest)).rejects.toThrow(
        ResponseError,
      );
    });

    test("should return LoginDto with tokens", async () => {
      const loginRequest = {
        email: "user@example.com",
        password: "CorrectPassword",
      };

      const user = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        password: "$2b$10$hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      bcryptMock.compare.mockResolvedValue(true);
      prismaMock.user.findUnique.mockResolvedValue(user);
      jwtHelperMock.createRefreshToken.mockReturnValue("refresh-token");
      jwtHelperMock.createAccessToken.mockReturnValue("access-token");
      prismaMock.token.create.mockResolvedValue({
        id: "token-1",
        token: "refresh-token",
        type: "refresh",
        expires: new Date(),
        userId: "user-123",
        blacklisted: false,
      });

      const result = await authService.login(loginRequest);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(prismaMock.token.create).toHaveBeenCalled();
    });

    test("should throw 401 error for invalid credentials", async () => {
      const loginRequest = {
        email: "user@example.com",
        password: "WrongPassword",
      };

      const user = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        password: "$2b$10$hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      bcryptMock.compare.mockResolvedValue(false);

      try {
        await authService.login(loginRequest);
        fail("Should have thrown ResponseError");
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        if (error instanceof ResponseError) {
          expect(error.statusCode).toBe(401);
        }
      }
    });
  });

  // ============ LOGOUT TESTS ============
  describe("logout", () => {
    test("should successfully logout by blacklisting token", async () => {
      const userId = "user-123";
      const token = "refresh-token-123";

      prismaMock.token.update.mockResolvedValue({
        id: "token-1",
        token,
        type: "refresh",
        expires: new Date(),
        userId,
        blacklisted: true,
      });

      const result = await authService.logout(userId, token);

      expect(prismaMock.token.update).toHaveBeenCalledWith({
        where: {
          userId,
          blacklisted: false,
          token,
        },
        data: {
          blacklisted: true,
        },
      });
      expect(result).toHaveProperty("message");
    });

    test("should throw error if token not found", async () => {
      const userId = "user-123";
      const token = "invalid-token";

      prismaMock.token.update.mockRejectedValue(new Error("Token not found"));

      await expect(authService.logout(userId, token)).rejects.toThrow(
        "Token not found",
      );
    });

    test("should throw error if token already blacklisted", async () => {
      const userId = "user-123";
      const token = "already-blacklisted";

      prismaMock.token.update.mockRejectedValue(
        new Error("Token already blacklisted"),
      );

      await expect(authService.logout(userId, token)).rejects.toThrow();
    });
  });

  // ============ REFRESH TOKEN TESTS ============
  describe("refresh", () => {
    test("should successfully refresh access token with valid refresh token", async () => {
      const requestUser = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        token: "valid-refresh-token",
      };

      const refreshTokenRecord = {
        id: "token-1",
        token: "valid-refresh-token",
        type: "refresh",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: "user-123",
        blacklisted: false,
      };

      prismaMock.token.findUnique.mockResolvedValue(refreshTokenRecord);
      jwtHelperMock.createAccessToken.mockReturnValue("new-access-token");

      const result = await authService.refresh(requestUser);

      expect(prismaMock.token.findUnique).toHaveBeenCalledWith({
        where: {
          token: "valid-refresh-token",
          blacklisted: false,
        },
      });
      expect(result).toHaveProperty("token");
      expect(result.token).toBe("new-access-token");
      expect(JwtHelper.createAccessToken).toHaveBeenCalledWith({
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
      });
    });

    test("should throw ResponseError if refresh token is invalid", async () => {
      const requestUser = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        token: "invalid-refresh-token",
      };

      prismaMock.token.findUnique.mockResolvedValue(null);

      await expect(authService.refresh(requestUser)).rejects.toThrow(
        ResponseError,
      );
    });

    test("should throw ResponseError if refresh token is blacklisted", async () => {
      const requestUser = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        token: "blacklisted-token",
      };

      prismaMock.token.findUnique.mockResolvedValue(null);

      try {
        await authService.refresh(requestUser);
        fail("Should have thrown ResponseError");
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        if (error instanceof ResponseError) {
          expect(error.statusCode).toBe(401);
        }
      }
    });

    test("should throw 401 Unauthorized for invalid refresh token", async () => {
      const requestUser = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        token: "invalid-token",
      };

      prismaMock.token.findUnique.mockResolvedValue(null);

      try {
        await authService.refresh(requestUser);
        fail("Should have thrown ResponseError");
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        if (error instanceof ResponseError) {
          expect(error.statusCode).toBe(401);
          expect(error.message).toBe("Unauthorized");
        }
      }
    });

    test("should create new access token with correct payload", async () => {
      const requestUser = {
        id: "user-456",
        name: "Another User",
        email: "another@example.com",
        token: "valid-token",
      };

      prismaMock.token.findUnique.mockResolvedValue({
        id: "token-2",
        token: "valid-token",
        type: "refresh",
        expires: new Date(),
        userId: "user-456",
        blacklisted: false,
      });
      jwtHelperMock.createAccessToken.mockReturnValue("new-access-token-456");

      const result = await authService.refresh(requestUser);

      expect(JwtHelper.createAccessToken).toHaveBeenCalledWith({
        id: "user-456",
        name: "Another User",
        email: "another@example.com",
      });
      expect(result.token).toBe("new-access-token-456");
    });
  });

  // ============ VALIDATE CREDENTIAL TESTS (Private method via login) ============
  describe("validateCredential (via login)", () => {
    test("should validate correct credentials", async () => {
      const loginRequest = {
        email: "valid@example.com",
        password: "CorrectPass",
      };

      const user = {
        id: "user-789",
        name: "Valid User",
        email: "valid@example.com",
        password: "$2b$10$hashedPasswordValue",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      bcryptMock.compare.mockResolvedValue(true);
      jwtHelperMock.createRefreshToken.mockReturnValue("refresh");
      jwtHelperMock.createAccessToken.mockReturnValue("access");
      prismaMock.token.create.mockResolvedValue({
        id: "token-1",
        token: "refresh",
        type: "refresh",
        expires: new Date(),
        userId: "user-789",
        blacklisted: false,
      });

      const result = await authService.login(loginRequest);

      expect(result).toBeDefined();
    });

    test("should reject invalid credentials with correct error details", async () => {
      const loginRequest = {
        email: "user@example.com",
        password: "WrongPassword",
      };

      const user = {
        id: "user-123",
        name: "Test User",
        email: "user@example.com",
        password: "$2b$10$hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      try {
        await authService.login(loginRequest);
        fail("Should have thrown ResponseError");
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        if (error instanceof ResponseError) {
          expect(error.statusCode).toBe(401);
          expect(error.message).toBe("Invalid Credential");
        }
      }
    });
  });
});
