# Sprout — Rork v1 one-shot build prompt

v1 = no AI (compile, don't synthesize). Pure on-device app, full visual brand, per-kid avatar creator, simple onboarding + hard paywall. The AI layer (Venice vision scan + AI reports) is a deliberate later switch-on, not in this build. The high-converting pre-sell onboarding (demo + questions) is a separate step-2 prompt.

Paste everything in the code fence below into Rork.

---

```
Build an iOS app called Sprout with React Native + Expo.

## WHAT YOU'RE BUILDING
Sprout is a homeschool documentation app for parents. The parent snaps a photo of what their kid did, adds a quick note or voice memo, and Sprout logs it. Over the week these logs build into a visible, beautiful record of what the kid actually accomplished. Think Strava or Apple Health, but for a homeschooling parent capturing learning instead of workouts. The app organizes and presents what she puts in. It never fabricates and there is no AI in this version: it compiles and displays, it does not generate.

The wound it solves: the parent's quiet anxiety that she can't see whether the week added up to anything. Sprout shows her, and gives her something she's proud to show others.

## THE FEELING (most important)
This is the thing to get right. Sprout is alive, tactile, premium. Every interaction responds. Nothing is a static form. It should feel like a beautifully made consumer app (Apple, Linear, Arc, Strava), not a spreadsheet or an EdTech dashboard. The capture moment in particular should feel satisfying and alive. Calm-confident motion, not circus: springy, fluid, tactile micro-interactions, light haptics. Skeleton states, never spinning loaders.

## PLATFORM & TECH
- React Native + Expo, iOS first. expo-router for navigation.
- On-device storage ONLY. No user accounts, no login. The device IS the identity. Use expo-sqlite for log data and expo-file-system for photos. Nothing leaves the device.
- Camera + library: expo-camera + expo-image-picker.
- Voice memo: expo-av to record + on-device (native iOS) speech-to-text to transcribe to a note. No external service, audio stays on device. This is optional per log.
- NO external AI / no LLM / no backend calls for content. Everything is local.
- Payments: in-app purchase via RevenueCat (Apple IAP). Build the paywall + purchase flow. In preview / when IAP isn't configured, the subscribe button should gracefully proceed so the whole app is testable end-to-end.
- expo-haptics on key interactions.

## DESIGN SYSTEM
Two modes inside one app.

APP INTERIOR (dashboard, capture, calendar, nav) = dark + immersive + glassmorphic:
- Background: deep almost-black forest. Base #0F1311 with a subtle gradient toward #0F2614. Very faint organic glow at the edges. Calm, immersive.
- Cards: frosted glass. Fill rgba(255,255,255,0.06), backdrop blur, 1px border rgba(255,255,255,0.15). Cream text inside.
- Text on dark: Cream #FDFDFD.
- Status pills only (streaks, achievement tags) may use Lime #D8FF9A. Sage #A4C9A8 for soft secondary accents.

WEEKLY REPORT / SHARE VIEW = light + warm + shareable:
- Background: Cream #FDFDFD. Headers + key type: Forest #1F4D2E. Body: Ink #0F1311.
- Built to be screenshotted and shared. Editorial, magazine-quality, generous negative space. Small "Made with Sprout" mark in a corner.

COLOR RULES:
- Never pure black or pure white. Always Ink #0F1311 and Cream #FDFDFD.
- Primary CTA buttons: CREAM background, FOREST text. Pill / 14px radius. One primary CTA per screen. Never lime as a button.
- Forest #1F4D2E is the brand. Lean Forest when in doubt.

TYPE:
- Display headlines: Cabinet Grotesk, weights 700/800, tight tracking (-0.035em). Headlines, big numbers, streak counts, report titles.
- Body + UI: Geist Sans, weights 400 and 700 only. Two weights only, never Light/Medium/Black.
- No serifs anywhere in the app. No italics in UI. No exclamation marks in any copy.
- Load both via expo-font. If a font can't load, fall back to a clean geometric sans, never a serif.

MOTION:
- Premium and fluid. Spring physics on transitions. Tactile press states + light haptics on capture, log-saved, streak-increment.
- Capture has a brief, premium "settle into a log" animation (a soft scan-shimmer over the photo as it saves). This is motion only, not analysis.
- No spinning loaders. Skeletons + subtle shimmer.

## NAVIGATION
Bottom tab bar with a prominent raised center capture button:
1. Home / Dashboard (default)
2. Calendar
3. Capture (the big center "+", a raised primary action, not a normal tab)
4. Reports
5. Settings / Resources

## SCREENS

### 1. HOME / DASHBOARD (dark, glass)
- Top: child selector. Each kid is shown by their custom avatar (see Avatar Creator). Horizontal avatar chips to switch the active child, plus an "All kids" option. Add / edit kids from here.
- Selected child's snapshot:
  - Streak: current logging streak as a progress ring or flame count, Lime accent. Increment animation + haptic when extended.
  - This week so far: a count + a horizontal scroll of recent log thumbnails (photo + one-line note). Tap a log to open it.
  - Progression / achievements: badges or milestone markers (e.g. "10 logs", "4-week streak", "first month complete"). Visual, rewarding, Apple-Health-ring energy.
- Empty state (new user): warm prompt to capture the first log or backfill from the camera roll.

### 2. AVATAR / CHARACTER CREATOR (per kid)
When the parent adds a kid (name + age), they build the kid a simple character. Bitmoji-lite, basics only, charming layered-vector (SVG), not photoreal:
- Gender: boy / girl
- Skin tone: a row of ~5 swatches
- Eyes: ~3-4 styles
- Hat: none + a few options
- Glasses: none + a couple options
- Background / profile colour: a few brand-friendly swatches
Composite the chosen layers into one clean avatar. This avatar represents the kid everywhere: child selector, their logs, their reports. Editable any time. Keep the art simple and geometric, it can be refined later.

### 3. CAPTURE FLOW (the hero) (dark)
Triggered by the center "+".
- Opens straight to a camera view. Single focal action: take the photo (or pick from library).
- The photo gets a brief premium settle/scan-shimmer animation as it becomes a log (motion only, no analysis).
- The parent adds a short note (one or two sentences) and/or records a quick voice memo (transcribed on-device to text). She tags it to the active child.
- Save → satisfying confirmation (haptic + motion), streak updates, returns to dashboard with the new log animating in.
- The whole thing should take about 15 seconds.

### 4. CALENDAR (dark, glass)
- Month view. Days with logs are marked (dot / thumbnail / subtle fill).
- Tap a day → that day's logs.
- Keep v1 simple: a clean visual calendar of logged activity by date, browsable by week/month. No scheduling engine in v1.

### 5. REPORTS
- WEEKLY (in-app): a beautiful, warm, shareable view (the light/cream/forest share mode). Assembles the week's logs into an editorial layout: photos, notes, the streak, achievements, the kid's avatar. This is the Strava-style share loop: a Share action sends it / screenshots it. Make it genuinely beautiful, this is the viral surface.
- MONTHLY + QUARTERLY (export): a compiled document of that period's logs, grouped by week (and by tag where present), chronological, photos + her own notes assembled cleanly. No AI writing, it's a compiled record. Exportable: generate a clean PDF and use the native share sheet (Save to Files, Google Drive, etc.).

### 6. ONBOARDING (first run) — keep simple
- Quick, warm, premium. Sells while it sets up (hard paywall, no free trial).
- Add the kid(s): name, age, and build each kid's avatar (Avatar Creator).
- BACKFILL PROMPT: invite her to pull the last week or two from her camera roll ("you've already been documenting, you just didn't know it"). Let her select photos and quickly log them so the app isn't empty on day one.
- Lead into the paywall.
(Note: the full high-converting pre-sell demo onboarding is a separate later build, not this prompt. Keep this one lean.)

### 7. PAYWALL (onboarding close)
- Hard paywall. No free trial. The onboarding does the selling, she pays to enter.
- One plan (PLACEHOLDER price, easy to change).
- The offer includes: free early access to the Sprout Resource Library + custom resource builder (separate web product), normally ~$200/yr, free for the first 250 members. Scarcity + value stack.
- Capture her EMAIL ("where should we send your resource library access?"), one field, not a login. Store it on-device for now. Then enter the app.

### 8. SETTINGS / RESOURCES
- Manage kids + their avatars, manage subscription (restore purchases), export data, privacy statement.
- Resource Library section: a placeholder confirming early-access is reserved and that the web link arrives by email later. (The actual library + builder is a separate web app, not built here.)

## PRIVACY POSTURE (reflect in copy)
Her library lives on her phone. Sprout keeps no account and no database of her kids' content. Nothing is sold, shared, or sent off the device.

## SCOPE FENCE — DO NOT BUILD
- No AI, no LLM, no external content calls of any kind in this version.
- No kid-facing / kid-login view. The parent flips the phone or prints the report.
- No curriculum, lesson plans, or grading.
- No compliance / registration-officer framing as a headline.
- No community / social features.
- No cloud account system or cross-device sync (on-device only in v1).
- No resource library or builder UI beyond the offer placeholder (separate web app).
- No full pre-sell demo onboarding (separate later prompt).
- No web version.

## DEFINITION OF DONE (the core loop must work)
1. Parent onboards, adds a kid, builds the kid's avatar, optionally backfills from camera roll, hits the paywall, subscribes (or proceeds in preview), email captured.
2. From the dashboard she taps +, takes a photo, adds a note or voice memo, tags the child, saves. Streak increments.
3. Logs accumulate on the dashboard and the calendar, per child, each carrying that child's avatar.
4. She opens the weekly report and it's a genuinely beautiful, shareable view she'd want to send.
5. She can generate a monthly/quarterly compiled report and export it as a PDF.
6. Everything is on-device, motion-rich, premium, and on-brand (dark glass interior, warm cream report).
```
