import type { ReactNode } from "react";
import {
  Mic,
  Image as ImageIcon,
  FileText,
  Share2,
  Home as HomeIcon,
  BarChart3,
  Settings as SettingsIcon,
  ChevronDown,
  Plus,
  ArrowRight,
  MessageCircle,
  Hash,
  Search,
  Palette,
  Utensils,
  Leaf,
} from "lucide-react";
import { SproutMascotIcon } from "./SproutMascotIcon";

/* ─────────────────────────────────────────────────────────────────────
   Phone mockups — single cream phone surface. Mascot top-left, w-7 h-7.

   Card treatment per the brief (2026-05-24):
   - Today: chip cards, This-week summary, Recent capture cards →
     dark-green cards with cream content (mirrors hero capsule on
     Week/Year for visual continuity).
   - Today: composer card stays white (it's a write surface).
   - Week / Year: light cards, green hero.

   Content rebuild (2026-05-25, Option 1 — Pure Timeline Feed):
   Stripped streak mechanics, system-aligned category labels
   (Talk/Count/Ask/Make/Do, Growth Domains, Numeracy, Comms),
   AI-synthesis pattern callouts (Pattern this week, Charlie returns
   to Earth science, Connections inferences), and comparison-stat
   deltas (23%, 11%). The week view now shows a chronological
   day-by-day list of captures; the year view shows simple monthly
   counts + visual density. No synthesis, no insights, no percentages,
   no streaks.
   ───────────────────────────────────────────────────────────────────── */

/* ─── Status-bar mini icons ──────────────────────────────────────── */

function SignalBars() {
  return (
    <div className="flex items-end gap-[1.5px] h-2.5">
      <div className="w-[2px] h-1 rounded-[1px] bg-[#1B3722]" />
      <div className="w-[2px] h-1.5 rounded-[1px] bg-[#1B3722]" />
      <div className="w-[2px] h-2 rounded-[1px] bg-[#1B3722]" />
      <div className="w-[2px] h-2.5 rounded-[1px] bg-[#1B3722]" />
    </div>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 16 12" className="w-3 h-2.5">
      <path
        d="M8 11a0.9 0.9 0 100-1.8 0.9 0.9 0 000 1.8zM4.7 7.5l1.05 1.05a3 3 0 014.5 0L11.3 7.5a5 5 0 00-6.6 0zM2.4 5.2l1.05 1.05a7 7 0 018.9 0L13.6 5.2a9 9 0 00-11 0z"
        fill="#1B3722"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <div className="flex items-center">
      <div className="w-[22px] h-2.5 rounded-[3px] border border-[#1B3722]/60 p-[1.5px]">
        <div className="h-full w-[14px] rounded-[1px] bg-[#1B3722]" />
      </div>
      <div className="w-[1.5px] h-[5px] rounded-r-[1px] bg-[#1B3722]/60 ml-[0.5px]" />
    </div>
  );
}

/* ─── Frame ──────────────────────────────────────────────────────── */

