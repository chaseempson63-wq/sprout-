"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSprout } from "@/lib/sprout/store";
import {
  dayHeading,
  entriesInWeek,
  monthDay,
  weekLabel,
  weekSubLabel,
} from "@/lib/sprout/stats";
import type { Entry } from "@/lib/sprout/types";
import { EntryCard } from "../_components/EntryCard";
import { KidAvatar } from "../_components/chips";
import { card } from "../_components/ui";

const MAX_WEEKS_BACK = 52;

export default function TimelinePage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Timeline />
    </Suspense>
  );
}

function Timeline() {
  const { ready, kids, entries, lastAddedId } = useSprout();
  const searchParams = useSearchParams();
  const [kidFilter, setKidFilter] = useState<string | null>(
    searchParams.get("kid"),
  );
  const [weeksBack, setWeeksBack] = useState(0);

  if (!ready) return <Skeleton />;

  const now = Date.now();
  const filtered = kidFilter
    ? entries.filter((e) => e.kidIds.includes(kidFilter))
    : entries;
  const week = entriesInWeek(filtered, now, weeksBack);

  // Group by local day, newest day first, newest entry first within a day.
  const groups = new Map<number, Entry[]>();
  for (const entry of week) {
    const d = new Date(entry.createdAt);
    d.setHours(0, 0, 0, 0);
    const key = d.getTime();
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }
  const days = [...groups.entries()].sort((a, b) => b[0] - a[0]);
  for (const [, list] of days) list.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill active={kidFilter === null} onClick={() => setKidFilter(null)}>
          All
        </FilterPill>
        {kids.map((kid) => (
          <FilterPill
            key={kid.id}
            active={kidFilter === kid.id}
            onClick={() => setKidFilter(kid.id)}
          >
            <KidAvatar kid={kid} size={16} />
            {kid.name}
          </FilterPill>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <WeekArrow
          direction="back"
          disabled={weeksBack >= MAX_WEEKS_BACK}
          onClick={() => setWeeksBack((w) => Math.min(MAX_WEEKS_BACK, w + 1))}
        />
        <div className="text-center">
          <p className="font-display text-[18px] font-bold leading-tight tracking-tight text-app-forest">
            {weekLabel(now, weeksBack)}
          </p>
          <p className="text-[11.5px] text-app-pine/45">
            {weekSubLabel(now, weeksBack)}
          </p>
        </div>
        <WeekArrow
          direction="forward"
          disabled={weeksBack === 0}
          onClick={() => setWeeksBack((w) => Math.max(0, w - 1))}
        />
      </div>

      {days.length === 0 ? (
        weeksBack === 0 ? (
          <div className={`${card} mt-6 px-6 py-12 text-center`}>
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-app-lime/30 text-app-forest">
              <Camera size={20} strokeWidth={2} aria-hidden="true" />
            </span>
            <p className="mt-3 font-display text-[17px] font-bold text-app-forest">
              Nothing logged this week yet
            </p>
            <p className="mx-auto mt-1 max-w-60 text-[13px] leading-relaxed text-app-pine/55">
              One photo or one sentence is all it takes.
            </p>
            <Link
              href="/app/new"
              className="mt-4 inline-block rounded-full bg-app-forest px-5 py-2.5 text-[13.5px] font-semibold text-app-cream"
            >
              Log the first moment
            </Link>
          </div>
        ) : (
          <p className="mt-12 text-center text-[13.5px] text-app-pine/50">
            A quiet week on the record.
          </p>
        )
      ) : (
        days.map(([dayStart, list]) => (
          <section key={dayStart} className="mt-6">
            <div className="flex items-baseline justify-between px-1">
              <h2 className="font-display text-[17px] font-bold tracking-tight text-app-forest">
                {dayHeading(dayStart, now)}
              </h2>
              <span className="text-[11.5px] text-app-pine/45">
                {monthDay(dayStart)} · {list.length}{" "}
                {list.length === 1 ? "moment" : "moments"}
              </span>
            </div>
            <div className="mt-2.5 space-y-3">
              {list.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  kids={kids}
                  highlight={entry.id === lastAddedId}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors",
        active
          ? "bg-app-forest text-app-cream"
          : "border border-app-pine/[0.08] bg-white text-app-forest/70",
      )}
    >
      {children}
    </button>
  );
}

function WeekArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "back" | "forward";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "back" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "back" ? "Earlier week" : "Later week"}
      className="grid size-9 place-items-center rounded-full border border-app-pine/[0.08] bg-white text-app-forest transition-opacity disabled:opacity-30"
    >
      <Icon size={17} strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="flex gap-2">
        <div className="h-9 w-16 rounded-full bg-app-pine/[0.06]" />
        <div className="h-9 w-20 rounded-full bg-app-pine/[0.06]" />
        <div className="h-9 w-20 rounded-full bg-app-pine/[0.06]" />
      </div>
      <div className="h-12 rounded-2xl bg-app-pine/[0.05]" />
      <div className="h-64 rounded-3xl bg-app-pine/[0.05]" />
      <div className="h-40 rounded-3xl bg-app-pine/[0.05]" />
    </div>
  );
}
