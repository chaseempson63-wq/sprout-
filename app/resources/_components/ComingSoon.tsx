"use client";

// The COMING SOON system for the Resources demo stage (see lib/resources/demo).
// Two surfaces, one content source:
//   <ComingSoonModal>  — pops over the library when a teased feature is tapped.
//   <ComingSoonPage>   — full-page version for direct visits to the gated
//                        routes (/resources/custom, /slides, /community, ...).
// Each feature carries a small LIVE animated preview (pure CSS/React, no video
// files) so the tease shows the thing instead of describing it. Swap these for
// real screen-recorded clips post-launch if wanted — the frame is video-shaped.

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, X } from "lucide-react";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { Typewriter } from "./Typewriter";

export type TeaseFeature = "build" | "slides" | "community";

const COPY: Record<
  TeaseFeature,
  { chip: string; title: string; body: string; footnote: string }
> = {
  build: {
    chip: "Coming soon",
    title: "Build your own",
    body: "Describe any worksheet in plain words, addition with dinosaurs, a reading passage about the moon, and Sprout builds it for your kid's age in seconds. We're getting it ready.",
    footnote: "The 30 templates are free while you wait.",
  },
  slides: {
    chip: "Coming soon",
    title: "Slideshows",
    body: "Type a topic and get a warm, illustrated mini lesson to present full screen or print. Nearly ready.",
    footnote: "The 30 templates are free while you wait.",
  },
  community: {
    chip: "Coming soon",
    title: "The community",
    body: "Worksheets other parents built and shared, a chat to swap ideas, and updates from the team. Opening soon.",
    footnote: "The 30 templates are free while you wait.",
  },
};

/* ── The animated previews ─────────────────────────────────────────── */

const DEMO_PROMPTS = [
  "addition with dinosaurs, 12 problems",
  "a reading passage about the moon",
  "label the butterfly life cycle",
  "telling time, o'clock and half past",
];

