import * as z from "zod";
import { ZodType } from "zod";

export class TaskValidation {
  public static readonly CREATE_TASK: ZodType = z.object({
    title: z.string().min(1).max(50),
    description: z.string().optional(),
    status: z.enum(["ACTIVE", "DONE", "REMOVED"]),
  });
  public static readonly UPDATE_TASK_CONTENT: ZodType = z.object({
    title: z.string().min(1).max(50),
    description: z.string().optional(),
  });
  public static readonly CHANGE_STATUS: ZodType = z.object({
    status: z.enum(["ACTIVE", "DONE", "REMOVED"]),
  });
}
