"use client";

// The shared slideshow deck: one SlideView renderer + the SlideDeckPlayer
// (stage, arrows, dots, Present, Print). Used by the Slides studio and by
// published slideshows on their community permalink.
//
// THE PRESENT FIX. Every size inside a slide is in cqw (container-query width
// units, the frame is a @container), so a slide is proportional like a real
// deck: the ~900px builder preview, a 27-inch fullscreen, a phone, and the
// printed landscape page all render the SAME composition, just scaled. The old
// version blew the frame up to 88vw while its text stayed at fixed pixel sizes,
// which is exactly the small-text-in-a-sea-of-white bug.
//
// Present mode is a fixed overlay (not Element.requestFullscreen, which iOS
// Safari doesn't support on divs — Present used to silently do nothing there).
// On desktop it ALSO asks for real fullscreen as a bonus; the overlay is the
// mode either way. Small portrait screens rotate the slide 90deg, video-player
// style, so the deck presents landscape on a phone.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Maximize2, Printer, X } from "lucide-react";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { cn } from "@/lib/utils";
import type { Slide, Slideshow } from "@/lib/resources/slides";

const PRESENT_RULES = `
/* Absolute center + transform: immune to the overflow-centering trap when the
   rotated box is layout-wider than a portrait viewport. */
.slides-present-box { position: absolute; left: 50%; top: 50%; width: min(94vw, calc(94vh * 16 / 9)); transform: translate(-50%, -50%); }
@media (orientation: portrait) and (max-width: 900px) {
  .slides-present-box { width: min(92vh, calc(92vw * 16 / 9)); transform: translate(-50%, -50%) rotate(90deg); }
}
@media print {
  @page { size: A4 landscape; margin: 10mm; }
  .slide-print-page { break-after: page; }
  .slide-print-page:last-child { break-after: auto; }
}`;

// ── One slide, four compositions — every dimension in cqw ─────────────

