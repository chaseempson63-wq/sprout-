"use client";

// The Slides studio: type a topic, set the age (the stepper is the only
// difficulty dial, same rule as worksheets), and Sprout builds an illustrated
// teaching deck. Present it full screen, flick with arrows or keys, or print
// it one slide per landscape page. Venice builds the real thing; the engine's
// honest fallback covers the gaps (lib/resources/slides.ts).

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2, Maximize2, Minus, Play, Plus, Printer, Sparkles } from "lucide-react";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { Sticker, creamCta, forestCta, sheet } from "../_components/paper";
import { GlassButton, GlassLink } from "@/components/ui/glass";
import { cn } from "@/lib/utils";
import type { Slide, Slideshow } from "@/lib/resources/slides";

const STARTERS = ["the water cycle", "sea turtles", "how volcanoes work", "the solar system", "ancient dinosaurs", "how plants grow"];

// One slide per A4 landscape page when printing; the global print CSS shows
// only .print-area, so the stacked print list is the whole print output.
const PRINT_RULES = `@media print {
  @page { size: A4 landscape; margin: 10mm; }
  .slide-print-page { break-after: page; }
  .slide-print-page:last-child { break-after: auto; }
}
/* Present mode: the stage fills the screen, the slide centers on the desk green. */
.slides-stage:fullscreen { display: grid; place-items: center; padding: 4vmin; background: linear-gradient(135deg, #2A5132, #1B3722); }
.slides-stage:fullscreen > div { max-width: min(88vw, calc(88vh * 16 / 9)); width: 100%; }`;

