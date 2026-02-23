import type { Product } from "@generated/prisma/client";

export type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  userId: string;
  categoryId?: string | null;
};

export type UpdateProductRequest = {
  name: string;
  description: string;
  price: number;
  quantityInStock: number;
  categoryId?: string | null;
};

export class CreateProductDto {
  public name: string;
  public description: string;
  public price: number;
  public quantity: number;
  public category?: string | null;
  public created_at: Date;
  constructor(product: Product) {
    ((this.name = product.name),
      (this.description = product.description),
      (this.price = product.price),
      (this.quantity = product.quantityInStock),
      (this.category = product.categoryId ?? null),
      (this.created_at = product.createdAt));
  }
}

export class UpdateProductDto {
  public name: string;
  public description: string;
  public price: number;
  public quantity: number;
  public category?: string | null;
  public update_at: Date;
  constructor(product: Product) {
    ((this.name = product.name),
      (this.description = product.description),
      (this.price = product.price),
      (this.quantity = product.quantityInStock),
      (this.category = product.categoryId ?? null),
      (this.update_at = product.updatedAt));
  }
}

export class SelectProductDto {
  public id: string;
  public name: string;
  public description: string;
  public price: number;
  public quantity: number;
  public category?: string | null;
  public created_at: Date;
  public update_at: Date;
  constructor(product: Product) {
    ((this.id = product.id),
      (this.name = product.name),
      (this.description = product.description),
      (this.price = product.price),
      (this.quantity = product.quantityInStock),
      (this.category = product.categoryId ?? null),
      (this.created_at = product.createdAt),
      (this.update_at = product.updatedAt));
  }
}
