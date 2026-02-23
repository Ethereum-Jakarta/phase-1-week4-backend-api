import { ProductService } from "../../src/services/product.service";
import { ProductController } from "../../src/controllers/product.controller";
import { prismaMock } from "../../src/config/mock";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import {
  CreateProductDto,
  UpdateProductDto,
  SelectProductDto,
} from "../../src/models/product.model";
import { ResponseError } from "../../src/errors/response.error";
import type { Request, Response } from "express";

// ============ PRODUCT SERVICE TESTS ============
describe("ProductService", () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService(prismaMock);
    jest.clearAllMocks();
  });

  // ============ CREATE PRODUCT TESTS ============
  describe("createProduct", () => {
    test("should successfully create a new product", async () => {
      const createRequest = {
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        quantityInStock: 10,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
      };

      const mockProduct = {
        id: "product-uuid-1",
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        quantityInStock: 10,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.create.mockResolvedValue(mockProduct);

      const result = await productService.createProduct(createRequest);

      expect(prismaMock.product.create).toHaveBeenCalledWith({
        data: {
          name: "Laptop",
          description: "High-performance laptop",
          price: 999.99,
          quantityInStock: 10,
          userId: "user-uuid-1",
          categoryId: "category-uuid-1",
        },
      });
      expect(result).toBeInstanceOf(CreateProductDto);
      expect(result.name).toBe("Laptop");
      expect(result.price).toBe(999.99);
    });

    test("should create product without categoryId", async () => {
      const createRequest = {
        name: "Mouse",
        description: "USB Mouse",
        price: 29.99,
        quantityInStock: 50,
        userId: "user-uuid-1",
      };

      const mockProduct = {
        id: "product-uuid-2",
        name: "Mouse",
        description: "USB Mouse",
        price: 29.99,
        quantityInStock: 50,
        userId: "user-uuid-1",
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.create.mockResolvedValue(mockProduct);

      const result = await productService.createProduct(createRequest);

      expect(prismaMock.product.create).toHaveBeenCalledWith({
        data: {
          name: "Mouse",
          description: "USB Mouse",
          price: 29.99,
          quantityInStock: 50,
          userId: "user-uuid-1",
          categoryId: null,
        },
      });
      expect(result.category).toBeNull();
    });

    test("should return CreateProductDto with correct structure", async () => {
      const createRequest = {
        name: "Keyboard",
        description: "Mechanical Keyboard",
        price: 149.99,
        quantityInStock: 25,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
      };

      const mockProduct = {
        id: "product-uuid-3",
        name: "Keyboard",
        description: "Mechanical Keyboard",
        price: 149.99,
        quantityInStock: 25,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
        createdAt: new Date("2026-02-23"),
        updatedAt: new Date("2026-02-23"),
      };

      prismaMock.product.create.mockResolvedValue(mockProduct);

      const result = await productService.createProduct(createRequest);

      expect(result.name).toBe("Keyboard");
      expect(result.description).toBe("Mechanical Keyboard");
      expect(result.price).toBe(149.99);
      expect(result.quantity).toBe(25);
      expect(result.category).toBe("category-uuid-1");
      expect(result.created_at).toBeDefined();
    });
  });

  // ============ UPDATE PRODUCT TESTS ============
  describe("updateProduct", () => {
    test("should successfully update a product", async () => {
      const userId = "user-uuid-1";
      const productId = "product-uuid-1";
      const updateRequest = {
        name: "Updated Laptop",
        description: "Updated description",
        price: 1099.99,
        quantityInStock: 15,
        categoryId: "category-uuid-2",
      };

      const mockUpdatedProduct = {
        id: "product-uuid-1",
        name: "Updated Laptop",
        description: "Updated description",
        price: 1099.99,
        quantityInStock: 15,
        userId: "user-uuid-1",
        categoryId: "category-uuid-2",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.update.mockResolvedValue(mockUpdatedProduct);

      const result = await productService.updateProduct(
        userId,
        productId,
        updateRequest,
      );

      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: {
          userId: userId,
          id: productId,
        },
        data: updateRequest,
      });
      expect(result).toBeInstanceOf(UpdateProductDto);
      expect(result.name).toBe("Updated Laptop");
      expect(result.price).toBe(1099.99);
    });

    test("should update only specific fields", async () => {
      const userId = "user-uuid-1";
      const productId = "product-uuid-1";
      const updateRequest = {
        price: 799.99,
      };

      const mockUpdatedProduct = {
        id: "product-uuid-1",
        name: "Laptop",
        description: "High-performance laptop",
        price: 799.99,
        quantityInStock: 10,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.update.mockResolvedValue(mockUpdatedProduct);

      const result = await productService.updateProduct(
        userId,
        productId,
        updateRequest,
      );

      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { userId, id: productId },
        data: updateRequest,
      });
      expect(result.price).toBe(799.99);
    });

    test("should throw error when product not found", async () => {
      const userId = "user-uuid-1";
      const productId = "non-existent-product";
      const updateRequest = {
        name: "Updated Product",
      };

      prismaMock.product.update.mockRejectedValue(
        new Error("Record not found"),
      );

      await expect(
        productService.updateProduct(userId, productId, updateRequest),
      ).rejects.toThrow("Record not found");
    });

    test("should return UpdateProductDto with update_at timestamp", async () => {
      const userId = "user-uuid-1";
      const productId = "product-uuid-1";
      const updateRequest = {
        name: "Updated Product",
      };

      const updateTime = new Date("2026-02-23T10:00:00Z");
      const mockUpdatedProduct = {
        id: "product-uuid-1",
        name: "Updated Product",
        description: "Description",
        price: 100,
        quantityInStock: 5,
        userId: "user-uuid-1",
        categoryId: null,
        createdAt: new Date(),
        updatedAt: updateTime,
      };

      prismaMock.product.update.mockResolvedValue(mockUpdatedProduct);

      const result = await productService.updateProduct(
        userId,
        productId,
        updateRequest,
      );

      expect(result.update_at).toEqual(updateTime);
    });
  });

  // ============ DELETE PRODUCT TESTS ============
  describe("deleteProduct", () => {
    test("should successfully delete a product", async () => {
      const userId = "user-uuid-1";
      const productId = "product-uuid-1";

      prismaMock.product.delete.mockResolvedValue({
        id: "product-uuid-1",
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        quantityInStock: 10,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        productService.deleteProduct(userId, productId),
      ).resolves.not.toThrow();

      expect(prismaMock.product.delete).toHaveBeenCalledWith({
        where: {
          userId: userId,
          id: productId,
        },
      });
    });

    test("should throw error when deleting non-existent product", async () => {
      const userId = "user-uuid-1";
      const productId = "non-existent-product";

      prismaMock.product.delete.mockRejectedValue(
        new Error("Record not found"),
      );

      await expect(
        productService.deleteProduct(userId, productId),
      ).rejects.toThrow("Record not found");
    });

    test("should require both userId and productId for deletion", async () => {
      const userId = "user-uuid-1";
      const productId = "product-uuid-1";

      prismaMock.product.delete.mockResolvedValue({
        id: productId,
        name: "Test",
        description: "Test",
        price: 100,
        quantityInStock: 5,
        userId,
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await productService.deleteProduct(userId, productId);

      expect(prismaMock.product.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: userId,
            id: productId,
          }),
        }),
      );
    });
  });

  // ============ GET PRODUCT BY ID TESTS ============
  describe("getProductByProductId", () => {
    test("should retrieve product by id and userId", async () => {
      const userId = "user-uuid-1";
      const productId = "product-uuid-1";

      const mockProduct = {
        id: "product-uuid-1",
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        quantityInStock: 10,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.findUnique.mockResolvedValue(mockProduct);

      const result = await productService.getProductByProductId(
        userId,
        productId,
      );

      expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
        where: {
          userId: userId,
          id: productId,
        },
      });
      expect(result).toBeInstanceOf(SelectProductDto);
      expect(result.id).toBe("product-uuid-1");
      expect(result.name).toBe("Laptop");
    });

    test("should return SelectProductDto with all fields", async () => {
      const userId = "user-uuid-1";
      const productId = "product-uuid-1";
      const createdDate = new Date("2026-02-20");
      const updatedDate = new Date("2026-02-23");

      const mockProduct = {
        id: "product-uuid-1",
        name: "Mouse",
        description: "USB Mouse",
        price: 29.99,
        quantityInStock: 50,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
        createdAt: createdDate,
        updatedAt: updatedDate,
      };

      prismaMock.product.findUnique.mockResolvedValue(mockProduct);

      const result = await productService.getProductByProductId(
        userId,
        productId,
      );

      expect(result.id).toBe("product-uuid-1");
      expect(result.name).toBe("Mouse");
      expect(result.description).toBe("USB Mouse");
      expect(result.price).toBe(29.99);
      expect(result.quantity).toBe(50);
      expect(result.category).toBe("category-uuid-1");
      expect(result.created_at).toEqual(createdDate);
      expect(result.update_at).toEqual(updatedDate);
    });

    test("should throw error when product not found", async () => {
      const userId = "user-uuid-1";
      const productId = "non-existent-product";

      prismaMock.product.findUnique.mockResolvedValue(null);

      await expect(
        productService.getProductByProductId(userId, productId),
      ).rejects.toThrow();
    });
  });

  // ============ GET ALL PRODUCTS TESTS ============
  describe("getAllProducts", () => {
    test("should retrieve all products with default pagination", async () => {
      const userId = "user-uuid-1";

      const mockProducts = [
        {
          id: "product-1",
          name: "Laptop",
          description: "Laptop desc",
          price: 999.99,
          quantityInStock: 10,
          userId: "user-uuid-1",
          categoryId: "category-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "product-2",
          name: "Mouse",
          description: "Mouse desc",
          price: 29.99,
          quantityInStock: 50,
          userId: "user-uuid-1",
          categoryId: "category-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);
      prismaMock.product.count.mockResolvedValue(2);

      const result = await productService.getAllProducts(userId);

      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
        },
        skip: 0,
        take: 20,
        orderBy: {
          id: "asc",
        },
      });
      expect(result.products).toHaveLength(2);
      expect(result.products[0]).toBeInstanceOf(SelectProductDto);
      expect(result.totalPage).toBe(1);
    });

    test("should apply custom pagination", async () => {
      const userId = "user-uuid-1";
      const page = 2;
      const limit = 10;

      prismaMock.product.findMany.mockResolvedValue([]);
      prismaMock.product.count.mockResolvedValue(25);

      const result = await productService.getAllProducts(userId, page, limit);

      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
        },
        skip: 10,
        take: 10,
        orderBy: {
          id: "asc",
        },
      });
      expect(result.totalPage).toBe(3);
    });

    test("should calculate correct total pages", async () => {
      const userId = "user-uuid-1";
      const mockProducts = Array(5)
        .fill(null)
        .map((_, i) => ({
          id: `product-${i}`,
          name: `Product ${i}`,
          description: "Desc",
          price: 100,
          quantityInStock: 10,
          userId: "user-uuid-1",
          categoryId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

      prismaMock.product.findMany.mockResolvedValue(mockProducts);
      prismaMock.product.count.mockResolvedValue(5);

      const result = await productService.getAllProducts(userId, 1, 20);

      expect(result.totalPage).toBe(1);
    });

    test("should handle empty products list", async () => {
      const userId = "user-uuid-1";

      prismaMock.product.findMany.mockResolvedValue([]);
      prismaMock.product.count.mockResolvedValue(0);

      const result = await productService.getAllProducts(userId);

      expect(result.products).toHaveLength(0);
      expect(result.totalPage).toBe(1);
    });

    test("should return products ordered by id ascending", async () => {
      const userId = "user-uuid-1";

      const mockProducts = [
        {
          id: "product-1",
          name: "First",
          description: "Desc",
          price: 100,
          quantityInStock: 10,
          userId,
          categoryId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "product-2",
          name: "Second",
          description: "Desc",
          price: 100,
          quantityInStock: 10,
          userId,
          categoryId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);
      prismaMock.product.count.mockResolvedValue(2);

      await productService.getAllProducts(userId);

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            id: "asc",
          },
        }),
      );
    });
  });

  // ============ GET ALL PRODUCTS BY USER ID TESTS ============
  describe("getAllProductsByUserId", () => {
    test("should retrieve all products for a specific user with user info", async () => {
      const userId = "user-uuid-1";

      const mockProducts = [
        {
          id: "product-1",
          name: "Laptop",
          description: "Laptop desc",
          price: 999.99,
          quantityInStock: 10,
          userId: "user-uuid-1",
          categoryId: "category-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockUser = {
        id: "user-uuid-1",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.findMany.mockResolvedValue(mockProducts);
      prismaMock.product.count.mockResolvedValue(1);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await productService.getAllProductsByUserId(userId);

      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          userId: userId,
        },
        skip: 0,
        take: 20,
        orderBy: {
          id: "asc",
        },
      });
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result.products).toHaveLength(1);
      expect(result.user).toEqual({ id: "user-uuid-1", name: "John Doe" });
      expect(result.totalPage).toBe(1);
    });

    test("should apply custom pagination for user products", async () => {
      const userId = "user-uuid-1";
      const page = 2;
      const limit = 5;

      prismaMock.product.findMany.mockResolvedValue([]);
      prismaMock.product.count.mockResolvedValue(15);
      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        name: "Test User",
        email: "test@example.com",
        password: "hash",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await productService.getAllProductsByUserId(
        userId,
        page,
        limit,
      );

      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 5,
        take: 5,
        orderBy: { id: "asc" },
      });
      expect(result.totalPage).toBe(3);
    });

    test("should return user with only id and name", async () => {
      const userId = "user-uuid-1";

      prismaMock.product.findMany.mockResolvedValue([]);
      prismaMock.product.count.mockResolvedValue(0);
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-uuid-1",
        name: "Jane Doe",
        email: "jane@example.com",
        password: "hashedPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await productService.getAllProductsByUserId(userId);

      expect(result.user).toHaveProperty("id");
      expect(result.user).toHaveProperty("name");
      expect(result.user).not.toHaveProperty("email");
      expect(result.user).not.toHaveProperty("password");
    });

    test("should handle user not found", async () => {
      const userId = "non-existent-user";

      prismaMock.product.findMany.mockResolvedValue([]);
      prismaMock.product.count.mockResolvedValue(0);
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await productService.getAllProductsByUserId(userId);

      expect(result.user).toEqual({ id: undefined, name: undefined });
    });
  });
});

