"use client";

import { useState } from "react";
import { illustrationLabels } from "@/lib/resources/illustrations";

// Renders a pre-built illustration from public/resources/illustrations/<key>.webp,
// and fills the whitespace beside it. Diagram topics carry part-name LABELS in the
// catalog (short, e.g. the 8 planets). Any other image gets the model's NOTES (a
// few short fun facts about the subject). Either way the text is app-rendered, half
// down the left and half down the right, so spelling is always correct. A missing
// asset errors and falls back to a clean draw box.
export function IllustrationImg({ imageKey, alt, notes }: { imageKey: string; alt?: string; notes?: string[] }) {
  const [failed, setFailed] = useState(false);
  const labels = illustrationLabels(imageKey);
  const facts = !labels && notes ? notes.filter((n) => n && n.trim()).slice(0, 6) : undefined;
  const side = labels && labels.length >= 2 ? labels : facts && facts.length >= 2 ? facts : null;
  const isFacts = !labels && !!side;

  if (failed) {
    return (
      <div
        className="worksheet-img flex h-44 w-full max-w-[380px] items-center justify-center rounded-2xl border-2 border-dashed border-[#2E5A35]/30 text-[12px] text-[#2E5A35]/60"
        aria-label={`Draw ${alt || imageKey} here`}
      >
        Draw {alt || imageKey.replace(/-/g, " ")} here
      </div>
    );
  }

  const picture = (
    // eslint-disable-next-line @next/next/no-img-element -- static asset in a printable doc; next/image adds nothing
    <img
      src={`/resources/illustrations/${imageKey}.webp`}
      alt={alt || imageKey.replace(/-/g, " ")}
      onError={() => setFailed(true)}
      className="worksheet-img w-full rounded-2xl border border-[#2E5A35]/15"
    />
  );

  if (!side) {
    return <div className="w-full max-w-[600px]">{picture}</div>;
  }

  const mid = Math.ceil(side.length / 2);
  const renderItem = (t: string, key: string, leftSide: boolean) => (
    <li key={key} className={`flex gap-2 ${isFacts ? "items-start" : "items-center"} ${leftSide ? "flex-row-reverse text-right" : "text-left"}`}>
      <span className={`inline-block size-1.5 shrink-0 rounded-full bg-[#5B8C4E] ${isFacts ? "mt-1.5" : ""}`} />
      <span className={isFacts ? "text-[12.5px] leading-snug text-[#2E5A35]" : "text-[13px] leading-tight font-bold text-[#1B3722]"}>{t}</span>
    </li>
  );
  return (
    <div className={`flex w-full items-center justify-center gap-2 sm:gap-4 ${isFacts ? "max-w-[920px]" : "max-w-[800px]"}`}>
      <ul className={`flex shrink-0 flex-col gap-3 ${isFacts ? "w-[30%] max-w-[165px]" : ""}`}>
        {side.slice(0, mid).map((t, i) => renderItem(t, `l-${i}`, true))}
      </ul>
      <div className={`min-w-0 flex-1 ${isFacts ? "max-w-[420px]" : "max-w-[400px]"}`}>{picture}</div>
      <ul className={`flex shrink-0 flex-col gap-3 ${isFacts ? "w-[30%] max-w-[165px]" : ""}`}>
        {side.slice(mid).map((t, i) => renderItem(t, `r-${i}`, false))}
      </ul>
    </div>
  );
}
