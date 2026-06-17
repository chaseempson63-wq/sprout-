# Sprout — Rork v1 one-shot build prompt

Paste everything in the code fence below into Rork. Before pasting, swap the two placeholders: the price on the paywall, and `EXPO_PUBLIC_API_BASE` if you already have the proxy URL.

---

```
Build an iOS app called Sprout with React Native + Expo.

## WHAT YOU'RE BUILDING
Sprout is a homeschool documentation app for parents. The parent snaps a photo of what their kid did, adds a quick note or voice memo, and Sprout logs it. Over the week these logs build into a visible, beautiful record of what the kid actually accomplished. Think Strava or Apple Health, but for a homeschooling parent capturing learning instead of workouts. The app organizes and presents what she puts in. It never fabricates.

The wound it solves: the parent's quiet anxiety that she can't see whether the week added up to anything. Sprout shows her, and gives her something she's proud to show others.

## THE FEELING (most important)
This is the thing to get right. Sprout is alive, tactile, premium. Every interaction responds. Nothing is a static form. It should feel like a beautifully made consumer app (Apple, Linear, Arc, Strava), not a spreadsheet or an EdTech dashboard. The capture moment in particular should feel like the app is doing something real, not just saving a row. Calm-confident motion, not circus: springy, fluid, tactile micro-interactions, light haptics. Skeleton states, never spinning loaders.

## PLATFORM & TECH
- React Native + Expo, iOS first. expo-router for navigation.
- On-device storage ONLY. No user accounts, no login. The device IS the identity. Use expo-sqlite for log data and expo-file-system for photos. Nothing about the kid's content goes to a Sprout server or database.
- Camera + library: expo-camera + expo-image-picker.
- Voice memo: expo-av to record, on-device speech-to-text to transcribe. Audio stays on device.
- AI: Venice AI (OpenAI-compatible), called ONLY through our backend proxy (see AI section). The app never holds the Venice key and never calls Venice directly.
- Payments: in-app purchase via RevenueCat (Apple IAP). Scaffold the paywall + purchase flow with placeholder product IDs.
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
- The capture scan is the hero animation (see Capture screen).
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
- Top: child selector. If multiple kids, horizontal avatar chips / segmented control to switch the active child, plus an "All kids" option. Adding/editing kids happens here.
- Selected child's snapshot:
  - Streak: current logging streak as a progress ring or flame count, Lime accent. Increment animation + haptic when extended.
  - This week so far: a count + a horizontal scroll of recent log thumbnails (photo + one-line note). Tap a log to open it.
  - Progression / achievements: badges or milestone markers (e.g. "10 logs", "4-week streak", "first month complete"). Visual, rewarding, Apple-Health-ring energy.
- Empty state (new user): warm prompt to capture the first log or backfill from the camera roll.

### 2. CAPTURE FLOW (the hero) (dark)
Triggered by the center "+".
- Opens straight to a camera view. Single focal action: take the photo (or pick from library).
- After the photo is taken, a SCAN ANIMATION runs over the image: a Cal-AI-style sweeping scan line / shimmer that reads as "the app is analyzing this," lasting ~1.5-2.5s while the Venice vision call returns. This is real: the photo (+ note) is sent to Venice, which returns an understanding of what's in it.
- The parent adds a short note (one or two sentences) and/or records a quick voice memo (transcribed on-device to text).
- Venice takes the photo + note/transcript and returns a lightly cleaned-up, slightly more articulate version of what the kid did. A small professional bump, never fabricated, never over-written. The parent sees it, can edit it, saves.
- Save → satisfying confirmation (haptic + motion), streak updates, returns to dashboard with the new log animating in.
- The whole thing should take about 15 seconds.

### 3. CALENDAR (dark, glass)
- Month view. Days with logs are marked (dot / thumbnail / subtle fill).
- Tap a day → that day's logs.
- Keep v1 simple: a clean visual calendar of logged activity by date, browsable by week/month. No complex scheduling engine in v1.

### 4. REPORTS
- WEEKLY (in-app, NO AI): a beautiful, warm, shareable view (the light/cream/forest share mode). Assembles the week's logs into an editorial layout: photos, notes, the streak, achievements. This is the Strava-style share loop: a Share action sends it / screenshots it. No AI here, pure presentation. Make it genuinely beautiful, this is the viral surface.
- MONTHLY + QUARTERLY (AI, export): Venice analyzes all the photos + notes across the period and assembles a structured written report that does ~90% of the heavy lifting (what was covered, progress, highlights, by subject/theme where it can infer it). Output is exportable: generate a clean PDF and use the native share sheet (Save to Files, Google Drive, etc.). Not state-specific templates in v1.

### 5. ONBOARDING (first run)
- Quick, warm, premium. Sells while it sets up (hard paywall, no free trial).
- Ask for the kid(s): name, age.
- BACKFILL PROMPT: invite her to pull the last week or two from her camera roll ("you've already been documenting, you just didn't know it"). Let her select photos and quickly log them so the app isn't empty on day one.
- Lead into the paywall.

### 6. PAYWALL (onboarding close)
- Hard paywall. No free trial. The onboarding does the selling, she pays to enter.
- One plan (PLACEHOLDER price, easy to swap).
- The offer includes: free early access to the Sprout Resource Library + custom AI resource builder (web), normally ~$200/yr, free for the first 250 members. Scarcity + value stack.
- On purchase: capture her EMAIL ("where should we send your resource library access?"), one field, not a login. POST {email, appleReceipt} to our entitlement endpoint. Then enter the app.

### 7. SETTINGS / RESOURCES
- Manage kids, manage subscription (restore purchases), export data, privacy statement.
- Resource Library section: for v1 a placeholder confirming early-access is reserved and that the web link arrives by email. (The actual library + builder is a separate web app, not built here.)

## AI INTEGRATION (Venice) — EXACT CONTRACT
The app NEVER calls Venice directly and NEVER holds the API key. It calls our backend proxy, which holds the key, forwards to Venice, and stores nothing. Base URL is an env var: EXPO_PUBLIC_API_BASE.

1. POST {EXPO_PUBLIC_API_BASE}/ai/scan  (capture-time vision)
   Request: { imageBase64, note?, childAge? }
   Response: { summary, suggestedTags[] }
   summary = a clean, lightly-polished one/two-sentence description of what the kid did, based on the photo + note. Never invented beyond what's visible/stated.

2. POST {EXPO_PUBLIC_API_BASE}/ai/report  (monthly/quarterly synthesis)
   Request: { period, logs: [{ date, note, summary, tags }] }
   Response: { reportMarkdown }
   Used to generate the export PDF.

If EXPO_PUBLIC_API_BASE is unset, gracefully fall back to letting the parent write the note herself with no AI, so the app still works in preview.

Privacy posture to reflect in copy: her library lives on her phone, Sprout keeps no account or database of her kids' content, and when AI helps it runs on a private network that doesn't store, log, sell, or train on her data.

## EMAIL → WEB-BUILDER BRIDGE
On successful purchase, after capturing email: POST {email, appleReceipt} to {EXPO_PUBLIC_API_BASE}/entitlement. Just fire the POST and handle success/failure gracefully. (The endpoint verifies the receipt with Apple and triggers the resource-library access email; that lives in the separate web app, not here.)

## SCOPE FENCE — DO NOT BUILD
- No kid-facing / kid-login view. The parent flips the phone or prints the report.
- No curriculum, lesson plans, or grading.
- No compliance / registration-officer framing as a headline.
- No community / social features.
- No cloud account system or cross-device sync (on-device only in v1).
- No resource library or builder UI beyond the offer placeholder (separate web app).
- No web version.

## DEFINITION OF DONE (the core loop must work)
1. Parent onboards, adds a kid, optionally backfills from camera roll, hits the paywall, subscribes (sandbox), email captured + POSTed.
2. From the dashboard she taps +, takes a photo, sees the scan, adds a note or voice memo, gets the AI-polished summary, edits, saves. Streak increments.
3. Logs accumulate on the dashboard and the calendar, per child.
4. She opens the weekly report and it's a genuinely beautiful, shareable view she'd want to send.
5. She can generate a monthly/quarterly AI report and export it as a PDF.
6. Everything is on-device, motion-rich, premium, and on-brand (dark glass interior, warm cream report).
```
