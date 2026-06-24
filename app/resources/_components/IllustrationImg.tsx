"use client";

import { useState } from "react";

// Renders a pre-built illustration from public/resources/illustrations/<key>.webp.
// If the asset is missing (not generated yet) the <img> errors and we fall back to
// a clean draw box, so a not-yet-generated key never shows a broken image.
export function IllustrationImg({ imageKey, alt }: { imageKey: string; alt?: string }) {
  const [failed, setFailed] = useState(false);

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

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static asset in a printable doc; next/image adds nothing
    <img
      src={`/resources/illustrations/${imageKey}.webp`}
      alt={alt || imageKey.replace(/-/g, " ")}
      onError={() => setFailed(true)}
      className="worksheet-img w-full max-w-[380px] rounded-2xl border border-[#2E5A35]/15"
    />
  );
}
