import type { Request, Response } from "express";
import { prisma } from "@applications/prisma";
import { CategoryServices } from "@services/category.service";

const Category = new CategoryServices(prisma);

export class CategoryController {
  public static async createCategory(req: Request, res: Response) {
    const data = await Category.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created sucessfully",
      data: data,
    });
  }
  public static async updateCategory(req: Request, res: Response) {
    const categoryId = req.params.categoryId as string;
    const data = await Category.updateCategory(categoryId, req.body);
    res.status(201).json({
      success: true,
      message: "Category updated sucessfully",
      data: data,
    });
  }
  public static async deleteCategory(req: Request, res: Response) {
    const categoryId = req.params.categoryId as string;
    await Category.deleteCategory(categoryId);
    res.status(200).json({
      success: true,
      message: "Delete category succesfully",
    });
  }
  public static async getCategoryById(req: Request, res: Response) {
    const categoryId = req.params.categoryId as string;
    const data = await Category.getCategoryById(categoryId);
    res.status(200).json({
      success: true,
      message: "Category updated sucessfully",
      data: data,
    });
  }
  public static async getAllCategory(req: Request, res: Response) {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const data = await Category.getAllCategory(page, limit);
    res.status(200).json({
      success: true,
      message: "Product retrieved",
      data: data.category,
      page: page,
      total_page: data.totalPage,
    });
  }
}
