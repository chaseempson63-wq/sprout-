// POST /api/stripe/webhook — the standalone web plan's bridge into RevenueCat.
//
// Access model (2026-07-09): premium can be bought two ways — the Sprout app
// (Apple IAP) or the web plan (Stripe). Both land in the SAME RevenueCat
// "premium" entitlement, so one purchase unlocks both sides. This route makes
// the Stripe side true: when a web checkout completes, it forwards the Stripe
// subscription to RevenueCat under the buyer's Apple sub (the shared identity),
// and RevenueCat tracks the subscription's lifecycle from there via its Stripe
// connection.
//
// Requirements before this does anything (all safe to leave unset — it answers
// 503 until configured):
//   1. STRIPE_WEBHOOK_SECRET      — from the Stripe webhook endpoint pointing at
//                                   this route (event: checkout.session.completed).
//   2. REVENUECAT_STRIPE_PUBLIC_KEY — RevenueCat's PUBLIC API key for the Stripe
//                                   app (RevenueCat dashboard: connect Stripe
//                                   under Integrations, then Project > API keys).
//   3. The payment link must carry client_reference_id=<the buyer's Apple sub>.
//      The login screen builds that URL automatically for signed-in users — the
//      web plan is only ever offered AFTER Apple sign-in, so the identity always
//      exists. A bare checkout with no reference is acknowledged (200, so Stripe
//      stops retrying) and logged for a manual RevenueCat grant.
//
// Signature verification is implemented directly against Stripe's documented
// scheme (HMAC-SHA256 over "<timestamp>.<payload>") to avoid pulling in the
// stripe SDK for one endpoint.

import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

const TOLERANCE_SECONDS = 5 * 60;

function verifySignature(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  let timestamp = "";
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=", 2);
    if (k === "t") timestamp = v;
    if (k === "v1" && v) signatures.push(v);
  }
  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  return signatures.some((sig) => {
    const sigBuf = Buffer.from(sig, "utf8");
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rcStripeKey = process.env.REVENUECAT_STRIPE_PUBLIC_KEY;
  if (!webhookSecret || !rcStripeKey) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const payload = await request.text();
  if (!verifySignature(payload, request.headers.get("stripe-signature"), webhookSecret)) {
    return Response.json({ error: "Bad signature" }, { status: 400 });
  }

  let event: {
    type?: string;
    data?: { object?: { mode?: string; subscription?: string; client_reference_id?: string; id?: string } };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only the completed-checkout event matters here; RevenueCat handles renewals,
  // cancellations, and billing retries itself once it knows the subscription.
  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data?.object ?? {};
  const appUserId = session.client_reference_id;
  const subscriptionId = session.subscription;

  if (session.mode !== "subscription" || !subscriptionId) {
    return Response.json({ received: true });
  }

  if (!appUserId) {
    // Bought through a bare link with no signed-in identity attached. Acknowledge
    // (Stripe must get a 2xx or it retries forever) and leave a trail for a
    // manual grant in the RevenueCat dashboard.
    console.error(
      `[stripe-webhook] checkout ${session.id ?? "?"} completed with no client_reference_id — grant manually in RevenueCat (subscription ${subscriptionId})`,
    );
    return Response.json({ received: true, unmatched: true });
  }

  // Hand the Stripe subscription to RevenueCat under the buyer's Apple sub.
  // From here the web buyer looks identical to an app buyer: the "premium"
  // entitlement goes active on that identity for both the web gate and the app.
  const rc = await fetch("https://api.revenuecat.com/v1/receipts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${rcStripeKey}`,
      "Content-Type": "application/json",
      "X-Platform": "stripe",
    },
    body: JSON.stringify({ app_user_id: appUserId, fetch_token: subscriptionId }),
  });

  if (!rc.ok) {
    const detail = await rc.text().catch(() => "");
    console.error(`[stripe-webhook] RevenueCat rejected subscription ${subscriptionId}: ${rc.status} ${detail}`);
    // 500 so Stripe retries — RevenueCat may have been momentarily down.
    return Response.json({ error: "RevenueCat forward failed" }, { status: 500 });
  }

  return Response.json({ received: true });
}
