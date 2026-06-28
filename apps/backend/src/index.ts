import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { routes } from "./routes";
import { errorHandler } from "./lib/error-handler";
const app = new Hono();

console.log(Bun.env);

const frontendOrigin = Bun.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(
  "*",
  cors({
    origin: frontendOrigin,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/health", (c: Context) => {
  return c.json({ status: "ok" });
});

app.route("/", routes);

app.onError(errorHandler);

export default {
  fetch: app.fetch,
  port: Number(Bun.env.BACKEND_PORT ?? 4000),
};