// ============ PRODUCT CONTROLLER TESTS ============
describe("ProductController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { id: "user-uuid-1" },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  // ============ CREATE PRODUCT CONTROLLER TESTS ============
  describe("createProduct", () => {
    test("should successfully create product and return 201 status", async () => {
      const productData = {
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        quantityInStock: 10,
        userId: "user-uuid-1",
        categoryId: "category-uuid-1",
      };

      mockRequest.body = productData;

      const mockProductDto = {
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        quantity: 10,
        category: "category-uuid-1",
        created_at: new Date(),
      };

      jest
        .spyOn(ProductService.prototype, "createProduct")
        .mockResolvedValue(mockProductDto as any);

      await ProductController.createProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Product created",
        data: mockProductDto,
      });
    });

    test("should pass request body to service", async () => {
      const productData = {
        name: "New Product",
        description: "New Description",
        price: 49.99,
        quantityInStock: 5,
        userId: "user-uuid-1",
      };

      mockRequest.body = productData;

      const createProductSpy = jest
        .spyOn(ProductService.prototype, "createProduct")
        .mockResolvedValue({} as any);

      await ProductController.createProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(createProductSpy).toHaveBeenCalledWith(productData);
    });
  });

  // ============ UPDATE PRODUCT CONTROLLER TESTS ============
  describe("updateProduct", () => {
    test("should successfully update product and return 201 status", async () => {
      const productId = "product-uuid-1";
      const updateData = {
        name: "Updated Product",
        price: 149.99,
      };

      mockRequest.params = { productId };
      mockRequest.body = updateData;

      const mockUpdatedDto = {
        name: "Updated Product",
        price: 149.99,
        quantity: 10,
        update_at: new Date(),
      };

      const updateProductSpy = jest
        .spyOn(ProductService.prototype, "updateProduct")
        .mockResolvedValue(mockUpdatedDto as any);

      await ProductController.updateProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(updateProductSpy).toHaveBeenCalledWith(
        "user-uuid-1",
        productId,
        updateData,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Product updated",
        data: mockUpdatedDto,
      });
    });

    test("should use userId from request.user", async () => {
      mockRequest.user = { id: "specific-user-id" };
      mockRequest.params = { productId: "product-id" };
      mockRequest.body = { name: "Updated" };

      const updateProductSpy = jest
        .spyOn(ProductService.prototype, "updateProduct")
        .mockResolvedValue({} as any);

      await ProductController.updateProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(updateProductSpy).toHaveBeenCalledWith(
        "specific-user-id",
        "product-id",
        { name: "Updated" },
      );
    });
  });

  // ============ DELETE PRODUCT CONTROLLER TESTS ============
  describe("deleteProduct", () => {
    test("should successfully delete product and return 200 status", async () => {
      const productId = "product-uuid-1";
      mockRequest.params = { productId };

      const deleteProductSpy = jest
        .spyOn(ProductService.prototype, "deleteProduct")
        .mockResolvedValue(undefined as any);

      await ProductController.deleteProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(deleteProductSpy).toHaveBeenCalledWith("user-uuid-1", productId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Product deleted",
      });
    });

    test("should use userId from request.user for deletion", async () => {
      mockRequest.user = { id: "another-user-id" };
      mockRequest.params = { productId: "product-123" };

      const deleteProductSpy = jest
        .spyOn(ProductService.prototype, "deleteProduct")
        .mockResolvedValue(undefined as any);

      await ProductController.deleteProduct(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(deleteProductSpy).toHaveBeenCalledWith(
        "another-user-id",
        "product-123",
      );
    });
  });

  // ============ GET PRODUCT BY ID CONTROLLER TESTS ============
  describe("getProductByProductId", () => {
    test("should successfully retrieve product by id", async () => {
      const productId = "product-uuid-1";
      mockRequest.params = { productId };

      const mockProductDto = {
        id: productId,
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        quantity: 10,
        category: "category-uuid-1",
        created_at: new Date(),
        update_at: new Date(),
      };

      const getProductSpy = jest
        .spyOn(ProductService.prototype, "getProductByProductId")
        .mockResolvedValue(mockProductDto as any);

      await ProductController.getProductByProductId(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(getProductSpy).toHaveBeenCalledWith("user-uuid-1", productId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Product retrieved",
        data: mockProductDto,
      });
    });
  });

  // ============ GET ALL PRODUCTS CONTROLLER TESTS ============
  describe("getAllProducts", () => {
    test("should successfully retrieve all products with pagination", async () => {
      mockRequest.query = { page: "1", limit: "20" };

      const mockProductDtos = [
        {
          id: "product-1",
          name: "Product 1",
          quantity: 10,
        },
        {
          id: "product-2",
          name: "Product 2",
          quantity: 5,
        },
      ];

      const getAllProductsSpy = jest
        .spyOn(ProductService.prototype, "getAllProducts")
        .mockResolvedValue({
          products: mockProductDtos,
          totalPage: 1,
        } as any);

      await ProductController.getAllProducts(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(getAllProductsSpy).toHaveBeenCalledWith("user-uuid-1", 1, 20);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Product retrieved",
        data: mockProductDtos,
        page: 1,
        total_page: 1,
      });
    });

    test("should use pagination parameters from query", async () => {
      mockRequest.query = { page: "2", limit: "10" };

      const getAllProductsSpy = jest
        .spyOn(ProductService.prototype, "getAllProducts")
        .mockResolvedValue({ products: [], totalPage: 5 } as any);

      await ProductController.getAllProducts(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(getAllProductsSpy).toHaveBeenCalledWith("user-uuid-1", 2, 10);
    });
  });

  // ============ GET ALL PRODUCTS BY USER ID CONTROLLER TESTS ============
  describe("getAllProductsByUserId", () => {
    test("should successfully retrieve all products for a specific user", async () => {
      const userId = "target-user-uuid-1";
      mockRequest.params = { userId };
      mockRequest.query = { page: "1", limit: "20" };

      const mockResponse_ = {
        user: { id: userId, name: "Target User" },
        products: [
          {
            id: "product-1",
            name: "Product 1",
            quantity: 10,
          },
        ],
        totalPage: 1,
      };

      const getAllProductsByUserSpy = jest
        .spyOn(ProductService.prototype, "getAllProductsByUserId")
        .mockResolvedValue(mockResponse_ as any);

      await ProductController.getAllProductsByUserId(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(getAllProductsByUserSpy).toHaveBeenCalledWith(userId, 1, 20);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Product retrieved",
        user: mockResponse_.user,
        data: mockResponse_.products,
        page: 1,
        total_page: 1,
      });
    });

    test("should use userId from params, not from request.user", async () => {
      const targetUserId = "different-user-id";
      mockRequest.user = { id: "current-user-id" };
      mockRequest.params = { userId: targetUserId };
      mockRequest.query = { page: "1", limit: "20" };

      const getAllProductsByUserSpy = jest
        .spyOn(ProductService.prototype, "getAllProductsByUserId")
        .mockResolvedValue({ products: [], user: {}, totalPage: 1 } as any);

      await ProductController.getAllProductsByUserId(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(getAllProductsByUserSpy).toHaveBeenCalledWith(targetUserId, 1, 20);
    });
  });
});
