import { zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";

export function validate<T extends ZodSchema>(target: "json" | "param" | "query", schema: T) {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: "Validation failed",
          issues: result.error.issues.map((i) => ({ path: i.path, message: i.message })),
        },
        400
      );
    }
    return undefined;
  });
}
