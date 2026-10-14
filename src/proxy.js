import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/session";

const LOGIN_PATH = "/admin/login";
const PROTECTED_PREFIX = "/admin";

function isProtectedPath(pathname) {
  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    return false;
  }

  return (
    pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`)
  );
}

/**
 * Optimistic first-line check only (cookie signature + expiry, no DB hit).
 * requireAdmin() in the DAL is what actually enforces access on every
 * protected page and Server Action — the proxy matcher exclusions do not
 * apply to Server Function POSTs, so it must never be the only gate.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const session = await decrypt(request.cookies.get("session")?.value);

  if (!session?.adminId) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
