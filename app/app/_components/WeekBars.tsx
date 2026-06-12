"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const LIME_TOP = "#cdf271";
const LIME_BASE = "#aad63e";

/* Moments per day, Mon..Sun. Bars carry a vertical lime gradient with a
   hairline top highlight and grow in with a small stagger. Empty past days
   get a quiet dot; days that haven't happened yet get almost nothing.
   todayIndex is -1 when the rendered week isn't the current one. */

export function WeekBars({
  counts,
  todayIndex,
}: {
  counts: number[];
  todayIndex: number;
}) {
  const max = Math.max(...counts, 1);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setArmed(true);
      return;
    }
    const raf = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex items-end gap-2">
      {counts.map((count, i) => {
        const isToday = i === todayIndex;
        const isFuture = todayIndex >= 0 && i > todayIndex;
        const fullHeight = 14 + (count / max) * 58;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-24 w-full flex-col items-center justify-end gap-1">
              {count > 0 && (
                <span
                  className="text-[11px] font-semibold tabular-nums text-app-pine/50 transition-opacity duration-500"
                  style={{
                    opacity: armed ? 1 : 0,
                    transitionDelay: `${300 + i * 50}ms`,
                  }}
                >
                  {count}
                </span>
              )}
              {count > 0 ? (
                <div
                  className="w-full rounded-[10px]"
                  style={{
                    height: armed ? fullHeight : 6,
                    background: `linear-gradient(to bottom, ${LIME_TOP}, ${LIME_BASE})`,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(20,46,34,0.06)",
                    transition: `height 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 55}ms`,
                  }}
                />
              ) : (
                <div
                  className={cn(
                    "mb-0.5 size-1.5 rounded-full",
                    isFuture ? "bg-app-pine/[0.06]" : "bg-app-pine/15",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "grid size-5 place-items-center rounded-full text-[11px] font-semibold",
                isToday
                  ? "bg-app-forest text-app-cream"
                  : isFuture
                    ? "text-app-pine/25"
                    : "text-app-pine/45",
              )}
            >
              {DAY_LETTERS[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
