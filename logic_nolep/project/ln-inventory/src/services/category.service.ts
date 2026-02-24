import type { PrismaClient } from "@generated/prisma/client";
import {
  CreateCategoryDto,
  SelectCategoryDto,
  UpdateCategoryDto,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from "@models/category.model";

export class CategoryServices {
  constructor(private prisma: PrismaClient) {}
  public async createCategory(request: CreateCategoryRequest) {
    const category = await this.prisma.category.create({ data: request });
    return new CreateCategoryDto(category);
  }

  public async updateCategory(
    categoryId: string,
    request: UpdateCategoryRequest,
  ) {
    const category = await this.prisma.category.update({
      where: { id: categoryId },
      data: request,
    });
    return new UpdateCategoryDto(category);
  }

  public async deleteCategory(categoryId: string) {
    await this.prisma.category.delete({ where: { id: categoryId } });
  }

  public async getCategoryById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    return new SelectCategoryDto(category!);
  }

  public async getAllCategory(page: number = 1, limit: number = 20) {
    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),
      this.prisma.category.count(),
    ]);

    const data = categories.map((category) => new SelectCategoryDto(category));

    return {
      category: data,
      totalPage: total >= limit ? Math.round(total / limit) : 1,
    };
  }
}
