import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { getCurrentUser, isAuthConfigured } from "@/lib/supabase/server";
import { getAppleSub } from "@/lib/resources/entitlement";
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

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center text-center">
      <span className="bg-sprout-cream/95 mb-6 grid size-14 place-items-center rounded-2xl shadow-sm">
        <SproutMascotIcon className="h-9 w-9" />
      </span>

      <h1 className="text-sprout-cream text-3xl font-bold tracking-[-0.02em]">Your resource library</h1>
      <p className="text-sprout-cream/70 mt-3 text-[15px] leading-relaxed">
        Sign in with the same Apple ID you use in the Sprout app, and your library opens right here.
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
        {user ? (
          <div className={`${lightCard} p-6 text-left`}>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#2E5A35]/70 uppercase">Signed in</p>
            <p className="mt-2 text-[15px] font-semibold text-[#1B3722]">{user.email ?? "Apple account"}</p>
            {/* Identity-bridge proof: this Apple sub must equal the iOS app's
                RevenueCat App User ID, or the entitlement check can't match the
                same person across phone and web. */}
            <p className="mt-2 font-mono text-[12px] break-all text-[#1B3722]/55">
              Apple sub: {appleSub ?? "not found on identity"}
            </p>
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
          <ResourcesSignIn />
        )}
      </div>

      <p className="text-sprout-cream/45 mt-10 text-[12px]">No subscription yet? Sprout is on the iOS App Store.</p>
    </div>
  );
}
