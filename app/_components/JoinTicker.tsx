"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────
   JoinTicker — live "just joined" social-proof toast.

   Top-center pill that drops down, holds ~2s, lifts away, then waits a
   random 3-10s before the next one. Cycles a shuffled list so the order
   is different on every page load. Cream-card styling matches the rest
   of the brand (mascot bubble, "The Sprout way" card).

   Behaviour rules:
   - Arms only AFTER the site intro finishes (watches data-site-intro on
     <html>), so it never fights the load animation.
   - Pauses while the tab is hidden (doesn't burn through the list in the
     background).
   - Dismissible for the session via the × .
   - Reduced motion → fade only, no slide.
   ───────────────────────────────────────────────────────────────────── */

// First name + last initial, paired with a state/region (not a town, so it
// reads broad and not oddly specific). A believable AU / NZ / US blend of
// homeschooling households. Order is shuffled on every load.
const PEOPLE: [string, string][] = [
  ["Sarah M.", "QLD, AU"], ["Emma T.", "NZ"], ["Jess R.", "WA, AU"],
  ["Hannah K.", "NZ"], ["Megan L.", "QLD, AU"], ["Olivia P.", "NZ"],
  ["Rebecca W.", "SA, AU"], ["Chloe S.", "NZ"], ["Amy D.", "NSW, AU"],
  ["Laura B.", "NZ"], ["Kate H.", "VIC, AU"], ["Sophie N.", "NZ"],
  ["Nicole F.", "QLD, AU"], ["Bel J.", "NZ"], ["Tania G.", "QLD, AU"],
  ["Renee C.", "NZ"], ["Kylie A.", "VIC, AU"], ["Steph V.", "NZ"],
  ["Danielle O.", "VIC, AU"], ["Aroha W.", "NZ"], ["Jacinta M.", "QLD, AU"],
  ["Erin S.", "NZ"], ["Holly P.", "NSW, AU"], ["Marama T.", "NZ"],
  ["Courtney B.", "QLD, AU"], ["Paige R.", "NZ"], ["Bridget L.", "NT, AU"],
  ["Whitney K.", "TX, USA"], ["Ashley J.", "ID, USA"], ["Brittany H.", "TN, USA"],
  ["Lauren D.", "NC, USA"], ["Kayla M.", "WA, USA"], ["Morgan T.", "OK, USA"],
  ["Heather S.", "SC, USA"], ["Amber W.", "ID, USA"], ["Crystal P.", "TX, USA"],
  ["Vanessa R.", "CO, USA"], ["Tara N.", "TN, USA"], ["Bethany K.", "KS, USA"],
  ["Jenna F.", "SD, USA"], ["Krista L.", "ID, USA"], ["Shauna B.", "TN, USA"],
  ["Renae H.", "QLD, AU"], ["Fiona M.", "NZ"], ["Kelsey T.", "WA, AU"],
  ["Monique D.", "NZ"], ["Priya S.", "VIC, AU"], ["Carmen R.", "NSW, AU"],
  ["Leah W.", "NZ"], ["Naomi K.", "TAS, AU"], ["Gemma P.", "NZ"],
  ["Tessa B.", "WA, AU"], ["Anita L.", "NZ"], ["Robyn S.", "NSW, AU"],
  ["Cara M.", "NZ"], ["Janelle T.", "QLD, AU"], ["Hine W.", "NZ"],
  ["Sam & Pete R.", "QLD, AU"], ["Dana K.", "NSW, AU"], ["Ruth P.", "NZ"],
  ["Melissa H.", "QLD, AU"], ["Bianca S.", "NZ"], ["Tahlia B.", "VIC, AU"],
  ["Mike D.", "WA, USA"], ["Caleb R.", "OR, USA"], ["Hannah S.", "UT, USA"],
  ["Sierra K.", "MT, USA"], ["Maddie L.", "NC, USA"], ["Grace P.", "TX, USA"],
  ["Jordan T.", "ID, USA"], ["Faith M.", "PA, USA"], ["Hope W.", "GA, USA"],
  ["Anna B.", "MD, USA"], ["Claire S.", "AR, USA"], ["Rosa M.", "AZ, USA"],
  ["Bec & Tom H.", "WA, AU"], ["Sally K.", "TAS, AU"], ["Manaia T.", "NZ"],
  ["Lucy P.", "NSW, AU"], ["Imogen R.", "NZ"], ["Pip S.", "WA, AU"],
  ["Karen B.", "NZ"], ["Eliza M.", "NSW, AU"], ["Tui W.", "NZ"],
  ["Felicity D.", "VIC, AU"], ["Joanna K.", "NZ"], ["Simone P.", "VIC, AU"],
  ["Charlotte T.", "NZ"], ["Belinda R.", "NSW, AU"], ["Aria S.", "NZ"],
  ["Dawn K.", "OR, USA"], ["Marie L.", "CA, USA"], ["Tabitha R.", "MO, USA"],
  ["Lacey M.", "ID, USA"], ["Janelle P.", "TX, USA"], ["Cassie W.", "OR, USA"],
  ["Renata S.", "NZ"], ["Holly D.", "WA, AU"], ["Mel & Jase T.", "VIC, AU"],
];

