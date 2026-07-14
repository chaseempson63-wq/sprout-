"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { MascotCelebration } from "./MascotCelebration";

export function Waitlist({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return;
    setSubmitting(true);
    setError(null);
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({ email: cleaned });
    setSubmitting(false);
    if (dbError) {
      // Postgres 23505 = unique_violation. Cleaner than string-matching
      // the error message (Postgres can change the wording any release).
      if (dbError.code === "23505") {
        setError("You're already on the list.");
      } else {
        setError("Something went wrong. Try again?");
      }
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className={`relative w-full max-w-xl mx-auto ${compact ? "" : "mt-12 md:mt-16"}`}>

      {/* One card: the free waitlist. (The earn/partner teaser card was
          removed 2026-07-10 — the partner program lives at /partners via the
          footer link only, until it reopens.) */}
      <div className={compact ? "" : "mb-8 md:mb-10"}>

        {/* ── The waitlist card ─────────────────────────────────── */}
        <div className="rounded-2xl border border-sprout-cream/15 bg-sprout-cream/[0.04] backdrop-blur-md p-6 md:p-8 flex flex-col text-left">
          <p className="text-[11px] uppercase tracking-[0.22em] text-sprout-cream/65 font-bold mb-3">
            The waitlist
          </p>
          <h3
            className="font-bold text-sprout-cream mb-3 leading-tight"
            style={{ fontSize: "clamp(20px, 2vw, 24px)" }}
          >
            Join before the door opens.
          </h3>
          <p className="text-sprout-cream/75 mb-6 flex-1 leading-relaxed text-[15px]">
            Corps are selling people&apos;s data to AI in the race to the end.
            Sprout is what they don&apos;t build. A private record of your
            kid&apos;s week, never sold, never trained on. Be on the list
            when it opens.
          </p>

          {!submitted ? (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                className="w-full rounded-lg border border-sprout-cream/15 bg-sprout-cream/[0.04] px-4 py-3 text-[14px] text-sprout-cream placeholder:text-sprout-cream/40 focus:outline-none focus:border-sprout-cream/35 transition-colors"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-[14px] hover:bg-[#FBF6EB] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Joining…" : "Join the waitlist"}
              </button>
              {error && (
                <p className="text-[12px] text-rose-300 mt-1" role="alert">
                  {error}
                </p>
              )}
            </form>
          ) : (
            <div className="flex flex-col items-center text-center py-2">
              <MascotCelebration size={140} />

              {/* "Thank you" fades in roughly during the jump peak via the
                  shared mascot-pop animation + a small inline delay so it
                  lands as the sprout tops out. */}
              <p
                className="mt-4 font-bold text-sprout-cream leading-tight animate-mascot-pop"
                style={{
                  fontSize: "clamp(22px, 2.4vw, 28px)",
                  animationDelay: "500ms",
                }}
              >
                Thank you.
              </p>
              <p
                className="mt-2 text-sprout-cream/75 leading-relaxed max-w-xs text-[14px] animate-mascot-pop"
                style={{ animationDelay: "650ms" }}
              >
                We&apos;ll let you know the moment the door opens.
              </p>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
