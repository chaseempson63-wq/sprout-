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
} from "lucide-react";
import { SproutLogo } from "./Glass";
import { SproutMascotIcon } from "./SproutMascotIcon";

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
        <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-b from-[#FBF8EE] via-[#F6F1E0] to-[#EFE7CF]">
          <div className="absolute top-0 inset-x-0 h-10 px-6 flex items-center justify-between text-[10px] font-bold text-[#1B3722] z-20">
            <span>9:41</span>
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black" />
            <span>·</span>
          </div>

          <div className="absolute inset-0 pt-12 pb-14 px-3.5 flex flex-col">{children}</div>

          <div className="absolute bottom-0 inset-x-0 h-12 px-3 pb-2 pt-1.5 flex items-center justify-around bg-gradient-to-t from-[#FBF8EE] via-[#FBF8EE]/95 to-[#FBF8EE]/40 backdrop-blur-xl border-t border-[#1B3722]/5">
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

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-[#1B3722]/40" />
        </div>
      </div>
    </div>
  );
}

/* ─── Small header used by non-hero screens (Quick log, Memory) ─── */
function PhoneHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-1.5 text-[#1B3722]">
        <SproutLogo className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{title}</span>
      </div>
      <button className="w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center border border-[#1B3722]/8" aria-label="Share">
        <Share2 className="w-3 h-3 text-[#1B3722]" strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ─── Hero header with mascot — used by Report + Year ───────────── */
function PhoneHeroHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-1.5 text-[#1B3722]">
        <SproutMascotIcon className="w-5 h-5" />
        <span className="text-[11px] font-bold tracking-tight">{title}</span>
      </div>
      <button className="w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center border border-[#1B3722]/8" aria-label="Share">
        <Share2 className="w-3 h-3 text-[#1B3722]" strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ─── Phone content: quick log — composer + chips + recent drops ─── */
export function PhoneScreenDropIn() {
  return (
    <>
      <PhoneHeader title="Today" />

      {/* Composer hero card — cream-on-cream, calm */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FBF8EE] to-[#F6F1E0] border border-[#1B3722]/8 p-3.5 mb-2.5 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)]">
        <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/55 font-bold mb-1.5">
          Wed · 5:42pm
        </div>
        <p className="text-[13px] font-bold text-[#1B3722] leading-tight mb-1.5">
          What did Charlie do today?
        </p>
        <p className="text-[10px] text-[#1B3722]/65 leading-snug">
          Drop in anything. Voice memo, photo, one sentence.
        </p>
      </div>

      {/* Three input chips */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {[
          { icon: Mic, label: "Voice" },
          { icon: ImageIcon, label: "Photo" },
          { icon: FileText, label: "Text" },
        ].map((opt) => (
          <div
            key={opt.label}
            className="rounded-2xl bg-white/85 border border-[#1B3722]/8 p-2.5 flex flex-col items-center gap-1 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.04)]"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#F4EDE0] to-[#E6DDC2] flex items-center justify-center">
              <opt.icon className="w-3.5 h-3.5 text-[#1B3722]" strokeWidth={2} />
            </div>
            <span className="text-[8px] uppercase tracking-wider text-[#1B3722]/70 font-bold">
              {opt.label}
            </span>
          </div>
        ))}
      </div>

      {/* Recent drops stack */}
      <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/55 font-bold mb-1.5 px-1">
        Recent drops
      </div>
      <div className="rounded-2xl bg-white/75 border border-[#1B3722]/8 p-2.5 mb-1.5">
        <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/45 font-bold mb-1">
          Wed · 5:42pm
        </div>
        <p className="text-[9px] leading-snug text-[#1B3722]/75">
          &ldquo;Charlie spent 40 mins on volcano questions today.&rdquo;
        </p>
        <div className="text-[8px] text-[#1B3722]/40 mt-1">Tagged · Charlie</div>
      </div>
      <div className="rounded-2xl bg-white/75 border border-[#1B3722]/8 p-2.5">
        <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/45 font-bold mb-1">
          Tue · 7:18pm
        </div>
        <p className="text-[9px] leading-snug text-[#1B3722]/75">
          Baked sourdough together. Fractions in the recipe.
        </p>
        <div className="text-[8px] text-[#1B3722]/40 mt-1">Tagged · Charlie</div>
      </div>

      <div className="flex-1" />
    </>
  );
}

/* ─── Phone content: memory thread — pattern callout + week feed ─── */
export function PhoneScreenMemory() {
  return (
    <>
      <PhoneHeader title="Charlie" />

      {/* Pattern callout — the narrative one-liner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#FBF8EE] to-[#F6F1E0] border border-[#1B3722]/8 p-3 mb-3 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
        <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/55 font-bold mb-1">
          Pattern this term
        </div>
        <p className="text-[11px] font-bold text-[#1B3722] leading-snug">
          Earth science: volcanoes → tectonics → ocean trenches.
        </p>
      </div>

      <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/55 font-bold mb-1.5 px-1">
        6 weeks of moments
      </div>

      {[
        { week: "Week 12", note: "Volcano docs · 90 mins unprompted Earth science.", icon: "🌋" },
        { week: "Week 11", note: "Sourdough Tuesday · fractions through cookies.", icon: "🍪" },
        { week: "Week 10", note: "Library walk · picked 4 books on insects.", icon: "📚" },
        { week: "Week 9", note: "First poem written. Read out loud at dinner.", icon: "✍️" },
      ].map((m) => (
        <div
          key={m.week}
          className="rounded-2xl bg-white/75 border border-[#1B3722]/8 p-2.5 mb-1.5"
        >
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F4EDE0] to-[#E6DDC2] flex items-center justify-center flex-shrink-0">
              <span className="text-sm">{m.icon}</span>
            </div>
            <div className="flex-1">
              <div className="text-[9px] font-bold text-[#1B3722]">{m.week}</div>
              <p className="text-[9px] leading-snug text-[#1B3722]/75">{m.note}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="flex-1" />
    </>
  );
}

/* ─── Phone content: weekly report — marquee artifact ──────────────
   Hero: mascot header → forest-gradient hero card with eyebrow, giant
   number, soft sage delta pill. Below: 5 category capsules (Sprout
   palette + 1 warm amber). Below: highlights stack. Bottom: share. */
export function PhoneScreenReport() {
  return (
    <>
      <PhoneHeroHeader title="Charlie's week" />

      {/* Hero card — forest gradient with hero metric + delta pill */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3D6643] via-[#2A5132] to-[#1B3722] p-4 mb-3 shadow-[0_8px_24px_-6px_rgba(27,55,34,0.45)]">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#94BC8E]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-32 h-32 rounded-full bg-[#76A77A]/25 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="text-[8px] uppercase tracking-[0.2em] text-[#A4C9A8] font-bold mb-2">
            Week 12 of 52
          </div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-[#A4C9A8]/70 font-bold mb-1">
            This week
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[#FBF8EE] font-bold leading-none" style={{ fontSize: "34px" }}>
              18
            </span>
            <span className="text-[#FBF8EE]/85 font-bold leading-tight pb-1" style={{ fontSize: "11px" }}>
              moments
            </span>
            <div className="ml-auto inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#A4C9A8]/25 border border-[#A4C9A8]/35 text-[#A4C9A8] text-[9px] font-bold">
              <ChevronUp className="w-2.5 h-2.5" strokeWidth={3} />
              23%
            </div>
          </div>
        </div>
      </div>

      {/* Category capsules — 5 in Sprout palette (4 greens + 1 warm amber) */}
      <div className="flex flex-wrap gap-1 mb-3 px-0.5">
        {[
          { label: "Talk", count: 5, bg: "#2A5132" },
          { label: "Count", count: 3, bg: "#4D7B53" },
          { label: "Ask", count: 4, bg: "#B8945E" },
          { label: "Make", count: 2, bg: "#76A77A" },
          { label: "Do", count: 4, bg: "#1B3722" },
        ].map((c) => (
          <div
            key={c.label}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ backgroundColor: c.bg }}
          >
            <span className="text-[8px] font-bold uppercase tracking-wider text-[#FBF8EE]">
              {c.label}
            </span>
            <span className="text-[8px] font-bold text-[#FBF8EE]/75">{c.count}</span>
          </div>
        ))}
      </div>

      {/* Highlights eyebrow + card */}
      <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/55 font-bold mb-1.5 px-1">
        Highlights
      </div>
      <div className="rounded-2xl bg-white/85 border border-[#1B3722]/6 p-2.5 mb-1.5">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F4EDE0] to-[#E6DDC2] flex items-center justify-center flex-shrink-0">
            <span className="text-sm">🍪</span>
          </div>
          <div className="flex-1">
            <div className="text-[9px] font-bold text-[#1B3722]">Tuesday · Baking</div>
            <p className="text-[9px] leading-snug text-[#1B3722]/75">
              Fractions, sequencing, patience.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <button className="w-full h-9 rounded-full bg-gradient-to-b from-[#2A5132] to-[#1B3722] text-[#F4EDE0] text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-[0_6px_16px_-2px_rgba(27,55,34,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]">
        <Share2 className="w-3 h-3" strokeWidth={2.5} />
        Share Charlie&apos;s week
      </button>
    </>
  );
}

/* ─── Phone content: year snapshot — cumulative growth ─────────────
   Hero: mascot header → forest-gradient hero card matching Weekly
   report for cohesion. Below: heatmap module. Below: monthly snapshot
   rows with up/down chevrons for direction. */
export function PhoneScreenYear() {
  return (
    <>
      <PhoneHeroHeader title="Year · 2026" />

      {/* Hero card — same forest gradient as Weekly report */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3D6643] via-[#2A5132] to-[#1B3722] p-4 mb-3 shadow-[0_8px_24px_-6px_rgba(27,55,34,0.45)]">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#94BC8E]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-32 h-32 rounded-full bg-[#76A77A]/25 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="text-[8px] uppercase tracking-[0.2em] text-[#A4C9A8] font-bold mb-2">
            Charlie · Term 1
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[#FBF8EE] font-bold leading-none" style={{ fontSize: "34px" }}>
              47
            </span>
            <span className="text-[#FBF8EE]/85 font-bold leading-tight pb-1" style={{ fontSize: "11px" }}>
              moments
            </span>
            <div className="ml-auto inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#A4C9A8]/25 border border-[#A4C9A8]/35 text-[#A4C9A8] text-[9px] font-bold">
              <ChevronUp className="w-2.5 h-2.5" strokeWidth={3} />
              +8 vs T0
            </div>
          </div>
          <div className="text-[9px] text-[#FBF8EE]/65 mt-1.5">
            12 weeks · March through May
          </div>
        </div>
      </div>

      {/* Heatmap module */}
      <div className="rounded-2xl bg-white/85 border border-[#1B3722]/8 p-3 mb-3 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.04)]">
        <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/55 font-bold mb-2">
          Moments by week
        </div>
        <div className="grid grid-cols-12 gap-0.5">
          {Array.from({ length: 48 }).map((_, i) => {
            const intensity = Math.random() > 0.3 ? "bg-[#76A77A]" : "bg-[#A4C9A8]/40";
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

      {/* Monthly snapshots — with up/down delta chevrons */}
      <div className="text-[8px] uppercase tracking-[0.2em] text-[#1B3722]/55 font-bold mb-1.5 px-1">
        Monthly snapshots
      </div>
      {[
        { month: "March", count: 18, delta: "up" as const },
        { month: "April", count: 22, delta: "up" as const },
        { month: "May", count: 7, delta: "down" as const },
      ].map((m) => (
        <div
          key={m.month}
          className="rounded-2xl bg-white/75 border border-[#1B3722]/8 p-2.5 mb-1 flex items-center justify-between"
        >
          <div className="text-[10px] font-bold text-[#1B3722]">{m.month}</div>
          <div className="flex items-center gap-1.5">
            <div className="text-[9px] text-[#1B3722]/65">{m.count} moments</div>
            <ChevronUp
              className={`w-2.5 h-2.5 ${m.delta === "up" ? "text-[#76A77A]" : "text-[#B8945E] rotate-180"}`}
              strokeWidth={3}
            />
          </div>
        </div>
      ))}

      <div className="flex-1" />
    </>
  );
}