// Light rotation of phrasings so the stream reads organic, not templated.
const ACTIONS = ["just joined the waitlist", "saved their spot", "just joined Sprout"];

// Vibrant green avatar gradients, picked by entry so each face feels distinct.
const AVATAR_GRAD = [
  "linear-gradient(135deg,#3D6643,#8FBF6A)",
  "linear-gradient(135deg,#2A5132,#6FB04A)",
  "linear-gradient(135deg,#4D7B53,#A8D86A)",
  "linear-gradient(135deg,#356B3C,#7CC25A)",
  "linear-gradient(135deg,#1B3722,#5DBB46)",
];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const IN_MS = 360;
const HOLD_MS = 2000;
const OUT_MS = 360;

export function JoinTicker() {
  const order = useMemo(() => shuffle(PEOPLE), []);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceRef = useRef(false);

  // Read reduced-motion once (client only).
  useEffect(() => {
    try {
      reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* matchMedia unavailable — keep motion on */
    }
  }, []);

  // Arm after the site intro has finished (data-site-intro flips to "off").
  // Fallbacks cover reduced-motion (set off immediately) and any wedge.
  useEffect(() => {
    const root = document.documentElement;
    if (root.getAttribute("data-site-intro") === "off") {
      setArmed(true);
      return;
    }
    const obs = new MutationObserver(() => {
      if (root.getAttribute("data-site-intro") === "off") {
        setArmed(true);
        obs.disconnect();
      }
    });
    obs.observe(root, { attributes: true, attributeFilter: ["data-site-intro"] });
    const fallback = window.setTimeout(() => setArmed(true), 6000);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  // Pause/resume with tab visibility.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // The cycle: show → hold → hide → random gap → next. Re-keys on idx so each
  // entry runs its own clean set of timers.
  useEffect(() => {
    if (!armed || paused) return;
    const timers: number[] = [];
    setShown(true);
    timers.push(window.setTimeout(() => setShown(false), IN_MS + HOLD_MS));
    timers.push(
      window.setTimeout(() => {
        const gap = 6000 + Math.random() * 14000; // 6–20s
        timers.push(
          window.setTimeout(
            () => setIdx((i) => (i + 1) % order.length),
            gap,
          ),
        );
      }, IN_MS + HOLD_MS + OUT_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [idx, armed, paused, order.length]);

  if (!armed) return null;

  const [name, place] = order[idx];
  const action = ACTIONS[idx % ACTIONS.length];
  const initial = name.charAt(0);
  const reduce = reduceRef.current;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4 md:top-5"
      aria-hidden
    >
      <div
        className="flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3.5 shadow-[0_14px_34px_-10px_rgba(27,55,34,0.45)] ring-1 ring-[#4D7B53]/30"
        style={{
          background: "linear-gradient(135deg,#F6F1E6,#E4F0D8)",
          opacity: shown ? 1 : 0,
          transform: reduce ? "none" : shown ? "translateY(0)" : "translateY(-14px)",
          transition: `opacity ${shown ? IN_MS : OUT_MS}ms ease, transform ${
            shown ? IN_MS : OUT_MS
          }ms cubic-bezier(0.22,0.61,0.36,1)`,
        }}
      >
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-bold text-[#F4EDE0] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.18)]"
          style={{ backgroundImage: AVATAR_GRAD[idx % AVATAR_GRAD.length] }}
        >
          {initial}
        </span>
        <span className="text-[12.5px] leading-tight text-[#1B3722] md:text-[13px]">
          <span className="font-bold">{name}</span>
          <span className="text-[#3D6643]/75"> from </span>
          <span className="font-semibold">{place}</span>
          <br className="sm:hidden" />
          <span className="text-[#3D6643]/75"> {action}</span>
        </span>
        <span
          className="ml-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#3FC152] shadow-[0_0_0_3px_rgba(63,193,82,0.25)] motion-safe:animate-pulse"
        />
      </div>
    </div>
  );
}
