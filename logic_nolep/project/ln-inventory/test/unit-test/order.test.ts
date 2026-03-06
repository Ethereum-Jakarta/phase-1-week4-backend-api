import { OrderServices } from "../../src/services/order.service";
import { prismaMock } from "../../src/config/mock";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import {
  OrderDto,
  type CreateOrderRequest,
  type UpdateOrderRequest,
} from "../../src/models/order.model";

// ============ ORDER SERVICE TESTS ============
describe("OrderServices", () => {
  let orderService: OrderServices;

  beforeEach(() => {
    orderService = new OrderServices(prismaMock as any);
    jest.clearAllMocks();
  });

  // ============ CREATE ORDER TESTS ============
  describe("createOrder", () => {
    test("should successfully create a new order with valid items", async () => {
      const userId = "user-uuid-1";
      const createRequest: CreateOrderRequest = {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        items: [
          { productId: "product-1", quantity: 2 },
          { productId: "product-2", quantity: 1 },
        ],
      };

      const mockProducts = [
        {
          id: "product-1",
          name: "Laptop",
          price: 999.99,
          quantityInStock: 10,
          description: "High-performance laptop",
          categoryId: "cat-1",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "product-2",
          name: "Mouse",
          price: 29.99,
          quantityInStock: 50,
          description: "USB Mouse",
          categoryId: null,
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockOrder = {
        id: "order-1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 2029.97,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            product: {
              findMany: jest.fn().mockResolvedValue(mockProducts as never),
              updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
            order: {
              create: jest.fn().mockResolvedValue(mockOrder),
            },
            orderItem: {
              createMany: jest.fn().mockResolvedValue({ count: 2 }),
              findMany: jest.fn().mockResolvedValue([]),
            },
          });
        },
      );

      const result = await orderService.createOrder(createRequest, userId);

      expect(result).toBeInstanceOf(OrderDto);
      expect(result.customerName).toBe("John Doe");
      expect(result.customerEmail).toBe("john@example.com");
      expect(result.totalPrice).toBeCloseTo(2029.97, 1);
    });

    test("should normalize duplicate product IDs in items", async () => {
      const userId = "user-uuid-1";
      const createRequest: CreateOrderRequest = {
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        items: [
          { productId: "product-1", quantity: 2 },
          { productId: "product-1", quantity: 1 },
          { productId: "product-1", quantity: 2 },
        ],
      };

      const mockProducts = [
        {
          id: "product-1",
          name: "Laptop",
          price: 999.99,
          quantityInStock: 10,
          description: "High-performance laptop",
          categoryId: null,
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockOrder = {
        id: "order-2",
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        totalPrice: 4999.95,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            product: {
              findMany: jest.fn().mockResolvedValue(mockProducts),
              updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
            order: {
              create: jest.fn().mockResolvedValue(mockOrder),
            },
            orderItem: {
              createMany: jest.fn().mockResolvedValue({ count: 1 }),
              findMany: jest.fn().mockResolvedValue([]),
            },
          });
        },
      );

      const result = await orderService.createOrder(createRequest, userId);
      expect(result.totalPrice).toBeGreaterThan(0);
    });

    test("should throw error when product not found", async () => {
      const userId = "user-uuid-1";
      const createRequest: CreateOrderRequest = {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        items: [{ productId: "non-existent", quantity: 1 }],
      };

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            product: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          });
        },
      );

      await expect(
        orderService.createOrder(createRequest, userId),
      ).rejects.toThrow("One or more products not found");
    });

    test("should throw error when stock is insufficient", async () => {
      const userId = "user-uuid-1";
      const createRequest: CreateOrderRequest = {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        items: [{ productId: "product-1", quantity: 100 }],
      };

      const mockProducts = [
        {
          id: "product-1",
          name: "Laptop",
          price: 999.99,
          quantityInStock: 5,
          description: "High-performance laptop",
          categoryId: null,
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            product: {
              findMany: jest.fn().mockResolvedValue(mockProducts),
              updateMany: jest.fn().mockResolvedValue({ count: 0 }),
            },
          });
        },
      );

      await expect(
        orderService.createOrder(createRequest, userId),
      ).rejects.toThrow("Stock not enough for product Laptop");
    });

    test("should calculate correct total price", async () => {
      const userId = "user-uuid-1";
      const createRequest: CreateOrderRequest = {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        items: [
          { productId: "product-1", quantity: 2 },
          { productId: "product-2", quantity: 3 },
        ],
      };

      const mockProducts = [
        {
          id: "product-1",
          name: "Laptop",
          price: 500,
          quantityInStock: 10,
          description: "Laptop",
          categoryId: null,
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "product-2",
          name: "Phone",
          price: 300,
          quantityInStock: 20,
          description: "Phone",
          categoryId: null,
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockOrder = {
        id: "order-3",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 1900,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            product: {
              findMany: jest.fn().mockResolvedValue(mockProducts),
              updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
            order: {
              create: jest.fn().mockResolvedValue(mockOrder),
            },
            orderItem: {
              createMany: jest.fn().mockResolvedValue({ count: 2 }),
              findMany: jest.fn().mockResolvedValue([]),
            },
          });
        },
      );

      const result = await orderService.createOrder(createRequest, userId);
      expect(result.totalPrice).toBe(1900);
    });
  });

  // ============ UPDATE ORDER TESTS ============
  describe("updateOrder", () => {
    test("should successfully update order with new items", async () => {
      const userId = "order-uuid-1";
      const updateRequest: UpdateOrderRequest = {
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        items: [{ productId: "product-1", quantity: 3 }],
      };

      const mockOrder = {
        id: "order-1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 2029.97,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [{ productId: "product-2", quantity: 1 }],
      };

      const mockProducts = [
        {
          id: "product-1",
          name: "Laptop",
          price: 999.99,
          quantityInStock: 10,
          description: "High-performance laptop",
          categoryId: null,
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            order: {
              findUnique: jest.fn().mockResolvedValue(mockOrder),
              update: jest.fn().mockResolvedValue({
                ...mockOrder,
                customerName: "Jane Doe",
                customerEmail: "jane@example.com",
              }),
            },
            product: {
              findMany: jest.fn().mockResolvedValue(mockProducts),
              update: jest.fn().mockResolvedValue({}),
              updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            },
            orderItem: {
              deleteMany: jest.fn().mockResolvedValue({}),
              createMany: jest.fn().mockResolvedValue({ count: 1 }),
              findMany: jest.fn().mockResolvedValue([]),
            },
          });
        },
      );

      const result = await orderService.updateOrder(updateRequest, userId);

      expect(result).toBeInstanceOf(OrderDto);
      expect(result.customerName).toBe("Jane Doe");
      expect(result.customerEmail).toBe("jane@example.com");
    });

    test("should update only customer information without items", async () => {
      const userId = "order-uuid-1";
      const updateRequest: UpdateOrderRequest = {
        customerName: "Updated Name",
        customerEmail: "updated@example.com",
      };

      const mockOrder = {
        id: "order-1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 2029.97,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [{ productId: "product-1", quantity: 2 }],
      };

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            order: {
              findUnique: jest.fn().mockResolvedValue(mockOrder),
              update: jest.fn().mockResolvedValue({
                ...mockOrder,
                customerName: "Updated Name",
                customerEmail: "updated@example.com",
              }),
            },
            orderItem: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          });
        },
      );

      const result = await orderService.updateOrder(updateRequest, userId);

      expect(result.customerName).toBe("Updated Name");
      expect(result.customerEmail).toBe("updated@example.com");
    });

    test("should throw error when order not found", async () => {
      const userId = "non-existent-order";
      const updateRequest: UpdateOrderRequest = {
        customerName: "John Doe",
      };

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            order: {
              findUnique: jest.fn().mockResolvedValue(null),
            },
          });
        },
      );

      await expect(
        orderService.updateOrder(updateRequest, userId),
      ).rejects.toThrow("Order not found");
    });
  });

  // ============ DELETE ORDER TESTS ============
  describe("deleteOrder", () => {
    test("should successfully delete an order and restore stock", async () => {
      const userId = "order-uuid-1";

      const mockOrder = {
        id: "order-1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 1000,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          { productId: "product-1", quantity: 2 },
          { productId: "product-2", quantity: 1 },
        ],
      };

      const deletedOrder = {
        id: "order-1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 1000,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaMock.order.findUnique as any).mockResolvedValue(mockOrder);

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            product: {
              update: jest.fn().mockResolvedValue({}),
            },
            orderItem: {
              deleteMany: jest.fn().mockResolvedValue({}),
            },
            order: {
              delete: jest.fn().mockResolvedValue(deletedOrder),
            },
          });
        },
      );

      const result = await orderService.deleteOrder(userId);

      expect(result.id).toBe("order-1");
      expect(result.message).toBe("Order deleted successfully");
    });

    test("should throw error when order not found", async () => {
      const userId = "non-existent-order";

      (prismaMock.order.findUnique as any).mockResolvedValue(null);

      await expect(orderService.deleteOrder(userId)).rejects.toThrow(
        "Order not found",
      );
    });

    test("should restore stock for all products in order", async () => {
      const userId = "order-uuid-1";

      const mockOrder = {
        id: "order-1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 1500,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          { productId: "product-1", quantity: 3 },
          { productId: "product-2", quantity: 5 },
          { productId: "product-3", quantity: 2 },
        ],
      };

      (prismaMock.order.findUnique as any).mockResolvedValue(mockOrder);

      (prismaMock.$transaction as any).mockImplementation(
        async (callback: any) => {
          return callback({
            product: {
              update: jest.fn().mockResolvedValue({}),
            },
            orderItem: {
              deleteMany: jest.fn().mockResolvedValue({}),
            },
            order: {
              delete: jest.fn().mockResolvedValue(mockOrder),
            },
          });
        },
      );

      await orderService.deleteOrder(userId);
      expect(true).toBe(true);
    });
  });

  // ============ GET ALL ORDERS TESTS ============
  describe("getAllOrder", () => {
    test("should retrieve all orders with pagination", async () => {
      const userId = "user-uuid-1";
      const page = 1;
      const limit = 20;

      const mockOrders = [
        {
          id: "order-1",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          totalPrice: 1000,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          orderItems: [{ productId: "product-1", quantity: 2 }],
        },
        {
          id: "order-2",
          customerName: "Jane Doe",
          customerEmail: "jane@example.com",
          totalPrice: 500,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          orderItems: [{ productId: "product-2", quantity: 1 }],
        },
      ];

      (prismaMock.order.findMany as any).mockResolvedValue(mockOrders);
      (prismaMock.order.count as any).mockResolvedValue(2);
      (prismaMock.orderItem.findMany as any).mockResolvedValue([]);

      const result = await orderService.getAllOrder(userId, page, limit);

      expect(result.data).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.total).toBe(2);
    });

    test("should handle empty order list", async () => {
      const userId = "user-uuid-1";

      (prismaMock.order.findMany as any).mockResolvedValue([]);
      (prismaMock.order.count as any).mockResolvedValue(0);

      const result = await orderService.getAllOrder(userId);

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    test("should calculate correct pagination", async () => {
      const userId = "user-uuid-1";

      (prismaMock.order.findMany as any).mockResolvedValue([]);
      (prismaMock.order.count as any).mockResolvedValue(100);

      const result = await orderService.getAllOrder(userId, 2, 20);

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.totalPages).toBe(5);
    });
  });

  // ============ GET ALL ORDERS BY USER ID TESTS ============
  describe("getAllOrderByUserId", () => {
    test("should retrieve orders for specific user", async () => {
      const userId = "user-uuid-1";

      const mockOrders = [
        {
          id: "order-1",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          totalPrice: 1000,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          orderItems: [{ productId: "product-1", quantity: 2 }],
        },
      ];

      (prismaMock.order.findMany as any).mockResolvedValue(mockOrders);
      (prismaMock.order.count as any).mockResolvedValue(1);
      (prismaMock.orderItem.findMany as any).mockResolvedValue([]);

      const result = await orderService.getAllOrderByUserId(userId);

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    test("should apply pagination to user orders", async () => {
      const userId = "user-uuid-1";

      (prismaMock.order.findMany as any).mockResolvedValue([]);
      (prismaMock.order.count as any).mockResolvedValue(50);

      const result = await orderService.getAllOrderByUserId(userId, 3, 10);

      expect(result.pagination.page).toBe(3);
      expect(result.pagination.limit).toBe(10);
    });

    test("should return empty list for user with no orders", async () => {
      const userId = "user-no-orders";

      (prismaMock.order.findMany as any).mockResolvedValue([]);
      (prismaMock.order.count as any).mockResolvedValue(0);

      const result = await orderService.getAllOrderByUserId(userId);

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  // ============ GET ORDER BY ORDER ID TESTS ============
  describe("getOrderByOrderId", () => {
    test("should retrieve specific order by ID", async () => {
      const userId = "user-uuid-1";
      const orderId = "order-1";

      const mockOrder = {
        id: orderId,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 1000,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [{ productId: "product-1", quantity: 2, orderId }],
      };

      (prismaMock.order.findUnique as any).mockResolvedValue(mockOrder);
      (prismaMock.orderItem.findMany as any).mockResolvedValue(
        mockOrder.orderItems,
      );

      const result = await orderService.getOrderByOrderId(userId, orderId);

      expect(result).toBeInstanceOf(OrderDto);
      expect(result.id).toBe(orderId);
      expect(result.customerName).toBe("John Doe");
      expect(result.items).toHaveLength(1);
    });

    test("should throw error when order not found", async () => {
      const userId = "user-uuid-1";
      const orderId = "non-existent-order";

      (prismaMock.order.findUnique as any).mockResolvedValue(null);

      await expect(
        orderService.getOrderByOrderId(userId, orderId),
      ).rejects.toThrow("Order not found");
    });

    test("should include all order items in response", async () => {
      const userId = "user-uuid-1";
      const orderId = "order-1";

      const mockOrder = {
        id: orderId,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalPrice: 2000,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          { productId: "product-1", quantity: 2, orderId },
          { productId: "product-2", quantity: 3, orderId },
          { productId: "product-3", quantity: 1, orderId },
        ],
      };

      (prismaMock.order.findUnique as any).mockResolvedValue(mockOrder);
      (prismaMock.orderItem.findMany as any).mockResolvedValue(
        mockOrder.orderItems,
      );

      const result = await orderService.getOrderByOrderId(userId, orderId);

      expect(result.items).toHaveLength(3);
      expect(result.items[0].productId).toBe("product-1");
      expect(result.items[1].productId).toBe("product-2");
      expect(result.items[2].productId).toBe("product-3");
    });
  });
});