function BuildDemo() {
  return (
    <div className="cs-demo relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E5A35] to-[#16331E] p-4 sm:p-5">
      {/* the prompt bar */}
      <div className="flex items-center gap-2.5 rounded-xl bg-[#FFFDF6] p-2.5 shadow-lg">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#2E5A35]/10">
          <SproutMascotIcon className="size-5" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-[#1B3722]/75">
          <Typewriter words={DEMO_PROMPTS} holdMs={1400} />
        </span>
        <span className="bg-sprout-lime shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold text-[#1B3722]">
          Build it
        </span>
      </div>
      {/* the sheet assembling underneath */}
      <div className="mt-3 rounded-xl bg-[#FFFDF6] p-3.5">
        <div className="h-2.5 w-1/2 rounded-full bg-[#1B3722]/70" style={{ animation: "cs-line 4.5s ease-in-out infinite" }} />
        <div className="mt-2.5 space-y-2">
          {[88, 72, 80, 64].map((w, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-[#1B3722]/15"
              style={{ ["--cs-w" as string]: `${w}%`, animation: `cs-line 4.5s ease-in-out ${0.25 + i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SlidesDemo() {
  const slides = [
    { title: "The water cycle", accent: "#B4E678" },
    { title: "Where rain comes from", accent: "#94BC8E" },
    { title: "Try it yourself", accent: "#E9C46A" },
  ];
  return (
    <div className="cs-demo relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E5A35] to-[#16331E]">
      {slides.map((s, i) => (
        <div
          key={s.title}
          // First slide is visible at rest so the frame is never empty (and
          // reduced-motion visitors still see a real slide).
          className={`absolute inset-0 flex flex-col justify-center p-5 sm:p-7 ${i === 0 ? "opacity-100" : "opacity-0"}`}
          style={{ animation: `cs-slide 7.5s ease-in-out ${i * 2.5}s infinite` }}
        >
          <span className="size-8 rounded-full" style={{ background: s.accent }} />
          <div className="text-sprout-cream mt-3 text-lg font-extrabold sm:text-xl">{s.title}</div>
          <div className="bg-sprout-cream/25 mt-2.5 h-2 w-3/4 rounded-full" />
          <div className="bg-sprout-cream/15 mt-2 h-2 w-1/2 rounded-full" />
        </div>
      ))}
      <div className="text-sprout-cream/45 absolute right-3 bottom-2.5 text-[10px] font-bold tracking-[0.18em] uppercase">
        Full screen or printed
      </div>
    </div>
  );
}

function CommunityDemo() {
  const cards = [
    { title: "Skip counting by 5s", by: "made by Hannah", likes: 14 },
    { title: "Ocean animals reading", by: "made by Renee", likes: 22 },
    { title: "Fractions with pizza", by: "made by Jess", likes: 9 },
    { title: "The seasons, cut and paste", by: "made by Amber", likes: 17 },
  ];
  const loop = [...cards, ...cards];
  return (
    <div className="cs-demo relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E5A35] to-[#16331E] p-4 sm:h-52">
      <div style={{ animation: "cs-scroll 12s linear infinite" }}>
        {loop.map((c, i) => (
          <div key={i} className="mb-2.5 flex items-center gap-3 rounded-xl bg-[#FFFDF6] p-3 shadow">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#2E5A35]/10 text-[13px] font-extrabold text-[#2E5A35]">
              {c.by.slice(8, 9).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold text-[#1B3722]">{c.title}</span>
              <span className="block text-[11px] text-[#1B3722]/55">{c.by}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#C25B4E]">
              <Heart className="size-3.5 fill-current" style={{ animation: `cs-pop 3s ease ${(i % 4) * 0.7}s infinite` }} />
              {c.likes}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#2E5A35] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#16331E] to-transparent" />
    </div>
  );
}

function Demo({ feature }: { feature: TeaseFeature }) {
  if (feature === "build") return <BuildDemo />;
  if (feature === "slides") return <SlidesDemo />;
  return <CommunityDemo />;
}

/* ── Shared inner content ──────────────────────────────────────────── */

function TeaseContent({ feature, onClose }: { feature: TeaseFeature; onClose?: () => void }) {
  const c = COPY[feature];
  return (
    <>
      <Demo feature={feature} />
      <div className="mt-5 flex items-center gap-2">
        <span className="bg-sprout-lime rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.18em] text-[#1B3722] uppercase">
          {c.chip}
        </span>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-[-0.01em] text-[#1B3722]">{c.title}</h2>
      <p className="mt-2 leading-relaxed text-[#1B3722]/75">{c.body}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/#start"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1B3722] px-5 text-sm font-bold text-[#FFFDF6] transition hover:bg-[#2A5132]"
        >
          Join the waitlist, hear the day it opens
          <ArrowRight className="size-4" />
        </Link>
        {onClose ? (
          <button onClick={onClose} className="text-sm font-semibold text-[#1B3722]/60 transition hover:text-[#1B3722]">
            Keep making free worksheets
          </button>
        ) : (
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B3722]/60 transition hover:text-[#1B3722]"
          >
            <ArrowLeft className="size-4" />
            Back to the free templates
          </Link>
        )}
      </div>
      <p className="mt-4 text-xs text-[#1B3722]/50">{c.footnote}</p>
    </>
  );
}

/* ── The modal (library page) ──────────────────────────────────────── */

export function ComingSoonModal({ feature, onClose }: { feature: TeaseFeature; onClose: () => void }) {
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0F1A12]/70 p-4 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={`${COPY[feature].title} preview`}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#FBF7EE] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-[#1B3722]/5 text-[#1B3722]/60 transition hover:bg-[#1B3722]/10 hover:text-[#1B3722]"
        >
          <X className="size-4" />
        </button>
        <TeaseContent feature={feature} onClose={close} />
      </div>
    </div>
  );
}

/* ── The full page (direct visits to gated routes) ─────────────────── */

export function ComingSoonPage({ feature }: { feature: TeaseFeature }) {
  return (
    <div className="mx-auto max-w-lg py-6 sm:py-10">
      <div className="rounded-3xl bg-[#FBF7EE] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-7">
        <TeaseContent feature={feature} />
      </div>
    </div>
  );
}
