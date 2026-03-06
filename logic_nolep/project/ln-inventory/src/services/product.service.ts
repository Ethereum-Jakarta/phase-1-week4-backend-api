import type { PrismaClient } from "@generated/prisma/client";
import {
  CreateProductDto,
  SelectProductDto,
  UpdateProductDto,
  type CreateProductRequest,
  type UpdateProductRequest,
} from "@models/product.model";

export class ProductService {
  constructor(private prisma: PrismaClient) {}

  public async createProduct(userId: string, request: CreateProductRequest) {
    const product = await this.prisma.product.create({
      data: {
        name: request.name,
        description: request.description,
        price: request.price,
        quantityInStock: request.quantityInStock,
        userId: request.userId,
        categoryId: request.categoryId ?? null,
      },
    });
    return new CreateProductDto(product);
  }

  public async updateProduct(
    userId: string,
    productId: string,
    request: UpdateProductRequest,
  ) {
    const product = await this.prisma.product.update({
      where: {
        userId: userId,
        id: productId,
      },
      data: request,
    });
    return new UpdateProductDto(product);
  }

  public async deleteProduct(userId: string, productId: string) {
    await this.prisma.product.delete({
      where: {
        userId: userId,
        id: productId,
      },
    });
  }

  public async getAllProducts(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          userId: userId,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: "asc",
        },
      }),
      this.prisma.product.count({ where: { userId: userId } }),
    ]);
    const data = products.map((product) => new SelectProductDto(product));
    return {
      products: data,
      totalPage: total >= limit ? Math.round(total / limit) : 1,
    };
  }
  public async getAllProductsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const [products, total, user] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          userId: userId,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: "asc",
        },
      }),
      this.prisma.product.count({ where: { userId: userId } }),
      this.prisma.user.findUnique({
        where: { id: userId },
      }),
    ]);
    const data = products.map((product) => new SelectProductDto(product));
    return {
      products: data,
      totalPage: total >= limit ? Math.round(total / limit) : 1,
      user: { id: user?.id, name: user?.name },
    };
  }

  public async getProductByProductId(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        userId: userId,
        id: productId,
      },
    });
    return new SelectProductDto(product!);
  }
}
