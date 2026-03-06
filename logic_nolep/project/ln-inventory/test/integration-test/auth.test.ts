import request from "supertest";
import app from "@applications/web";
import { prisma } from "@applications/prisma";
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import { generateRefreshToken, mockUsers } from "./test-utils";

describe("Auth Integration Tests", () => {
  beforeEach(() => {
    mockReset(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    test("should register a new user successfully", async () => {
      const registerPayload = {
        name: "New User",
        email: "newuser@example.com",
        password: "SecurePass123",
      };

      const createdUser = {
        id: "user-new",
        ...registerPayload,
        password: "$2b$10$hashedPassword",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload)
        .expect(201);

      expect(response.body.data).toHaveProperty("id", "user-new");
      expect(response.body.data).toHaveProperty("email", "newuser@example.com");
    });

    test("should fail registration with invalid email format", async () => {
      const registerPayload = {
        name: "New User",
        email: "invalid-email",
        password: "SecurePass123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail registration with missing password", async () => {
      const registerPayload = {
        name: "New User",
        email: "newuser@example.com",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail registration with missing name", async () => {
      const registerPayload = {
        email: "newuser@example.com",
        password: "SecurePass123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail registration with existing email", async () => {
      const registerPayload = {
        name: "New User",
        email: "existing@example.com",
        password: "SecurePass123",
      };

      prisma.user.findUnique.mockResolvedValue(mockUsers.user);

      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login user successfully", async () => {
      const loginPayload = {
        email: "test@example.com",
        password: "SecurePass123",
      };

      prisma.user.findUnique.mockResolvedValue(mockUsers.user);
      prisma.token.create.mockResolvedValue({
        id: "token-1",
        userId: "user-1",
        refreshToken: "refresh-token",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginPayload)
        .expect(200);

      expect(response.body.data).toHaveProperty("id", "user-1");
      expect(response.body.data).toHaveProperty("email", "test@example.com");
      expect(response.body.data).toHaveProperty("accessToken");
    });

    test("should fail login with invalid email format", async () => {
      const loginPayload = {
        email: "invalid-email",
        password: "SecurePass123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail login with non-existent user", async () => {
      const loginPayload = {
        email: "nonexistent@example.com",
        password: "SecurePass123",
      };

      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail login with missing password", async () => {
      const loginPayload = {
        email: "test@example.com",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail login with missing email", async () => {
      const loginPayload = {
        password: "SecurePass123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should logout user successfully with refresh token", async () => {
      const refreshToken = generateRefreshToken({ id: "user-1", role: "user" });

      prisma.token.deleteMany.mockResolvedValue({ count: 1 });

      const response = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", `jwt=${refreshToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("succes", true);
      expect(response.body).toHaveProperty("message");
    });

    test("should fail logout without refresh token cookie", async () => {
      const response = await request(app).post("/api/auth/logout").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail logout with invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", "jwt=invalid-token")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /api/auth/refresh", () => {
    test("should refresh access token successfully", async () => {
      const refreshToken = generateRefreshToken({ id: "user-1", role: "user" });

      prisma.token.findUnique.mockResolvedValue({
        id: "token-1",
        userId: "user-1",
        refreshToken: refreshToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", `jwt=${refreshToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("succes", true);
      expect(response.body).toHaveProperty(
        "message",
        "Succes generate new acces token!",
      );
      expect(response.body.data).toHaveProperty("accessToken");
    });

    test("should fail refresh without refresh token cookie", async () => {
      const response = await request(app).post("/api/auth/refresh").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail refresh with invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", "jwt=invalid-refresh-token")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});
