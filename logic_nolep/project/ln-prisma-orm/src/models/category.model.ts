import type { Category } from "../../generated/prisma/client";

export type categoryRequest = {
  categoryName: string;
  description: string;
};

export type categoryResponse = {
  id: number;
  categoryName: string;
  description: string | null;
};

export function toCategoryResponse(category: Category): categoryResponse {
  return {
    id: category.id,
    categoryName: category.categoryName,
    description: category.description,
  };
}
