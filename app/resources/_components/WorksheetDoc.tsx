// The printable worksheet. White paper inside a wavy green Sprout border, with
// the colored mascot + wordmark up top. Each block renders as something a child
// fills in by hand. This is the .print-area print target.

import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import type { Worksheet, WorksheetBlock } from "@/lib/resources/types";

const FOREST = "#2E5A35";

// A scalloped (wavy) rounded rectangle path. Stretched to fill the sheet with a
// non-scaling stroke so the border reads as an even wavy green frame.
function scallopPath(w = 1000, h = 1400, s = 32): string {
  const nx = Math.max(4, Math.round(w / (s * 2)));
  const ny = Math.max(6, Math.round(h / (s * 2)));
  const dx = w / nx;
  const dy = h / ny;
  const out: string[] = ["M 0 0"];
  for (let i = 0; i < nx; i++) {
    const x0 = i * dx;
    const x1 = (i + 1) * dx;
    out.push(`Q ${(x0 + x1) / 2} ${s} ${x1} 0`);
  }
  for (let i = 0; i < ny; i++) {
    const y0 = i * dy;
    const y1 = (i + 1) * dy;
    out.push(`Q ${w - s} ${(y0 + y1) / 2} ${w} ${y1}`);
  }
  for (let i = 0; i < nx; i++) {
    const x0 = w - i * dx;
    const x1 = w - (i + 1) * dx;
    out.push(`Q ${(x0 + x1) / 2} ${h - s} ${x1} ${h}`);
  }
  for (let i = 0; i < ny; i++) {
    const y0 = h - i * dy;
    const y1 = h - (i + 1) * dy;
    out.push(`Q ${s} ${(y0 + y1) / 2} 0 ${y1}`);
  }
  out.push("Z");
  return out.join(" ");
}

function Lines({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-2 space-y-5">
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
  const prompt = block.prompt ? (
    <p className="text-[13px] font-semibold text-[#2E5A35]">{block.prompt}</p>
  ) : null;

  switch (block.kind) {
    case "instructions":
      return <p className="text-[15px] leading-relaxed font-medium text-[#1B3722]">{block.prompt}</p>;

    case "trace":
      return (
        <div>
          {prompt}
          <div className="mt-3 select-none text-4xl font-bold tracking-[0.15em] text-[#1B3722]/20" style={{ fontFamily: "var(--font-geist-sans)" }}>
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

    case "math":
      return (
        <div>
          {prompt}
          <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            {(block.items ?? []).map((p, i) => (
              <div key={i} className="flex items-center text-[17px] text-[#1B3722]">
                <span className="mr-1 text-[#2E5A35]/70">{i + 1}.</span>
                <span className="font-medium">{p}</span>
                <AnswerBox />
              </div>
            ))}
          </div>
        </div>
      );

    case "column-math":
      return (
        <div>
          {prompt}
          <div className="mt-3 flex flex-wrap gap-6">
            {(block.items ?? []).map((p, i) => {
              const m = p.match(/(\d+)\s*([+\-−×])\s*(\d+)/);
              const a = m?.[1] ?? p;
              const op = m?.[2] ?? "+";
              const b = m?.[3] ?? "";
              return (
                <div key={i} className="w-24 font-mono text-[18px] text-[#1B3722]">
                  <div className="text-right">{a}</div>
                  <div className="flex justify-between border-b-2 border-[#1B3722] pb-1">
                    <span>{op}</span>
                    <span>{b}</span>
                  </div>
                  <div className="h-8" />
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
          <ul className="mt-2 space-y-2 text-[15px] text-[#1B3722]">
            {(block.items ?? []).map((opt, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="inline-block size-5 rounded-full border-2 border-[#2E5A35]/50" />
                {opt}
              </li>
            ))}
          </ul>
        </div>
      );

    case "short-answer":
      return (
        <div>
          {prompt}
          <ol className="mt-2 space-y-4 text-[15px] text-[#1B3722]">
            {(block.items ?? []).map((q, i) => (
              <li key={i}>
                <span className="mr-2 font-semibold text-[#2E5A35]">{i + 1}.</span>
                {q}
                <Lines count={block.rows ?? 2} />
              </li>
            ))}
          </ol>
        </div>
      );

    case "passage":
      return (
        <div>
          {prompt}
          <div className="mt-2 rounded-2xl border border-[#2E5A35]/20 bg-[#F3F7F0] px-5 py-4 text-[15px] leading-relaxed text-[#1B3722]">
            {block.text}
          </div>
        </div>
      );

    case "draw":
      return (
        <div>
          {prompt}
          <div className="mt-2 rounded-2xl border-2 border-dashed border-[#2E5A35]/35" style={{ height: `${(block.rows ?? 6) * 26}px` }} />
          <Lines count={2} />
        </div>
      );

    default:
      return null;
  }
}

export function WorksheetDoc({ worksheet }: { worksheet: Worksheet }) {
  const answerBlocks = worksheet.blocks
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.answers && b.answers.length > 0);

  return (
    <article className="print-area relative text-[#1B3722]">
      <svg viewBox="0 0 1000 1400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={scallopPath()} fill="#FFFEFB" stroke={FOREST} strokeWidth="5" vectorEffect="non-scaling-stroke" />
        <path d={scallopPath(1000, 1400, 32)} fill="none" stroke={FOREST} strokeOpacity="0.25" strokeWidth="1.5" vectorEffect="non-scaling-stroke" transform="translate(0 0) scale(0.985) translate(8 11)" />
      </svg>

      <div className="relative px-7 py-9 sm:px-12 sm:py-11">
        <header className="flex items-center gap-3 border-b-2 border-dashed border-[#2E5A35]/25 pb-4">
          <SproutMascotIcon className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl leading-tight font-bold tracking-[-0.01em] text-[#1B3722]">{worksheet.title}</h1>
            <p className="text-sm text-[#2E5A35]">{worksheet.subtitle}</p>
          </div>
          <div className="hidden text-right text-[11px] font-bold tracking-[0.2em] text-[#2E5A35]/70 uppercase sm:block">
            Sprout
          </div>
        </header>

        {worksheet.intro && <p className="mt-4 text-[15px] leading-relaxed text-[#1B3722]/80">{worksheet.intro}</p>}

        <div className="mt-5 space-y-7">
          {worksheet.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[#2E5A35]/20 pt-3 text-[11px] text-[#2E5A35]/70">
          <span>Name: ___________________</span>
          <span>Made with Sprout · hisprout.app</span>
        </div>
      </div>

      {answerBlocks.length > 0 && (
        <details className="no-print mt-4 rounded-xl border border-[#2E5A35]/20 bg-[#F3F7F0] p-3 text-[#1B3722]">
          <summary className="cursor-pointer text-sm font-semibold text-[#2E5A35]">Answer key (for the grown-up)</summary>
          <div className="mt-2 space-y-2 text-sm">
            {answerBlocks.map(({ b, i }) => (
              <div key={i}>
                <span className="font-medium text-[#2E5A35]">{b.prompt ? b.prompt.slice(0, 40) : b.kind}:</span>{" "}
                {(b.answers ?? []).join("  ·  ")}
              </div>
            ))}
          </div>
        </details>
      )}
    </article>
  );
}
