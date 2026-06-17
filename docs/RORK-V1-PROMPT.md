# Sprout — Rork Max v1 one-shot build prompt

For Rork Max (native Swift, iOS). v1 = no AI (compile, don't synthesize). On-device, full brand mood with creative latitude on craft, per-kid avatar creator, lean onboarding + hard paywall. AI (Venice) and the high-converting pre-sell onboarding are deliberate later builds.

Note on specificity: Max + Opus makes strong craft decisions, so this brief leads with intent and feel and hands typography, sizing, spacing and fine styling to Rork. It only anchors the brand mood and a few colors.

Paste everything in the code fence below into Rork Max.

---

```
Build a native iOS app called Sprout.

## WHAT IT IS
Sprout is a homeschool documentation app for parents. The parent snaps a photo of what their kid did, adds a quick note or voice memo, and Sprout logs it. Over the week these logs build into a visible, beautiful record of what the kid actually accomplished. Think Strava or Apple Health, but for a homeschooling parent capturing learning instead of workouts. The app organizes and displays what she puts in. There is no AI in this version: it compiles and shows, it never generates or fabricates.

The wound it solves: the parent's quiet anxiety that she can't see whether the week added up to anything. Sprout shows her, and gives her something she's proud to show others.

## THE FEELING (most important — get this right first)
Sprout is alive, tactile, premium. Every interaction responds. Nothing is a static form or a spreadsheet. It should feel like a beautifully made consumer app in the register of Apple, Linear, Arc and Strava: confident, calm, immersive. The capture moment should feel satisfying. Use fluid spring motion and light haptics on key actions. No spinning loaders, use skeletons. Lead every decision with "does this feel premium and alive." You have full creative latitude on typography, sizing, spacing and fine visual treatment. Your job is to make it feel world-class.

## BRAND DIRECTION (mood, not micro-rules)
- Premium, editorial, wellness-tier. Built on a real organic-growth metaphor (sprouts, new growth, soil, grass). Never cartoon, never childish, never EdTech.
- Two moods in one app:
  - APP INTERIOR (dashboard, capture, calendar, nav): dark, immersive, glassmorphic. Deep almost-black forest-green base, frosted glass cards, calm depth.
  - WEEKLY SHARE / REPORT VIEW: light, warm, shareable. Cream background, forest-green headers, editorial and magazine-quality, built to screenshot and print.
- Anchor colors (lean on these, you own the rest): forest green #1F4D2E as the brand, deep almost-black #0F1311 for the dark interior, warm cream #FDFDFD for light surfaces. Avoid pure black and pure white. Confident, uncluttered, generous negative space.
- Voice in any copy: direct, warm, plain. No exclamation marks. No corporate or SaaS jargon.

## CORE FEATURES & SCREENS

### Onboarding (first run) — keep it lean
- Quick, warm, premium. Hard paywall, no free trial: the onboarding sells, then she pays to enter.
- Add the kid(s): name, age, and build each kid's avatar (see Avatar Creator).
- Backfill prompt: invite her to pull the last week or two from her camera roll ("you've already been documenting, you just didn't know it") and quickly log them so the app isn't empty on day one.
- End on the paywall.
(The full high-converting pre-sell demo onboarding is a separate later build. Keep this one simple.)

### Avatar / character creator (per kid)
When adding a kid, the parent builds them a simple character. Bitmoji-lite, basics only: boy/girl, a few skin tones, a few eye styles, optional hat, optional glasses, a profile/background color. Charming and simple, not photoreal. This avatar represents the kid everywhere (selector, logs, reports) and is editable anytime.

### Home / Dashboard (dark, glass) — default screen
- Child selector at the top, each kid shown by their avatar, tap to switch the active child, plus an "All kids" option. Add/edit kids here.
- For the active child: their current logging streak (a progress ring or flame, with a satisfying increment + haptic), a "this week so far" count with a horizontal scroll of recent log thumbnails, and progression/achievement badges (e.g. 10 logs, 4-week streak, first month). Apple-Health-ring energy.
- Empty state: a warm prompt to capture the first log or backfill from the camera roll.

### Capture (the hero) — the raised center "+" in a bottom tab bar
- Tapping the center "+" opens straight to the camera. One focal action: take the photo (or pick from the library).
- A brief premium "settle into a log" animation as the photo saves (motion only, no analysis).
- She adds a short note and/or records a quick voice memo (transcribed to text on-device using the native speech framework). Tags it to the active child.
- Save gives a satisfying confirmation, the streak updates, and the new log animates into the dashboard. The whole thing should take about 15 seconds.

### Calendar (dark, glass)
- Month view, days with logs marked. Tap a day to see that day's logs. A clean visual calendar of logged activity, browsable by week/month. No scheduling engine in v1.

### Reports
- Weekly (in-app): a genuinely beautiful, warm, shareable view (the light cream + forest mood). It assembles the week's logs into an editorial layout: photos, notes, streak, achievements, the kid's avatar. A Share action to send or screenshot it. This is the viral surface, make it something she'd be proud to post.
- Monthly + Quarterly (export): a clean compiled document of that period's logs, grouped by week, chronological, photos + her own notes assembled neatly. No AI writing, it's a compiled record. Export as a PDF via the native share sheet (Files, Google Drive, etc.).

### Settings / Resources
- Manage kids + avatars, manage subscription (restore purchases), export data, privacy statement.
- Resource Library section: a placeholder confirming early-access is reserved and that the web link will arrive by email later (the actual library is a separate web product, not built here).

## DATA & PRIVACY
- On-device only. No accounts, no login: the device is the identity. Nothing about the kid's content leaves the phone. Sprout keeps no server database of her content. Reflect this in any privacy copy.

## PAYMENTS
- Hard paywall, in-app subscription, no free trial. One plan (use a placeholder price, easy to change). At purchase, capture her email in one field ("where should we send your resource library access?") and store it on-device for now.

## SCOPE FENCE — DO NOT BUILD
- No AI / no LLM / no generated content of any kind in this version.
- No kid-facing or kid-login view. The parent flips the phone or prints the report.
- No curriculum, lesson plans, or grading.
- No compliance / registration-officer framing as a headline.
- No community or social features.
- No cross-device sync or cloud accounts (on-device only).
- No resource library or builder UI beyond the offer placeholder.
- No full pre-sell demo onboarding (separate later build).

## DEFINITION OF DONE (the core loop works)
1. Parent onboards, adds a kid, builds the avatar, optionally backfills from the camera roll, hits the paywall, subscribes, email captured.
2. From the dashboard she taps +, takes a photo, adds a note or voice memo, tags the child, saves. Streak increments.
3. Logs accumulate on the dashboard and calendar, per child, each carrying the child's avatar.
4. The weekly report is a beautiful, shareable view she'd want to send.
5. She can generate and export a monthly/quarterly compiled PDF.
6. Everything is on-device, motion-rich, premium, and on-brand.
```
