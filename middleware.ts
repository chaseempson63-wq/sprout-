// Supabase session-refresh middleware.
//
// Keeps the auth cookie fresh so server components / route handlers read a valid
// session. It does NOT gate anything yet — the resource-library entitlement gate
// is wired in deliberately later, once RevenueCat + the Apple Services ID exist.
//
// Dormant-safe: if real Supabase creds aren't set, it no-ops immediately, so it
// can ship to prod without touching the live /resources behavior. Matcher is
// scoped to the auth-relevant paths only, never the marketing pages.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("placeholder")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Refreshes the session if it's expired. Required for server-side auth reads.
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/resources/:path*", "/auth/:path*"],
};
