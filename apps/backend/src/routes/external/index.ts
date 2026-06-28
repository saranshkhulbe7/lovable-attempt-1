import { Hono } from "hono";
import { authRouter } from "./auth";
import { authMiddleware } from "../../middlewares/auth";

export const externalRouter = new Hono();
externalRouter.use("*", authMiddleware);
externalRouter.route("/auth", authRouter);
