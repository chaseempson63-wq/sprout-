"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { MascotCelebration } from "./MascotCelebration";

export function Waitlist() {
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
    <div className="relative w-full max-w-5xl mx-auto mt-12 md:mt-16">

      {/* Two cards: free waitlist (left) + founding family (right). */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-6 mb-8 md:mb-10">

        {/* ── Card 1: free waitlist ─────────────────────────────── */}
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
            Sprout is what they don&apos;t build &mdash; a private record of
            your kid&apos;s week, never sold, never trained on. Be on the list
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

              <Link
                href="/partners"
                className="mt-6 text-[13px] text-sprout-cream/70 hover:text-sprout-cream hover:underline font-semibold inline-flex items-center gap-1 animate-mascot-pop"
                style={{ animationDelay: "900ms" }}
              >
                → Earn with Sprout
              </Link>
            </div>
          )}
        </div>

        {/* ── Card 2: Earn with Sprout ──────────────────────────── */}
        <div className="rounded-2xl border-2 border-[#F4EDE0] bg-[#F4EDE0] p-6 md:p-8 flex flex-col text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5),0_30px_60px_-20px_rgba(0,0,0,0.3)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1B3722]/70 font-bold mb-3">
            Earn with Sprout
          </p>
          <h3
            className="font-bold text-[#1B3722] leading-tight mb-4"
            style={{ fontSize: "clamp(20px, 2vw, 24px)" }}
          >
            Share Sprout. Take a cut.
          </h3>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B3722]/8 border border-[#1B3722]/15 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3722] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#1B3722]/85 font-bold">
              Closing soon · first 10 creator spots
            </span>
          </div>
          <div className="flex-1" />
          <Link
            href="/partners"
            className="mt-6 w-full h-12 rounded-full bg-[#1B3722] text-[#F4EDE0] font-bold text-[14px] hover:bg-[#0F2614] transition-colors inline-flex items-center justify-center gap-2"
          >
            See how it works
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>

      </div>
    </div>
  );
}
