"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SproutLogo } from "./Glass";

/* ─────────────────────────────────────────────────────────────────────
   PartnerGate — a light application gate over the /partners page.

   A cold visitor sees the offer in two lines, then a short form (name,
   email, why they're interested). On submit we capture the application,
   show a brief "Reviewing your application" beat, then reveal the page.
   Everyone who applies gets in — the point is qualified leads + a little
   commitment, not actually turning people away. Once through, a
   localStorage flag skips the gate on future visits.

   Honest framing: the loader says "reviewing your application," which is
   true (we are collecting it), not a fake worthiness verdict.
   ───────────────────────────────────────────────────────────────────── */

const UNLOCK_KEY = "sprout.partners.unlocked.v1";
const REVIEW_MS = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Phase = "form" | "reviewing";

export function PartnerGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch {
      /* private mode / storage off — gate stays, no crash */
    }
  }, []);

  async function submit() {
    setError("");
    const n = name.trim();
    const e = email.trim();
    const r = reason.trim();
    if (!n) return setError("Add your name.");
    if (!EMAIL_RE.test(e)) return setError("Add a valid email.");
    if (r.length < 20) return setError("Tell us a little more about why (a sentence or two).");

    setPhase("reviewing");
    // Capture the application. If the backend hiccups we still let them
    // through (access shouldn't hinge on our DB), we just lose that lead.
    try {
      await supabase.from("partner_applications").insert({ name: n, email: e, reason: r });
    } catch {
      /* ignore — proceed regardless */
    }
    window.setTimeout(() => {
      try {
        localStorage.setItem(UNLOCK_KEY, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    }, REVIEW_MS);
  }

  // Page content is always rendered; the overlay covers it until unlocked.
  return (
    <>
      {children}
      {mounted && !unlocked && (
        <div className="fixed inset-0 z-[90] overflow-y-auto">
          {/* opaque brand canvas so the page underneath isn't visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132] via-[#3D6643] to-[#1B3722]" />
          <div className="relative flex min-h-full items-center justify-center px-5 py-12">
            <div className="w-full max-w-md rounded-3xl border border-[#CDEFA0]/20 bg-[#F4EDE0] p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-8">
              <div className="flex items-center gap-2 text-[#1B3722]">
                <SproutLogo className="h-5 w-5 text-[#1B3722]" />
                <span className="text-sm font-bold tracking-tight">Earn with Sprout</span>
              </div>

              {phase === "form" ? (
                <>
                  <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[#1B3722]">
                    Apply to join the partner program.
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#1B3722]/75">
                    Earn 20% of every subscription, every month, for a year. The families you bring
                    get 20% off their whole first year. Tell us a bit about you and we&apos;ll open it up.
                  </p>

                  <div className="mt-6 space-y-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-11 w-full rounded-xl border border-[#1B3722]/15 bg-white px-3.5 text-[#1B3722] outline-none focus:border-[#2E5A35]"
                    />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Email"
                      className="h-11 w-full rounded-xl border border-[#1B3722]/15 bg-white px-3.5 text-[#1B3722] outline-none focus:border-[#2E5A35]"
                    />
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value.slice(0, 600))}
                      rows={4}
                      placeholder="Why are you interested? Where would you share Sprout, and who with?"
                      className="w-full resize-none rounded-xl border border-[#1B3722]/15 bg-white px-3.5 py-2.5 text-[15px] text-[#1B3722] outline-none focus:border-[#2E5A35]"
                    />
                  </div>

                  {error && <p className="mt-2 text-sm font-medium text-[#9B2C2C]">{error}</p>}

                  <button
                    type="button"
                    onClick={submit}
                    className="group mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2E5A35] text-base font-bold text-white transition hover:bg-[#346a3f] active:scale-[0.99]"
                  >
                    Submit application
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                  </button>
                  <p className="mt-3 text-center text-[11px] text-[#1B3722]/45">
                    We only use this to review partner applications.
                  </p>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#2E5A35]/10">
                    <SproutLogo className="h-7 w-7 text-[#2E5A35] motion-safe:animate-pulse" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold tracking-tight text-[#1B3722]">Reviewing your application…</h2>
                  <p className="mt-2 text-sm text-[#1B3722]/65">Checking we&apos;ve got what we need. One moment.</p>
                  <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-[#1B3722]/10">
                    <div className="h-full rounded-full bg-[#2E5A35] partner-review-bar" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <style>{`
            .partner-review-bar { width: 0%; animation: partnerReview ${REVIEW_MS}ms ease-out forwards; }
            @keyframes partnerReview { from { width: 4%; } to { width: 100%; } }
          `}</style>
        </div>
      )}
    </>
  );
}
