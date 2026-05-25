"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Founding-Member checkout URL. Configured via env var so it can be
// swapped per environment without touching code. If unset, the button
// links to a no-op anchor (clicks won't navigate anywhere harmful).
const STRIPE_URL =
  process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? "#stripe-url-not-set";

type FMBenefit = {
  icon: LucideIcon;
  heading: string;
  description: string;
};

const FM_BENEFITS: FMBenefit[] = [
  {
    icon: ShieldCheck,
    heading: "Founding member status for life.",
    description: "Once-ever badge. After 100, it's closed forever.",
  },
  {
    icon: Zap,
    heading: "Skip the wait.",
    description: "In Sprout the day it opens. No queue, no email-when-ready.",
  },
  {
    icon: MessageCircle,
    heading: "A direct line to the founder and team.",
    description:
      "Private channel. A small room, not a Discord with strangers.",
  },
  {
    icon: Wrench,
    heading: "Help shape what Sprout becomes.",
    description: "See the roadmap before anyone. Your feedback ships.",
  },
];

function FMBenefitRow({ benefit }: { benefit: FMBenefit }) {
  const Icon = benefit.icon;
  return (
    <li className="flex items-start gap-3">
      <Icon
        className="flex-shrink-0 mt-[3px] text-[#1B3722]"
        size={18}
        aria-hidden
      />
      <div className="min-w-0">
        <span className="font-bold text-[#1B3722] text-[14px] leading-[1.45]">
          {benefit.heading}
        </span>{" "}
        <span className="text-[#1B3722]/75 text-[14px] leading-[1.45]">
          {benefit.description}
        </span>
      </div>
    </li>
  );
}

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fmCardRef = useRef<HTMLDivElement>(null);

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

  const goToFM = () => {
    fmCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCheckout = () => {
    window.location.href = STRIPE_URL;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 md:mt-16">

      {/* Two cards: free waitlist (left) + founding family (right). */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">

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
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#A4C9A8] font-bold mb-2">
                ✓ You&apos;re in
              </p>
              <p className="text-sprout-cream/75 mb-4 leading-relaxed text-[15px]">
                We&apos;ll be in touch. While you wait — there&apos;s another
                way to help.
              </p>
              <button
                type="button"
                onClick={goToFM}
                className="text-[14px] text-sprout-cream hover:underline font-semibold inline-flex items-center gap-1"
              >
                → Become a Founding Family
              </button>
            </div>
          )}
        </div>

        {/* ── Card 2: Founding Family ───────────────────────────── */}
        <div
          ref={fmCardRef}
          className="rounded-2xl border-2 border-[#F4EDE0] bg-[#F4EDE0] p-6 md:p-8 flex flex-col text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5),0_30px_60px_-20px_rgba(0,0,0,0.3)]"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1B3722]/70 font-bold mb-3">
            Limited to 100
          </p>
          <h3
            className="font-bold text-[#1B3722] mb-3 leading-tight"
            style={{ fontSize: "clamp(20px, 2vw, 24px)" }}
          >
            The founding 100. The ones who got there first.
          </h3>
          <p className="text-[#1B3722]/75 mb-5 leading-snug text-[15px]">
            Not a customer. A co-builder. Help build the record the corps will
            never build for you.
          </p>
          <ul className="space-y-3 mb-6 flex-1">
            {FM_BENEFITS.map((b) => (
              <FMBenefitRow key={b.heading} benefit={b} />
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full h-12 rounded-full bg-[#1B3722] text-[#F4EDE0] font-bold text-[14px] hover:bg-[#0F2614] transition-colors inline-flex items-center justify-center gap-2"
          >
            Become a Founding Family
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

      </div>

      {/* Counter under the cards — hardcoded for v1, matches Ether's pattern. */}
      <div className="text-center space-y-1">
        <p className="text-sprout-cream text-[14px] font-semibold">
          0 / 100 founding families.
        </p>
        <p className="text-[#A4C9A8] text-[13px]">
          Doubles at 25.
        </p>
      </div>

      {/* ── Confirmation modal ───────────────────────────────────
          Opened by the FM card's primary button. Click outside or the
          Cancel button to close. Continue button redirects to Stripe. */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{
            background: "rgba(15, 19, 17, 0.85)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fm-modal-heading"
        >
          <div
            className="relative max-w-[480px] w-full rounded-2xl border-2 border-[#F4EDE0] bg-[#F4EDE0] p-7 md:p-8 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="fm-modal-heading"
              className="font-bold text-[#1B3722] mb-4 leading-tight"
              style={{ fontSize: "clamp(20px, 2.4vw, 24px)" }}
            >
              You&apos;re stepping in. Here&apos;s what happens next.
            </h3>
            <p className="text-[#1B3722]/80 leading-relaxed text-[16px] mb-4">
              You&apos;re about to claim a Founding Family spot. Here&apos;s
              what comes with it:
            </p>
            <ul className="space-y-2.5 mb-5">
              {[
                "Founding member status for life — once-ever, can't be bought later",
                "Skip the wait — in Sprout the day it opens",
                "A direct line to the founder and team",
                "Help shape what Sprout becomes — see roadmap, your feedback ships",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-[#1B3722] text-[14px] leading-[1.55]"
                >
                  <span
                    aria-hidden
                    className="inline-block flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-[#1B3722]"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-[#1B3722]/55 italic text-[14px] mb-6">
              Closes at 100 spots.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full h-12 rounded-full bg-[#1B3722] text-[#F4EDE0] font-bold text-[14px] hover:bg-[#0F2614] transition-colors inline-flex items-center justify-center gap-2"
              >
                Claim my spot
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[14px] text-[#1B3722]/60 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
