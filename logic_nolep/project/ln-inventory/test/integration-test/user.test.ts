import request from "supertest";
import app from "@applications/web";
import { prisma } from "@applications/prisma";
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import { getAuthHeader, mockUsers } from "./test-utils";

describe("User Integration Tests", () => {
  beforeEach(() => {
    mockReset(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const adminAuth = getAuthHeader({ id: "admin-1", role: "admin" });
  const userAuth = getAuthHeader({ id: "user-1", role: "user" });

  describe("POST /api/users", () => {
    test("should create user successfully (admin only)", async () => {
      const createPayload = {
        name: "New User",
        email: "newuser@example.com",
        password: "SecurePass123",
      };

      const createdUser = {
        id: "user-new",
        ...createPayload,
        password: "$2b$10$hashedPassword",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post("/api/users")
        .set("Authorization", adminAuth)
        .send(createPayload)
        .expect(201);

      expect(response.body.data).toHaveProperty("id", "user-new");
      expect(response.body.data).toHaveProperty("email", "newuser@example.com");
    });

    test("should fail user creation without admin role", async () => {
      const createPayload = {
        name: "New User",
        email: "newuser@example.com",
        password: "SecurePass123",
      };

      const response = await request(app)
        .post("/api/users")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail user creation without authentication", async () => {
      const createPayload = {
        name: "New User",
        email: "newuser@example.com",
        password: "SecurePass123",
      };

      const response = await request(app)
        .post("/api/users")
        .send(createPayload)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail user creation with invalid email", async () => {
      const createPayload = {
        name: "New User",
        email: "invalid-email",
        password: "SecurePass123",
      };

      const response = await request(app)
        .post("/api/users")
        .set("Authorization", adminAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail user creation with missing password", async () => {
      const createPayload = {
        name: "New User",
        email: "newuser@example.com",
      };

      const response = await request(app)
        .post("/api/users")
        .set("Authorization", adminAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail user creation with existing email", async () => {
      const createPayload = {
        name: "New User",
        email: "existing@example.com",
        password: "SecurePass123",
      };

      prisma.user.findUnique.mockResolvedValue(mockUsers.user);

      const response = await request(app)
        .post("/api/users")
        .set("Authorization", adminAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/users", () => {
    test("should get all users successfully (admin only)", async () => {
      const users = [mockUsers.admin, mockUsers.user];
      prisma.user.findMany.mockResolvedValue(users);

      const response = await request(app)
        .get("/api/users")
        .set("Authorization", adminAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test("should fail getting users without admin role", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", userAuth)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail getting users without authentication", async () => {
      const response = await request(app).get("/api/users").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should get empty users list", async () => {
      prisma.user.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/users")
        .set("Authorization", adminAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe("GET /api/users/:userId", () => {
    test("should get user by id successfully (admin only)", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUsers.user);

      const response = await request(app)
        .get("/api/users/user-1")
        .set("Authorization", adminAuth)
        .expect(200);

      expect(response.body.data).toHaveProperty("id", "user-1");
      expect(response.body.data).toHaveProperty("email", "test@example.com");
    });

    test("should fail getting user without admin role", async () => {
      const response = await request(app)
        .get("/api/users/user-1")
        .set("Authorization", userAuth)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail getting user without authentication", async () => {
      const response = await request(app).get("/api/users/user-1").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail getting non-existent user", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/users/non-existent-id")
        .set("Authorization", adminAuth)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("PUT /api/users/:userId", () => {
    test("should update user successfully (admin only)", async () => {
      const updatePayload = {
        name: "Updated User",
        email: "updated@example.com",
      };

      const updatedUser = {
        ...mockUsers.user,
        ...updatePayload,
      };

      prisma.user.findUnique.mockResolvedValue(mockUsers.user);
      prisma.user.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put("/api/users/user-1")
        .set("Authorization", adminAuth)
        .send(updatePayload)
        .expect(200);

      expect(response.body.data).toHaveProperty("name", "Updated User");
      expect(response.body.data).toHaveProperty("email", "updated@example.com");
    });

    test("should fail updating user without admin role", async () => {
      const updatePayload = {
        name: "Updated User",
      };

      const response = await request(app)
        .put("/api/users/user-1")
        .set("Authorization", userAuth)
        .send(updatePayload)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail updating user without authentication", async () => {
      const updatePayload = {
        name: "Updated User",
      };

      const response = await request(app)
        .put("/api/users/user-1")
        .send(updatePayload)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail updating non-existent user", async () => {
      const updatePayload = {
        name: "Updated User",
      };

      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/users/non-existent-id")
        .set("Authorization", adminAuth)
        .send(updatePayload)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail updating user with invalid email", async () => {
      const updatePayload = {
        email: "invalid-email",
      };

      const response = await request(app)
        .put("/api/users/user-1")
        .set("Authorization", adminAuth)
        .send(updatePayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /api/users/:userId", () => {
    test("should delete user successfully (admin only)", async () => {
      prisma.user.findUnique.mockResolvedValue(mockUsers.user);
      prisma.user.delete.mockResolvedValue(mockUsers.user);

      const response = await request(app)
        .delete("/api/users/user-1")
        .set("Authorization", adminAuth)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    test("should fail deleting user without admin role", async () => {
      const response = await request(app)
        .delete("/api/users/user-1")
        .set("Authorization", userAuth)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail deleting user without authentication", async () => {
      const response = await request(app)
        .delete("/api/users/user-1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail deleting non-existent user", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/users/non-existent-id")
        .set("Authorization", adminAuth)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});
