import z from "zod";
import { ZodType } from "zod";

export class ProductValidation {
  public static readonly CREATE: ZodType = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.float64(),
    quantityInStock: z.number(),
    userId: z.uuid(),
    categoryId: z.uuid(),
  });
  public static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.float64().optional(),
    quantityInStock: z.number().optional(),
    categoryId: z.uuid().optional(),
  });
}
