import { createMiddleware } from "hono/factory";
import { getSessionCookie } from "../utils/cookies";
import { AppError } from "../lib/app-error";
import { cacheSession, getCachedSession } from "../services/auth/session-cache";
import { hashSessionToken } from "../utils/session-token";
import { prisma } from "@lovable/db";

export type AuthUser = {
  id: string;
  email: string;
};

declare module "hono" {
  interface ContextVariableMap {
    user: AuthUser;
    tokenHash: string;
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = getSessionCookie(c);

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  const tokenHash = hashSessionToken(token);
  const cachedSession = await getCachedSession(tokenHash);

  //   if redis has the cached session
  if (cachedSession) {
    if (new Date(cachedSession.expiresAt).getTime() <= Date.now()) {
      throw new AppError("Session Expired", 401);
    }

    c.set("user", {
      id: cachedSession.userId,
      email: cachedSession.email,
    });

    c.set("tokenHash", tokenHash);
    return next();
  }

  //   if redis does not have cached session, check in db
  const session = await prisma.session.findUnique({
    where: {
      tokenHash,
    },
    include: {
      userRelation: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
  if (
    !session ||
    session.revokedAt ||
    session.expiresAt.getTime() >= Date.now()
  ) {
    throw new AppError("Unauthorized", 401);
  }
  await cacheSession(tokenHash, {
    sessionId: session.id,
    userId: session.userId,
    email: session.userRelation.email,
    expiresAt: session.expiresAt.toISOString(),
  });
  c.set("user", {
    id: session.userId,
    email: session.userRelation.email,
  });

  c.set("tokenHash", tokenHash);
  return next();
});
