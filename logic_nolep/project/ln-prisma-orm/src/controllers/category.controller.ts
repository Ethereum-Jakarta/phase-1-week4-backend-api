import type { Request, Response, NextFunction } from "express";
import type { categoryRequest } from "../models/category.model";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  public static async createCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const createCategoryRequest = req.body as categoryRequest;
      const userId = Number(req.params.userId);
      const response = await CategoryService.addCategory(
        userId,
        createCategoryRequest,
      );
      res.status(201).json({
        succes: true,
        message: "Berhasil menambahkan kategori",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const updateCategoryRequest = req.body as categoryRequest;
      const userId = Number(req.params.userId);
      const categoryId = Number(req.params.categoryId);
      const response = await CategoryService.updateCategory(
        userId,
        categoryId,
        updateCategoryRequest,
      );
      res.status(201).json({
        succes: true,
        message: "Berhasil memperbarui kategori",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
  public static async findAllCategoriesByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.userId);
      const response = await CategoryService.getAllCategoriesByUserId(userId);
      res.status(200).json({
        succes: true,
        message: "Berhasil mendapatkan semua kategori",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}
