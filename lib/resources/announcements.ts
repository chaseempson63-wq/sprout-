// Team announcements — product updates to the Sprout resource builder, newest
// first. Code-driven for now: an announcement ships in the same release as the
// thing it describes, so no backend or admin posting is needed yet. The
// Community page pins these at the top; the nav badges the unseen count against
// each browser's locally-stored "last seen" time.
//
// To post a new one: add an entry at the TOP with a fresh `ts` (a later time
// than the others). Everyone's badge lights up until they open the Community.

export type Announcement = { id: string; ts: number; title: string; body: string };

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "bigger-illustrations",
    ts: Date.parse("2026-06-26T09:00:00Z"),
    title: "Bigger, clearer illustrations",
    body: "Worksheet pictures are about twice the size now, and any topic that has an illustration will always show it.",
  },
  {
    id: "save-to-kid",
    ts: Date.parse("2026-06-25T21:00:00Z"),
    title: "Save a sheet to a kid's profile",
    body: "Any worksheet can now be saved into a kid's private profile, so their work stays together in one place.",
  },
  {
    id: "build-your-own",
    ts: Date.parse("2026-06-25T20:00:00Z"),
    title: "Build your own worksheets",
    body: "Describe any worksheet in your own words and Sprout builds it from scratch. Look for Build your own on the library.",
  },
];

export const LATEST_ANNOUNCEMENT_TS = ANNOUNCEMENTS.reduce((m, a) => Math.max(m, a.ts), 0);

export function unseenAnnouncements(seenAt: number): number {
  return ANNOUNCEMENTS.filter((a) => a.ts > seenAt).length;
}
