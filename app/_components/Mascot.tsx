"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { SproutMascotIcon } from "./SproutMascotIcon";
import { SproutLogo } from "./Glass";

/* ─────────────────────────────────────────────────────────────────────
   Mascot - floating Sprout companion.
   Fixed bottom-right. Idle float. IntersectionObserver picks the
   most-visible <main> section and shows that section's line. One
   short, in-character line per section. Dismissible per session.
   See globals.css for `animate-mascot-float` / `animate-mascot-pop`.
   ───────────────────────────────────────────────────────────────────── */

/* One short, in-character line per <main> > <section>, indexed in DOM
   order. The landing has 8 sections; if the section order changes,
   re-check this mapping against page.tsx. */
const sproutLines = [
  "oh hi. keep going, i'll come with you.",           // 0  Hero: "you did more than you think"
  "voice memo, photo, one line. that's all i need.",  // 1  Product showcase: the app screens
  "years of it, all in one place. i lose nothing.",   // 2  Where it all lives: permanence frame
  "see, you're not making this up.",                  // 3  Verbatim wall: real parent quotes
  "this exact feeling. it's why i'm here.",           // 4  11:42pm: the reason Sprout exists
  "drop it in, i'll keep it. that's the whole job.",  // 5  How it works
  "notes forget. i don't. and i never sell you out.", // 6  Why Sprout: vs notes / ChatGPT
  "ok. ready when you are.",                          // 7  Final CTA: sleep on Sunday + waitlist
];

export function Mascot() {
  const [mounted, setMounted] = useState(false);
  // Dismiss is in-page only - refresh or new tab restores the mascot.
  const [dismissed, setDismissed] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const ratiosRef = useRef<Map<Element, number>>(new Map());

  // Gate render on `mounted` to avoid SSR hydration mismatch (the SSR
  // pass renders nothing; client mount triggers the real render).
  useEffect(() => {
    setMounted(true);
  }, []);

  // IntersectionObserver: pick the section with highest intersection ratio.
  // Only observes <main> > section to avoid picking up footer or nested.
  useEffect(() => {
    if (!mounted || dismissed) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section")
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratiosRef.current.set(entry.target, entry.intersectionRatio);
        }
        let bestIdx = 0;
        let bestRatio = -1;
        sections.forEach((sec, i) => {
          const r = ratiosRef.current.get(sec) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIdx = i;
          }
        });
        setActiveIdx(bestIdx);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [mounted, dismissed]);

  const handleDismiss = () => setDismissed(true);
  const handleRestore = () => setDismissed(false);

  if (!mounted) return null;

  // Dismissed state - show a small cream "bring back" affordance in the
  // same corner. Tap it to restore the mascot for the rest of the session.
  if (dismissed) {
    return (
      <button
        type="button"
        onClick={handleRestore}
        aria-label="Bring back Sprout"
        className="fixed z-50 bottom-3 right-3 md:bottom-4 md:right-4 w-11 h-11 rounded-full bg-[#F4EDE0] text-[#1B3722] flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] ring-1 ring-[#1B3722]/10 hover:scale-105 active:scale-95 transition-transform animate-mascot-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3722]/40"
      >
        <SproutLogo className="w-5 h-5" />
      </button>
    );
  }

  const line =
    sproutLines[Math.min(activeIdx, sproutLines.length - 1)] ?? sproutLines[0];

  return (
    <div
      className="fixed z-50 bottom-3 right-3 md:bottom-4 md:right-4 flex flex-col items-end gap-2 pointer-events-none select-none"
      aria-live="polite"
    >
      {/* speech bubble - re-mounts on line change for a soft pop.
          Background + text colour match the existing cream-card system
          on the page (see "The Sprout way" card in page.tsx). Font is
          Nunito 700 so the line reads as the mascot's chunky character
          voice, not as a system notification. */}
      <div
        key={line}
        className="pointer-events-auto relative max-w-[220px] md:max-w-[260px] rounded-2xl bg-[#F4EDE0] text-[#1B3722] px-4 py-3 pr-5 text-[13px] md:text-[15px] font-bold leading-snug shadow-[0_15px_40px_-10px_rgba(0,0,0,0.35)] animate-mascot-pop"
        style={{ fontFamily: "var(--font-nunito), system-ui, sans-serif" }}
        role="status"
      >
        {line}

        {/* dismiss × - top-right corner of bubble */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss Sprout companion"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1B3722] text-[#FBF6EB] flex items-center justify-center hover:bg-[#0F1311] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8FF9A]/60"
        >
          <X className="w-3 h-3" strokeWidth={2.5} />
        </button>

        {/* tail pointing down toward mascot - matches bubble cream */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 right-7 w-3 h-3 rotate-45 bg-[#F4EDE0]"
        />
      </div>

      {/* mascot - real Sprout character SVG, floating freely (no chip,
          no pill, no background). Wrapper aspect matches the SVG's
          tight viewBox (330/460) so the visible character fills the
          wrapper edge-to-edge - no internal padding pushing it away
          from the corner. Heights tuned to preserve the previous
          character size on screen. */}
      <div
        className="pointer-events-auto h-[132px] md:h-[168px] aspect-[330/460] animate-mascot-float"
        aria-hidden="true"
      >
        <SproutMascotIcon className="w-full h-full" />
      </div>
    </div>
  );
}
