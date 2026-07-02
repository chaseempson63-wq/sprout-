/*
  Sprout Resources design system — "paper on the green desk."

  The whole platform reads as one warm forest-green desk; everything you can
  pick up is a piece of warm cream paper. Cards are SHEETS: cream paper with a
  stacked-paper shadow (a small pile of worksheets), real children's-book
  illustrations as STICKERS stuck slightly over the edge, Nunito-900 titles,
  and a gentle hand-placed tilt that straightens when you reach for it.

  Rules this system encodes (docs/BRAND.md):
  - Cream on green. Primary CTAs on the green canvas are CREAM with forest
    text; inside cream surfaces the inversion flips (forest button, cream text).
  - No pure black or white — Ink (#1B3722) and warm paper (#FFFDF6).
  - Warmth from real textures (paper, illustration, wave), never pastel noise.
  - One typeface; weight carries hierarchy (bold here = Nunito 900 via tokens).
*/

import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Paper surfaces ────────────────────────────────────────────────────

export const PAPER = "#FFFDF6"; // the sheet
export const PAPER_UNDER = "#F3EDDD"; // sheets underneath in a stack
export const INK = "#1B3722";
export const FOREST = "#2E5A35";

/** Base sheet: warm paper, soft deep shadow, hairline forest ring. */
export const sheet =
  "rounded-[22px] bg-[#FFFDF6] ring-1 ring-[#2E5A35]/10 " +
  "shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_14px_30px_-14px_rgba(8,22,12,0.55),0_30px_60px_-30px_rgba(8,22,12,0.4)]";

/** A sheet sitting on a small pile — two offset papers behind it. */
export function SheetStack({
  className,
  tilt = 0,
  children,
}: {
  className?: string;
  /** degrees; the whole pile leans, the top sheet straightens on hover */
  tilt?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="group/sheet relative h-full" style={{ transform: `rotate(${tilt}deg)` }}>
      <span
        aria-hidden
        className="absolute inset-x-2 -bottom-1.5 top-2 rounded-[22px] bg-[#EFE8D6] shadow-[0_10px_24px_-14px_rgba(8,22,12,0.5)]"
        style={{ transform: "rotate(1.6deg)" }}
      />
      <span
        aria-hidden
        className="absolute inset-x-1 -bottom-0.5 top-1 rounded-[22px] bg-[#F6F1E3]"
        style={{ transform: "rotate(-1deg)" }}
      />
      <div
        className={cn(
          sheet,
          "relative transition-transform duration-300 ease-out group-hover/sheet:-translate-y-1.5 group-hover/sheet:rotate-0",
          className,
        )}
        style={{ transform: `rotate(${-tilt}deg)` }}
      >
        {children}
      </div>
    </div>
  );
}

/** Deterministic small tilt from an index so grids read hand-placed, not random. */
export function tiltFor(i: number): number {
  const tilts = [-1.1, 0.9, -0.6, 1.2, -0.9, 0.6];
  return tilts[((i % tilts.length) + tilts.length) % tilts.length];
}

// ── Illustration sticker ──────────────────────────────────────────────

/** A real illustration in a white sticker frame, stuck on at a slight angle. */
export function Sticker({
  imageKey,
  size = 84,
  angle = -4,
  className,
}: {
  imageKey?: string;
  size?: number;
  angle?: number;
  className?: string;
}) {
  if (!imageKey) return null;
  return (
    <span
      className={cn(
        "block overflow-hidden rounded-2xl bg-white p-1 shadow-[0_8px_18px_-8px_rgba(8,22,12,0.5)] ring-1 ring-[#2E5A35]/10",
        className,
      )}
      style={{ width: size, height: size, transform: `rotate(${angle}deg)` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local static webp, fixed size */}
      <img src={`/resources/illustrations/${imageKey}.webp`} alt="" className="size-full rounded-xl object-cover" />
    </span>
  );
}

// ── Small paper details ──────────────────────────────────────────────

/** Age range pill, worn like a price tag. */
export function AgeTag({ min, max, className }: { min: number; max: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-[#2E5A35]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#2E5A35]", className)}>
      ages {min}–{max}
    </span>
  );
}

/** The wavy paper edge, carved along the bottom of an illustration band. */
export function WaveEdge({ fill = PAPER, className }: { fill?: string; className?: string }) {
  return (
    <svg viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-5 w-full", className)}>
      <path d="M0,44 V26 C180,44 340,10 520,24 C700,38 860,8 1000,22 V44 Z" fill={fill} />
    </svg>
  );
}

/** Faint ruled lines, like the bottom of a worksheet. Use sparingly. */
export function RuledLines({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-b border-dashed border-[#1B3722]/12" />
      ))}
    </div>
  );
}

// ── Actions ───────────────────────────────────────────────────────────

/** Primary CTA on the GREEN canvas: cream pill, forest text (the brand move). */
export const creamCta =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#FFFDF6] px-6 font-bold text-[#1B3722] " +
  "shadow-[0_14px_30px_-12px_rgba(8,22,12,0.65),inset_0_1px_0_rgba(255,255,255,0.9)] " +
  "transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

/** Primary CTA on CREAM paper: forest pill, cream text (the inversion). */
export const forestCta =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#2E5A35] px-6 font-bold text-white " +
  "shadow-[0_12px_28px_-10px_rgba(46,90,53,0.7)] transition hover:-translate-y-0.5 hover:bg-[#346a3f] active:scale-95 " +
  "disabled:pointer-events-none disabled:opacity-50";

/** A quiet paper chip (secondary action on cream). */
export const paperChip =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-[#2E5A35]/20 bg-white/60 font-bold text-[#1B3722]/80 " +
  "transition hover:bg-white active:scale-95";

// ── Section headings on the green desk ───────────────────────────────

export function DeskHeading({
  eyebrow,
  title,
  blurb,
  className,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="text-sprout-lime text-xs font-bold tracking-[0.2em] uppercase">{eyebrow}</p>}
      <h2 className="text-sprout-cream mt-1 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{title}</h2>
      {blurb && <p className="text-sprout-cream/70 mt-1.5 max-w-xl text-sm sm:text-base">{blurb}</p>}
    </div>
  );
}

/** Card link wrapper that keeps the whole sheet clickable. */
export function SheetLink({ href, className, children, tilt = 0, delay = 0 }: { href: string; className?: string; children: React.ReactNode; tilt?: number; delay?: number }) {
  return (
    <Link
      href={href}
      style={{ animationDelay: `${delay}ms` }}
      className={cn("animate-in fade-in slide-in-from-bottom-3 fill-mode-both block duration-500", className)}
    >
      <SheetStack tilt={tilt} className="h-full">
        {children}
      </SheetStack>
    </Link>
  );
}
