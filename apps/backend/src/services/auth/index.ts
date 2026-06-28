import { prisma } from "@lovable/db";
import { AppError } from "../../lib/app-error";
import {
  createExpiryDate,
  createSessionToken,
  hashSessionToken,
} from "../../utils/session-token";
import { cacheSession, deleteCacheSession } from "./session-cache";

export const signup = async (input: { email: string; password: string }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const passwordHash = await Bun.password.hash(input.password);

  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
    },
  });
};

export const login = async (input: { email: string; password: string }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
    include: {
      session: true,
    },
  });

  if (!existingUser) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordVerified = await Bun.password.verify(
    input.password,
    existingUser.passwordHash,
  );

  if (!isPasswordVerified) {
    throw new AppError("Invalid email or password", 401);
  }

  //   logged in, now session management
  const newSessionToken = createSessionToken();
  const tokenHash = hashSessionToken(newSessionToken);
  const expiresAt = createExpiryDate();

  const session = await prisma.$transaction(async (tx) => {
    return tx.session.upsert({
      where: {
        userId: existingUser.id,
      },
      update: {
        tokenHash,
        expiresAt,
        revokedAt: null,
        revokeReason: null,
      },
      create: {
        userId: existingUser.id,
        tokenHash,
        expiresAt,
      },
    });
  });

  if (existingUser.session) {
    await deleteCacheSession(existingUser.session.tokenHash);
  }
  await cacheSession(session.tokenHash, {
    sessionId: session.id,
    userId: existingUser.id,
    email: existingUser.email,
    expiresAt: expiresAt.toISOString(),
  });

  return {
    sessionToken: newSessionToken,
    expiresAt,
    user: {
      id: existingUser.id,
      email: existingUser.email,
    },
  };
};

export const logout = async (tokenHash: string) => {
  await deleteCacheSession(tokenHash);
  await prisma.session.update({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
      revokeReason: "LOGOUT",
    },
  });
};
