import { Hono } from "hono";
import { authRouter } from "./auth";

export const publicRouter = new Hono();
publicRouter.route("/auth", authRouter);
