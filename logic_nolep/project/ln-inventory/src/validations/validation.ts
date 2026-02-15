import { z, ZodType } from "zod";
import { ResponseError } from "@errors/response.error";

export function validateRequest<T>(schema: ZodType, data: T): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors as Record<
      string,
      string
    >;
    const errorDetails = Object.keys(fieldErrors).reduce(
      (acc: Record<string, string>, key: string) => {
        acc[key] = fieldErrors[key]?.[0] ?? "";
        return acc;
      },
      {},
    );
    throw new ResponseError(400, "Validation failed", errorDetails);
  }
  return result.data as T;
}
