// Team announcements — product updates to the Sprout resource builder, newest
// first. Code-driven for now: an announcement ships in the same release as the
// thing it describes, so no backend or admin posting is needed yet. The
// Community page pins these at the top; the nav badges the unseen count against
// each browser's locally-stored "last seen" time. Readers can leave a heart on
// each one (see app/api/resources/announcement-hearts).
//
// To post a new one: add an entry at the TOP with a fresh `ts` (a later time
// than the others). Everyone's badge lights up until they open the Community.

export type Announcement = { id: string; ts: number; title: string; body: string };

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "slideshow-generator",
    ts: Date.parse("2026-07-01T09:00:00Z"),
    title: "Slideshow generator is here",
    body: "Type a topic and Sprout builds a little illustrated lesson you can present full screen or print. Look for the New card on the library.",
  },
  {
    id: "one-community-home",
    ts: Date.parse("2026-06-30T09:00:00Z"),
    title: "One home for the Community",
    body: "Worksheets other parents made, the chat, and these updates all live under one Community now, with three simple tabs instead of two scattered places.",
  },
  {
    id: "warmer-look",
    ts: Date.parse("2026-06-28T09:00:00Z"),
    title: "A warmer, calmer look",
    body: "We softened the whole library. Cleaner cards, more room to breathe, and the frosted-glass look carried through the Community.",
  },
  {
    id: "backup-restore",
    ts: Date.parse("2026-06-27T09:00:00Z"),
    title: "Back up and restore your stuff",
    body: "Your worksheets and kid profiles live in your own browser. You can now download a backup and restore it on any device, so clearing your browser never loses your work.",
  },
  {
    id: "bigger-illustrations",
    ts: Date.parse("2026-06-26T09:00:00Z"),
    title: "Bigger, clearer illustrations",
    body: "Worksheet pictures are larger and sharper now, and every topic that has an illustration always shows it.",
  },
  {
    id: "save-to-kid",
    ts: Date.parse("2026-06-25T09:00:00Z"),
    title: "Save a sheet to a kid's profile",
    body: "Any worksheet can now be saved into a kid's private profile, so their work stays together in one place.",
  },
  {
    id: "build-your-own",
    ts: Date.parse("2026-06-23T09:00:00Z"),
    title: "Build your own worksheets",
    body: "Describe any worksheet in your own words and Sprout builds it from scratch, made for your kid's age and the things they love. Look for Build your own on the library.",
  },
  {
    id: "data-stays-yours",
    ts: Date.parse("2026-06-20T09:00:00Z"),
    title: "Your data stays yours",
    body: "Your private worksheets and your kids' profiles never touch a Sprout server. Nothing is sold, nothing trains an AI. Only what you choose to publish is shared.",
  },
];

export const LATEST_ANNOUNCEMENT_TS = ANNOUNCEMENTS.reduce((m, a) => Math.max(m, a.ts), 0);

export function unseenAnnouncements(seenAt: number): number {
  return ANNOUNCEMENTS.filter((a) => a.ts > seenAt).length;
}
