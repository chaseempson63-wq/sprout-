# Sprout — Rork change requests (round 2)

Batched fixes + changes after the first Rork Max build, tested on-device. Paste the fenced block into Rork in one message (Max bills per message, so send it as one pass).

---

```
Round 2 changes for Sprout. Keep everything that already works: the color palette (it's dialed), saving a log, the monthly/quarterly compile + export, and the Settings screen. Just apply the changes below.

## HOME / DASHBOARD
- The top is too noisy and stacked. Make it ONE clean row: "Good morning, [child name]" on the left, the child's avatar on the right. Tapping the avatar switches child / opens "all kids". Remove the + (add kid) icon from this screen entirely. Adding kids lives in Settings only.
- Streak: remove the paragraph text ("you've built a real habit / 4 of 7 days"). Just show the streak ring with the number (e.g. "5 day streak"). Put the child's total points next to it. Clean, visual, no explanatory sentences.
- Replace the "this week so far" block with a "This week" progress section that shows the CHILD's progress:
  - A horizontal bar graph broken down by subject (e.g. Science 5, Art 2, Reading 3). Each bar is tappable and opens that subject's logs for this child, this week.
  - Show points the child earned this week.
- Recent logs must be a GRID of square thumbnails, not one full-screen photo. Tapping a log opens a clean log-detail card showing the photo at a sensible size (not full-bleed), the note, the subject, the points earned, and the date, all visible without awkward scrolling.
- Remove the parent-style milestones ("your first log", "your first streak"). Progress on this screen is about the child (points, subjects, streak), not the parent's logging actions.

## POINTS (new, keep it dead simple)
- Each log earns points (flat ~25 per log, small bonus if it has a note). Points accumulate per child and drive the weekly total and the gamified progress. Keep the rule simple.

## CAPTURE / NEW LOG
- Do not drop the user into the stock system camera. Build a custom in-app camera screen so it feels like part of Sprout.
- Bug to fix: after taking a photo and tapping "use photo", the top of the screen drops down by about a third and can't be pushed back, cutting off the view. Fix the layout so the log-entry screen sits correctly and fills the screen.
- Note + voice are ONE field. The user can type the note, or tap a mic to dictate it (voice-to-text fills the same note). Voice is not a separate attachment, it's just another way to fill the note.
- Add an optional quick subject tag during capture (chips: Art, Science, Reading, Math, Writing, etc.) so logs feed the subject bar graph. Skippable, keep capture fast (about 15 seconds).

## CALENDAR
- It's too top-heavy with empty space at the bottom. Use the space better.
- Keep the day-detail view when you tap a day (that part is good).
- Add the ability to create future items on a date: tap a day to add a deadline or scheduled item with a title. These show on the calendar and in the day detail. Make the calendar actually usable as a calendar, not just a log viewer.

## REPORTS
- The weekly report looks good, keep it. Bug: when shared, it renders in landscape and looks bad. Make the shared image portrait and clean.

## ONBOARDING + AVATARS (just make it work, this is a placeholder, the real onboarding comes later)
- Avatars: there are only male options and they look bad. Provide both boy and girl, a proper set of skin tones, several eye styles, optional hat, optional glasses, and a background color. Make them charming and premium, not ugly.
- Bug: entering the kid's name then tapping Continue blocks entering the age. Fix so name then age both work in one flow (the same edit that already works in Settings).
- Photo backfill step: after photos are uploaded the buttons don't update, and the Continue button is tiny in the top-right. After upload, show a clear full-width primary Continue button, with "upload more" and "skip" as secondary.

## MASCOT + LOGO (assets provided separately)
- Mascot: have the mascot pop up at achievement and celebration moments (streak milestones, points milestones, first log) as a small delightful animated moment. Not on every screen, just the celebration beats.
- Logo: place the Sprout logomark on the splash/onboarding and on the weekly report ("Made with Sprout").
```