export function SlidesStudio() {
  const [topic, setTopic] = useState("");
  const [age, setAge] = useState(7);
  const [deck, setDeck] = useState<Slideshow | null>(null);
  const [source, setSource] = useState<"ai" | "template" | null>(null);
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(false);
  const genSeq = useRef(0);
  const stage = useRef<HTMLDivElement>(null);

  async function generate(t?: string) {
    const q = (t ?? topic).trim();
    if (!q) return;
    if (t) setTopic(t);
    const myseq = ++genSeq.current;
    setLoading(true);
    try {
      const res = await fetch("/api/resources/slides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: q, age }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { slideshow: Slideshow; source: "ai" | "template" };
      if (myseq !== genSeq.current) return;
      setDeck(data.slideshow);
      setSource(data.source);
      setI(0);
      track("resources_slides_generate", { age, source: data.source });
    } catch {
      if (myseq === genSeq.current) {
        setDeck(null);
        setSource(null);
      }
    } finally {
      if (myseq === genSeq.current) setLoading(false);
    }
  }

  // Arrow keys page the deck once one exists.
  useEffect(() => {
    if (!deck) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, deck!.slides.length - 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deck]);

  function present() {
    void stage.current?.requestFullscreen?.();
  }
  function print() {
    track("resources_slides_print", {});
    window.print();
  }

  const slide = deck?.slides[i];

  return (
    <div className="mx-auto max-w-5xl">
      <style dangerouslySetInnerHTML={{ __html: PRINT_RULES }} />

      <GlassLink href="/resources" className="no-print mb-6 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

      <div className="no-print mb-7 flex items-start gap-4">
        <span className="bg-sprout-cream grid size-14 shrink-0 place-items-center rounded-2xl shadow-md sm:size-16">
          <SproutMascotIcon className="size-9 sm:size-11" />
        </span>
        <div>
          <p className="text-sprout-lime text-xs font-bold tracking-[0.2em] uppercase">New</p>
          <h1 className="text-sprout-cream text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Slideshow generator</h1>
          <p className="text-sprout-cream/70 mt-1 text-sm sm:text-base">Type a topic, and Sprout builds a little lesson you can present or print.</p>
        </div>
      </div>

      {/* The control sheet: topic + the age dial + Generate. */}
      <div className={cn(sheet, "no-print mb-8 p-4 sm:p-5")}>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="What should the slideshow teach? e.g. the water cycle"
            className="h-12 min-w-0 flex-1 rounded-full border border-[#2E5A35]/15 bg-white px-5 text-[15px] text-[#1B3722] outline-none placeholder:text-[#1B3722]/40 focus:border-[#2E5A35]/40"
          />
          <div className="flex items-center gap-0.5 rounded-full border border-[#2E5A35]/15 bg-white p-1">
            <button type="button" onClick={() => setAge((a) => Math.max(3, a - 1))} disabled={age <= 3} aria-label="Younger" className="grid size-9 place-items-center rounded-full text-[#2E5A35] transition hover:bg-[#2E5A35]/10 disabled:pointer-events-none disabled:opacity-35">
              <Minus className="size-4" />
            </button>
            <span className="min-w-[3.6rem] text-center text-sm font-bold text-[#1B3722]">Age {age}</span>
            <button type="button" onClick={() => setAge((a) => Math.min(13, a + 1))} disabled={age >= 13} aria-label="Older" className="grid size-9 place-items-center rounded-full text-[#2E5A35] transition hover:bg-[#2E5A35]/10 disabled:pointer-events-none disabled:opacity-35">
              <Plus className="size-4" />
            </button>
          </div>
          <button onClick={() => generate()} disabled={!topic.trim() || loading} className={cn(forestCta, "h-12")}>
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />} Generate
          </button>
        </div>
        {!deck && !loading && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STARTERS.map((s) => (
              <button key={s} onClick={() => void generate(s)} className="rounded-full border border-[#2E5A35]/20 bg-white/70 px-3 py-1.5 text-xs font-bold text-[#1B3722]/75 transition hover:bg-white">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The stage. */}
      {loading ? (
        <BuildingTrace topic={topic} age={age} />
      ) : deck && slide ? (
        <div className="no-print">
          <div ref={stage} className="slides-stage group/stage relative rounded-[24px] bg-[#22452A]/0">
            <div className="mx-auto w-full max-w-4xl">
              <div key={i} className="animate-in fade-in zoom-in-95 duration-300">
                <SlideView slide={slide} deckTitle={deck.title} index={i} total={deck.slides.length} />
              </div>
            </div>
            {/* in-stage arrows (visible in fullscreen too) */}
            <button onClick={() => setI((v) => Math.max(v - 1, 0))} disabled={i === 0} aria-label="Previous slide" className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white opacity-0 transition group-hover/stage:opacity-100 disabled:opacity-0">
              <ChevronLeft className="size-6" />
            </button>
            <button onClick={() => setI((v) => Math.min(v + 1, deck.slides.length - 1))} disabled={i >= deck.slides.length - 1} aria-label="Next slide" className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white opacity-0 transition group-hover/stage:opacity-100 disabled:opacity-0">
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* controls under the stage */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <GlassButton onClick={() => setI((v) => Math.max(v - 1, 0))} disabled={i === 0} aria-label="Previous" className="size-10">
              <ChevronLeft className="size-4" />
            </GlassButton>
            <div className="flex items-center gap-1.5">
              {deck.slides.map((_, d) => (
                <button key={d} onClick={() => setI(d)} aria-label={`Slide ${d + 1}`} className={cn("size-2.5 rounded-full transition", d === i ? "bg-sprout-cream scale-125" : "bg-sprout-cream/30 hover:bg-sprout-cream/60")} />
              ))}
            </div>
            <GlassButton onClick={() => setI((v) => Math.min(v + 1, deck.slides.length - 1))} disabled={i >= deck.slides.length - 1} aria-label="Next" className="size-10">
              <ChevronRight className="size-4" />
            </GlassButton>
            <span className="text-sprout-cream/60 mx-1 text-sm">
              {i + 1} / {deck.slides.length}
            </span>
            <button onClick={present} className={cn(creamCta, "h-11 text-sm")}>
              <Maximize2 className="size-4" /> Present
            </button>
            <button onClick={print} className={cn(creamCta, "h-11 text-sm")}>
              <Printer className="size-4" /> Print
            </button>
          </div>
          {source === "template" && (
            <p className="text-sprout-cream/55 mt-3 text-center text-xs">Built from Sprout&apos;s curated facts while the AI builder is busy.</p>
          )}
        </div>
      ) : (
        <div className="no-print text-sprout-cream/60 flex h-[38vh] flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed border-sprout-cream/20 px-6 text-center text-sm">
          <Play className="size-6 opacity-60" />
          Type a topic above and Sprout builds the whole deck: title, teaching slides, real facts, and talk-about-it questions.
        </div>
      )}

      {/* Print copy of the whole deck, one slide per landscape page. */}
      {deck && (
        <div className="print-area hidden print:block">
          {deck.slides.map((s, d) => (
            <div key={d} className="slide-print-page">
              <SlideView slide={s} deckTitle={deck.title} index={d} total={deck.slides.length} print />
            </div>
          ))}
        </div>
      )}

      {/* the cross-product nudge, same as worksheets */}
      {deck && !loading && (
        <p className="no-print text-sprout-cream/55 mt-8 text-center text-sm">
          Presented it? <Link href="/resources" className="text-sprout-cream font-bold underline-offset-2 hover:underline">Make a worksheet</Link> on the same topic to finish the lesson.
        </p>
      )}
    </div>
  );
}

// ── One slide, four compositions ─────────────────────────────────────

function SlideView({ slide, deckTitle, index, total, print }: { slide: Slide; deckTitle: string; index: number; total: number; print?: boolean }) {
  const frame = cn(
    "relative w-full overflow-hidden rounded-[24px] ring-1 ring-black/10",
    print ? "aspect-[297/190]" : "aspect-video shadow-[0_30px_70px_-25px_rgba(5,15,8,0.8)]",
  );
  const footer = (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-3.5 text-[11px] font-bold tracking-wide opacity-70">
      <span className="inline-flex items-center gap-1.5">
        <SproutMascotIcon className="size-4" /> Made with Sprout
      </span>
      <span>
        {deckTitle} · {index + 1}/{total}
      </span>
    </div>
  );

  if (slide.kind === "title") {
    return (
      <div className={cn(frame, "bg-gradient-to-br from-[#2E5A35] to-[#16331E] text-[#FFFDF6]")}>
        <div className="flex h-full flex-col items-center justify-center gap-5 px-10 text-center">
          {slide.imageKey ? (
            <Sticker imageKey={slide.imageKey} size={110} angle={-3} />
          ) : (
            <span className="bg-sprout-cream grid size-20 place-items-center rounded-3xl shadow-md">
              <SproutMascotIcon className="size-12" />
            </span>
          )}
          <h2 className="max-w-3xl text-4xl leading-tight font-bold tracking-[-0.02em] sm:text-5xl">{slide.title}</h2>
        </div>
        {footer}
      </div>
    );
  }

  if (slide.kind === "fact") {
    return (
      <div className={cn(frame, "bg-[#FBF1D9] text-[#3A3320]")}>
        <div className="flex h-full items-center gap-8 px-10 py-8 sm:px-14">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold tracking-[0.2em] text-[#C6881A] uppercase">★ {slide.title || "Did you know?"}</p>
            <p className="mt-4 text-2xl leading-snug font-bold sm:text-3xl">{slide.fact}</p>
          </div>
          {slide.imageKey && <Sticker imageKey={slide.imageKey} size={150} angle={4} className="hidden shrink-0 sm:block" />}
        </div>
        {footer}
      </div>
    );
  }

  if (slide.kind === "recap") {
    return (
      <div className={cn(frame, "bg-[#F1F6EC] text-[#1B3722]")}>
        <div className="flex h-full flex-col justify-center px-10 py-8 sm:px-14">
          <p className="text-[13px] font-bold tracking-[0.2em] text-[#2E5A35] uppercase">Talk about it</p>
          <h3 className="mt-1 text-3xl font-bold tracking-[-0.01em]">{slide.title}</h3>
          <ol className="mt-6 space-y-4">
            {(slide.points ?? []).map((p, n) => (
              <li key={n} className="flex items-start gap-3 text-lg leading-snug sm:text-xl">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#2E5A35] text-sm font-bold text-white">{n + 1}</span>
                {p}
              </li>
            ))}
          </ol>
        </div>
        {footer}
      </div>
    );
  }

  // content
  return (
    <div className={cn(frame, "bg-[#FFFDF6] text-[#1B3722]")}>
      <div className="flex h-full items-center gap-8 px-10 py-8 sm:px-14">
        <div className="min-w-0 flex-1">
          <h3 className="text-3xl font-bold tracking-[-0.01em] text-[#1B3722] sm:text-4xl">{slide.title}</h3>
          <ul className="mt-6 space-y-3.5">
            {(slide.points ?? []).map((p, n) => (
              <li key={n} className="flex items-start gap-3 text-lg leading-snug sm:text-xl">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#2E5A35]/12 text-[#2E5A35]">
                  <Check className="size-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        {slide.imageKey && <Sticker imageKey={slide.imageKey} size={170} angle={-4} className="hidden shrink-0 sm:block" />}
      </div>
      {footer}
    </div>
  );
}

// ── The build trace while Venice writes the deck ─────────────────────

function BuildingTrace({ topic, age }: { topic: string; age: number }) {
  const steps = [`Reading up on ${topic || "the topic"}`, "Picking what matters most", `Writing it for age ${age}`, "Choosing the pictures", "Laying out the slides"];
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (active >= steps.length - 1) return;
    const t = window.setTimeout(() => setActive((a) => Math.min(a + 1, steps.length - 1)), 2600);
    return () => window.clearTimeout(t);
  }, [active, steps.length]);
  return (
    <div className="no-print border-sprout-cream/20 bg-sprout-cream/[0.04] flex aspect-video items-center justify-center rounded-[24px] border border-dashed p-6">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="bg-sprout-cream/95 grid size-11 shrink-0 place-items-center rounded-2xl shadow">
            <SproutMascotIcon className="animate-mascot-float size-7" />
          </span>
          <div>
            <p className="text-sprout-cream font-bold">Sprout is building the deck</p>
            <p className="text-sprout-cream/50 text-xs">real facts, written for your kid</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {steps.slice(0, active + 1).map((s, n) => (
            <div key={n} className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both flex items-center gap-2.5 duration-300">
              {n === active ? (
                <Loader2 className="text-sprout-lime size-4 shrink-0 animate-spin" />
              ) : (
                <span className="bg-sprout-lime/20 text-sprout-lime grid size-4 shrink-0 place-items-center rounded-full">
                  <Check className="size-3" />
                </span>
              )}
              <span className={cn("text-sm", n === active ? "text-sprout-cream" : "text-sprout-cream/55")}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
