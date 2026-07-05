// Supabase session refresh + the resource-library subscriber gate.
//
// Dormant-safe: with RESOURCES_AUTH_ENABLED unset (or no real Supabase creds) it
// no-ops immediately, so it ships to prod without touching the live, open
// /resources. When the flag is "true" it enforces the HARD gate:
//   - /resources/login and /auth/* stay open (so sign-in can actually happen)
//   - every other /resources path requires a signed-in Apple user whose RevenueCat
//     "premium" entitlement is active; anyone else is redirected to /resources/login
//     (which then shows the right state: sign in, or subscribe in the app).
// A non-entitled browser never receives the real content — the redirect happens
// before the page renders (no client-side blur).

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAppleSub, checkEntitlement } from "@/lib/resources/entitlement";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const enabled = process.env.RESOURCES_AUTH_ENABLED === "true";
  // Dormant until explicitly enabled. Until then: zero effect, /resources stays open.
  if (!enabled || !url || !key || url.includes("placeholder")) {
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

  // Refresh the session so the read below is valid.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  // The login screen and the OAuth routes must stay open, or there's no way in.
  if (path === "/resources/login" || path.startsWith("/auth/")) {
    return response;
  }

  // Redirect anyone who isn't an active subscriber to the login screen, carrying
  // any refreshed auth cookies so the session isn't dropped on the way.
  const toLogin = () => {
    const redirect = NextResponse.redirect(new URL("/resources/login", request.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  if (!user) return toLogin();
  const { active } = await checkEntitlement(getAppleSub(user));
  if (!active) return toLogin();

  // Signed in + active subscription -> through to the real content.
  return response;
}

export const config = {
  matcher: ["/resources/:path*", "/auth/:path*"],
};
