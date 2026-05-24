import type { ReactNode } from "react";
import {
  Mic,
  Image as ImageIcon,
  FileText,
  Share2,
  Home as HomeIcon,
  BarChart3,
  Settings as SettingsIcon,
  ChevronUp,
  ChevronRight,
  ChevronDown,
  Plus,
  ArrowRight,
} from "lucide-react";
import { SproutMascotIcon } from "./SproutMascotIcon";

/* ─────────────────────────────────────────────────────────────────────
   Phone mockups — themed (light/dark) + mascot-branded.

   Three-mood brand spec (see CLAUDE.md):
   - app interior (capture · memory) → DARK forest, glassmorphic chrome,
     cream/white cards, lime CTAs                    → theme="dark"
   - artifact (weekly report · year)  → LIGHT cream, dark hero capsules,
     dark CTAs                                       → theme="light"

   Mascot is rendered top-left of every screen as the brand mark.
   ───────────────────────────────────────────────────────────────────── */

/* ─── Status-bar mini icons (color flips by theme) ───────────────── */

function SignalBars({ color = "#1B3722" }: { color?: string }) {
  return (
    <div className="flex items-end gap-[1.5px] h-2.5">
      <div className="w-[2px] h-1 rounded-[1px]" style={{ backgroundColor: color }} />
      <div className="w-[2px] h-1.5 rounded-[1px]" style={{ backgroundColor: color }} />
      <div className="w-[2px] h-2 rounded-[1px]" style={{ backgroundColor: color }} />
      <div className="w-[2px] h-2.5 rounded-[1px]" style={{ backgroundColor: color }} />
    </div>
  );
}

function WifiIcon({ color = "#1B3722" }: { color?: string }) {
  return (
    <svg viewBox="0 0 16 12" className="w-3 h-2.5">
      <path
        d="M8 11a0.9 0.9 0 100-1.8 0.9 0.9 0 000 1.8zM4.7 7.5l1.05 1.05a3 3 0 014.5 0L11.3 7.5a5 5 0 00-6.6 0zM2.4 5.2l1.05 1.05a7 7 0 018.9 0L13.6 5.2a9 9 0 00-11 0z"
        fill={color}
      />
    </svg>
  );
}

function BatteryIcon({ color = "#1B3722" }: { color?: string }) {
  return (
    <div className="flex items-center">
      <div
        className="w-[22px] h-2.5 rounded-[3px] border p-[1.5px]"
        style={{ borderColor: `${color}99` }}
      >
        <div
          className="h-full w-[14px] rounded-[1px]"
          style={{ backgroundColor: color }}
        />
      </div>
      <div
        className="w-[1.5px] h-[5px] rounded-r-[1px] ml-[0.5px]"
        style={{ backgroundColor: `${color}99` }}
      />
    </div>
  );
}

/* ─── Frame ──────────────────────────────────────────────────────── */

