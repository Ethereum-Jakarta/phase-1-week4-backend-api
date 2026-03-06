import * as z from "zod";
import { ZodType } from "zod";

export class UserValidation {
  public static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(50),
    phone: z.string().max(20).optional(),
    email: z.email().max(30).optional(),
  });
  public static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(50),
    phone: z.string().max(20).optional(),
    email: z.email().max(30).optional(),
  });
}
