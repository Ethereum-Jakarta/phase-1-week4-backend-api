import * as z from "zod";
import { ZodType } from "zod";

export class categoryValidation {
  public static readonly CREATE_CATEGORY: ZodType = z.object({
    category_name: z.string().min(1).max(50),
    description: z.string().optional(),
  });
  public static readonly UPDATE_CATEGORY: ZodType = z.object({
    category_name: z.string().min(1).max(50),
    description: z.string().optional(),
  });
}
