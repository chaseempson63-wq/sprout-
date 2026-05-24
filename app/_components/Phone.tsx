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
} from "lucide-react";
import { SproutMascotIcon } from "./SproutMascotIcon";

/* ─────────────────────────────────────────────────────────────────────
   Phone mockups — full rebuild 2026-05-24.

   Reference DNA:
   - Apple Health Summary: large native-iOS page title at top, pinned
     white cards on cream background with single hairline border +
     subtle shadow, generous 14-18px padding, type-as-design hierarchy
   - Oura 2025 redesign: oversized hero number (50px+ at phone scale),
     single-signal focus, breathing room
   - Sprout brand: cream/forest palette, mascot present on artifact
     screens, no decorative marketing flourishes

   Replaces the prior cream-on-cream illustration style with white
   cards on cream surface (real elevation), 22px native page titles,
   52px hero metrics on Report + Year.
   ───────────────────────────────────────────────────────────────────── */

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
          <div className="absolute top-0 inset-x-0 h-10 px-6 flex items-center justify-between text-[10px] font-bold text-[#1B3722] z-20">
            <span>9:41</span>
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black" />
            <span>·</span>
          </div>

          {/* Content area */}
          <div className="absolute inset-0 pt-11 pb-14 px-4 flex flex-col">{children}</div>

          {/* Tab bar */}
          <div className="absolute bottom-0 inset-x-0 h-12 px-3 pb-2 pt-1.5 flex items-center justify-around bg-[#FBF8EE]/85 backdrop-blur-xl border-t border-[#1B3722]/5">
            <div className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full bg-[#1B3722]">
              <HomeIcon className="w-3.5 h-3.5 text-[#F4EDE0]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#1B3722]/35" strokeWidth={2} />
            </div>
            <div className="flex flex-col items-center gap-0.5 px-3 py-1">
              <SettingsIcon className="w-3.5 h-3.5 text-[#1B3722]/35" strokeWidth={2} />
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-[#1B3722]/40" />
        </div>
      </div>
    </div>
  );
}

/* ─── Shared atoms ────────────────────────────────────────────────── */

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

const CARD =
  "rounded-[20px] bg-white border border-[#1B3722]/6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]";
const EYEBROW =
  "text-[9px] uppercase tracking-[0.18em] text-[#1B3722]/55 font-bold";
const PAGE_TITLE = { fontSize: "22px", lineHeight: "1.1", letterSpacing: "-0.02em" };
const HERO_NUMBER = { fontSize: "52px", lineHeight: "1", letterSpacing: "-0.03em" };

