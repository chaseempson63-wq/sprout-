// The premium check for API route handlers. Pages are gated in middleware.ts;
// the routes that spend money (Venice) or write to the community re-verify here
// with a FRESH authoritative entitlement read, never a cached value.
//
// Dormant-safe: while RESOURCES_AUTH_ENABLED is false (or creds are missing)
// every check passes, so the live open builder keeps working unchanged.
//
// Access model (2026-07-09): free tier = the 30 templates only. Premium =
// build-your-own (custom), slideshows, community, forum, creator profiles,
// child profiles. Premium comes from EITHER the Sprout app subscription (Apple
// IAP via RevenueCat) OR the standalone web plan (Stripe, forwarded into the
// SAME RevenueCat "premium" entitlement by /api/stripe/webhook) — one
// entitlement, two checkouts, each side includes the other.

import { getCurrentUser, isAuthConfigured } from "@/lib/supabase/server";
import { getAppleSub, checkEntitlement } from "./entitlement";

export type PremiumCheck =
  | { ok: true }
  | { ok: false; status: 401 | 402; error: string };

export async function requirePremium(): Promise<PremiumCheck> {
  // Pre-launch: the gate is off and everything stays open.
  if (!isAuthConfigured()) return { ok: true };

  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      status: 401,
      error: "Sign in to use this. Free templates stay open at /resources.",
    };
  }

  const { active } = await checkEntitlement(getAppleSub(user));
  if (!active) {
    return {
      ok: false,
      status: 402,
      error:
        "This is part of the Sprout plan. Subscribe in the app or on the web and it opens here.",
    };
  }

  return { ok: true };
}
