"use client";

import { useState } from "react";
import { illustrationLabels } from "@/lib/resources/illustrations";

// Renders a pre-built illustration from public/resources/illustrations/<key>.webp.
// Diagram topics (e.g. solar-system) carry real label text in the catalog, which
// the APP prints flanking the picture (half on the left, half on the right) so the
// spelling is always correct and never baked into the generated image. If the asset
// is missing the <img> errors and we fall back to a clean draw box.
export function IllustrationImg({ imageKey, alt }: { imageKey: string; alt?: string }) {
  const [failed, setFailed] = useState(false);
  const labels = illustrationLabels(imageKey);

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

  // Plain illustration: just the picture.
  if (!labels || labels.length < 2) {
    return <div className="w-full max-w-[380px]">{picture}</div>;
  }

  // Diagram: real label text the app prints flanking the picture (always correct,
  // never inside the generated pixels). Half the labels left, half right.
  const mid = Math.ceil(labels.length / 2);
  const renderLabel = (t: string, side: "l" | "r") => (
    <li key={`${side}-${t}`} className={`flex items-center gap-2 ${side === "l" ? "flex-row-reverse text-right" : "text-left"}`}>
      <span className="inline-block size-1.5 shrink-0 rounded-full bg-[#2E5A35]" />
      <span className="text-[13px] leading-tight font-semibold text-[#1B3722]">{t}</span>
    </li>
  );
  return (
    <div className="flex w-full max-w-[580px] items-center justify-center gap-2 sm:gap-4">
      <ul className="flex shrink-0 flex-col gap-2.5">{labels.slice(0, mid).map((t) => renderLabel(t, "l"))}</ul>
      <div className="min-w-0 max-w-[220px] flex-1">{picture}</div>
      <ul className="flex shrink-0 flex-col gap-2.5">{labels.slice(mid).map((t) => renderLabel(t, "r"))}</ul>
    </div>
  );
}
