import type { Category } from "@generated/prisma/client";

export type CreateCategoryRequest = {
  name: string;
};

export type UpdateCategoryRequest = {
  name: string;
};

export class CreateCategoryDto {
  public id: string;
  public name: string;
  public createdAt: Date;
  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.createdAt = category.createdAt;
  }
}

export class UpdateCategoryDto {
  public id: string;
  public name: string;
  public updatedAt: Date;
  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.updatedAt = category.updatedAt;
  }
}

export class SelectCategoryDto {
  public id: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
