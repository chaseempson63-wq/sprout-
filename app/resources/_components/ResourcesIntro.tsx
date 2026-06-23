"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";

/* ─────────────────────────────────────────────────────────────────────
   Resources hub — page-load intro.

   A short, theatrical reveal that sets the feeling before anyone reads:
   the Sprout name types in, the mascot pops to life, the headline rises
   and rotates a word, then the real page assembles in.

   Design rules baked in:
   - PURE OVERLAY. The real page renders normally underneath and is NEVER
     gated by JS, so the intro can never trap anyone on a blank screen. The
     curtain just covers, then lifts.
   - HANDS OFF EXACTLY. The overlay reproduces the live hero (mascot chip +
     "We were born to ___") in its exact resting position, so lifting it is
     a seamless settle onto the page, not a swap.
   - SKIPPABLE. Any pointer / key / wheel / touch instantly finishes.
   - EVERY LOAD. Plays on every load/reload of the hub, any path in — no
     once-per-session suppression. (Pre-paint gate lives in the layout's
     inline script so first paint is already correct — no flash.)
   - REDUCED MOTION. Skipped entirely; the page shows immediately.
   ───────────────────────────────────────────────────────────────────── */

// Beat timings (ms from start). Tight + overlapping; the curtain lifts ~3s.
const HELD = 380; // 1. clean held beat
const BRAND = "Sprout";
const BRAND_CHAR = 90; // 2. brand types in
const MASCOT_AT = 680; // 3. mascot pops (overlaps the brand typing)
const HEADLINE_AT = 1450; // 4. brand rises out, headline rises in + types
const LEAD = "We were born to ";
const LEAD_CHAR = 30;
const ROTATE = ["learn", "wonder"]; // words that flash past
const SETTLE = "create"; // final word — matches the page's first word
const WORD_TYPE = 70;
const WORD_HOLD = 260;
const WORD_DEL = 44;
const SETTLE_HOLD = 480;
const FADE_MS = 480; // curtain fade-out
const REST_AT = 1400; // settle to the resting attribute after resolve
const SAFETY_MS = 9000; // absolute fail-safe: show the page no matter what

// Same fractal-noise overlay the layout uses over the green canvas, so the
// curtain's background is pixel-identical and the green never shifts on lift.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")";

type Phase = "idle" | "brand" | "headline" | "resolving";

function Caret() {
  return (
    <span
      aria-hidden
      className="bg-sprout-lime ml-1 inline-block h-[0.85em] w-[3px] -translate-y-[0.04em] rounded-full align-middle motion-safe:animate-pulse"
    />
  );
}

