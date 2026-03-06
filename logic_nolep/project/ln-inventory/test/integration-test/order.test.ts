import request from "supertest";
import app from "@applications/web";
import { prisma } from "@applications/prisma";
import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import { getAuthHeader, mockOrders, mockOrderItems } from "./test-utils";

describe("Order Integration Tests", () => {
  beforeEach(() => {
    mockReset(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const adminAuth = getAuthHeader({ id: "admin-1", role: "admin" });
  const userAuth = getAuthHeader({ id: "user-1", role: "user" });

  describe("POST /api/orders", () => {
    test("should create order successfully", async () => {
      const createPayload = {
        items: [
          { productId: "product-1", quantity: 2 },
          { productId: "product-2", quantity: 1 },
        ],
      };

      prisma.order.create.mockResolvedValue({
        id: "order-1",
        userId: "user-1",
        totalPrice: 30000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prisma.orderItem.createMany.mockResolvedValue({
        count: 2,
      });

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(201);

      expect(response.body.data).toHaveProperty("id", "order-1");
    });

    test("should fail order creation without authentication", async () => {
      const createPayload = {
        items: [{ productId: "product-1", quantity: 2 }],
      };

      const response = await request(app)
        .post("/api/orders")
        .send(createPayload)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail order creation with missing items", async () => {
      const createPayload = {};

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail order creation with empty items array", async () => {
      const createPayload = {
        items: [],
      };

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail order creation with invalid quantity", async () => {
      const createPayload = {
        items: [{ productId: "product-1", quantity: 0 }],
      };

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", userAuth)
        .send(createPayload)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/orders", () => {
    test("should get all orders successfully", async () => {
      const orders = [mockOrders.order1, mockOrders.order2];
      prisma.order.findMany.mockResolvedValue(orders);

      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", userAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test("should get empty orders list", async () => {
      prisma.order.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", userAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    test("should fail getting orders without authentication", async () => {
      const response = await request(app).get("/api/orders").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/orders/:orderId", () => {
    test("should get order by id successfully", async () => {
      const orderWithItems = {
        ...mockOrders.order1,
        items: [mockOrderItems.item1, mockOrderItems.item2],
      };

      prisma.order.findUnique.mockResolvedValue(orderWithItems);

      const response = await request(app)
        .get("/api/orders/order-1")
        .set("Authorization", userAuth)
        .expect(200);

      expect(response.body.data).toHaveProperty("id", "order-1");
      expect(response.body.data).toHaveProperty("totalPrice", 30000);
    });

    test("should fail getting non-existent order", async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/orders/non-existent-id")
        .set("Authorization", userAuth)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail getting order without authentication", async () => {
      const response = await request(app)
        .get("/api/orders/order-1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/users/:userId/orders", () => {
    test("should get all orders by user id successfully (admin only)", async () => {
      const orders = [mockOrders.order1, mockOrders.order2];
      prisma.order.findMany.mockResolvedValue(orders);

      const response = await request(app)
        .get("/api/users/user-1/orders")
        .set("Authorization", adminAuth)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test("should fail getting user orders without admin role", async () => {
      const response = await request(app)
        .get("/api/users/user-1/orders")
        .set("Authorization", userAuth)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail getting user orders without authentication", async () => {
      const response = await request(app)
        .get("/api/users/user-1/orders")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("PATCH /api/orders/:orderId", () => {
    test("should update order successfully", async () => {
      const updatePayload = {
        status: "processing",
      };

      const updatedOrder = {
        ...mockOrders.order1,
        ...updatePayload,
      };

      prisma.order.findUnique.mockResolvedValue(mockOrders.order1);
      prisma.order.update.mockResolvedValue(updatedOrder);

      const response = await request(app)
        .patch("/api/orders/order-1")
        .set("Authorization", userAuth)
        .send(updatePayload)
        .expect(200);

      expect(response.body.data).toHaveProperty("id", "order-1");
    });

    test("should fail updating non-existent order", async () => {
      const updatePayload = {
        status: "processing",
      };

      prisma.order.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/orders/non-existent-id")
        .set("Authorization", userAuth)
        .send(updatePayload)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail updating order without authentication", async () => {
      const updatePayload = {
        status: "processing",
      };

      const response = await request(app)
        .patch("/api/orders/order-1")
        .send(updatePayload)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /api/orders/:orderId", () => {
    test("should delete order successfully", async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrders.order1);
      prisma.order.delete.mockResolvedValue(mockOrders.order1);

      const response = await request(app)
        .delete("/api/orders/order-1")
        .set("Authorization", userAuth)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    test("should fail deleting non-existent order", async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/orders/non-existent-id")
        .set("Authorization", userAuth)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
    });

    test("should fail deleting order without authentication", async () => {
      const response = await request(app)
        .delete("/api/orders/order-1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});
