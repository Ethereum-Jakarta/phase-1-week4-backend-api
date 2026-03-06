import { CategoryServices } from "../../src/services/category.service";
import { prismaMock } from "../../src/config/mock";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  SelectCategoryDto,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from "../../src/models/category.model";

// ============ CATEGORY SERVICE TESTS ============
describe("CategoryServices", () => {
  let categoryService: CategoryServices;

  beforeEach(() => {
    categoryService = new CategoryServices(prismaMock);
    jest.clearAllMocks();
  });

  // ============ CREATE CATEGORY TESTS ============
  describe("createCategory", () => {
    test("should successfully create a new category", async () => {
      const createRequest: CreateCategoryRequest = {
        name: "Electronics",
      };

      const mockCategory = {
        id: "category-1",
        name: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.create.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory(createRequest);

      expect(result).toBeInstanceOf(CreateCategoryDto);
      expect(result.id).toBe("category-1");
      expect(result.name).toBe("Electronics");
      expect(result.createdAt).toBeDefined();
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: createRequest,
      });
    });

    test("should create category with different names", async () => {
      const categoryNames = ["Furniture", "Clothing", "Books"];

      for (const name of categoryNames) {
        const mockCategory = {
          id: `category-${name}`,
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prismaMock.category.create.mockResolvedValue(mockCategory);

        const result = await categoryService.createCategory({ name });

        expect(result.name).toBe(name);
      }
    });

    test("should handle empty category name gracefully", async () => {
      const createRequest: CreateCategoryRequest = {
        name: "",
      };

      const mockCategory = {
        id: "category-empty",
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.create.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory(createRequest);

      expect(result.name).toBe("");
    });

    test("should return CreateCategoryDto with correct structure", async () => {
      const createRequest: CreateCategoryRequest = {
        name: "Sports Equipment",
      };

      const createdAt = new Date("2026-02-23");
      const mockCategory = {
        id: "category-sports",
        name: "Sports Equipment",
        createdAt,
        updatedAt: createdAt,
      };

      prismaMock.category.create.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory(createRequest);

      expect(result.id).toBeDefined();
      expect(result.name).toBe("Sports Equipment");
      expect(result.createdAt).toEqual(createdAt);
    });

    test("should throw error when database operation fails", async () => {
      const createRequest: CreateCategoryRequest = {
        name: "Test Category",
      };

      prismaMock.category.create.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(
        categoryService.createCategory(createRequest),
      ).rejects.toThrow("Database connection failed");
    });
  });

  // ============ UPDATE CATEGORY TESTS ============
  describe("updateCategory", () => {
    test("should successfully update category name", async () => {
      const categoryId = "category-1";
      const updateRequest: UpdateCategoryRequest = {
        name: "Updated Electronics",
      };

      const mockUpdatedCategory = {
        id: categoryId,
        name: "Updated Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.update.mockResolvedValue(mockUpdatedCategory);

      const result = await categoryService.updateCategory(
        categoryId,
        updateRequest,
      );

      expect(result).toBeInstanceOf(UpdateCategoryDto);
      expect(result.id).toBe(categoryId);
      expect(result.name).toBe("Updated Electronics");
      expect(result.updatedAt).toBeDefined();
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: updateRequest,
      });
    });

    test("should update category with special characters", async () => {
      const categoryId = "category-1";
      const updateRequest: UpdateCategoryRequest = {
        name: "Sports & Outdoors",
      };

      const mockUpdatedCategory = {
        id: categoryId,
        name: "Sports & Outdoors",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.update.mockResolvedValue(mockUpdatedCategory);

      const result = await categoryService.updateCategory(
        categoryId,
        updateRequest,
      );

      expect(result.name).toBe("Sports & Outdoors");
    });

    test("should throw error when category not found", async () => {
      const categoryId = "non-existent-category";
      const updateRequest: UpdateCategoryRequest = {
        name: "Updated Name",
      };

      prismaMock.category.update.mockRejectedValue(
        new Error("Record not found"),
      );

      await expect(
        categoryService.updateCategory(categoryId, updateRequest),
      ).rejects.toThrow("Record not found");
    });

    test("should preserve id and update only name", async () => {
      const categoryId = "category-1";
      const updateRequest: UpdateCategoryRequest = {
        name: "New Name",
      };

      const mockUpdatedCategory = {
        id: categoryId,
        name: "New Name",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-02-23"),
      };

      prismaMock.category.update.mockResolvedValue(mockUpdatedCategory);

      const result = await categoryService.updateCategory(
        categoryId,
        updateRequest,
      );

      expect(result.id).toBe(categoryId);
      expect(result.name).toBe("New Name");
    });

    test("should update category with empty name", async () => {
      const categoryId = "category-1";
      const updateRequest: UpdateCategoryRequest = {
        name: "",
      };

      const mockUpdatedCategory = {
        id: categoryId,
        name: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.update.mockResolvedValue(mockUpdatedCategory);

      const result = await categoryService.updateCategory(
        categoryId,
        updateRequest,
      );

      expect(result.name).toBe("");
    });
  });

  // ============ DELETE CATEGORY TESTS ============
  describe("deleteCategory", () => {
    test("should successfully delete a category", async () => {
      const categoryId = "category-1";

      prismaMock.category.delete.mockResolvedValue({
        id: categoryId,
        name: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        categoryService.deleteCategory(categoryId),
      ).resolves.not.toThrow();

      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    test("should throw error when category not found", async () => {
      const categoryId = "non-existent-category";

      prismaMock.category.delete.mockRejectedValue(
        new Error("Record not found"),
      );

      await expect(categoryService.deleteCategory(categoryId)).rejects.toThrow(
        "Record not found",
      );
    });

    test("should handle multiple category deletions", async () => {
      const categoryIds = ["category-1", "category-2", "category-3"];

      prismaMock.category.delete.mockResolvedValue({
        id: "",
        name: "Deleted Category",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      for (const id of categoryIds) {
        await expect(categoryService.deleteCategory(id)).resolves.not.toThrow();
      }

      expect(prismaMock.category.delete).toHaveBeenCalledTimes(3);
    });

    test("should verify delete is called with correct ID", async () => {
      const categoryId = "category-special-id";

      prismaMock.category.delete.mockResolvedValue({
        id: categoryId,
        name: "Test",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await categoryService.deleteCategory(categoryId);

      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });
  });

  // ============ GET CATEGORY BY ID TESTS ============
  describe("getCategoryById", () => {
    test("should retrieve a category by ID", async () => {
      const categoryId = "category-1";

      const mockCategory = {
        id: categoryId,
        name: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.findUnique.mockResolvedValue(mockCategory);

      const result = await categoryService.getCategoryById(categoryId);

      expect(result).toBeInstanceOf(SelectCategoryDto);
      expect(result.id).toBe(categoryId);
      expect(result.name).toBe("Electronics");
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    test("should return SelectCategoryDto with all fields", async () => {
      const categoryId = "category-1";
      const createdAt = new Date("2026-01-01");
      const updatedAt = new Date("2026-02-23");

      const mockCategory = {
        id: categoryId,
        name: "Books",
        createdAt,
        updatedAt,
      };

      prismaMock.category.findUnique.mockResolvedValue(mockCategory);

      const result = await categoryService.getCategoryById(categoryId);

      expect(result.id).toBe(categoryId);
      expect(result.name).toBe("Books");
      expect(result.createdAt).toEqual(createdAt);
      expect(result.updatedAt).toEqual(updatedAt);
    });

    test("should use non-null assertion for category", async () => {
      const categoryId = "category-1";

      const mockCategory = {
        id: categoryId,
        name: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.findUnique.mockResolvedValue(mockCategory);

      const result = await categoryService.getCategoryById(categoryId);

      expect(result).toBeInstanceOf(SelectCategoryDto);
      expect(result.id).toBe(categoryId);
    });

    test("should retrieve category with same ID multiple times", async () => {
      const categoryId = "category-1";

      const mockCategory = {
        id: categoryId,
        name: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.category.findUnique.mockResolvedValue(mockCategory);

      const result1 = await categoryService.getCategoryById(categoryId);
      const result2 = await categoryService.getCategoryById(categoryId);

      expect(result1.id).toBe(result2.id);
      expect(prismaMock.category.findUnique).toHaveBeenCalledTimes(2);
    });

    test("should retrieve different categories by different IDs", async () => {
      const categories = [
        {
          id: "category-1",
          name: "Electronics",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "category-2",
          name: "Clothing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (const category of categories) {
        prismaMock.category.findUnique.mockResolvedValueOnce(category);
        const result = await categoryService.getCategoryById(category.id);
        expect(result.name).toBe(category.name);
      }
    });
  });

  // ============ GET ALL CATEGORIES TESTS ============
  describe("getAllCategory", () => {
    test("should retrieve all categories with default pagination", async () => {
      const mockCategories = [
        {
          id: "category-1",
          name: "Electronics",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "category-2",
          name: "Clothing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "category-3",
          name: "Books",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.category.findMany.mockResolvedValue(mockCategories);
      prismaMock.category.count.mockResolvedValue(3);

      const result = await categoryService.getAllCategory();

      expect(result.category).toHaveLength(3);
      expect(Array.isArray(result.category)).toBe(true);
      expect(result.category[0]).toBeInstanceOf(SelectCategoryDto);
      expect(result.totalPage).toBe(1);
      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        orderBy: { name: "asc" },
      });
    });

    test("should apply custom pagination", async () => {
      const mockCategories = [
        {
          id: "category-1",
          name: "Electronics",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "category-2",
          name: "Clothing",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.category.findMany.mockResolvedValue(mockCategories);
      prismaMock.category.count.mockResolvedValue(100);

      const result = await categoryService.getAllCategory(2, 10);

      expect(result.category).toHaveLength(2);
      expect(result.totalPage).toBe(10);
      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        orderBy: { name: "asc" },
      });
    });

    test("should sort categories alphabetically by name", async () => {
      const mockCategories = [
        {
          id: "category-2",
          name: "Books",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "category-1",
          name: "Electronics",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "category-3",
          name: "Furniture",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.category.findMany.mockResolvedValue(mockCategories);
      prismaMock.category.count.mockResolvedValue(3);

      await categoryService.getAllCategory();

      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        orderBy: { name: "asc" },
      });
    });

    test("should handle paginated results correctly", async () => {
      const mockCategories = Array.from({ length: 20 }, (_, i) => ({
        id: `category-${i + 1}`,
        name: `Category ${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      prismaMock.category.findMany.mockResolvedValue(mockCategories);
      prismaMock.category.count.mockResolvedValue(50);

      const result = await categoryService.getAllCategory(1, 20);

      expect(result.category).toHaveLength(20);
      expect(result.totalPage).toBe(3); // Math.round(50 / 20) = 3
    });

    test("should return empty list when no categories exist", async () => {
      prismaMock.category.findMany.mockResolvedValue([]);
      prismaMock.category.count.mockResolvedValue(0);

      const result = await categoryService.getAllCategory();

      expect(result.category).toHaveLength(0);
      expect(result.totalPage).toBe(1);
    });

    test("should calculate total pages correctly", async () => {
      const testCases = [
        { total: 20, limit: 20, expected: 1 },
        { total: 25, limit: 20, expected: 2 },
        { total: 100, limit: 10, expected: 10 },
        { total: 150, limit: 20, expected: 8 }, // Math.round(150 / 20) = 8
        { total: 5, limit: 20, expected: 1 },
      ];

      for (const testCase of testCases) {
        prismaMock.category.findMany.mockResolvedValue([]);
        prismaMock.category.count.mockResolvedValue(testCase.total);

        const result = await categoryService.getAllCategory(1, testCase.limit);

        expect(result.totalPage).toBe(testCase.expected);
      }
    });

    test("should skip correct number of records", async () => {
      prismaMock.category.findMany.mockResolvedValue([]);
      prismaMock.category.count.mockResolvedValue(100);

      await categoryService.getAllCategory(3, 15);

      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        skip: 30, // (3 - 1) * 15 = 30
        take: 15,
        orderBy: { name: "asc" },
      });
    });

    test("should return SelectCategoryDto instances", async () => {
      const mockCategories = [
        {
          id: "category-1",
          name: "Electronics",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.category.findMany.mockResolvedValue(mockCategories);
      prismaMock.category.count.mockResolvedValue(1);

      const result = await categoryService.getAllCategory();

      expect(result.category[0]).toBeInstanceOf(SelectCategoryDto);
      expect(result.category[0].id).toBe("category-1");
      expect(result.category[0].name).toBe("Electronics");
    });

    test("should handle large pagination values", async () => {
      prismaMock.category.findMany.mockResolvedValue([]);
      prismaMock.category.count.mockResolvedValue(1000);

      const result = await categoryService.getAllCategory(10, 50);

      expect(result.totalPage).toBe(20); // Math.round(1000 / 50) = 20
      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        skip: 450, // (10 - 1) * 50 = 450
        take: 50,
        orderBy: { name: "asc" },
      });
    });
  });
});
