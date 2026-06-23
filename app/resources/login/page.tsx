import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase/server";
import { getAppleSub } from "@/lib/resources/entitlement";
import { ResourcesSignIn } from "../_components/ResourcesSignIn";
import { SupportLink } from "../_components/SupportLink";

export const metadata: Metadata = {
  title: "Sign in. Sprout Resources.",
  description: "Sign in with your Apple ID to open your Sprout resource library.",
};

export default async function ResourcesLoginPage() {
  const user = await getCurrentUser();
  const appleSub = getAppleSub(user);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
      <h1 className="text-sprout-cream text-3xl font-bold">Your resource library</h1>
      <p className="text-sprout-cream/70 mt-3 text-[15px] leading-relaxed">
        Sign in with the same Apple ID you use in the Sprout app, and your library opens here.
      </p>

      <div className="mt-8 w-full">
        {user ? (
          <div className="rounded-2xl border border-sprout-cream/15 bg-sprout-cream/[0.04] p-6 text-left backdrop-blur-md">
            <p className="text-sprout-cream/60 text-[11px] font-bold uppercase tracking-[0.2em]">Signed in</p>
            <p className="text-sprout-cream mt-2 text-[15px] font-semibold">{user.email ?? "Apple account"}</p>
            {/* Web-side identifier proof: this Apple sub must equal the app's
                RevenueCat App User ID. If it shows "not found", the gate can't match. */}
            <p className="text-sprout-cream/55 mt-2 font-mono text-[12px] break-all">
              Apple sub: {appleSub ?? "not found on identity"}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/resources"
                className="inline-flex h-10 items-center rounded-full bg-[#F4EDE0] px-4 text-[13px] font-bold text-[#1B3722] hover:bg-[#FBF6EB]"
              >
                Go to the library
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sprout-cream/60 hover:text-sprout-cream text-[13px] font-semibold"
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

      <p className="text-sprout-cream/45 mt-10 text-[12px]">
        No subscription yet? Sprout is available in the iOS app. ·{" "}
        <SupportLink className="hover:text-sprout-cream/80 underline underline-offset-2" />
      </p>
    </div>
  );
}
