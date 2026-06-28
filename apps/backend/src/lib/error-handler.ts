import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { AppError } from "./app-error";
import { ZodError } from "zod";

export function errorHandler(err: unknown, c: Context) {
  if (err instanceof AppError) {
    return c.json({ message: err.message }, err.statusCode as never);
  }
  if (err instanceof ZodError) {
    return c.json(
      {
        message: "Zod Error",
        issues: err.issues,
      },
      422,
    );
  }
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status as never);
  }
  console.log(err);
  return c.json(
    {
      message: "Internal Server Error",
    },
    500,
  );
}
