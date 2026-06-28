import { Hono } from "hono";
import { zJsonValidator } from "../../utils/hono-zod-validators";
import { authCredentialsSchema } from "../../schemas/auth";
import { loginController, signupController } from "../../controllers/auth";

export const authRouter = new Hono();

authRouter.post(
  "/signup",
  zJsonValidator(authCredentialsSchema),
  signupController,
);

authRouter.post(
  "/login",
  zJsonValidator(authCredentialsSchema),
  loginController,
);
