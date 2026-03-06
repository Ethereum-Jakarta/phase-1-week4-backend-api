import request from "supertest";
import app from "@applications/web";
import { prisma } from "@applications/prisma";
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import { getAuthHeader, mockProducts } from "./test-utils";

describe("Product Integration Tests", () => {
  beforeEach(() => {
    mockReset(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const adminAuth = getAuthHeader({ id: "admin-1", role: "admin" });
  const userAuth = getAuthHeader({ id: "user-1", role: "user" });

  describe("POST /api/products", () => {
    test("should create product successfully", async () => {
      const createPayload = {
        name: "Product 1",
        description: "Test Product 1",
        price: 10000,
        categoryId: "category-1",
      };

      prisma.product.create.mockResolvedValue({
        id: "product-1",
        ...createPayload,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(201);

      expect(response.body.data).toHaveProperty("id", "product-1");
      expect(response.body.data).toHaveProperty("name", "Product 1");
    });

    test("should fail product creation without authentication", async () => {
      const createPayload = {
        name: "Product 1",
        description: "Test Product 1",
        price: 10000,
        categoryId: "category-1",
      };

      const response = await request(app)
        .post("/api/products")
        .send(createPayload)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail product creation with missing required fields", async () => {
      const createPayload = {
        name: "Product 1",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail product creation with invalid price", async () => {
      const createPayload = {
        name: "Product 1",
        description: "Test Product 1",
        price: -100,
        categoryId: "category-1",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/products", () => {
    test("should get all products successfully", async () => {
      const products = [mockProducts.product1, mockProducts.product2];
      prisma.product.findMany.mockResolvedValue(products);

      const response = await request(app)
        .get("/api/products")
        .set("Authorization", userAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test("should get empty products list", async () => {
      prisma.product.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/products")
        .set("Authorization", userAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    test("should fail getting products without authentication", async () => {
      const response = await request(app).get("/api/products").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/products/:productId", () => {
    test("should get product by id successfully", async () => {
      prisma.product.findUnique.mockResolvedValue(mockProducts.product1);

      const response = await request(app)
        .get("/api/products/product-1")
        .set("Authorization", userAuth)
        .expect(200);

      expect(response.body.data).toHaveProperty("id", "product-1");
      expect(response.body.data).toHaveProperty("name", "Product 1");
    });

    test("should fail getting non-existent product", async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/products/non-existent-id")
        .set("Authorization", userAuth)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail getting product without authentication", async () => {
      const response = await request(app)
        .get("/api/products/product-1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/users/:userId/products", () => {
    test("should get all products by user id successfully (admin only)", async () => {
      const products = [mockProducts.product1, mockProducts.product2];
      prisma.product.findMany.mockResolvedValue(products);

      const response = await request(app)
        .get("/api/users/user-1/products")
        .set("Authorization", adminAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test("should fail getting user products without admin role", async () => {
      const response = await request(app)
        .get("/api/users/user-1/products")
        .set("Authorization", userAuth)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail getting user products without authentication", async () => {
      const response = await request(app)
        .get("/api/users/user-1/products")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("PATCH /api/products/:productId", () => {
    test("should update product successfully", async () => {
      const updatePayload = {
        name: "Updated Product 1",
        price: 15000,
      };

      const updatedProduct = {
        ...mockProducts.product1,
        ...updatePayload,
      };

      prisma.product.findUnique.mockResolvedValue(mockProducts.product1);
      prisma.product.update.mockResolvedValue(updatedProduct);

      const response = await request(app)
        .patch("/api/products/product-1")
        .set("Authorization", userAuth)
        .send(updatePayload)
        .expect(201);

      expect(response.body.data).toHaveProperty("name", "Updated Product 1");
      expect(response.body.data).toHaveProperty("price", 15000);
    });

    test("should fail updating non-existent product", async () => {
      const updatePayload = {
        name: "Updated Product 1",
      };

      prisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/products/non-existent-id")
        .set("Authorization", userAuth)
        .send(updatePayload);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail updating product without authentication", async () => {
      const updatePayload = {
        name: "Updated Product 1",
      };

      const response = await request(app)
        .patch("/api/products/product-1")
        .send(updatePayload)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail updating product with invalid price", async () => {
      const updatePayload = {
        price: -100,
      };

      const response = await request(app)
        .patch("/api/products/product-1")
        .set("Authorization", userAuth)
        .send(updatePayload);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /api/products/:productId", () => {
    test("should delete product successfully", async () => {
      prisma.product.findUnique.mockResolvedValue(mockProducts.product1);
      prisma.product.delete.mockResolvedValue(mockProducts.product1);

      const response = await request(app)
        .delete("/api/products/product-1")
        .set("Authorization", userAuth)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    test("should fail deleting non-existent product", async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/products/non-existent-id")
        .set("Authorization", userAuth);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail deleting product without authentication", async () => {
      const response = await request(app)
        .delete("/api/products/product-1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});
