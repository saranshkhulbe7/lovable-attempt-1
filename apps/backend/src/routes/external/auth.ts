import { Hono } from "hono";
import { logoutController, meController } from "../../controllers/auth";

export const authRouter = new Hono();

authRouter.get("/me", meController);
authRouter.post("/logout", logoutController);
