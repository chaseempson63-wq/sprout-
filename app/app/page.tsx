"use client";

import Link from "next/link";
import { Camera, ChevronRight } from "lucide-react";
import { useSprout } from "@/lib/sprout/store";
import {
  GOALS,
  DAY,
  daysDocumented,
  distinctSubjects,
  entriesInWeek,
  kidSubjects,
  perDayCounts,
  perKidCounts,
  subjectMix,
  weekStart,
  weekSubLabel,
} from "@/lib/sprout/stats";
import { subjectById } from "@/lib/sprout/subjects";
import type { Kid, SubjectId } from "@/lib/sprout/types";
import { ActivityRings } from "./_components/ActivityRings";
import { WeekBars } from "./_components/WeekBars";
import { EntryCard } from "./_components/EntryCard";
import { KidAvatar } from "./_components/chips";
import { card, Overline, SectionTitle } from "./_components/ui";

const RING_COLORS = {
  days: "#b7e34f",
  moments: "#1e4636",
  variety: "#c39434",
};

export default function ThisWeekPage() {
  const { ready } = useSprout();
  if (!ready) return <Skeleton />;
  return <Dashboard />;
}

function Dashboard() {
  const { kids, entries, demo, demoNoticeDismissed, startClean, dismissDemoNotice } =
    useSprout();

  const now = Date.now();
  const start = weekStart(now);
  const week = entriesInWeek(entries, now);
  const counts = perDayCounts(week, start);
  const days = daysDocumented(week, start);
  const variety = distinctSubjects(week);
  const moments = week.length;
  const mix = subjectMix(week).slice(0, 5);
  const kidCounts = perKidCounts(week);

  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const todayIndex = Math.min(6, Math.max(0, Math.round((midnight.getTime() - start) / DAY)));
  const todayCount = counts[todayIndex] ?? 0;

  const encouragement =
    days >= GOALS.days
      ? "A full week on the record. Nothing to second guess tonight."
      : todayCount > 0
        ? "Today is on the board. The week is filling in."
        : moments > 0
          ? "Nothing logged today yet. One photo is plenty."
          : "The week starts with one moment. Log the first.";

  return (
    <div className="space-y-7">
      <div>
        <Overline>This week</Overline>
        <h1 className="mt-1 font-display text-[28px] font-bold leading-none tracking-tight text-app-forest">
          {weekSubLabel(now)}
        </h1>
        <p className="mt-2 text-[13px] text-app-pine/55">
          {moments} {moments === 1 ? "moment" : "moments"} · {days}{" "}
          {days === 1 ? "day" : "days"} · {kids.length} kids
        </p>
      </div>

      {demo && !demoNoticeDismissed && (
        <div className="rounded-3xl bg-app-sand p-4">
          <p className="text-[13px] leading-relaxed text-app-pine/75">
            A demo family lives here so you can poke around. When you&apos;re
            ready, start clean and make it yours.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={startClean}
              className="rounded-full border border-app-pine/[0.08] bg-white px-3.5 py-1.5 text-xs font-semibold text-app-forest"
            >
              Start clean
            </button>
            <button
              onClick={dismissDemoNotice}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-app-pine/55"
            >
              Keep exploring
            </button>
          </div>
        </div>
      )}

      <section className={`${card} p-5`}>
        <div className="flex justify-center pt-1">
          <ActivityRings
            size={176}
            rings={[
              { value: days, goal: GOALS.days, color: RING_COLORS.days },
              { value: moments, goal: GOALS.moments, color: RING_COLORS.moments },
              { value: variety, goal: GOALS.variety, color: RING_COLORS.variety },
            ]}
            center={
              <div className="text-center">
                <div className="font-display text-[32px] font-extrabold leading-none text-app-forest">
                  {days}
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-app-pine/45">
                  of {GOALS.days} days
                </div>
              </div>
            }
          />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <LegendCell
            color={RING_COLORS.days}
            label="Days"
            value={String(days)}
            detail={`of ${GOALS.days}`}
          />
          <LegendCell
            color={RING_COLORS.moments}
            label="Moments"
            value={String(moments)}
            detail={`of ${GOALS.moments}`}
          />
          <LegendCell
            color={RING_COLORS.variety}
            label="Variety"
            value={String(variety)}
            detail={variety === 1 ? "area" : "areas"}
          />
        </div>
        <p className="mt-4 border-t border-app-pine/[0.06] pt-3.5 text-[13px] leading-relaxed text-app-pine/60">
          {encouragement}
        </p>
      </section>

      <section className={`${card} p-5`}>
        <div className="flex items-baseline justify-between">
          <SectionTitle>Daily rhythm</SectionTitle>
          <span className="text-[11.5px] text-app-pine/45">
            {moments} this week
          </span>
        </div>
        <div className="mt-4">
          <WeekBars counts={counts} todayIndex={todayIndex} />
        </div>
      </section>

      {mix.length > 0 && (
        <section className={`${card} p-5`}>
          <SectionTitle>Where the week went</SectionTitle>
          <div className="mt-4 space-y-3">
            {mix.map(({ subjectId, count }) => {
              const subject = subjectById(subjectId);
              const color = subject?.color ?? "#1e4636";
              const Icon = subject?.icon ?? Camera;
              const max = mix[0].count;
              return (
                <div key={subjectId ?? "untagged"} className="flex items-center gap-3">
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${color}14`, color }}
                  >
                    <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <span className="flex-1 truncate text-[13px] font-medium text-app-pine/80">
                    {subject?.label ?? "Everyday moments"}
                  </span>
                  <span className="h-1.5 w-24 overflow-hidden rounded-full bg-app-pine/[0.06]">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${(count / max) * 100}%`, backgroundColor: color }}
                    />
                  </span>
                  <span className="w-4 text-right text-xs font-semibold text-app-pine/55">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionTitle>By kid</SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {kids.map((kid) => (
            <KidCard
              key={kid.id}
              kid={kid}
              count={kidCounts.get(kid.id) ?? 0}
              subjectIds={kidSubjects(week, kid.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <SectionTitle>Latest moments</SectionTitle>
          <Link
            href="/app/timeline"
            className="flex items-center gap-0.5 text-[13px] font-semibold text-app-forest"
          >
            The whole week
            <ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          {entries.length === 0 ? (
            <div className={`${card} px-6 py-10 text-center`}>
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-app-lime/30 text-app-forest">
                <Camera size={20} strokeWidth={2} aria-hidden="true" />
              </span>
              <p className="mt-3 font-display text-[17px] font-bold text-app-forest">
                Nothing logged yet
              </p>
              <p className="mx-auto mt-1 max-w-60 text-[13px] leading-relaxed text-app-pine/55">
                One photo or one sentence is all it takes to start the week.
              </p>
              <Link
                href="/app/new"
                className="mt-4 inline-block rounded-full bg-app-forest px-5 py-2.5 text-[13.5px] font-semibold text-app-cream"
              >
                Log the first moment
              </Link>
            </div>
          ) : (
            entries
              .slice(0, 2)
              .map((entry) => <EntryCard key={entry.id} entry={entry} kids={kids} />)
          )}
        </div>
      </section>
    </div>
  );
}

function LegendCell({
  color,
  label,
  value,
  detail,
}: {
  color: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5">
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-app-pine/45">
          {label}
        </span>
      </div>
      <p className="mt-1 font-display text-[18px] font-bold leading-none text-app-forest">
        {value}{" "}
        <span className="text-[12px] font-medium text-app-pine/45">{detail}</span>
      </p>
    </div>
  );
}

function KidCard({
  kid,
  count,
  subjectIds,
}: {
  kid: Kid;
  count: number;
  subjectIds: SubjectId[];
}) {
  return (
    <Link
      href={`/app/timeline?kid=${kid.id}`}
      className={`${card} flex flex-col gap-3 p-4 transition-transform active:scale-[0.98]`}
    >
      <div className="flex items-center gap-2.5">
        <KidAvatar kid={kid} size={34} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-bold text-app-forest">
            {kid.name}
          </p>
          <p className="whitespace-nowrap text-[11px] text-app-pine/50">
            {count} {count === 1 ? "moment" : "moments"}
          </p>
        </div>
        <ChevronRight size={15} className="shrink-0 text-app-pine/30" aria-hidden="true" />
      </div>
      <div className="flex items-center gap-1.5">
        {subjectIds.length === 0 ? (
          <span className="text-[11px] text-app-pine/40">Quiet so far this week</span>
        ) : (
          subjectIds.slice(0, 6).map((id) => {
            const subject = subjectById(id);
            return (
              <span
                key={id}
                title={subject?.label}
                className="size-2 rounded-full"
                style={{ backgroundColor: subject?.color }}
              />
            );
          })
        )}
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-7">
      <div className="space-y-2">
        <div className="h-3 w-16 rounded-full bg-app-pine/[0.06]" />
        <div className="h-8 w-44 rounded-xl bg-app-pine/[0.06]" />
      </div>
      <div className="h-56 rounded-3xl bg-app-pine/[0.05]" />
      <div className="h-44 rounded-3xl bg-app-pine/[0.05]" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-24 rounded-3xl bg-app-pine/[0.05]" />
        <div className="h-24 rounded-3xl bg-app-pine/[0.05]" />
      </div>
    </div>
  );
}
