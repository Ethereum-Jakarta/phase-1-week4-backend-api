import type { Request, Response } from "express";
import { prisma } from "@applications/prisma";
import { ProductService } from "@services/product.service";

const Product = new ProductService(prisma);

export class ProductController {
  public static async createProduct(req: Request, res: Response) {
    const { id } = req.user!;
    const data = await Product.createProduct(id, req.body);
    res.status(201).json({
      success: true,
      message: "Product created",
      data: data,
    });
  }
  public static async updateProduct(req: Request, res: Response) {
    const userId = req.user?.id;
    const productId = req.params.productId as string;
    const data = await Product.updateProduct(userId!, productId!, req.body);
    res.status(201).json({
      success: true,
      message: "Product updated",
      data: data,
    });
  }
  public static async deleteProduct(req: Request, res: Response) {
    const userId = req.user?.id;
    const productId = req.params.productId as string;
    await Product.deleteProduct(userId!, productId);
    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  }
  public static async getProductByProductId(req: Request, res: Response) {
    const userId = req.user?.id;
    const productId = req.params.productId as string;
    const data = await Product.getProductByProductId(userId!, productId);
    res.status(200).json({
      success: true,
      message: "Product retrieved",
      data: data,
    });
  }
  public static async getAllProducts(req: Request, res: Response) {
    const userId = req.user?.id;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const data = await Product.getAllProducts(userId!, page, limit);
    res.status(200).json({
      success: true,
      message: "Product retrieved",
      data: data.products,
      page: page,
      total_page: data.totalPage,
    });
  }
  public static async getAllProductsByUserId(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const data = await Product.getAllProductsByUserId(userId!, page, limit);
    res.status(200).json({
      success: true,
      message: "Product retrieved",
      user: data.user,
      data: data.products,
      page: page,
      total_page: data.totalPage,
    });
  }
}
