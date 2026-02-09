import { prisma } from "../application/prisma";
import {
  type categoryRequest,
  toCategoryResponse,
} from "../models/category.model";
import { CategoryValidation } from "../validations/category.validation";
import { validate } from "../validations/validation";
import { ResponseError } from "../errors/response.error";

export class CategoryService {
  private static async checkIfUserExist(userId: number) {
    return await prisma.user.count({
      where: {
        id: userId,
      },
    });
  }
  public static async addCategory(userId: number, request: categoryRequest) {
    const createCategoryRequest = validate(
      CategoryValidation.CREATE_CATEGORY,
      request,
    );

    const isUserExist = await this.checkIfUserExist(userId);
    if (isUserExist === 0) {
      throw new ResponseError(404, "User not found");
    }

    const category = await prisma.category.create({
      data: {
        categoryName: createCategoryRequest.categoryName,
        description: createCategoryRequest.description ?? null,
        userId: userId,
      },
    });

    return toCategoryResponse(category);
  }
  public static async updateCategory(
    userId: number,
    categoryId: number,
    request: categoryRequest,
  ) {
    const updateCategoryRequest = validate(
      CategoryValidation.UPDATE_CATEGORY,
      request,
    );

    const isUserExist = await this.checkIfUserExist(userId);
    if (isUserExist === 0) {
      throw new ResponseError(404, "User not found");
    }

    const isCategoryExist = await prisma.category.count({
      where: {
        id: categoryId,
        userId: userId,
      },
    });

    if (isCategoryExist === 0) {
      throw new ResponseError(404, "Category not found");
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        categoryName: updateCategoryRequest.categoryName,
        description: updateCategoryRequest.description ?? null,
      },
    });

    return toCategoryResponse(category);
  }

  public static async getAllCategoriesByUserId(userId: number) {
    const isUserExist = await this.checkIfUserExist(userId);
    if (isUserExist === 0) {
      throw new ResponseError(404, "User not found");
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: userId,
      },
    });

    return categories.map(toCategoryResponse);
  }
}