export function ResourcesIntro() {
  const pathname = usePathname();
  const isHub = pathname === "/resources";

  // Initial render (SSR + hydration) shows the held stage on the hub; the
  // effect decides whether to actually play or remove it. Deterministic, so no
  // hydration mismatch (no storage / matchMedia is read during render).
  const [active, setActive] = useState(isHub);
  const [phase, setPhase] = useState<Phase>("idle");
  const [brand, setBrand] = useState("");
  const [lead, setLead] = useState("");
  const [word, setWord] = useState("");
  const [showMascot, setShowMascot] = useState(false);
  const [brandLeaving, setBrandLeaving] = useState(false);
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;

    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* matchMedia unavailable — fall through (the overlay is still CSS-gated) */
    }

    // The intro plays on EVERY load of the hub — no once-per-session gate. Only
    // reduced motion (or not being on the hub) suppresses it. When suppressed the
    // overlay stays mounted but CSS-hidden via the attribute; with the unique-id
    // mascot fix a hidden overlay no longer affects the page's own mascots, and
    // there's no synchronous setState here (active already reflects isHub).
    if (!isHub || reduce) {
      root.setAttribute("data-resources-intro", "off");
      return;
    }

    // Committing to play.
    root.setAttribute("data-resources-intro", "play");

    const timers: number[] = [];
    let safety = 0;
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };
    const type = (start: number, str: string, per: number, set: (s: string) => void) => {
      for (let i = 1; i <= str.length; i++) at(start + i * per, () => set(str.slice(0, i)));
      return start + str.length * per;
    };
    const del = (start: number, str: string, per: number, set: (s: string) => void) => {
      for (let i = str.length - 1; i >= 0; i--) at(start + (str.length - i) * per, () => set(str.slice(0, i)));
      return start + str.length * per;
    };

    const finish = (instant: boolean) => {
      if (doneRef.current) return;
      doneRef.current = true;
      timers.forEach(clearTimeout);
      clearTimeout(safety);
      if (instant) {
        // Skip → jump straight to the finished page, no staged reveal.
        root.setAttribute("data-resources-intro", "off");
        setActive(false);
        return;
      }
      // Natural end → fade the curtain while the page assembles beneath it.
      setPhase("resolving");
      setFading(true);
      root.setAttribute("data-resources-intro", "reveal");
      window.setTimeout(() => setActive(false), FADE_MS);
      window.setTimeout(() => root.setAttribute("data-resources-intro", "off"), REST_AT);
    };

    // Beat 1 → 2: held, then "Sprout" types.
    at(HELD, () => setPhase("brand"));
    type(HELD, BRAND, BRAND_CHAR, setBrand);
    // Beat 3: mascot pops in.
    at(MASCOT_AT, () => setShowMascot(true));
    // Beat 4: hand the line to the headline — type the lead, rotate, settle.
    at(HEADLINE_AT, () => {
      setPhase("headline");
      setBrandLeaving(true);
    });
    let t = type(HEADLINE_AT, LEAD, LEAD_CHAR, setLead);
    for (const w of ROTATE) {
      t = type(t, w, WORD_TYPE, setWord);
      t += WORD_HOLD;
      t = del(t, w, WORD_DEL, setWord);
    }
    t = type(t, SETTLE, WORD_TYPE, setWord);
    at(t + SETTLE_HOLD, () => finish(false));

    // Skip on any intent.
    const onSkip = () => finish(true);
    const opts = { capture: true, passive: true } as const;
    window.addEventListener("pointerdown", onSkip, opts);
    window.addEventListener("keydown", onSkip, opts);
    window.addEventListener("wheel", onSkip, opts);
    window.addEventListener("touchstart", onSkip, opts);
    // Absolute fail-safe: never let a wedged timer keep the curtain up.
    safety = window.setTimeout(() => finish(true), SAFETY_MS);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(safety);
      window.removeEventListener("pointerdown", onSkip, opts);
      window.removeEventListener("keydown", onSkip, opts);
      window.removeEventListener("wheel", onSkip, opts);
      window.removeEventListener("touchstart", onSkip, opts);
    };
  }, [isHub]);

  if (!active) return null;

  return (
    <div
      className="resources-intro-overlay fixed inset-0 z-[70] cursor-pointer select-none"
      style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}
      role="presentation"
      aria-hidden
    >
      {/* Background — identical to the layout's green canvas, so when the curtain
          fades the green stays put; only the hero hands off + the page assembles. */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132] via-[#3D6643] to-[#1B3722]" />
      <svg
        className="absolute inset-x-0 top-0 h-[75vh] w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M0,400 C320,280 480,520 720,420 C960,320 1120,560 1440,440 L1440,900 L0,900 Z" fill="#94BC8E" opacity="0.10" />
        <path d="M0,560 C240,460 560,640 880,540 C1120,460 1280,620 1440,560 L1440,900 L0,900 Z" fill="#4D7B53" opacity="0.18" />
        <path d="M0,700 C320,620 720,800 1100,720 C1300,680 1380,740 1440,720 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.30" />
      </svg>
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" style={{ backgroundImage: NOISE }} />

      {/* Centered lockup — a splash-style brand moment in the middle of the
          viewport: mascot on top, the typing line below, both centered. The
          text block is a stable max-width so growing/rotating text centers
          symmetrically instead of shoving the mascot sideways. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center sm:gap-6">
            <span
              className={`intro-mascot bg-sprout-cream/95 grid size-20 shrink-0 place-items-center rounded-3xl shadow-md sm:size-24 ${
                showMascot ? "intro-mascot-pop" : ""
              }`}
            >
              <SproutMascotIcon className="h-14 w-14 sm:h-16 sm:w-16" />
            </span>
            <div className="relative w-full max-w-4xl">
              {/* Settled headline — what we hand off to the page. The nbsp keeps
                  a full line box reserved before it types, so the line never
                  collapses to 0 height (which would mis-center the brand wordmark
                  against the mascot and jump when the headline appears). */}
              <h1
                className={`text-sprout-cream text-5xl font-bold tracking-[-0.02em] sm:text-6xl ${
                  phase === "idle" || phase === "brand" ? "opacity-0" : "intro-rise-in"
                }`}
              >
                {lead || " "}
                <span className="text-sprout-lime">{word}</span>
                {(phase === "headline" || phase === "resolving") && <Caret />}
              </h1>
              {/* Brand wordmark types first, then rises out of the way. Full-width
                  + nowrap + centered (text-center on the parent) so "Sprout" sits
                  centered and never wraps character-by-character. */}
              {phase !== "resolving" && (
                <h1
                  className={`text-sprout-cream absolute inset-x-0 top-0 text-5xl font-bold tracking-[-0.02em] whitespace-nowrap sm:text-6xl ${
                    brandLeaving ? "intro-rise-out" : ""
                  }`}
                >
                  {brand}
                  {phase === "brand" && <Caret />}
                </h1>
              )}
            </div>
      </div>
    </div>
  );
}
