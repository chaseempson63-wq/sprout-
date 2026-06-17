# Sprout — Rork Max master prompt

The single consolidated spec (original v1 + on-device test feedback + the progress/recap/topic redesign). For Rork Max (native iOS). Paste the fenced block. If updating the existing build, keep what already matches and change only what doesn't.

Asset note: the app icon is white sprout mark on forest green (`~/Downloads/sprout-app-assets/sprout-appicon-1024.svg.png`); the logomark for in-app use is `sprout-logo-forest.svg.png` (forest, for cream surfaces) and the white mark for dark surfaces. Mascot is parked for now, logo only.

---

```
Build a native iOS app called Sprout. If you're updating an existing build, keep what already matches this spec and change only what doesn't.

## WHAT IT IS
Sprout is a homeschool documentation app for parents. The parent snaps a photo of what their kid did, adds a quick note, tags the child and the topic, and Sprout logs it. Over the week those logs build into a visible, beautiful, gamified record of what the kid actually accomplished. Think Strava or Apple Health, but for a homeschooling parent capturing learning instead of workouts. The app organizes and displays what she puts in. There is NO AI in this version: it compiles and shows, it never generates or fabricates. The wound it solves is the parent's quiet anxiety that she can't see whether the week added up to anything.

## THE FEELING (most important)
Alive, tactile, premium. Every interaction responds, nothing is a static form or a dry stat list. Register of Apple, Linear, Arc and Strava. Fluid spring motion, light haptics on key actions, no spinning loaders (use skeletons). The progress and recap views especially must be visually rich and shareable like a fitness app, never "you logged 6 things over 4 days" as text. You have full creative latitude on typography, sizing and spacing. Make it feel world-class.

## BRAND
- Two moods: APP INTERIOR (home, capture, calendar) is dark, immersive, glassmorphic (deep almost-black forest base, frosted glass cards). The RECAP / SHARE view is light, warm, cream + forest, editorial, built to screenshot.
- Anchor colors: forest green #1F4D2E (brand), almost-black #0F1311 (dark interior), warm cream #FDFDFD (light surfaces). Keep the current palette, it's working. Never pure black or white.
- Voice in copy: direct, warm, plain. No exclamation marks, no SaaS jargon.

## CORE MODEL
- Multi-child. The user picks an active child.
- A LOG = a photo + a note (typed OR dictated) + the child + a TOPIC + points + date.
- TOPICS are a fixed set, each with its OWN COLOR. This color-coding runs through the whole app: the topic chips at capture, the calendar, the log thumbnails, and every graph. Define ~8-10 topics each with a distinct color that's harmonious with the brand and readable on both the dark interior and the cream recap. Suggested topics: Art, Science, Reading, Math, Writing, History, Music, Sport, Nature, Life skills.
- POINTS: each log earns points (flat ~25, small bonus if it has a note). Points accumulate per child and drive the streak, progress and gamification. Keep the rule simple.
- On-device only. No accounts, no login, nothing leaves the phone.

## NAVIGATION
Bottom tabs: Home, Calendar, Capture (raised center +), Recap, Settings. Child Profile is pushed from Home.

## SCREENS

### HOME / DASHBOARD (dark, glass)
- One clean header row: "Good morning, [child name]" on the left, the child's avatar on the right. Tap the avatar to switch child or "all kids". No + (add kid) icon here.
- Tapping the child's avatar opens that child's Profile page (below).
- Active child snapshot, visual not wordy: the streak ring with its number, and the child's total points beside it. No paragraph text.
- "This week" subject bar graph, colored by topic. Each bar is tappable and opens that topic's logs for this child this week.
- Recent logs as a GRID of square thumbnails (tinted by topic color), NOT one full-screen photo. Tap a log to open a clean log-detail card: the photo at a sensible size, the note, the topic, the points earned, the date, all visible without awkward scrolling.
- No parent-style milestones ("your first log"). Progress here is about the child.

### CHILD PROFILE (pushed from Home)
- The child's own view: their timeline of logs over time, subject bar graphs showing where they spend their time each week by topic, progress bars, total points, streak, and their own calendar timeline. This is the deep "their story" view versus the dashboard's this-week glance. They can open their weekly Recap from here.

### CAPTURE / NEW LOG (the hero)
- A custom in-app camera screen, NOT the stock system camera, so it feels like Sprout.
- Flow: take the photo, then a note field (type, or tap a mic to dictate, voice-to-text fills the SAME note, voice is not a separate attachment), then select the CHILD, then select the TOPIC (colored chips). Save with a satisfying confirmation, points and streak update, the new log animates into the dashboard. About 15 seconds.
- Bug to fix: after taking a photo and tapping "use photo", the top of the screen drops down by about a third and can't be pushed back. Fix the layout so it sits correctly and fills the screen.

### CALENDAR (dark, glass)
- Month view, COLOR-CODED by topic: each day shows the topic colors logged that day, with the child indicated, so it's easy to read which child did what on which day.
- Use the full screen, it's currently too top-heavy with empty space below.
- Tap a day for the day detail: the child (name + avatar), the logged moments shown visually (photo + topic color + points + time), browsable.
- Add the ability to create future items: tap a day to add a deadline or scheduled item with a title. It shows on the calendar and in the day detail. Make it a real calendar, not just a log viewer.

### RECAP (the shareable loop, this replaces "Reports")
- Do not call it Reports. This is the Strava-style shareable moment: "What [child] did this week." It must be genuinely beautiful and visually rich, the thing a parent is proud to post. Light, warm, cream + forest.
- Built around VISUALS, not stats text: a ring or bar graph showing what the child spent their time on by topic (colored), points earned, the streak, a few photos, the child's name and the week. Show it like a fitness recap, not a list of numbers and a blurb.
- Weekly is the in-app shareable visual. When shared it must render PORTRAIT and clean (fix the current landscape bug).
- Monthly + Quarterly = a compiled PDF export (Files, Google Drive, etc.). Keep that working.
- Put the Sprout logomark on it ("Made with Sprout").

### SETTINGS (basic is fine for v1)
- Manage kids + avatars, restore purchases, early access to the resource builder (email reserved), export all logs, privacy statement.

## ONBOARDING (placeholder, make it work, don't polish, the real one is a later build)
- Add kid(s): name + age (fix the bug where entering the name then Continue blocks entering the age), then build the avatar.
- Avatars: BOTH boy and girl, real skin tones, several eye styles, optional hat, optional glasses, a background color. Charming and premium, not ugly.
- Backfill from camera roll: after photos upload, show a clear full-width primary Continue button with "upload more" and "skip" as secondary (currently the buttons don't update and Continue is tiny top-right).
- End on the paywall: hard paywall, no free trial, one plan (placeholder price), capture her email in one field, store on-device.

## DATA & PRIVACY
On-device only, no accounts, nothing leaves the phone. Reflect this in any privacy copy.

## SCOPE FENCE — DO NOT BUILD
- No AI or generated content of any kind.
- No academic grading (no A-F or marks). Topic color-coding is categorization, not grading.
- No kid login or separate kid-facing app. The parent flips the phone or prints the recap.
- No curriculum or lesson plans.
- No compliance / registration-officer framing as a headline.
- No community or social features.
- No cross-device sync or cloud accounts.
- No mascot for now (logo only).
- No web version.

## DEFINITION OF DONE
1. Onboard, add a kid + avatar, hit the paywall, subscribe, email captured.
2. Capture a log: photo + note (typed or dictated) + child + topic, save, points and streak update.
3. Logs accumulate, color-coded by topic, on the dashboard grid and the calendar.
4. Tapping the child opens their profile with their timeline and topic graphs.
5. The weekly Recap is a beautiful, visual, shareable moment (portrait when shared), and monthly/quarterly export as a PDF.
6. Everything is on-device, motion-rich, premium, and on-brand.
```