function Art({ imageKey, w, angle }: { imageKey: string; w: string; angle: number }) {
  return (
    <span
      className="block shrink-0 overflow-hidden rounded-[1.8cqw] bg-white p-[0.6cqw] shadow-[0_0.9cqw_2cqw_-0.9cqw_rgba(8,22,12,0.5)] ring-1 ring-[#2E5A35]/10"
      style={{ width: w, transform: `rotate(${angle}deg)` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local static webp */}
      <img src={`/resources/illustrations/${imageKey}.webp`} alt="" className="aspect-square w-full rounded-[1.2cqw] object-cover" />
    </span>
  );
}

export function SlideView({ slide, deckTitle, index, total, print }: { slide: Slide; deckTitle: string; index: number; total: number; print?: boolean }) {
  const frame = cn(
    "@container relative w-full overflow-hidden rounded-[2.4cqw] ring-1 ring-black/10",
    print ? "aspect-[297/190]" : "aspect-video shadow-[0_30px_70px_-25px_rgba(5,15,8,0.8)]",
  );
  const footer = (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-[3cqw] pb-[1.7cqw] text-[1.35cqw] font-bold tracking-wide opacity-70">
      <span className="inline-flex items-center gap-[0.7cqw]">
        <SproutMascotIcon className="size-[1.9cqw]" /> Made with Sprout
      </span>
      <span>
        {deckTitle} · {index + 1}/{total}
      </span>
    </div>
  );

  if (slide.kind === "title") {
    return (
      <div className={cn(frame, "bg-gradient-to-br from-[#2E5A35] to-[#16331E] text-[#FFFDF6]")}>
        <div className="flex h-full flex-col items-center justify-center gap-[2.6cqw] px-[8cqw] text-center">
          {slide.imageKey ? (
            <Art imageKey={slide.imageKey} w="13cqw" angle={-3} />
          ) : (
            <span className="bg-sprout-cream grid size-[10cqw] place-items-center rounded-[2.4cqw] shadow-md">
              <SproutMascotIcon className="size-[6.5cqw]" />
            </span>
          )}
          <h2 className="max-w-[76cqw] text-[5.4cqw] leading-[1.15] font-bold tracking-[-0.02em]">{slide.title}</h2>
        </div>
        {footer}
      </div>
    );
  }

  if (slide.kind === "fact") {
    return (
      <div className={cn(frame, "bg-[#FBF1D9] text-[#3A3320]")}>
        <div className="flex h-full items-center gap-[4cqw] px-[6cqw] py-[5cqw]">
          <div className="min-w-0 flex-1">
            <p className="text-[1.6cqw] font-bold tracking-[0.2em] text-[#C6881A] uppercase">★ {slide.title || "Did you know?"}</p>
            <p className="mt-[2cqw] text-[3.4cqw] leading-[1.35] font-bold">{slide.fact}</p>
          </div>
          {slide.imageKey && <Art imageKey={slide.imageKey} w="17cqw" angle={4} />}
        </div>
        {footer}
      </div>
    );
  }

  if (slide.kind === "recap") {
    return (
      <div className={cn(frame, "bg-[#F1F6EC] text-[#1B3722]")}>
        <div className="flex h-full flex-col justify-center px-[6cqw] py-[5cqw]">
          <p className="text-[1.6cqw] font-bold tracking-[0.2em] text-[#2E5A35] uppercase">Talk about it</p>
          <h3 className="mt-[0.6cqw] text-[3.8cqw] font-bold tracking-[-0.01em]">{slide.title}</h3>
          <ol className="mt-[2.8cqw] space-y-[2cqw]">
            {(slide.points ?? []).map((p, n) => (
              <li key={n} className="flex items-start gap-[1.5cqw] text-[2.5cqw] leading-snug">
                <span className="mt-[0.2cqw] grid size-[3.1cqw] shrink-0 place-items-center rounded-full bg-[#2E5A35] text-[1.7cqw] font-bold text-white">{n + 1}</span>
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
      <div className="flex h-full items-center gap-[4cqw] px-[6cqw] py-[5cqw]">
        <div className="min-w-0 flex-1">
          <h3 className="text-[4.2cqw] leading-[1.15] font-bold tracking-[-0.01em] text-[#1B3722]">{slide.title}</h3>
          <ul className="mt-[2.8cqw] space-y-[1.9cqw]">
            {(slide.points ?? []).map((p, n) => (
              <li key={n} className="flex items-start gap-[1.5cqw] text-[2.5cqw] leading-snug">
                <span className="mt-[0.45cqw] grid size-[2.5cqw] shrink-0 place-items-center rounded-full bg-[#2E5A35]/12 text-[1.5cqw] font-bold text-[#2E5A35]">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        {slide.imageKey && <Art imageKey={slide.imageKey} w="19cqw" angle={-4} />}
      </div>
      {footer}
    </div>
  );
}

// ── The player ────────────────────────────────────────────────────────

export function SlideDeckPlayer({
  deck,
  controlsExtra,
  onPrint,
}: {
  deck: Slideshow;
  /** extra buttons rendered in the control row (Save / Publish / Add to a kid) */
  controlsExtra?: React.ReactNode;
  onPrint?: () => void;
}) {
  const [i, setI] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const total = deck.slides.length;
  const deckKey = deck.title + total;

  // A fresh deck starts back at slide one.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset on deck swap
    setI(0);
  }, [deckKey]);

  // Keys: arrows page, Escape leaves present mode.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, total - 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
      if (e.key === "Escape") exitPresent();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // Leaving native fullscreen (F11/Esc handled by the browser) also leaves
  // present mode, so the overlay never lingers behind.
  useEffect(() => {
    function onFsChange() {
      if (!document.fullscreenElement) setPresenting((p) => (p ? false : p));
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function present() {
    setPresenting(true);
    // Bonus on desktop; iOS has no element fullscreen and the overlay carries it.
    void document.documentElement.requestFullscreen?.().catch(() => {});
  }
  function exitPresent() {
    setPresenting(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }
  function print() {
    onPrint?.();
    window.print();
  }

  const slide = deck.slides[i];
  const prev = () => setI((v) => Math.max(v - 1, 0));
  const next = () => setI((v) => Math.min(v + 1, total - 1));

  const arrows = (big: boolean) => (
    <>
      <button onClick={prev} disabled={i === 0} aria-label="Previous slide" className={cn("absolute top-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white transition hover:bg-black/50 disabled:opacity-0", big ? "left-[max(0.75rem,env(safe-area-inset-left))] grid size-12" : "left-2 grid size-11 opacity-0 group-hover/stage:opacity-100")}>
        <ChevronLeft className={big ? "size-7" : "size-6"} />
      </button>
      <button onClick={next} disabled={i >= total - 1} aria-label="Next slide" className={cn("absolute top-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white transition hover:bg-black/50 disabled:opacity-0", big ? "right-[max(0.75rem,env(safe-area-inset-right))] grid size-12" : "right-2 grid size-11 opacity-0 group-hover/stage:opacity-100")}>
        <ChevronRight className={big ? "size-7" : "size-6"} />
      </button>
    </>
  );

  return (
    <div className="no-print">
      <style dangerouslySetInnerHTML={{ __html: PRESENT_RULES }} />

      {/* inline stage */}
      <div className="group/stage relative">
        <div className="mx-auto w-full max-w-4xl">
          <div key={i} className="animate-in fade-in zoom-in-95 duration-300">
            <SlideView slide={slide} deckTitle={deck.title} index={i} total={total} />
          </div>
        </div>
        {arrows(false)}
      </div>

      {/* controls */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button onClick={prev} disabled={i === 0} aria-label="Previous" className="border-sprout-cream/20 bg-sprout-cream/10 text-sprout-cream hover:bg-sprout-cream/20 grid size-10 place-items-center rounded-full border transition disabled:opacity-35">
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {deck.slides.map((_, d) => (
            <button key={d} onClick={() => setI(d)} aria-label={`Slide ${d + 1}`} className={cn("size-2.5 rounded-full transition", d === i ? "bg-sprout-cream scale-125" : "bg-sprout-cream/30 hover:bg-sprout-cream/60")} />
          ))}
        </div>
        <button onClick={next} disabled={i >= total - 1} aria-label="Next" className="border-sprout-cream/20 bg-sprout-cream/10 text-sprout-cream hover:bg-sprout-cream/20 grid size-10 place-items-center rounded-full border transition disabled:opacity-35">
          <ChevronRight className="size-4" />
        </button>
        <span className="text-sprout-cream/60 mx-1 text-sm">
          {i + 1} / {total}
        </span>
        <button onClick={present} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#FFFDF6] px-5 text-sm font-bold text-[#1B3722] shadow-[0_14px_30px_-12px_rgba(8,22,12,0.65),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 active:scale-95">
          <Maximize2 className="size-4" /> Present
        </button>
        <button onClick={print} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#FFFDF6] px-5 text-sm font-bold text-[#1B3722] shadow-[0_14px_30px_-12px_rgba(8,22,12,0.65),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 active:scale-95">
          <Printer className="size-4" /> Print
        </button>
        {controlsExtra}
      </div>

      {/* present overlay — fills any screen, rotates on portrait phones.
          Portaled to <body> so no ancestor stacking context (page animations,
          transforms) can trap it under the floating nav or help mascot. */}
      {presenting &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[200] overflow-hidden bg-gradient-to-br from-[#2A5132] to-[#12291A]">
            <div className="slides-present-box">
              <div key={i} className="animate-in fade-in duration-200">
                <SlideView slide={slide} deckTitle={deck.title} index={i} total={total} />
              </div>
            </div>
            {arrows(true)}
            <button onClick={exitPresent} aria-label="Exit presentation" className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] grid size-11 place-items-center rounded-full bg-black/30 text-white transition hover:bg-black/50">
              <X className="size-5" />
            </button>
            <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 items-center gap-1.5">
              {deck.slides.map((_, d) => (
                <button key={d} onClick={() => setI(d)} aria-label={`Slide ${d + 1}`} className={cn("size-2 rounded-full transition", d === i ? "scale-125 bg-white" : "bg-white/35 hover:bg-white/60")} />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

// The whole deck, one slide per landscape page, for the global print CSS
// (which shows only .print-area). Mount exactly one per page.
export function SlideDeckPrintCopy({ deck }: { deck: Slideshow }) {
  return (
    <div className="print-area hidden print:block">
      {deck.slides.map((s, d) => (
        <div key={d} className="slide-print-page">
          <SlideView slide={s} deckTitle={deck.title} index={d} total={deck.slides.length} print />
        </div>
      ))}
    </div>
  );
}
