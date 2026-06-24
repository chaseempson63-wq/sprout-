// Resource-library entitlement: the web's "is this person an active paying
// subscriber" check. Two pieces, both pure code, ready to activate once the
// identity + RevenueCat config exist.
//
//   getAppleSub(user)      — the identity bridge. The iOS app sets the RevenueCat
//                            App User ID to the Apple `sub` (Purchases.logIn),
//                            so the web must match on the SAME Apple sub, NOT the
//                            Supabase UUID.
//   checkEntitlement(sub)  — server-only RevenueCat REST lookup by that sub.
//
// Neither is wired into the live layout yet. The gate (three-state routing +
// fog) is the next step; it will call these.

import type { User } from "@supabase/supabase-js";

// The Apple sub lands on the provider identity. Supabase exposes it as
// identities[].identity_data.sub, with identities[].id holding the same value.
// VERIFY on the first real Apple login that this field is populated as expected
// (the Supabase docs don't pin it down explicitly).
export function getAppleSub(user: User | null): string | null {
  if (!user) return null;
  const apple = user.identities?.find((i) => i.provider === "apple");
  if (!apple) return null;
  const fromData = (apple.identity_data?.sub as string | undefined) ?? undefined;
  return fromData ?? apple.id ?? null;
}

export type EntitlementReason =
  | "active"
  | "inactive"
  | "no-user"
  | "unconfigured"
  | "error";

export interface EntitlementResult {
  active: boolean;
  reason: EntitlementReason;
}

// Server-only. Reads RevenueCat's GA REST API with the SECRET key. Never import
// this into client code — the secret key must never reach the browser bundle.
//
// CREDENTIAL-DEPENDENT: returns { active: false, reason: "unconfigured" } until
// REVENUECAT_SECRET_KEY is set, so callers degrade safely before launch.
//
// The entitlement id defaults to "premium" — the SAME identifier the iOS app
// grants (Store.swift `premiumEntitlement`). One Sprout subscription unlocks
// both the app and the web library. Override with REVENUECAT_ENTITLEMENT_ID only
// if a separate web-only tier is ever introduced.
export async function checkEntitlement(appleSub: string | null): Promise<EntitlementResult> {
  if (!appleSub) return { active: false, reason: "no-user" };

  const key = process.env.REVENUECAT_SECRET_KEY;
  if (!key) return { active: false, reason: "unconfigured" };

  const entitlementId = process.env.REVENUECAT_ENTITLEMENT_ID ?? "premium";

  try {
    const res = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appleSub)}`,
      {
        headers: { Authorization: `Bearer ${key}` },
        // Entitlement truth is time-sensitive and money-gating. Never cache the
        // authoritative check (the page-load fog can use a short cache later;
        // the Venice-spend gate must not).
        cache: "no-store",
      },
    );
    if (!res.ok) return { active: false, reason: "error" };

    const data = await res.json();
    const ent = data?.subscriber?.entitlements?.[entitlementId];
    if (!ent) return { active: false, reason: "inactive" };

    // RevenueCat keeps an entitlement present (and rolls grace-period / billing-
    // retry into it) while access should be granted. null expires = lifetime.
    const expiresMs = ent.expires_date ? Date.parse(ent.expires_date) : null;
    const active = expiresMs === null || expiresMs > Date.now();
    return { active, reason: active ? "active" : "inactive" };
  } catch {
    return { active: false, reason: "error" };
  }
}
