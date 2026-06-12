import type { Entry, SubjectId } from "./types";
import { startOfWeek } from "./seed";

export const DAY = 24 * 60 * 60 * 1000;

/* Weekly goals for the rings. Fixed for now; per-family goals can come
   later once real usage shows where the defaults should sit. */
export const GOALS = {
  days: 5, // documented days per week
  moments: 12, // entries per week
  variety: 4, // distinct subject areas per week
};

/** Days a week needs to count toward the streak. */
const STREAK_MIN_DAYS = 4;

export function weekStart(now: number, weeksBack = 0): number {
  return startOfWeek(now) - weeksBack * 7 * DAY;
}

export function entriesInWeek(entries: Entry[], now: number, weeksBack = 0): Entry[] {
  const start = weekStart(now, weeksBack);
  const end = start + 7 * DAY;
  return entries.filter((e) => e.createdAt >= start && e.createdAt < end);
}

/** Entry counts for Mon..Sun of the given week. */
export function perDayCounts(weekEntries: Entry[], start: number): number[] {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const e of weekEntries) {
    const i = Math.floor((e.createdAt - start) / DAY);
    if (i >= 0 && i < 7) counts[i] += 1;
  }
  return counts;
}

export function daysDocumented(weekEntries: Entry[], start: number): number {
  return perDayCounts(weekEntries, start).filter((c) => c > 0).length;
}

export function distinctSubjects(weekEntries: Entry[]): number {
  return new Set(weekEntries.map((e) => e.subjectId).filter(Boolean)).size;
}

/** Subject mix for the week, untagged entries grouped under null. */
export function subjectMix(
  weekEntries: Entry[],
): { subjectId: SubjectId | null; count: number }[] {
  const counts = new Map<SubjectId | null, number>();
  for (const e of weekEntries) {
    const key = e.subjectId ?? null;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([subjectId, count]) => ({ subjectId, count }))
    .sort((a, b) => b.count - a.count);
}

/** Entries per kid; a shared entry counts for each kid on it. */
export function perKidCounts(weekEntries: Entry[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const e of weekEntries) {
    for (const id of e.kidIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

export function kidSubjects(weekEntries: Entry[], kidId: string): SubjectId[] {
  const seen: SubjectId[] = [];
  for (const e of weekEntries) {
    if (!e.kidIds.includes(kidId) || !e.subjectId) continue;
    if (!seen.includes(e.subjectId)) seen.push(e.subjectId);
  }
  return seen;
}

/** Consecutive weeks at STREAK_MIN_DAYS or better. The current week joins
    the streak as soon as it qualifies; until then it doesn't break it. */
export function weekStreak(entries: Entry[], now: number): number {
  let streak = 0;
  const thisWeek = entriesInWeek(entries, now, 0);
  if (daysDocumented(thisWeek, weekStart(now, 0)) >= STREAK_MIN_DAYS) streak += 1;
  for (let back = 1; back < 104; back++) {
    const week = entriesInWeek(entries, now, back);
    if (daysDocumented(week, weekStart(now, back)) >= STREAK_MIN_DAYS) streak += 1;
    else break;
  }
  return streak;
}

/* ── Formatting ───────────────────────────────────────────────── */

const MONTH = new Intl.DateTimeFormat("en-US", { month: "long" });
const MONTH_DAY = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" });
const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const TIME = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

export function weekLabel(now: number, weeksBack = 0): string {
  if (weeksBack === 0) return "This week";
  if (weeksBack === 1) return "Last week";
  return `Week of ${MONTH_DAY.format(weekStart(now, weeksBack))}`;
}

export function weekSubLabel(now: number, weeksBack = 0): string {
  const start = weekStart(now, weeksBack);
  const end = start + 6 * DAY;
  const s = new Date(start);
  const e = new Date(end);
  if (s.getMonth() === e.getMonth()) {
    return `${MONTH.format(s)} ${s.getDate()} to ${e.getDate()}`;
  }
  return `${MONTH_DAY.format(s)} to ${MONTH_DAY.format(e)}`;
}

export function dayHeading(dayStart: number, now: number): string {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const today = d.getTime();
  d.setDate(d.getDate() - 1);
  if (dayStart === today) return "Today";
  if (dayStart === d.getTime()) return "Yesterday";
  return WEEKDAY.format(dayStart);
}

export function monthDay(t: number): string {
  return MONTH_DAY.format(t);
}

export function timeLabel(t: number): string {
  return TIME.format(t).toLowerCase();
}
