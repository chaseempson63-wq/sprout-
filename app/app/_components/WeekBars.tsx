"use client";

import { cn } from "@/lib/utils";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

/* Moments per day, Mon..Sun. Lime bars for documented days, a quiet dot
   for empty past days, nearly nothing for days that haven't happened yet.
   todayIndex is -1 when the rendered week isn't the current one. */

export function WeekBars({
  counts,
  todayIndex,
}: {
  counts: number[];
  todayIndex: number;
}) {
  const max = Math.max(...counts, 1);

  return (
    <div className="flex items-end gap-2">
      {counts.map((count, i) => {
        const isToday = i === todayIndex;
        const isFuture = todayIndex >= 0 && i > todayIndex;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-24 w-full flex-col items-center justify-end gap-1">
              {count > 0 && (
                <span className="text-[11px] font-semibold text-app-pine/50">
                  {count}
                </span>
              )}
              {count > 0 ? (
                <div
                  className="w-full rounded-[10px] bg-app-lime"
                  style={{ height: 12 + (count / max) * 60 }}
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
