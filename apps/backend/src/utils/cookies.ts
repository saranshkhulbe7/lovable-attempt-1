import type { Context } from "Hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

export const SESSION_COOKIE_NAME = "lovable_session";

export function getSessionCookie(c: Context) {
  return getCookie(c, SESSION_COOKIE_NAME);
}

export function setSessionCookie(c: Context, token: string, expiresAt: Date) {
  const secure = Bun.env.COOKIE_SECURE === "true";

  setCookie(c, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    expires: expiresAt,
  });
}

export function deleteSessionCookie(c: Context) {
  deleteCookie(c, SESSION_COOKIE_NAME, {
    path: "/",
  });
}
