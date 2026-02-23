import z from "zod";
import { ZodType } from "zod";

export class ProductValidation {
  public static readonly CREATE: ZodType = z.object({
    name: z.string(),
    description: z.string(),
    price: z.float64(),
    quantityInStock: z.number(),
    userId: z.uuid(),
    categoryId: z.uuid(),
  });
  public static readonly UPDATE: ZodType = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.float64().optional(),
    quantityInStock: z.number().optional(),
    categoryId: z.uuid().optional(),
  });
}
