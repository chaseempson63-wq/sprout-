"use client";

import { useState } from "react";

/*
  Interactive earnings calculator for the partner page.
  Drag the slider (or tap a preset) → see what your audience could be worth.

  PER_FAMILY math: $29/mo placeholder price, less the buyer's 20% discount
  ($23.20), times the 20% creator commission = $4.64 a family, every month,
  for a full 12 months. Honest figure, not rounded up (see docs/AFFILIATE.md
  — over-promising burns the exact trust this channel runs on).
*/
const PER_FAMILY = 4.64;
const MIN = 1;
const MAX = 400;
const PRESETS = [10, 25, 50, 100, 200, 400];

// Deterministic thousands formatter — avoids toLocaleString() locale drift
// between server and client render (hydration safety).
const fmt = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function EarningsCalculator() {
  const [families, setFamilies] = useState(50);

  const perMonth = families * PER_FAMILY;
  const perYear = perMonth * 12;
  const pct = ((families - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="rounded-[28px] border border-sprout-cream/10 bg-[#0C1610]/80 backdrop-blur-xl p-6 md:p-9 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between gap-4 mb-7">
        <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/55 font-bold">
          Your numbers
        </div>
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#CDEFA0]/80 font-bold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#CDEFA0] opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#CDEFA0]" />
          </span>
          Live
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
        {/* Control side — slider + presets */}
        <div>
          <div className="text-sprout-cream/70 text-sm font-semibold mb-1">
            Families you bring on
          </div>
          <div
            className="font-display font-extrabold text-sprout-cream leading-none mb-6"
            style={{ fontSize: "clamp(40px, 6vw, 64px)" }}
          >
            {fmt(families)}
          </div>

          <input
            type="range"
            min={MIN}
            max={MAX}
            value={families}
            onChange={(e) => setFamilies(Number(e.target.value))}
            aria-label="Families you bring on"
            className="w-full h-2.5 rounded-full appearance-none cursor-pointer outline-none
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sprout-cream
              [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#CDEFA0]
              [&::-webkit-slider-thumb]:shadow-[0_4px_14px_-2px_rgba(0,0,0,0.6)] [&::-webkit-slider-thumb]:cursor-grab
              [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-sprout-cream [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#CDEFA0]
              [&::-moz-range-thumb]:cursor-grab focus-visible:ring-2 focus-visible:ring-[#CDEFA0]/50"
            style={{
              background: `linear-gradient(to right, #CDEFA0 ${pct}%, rgba(253,253,253,0.12) ${pct}%)`,
            }}
          />

          <div className="flex flex-wrap gap-2 mt-6">
            {PRESETS.map((p) => {
              const active = families === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFamilies(p)}
                  className={
                    active
                      ? "px-3.5 py-1.5 rounded-full text-sm font-bold bg-[#CDEFA0] text-[#10210A] transition-colors"
                      : "px-3.5 py-1.5 rounded-full text-sm font-semibold bg-sprout-cream/8 text-sprout-cream/75 border border-sprout-cream/12 hover:bg-sprout-cream/14 transition-colors"
                  }
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Outcome side — the money */}
        <div className="rounded-3xl bg-sprout-cream/[0.04] border border-sprout-cream/10 p-7">
          <div className="text-sprout-cream/60 text-xs uppercase tracking-[0.25em] font-bold mb-3">
            You keep, every month
          </div>
          <div
            className="font-display font-extrabold leading-none text-[#CDEFA0]"
            style={{ fontSize: "clamp(48px, 8vw, 84px)" }}
          >
            ${fmt(perMonth)}
            <span className="text-sprout-cream/45 text-2xl font-bold">/mo</span>
          </div>

          {/* Meter — fills with the slider, the one thing that animates */}
          <div className="mt-6 h-2 rounded-full bg-sprout-cream/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9FD16A] to-[#CDEFA0] transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(pct, 2)}%` }}
            />
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display font-extrabold text-sprout-cream text-2xl">
              ${fmt(perYear)}
            </span>
            <span className="text-sprout-cream/60 text-sm">
              across their first year
            </span>
          </div>

          <p className="mt-5 text-sprout-cream/50 text-[13px] leading-relaxed">
            About $4.64 a family, every month, for a full year. It builds as
            your people come across. The more you bring on, the more it
            compounds.
          </p>
        </div>
      </div>
    </div>
  );
}
