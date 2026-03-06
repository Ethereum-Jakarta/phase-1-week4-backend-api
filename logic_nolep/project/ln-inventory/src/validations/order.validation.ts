import z from "zod";
import { ZodType } from "zod";

export class OrderValidation {
  public static readonly CREATE: ZodType = z.object({
    customerName: z.string().min(1),
    customerEmail: z.string().email(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1),
  });

  public static readonly UPDATE: ZodType = z.object({
    customerName: z.string().min(1).optional(),
    customerEmail: z.string().email().optional(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive(),
        }),
      )
      .optional(),
  });
}
