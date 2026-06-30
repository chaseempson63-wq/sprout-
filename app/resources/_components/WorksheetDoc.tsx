// The printable worksheet. A white sheet with a layered-green Sprout wave
// banner across the top (bigger mascot + the child's name), then each block as
// something the child fills in by hand. This is the .print-area print target.

import { IllustrationImg } from "./IllustrationImg";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { SVG_ART } from "@/lib/resources/svg-art";
import type { Worksheet, WorksheetBlock } from "@/lib/resources/types";

// Raw print rules injected inline so the build CSS pipeline (Lightning CSS) can't
// strip break-inside. Tightens print rhythm a touch and keeps the footer intact +
// pulled in, so a slight overflow doesn't orphan it onto a near-empty trailing
// page. Print-only; on-screen layout and content are untouched.
const PRINT_RULES = `@page { size: A4; margin: 12mm; }
@media print {
  .print-area { zoom: var(--ws-print-scale, 1); }
  .worksheet-lines > * + * { margin-top: 18px !important; }
  .worksheet-blocks > * { break-inside: avoid; }
  .worksheet-footer { break-inside: avoid; margin-top: 16px !important; padding-top: 8px !important; }
  .worksheet-img { break-inside: avoid; width: auto !important; max-width: 90%; max-height: 8cm; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}`;

function Lines({ count = 3 }: { count?: number }) {
  return (
    <div className="worksheet-lines mt-2 space-y-7">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-b border-dashed border-[#1B3722]/35" />
      ))}
    </div>
  );
}

function AnswerBox() {
  return <span className="ml-2 inline-block h-7 w-14 rounded-md border border-[#2E5A35]/40 align-middle" />;
}

