import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { getCurrentUser, isAuthConfigured } from "@/lib/supabase/server";
import { getAppleSub, checkEntitlement } from "@/lib/resources/entitlement";
import { GlassLink } from "@/components/ui/glass";
import { ResourcesSignIn } from "../_components/ResourcesSignIn";

// Auth state is per-request — never statically cache this page, so the dormant
// redirect isn't baked in and flipping RESOURCES_AUTH_ENABLED at launch takes effect.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in. Sprout Resources.",
  description: "Sign in with your Apple ID to open your Sprout resource library.",
};

// Cream panel on the green canvas — same treatment the privacy page uses.
const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

// DORMANT until launch. getCurrentUser returns null unless RESOURCES_AUTH_ENABLED
// is "true" with real Supabase creds. Until then this whole page bounces to the
// library, so it can ship to prod without exposing a half-working sign-in. When
// the flag flips on, the gate (built next) will route unauthenticated visitors here.
export default async function ResourcesLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!isAuthConfigured()) redirect("/resources");

  const { error } = await searchParams;
  const user = await getCurrentUser();
  const appleSub = getAppleSub(user);
  // Active subscriber = the "premium" entitlement on this Apple sub. The middleware
  // gate already blocks non-entitled users from the real /resources content; here we
  // just tailor what the login screen itself shows them.
  const entitled = user ? (await checkEntitlement(appleSub)).active : false;

  // The standalone web plan (Stripe payment link). Only rendered for signed-in
  // users, and always with client_reference_id = their Apple sub, so the
  // webhook can hand the purchase to RevenueCat under the shared identity.
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
  const stripeLink =
    paymentLink && appleSub
      ? `${paymentLink}${paymentLink.includes("?") ? "&" : "?"}client_reference_id=${encodeURIComponent(appleSub)}`
      : null;

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center text-center">
      <span className="bg-sprout-cream/95 mb-6 grid size-14 place-items-center rounded-2xl shadow-sm">
        <SproutMascotIcon className="h-9 w-9" />
      </span>

      <h1 className="text-sprout-cream text-3xl font-bold tracking-[-0.02em]">Your resource library</h1>
      <p className="text-sprout-cream/70 mt-3 text-[15px] leading-relaxed">
        Sign in with your Apple ID. Any Sprout plan on it, from the app or the web, opens the full
        library right here.
      </p>

      {error === "auth" && (
        <p
          className="mt-5 rounded-xl border border-rose-200/30 bg-rose-500/10 px-4 py-2 text-[13px] text-rose-100"
          role="alert"
        >
          That sign-in didn't go through. Give it another try.
        </p>
      )}

      <div className="mt-8 w-full">
        {!user ? (
          <ResourcesSignIn />
        ) : entitled ? (
          <div className={`${lightCard} p-6 text-left`}>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#2E5A35]/70 uppercase">Signed in</p>
            <p className="mt-2 text-[15px] font-semibold text-[#1B3722]">{user.email ?? "Apple account"}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <GlassLink href="/resources" className="h-10 px-4 text-[13px] text-[#1B3722]">
                Go to the library
              </GlassLink>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-[13px] font-semibold text-[#1B3722]/60 hover:text-[#1B3722]"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className={`${lightCard} p-6 text-left`}>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#2E5A35]/70 uppercase">Signed in as</p>
            <p className="mt-2 text-[15px] font-semibold text-[#1B3722]">{user.email ?? "Apple account"}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#1B3722]/75">
              We don't see an active Sprout plan on this Apple ID yet. There are two ways in, and
              they cost the same. Each one includes the other.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-[#2E5A35]/15 bg-white/60 p-4">
                <p className="text-[13px] font-bold text-[#1B3722]">The Sprout app</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#1B3722]/70">
                  The journal plus the full builder. Subscribe in the app with this Apple ID and
                  everything opens here too.
                </p>
                <GlassLink href="/" className="mt-3 h-9 px-4 text-[13px] text-[#1B3722]">
                  Get Sprout
                </GlassLink>
              </div>

              {stripeLink && (
                <div className="rounded-xl border border-[#2E5A35]/15 bg-white/60 p-4">
                  <p className="text-[13px] font-bold text-[#1B3722]">The web plan</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#1B3722]/70">
                    The full builder, slideshows, and community, right here. No iPhone needed. The
                    app comes included the day you want it.
                  </p>
                  <GlassLink href={stripeLink} className="mt-3 h-9 px-4 text-[13px] text-[#1B3722]">
                    Subscribe on the web
                  </GlassLink>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <GlassLink href="/resources" className="h-9 px-4 text-[13px] text-[#1B3722]">
                Keep using the free templates
              </GlassLink>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-[13px] font-semibold text-[#1B3722]/60 hover:text-[#1B3722]"
                >
                  Use a different Apple ID
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <p className="text-sprout-cream/45 mt-10 text-[12px]">The templates are free for everyone. The full builder comes with any Sprout plan.</p>
    </div>
  );
}
