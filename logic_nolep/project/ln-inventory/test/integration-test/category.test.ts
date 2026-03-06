import request from "supertest";
import app from "@applications/web";
import { prisma } from "@applications/prisma";
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import { getAuthHeader, mockCategories } from "./test-utils";

describe("Category Integration Tests", () => {
  beforeEach(() => {
    mockReset(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const adminAuth = getAuthHeader({ id: "admin-1", role: "admin" });
  const userAuth = getAuthHeader({ id: "user-1", role: "user" });

  describe("POST /api/categories", () => {
    test("should create category successfully", async () => {
      const createPayload = {
        name: "Electronics",
        description: "Electronic products",
      };

      prisma.category.create.mockResolvedValue({
        id: "category-1",
        ...createPayload,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", adminAuth)
        .send(createPayload)
        .expect(201);

      expect(response.body.data).toHaveProperty("id", "category-1");
      expect(response.body.data).toHaveProperty("name", "Electronics");
    });

    test("should fail category creation without authentication", async () => {
      const createPayload = {
        name: "Electronics",
        description: "Electronic products",
      };

      const response = await request(app)
        .post("/api/categories")
        .send(createPayload)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail category creation with missing name", async () => {
      const createPayload = {
        description: "Electronic products",
      };

      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", adminAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail category creation with invalid token", async () => {
      const createPayload = {
        name: "Electronics",
        description: "Electronic products",
      };

      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", "Bearer invalid-token")
        .send(createPayload)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail category creation without admin role", async () => {
      const createPayload = {
        name: "Electronics",
        description: "Electronic products",
      };

      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/categories", () => {
    test("should get all categories successfully", async () => {
      const categories = [mockCategories.category1, mockCategories.category2];
      prisma.category.findMany.mockResolvedValue(categories);

      const response = await request(app)
        .get("/api/categories")
        .set("Authorization", userAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test("should get empty categories list", async () => {
      prisma.category.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/categories")
        .set("Authorization", userAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    test("should fail getting categories without authentication", async () => {
      const response = await request(app).get("/api/categories").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/categories/:categoryId", () => {
    test("should get category by id successfully", async () => {
      prisma.category.findUnique.mockResolvedValue(mockCategories.category1);

      const response = await request(app)
        .get("/api/categories/category-1")
        .set("Authorization", userAuth)
        .expect(200);

      expect(response.body.data).toHaveProperty("id", "category-1");
      expect(response.body.data).toHaveProperty("name", "Electronics");
    });

    test("should fail getting non-existent category", async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/categories/non-existent-id")
        .set("Authorization", userAuth)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail getting category without authentication", async () => {
      const response = await request(app)
        .get("/api/categories/category-1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("PATCH /api/categories/:categoryId", () => {
    test("should update category successfully", async () => {
      const updatePayload = {
        name: "Updated Electronics",
        description: "Updated description",
      };

      const updatedCategory = {
        ...mockCategories.category1,
        ...updatePayload,
      };

      prisma.category.findUnique.mockResolvedValue(mockCategories.category1);
      prisma.category.update.mockResolvedValue(updatedCategory);

      const response = await request(app)
        .patch("/api/categories/category-1")
        .set("Authorization", adminAuth)
        .send(updatePayload)
        .expect(200);

      expect(response.body.data).toHaveProperty("name", "Updated Electronics");
    });

    test("should fail updating non-existent category", async () => {
      const updatePayload = {
        name: "Updated Electronics",
      };

      prisma.category.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/categories/non-existent-id")
        .set("Authorization", adminAuth)
        .send(updatePayload)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail updating category without authentication", async () => {
      const updatePayload = {
        name: "Updated Electronics",
      };

      const response = await request(app)
        .patch("/api/categories/category-1")
        .send(updatePayload)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /api/categories/:categoryId", () => {
    test("should delete category successfully", async () => {
      prisma.category.findUnique.mockResolvedValue(mockCategories.category1);
      prisma.category.delete.mockResolvedValue(mockCategories.category1);

      const response = await request(app)
        .delete("/api/categories/category-1")
        .set("Authorization", adminAuth)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    test("should fail deleting non-existent category", async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/categories/non-existent-id")
        .set("Authorization", adminAuth)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail deleting category without authentication", async () => {
      const response = await request(app)
        .delete("/api/categories/category-1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});
