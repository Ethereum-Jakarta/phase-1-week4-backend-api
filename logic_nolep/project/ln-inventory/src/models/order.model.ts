import { Prisma } from "@generated/prisma/client";

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderRequest = {
  customerName: string;
  customerEmail: string;
  items: OrderItemInput[];
};

export type UpdateOrderRequest = {
  customerName?: string;
  customerEmail?: string;
  items?: OrderItemInput[]; // full replace if provided
};

export type OrderItemResponse = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type OrderDetail = Prisma.OrderGetPayload<{
  select: {
    id: true;
    customerName: true;
    customerEmail: true;
    totalPrice: true;
    createdAt: true;
    updatedAt: true;
    userId: true;
  };
}>;

export class OrderDto {
  public id: string;
  public customerName: string;
  public customerEmail: string;
  public totalPrice: number;
  public createdAt: Date;
  public updatedAt: Date;
  public items: OrderItemResponse[];

  constructor(order: OrderDetail, items: OrderItemResponse[]) {
    this.id = order.id;
    this.customerName = order.customerName;
    this.customerEmail = order.customerEmail;
    this.totalPrice = order.totalPrice;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
    this.items = items;
  }
}