/* ─── DROP IN — Apple Health Summary feel ─────────────────────────── */
export function PhoneScreenDropIn() {
  return (
    <>
      {/* Native iOS header */}
      <div className="mb-3 px-0.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className={EYEBROW}>Wednesday</span>
          <ShareIconButton />
        </div>
        <h1 className="text-[#1B3722] font-bold" style={PAGE_TITLE}>
          Today
        </h1>
      </div>

      {/* Composer card */}
      <div className={`${CARD} px-3.5 py-3 mb-2.5`}>
        <div className={`${EYEBROW} mb-1.5`}>5:42 PM</div>
        <p
          className="text-[#1B3722] font-semibold leading-tight mb-1"
          style={{ fontSize: "14px", letterSpacing: "-0.01em" }}
        >
          What did Charlie do today?
        </p>
        <p className="text-[10.5px] text-[#1B3722]/60 leading-snug">
          Voice memo, photo, or one sentence.
        </p>
      </div>

      {/* Input chips */}
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        {[
          { icon: Mic, label: "Voice" },
          { icon: ImageIcon, label: "Photo" },
          { icon: FileText, label: "Text" },
        ].map((opt) => (
          <div
            key={opt.label}
            className={`${CARD} px-2 py-3 flex flex-col items-center gap-1.5`}
          >
            <div className="w-9 h-9 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center">
              <opt.icon className="w-4 h-4 text-[#1B3722]" strokeWidth={2} />
            </div>
            <span className="text-[9.5px] font-semibold text-[#1B3722]/85">
              {opt.label}
            </span>
          </div>
        ))}
      </div>

      {/* Recent eyebrow */}
      <div className={`${EYEBROW} mb-1.5 px-0.5`}>Recent</div>

      {/* Recent drops list */}
      <div className={`${CARD} px-3 py-2.5 mb-1.5`}>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-semibold text-[#1B3722]">Charlie</span>
          <span className="text-[9px] text-[#1B3722]/45">5:42 PM</span>
        </div>
        <p className="text-[10px] leading-snug text-[#1B3722]/70">
          &ldquo;40 mins on volcano questions today.&rdquo;
        </p>
      </div>
      <div className={`${CARD} px-3 py-2.5`}>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-semibold text-[#1B3722]">Charlie</span>
          <span className="text-[9px] text-[#1B3722]/45">Yesterday</span>
        </div>
        <p className="text-[10px] leading-snug text-[#1B3722]/70">
          Baked sourdough. Fractions in the recipe.
        </p>
      </div>

      <div className="flex-1" />
    </>
  );
}

/* ─── MEMORY — pattern hero + week feed ──────────────────────────── */
export function PhoneScreenMemory() {
  return (
    <>
      <div className="mb-3 px-0.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className={EYEBROW}>Memory</span>
          <ShareIconButton />
        </div>
        <h1 className="text-[#1B3722] font-bold" style={PAGE_TITLE}>
          Charlie
        </h1>
      </div>

      {/* Pattern callout */}
      <div className={`${CARD} px-3.5 py-3 mb-3`}>
        <div className={`${EYEBROW} mb-1.5`}>Pattern · this term</div>
        <p
          className="text-[#1B3722] font-semibold leading-snug"
          style={{ fontSize: "13px", letterSpacing: "-0.01em" }}
        >
          Earth science: volcanoes → tectonics → ocean trenches.
        </p>
      </div>

      {/* Section eyebrow */}
      <div className={`${EYEBROW} mb-1.5 px-0.5`}>6 weeks · 24 moments</div>

      {/* Week cards */}
      {[
        { week: "Week 12", date: "Nov 24", note: "Volcano docs. 90 mins unprompted.", emoji: "🌋" },
        { week: "Week 11", date: "Nov 17", note: "Sourdough Tuesday. Fractions through cookies.", emoji: "🍪" },
        { week: "Week 10", date: "Nov 10", note: "Library walk. 4 books on insects.", emoji: "📚" },
      ].map((m) => (
        <div
          key={m.week}
          className={`${CARD} px-3 py-2.5 mb-1.5 flex items-start gap-2.5`}
        >
          <div className="w-9 h-9 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center flex-shrink-0">
            <span className="text-base leading-none">{m.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-semibold text-[#1B3722]">
                {m.week}
              </span>
              <span className="text-[9px] text-[#1B3722]/45">{m.date}</span>
            </div>
            <p className="text-[10px] leading-snug text-[#1B3722]/70">{m.note}</p>
          </div>
        </div>
      ))}

      <div className="flex-1" />
    </>
  );
}

/* ─── REPORT — Oura single-signal hero + capsules + highlights ───── */
export function PhoneScreenReport() {
  return (
    <>
      {/* Header with mascot inline */}
      <div className="mb-3 px-0.5">
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

      {/* HERO — Oura DNA, oversized single signal */}
      <div className="rounded-[22px] bg-gradient-to-b from-[#2A5132] to-[#1B3722] px-4 py-4 mb-3 shadow-[0_4px_16px_-4px_rgba(27,55,34,0.35)]">
        <div className="text-[9px] uppercase tracking-[0.2em] text-[#A4C9A8]/85 font-bold mb-1.5">
          This week
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[#FBF8EE] font-bold" style={HERO_NUMBER}>
            18
          </span>
          <span
            className="text-[#FBF8EE]/85 font-semibold pb-1.5"
            style={{ fontSize: "13px", letterSpacing: "-0.01em" }}
          >
            moments
          </span>
        </div>
        <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#A4C9A8]/15 border border-[#A4C9A8]/25">
          <ChevronUp className="w-2.5 h-2.5 text-[#A4C9A8]" strokeWidth={3} />
          <span className="text-[9px] font-semibold text-[#A4C9A8]">
            23% vs last week
          </span>
        </div>
      </div>

      {/* Categories eyebrow */}
      <div className={`${EYEBROW} mb-1.5 px-0.5`}>Categories</div>

      {/* Capsules — 4 greens + 1 warm amber */}
      <div className="flex flex-wrap gap-1 mb-3">
        {[
          { label: "Talk", count: 5, bg: "#2A5132" },
          { label: "Count", count: 3, bg: "#4D7B53" },
          { label: "Ask", count: 4, bg: "#B8945E" },
          { label: "Make", count: 2, bg: "#76A77A" },
          { label: "Do", count: 4, bg: "#1B3722" },
        ].map((c) => (
          <div
            key={c.label}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: c.bg }}
          >
            <span className="text-[9px] font-semibold text-[#FBF8EE]">
              {c.label}
            </span>
            <span className="text-[9px] font-bold text-[#FBF8EE]/70">
              {c.count}
            </span>
          </div>
        ))}
      </div>

      {/* Highlights eyebrow */}
      <div className={`${EYEBROW} mb-1.5 px-0.5`}>Highlights</div>

      {/* Highlight card */}
      <div className={`${CARD} px-3 py-2.5 mb-1.5 flex items-start gap-2.5`}>
        <div className="w-9 h-9 rounded-full bg-[#A4C9A8]/25 flex items-center justify-center flex-shrink-0">
          <span className="text-base leading-none">🍪</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-semibold text-[#1B3722]">
              Tuesday · Baking
            </span>
            <ChevronRight className="w-3 h-3 text-[#1B3722]/35" strokeWidth={2} />
          </div>
          <p className="text-[10px] leading-snug text-[#1B3722]/70">
            Fractions, sequencing, patience.
          </p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Share button — flat native iOS style, not gradient */}
      <button className="w-full h-10 rounded-full bg-[#1B3722] text-[#FBF8EE] text-[11px] font-semibold flex items-center justify-center gap-1.5">
        <Share2 className="w-3 h-3" strokeWidth={2.5} />
        Share Charlie&apos;s week
      </button>
    </>
  );
}

/* ─── YEAR — same hero treatment, heatmap, monthly rows ──────────── */
export function PhoneScreenYear() {
  return (
    <>
      <div className="mb-3 px-0.5">
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

      {/* HERO — same as Weekly for cohesion */}
      <div className="rounded-[22px] bg-gradient-to-b from-[#2A5132] to-[#1B3722] px-4 py-4 mb-3 shadow-[0_4px_16px_-4px_rgba(27,55,34,0.35)]">
        <div className="text-[9px] uppercase tracking-[0.2em] text-[#A4C9A8]/85 font-bold mb-1.5">
          Term 1
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[#FBF8EE] font-bold" style={HERO_NUMBER}>
            47
          </span>
          <span
            className="text-[#FBF8EE]/85 font-semibold pb-1.5"
            style={{ fontSize: "13px", letterSpacing: "-0.01em" }}
          >
            moments
          </span>
        </div>
        <div className="text-[10px] text-[#FBF8EE]/65">
          12 weeks · March → May
        </div>
      </div>

      {/* Heatmap card */}
      <div className={`${CARD} px-3 py-3 mb-3`}>
        <div className={`${EYEBROW} mb-2`}>Moments by week</div>
        <div className="grid grid-cols-12 gap-[3px]">
          {Array.from({ length: 48 }).map((_, i) => {
            const intensity =
              Math.random() > 0.3 ? "bg-[#76A77A]" : "bg-[#A4C9A8]/30";
            return (
              <div
                key={i}
                className={`aspect-square rounded-[2px] ${intensity}`}
                style={{ opacity: 0.5 + Math.random() * 0.5 }}
              />
            );
          })}
        </div>
      </div>

      {/* Monthly eyebrow */}
      <div className={`${EYEBROW} mb-1.5 px-0.5`}>Monthly</div>

      {/* Monthly rows */}
      {[
        { month: "March", count: 18, delta: "+4" },
        { month: "April", count: 22, delta: "+4" },
        { month: "May", count: 7, delta: "−15" },
      ].map((m) => (
        <div
          key={m.month}
          className={`${CARD} px-3 py-2.5 mb-1.5 flex items-center justify-between`}
        >
          <span className="text-[11px] font-semibold text-[#1B3722]">
            {m.month}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-[#1B3722]/60">{m.count}</span>
            <span
              className={`text-[9px] font-semibold ${
                m.delta.startsWith("+") ? "text-[#76A77A]" : "text-[#B8945E]"
              }`}
            >
              {m.delta}
            </span>
          </div>
        </div>
      ))}

      <div className="flex-1" />
    </>
  );
}
