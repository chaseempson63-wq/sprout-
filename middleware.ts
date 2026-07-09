// Supabase session refresh + the resource-library subscriber gate.
//
// Dormant-safe: with RESOURCES_AUTH_ENABLED unset (or no real Supabase creds) it
// no-ops immediately, so it ships to prod without touching the live, open
// /resources. When the flag is "true" it enforces the TIERED gate
// (access model 2026-07-09):
//
//   FREE (no sign-in needed)  — the library index, the 30 template builders,
//                               how-to, privacy, login, /auth/*.
//   PREMIUM (entitled only)   — build-your-own (/resources/custom), slideshows,
//                               community, forum, creator + child profiles, and
//                               their APIs. Premium = the RevenueCat "premium"
//                               entitlement, granted by the app subscription
//                               (Apple IAP) or the web plan (Stripe, forwarded
//                               into RevenueCat by /api/stripe/webhook).
//
// A non-entitled browser never receives premium content — pages redirect to
// /resources/login before render (no client-side blur), APIs answer 401/402.
// The Venice-spend APIs (generate custom, slides) ALSO re-check server-side.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAppleSub, checkEntitlement } from "@/lib/resources/entitlement";
import { RESOURCES_DEMO } from "@/lib/resources/demo";

// Premium page prefixes. Everything else under /resources stays free.
const PREMIUM_PAGES = [
  "/resources/custom",
  "/resources/slides",
  "/resources/community",
  "/resources/forum",
  "/resources/creator",
  "/resources/child",
];

// Premium API prefixes — community/social writes and reads. The two Venice-spend
// routes (generate, slides) do their own fresh in-handler check as well; generate
// stays out of this list because template generation is free (only its "custom"
// path is premium, which the handler decides from the request body).
const PREMIUM_APIS = [
  "/api/resources/slides",
  "/api/resources/threads",
  "/api/resources/vote",
  "/api/resources/comments",
  "/api/resources/follow",
  "/api/resources/community",
  "/api/resources/announcement-hearts",
  "/api/resources/profile",
];

// Demo stage (RESOURCES_DEMO): the community/social APIs are closed at the
// edge so the teased features can't be driven through raw requests while the
// UI shows coming-soon. Reads and writes both — the pages that used them are
// gated. NOT in this list: generate (templates stay free; its custom path
// refuses in-handler), report + feedback (stay open), admin (token-gated,
// used for seeding).
const DEMO_BLOCKED_APIS = [
  "/api/resources/slides",
  "/api/resources/threads",
  "/api/resources/vote",
  "/api/resources/comments",
  "/api/resources/follow",
  "/api/resources/community",
  "/api/resources/announcement-hearts",
  "/api/resources/profile",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Demo-stage API wall. Runs on the LIVE site (independent of the dormant
  // auth flag below) and disappears when RESOURCES_DEMO flips off at launch.
  if (RESOURCES_DEMO && DEMO_BLOCKED_APIS.some((p) => path === p || path.startsWith(`${p}/`))) {
    return Response.json(
      { error: "This part of Sprout Resources is coming soon. The templates are free while you wait." },
      { status: 403 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const enabled = process.env.RESOURCES_AUTH_ENABLED === "true";
  // Dormant until explicitly enabled. Until then: zero effect, /resources stays open.
  if (!enabled || !url || !key || url.includes("placeholder")) {
    return NextResponse.next();
  }

  const premiumPage = PREMIUM_PAGES.some((p) => path === p || path.startsWith(`${p}/`));
  const premiumApi = PREMIUM_APIS.some((p) => path === p || path.startsWith(`${p}/`));

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

  // Refresh the session on every matched request (free pages included) so the
  // signed-in state stays warm; only premium paths actually require it.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The login screen and the OAuth routes must stay open, or there's no way in.
  if (path === "/resources/login" || path.startsWith("/auth/")) {
    return response;
  }

  // Free tier: index, template builders, how-to, privacy, and the open APIs.
  if (!premiumPage && !premiumApi) {
    return response;
  }

  const entitled = user ? (await checkEntitlement(getAppleSub(user))).active : false;

  if (entitled) return response;

  if (premiumApi) {
    return Response.json(
      {
        error: user
          ? "This is part of the Sprout plan. Subscribe in the app or on the web and it opens here."
          : "Sign in to use this. Free templates stay open at /resources.",
      },
      { status: user ? 402 : 401 },
    );
  }

  // Premium page, not entitled: to the login screen, carrying any refreshed
  // auth cookies so the session isn't dropped on the way.
  const redirect = NextResponse.redirect(new URL("/resources/login", request.url));
  response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  return redirect;
}

export const config = {
  matcher: ["/resources/:path*", "/auth/:path*", "/api/resources/:path*"],
};
