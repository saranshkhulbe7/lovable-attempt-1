import { zValidator } from "@hono/zod-validator";

export function zJsonValidator(
  schema: any,
  options?: {
    customErrorMessage?: string;
  },
) {
  return zValidator("json", schema, (result) => {
    if (!result.success) {
      throw options?.customErrorMessage
        ? new Error(options.customErrorMessage)
        : result.error;
    }
  });
}

export function zParamsValidator(
  schema: any,
  options?: {
    customErrorMessage?: string;
  },
) {
  return zValidator("param", schema, (result) => {
    if (!result.success) {
      throw options?.customErrorMessage
        ? new Error(options.customErrorMessage)
        : result.error;
    }
  });
}

export function zQueryValidator(schema: any) {
  return zValidator("query", schema, (result) => {
    if (!result.success) {
      throw result.error;
    }
  });
}