export function PhoneFrame({
  children,
  tilt,
  className = "",
}: {
  children: ReactNode;
  tilt?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-[230px] md:w-[300px] aspect-[9/19.5] rounded-[44px] bg-gradient-to-b from-[#0F1A12] to-[#050A07] p-[3px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.65),0_80px_160px_-40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] ${className}`}
      style={tilt ? { transform: tilt, transformStyle: "preserve-3d" } : undefined}
    >
      <div className="relative w-full h-full rounded-[42px] bg-[#0A1208] p-[2px]">
        <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-b from-[#FBF8EE] to-[#F6F1E0]">
          {/* Status bar */}
          <div className="absolute top-0 inset-x-0 h-10 px-5 flex items-center justify-between text-[10px] font-bold text-[#1B3722] z-20">
            <span>9:41</span>
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black" />
            <div className="flex items-center gap-1">
              <SignalBars />
              <WifiIcon />
              <BatteryIcon />
            </div>
          </div>

          {/* Content area */}
          <div className="absolute inset-0 pt-11 pb-14 px-4 flex flex-col">
            {children}
          </div>

          {/* Tab bar */}
          <div className="absolute bottom-0 inset-x-0 h-12 px-3 pb-2 pt-1.5 flex items-center justify-around bg-[#FBF8EE]/85 backdrop-blur-xl border-t border-[#1B3722]/5 z-30">
            <div className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full bg-[#1B3722]">
              <HomeIcon
                className="w-3.5 h-3.5 text-[#F4EDE0]"
                strokeWidth={2.5}
              />
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-1">
              <BarChart3
                className="w-3.5 h-3.5 text-[#1B3722]/35"
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-1">
              <SettingsIcon
                className="w-3.5 h-3.5 text-[#1B3722]/35"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-[#1B3722]/40 z-40" />
        </div>
      </div>
    </div>
  );
}

/* ─── Shared atoms ────────────────────────────────────────────────── */

const CARD =
  "rounded-[16px] bg-white border border-[#1B3722]/6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]";
const DARK_CARD =
  "rounded-[16px] bg-gradient-to-b from-[#2A5132] to-[#1B3722] shadow-[0_2px_8px_-2px_rgba(27,55,34,0.3)]";
const EYEBROW =
  "text-[8.5px] uppercase tracking-[0.18em] text-[#1B3722]/55 font-bold";
const PAGE_TITLE = { fontSize: "22px", lineHeight: "1.1", letterSpacing: "-0.02em" };
const HERO_NUMBER = { fontSize: "44px", lineHeight: "1", letterSpacing: "-0.03em" };

/* Per-kid colour palette — colour-codes timeline entries by who the
   capture is for, not by curriculum category. Forest = Charlie,
   Sage = Maya. Extend if more kids added. */
const KID_COLOR: Record<string, string> = {
  Charlie: "#A4C9A8",
  Maya: "#D4E6B5",
};

/* The growth domains, colour-coded exactly as in the app. The home screen's
   "this week" hero is a little garden of these — a bar per domain, height by
   how much was captured. */
const DOMAINS = [
  { label: "Talk", color: "#4F86C6", icon: MessageCircle, bar: 70 },
  { label: "Count", color: "#D8A23C", icon: Hash, bar: 45 },
  { label: "Ask", color: "#3DA59B", icon: Search, bar: 90 },
  { label: "Make", color: "#E0795B", icon: Palette, bar: 55 },
  { label: "Do", color: "#7FA86B", icon: Utensils, bar: 40 },
  { label: "Explore", color: "#4FA85F", icon: Leaf, bar: 65 },
];

function ShareIconButton() {
  return (
    <button
      className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-[#1B3722]/8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      aria-label="Share"
    >
      <Share2 className="w-3 h-3 text-[#1B3722]" strokeWidth={2.5} />
    </button>
  );
}

function SegmentedControl({
  segments,
  active = 0,
}: {
  segments: string[];
  active?: number;
}) {
  return (
    <div className="flex p-[2px] rounded-[9px] bg-[#1B3722]/8 mb-2.5">
      {segments.map((s, i) => (
        <div
          key={s}
          className={`flex-1 px-1.5 py-1 rounded-[7px] text-[9px] font-semibold text-center leading-none ${
            i === active
              ? "bg-white text-[#1B3722] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
              : "text-[#1B3722]/55"
          }`}
        >
          {s}
        </div>
      ))}
    </div>
  );
}

function KidDot({ kid }: { kid: string }) {
  return (
    <div
      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: KID_COLOR[kid] ?? "#A4C9A8" }}
    />
  );
}

function PullToRefreshHint() {
  return (
    <div className="flex justify-center mb-1 -mt-0.5">
      <ChevronDown className="w-3 h-3 text-[#1B3722]/25" strokeWidth={2.5} />
    </div>
  );
}

/* ─── TODAY (Quick log) — dark cards preserved, streak stripped ─── */

export function PhoneScreenDropIn() {
  const recents = [
    {
      icon: Mic,
      time: "5:42 PM",
      kid: "Charlie",
      note: "\"40 mins of why-does-the-moon-follow-the-car today.\"",
    },
    {
      icon: ImageIcon,
      time: "2:18 PM",
      kid: "Charlie",
      note: "Lego tower — counted 84 blocks.",
    },
    {
      icon: FileText,
      time: "11:04 AM",
      kid: "Maya",
      note: "Asked why the moon changes shape.",
    },
    {
      icon: Mic,
      time: "Yesterday",
      kid: "Charlie",
      note: "Sourdough day. Fractions in the recipe.",
    },
    {
      icon: ImageIcon,
      time: "Yesterday",
      kid: "Maya",
      note: "Watercolour of the backyard tree.",
    },
  ];

  return (
    <>
      <PullToRefreshHint />

      {/* Mascot + share */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <SproutMascotIcon className="w-7 h-7" />
        <ShareIconButton />
      </div>

      {/* Eyebrow — streak pill stripped per 2026-05-25 spec */}
      <div className="flex items-center gap-1.5 mb-1 px-0.5">
        <span className={EYEBROW}>Wednesday · Nov 19</span>
      </div>

      {/* Title */}
      <h1 className="text-[#1B3722] font-bold mb-3 px-0.5" style={PAGE_TITLE}>
        Today
      </h1>

      {/* Composer card — stays white (write surface) */}
      <div className={`${CARD} px-3 py-2.5 mb-2`}>
        <div className={`${EYEBROW} mb-1`}>5:42 PM</div>
        <p
          className="text-[#1B3722] font-semibold leading-tight mb-0.5"
          style={{ fontSize: "13px", letterSpacing: "-0.01em" }}
        >
          What did Charlie do today?
        </p>
        <p className="text-[10px] text-[#1B3722]/60 leading-snug mb-2">
          Voice memo, photo, or one sentence.
        </p>
        <div className="flex items-center justify-between pt-1.5 border-t border-[#1B3722]/8">
          <span className="text-[8.5px] text-[#1B3722]/50">
            5:42 PM · 2 drafts
          </span>
          <button
            className="w-5 h-5 rounded-full bg-[#1B3722] flex items-center justify-center"
            aria-label="Add"
          >
            <Plus className="w-3 h-3 text-[#FBF8EE]" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Input chips — DARK cards */}
      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
        {[
          { icon: Mic, label: "Voice", hint: "30 sec" },
          { icon: ImageIcon, label: "Photo", hint: "Tap to capture" },
          { icon: FileText, label: "Text", hint: "Quick note" },
        ].map((opt) => (
          <div
            key={opt.label}
            className={`${DARK_CARD} px-1 py-2 flex flex-col items-center gap-0.5`}
          >
            <div className="w-7 h-7 rounded-full bg-[#FBF8EE]/15 flex items-center justify-center mb-0.5">
              <opt.icon className="w-3 h-3 text-[#FBF8EE]" strokeWidth={2} />
            </div>
            <span className="text-[9px] font-semibold text-[#FBF8EE] leading-none">
              {opt.label}
            </span>
            <span className="text-[7px] text-[#FBF8EE]/60 leading-none">
              {opt.hint}
            </span>
          </div>
        ))}
      </div>

      {/* This week — the growth-domains garden (the app's home hero): a
          colour-coded bar per domain, height by how much was captured. */}
      <div className={`${DARK_CARD} px-3 py-2.5 mb-2.5`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9.5px] font-semibold text-[#FBF8EE]">
            This week
          </span>
          <span className="text-[8.5px] text-[#FBF8EE]/65">18 moments</span>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-12 mb-1.5">
          {DOMAINS.map((d) => (
            <div key={d.label} className="flex-1 flex items-end justify-center h-full">
              <div
                className="w-[11px] rounded-full"
                style={{ height: `${d.bar}%`, minHeight: "6px", backgroundColor: d.color }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-1.5">
          {DOMAINS.map((d) => (
            <span
              key={`l-${d.label}`}
              className="flex-1 text-center text-[6.5px] font-semibold text-[#FBF8EE]/75 leading-none"
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>

      {/* Recent eyebrow (on cream phone bg) */}
      <div className={`${EYEBROW} mb-1.5 px-0.5`}>Recent</div>

      {/* Recent capture cards — DARK, per-kid colour dots
          (replaces CAT_ON_DARK category coding — colour now signals
          which kid, not which curriculum-aligned category). */}
      {recents.map((r, i) => (
        <div
          key={i}
          className={`${DARK_CARD} px-2.5 py-1.5 mb-1 flex items-start gap-2`}
        >
          <div className="w-6 h-6 rounded-full bg-[#FBF8EE]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <r.icon className="w-3 h-3 text-[#FBF8EE]" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-semibold text-[#FBF8EE] leading-none">
                  {r.kid}
                </span>
                <KidDot kid={r.kid} />
              </div>
              <span className="text-[8.5px] text-[#FBF8EE]/55 leading-none">
                {r.time}
              </span>
            </div>
            <p className="text-[9px] leading-snug text-[#FBF8EE]/80 truncate">
              {r.note}
            </p>
          </div>
        </div>
      ))}

      {/* FAB — dark forest on cream */}
      <button
        className="absolute bottom-[60px] right-3 w-10 h-10 rounded-full bg-[#1B3722] flex items-center justify-center shadow-[0_6px_16px_-4px_rgba(27,55,34,0.45)] z-10"
        aria-label="Quick capture"
      >
        <Plus className="w-4 h-4 text-[#FBF8EE]" strokeWidth={2.5} />
      </button>
    </>
  );
}

/* ─── MEMORY (Charlie's scroll-back) — Pattern + Connections stripped */

export function PhoneScreenMemory() {
  const weeks = [
    {
      week: "Week 12",
      date: "Nov 24",
      note: "Volcano docs. 90 mins unprompted.",
      emoji: "🌋",
      count: 5,
    },
    {
      week: "Week 11",
      date: "Nov 17",
      note: "Sourdough Tuesday. Fractions through cookies.",
      emoji: "🍪",
      count: 4,
    },
    {
      week: "Week 10",
      date: "Nov 10",
      note: "Library walk. 4 books on insects.",
      emoji: "📚",
      count: 3,
    },
    {
      week: "Week 09",
      date: "Nov 3",
      note: "Built marble run. 2 hours straight.",
      emoji: "🎯",
      count: 6,
    },
    {
      week: "Week 08",
      date: "Oct 27",
      note: "Beach day. 8 tide-pool shells in a row.",
      emoji: "🐚",
      count: 6,
    },
  ];

  return (
    <>
      <PullToRefreshHint />

      <div className="mb-2.5 px-0.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className={EYEBROW}>Timeline</span>
          <ShareIconButton />
        </div>
        <h1 className="text-[#1B3722] font-bold" style={PAGE_TITLE}>
          Charlie
        </h1>
      </div>

      {/* Section eyebrow — captures, not moments */}
      <div className={`${EYEBROW} mb-1 px-0.5`}>6 weeks · 24 captures</div>

      {/* Week cards (5) — emoji + label + date + snippet + count.
          Stripped: filter chips (curriculum names), Pattern callout
          (AI synthesis), Connections inference. */}
      {weeks.map((m) => (
        <div
          key={m.week}
          className={`${CARD} px-2.5 py-2 mb-1 flex items-start gap-2`}
        >
          <div className="w-7 h-7 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm leading-none">{m.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[9.5px] font-semibold text-[#1B3722] leading-none">
                {m.week}
              </span>
              <span className="text-[8.5px] text-[#1B3722]/45 leading-none">
                {m.date}
              </span>
            </div>
            <p className="text-[9px] leading-snug text-[#1B3722]/70 mb-1">
              {m.note}
            </p>
            <span className="text-[7.5px] text-[#1B3722]/45 font-medium leading-none">
              {m.count} captures
            </span>
          </div>
        </div>
      ))}

      {/* Footer — scroll prompt, no AI inference */}
      <div className="text-center mt-1.5 text-[8.5px] text-[#1B3722]/45 font-medium">
        Look back any week.
      </div>
    </>
  );
}

/* ─── WEEKLY VIEW (Charlie's week) ────────────────────────────────
   Pure chronological day-by-day list — each day's captures stacked.
   No categories. No growth domains. No pattern callouts. No deltas. */

export function PhoneScreenReport() {
  const days = [
    {
      label: "Mon · Nov 17",
      captures: [
        { icon: Mic, time: "10:14am", text: "Library walk. Clouds." },
        { icon: ImageIcon, time: "4:30pm", text: "Lego tower." },
      ],
    },
    {
      label: "Tue · Nov 18",
      captures: [
        { icon: ImageIcon, time: "9:42am", text: "Sourdough rising." },
        { icon: Mic, time: "2:45pm", text: "Fractions through cookies." },
        { icon: FileText, time: "5:18pm", text: "Patience won today." },
        { icon: ImageIcon, time: "7:02pm", text: "Bread out of the oven." },
      ],
    },
    {
      label: "Wed · Nov 19",
      captures: [
        { icon: Mic, time: "11:02am", text: "Volcano questions, don't stop." },
        { icon: ImageIcon, time: "1:30pm", text: "Volcano drawing." },
        { icon: FileText, time: "8:14pm", text: "90 mins on Earth science." },
      ],
    },
    {
      label: "Thu · Nov 20",
      captures: [
        { icon: Mic, time: "9:30am", text: "Asked about earthquakes." },
        { icon: FileText, time: "6:45pm", text: "Ocean trench print-out." },
      ],
    },
    {
      label: "Fri · Nov 21",
      captures: [
        { icon: ImageIcon, time: "10:00am", text: "Park climbing." },
        { icon: Mic, time: "11:15am", text: "Counted ants on the path." },
        { icon: FileText, time: "4:22pm", text: "Wrote a list of insects." },
        { icon: ImageIcon, time: "7:00pm", text: "Bug jar on the table." },
      ],
    },
  ];

  return (
    <>
      <PullToRefreshHint />

      {/* Header */}
      <div className="mb-2.5 px-0.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <SproutMascotIcon className="w-3.5 h-3.5" />
            <span className={EYEBROW}>Week 12 · Nov 17–23</span>
          </div>
          <ShareIconButton />
        </div>
        <h1 className="text-[#1B3722] font-bold" style={PAGE_TITLE}>
          Charlie&apos;s week
        </h1>
      </div>

      {/* Segmented control */}
      <SegmentedControl
        segments={["This week", "Last week", "4 weeks"]}
        active={0}
      />

      {/* HERO — capture count + 7-day sparkline + day-by-day counts.
          Stripped: 23% delta chip + comparison register. */}
      <div className="rounded-[20px] bg-gradient-to-b from-[#2A5132] to-[#1B3722] px-3.5 py-3 mb-2.5 shadow-[0_4px_16px_-4px_rgba(27,55,34,0.35)]">
        <div className="text-[8.5px] uppercase tracking-[0.2em] text-[#A4C9A8]/85 font-bold mb-1">
          This week
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[#FBF8EE] font-bold" style={HERO_NUMBER}>
            18
          </span>
          <span
            className="text-[#FBF8EE]/85 font-semibold pb-1"
            style={{ fontSize: "12px", letterSpacing: "-0.01em" }}
          >
            captures
          </span>
        </div>
        {/* sparkline — 7 day bars */}
        <div className="flex items-end gap-1 h-6 mb-1.5">
          {[2, 4, 3, 2, 4, 2, 1].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-[#A4C9A8]"
              style={{
                height: `${(v / 4) * 100}%`,
                minHeight: "3px",
                opacity: 0.85,
              }}
            />
          ))}
        </div>
        {/* day-by-day footer */}
        <div className="flex justify-between text-[7.5px] text-[#FBF8EE]/55 font-medium">
          {[
            { d: "Mon", n: 2 },
            { d: "Tue", n: 4 },
            { d: "Wed", n: 3 },
            { d: "Thu", n: 2 },
            { d: "Fri", n: 4 },
            { d: "Sat", n: 2 },
            { d: "Sun", n: 1 },
          ].map((x) => (
            <span key={x.d}>
              {x.d} {x.n}
            </span>
          ))}
        </div>
      </div>

      {/* Chronological day-by-day stack — replaces Categories,
          Growth domains, Highlights cards, Pattern callout. */}
      <div className={`${EYEBROW} mb-1 px-0.5`}>The week</div>

      {days.map((day) => (
        <div key={day.label} className={`${CARD} px-2.5 py-2 mb-1.5`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9.5px] font-semibold text-[#1B3722] leading-none">
              {day.label}
            </span>
            <span className="text-[7.5px] text-[#1B3722]/45 font-medium leading-none">
              {day.captures.length}{" "}
              {day.captures.length === 1 ? "capture" : "captures"}
            </span>
          </div>
          <div className="space-y-1">
            {day.captures.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center flex-shrink-0">
                    <Icon
                      className="w-2 h-2 text-[#1B3722]"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-[8.5px] text-[#1B3722]/45 leading-none whitespace-nowrap">
                    {c.time}
                  </span>
                  <p className="text-[9px] leading-snug text-[#1B3722]/75 truncate flex-1">
                    {c.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Pinned bottom: fade + Export + Share */}
      <div className="absolute inset-x-0 bottom-[48px] z-20 pt-7 px-4 pb-2 bg-gradient-to-b from-transparent via-[#FBF8EE]/85 to-[#FBF8EE]">
        <button className="flex items-center justify-center gap-1 w-full py-1 text-[9px] font-semibold text-[#1B3722]/65 mb-1">
          Export this week
          <ArrowRight className="w-2.5 h-2.5" strokeWidth={2.5} />
        </button>
        <button className="w-full h-9 rounded-full bg-[#1B3722] text-[#FBF8EE] text-[11px] font-semibold flex items-center justify-center gap-1.5">
          <Share2 className="w-3 h-3" strokeWidth={2.5} />
          Share Charlie&apos;s week
        </button>
      </div>
    </>
  );
}

/* ─── YEAR VIEW (Charlie's year) ──────────────────────────────────
   Simple monthly stack + visual heatmap. No deltas, no "top domain",
   no streak, no growth-domain bars, no per-month delta arrows. */

/* Deterministic heatmap so SSR/CSR don't diverge. 7 rows (M T W T F S S)
   × 12 cols (weeks). Row-major: first 12 = Monday across 12 weeks. */
const HEATMAP_INTENSITIES = [
  1, 2, 1, 3, 2, 1, 3, 2, 4, 3, 2, 3, // Mon
  2, 3, 2, 1, 4, 3, 2, 1, 3, 2, 4, 3, // Tue
  1, 3, 4, 2, 1, 3, 4, 3, 2, 1, 3, 2, // Wed
  3, 2, 1, 2, 4, 3, 2, 1, 4, 3, 2, 1, // Thu
  1, 3, 2, 4, 1, 2, 3, 4, 2, 3, 4, 2, // Fri
  0, 1, 0, 2, 1, 2, 1, 3, 2, 1, 3, 2, // Sat
  0, 1, 1, 0, 2, 1, 2, 1, 3, 2, 1, 0, // Sun
];

function heatColor(v: number) {
  switch (v) {
    case 0:
      return "bg-[#A4C9A8]/20";
    case 1:
      return "bg-[#A4C9A8]/55";
    case 2:
      return "bg-[#76A77A]/75";
    case 3:
      return "bg-[#4D7B53]";
    default:
      return "bg-[#2A5132]";
  }
}

export function PhoneScreenYear() {
  return (
    <>
      <PullToRefreshHint />

      <div className="mb-2.5 px-0.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <SproutMascotIcon className="w-3.5 h-3.5" />
            <span className={EYEBROW}>2026 · Term 1</span>
          </div>
          <ShareIconButton />
        </div>
        <h1 className="text-[#1B3722] font-bold" style={PAGE_TITLE}>
          Charlie&apos;s year
        </h1>
      </div>

      <SegmentedControl
        segments={["Term 1", "Term 2", "Term 3", "Full year"]}
        active={0}
      />

      {/* HERO — capture count + 12-week sparkline.
          Stripped: 11% delta + Top month/Top domain/Streak micro-stats. */}
      <div className="rounded-[20px] bg-gradient-to-b from-[#2A5132] to-[#1B3722] px-3.5 py-3 mb-2.5 shadow-[0_4px_16px_-4px_rgba(27,55,34,0.35)]">
        <div className="text-[8.5px] uppercase tracking-[0.2em] text-[#A4C9A8]/85 font-bold mb-1">
          Term 1 · 12 weeks
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[#FBF8EE] font-bold" style={HERO_NUMBER}>
            47
          </span>
          <span
            className="text-[#FBF8EE]/85 font-semibold pb-1"
            style={{ fontSize: "12px", letterSpacing: "-0.01em" }}
          >
            captures
          </span>
        </div>
        {/* 12-week sparkline */}
        <div className="flex items-end gap-[2px] h-6">
          {[1, 2, 3, 2, 4, 3, 5, 4, 3, 5, 6, 4].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-[#A4C9A8]"
              style={{
                height: `${(v / 6) * 100}%`,
                minHeight: "3px",
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      </div>

      {/* Heatmap — visual density only. No category overlay. */}
      <div className={`${CARD} px-3 py-2.5 mb-2.5`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className={EYEBROW}>Captures by week</div>
          <div className="flex items-center gap-1 text-[7px] text-[#1B3722]/55 font-bold">
            <span>Low</span>
            <div className="flex gap-[1px]">
              {[0, 1, 2, 3, 4].map((v) => (
                <div
                  key={v}
                  className={`w-1.5 h-1.5 rounded-[1px] ${heatColor(v)}`}
                />
              ))}
            </div>
            <span>High</span>
          </div>
        </div>
        {/* week numbers row */}
        <div className="flex gap-1 mb-0.5">
          <div className="w-3 flex-shrink-0" />
          <div className="flex-1 grid grid-cols-12 gap-[2px] text-[6.5px] text-[#1B3722]/40 font-bold">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((w) => (
              <span key={w} className="text-center leading-none">
                {w}
              </span>
            ))}
          </div>
        </div>
        {/* heatmap with weekday labels */}
        <div className="flex gap-1">
          <div className="flex flex-col justify-between text-[7px] text-[#1B3722]/40 font-bold py-[1px] w-3 flex-shrink-0">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="leading-none">
                {d}
              </span>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-12 gap-[2px]">
            {HEATMAP_INTENSITIES.map((v, i) => (
              <div
                key={i}
                className={`h-[8px] rounded-[1.5px] ${heatColor(v)}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Monthly stack — simple count per month.
          Stripped: per-month trend bars + delta arrows. */}
      <div className={`${EYEBROW} mb-1 px-0.5`}>Monthly</div>

      {[
        { month: "March", count: 18 },
        { month: "April", count: 22 },
        { month: "May", count: 7 },
      ].map((m) => (
        <div
          key={m.month}
          className={`${CARD} px-3 py-2 mb-1 flex items-center justify-between`}
        >
          <span className="text-[11px] font-semibold text-[#1B3722] leading-none">
            {m.month}
          </span>
          <span className="text-[9.5px] text-[#1B3722]/55 font-medium leading-none">
            {m.count} captures
          </span>
        </div>
      ))}

      {/* Year highlights carousel — concrete months, kid-readable
          descriptions, no AI inference. */}
      <div className={`${EYEBROW} mb-1 px-0.5 mt-2`}>Year highlights</div>
      <div className="flex gap-1.5 overflow-x-hidden -mx-4 px-4 pb-1">
        {[
          { emoji: "🌋", title: "Volcano month", note: "Apr · 12 captures" },
          { emoji: "🍪", title: "Sourdough run", note: "Mar · 7 captures" },
          { emoji: "📚", title: "Insect deep-dive", note: "May · 5 captures" },
        ].map((h, i) => (
          <div key={i} className={`${CARD} px-2 py-2 flex-shrink-0 w-[110px]`}>
            <div className="w-6 h-6 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center mb-1">
              <span className="text-xs leading-none">{h.emoji}</span>
            </div>
            <div className="text-[9px] font-semibold text-[#1B3722] leading-tight">
              {h.title}
            </div>
            <div className="text-[8px] text-[#1B3722]/55 mt-0.5 leading-tight">
              {h.note}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
