import type { Category } from "../../generated/prisma/client";

export type categoryRequest = {
  category_name: string;
  description: string;
};

export type categoryResponse = {
  id: number;
  category_name: string;
  description: string | null;
};

export function toCategoryResponse(category: Category): categoryResponse {
  return {
    id: category.categoryId,
    category_name: category.categoryName,
    description: category.description,
  };
}
