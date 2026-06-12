"use client";

import { Sprout } from "lucide-react";
import { useSprout } from "@/lib/sprout/store";
import { weekStreak } from "@/lib/sprout/stats";

/* Week streak, the quiet gamification anchor. A week joins the streak at
   four documented days; the current week can't break it before it's over. */

export function HeaderStreak() {
  const { ready, entries } = useSprout();
  if (!ready) return null;

  const streak = weekStreak(entries, Date.now());
  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-app-pine/[0.08] bg-white px-3 py-1.5">
      <Sprout size={14} strokeWidth={2.5} className="text-app-gold" aria-hidden="true" />
      <span className="text-xs font-semibold text-app-forest">
        {streak} week streak
      </span>
    </div>
  );
}