function BlockView({ block }: { block: WorksheetBlock }) {
  const prompt = block.prompt ? <p className="text-[14px] font-bold text-[#2E5A35]">{block.prompt}</p> : null;

  switch (block.kind) {
    case "instructions":
      return <p className="text-[17px] leading-[1.6] font-bold text-[#2E5A35]">{block.prompt || block.text}</p>;

    case "trace":
      return (
        <div>
          {prompt}
          <div className="mt-3 text-4xl font-bold tracking-[0.15em] text-[#1B3722]/20 select-none" style={{ fontFamily: "var(--font-nunito)" }}>
            {block.text}
          </div>
          <div className="mt-3 border-b-2 border-dashed border-[#1B3722]/25 pb-8" />
        </div>
      );

    case "handwriting":
      return (
        <div>
          {prompt}
          <Lines count={block.rows ?? 3} />
        </div>
      );

    case "fill-blank":
      return (
        <div>
          {prompt}
          <ol className="mt-2 space-y-3 text-[15px] text-[#1B3722]">
            {(block.items ?? []).map((s, i) => (
              <li key={i} className="leading-relaxed">
                <span className="mr-2 font-semibold text-[#2E5A35]">{i + 1}.</span>
                {s.split("____").map((part, j, arr) => (
                  <span key={j}>
                    {part}
                    {j < arr.length - 1 && <span className="mx-1 inline-block w-24 border-b border-[#1B3722]/50 align-middle" />}
                  </span>
                ))}
              </li>
            ))}
          </ol>
        </div>
      );

    case "word-bank":
      return (
        <div className="rounded-2xl border-2 border-dashed border-[#2E5A35]/35 bg-[#F3F7F0] px-4 py-3">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#2E5A35] uppercase">Word bank</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[15px] font-medium text-[#1B3722]">
            {(block.wordBank ?? []).map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
        </div>
      );

    case "math": {
      const items = (block.items ?? []).map((p) => p.replace(/_{2,}\s*$/, "").trim());
      const isWord = (s: string) => /[a-zA-Z]{3,}/.test(s); // a word problem slipped into a math block
      const eqs = items.filter((s) => !isWord(s));
      const words = items.filter(isWord);
      return (
        <div>
          {prompt}
          {eqs.length > 0 && (
            // Two columns, generous open white space under each problem so the
            // kid can actually work it out by hand. No answer box, no lines.
            <div className="mt-4 grid grid-cols-1 gap-y-9 sm:grid-cols-2 sm:gap-x-12">
              {eqs.map((p, i) => (
                <div key={i} className="text-[18px] leading-[1.5] text-[#1B3722]">
                  <span className="mr-1.5 text-[#2E5A35]/70">{i + 1}.</span>
                  <span className="font-medium">{p}</span>
                  <div className="h-16" aria-hidden />
                </div>
              ))}
            </div>
          )}
          {words.length > 0 && (
            // Word problems get open working space, not cramped lines.
            <ol className="mt-4 space-y-8 text-[15px] leading-relaxed text-[#1B3722]">
              {words.map((q, i) => (
                <li key={i}>
                  <span className="mr-2 font-semibold text-[#2E5A35]">{eqs.length + i + 1}.</span>
                  {q}
                  <div className="h-24" aria-hidden />
                </li>
              ))}
            </ol>
          )}
        </div>
      );
    }

    case "column-math":
      return (
        <div>
          {prompt}
          <div className="mt-3 flex flex-wrap gap-x-10 gap-y-6">
            {(block.items ?? []).map((p, i) => {
              const clean = p.replace(/=/g, "").replace(/_+/g, "").replace(/\s+/g, " ").trim();
              const m = clean.match(/^(\d[\d,]*)\s*([+\-−×÷])\s*(\d[\d,]*)$/);
              if (m) {
                return (
                  <div key={i} className="w-28 font-mono text-[18px] text-[#1B3722]">
                    <div className="text-right">{m[1]}</div>
                    <div className="flex justify-between border-b-2 border-[#1B3722] pb-1">
                      <span>{m[2]}</span>
                      <span>{m[3]}</span>
                    </div>
                    <div className="h-14" />
                  </div>
                );
              }
              // multi-addend / decimals / anything complex: render inline with an answer box
              return (
                <div key={i} className="flex w-full items-center text-[16px] text-[#1B3722] sm:w-[46%]">
                  <span className="mr-1 text-[#2E5A35]/70">{i + 1}.</span>
                  <span className="font-medium">{clean} =</span>
                  <AnswerBox />
                </div>
              );
            })}
          </div>
        </div>
      );

    case "count":
      return (
        <div>
          {prompt}
          <div className="mt-3 space-y-4">
            {(block.items ?? []).map((n, i) => {
              const qty = Math.max(0, Math.min(20, parseInt(n, 10) || 0));
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-1 flex-wrap gap-1 text-2xl leading-none">
                    {Array.from({ length: qty }).map((_, j) => (
                      <span key={j}>{block.emoji ?? "⭐"}</span>
                    ))}
                  </div>
                  <span className="inline-block h-9 w-12 rounded-md border border-[#2E5A35]/40" />
                </div>
              );
            })}
          </div>
        </div>
      );

    case "missing-numbers":
      return (
        <div>
          {prompt}
          <ol className="mt-2 space-y-3 text-[17px] font-medium text-[#1B3722]">
            {(block.items ?? []).map((seq, i) => (
              <li key={i}>
                <span className="mr-2 text-[#2E5A35]/70">{i + 1}.</span>
                {seq}
              </li>
            ))}
          </ol>
        </div>
      );

    case "matching": {
      const pairs = block.pairs ?? [];
      const right = [...pairs].reverse();
      return (
        <div>
          {prompt}
          <div className="mt-3 grid grid-cols-2 gap-x-12">
            <ul className="space-y-3 text-[16px] text-[#1B3722]">
              {pairs.map((p, i) => (
                <li key={i} className="flex items-center justify-end gap-2">
                  {p.left}
                  <span className="inline-block size-2 rounded-full bg-[#2E5A35]" />
                </li>
              ))}
            </ul>
            <ul className="space-y-3 text-[16px] text-[#1B3722]">
              {right.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full bg-[#2E5A35]" />
                  {p.right}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    case "multiple-choice":
      return (
        <div>
          {prompt}
          <ul className="mt-2.5 space-y-3 text-[16px] leading-relaxed text-[#1B3722]">
            {(block.items ?? []).map((opt, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="inline-block size-5 shrink-0 rounded-full border-2 border-[#2E5A35]/50" />
                {opt}
              </li>
            ))}
          </ul>
        </div>
      );

    case "short-answer": {
      const qs = block.items ?? [];
      return (
        <div>
          {prompt}
          {qs.length > 0 ? (
            <ol className="mt-2.5 space-y-4 text-[16px] leading-relaxed text-[#1B3722]">
              {qs.map((q, i) => (
                <li key={i}>
                  <span className="mr-2 font-extrabold text-[#2E5A35]">{i + 1}.</span>
                  {q}
                  <Lines count={block.rows ?? 2} />
                </li>
              ))}
            </ol>
          ) : (
            <Lines count={block.rows ?? 3} />
          )}
        </div>
      );
    }

    case "passage":
      return (
        <div>
          {block.prompt ? <h3 className="mb-1.5 text-[17px] leading-snug font-extrabold text-[#2E5A35]">{block.prompt}</h3> : null}
          <p className="rounded-2xl bg-[#F1F6EC] px-5 py-3.5 text-[15.5px] leading-[1.6] text-[#22402A]">{block.text}</p>
        </div>
      );

    case "draw": {
      const notes = (block.notes ?? []).filter((n) => n && n.trim());
      const boxClass = "rounded-2xl border-2 border-dashed border-[#2E5A35]/35 bg-[#FBFDF9]";
      // Off-list "draw the subject": a GENEROUS drawing area (about a quarter page)
      // with the fun facts flanking it, half left and half right.
      if (notes.length >= 2) {
        const mid = Math.ceil(notes.length / 2);
        const note = (t: string, key: string, left: boolean) => (
          <li key={key} className={`flex items-start gap-2 ${left ? "flex-row-reverse text-right" : "text-left"}`}>
            <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-[#5B8C4E]" />
            <span className="text-[12.5px] leading-snug text-[#2E5A35]">{t}</span>
          </li>
        );
        return (
          <div>
            {prompt}
            <div className="mt-2 flex items-stretch justify-center gap-3 sm:gap-4">
              <ul className="flex w-[26%] max-w-[160px] shrink-0 flex-col justify-center gap-3.5">{notes.slice(0, mid).map((t, i) => note(t, `l-${i}`, true))}</ul>
              <div className={`${boxClass} min-h-[340px] w-[46%] max-w-[330px] flex-1`} />
              <ul className="flex w-[26%] max-w-[160px] shrink-0 flex-col justify-center gap-3.5">{notes.slice(mid).map((t, i) => note(t, `r-${i}`, false))}</ul>
            </div>
          </div>
        );
      }
      // plain draw box: generous room to draw, bigger than the old ~200px cap
      const boxH = `${Math.min(Math.max(block.rows ?? 10, 9), 14) * 28}px`;
      return (
        <div>
          {prompt}
          <div className={`mt-2 ${boxClass}`} style={{ height: boxH }} />
          <Lines count={2} />
        </div>
      );
    }

    case "fact":
      return (
        <div className="rounded-3xl bg-[#FBF1D9] px-6 py-4">
          <p className="text-[13px] font-extrabold tracking-wide text-[#C6881A] uppercase">★ {block.prompt || "Did you know?"}</p>
          {block.text ? <p className="mt-1 text-[16px] leading-[1.6] text-[#3A3320]">{block.text}</p> : null}
        </div>
      );

    case "image": {
      // Normal path: a pre-built illustration picked by imageKey (static asset).
      if (block.imageKey) {
        return (
          <div>
            {prompt}
            <div className="mt-2 flex justify-center">
              <IllustrationImg imageKey={block.imageKey} alt={block.prompt} notes={block.notes} />
            </div>
          </div>
        );
      }
      // Dormant opt-in path: a live-generated raster (data: URL).
      if (block.dataUrl) {
        return (
          <div>
            {prompt}
            <div className="mt-2 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- data: URL into a printable doc; next/image adds nothing here */}
              <img
                src={block.dataUrl}
                alt={block.imagePrompt || block.prompt || "illustration"}
                className="worksheet-img w-full max-w-[380px] rounded-2xl border border-[#2E5A35]/15"
              />
            </div>
          </div>
        );
      }
      const art = block.svgKey ? SVG_ART[block.svgKey] : undefined;
      if (!art) return null; // normalize converts unknown keys to draw boxes; this is a guard
      return (
        <div>
          {prompt}
          <div className="mt-2 flex justify-center">
            <svg
              viewBox="0 0 100 100"
              className="h-52 w-52"
              role="img"
              aria-label={block.svgKey}
              dangerouslySetInnerHTML={{
                __html: `<g fill="none" stroke="#1B3722" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${art}</g>`,
              }}
            />
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

export function WorksheetDoc({ worksheet }: { worksheet: Worksheet }) {
  return (
    <article className="print-area relative overflow-hidden rounded-[28px] border-2 border-[#2E5A35]/25 bg-[#FFFEFB] text-[#1B3722] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.55)]">
      <style dangerouslySetInnerHTML={{ __html: PRINT_RULES }} />
      {/* green banner: solid green behind the content so the wave can never cut
          through it; the wavy edge is carved along the BOTTOM. Auto-height so a
          long title wraps in full and lifts the band with it (never truncates). */}
      <div className="relative bg-[#2E5A35]">
        <div className="relative z-10 flex items-start gap-4 px-7 pt-7 pb-12 sm:px-10">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#FFFEFB] shadow-md">
            <SproutMascotIcon className="h-12 w-12" />
          </span>
          <div className="text-sprout-cream min-w-0 flex-1">
            <h1 className="text-2xl leading-tight font-bold break-words">{worksheet.title}</h1>
            {worksheet.subtitle ? <p className="text-sprout-cream/85 mt-0.5 text-sm">{worksheet.subtitle}</p> : null}
          </div>
          <span className="text-sprout-cream hidden shrink-0 self-start text-sm font-extrabold tracking-[0.25em] uppercase sm:block">
            Sprout
          </span>
        </div>
        {/* layered wavy bottom edge, carved out by the cream sheet color */}
        <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-7 w-full" aria-hidden="true">
          <path d="M0,60 V34 C200,58 340,18 500,32 C660,46 820,12 1000,30 V60 Z" fill="#76A77A" opacity="0.5" />
          <path d="M0,60 V44 C200,64 340,28 500,42 C660,56 820,22 1000,40 V60 Z" fill="#4D7B53" opacity="0.6" />
          <path d="M0,60 V52 C200,70 340,36 500,50 C660,64 820,30 1000,48 V60 Z" fill="#FFFEFB" />
        </svg>
      </div>

      <div className="worksheet-body px-7 pt-4 pb-6 sm:px-10">
        {worksheet.intro && <p className="mb-5 text-[15px] leading-relaxed text-[#1B3722]/80">{worksheet.intro}</p>}

        <div className="worksheet-blocks space-y-9">
          {worksheet.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>

        <div className="worksheet-footer mt-6 border-t border-[#2E5A35]/15 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#1B3722]/50">Name: ______________________</span>
            <span className="inline-flex items-center gap-2 text-[15px] font-extrabold tracking-tight text-[#2E5A35]">
              <span className="grid size-6 place-items-center rounded-lg bg-[#2E5A35]/10">
                <SproutMascotIcon className="h-4 w-4" />
              </span>
              Made with Sprout
            </span>
          </div>
          <p className="mt-3 text-center text-[11px] font-semibold text-[#2E5A35]/70">
            Finished? Snap a photo in the Sprout app to save it to their week.
          </p>
        </div>
      </div>
    </article>
  );
}
