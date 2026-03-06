import type { Request, Response } from "express";
import { prisma } from "@applications/prisma";
import { OrderServices } from "@services/order.service";

const Order = new OrderServices(prisma);

export class OrderController {
  public static async createOrder(req: Request, res: Response) {
    const { id } = req.user!;
    const data = await Order.createOrder(req.body, id);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: data,
    });
  }

  public static async updateOrder(req: Request, res: Response) {
    const orderId = req.params.orderId as string;
    const { id } = req.user!;
    const data = await Order.updateOrder(req.body, orderId);
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: data,
    });
  }

  public static async deleteOrder(req: Request, res: Response) {
    const orderId = req.params.orderId as string;
    const data = await Order.deleteOrder(orderId);
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: data,
    });
  }

  public static async getAllOrder(req: Request, res: Response) {
    const { id } = req.user!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const data = await Order.getAllOrder(id, page, limit);
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: data.data,
      pagination: data.pagination,
    });
  }

  public static async getAllOrderByUserId(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const data = await Order.getAllOrderByUserId(userId, page, limit);
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: data.data,
      pagination: data.pagination,
    });
  }

  public static async getOrderByOrderId(req: Request, res: Response) {
    const orderId = req.params.orderId as string;
    const { id } = req.user!;
    const data = await Order.getOrderByOrderId(id, orderId);
    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: data,
    });
  }
}