export function PhoneFrame({
  children,
  tilt,
  theme = "light",
  className = "",
}: {
  children: ReactNode;
  tilt?: string;
  theme?: "light" | "dark";
  className?: string;
}) {
  const isDark = theme === "dark";
  const chromeColor = isDark ? "#FBF8EE" : "#1B3722";

  return (
    <div
      className={`relative w-[230px] md:w-[300px] aspect-[9/19.5] rounded-[44px] bg-gradient-to-b from-[#0F1A12] to-[#050A07] p-[3px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.65),0_80px_160px_-40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] ${className}`}
      style={tilt ? { transform: tilt, transformStyle: "preserve-3d" } : undefined}
    >
      <div className="relative w-full h-full rounded-[42px] bg-[#0A1208] p-[2px]">
        <div
          className={`relative w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-b ${
            isDark
              ? "from-[#0F1A12] to-[#15291A]"
              : "from-[#FBF8EE] to-[#F6F1E0]"
          }`}
        >
          {/* Status bar */}
          <div
            className="absolute top-0 inset-x-0 h-10 px-5 flex items-center justify-between text-[10px] font-bold z-20"
            style={{ color: chromeColor }}
          >
            <span>9:41</span>
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black" />
            <div className="flex items-center gap-1">
              <SignalBars color={chromeColor} />
              <WifiIcon color={chromeColor} />
              <BatteryIcon color={chromeColor} />
            </div>
          </div>

          {/* Content area */}
          <div className="absolute inset-0 pt-11 pb-14 px-4 flex flex-col">
            {children}
          </div>

          {/* Tab bar */}
          <div
            className={`absolute bottom-0 inset-x-0 h-12 px-3 pb-2 pt-1.5 flex items-center justify-around backdrop-blur-xl border-t z-30 ${
              isDark
                ? "bg-[#0F1A12]/85 border-[#FBF8EE]/8"
                : "bg-[#FBF8EE]/85 border-[#1B3722]/5"
            }`}
          >
            <div
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full ${
                isDark ? "bg-[#A4C9A8]/20" : "bg-[#1B3722]"
              }`}
            >
              <HomeIcon
                className={`w-3.5 h-3.5 ${isDark ? "text-[#A4C9A8]" : "text-[#F4EDE0]"}`}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-1">
              <BarChart3
                className={`w-3.5 h-3.5 ${isDark ? "text-[#FBF8EE]/35" : "text-[#1B3722]/35"}`}
                strokeWidth={2}
              />
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-1">
              <SettingsIcon
                className={`w-3.5 h-3.5 ${isDark ? "text-[#FBF8EE]/35" : "text-[#1B3722]/35"}`}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Home indicator */}
          <div
            className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full z-40 ${
              isDark ? "bg-[#FBF8EE]/40" : "bg-[#1B3722]/40"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Shared atoms ────────────────────────────────────────────────── */

const CARD =
  "rounded-[16px] bg-white border border-[#1B3722]/6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]";
const EYEBROW_LIGHT =
  "text-[8.5px] uppercase tracking-[0.18em] text-[#1B3722]/55 font-bold";
const EYEBROW_DARK =
  "text-[8.5px] uppercase tracking-[0.18em] text-[#FBF8EE]/55 font-bold";
const PAGE_TITLE = { fontSize: "22px", lineHeight: "1.1", letterSpacing: "-0.02em" };
const HERO_NUMBER = { fontSize: "44px", lineHeight: "1", letterSpacing: "-0.03em" };

/* category palette — Talk / Count / Ask / Make / Do */
const CAT = {
  talk: "#2A5132",
  count: "#4D7B53",
  ask: "#B8945E",
  make: "#76A77A",
  do: "#1B3722",
} as const;

function ShareIconButton({ dark = false }: { dark?: boolean }) {
  return (
    <button
      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
        dark
          ? "bg-[#FBF8EE]/10 border border-[#FBF8EE]/20"
          : "bg-white border border-[#1B3722]/8"
      }`}
      aria-label="Share"
    >
      <Share2
        className={`w-3 h-3 ${dark ? "text-[#FBF8EE]" : "text-[#1B3722]"}`}
        strokeWidth={2.5}
      />
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

function CategoryDot({ color }: { color: string }) {
  return (
    <div
      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function ProgressBar({ pct, color = "#1B3722" }: { pct: number; color?: string }) {
  return (
    <div className="h-1 rounded-full bg-[#1B3722]/10 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function PullToRefreshHint({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex justify-center mb-1 -mt-0.5">
      <ChevronDown
        className={`w-3 h-3 ${dark ? "text-[#FBF8EE]/30" : "text-[#1B3722]/25"}`}
        strokeWidth={2.5}
      />
    </div>
  );
}

/* ─── TODAY (Quick log) — DARK theme ──────────────────────────────── */

export function PhoneScreenDropIn() {
  const recents = [
    {
      icon: Mic,
      time: "5:42 PM",
      kid: "Charlie",
      note: "\"40 mins on volcano questions today.\"",
      color: CAT.ask,
    },
    {
      icon: ImageIcon,
      time: "2:18 PM",
      kid: "Charlie",
      note: "Lego tower — counted 84 blocks.",
      color: CAT.count,
    },
    {
      icon: FileText,
      time: "11:04 AM",
      kid: "Maya",
      note: "Asked why the moon changes shape.",
      color: CAT.talk,
    },
    {
      icon: Mic,
      time: "Yesterday",
      kid: "Charlie",
      note: "Sourdough day. Fractions in the recipe.",
      color: CAT.make,
    },
    {
      icon: ImageIcon,
      time: "Yesterday",
      kid: "Maya",
      note: "Watercolour of the backyard tree.",
      color: CAT.do,
    },
  ];

  return (
    <>
      <PullToRefreshHint dark />

      {/* Mascot + share */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <SproutMascotIcon className="w-7 h-7" />
        <ShareIconButton dark />
      </div>

      {/* Eyebrow + streak pill */}
      <div className="flex items-center gap-1.5 mb-1 px-0.5">
        <span className={EYEBROW_DARK}>Wednesday</span>
        <span className="inline-flex items-center gap-0.5 px-1.5 py-[2px] rounded-full bg-[#B8945E]/30 text-[8.5px] font-semibold text-[#F4E4C1] leading-none">
          🔥 12-day streak
        </span>
      </div>

      {/* Title */}
      <h1 className="text-[#FBF8EE] font-bold mb-3 px-0.5" style={PAGE_TITLE}>
        Today
      </h1>

      {/* Composer card */}
      <div className={`${CARD} px-3 py-2.5 mb-2`}>
        <div className={`${EYEBROW_LIGHT} mb-1`}>5:42 PM</div>
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

      {/* Input chips — Voice / Photo / Text */}
      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
        {[
          { icon: Mic, label: "Voice", hint: "30 sec" },
          { icon: ImageIcon, label: "Photo", hint: "Tap to capture" },
          { icon: FileText, label: "Text", hint: "Quick note" },
        ].map((opt) => (
          <div
            key={opt.label}
            className={`${CARD} px-1 py-2 flex flex-col items-center gap-0.5`}
          >
            <div className="w-7 h-7 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center mb-0.5">
              <opt.icon className="w-3 h-3 text-[#1B3722]" strokeWidth={2} />
            </div>
            <span className="text-[9px] font-semibold text-[#1B3722]/85 leading-none">
              {opt.label}
            </span>
            <span className="text-[7px] text-[#1B3722]/50 leading-none">
              {opt.hint}
            </span>
          </div>
        ))}
      </div>

      {/* This week mini-summary */}
      <div className={`${CARD} px-3 py-2 mb-2.5`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9.5px] font-semibold text-[#1B3722]">
            This week
          </span>
          <span className="text-[8.5px] text-[#1B3722]/55">
            12 moments · 3 days left
          </span>
        </div>
        <ProgressBar pct={60} color={CAT.count} />
      </div>

      {/* Recent eyebrow */}
      <div className={`${EYEBROW_DARK} mb-1.5 px-0.5`}>Recent</div>

      {/* Recent capture cards */}
      {recents.map((r, i) => (
        <div
          key={i}
          className={`${CARD} px-2.5 py-1.5 mb-1 flex items-start gap-2`}
        >
          <div className="w-6 h-6 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
            <r.icon className="w-3 h-3 text-[#1B3722]" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-semibold text-[#1B3722] leading-none">
                  {r.kid}
                </span>
                <CategoryDot color={r.color} />
              </div>
              <span className="text-[8.5px] text-[#1B3722]/45 leading-none">
                {r.time}
              </span>
            </div>
            <p className="text-[9px] leading-snug text-[#1B3722]/70 truncate">
              {r.note}
            </p>
          </div>
        </div>
      ))}

      {/* FAB — lime CTA in dark theme */}
      <button
        className="absolute bottom-[60px] right-3 w-10 h-10 rounded-full bg-sprout-lime flex items-center justify-center shadow-[0_6px_16px_-4px_rgba(167,229,84,0.45)] z-10"
        aria-label="Quick capture"
      >
        <Plus className="w-4 h-4 text-sprout-ink" strokeWidth={2.5} />
      </button>
    </>
  );
}

/* ─── MEMORY (Charlie) — DARK theme ──────────────────────────────── */

export function PhoneScreenMemory() {
  const weeks = [
    {
      week: "Week 12",
      date: "Nov 24",
      note: "Volcano docs. 90 mins unprompted.",
      emoji: "🌋",
      count: 5,
      dots: [CAT.talk, CAT.ask, CAT.make],
    },
    {
      week: "Week 11",
      date: "Nov 17",
      note: "Sourdough Tuesday. Fractions through cookies.",
      emoji: "🍪",
      count: 4,
      dots: [CAT.count, CAT.make],
    },
    {
      week: "Week 10",
      date: "Nov 10",
      note: "Library walk. 4 books on insects.",
      emoji: "📚",
      count: 3,
      dots: [CAT.talk, CAT.ask],
    },
    {
      week: "Week 09",
      date: "Nov 3",
      note: "Built marble run. 2 hours straight.",
      emoji: "🎯",
      count: 6,
      dots: [CAT.make, CAT.count, CAT.ask],
    },
    {
      week: "Week 08",
      date: "Oct 27",
      note: "Beach day. Classified 8 tide-pool shells.",
      emoji: "🐚",
      count: 6,
      dots: [CAT.talk, CAT.ask, CAT.make, CAT.count],
    },
  ];

  return (
    <>
      <PullToRefreshHint dark />

      {/* Mascot + share */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <SproutMascotIcon className="w-7 h-7" />
        <ShareIconButton dark />
      </div>

      {/* Eyebrow + title */}
      <div className="mb-3 px-0.5">
        <span className={`${EYEBROW_DARK} block mb-1`}>Memory</span>
        <h1 className="text-[#FBF8EE] font-bold" style={PAGE_TITLE}>
          Charlie
        </h1>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1 mb-2.5 overflow-x-hidden">
        {["All", "Earth science", "Numeracy", "Reading"].map((f, i) => (
          <div
            key={f}
            className={`px-2 py-1 rounded-full text-[8.5px] font-semibold whitespace-nowrap leading-none ${
              i === 0
                ? "bg-[#FBF8EE] text-[#1B3722]"
                : "bg-[#FBF8EE]/10 text-[#FBF8EE]/70 border border-[#FBF8EE]/15"
            }`}
          >
            {f}
          </div>
        ))}
      </div>

      {/* Pattern callout with connection graph */}
      <div className={`${CARD} px-3 py-2.5 mb-2.5`}>
        <div className={`${EYEBROW_LIGHT} mb-1`}>Pattern · this term</div>
        <p
          className="text-[#1B3722] font-semibold leading-snug mb-2"
          style={{ fontSize: "12px", letterSpacing: "-0.01em" }}
        >
          Earth science: volcanoes → tectonics → ocean trenches.
        </p>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-[#2A5132] flex items-center justify-center flex-shrink-0">
            <span className="text-[8px] leading-none">🌋</span>
          </div>
          <div className="flex-1 h-px bg-[#1B3722]/20" />
          <div className="w-5 h-5 rounded-full bg-[#4D7B53] flex items-center justify-center flex-shrink-0">
            <span className="text-[8px] leading-none">🌍</span>
          </div>
          <div className="flex-1 h-px bg-[#1B3722]/20" />
          <div className="w-5 h-5 rounded-full bg-[#76A77A] flex items-center justify-center flex-shrink-0">
            <span className="text-[8px] leading-none">🌊</span>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-[7.5px] text-[#1B3722]/55 font-medium">
          <span>Volcanoes</span>
          <span>Tectonics</span>
          <span>Trenches</span>
        </div>
      </div>

      {/* Section eyebrow */}
      <div className={`${EYEBROW_DARK} mb-1 px-0.5`}>6 weeks · 24 moments</div>

      {/* Week cards */}
      {weeks.map((m) => (
        <div
          key={m.week}
          className={`${CARD} px-2.5 py-1.5 mb-1 flex items-start gap-2`}
        >
          <div className="w-7 h-7 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm leading-none">{m.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[9.5px] font-semibold text-[#1B3722] leading-none">
                {m.week}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[8.5px] text-[#1B3722]/45 leading-none">
                  {m.date}
                </span>
                <ChevronRight
                  className="w-2.5 h-2.5 text-[#1B3722]/35"
                  strokeWidth={2}
                />
              </div>
            </div>
            <p className="text-[9px] leading-snug text-[#1B3722]/70 mb-1">
              {m.note}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {m.dots.map((d, i) => (
                  <CategoryDot key={i} color={d} />
                ))}
              </div>
              <span className="text-[7.5px] text-[#1B3722]/45 font-medium leading-none">
                {m.count} moments
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Connections mini-section — cream tint, fits dark theme */}
      <div className="rounded-[16px] bg-[#FBF8EE]/10 border border-[#FBF8EE]/15 px-3 py-2 mt-1.5">
        <div className="text-[8.5px] uppercase tracking-[0.18em] text-[#FBF8EE]/65 font-bold mb-1">
          Connections
        </div>
        <p className="text-[9px] leading-snug text-[#FBF8EE]/75">
          Week 12 → Week 10: both touched numeracy through making.
        </p>
        <p className="text-[9px] leading-snug text-[#FBF8EE]/75 mt-0.5">
          Week 11 → Week 8: counting and classification both rose.
        </p>
      </div>
    </>
  );
}

/* ─── WEEKLY REPORT (Charlie's week) — LIGHT theme ───────────────── */

export function PhoneScreenReport() {
  return (
    <>
      <PullToRefreshHint />

      {/* Mascot + share */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <SproutMascotIcon className="w-7 h-7" />
        <ShareIconButton />
      </div>

      {/* Eyebrow + title */}
      <div className="mb-3 px-0.5">
        <span className={`${EYEBROW_LIGHT} block mb-1`}>Week 12 · Nov 17–23</span>
        <h1 className="text-[#1B3722] font-bold" style={PAGE_TITLE}>
          Charlie&apos;s week
        </h1>
      </div>

      {/* Segmented control */}
      <SegmentedControl
        segments={["This week", "Last week", "4 weeks"]}
        active={0}
      />

      {/* HERO */}
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
            moments
          </span>
          <div className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#A4C9A8]/15 border border-[#A4C9A8]/25">
            <ChevronUp
              className="w-2.5 h-2.5 text-[#A4C9A8]"
              strokeWidth={3}
            />
            <span className="text-[8.5px] font-semibold text-[#A4C9A8]">
              23%
            </span>
          </div>
        </div>
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

      {/* Categories eyebrow */}
      <div className={`${EYEBROW_LIGHT} mb-1 px-0.5`}>Categories</div>

      {/* Capsules */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {[
          { label: "Talk", count: 5, bg: CAT.talk },
          { label: "Count", count: 3, bg: CAT.count },
          { label: "Ask", count: 4, bg: CAT.ask },
          { label: "Make", count: 2, bg: CAT.make },
          { label: "Do", count: 4, bg: CAT.do },
        ].map((c) => (
          <div
            key={c.label}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: c.bg }}
          >
            <span className="text-[8.5px] font-semibold text-[#FBF8EE] leading-none">
              {c.label}
            </span>
            <span className="text-[8.5px] font-bold text-[#FBF8EE]/70 leading-none">
              {c.count}
            </span>
          </div>
        ))}
      </div>

      {/* Growth domains */}
      <div className={`${CARD} px-3 py-2.5 mb-2.5`}>
        <div className={`${EYEBROW_LIGHT} mb-2`}>Growth domains</div>
        <div className="space-y-1.5">
          {[
            { name: "Communication", pct: 78, count: 7, color: CAT.talk },
            { name: "Numeracy", pct: 45, count: 4, color: CAT.count },
            { name: "Curiosity", pct: 90, count: 8, color: CAT.ask },
            { name: "Making", pct: 30, count: 3, color: CAT.make },
          ].map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="text-[9px] font-semibold text-[#1B3722] w-[64px] flex-shrink-0 leading-none">
                {d.name}
              </span>
              <div className="flex-1">
                <ProgressBar pct={d.pct} color={d.color} />
              </div>
              <span className="text-[8.5px] text-[#1B3722]/55 w-2.5 text-right font-semibold leading-none">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights eyebrow */}
      <div className={`${EYEBROW_LIGHT} mb-1 px-0.5`}>Highlights</div>

      {/* Highlight cards */}
      {[
        {
          emoji: "🍪",
          day: "Tue · Baking",
          note: "Fractions, sequencing, patience.",
          tag: "Make",
          tagColor: CAT.make,
        },
        {
          emoji: "🌋",
          day: "Thu · Earth science",
          note: "Volcano docs. 90 mins unprompted.",
          tag: "Ask",
          tagColor: CAT.ask,
        },
        {
          emoji: "📚",
          day: "Sat · Library",
          note: "Picked 4 books on insects.",
          tag: "Talk",
          tagColor: CAT.talk,
        },
      ].map((h, i) => (
        <div
          key={i}
          className={`${CARD} px-2.5 py-1.5 mb-1 flex items-start gap-2`}
        >
          <div className="w-7 h-7 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center flex-shrink-0">
            <span className="text-sm leading-none">{h.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[9.5px] font-semibold text-[#1B3722] leading-none">
                {h.day}
              </span>
              <ChevronRight
                className="w-2.5 h-2.5 text-[#1B3722]/35"
                strokeWidth={2}
              />
            </div>
            <p className="text-[9px] leading-snug text-[#1B3722]/70 mb-1">
              {h.note}
            </p>
            <span
              className="inline-block px-1.5 py-[2px] rounded-full text-[7.5px] font-semibold text-white leading-none"
              style={{ backgroundColor: h.tagColor }}
            >
              {h.tag}
            </span>
          </div>
        </div>
      ))}

      {/* Patterns callout */}
      <div className="rounded-[16px] bg-[#B8945E]/12 border border-[#B8945E]/25 px-3 py-2 mb-2 mt-1.5">
        <div className="text-[8px] uppercase tracking-[0.18em] text-[#8B6A3E] font-bold mb-0.5">
          Pattern this week
        </div>
        <p className="text-[9.5px] leading-snug text-[#1B3722]/80 font-medium">
          Charlie returned to volcanoes 3 times — earth science is sticking.
        </p>
      </div>

      {/* Pinned bottom: fade + View full report + Share */}
      <div className="absolute inset-x-0 bottom-[48px] z-20 pt-7 px-4 pb-2 bg-gradient-to-b from-transparent via-[#FBF8EE]/85 to-[#FBF8EE]">
        <button className="flex items-center justify-center gap-1 w-full py-1 text-[9px] font-semibold text-[#1B3722]/65 mb-1">
          View full report
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

/* ─── YEAR (Charlie's year) — LIGHT theme ─────────────────────────── */

/* Deterministic heatmap intensity grid — 7 rows (M T W T F S S) × 12 weeks */
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

      {/* Mascot + share */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <SproutMascotIcon className="w-7 h-7" />
        <ShareIconButton />
      </div>

      {/* Eyebrow + title */}
      <div className="mb-3 px-0.5">
        <span className={`${EYEBROW_LIGHT} block mb-1`}>2026 · Term 1</span>
        <h1 className="text-[#1B3722] font-bold" style={PAGE_TITLE}>
          Charlie&apos;s year
        </h1>
      </div>

      {/* Segmented control */}
      <SegmentedControl
        segments={["Term 1", "Term 2", "Term 3", "Full year"]}
        active={0}
      />

      {/* HERO */}
      <div className="rounded-[20px] bg-gradient-to-b from-[#2A5132] to-[#1B3722] px-3.5 py-3 mb-2.5 shadow-[0_4px_16px_-4px_rgba(27,55,34,0.35)]">
        <div className="text-[8.5px] uppercase tracking-[0.2em] text-[#A4C9A8]/85 font-bold mb-1">
          Term 1
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[#FBF8EE] font-bold" style={HERO_NUMBER}>
            47
          </span>
          <span
            className="text-[#FBF8EE]/85 font-semibold pb-1"
            style={{ fontSize: "12px", letterSpacing: "-0.01em" }}
          >
            moments
          </span>
          <div className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#A4C9A8]/15 border border-[#A4C9A8]/25">
            <ChevronUp
              className="w-2.5 h-2.5 text-[#A4C9A8]"
              strokeWidth={3}
            />
            <span className="text-[8.5px] font-semibold text-[#A4C9A8]">
              11%
            </span>
          </div>
        </div>
        <div className="flex items-end gap-[2px] h-5 mb-2">
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
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#A4C9A8]/15">
          <div>
            <div className="text-[7px] uppercase tracking-wider text-[#A4C9A8]/65 font-bold leading-tight">
              Top month
            </div>
            <div className="text-[9px] text-[#FBF8EE] font-semibold leading-tight mt-0.5">
              April
            </div>
          </div>
          <div>
            <div className="text-[7px] uppercase tracking-wider text-[#A4C9A8]/65 font-bold leading-tight">
              Top domain
            </div>
            <div className="text-[9px] text-[#FBF8EE] font-semibold leading-tight mt-0.5">
              Comms
            </div>
          </div>
          <div>
            <div className="text-[7px] uppercase tracking-wider text-[#A4C9A8]/65 font-bold leading-tight">
              Streak
            </div>
            <div className="text-[9px] text-[#FBF8EE] font-semibold leading-tight mt-0.5">
              14 days
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className={`${CARD} px-3 py-2.5 mb-2.5`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className={EYEBROW_LIGHT}>Moments by week</div>
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

      {/* Domains this term */}
      <div className={`${CARD} px-3 py-2.5 mb-2.5`}>
        <div className={`${EYEBROW_LIGHT} mb-2`}>Domains this term</div>
        <div className="space-y-1.5">
          {[
            { name: "Communication", count: 18, pct: 100, color: CAT.talk },
            { name: "Curiosity", count: 14, pct: 78, color: CAT.ask },
            { name: "Making", count: 9, pct: 50, color: CAT.make },
            { name: "Numeracy", count: 6, pct: 33, color: CAT.count },
          ].map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="text-[9px] font-semibold text-[#1B3722] w-[64px] flex-shrink-0 leading-none">
                {d.name}
              </span>
              <div className="flex-1">
                <ProgressBar pct={d.pct} color={d.color} />
              </div>
              <span className="text-[8.5px] text-[#1B3722]/55 w-3 text-right font-semibold leading-none">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly eyebrow */}
      <div className={`${EYEBROW_LIGHT} mb-1 px-0.5`}>Monthly</div>

      {/* Monthly rows */}
      {[
        { month: "March", count: 18, delta: "+4", trend: [3, 4, 5, 6] },
        { month: "April", count: 22, delta: "+4", trend: [4, 6, 5, 7] },
        { month: "May", count: 7, delta: "−15", trend: [3, 2, 1, 1] },
      ].map((m) => (
        <div
          key={m.month}
          className={`${CARD} px-2.5 py-1.5 mb-1 flex items-center gap-2`}
        >
          <span className="text-[10px] font-semibold text-[#1B3722] w-10 leading-none">
            {m.month}
          </span>
          <div className="flex-1 flex items-end gap-[2px] h-4">
            {m.trend.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${(v / 7) * 100}%`,
                  minHeight: "2px",
                  backgroundColor: m.delta.startsWith("+")
                    ? "#76A77A"
                    : "#B8945E",
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
          <span className="text-[9.5px] text-[#1B3722]/65 font-medium leading-none">
            {m.count}
          </span>
          <span
            className={`text-[8.5px] font-semibold w-7 text-right leading-none ${
              m.delta.startsWith("+") ? "text-[#76A77A]" : "text-[#B8945E]"
            }`}
          >
            {m.delta}
          </span>
        </div>
      ))}

      {/* Year highlights carousel */}
      <div className={`${EYEBROW_LIGHT} mb-1 px-0.5 mt-2`}>Year highlights</div>
      <div className="flex gap-1.5 overflow-x-hidden -mx-4 px-4 pb-1">
        {[
          { emoji: "🌋", title: "Volcano month", note: "Apr · 12 moments" },
          { emoji: "🍪", title: "Sourdough run", note: "Mar · 7 moments" },
          { emoji: "📚", title: "Insect deep-dive", note: "May · 5 moments" },
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
