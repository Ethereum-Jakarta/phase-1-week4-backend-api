import { UserService } from "../../src/services/user.service";
import { prismaMock } from "../../src/config/mock";
import { test, describe, expect, beforeEach } from "@jest/globals";
import { ResponseError } from "../../src/errors/response.error";
import { fail } from "node:assert";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(prismaMock);
  });

  // ============ CREATE USER TESTS ============
  describe("createUser", () => {
    test("should create a new user with hashed password", async () => {
      const userInput = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
      };

      const createdUser = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        password: expect.any(String), // hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userInput);

      expect(result).toBeDefined();
      expect(result.email).toBe("john@example.com");
      expect(result.name).toBe("John Doe");
      expect(prismaMock.user.create).toHaveBeenCalled();
    });

    test("should hash password before creating user", async () => {
      const userInput = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "SecurePass123",
      };

      const createdUser = {
        id: "2",
        name: "Jane Doe",
        email: "jane@example.com",
        password: "$2b$10$hashedPassword", // bcrypt hash
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(createdUser);

      await userService.createUser(userInput);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "Jane Doe",
          email: "jane@example.com",
        }),
      });
    });

    test("should throw error if database operation fails", async () => {
      const userInput = {
        name: "Error User",
        email: "error@example.com",
        password: "Pass123",
      };

      prismaMock.user.create.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(userService.createUser(userInput)).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  // ============ UPDATE USER TESTS ============
  describe("updateUser", () => {
    test("should update user successfully", async () => {
      const userId = "user-1";
      const updateData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const updatedUser = {
        id: userId,
        name: "Updated Name",
        email: "updated@example.com",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(userId, updateData);

      expect(result).toBeDefined();
      expect(result.name).toBe("Updated Name");
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });

    test("should throw error when user not found", async () => {
      const userId = "non-existent-id";

      prismaMock.user.update.mockRejectedValue(new Error("User not found"));

      await expect(
        userService.updateUser(userId, { name: "New Name" }),
      ).rejects.toThrow("User not found");
    });

    test("should update only provided fields", async () => {
      const userId = "user-2";
      const partialUpdate = { name: "Partial Update" };

      const updatedUser = {
        id: userId,
        name: "Partial Update",
        email: "existing@example.com",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.update.mockResolvedValue(updatedUser);

      await userService.updateUser(userId, partialUpdate);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: partialUpdate,
      });
    });
  });

  // ============ DELETE USER TESTS ============
  describe("deleteUser", () => {
    test("should delete user successfully", async () => {
      const userId = "user-to-delete";

      prismaMock.user.delete.mockResolvedValue({ id: userId });

      await userService.deleteUser(userId);

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    test("should throw error when deleting non-existent user", async () => {
      const userId = "non-existent";

      prismaMock.user.delete.mockRejectedValue(new Error("User not found"));

      await expect(userService.deleteUser(userId)).rejects.toThrow(
        "User not found",
      );
    });
  });

  // ============ GET ALL USERS TESTS ============
  describe("getAllUser", () => {
    test("should return all users with default pagination", async () => {
      const mockUsers = [
        {
          id: "1",
          name: "User 1",
          email: "user1@example.com",
          password: "hash1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "User 2",
          email: "user2@example.com",
          password: "hash2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);
      prismaMock.user.count.mockResolvedValue(25);

      const result = await userService.getAllUser();

      expect(result.users).toHaveLength(2);
      expect(result.totalPage).toBe(1.25); // 25 / 20 = 1.25
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        orderBy: { id: "asc" },
      });
    });

    test("should apply correct pagination offset for page 2", async () => {
      const mockUsers: any = [];
      prismaMock.user.findMany.mockResolvedValue(mockUsers);
      prismaMock.user.count.mockResolvedValue(5);

      await userService.getAllUser(2);

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        skip: 20, // (2 - 1) * 20
        take: 20,
        orderBy: { id: "asc" },
      });
    });

    test("should calculate correct total pages", async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(50);

      const result = await userService.getAllUser(1);

      expect(result.totalPage).toBe(2.5); // 50 / 20 = 2.5
    });

    test("should return 1 total page when user count is less than limit", async () => {
      const mockUsers = [
        {
          id: "1",
          name: "User 1",
          email: "user1@example.com",
          password: "hash1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);
      prismaMock.user.count.mockResolvedValue(5); // less than 20

      const result = await userService.getAllUser(1);

      expect(result.totalPage).toBe(1);
    });
  });

  // ============ GET USER BY ID TESTS ============
  describe("getUserById", () => {
    test("should return user when found", async () => {
      const userId = "user-123";
      const mockUser = {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(result).toBeDefined();
      expect(result.name).toBe("Test User");
      expect(result.email).toBe("test@example.com");
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    test("should throw ResponseError when user not found", async () => {
      const userId = "non-existent";

      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserById(userId)).rejects.toThrow(
        ResponseError,
      );
    });

    test("should throw 404 error with correct message", async () => {
      const userId = "missing-user";

      prismaMock.user.findUnique.mockResolvedValue(null);

      try {
        await userService.getUserById(userId);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(ResponseError);
        if (error instanceof ResponseError) {
          expect(error.statusCode).toBe(404);
        }
      }
    });

    test("should handle database errors", async () => {
      const userId = "user-id";

      prismaMock.user.findUnique.mockRejectedValue(new Error("Database error"));

      await expect(userService.getUserById(userId)).rejects.toThrow(
        "Database error",
      );
    });
  });
});
