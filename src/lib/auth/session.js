import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

const SESSION_COOKIE = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Resolved lazily rather than at module scope: in preview mode there is no
 * SESSION_SECRET, and importing this module (via the proxy) must not crash
 * the public site.
 */
function secretKey() {
  if (!env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not set; admin sessions are unavailable.");
  }
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function decrypt(token) {
  if (!token || !env.SESSION_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(adminId) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({ adminId });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}
