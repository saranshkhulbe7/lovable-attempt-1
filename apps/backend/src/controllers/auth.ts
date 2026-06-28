import { Context } from "hono";
import z, { xid } from "zod";
import { login, logout, signup } from "../services/auth";
import { deleteSessionCookie, setSessionCookie } from "../utils/cookies";
import { authCredentialsSchema } from "../schemas/auth";

export const signupController = async (c: Context) => {
  const body = (await c.req.json()) as z.infer<typeof authCredentialsSchema>;
  await signup(body);
  const result = await login(body);
  setSessionCookie(c, result.sessionToken, result.expiresAt);
  return c.json({
    message: "Signup Successful",
  });
};

export const loginController = async (c: Context) => {
  const body = (await c.req.json()) as z.infer<typeof authCredentialsSchema>;
  const result = await login(body);
  setSessionCookie(c, result.sessionToken, result.expiresAt);
  return c.json({
    message: "Login Successful",
  });
};

export const meController = async (c: Context) => {
  const user = c.get("user");
  return c.json({
    user,
  });
};

export const logoutController = async (c: Context) => {
  const tokenHash = c.get("tokenHash");
  await logout(tokenHash);
  deleteSessionCookie(c);

  return c.json({
    message: "Logout Successful",
  });
};
