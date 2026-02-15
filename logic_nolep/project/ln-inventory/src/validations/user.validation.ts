import z from "zod";
import { ZodType } from "zod";

export class UserValidation {
  public static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().length(8),
  });
  public static readonly LOGIN: ZodType = z.object({
    email: z.email(),
    password: z.string().length(8),
  });
}
