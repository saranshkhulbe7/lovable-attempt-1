import { redis } from "../../lib/redis";

type CachedSession = {
  sessionId: string;
  userId: string;
  email: string;
  expiresAt: string;
};

const SESSION_KEY_PREFIX = "session:";

export function getSessionCacheKey(tokenHash: string) {
  return `${SESSION_KEY_PREFIX}${tokenHash}`;
}

export async function cacheSession(tokenHash: string, session: CachedSession) {
  const expiresAtMs = new Date(session.expiresAt).getTime();
  const ttlSeconds = Math.max(
    1,
    Math.floor((expiresAtMs - new Date().getTime()) / 1000),
  );

  await redis.set(
    getSessionCacheKey(tokenHash),
    JSON.stringify(session),
    "EX",
    ttlSeconds,
  );
}

export async function getCachedSession(tokenHash: string) {
  const raw = await redis.get(getSessionCacheKey(tokenHash));
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as CachedSession;
}

export async function deleteCacheSession(tokenHash: string) {
  await redis.del(getSessionCacheKey(tokenHash));
}
