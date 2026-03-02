import type { PrismaClient } from "@generated/prisma/client";
import { ResponseError } from "@errors/response.error";
import {
  OrderDto,
  type CreateOrderRequest,
  type OrderItemResponse,
  type UpdateOrderRequest,
} from "@models/order.model";

export class OrderServices {
  constructor(private prisma: PrismaClient) {}

  public async createOrder(request: CreateOrderRequest, userId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const itemMap = new Map<string, number>();

      for (const item of request.items) {
        itemMap.set(
          item.productId,
          (itemMap.get(item.productId) || 0) + item.quantity,
        );
      }

      const normalizedItems = Array.from(itemMap.entries()).map(
        ([productId, quantity]) => ({
          productId,
          quantity,
        }),
      );

      const productIds = normalizedItems.map((i) => i.productId);

      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      if (products.length !== normalizedItems.length) {
        throw new ResponseError(404, "One or more products not found");
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      let total = 0;

      for (const item of normalizedItems) {
        const product = productMap.get(item.productId)!;

        const updated = await tx.product.updateMany({
          where: {
            id: product.id,
            quantityInStock: { gte: item.quantity },
          },
          data: {
            quantityInStock: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count === 0) {
          throw new ResponseError(
            400,
            `Stock not enough for product ${product.name}`,
          );
        }

        total += product.price * item.quantity;
      }

      const order = await tx.order.create({
        data: {
          customerName: request.customerName,
          customerEmail: request.customerEmail,
          totalPrice: total,
          userId,
        },
      });

      await tx.orderItem.createMany({
        data: normalizedItems.map((item) => {
          const product = productMap.get(item.productId)!;

          return {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            unitPrice: product.price,
          };
        }),
      });

      return new OrderDto(
        order,
        normalizedItems.map((item) => {
          const product = productMap.get(item.productId)!;

          return {
            productId: product.id,
            quantity: item.quantity,
            unitPrice: product.price,
          } as OrderItemResponse;
        }),
      );
    });
  }

  public async updateOrder(request: UpdateOrderRequest, userId: string) {
    return await this.prisma.$transaction(async (tx) => {
      // Get existing order
      const order = await tx.order.findUnique({
        where: { id: userId },
        include: { orderItems: true },
      });

      if (!order) {
        throw new ResponseError(404, "Order not found");
      }

      let totalPrice = order.totalPrice;

      // If items are provided, recalculate stock and total price
      if (request.items && request.items.length > 0) {
        const itemMap = new Map<string, number>();

        for (const item of request.items) {
          itemMap.set(
            item.productId,
            (itemMap.get(item.productId) || 0) + item.quantity,
          );
        }

        const normalizedItems = Array.from(itemMap.entries()).map(
          ([productId, quantity]) => ({
            productId,
            quantity,
          }),
        );

        const productIds = normalizedItems.map((i) => i.productId);

        const products = await tx.product.findMany({
          where: {
            id: { in: productIds },
          },
        });

        if (products.length !== normalizedItems.length) {
          throw new ResponseError(404, "One or more products not found");
        }

        // Restore previous stock quantities
        for (const oldItem of order.orderItems) {
          await tx.product.update({
            where: { id: oldItem.productId },
            data: {
              quantityInStock: {
                increment: oldItem.quantity,
              },
            },
          });
        }

        const productMap = new Map(products.map((p) => [p.id, p]));
        totalPrice = 0;

        // Validate and decrement new stock
        for (const item of normalizedItems) {
          const product = productMap.get(item.productId)!;

          const updated = await tx.product.updateMany({
            where: {
              id: product.id,
              quantityInStock: { gte: item.quantity },
            },
            data: {
              quantityInStock: {
                decrement: item.quantity,
              },
            },
          });

          if (updated.count === 0) {
            throw new ResponseError(
              400,
              `Stock not enough for product ${product.name}`,
            );
          }

          totalPrice += product.price * item.quantity;
        }

        // Delete old items and create new ones
        await tx.orderItem.deleteMany({
          where: { orderId: order.id },
        });

        await tx.orderItem.createMany({
          data: normalizedItems.map((item) => {
            const product = productMap.get(item.productId)!;

            return {
              orderId: order.id,
              productId: product.id,
              quantity: item.quantity,
              unitPrice: product.price,
            };
          }),
        });
      }

      // Update order
      const updatedOrder = await tx.order.update({
        where: { id: userId },
        data: {
          ...(request.customerName && { customerName: request.customerName }),
          ...(request.customerEmail && {
            customerEmail: request.customerEmail,
          }),
          totalPrice,
        },
      });

      const orderItems = await tx.orderItem.findMany({
        where: { orderId: updatedOrder.id },
      });

      return new OrderDto(
        updatedOrder,
        orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      );
    });
  }

  public async deleteOrder(userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: userId },
      include: { orderItems: true },
    });

    if (!order) {
      throw new ResponseError(404, "Order not found");
    }

    return await this.prisma.$transaction(async (tx) => {
      // Restore product quantities
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantityInStock: {
              increment: item.quantity,
            },
          },
        });
      }

      // Delete order items
      await tx.orderItem.deleteMany({
        where: { orderId: order.id },
      });

      // Delete order
      const deletedOrder = await tx.order.delete({
        where: { id: order.id },
      });

      return { id: deletedOrder.id, message: "Order deleted successfully" };
    });
  }

  public async getAllOrder(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: {
          orderItems: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.order.count(),
    ]);

    const data = await Promise.all(
      orders.map(async (order) => {
        const items = await this.prisma.orderItem.findMany({
          where: { orderId: order.id },
        });

        return new OrderDto(
          order,
          items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        );
      }),
    );

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getAllOrderByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          orderItems: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.order.count({
        where: { userId },
      }),
    ]);

    const data = await Promise.all(
      orders.map(async (order) => {
        const items = await this.prisma.orderItem.findMany({
          where: { orderId: order.id },
        });

        return new OrderDto(
          order,
          items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        );
      }),
    );

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getOrderByOrderId(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new ResponseError(404, "Order not found");
    }

    const items = await this.prisma.orderItem.findMany({
      where: { orderId: order.id },
    });

    return new OrderDto(
      order,
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    );
  }
}
