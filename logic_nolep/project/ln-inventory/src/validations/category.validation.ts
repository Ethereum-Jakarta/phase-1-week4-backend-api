import z from "zod";
import { ZodType } from "zod";

export class CategoryValidation {
  public static readonly CREATE: ZodType = z.object({
    name: z.string().min(1),
  });
  public static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1),
  });
}
