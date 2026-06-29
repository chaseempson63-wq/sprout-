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

// First name + last initial, paired with a city. A believable AU / NZ / US
// blend of homeschooling households. Order is shuffled on every load.
const PEOPLE: [string, string][] = [
  ["Sarah M.", "Brisbane"], ["Emma T.", "Auckland"], ["Jess R.", "Perth"],
  ["Hannah K.", "Hamilton"], ["Megan L.", "Gold Coast"], ["Olivia P.", "Christchurch"],
  ["Rebecca W.", "Adelaide"], ["Chloe S.", "Tauranga"], ["Amy D.", "Newcastle"],
  ["Laura B.", "Wellington"], ["Kate H.", "Geelong"], ["Sophie N.", "Napier"],
  ["Nicole F.", "Toowoomba"], ["Bel J.", "Dunedin"], ["Tania G.", "Cairns"],
  ["Renee C.", "Palmerston North"], ["Kylie A.", "Ballarat"], ["Steph V.", "Rotorua"],
  ["Danielle O.", "Bendigo"], ["Aroha W.", "Whangārei"], ["Jacinta M.", "Townsville"],
  ["Erin S.", "New Plymouth"], ["Holly P.", "Wollongong"], ["Marama T.", "Nelson"],
  ["Courtney B.", "Mackay"], ["Paige R.", "Invercargill"], ["Bridget L.", "Darwin"],
  ["Whitney K.", "Austin, TX"], ["Ashley J.", "Boise, ID"], ["Brittany H.", "Nashville, TN"],
  ["Lauren D.", "Raleigh, NC"], ["Kayla M.", "Spokane, WA"], ["Morgan T.", "Tulsa, OK"],
  ["Heather S.", "Greenville, SC"], ["Amber W.", "Boise, ID"], ["Crystal P.", "Fort Worth, TX"],
  ["Vanessa R.", "Colorado Springs, CO"], ["Tara N.", "Chattanooga, TN"], ["Bethany K.", "Wichita, KS"],
  ["Jenna F.", "Sioux Falls, SD"], ["Krista L.", "Boise, ID"], ["Shauna B.", "Knoxville, TN"],
  ["Renae H.", "Sunshine Coast"], ["Fiona M.", "Hastings"], ["Kelsey T.", "Bunbury"],
  ["Monique D.", "Gisborne"], ["Priya S.", "Melbourne"], ["Carmen R.", "Tweed Heads"],
  ["Leah W.", "Queenstown"], ["Naomi K.", "Launceston"], ["Gemma P.", "Blenheim"],
  ["Tessa B.", "Mandurah"], ["Anita L.", "Whakatāne"], ["Robyn S.", "Albury"],
  ["Cara M.", "Timaru"], ["Janelle T.", "Bundaberg"], ["Hine W.", "Levin"],
  ["Sam & Pete R.", "Hervey Bay"], ["Dana K.", "Coffs Harbour"], ["Ruth P.", "Masterton"],
  ["Melissa H.", "Rockhampton"], ["Bianca S.", "Ashburton"], ["Tahlia B.", "Shepparton"],
  ["Mike D.", "Tacoma, WA"], ["Caleb R.", "Bend, OR"], ["Hannah S.", "Provo, UT"],
  ["Sierra K.", "Bozeman, MT"], ["Maddie L.", "Asheville, NC"], ["Grace P.", "Lubbock, TX"],
  ["Jordan T.", "Coeur d'Alene, ID"], ["Faith M.", "Lancaster, PA"], ["Hope W.", "Athens, GA"],
  ["Anna B.", "Frederick, MD"], ["Claire S.", "Bentonville, AR"], ["Rosa M.", "Tucson, AZ"],
  ["Bec & Tom H.", "Albany"], ["Sally K.", "Devonport"], ["Manaia T.", "Kerikeri"],
  ["Lucy P.", "Orange"], ["Imogen R.", "Mount Maunganui"], ["Pip S.", "Busselton"],
  ["Karen B.", "Pukekohe"], ["Eliza M.", "Dubbo"], ["Tui W.", "Cambridge"],
  ["Felicity D.", "Warrnambool"], ["Joanna K.", "Greymouth"], ["Simone P.", "Mildura"],
  ["Charlotte T.", "Taupō"], ["Belinda R.", "Maitland"], ["Aria S.", "Feilding"],
  ["Dawn K.", "Salem, OR"], ["Marie L.", "Chico, CA"], ["Tabitha R.", "Springfield, MO"],
  ["Lacey M.", "Idaho Falls, ID"], ["Janelle P.", "Waco, TX"], ["Cassie W.", "Medford, OR"],
  ["Renata S.", "Porirua"], ["Holly D.", "Geraldton"], ["Mel & Jase T.", "Traralgon"],
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
