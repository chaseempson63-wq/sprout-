# Sprout — Master Document

The single source of truth for everything Sprout. A-Z, decision-by-decision, written so any new collaborator (human or AI) can read this once and be fully onboarded.

**Last updated:** 2026-05-14
**Founder:** Chase Empson
**Version:** v0.1 spec

---

## Table of contents

1. [One-paragraph pitch](#one-paragraph-pitch)
2. [The problem](#the-problem)
3. [The user (ICP)](#the-user-icp)
4. [The product](#the-product)
5. [Strict scope (in / out)](#strict-scope-in--out)
6. [Brand](#brand)
7. [Marketing positioning](#marketing-positioning)
8. [Pricing & monetization](#pricing--monetization)
9. [Data model](#data-model)
10. [Technical stack](#technical-stack)
11. [User flows](#user-flows)
12. [The weekly report artifact](#the-weekly-report-artifact)
13. [Multi-child handling](#multi-child-handling)
14. [Privacy & data handling](#privacy--data-handling)
15. [Distribution & marketing](#distribution--marketing)
16. [The validation plan](#the-validation-plan)
17. [Roadmap](#roadmap)
18. [Success metrics](#success-metrics)
19. [Key risks](#key-risks)
20. [Working agreement](#working-agreement)

---

## One-paragraph pitch

Sprout is a weekly reflection app for AU/NZ homeschool parents. Parents log small daily moments — a voice memo, a photo of worksheets, a sentence of text — across the week. On Sunday night, Sprout's AI generates a beautiful, shareable weekly report that proves their child's week counted. The product solves one problem: the universal homeschool-parent anxiety of *"am I screwing my kid up?"* — by replacing 3am self-doubt with Sunday-night relief and a portfolio of evidence the parent can show to their kid, their family, or post in their community. **One job. One artifact. One reason to keep paying every month.**

---

## The problem

### The wedge

Every homeschool parent — across every community, every state, every approach — carries one anxiety more than any other:

> **"Am I screwing my kid up?"**

This question is not philosophical. It's practical and emotional, and it shows up at predictable moments:

- Sunday night, reflecting on a chaotic week
- Family gatherings where relatives ask "but what about socialisation"
- After scrolling another homeschool mum's Instagram
- Before regulator reviews (NSW NESA, QLD HEU, etc.)
- When their kid struggles with a concept and they wonder if they explained it wrong

This is the most-discussed topic in homeschool Facebook groups. It's the dominant theme in academic research on homeschool parents (see: Glenda Jackson's Monash work, Lois Rothermel's research). It's the 3am question.

### Why existing tools don't solve it

Every product in the homeschool space sells **content** (curriculum) or **organisation** (planners, schedules, LMS). These are utility purchases — they help parents *do the work*. None of them address the emotional question of *"is what I'm doing actually enough?"*

- **Curriculum providers** (Euka, ACE, Wolsey Hall, Australian Christian College): "here's what to teach"
- **Planners** (Homeschool Planet, Trello templates): "here's how to organise"
- **Generic AI** (ChatGPT, Claude): "ask me anything" — but no continuity, no artifact, no ritual
- **FB groups**: peer reassurance, but also amplify comparison anxiety

Sprout occupies a wide-open lane: **emotion-first, anxiety-relief, evidence-by-artifact.**

### Why now

- AU/NZ homeschool registration grew ~60%+ in 4 years (state-published numbers — NSW 2014: ~3,200 → 2022: ~9,000+; QLD similar trajectory)
- Post-COVID surge has stuck and continues at ~10-15% YoY
- Parents are increasingly time-poor, often dual-income, often anxious about competing with mainstream school outcomes
- AI quality is now high enough to generate genuinely useful weekly reflections from minimal input
- Market is small enough that niche dominance is achievable; large enough to support a $1M+ ARR business

---

## The user (ICP)

### Primary persona: "The Anxious-but-Committed Mum"

- **Age**: 32-48
- **Region**: AU (NSW, QLD, VIC primarily) and NZ
- **Family**: 2-4 children, ages 5-17, all or most homeschooled
- **Income**: often single-income household; partner works full-time
- **Tech comfort**: comfortable with smartphones, uses Facebook heavily, may have tried ChatGPT once
- **Time**: chronically short on it
- **Why she homeschools**: mix of (a) negative experience with mainstream schooling for her kid, (b) lifestyle/values alignment, (c) post-COVID realisation that homeschool was viable
- **What she fears**: that her kid will fall behind, that she's "not qualified," that she'll be judged by family/regulator/society
- **What she needs**: a way to know her week counted, evidence she can show others, relief from the 3am voice

### Secondary personas (acknowledged, not targeted in v0.1)

- The unschooling/natural-learning parent (will reject anything that smells like school metrics)
- The Christian homeschool parent (overlaps with primary but may want explicit faith framing)
- The single homeschool dad (small segment but underserved)

We start with the primary persona only. If we win her, the others may pull themselves in. Don't broaden in v0.1.

### Where she is

- AU/NZ homeschool Facebook groups (Home Education Network, state-specific groups, Christian homeschool groups)
- Homeschool podcasts (small AU/NZ podcast ecosystem, ~3-5 worth knowing)
- In-person meetups, co-ops, park days
- Instagram (homeschool mum influencers, modest follower counts but engaged audiences)

She is NOT on TikTok in large numbers. She is NOT on Twitter/X. She is NOT reading homeschool blogs as much as 5 years ago.

---

## The product

### What it is

A web app (responsive, mobile-first design) that lets a parent log small inputs across the week and receive a beautifully designed weekly reflection artifact every Sunday night.

### The core loop (the entire product)

1. **Welcomed daily input** — parent opens Sprout (web, mobile-optimised) and dumps whatever happened that day. Voice memo, photo of worksheets, typed bullets, or a single sentence. Tagged to a kid (or "all kids"). 30-60 seconds typical.
2. **No daily pressure** — no streaks, no "you missed a day" guilt, no red dots. Logging is a *welcomed gesture*, not an obligation. The brand promise is *we sell relief, not chores.*
3. **Sunday-night report generation** — AI compiles the week's inputs into a per-kid weekly artifact. Generated automatically, no parent action required.
4. **Email + in-app delivery** — beautiful email lands Sunday evening. Tap through to see the full report. Downloadable as PDF. Screenshot-friendly. Shareable.
5. **The arc builds** — each weekly report references prior weeks, builds the growth narrative. Week 12's report reflects on week 1's child. This is the moat ChatGPT can't replicate.

### The emotional arc (what the user experiences)

| Day | Touchpoint | Feeling |
|-----|-----------|---------|
| Mon-Sat | Open app, drop a voice memo | Light, low-friction, "I'm capturing this" |
| Sunday 6pm | Notification: "Your weekly report is ready" | Anticipation |
| Sunday 8pm | Open the report | Relief, pride, reframing |
| Sunday 9pm | Screenshot, share to FB group / family WhatsApp | Validation, status, community |
| Monday morning | Show the report to the kid | Connection, "I'm so proud of you" moment |
| Throughout week | Glance at "this week so far" view | Reinforcement, momentum |

---

## Strict scope (in / out)

### IN for v0.1

- Multi-child accounts (parent → multiple kids)
- 60-second onboarding (parent details, each kid's name + age + broad style)
- Daily input form: voice memo + photo + text, tagged to kid(s)
- "This week so far" running view (per-kid)
- AI-generated weekly report (per-kid, auto-generated Sunday)
- Beautiful weekly artifact: web view + downloadable PDF + email delivery
- Timeline view of all past weekly reports per kid
- Free-trial mechanic (7 days, first weekly report fully unlocked, no watermark on first report)
- Stripe subscription paywall (week 2+ reports gated for non-paying users)
- Light "Made with Sprout" watermark on free-tier shares only (corner placement, can't be cropped without breaking the report layout)
- AU + NZ launch (same product, AUD primary currency with NZD support, no US-isms in copy)

### OUT for v0.1 — push back if requested

- Curriculum recommendations
- Lesson plans
- Reports for state regulators (NESA, HEU, etc.) — *latent benefit, never marketed*
- Kid-facing logins or kid-facing UI
- Community / social features (no in-app feed, no comments, no following)
- Native iOS/Android apps (responsive web only)
- Streaks, daily goals, gamification, "you missed a day" notifications
- Anything that smells like school software
- US/UK/Canada launch
- Family sharing (parent A and parent B sharing one account) — handle later
- Partner integrations (no Google Classroom, no Khan Academy import)

**The discipline:** every feature request gets one question — *"does this help the parent feel their week counted, or is it scope creep?"* Default to no.

---

## Brand

### Voice

- **Direct & confident.** Linear / Vercel / Things 3 register.
- Short sentences. No exclamation marks. No emojis-as-decoration.
- Respects the user's intelligence. Never patronises.
- Australian/NZ English (Maths not Math, Mum not Mom, Year 7 not 7th Grade, term not semester).
- Warmth comes through *what we say*, not *how excitedly we say it*.

**Examples:**
- ✅ "Your weekly report is ready."
- ❌ "Yay! Your amazing weekly report is here! 🎉"
- ✅ "This week, Charlie grew."
- ❌ "Look at the wonderful learning journey Charlie went on!"

### Visual system

Three distinct "moods" within one brand:

#### Marketing / landing / auth = **light + confident**
- White background (`#FFFFFF`)
- Deep forest green primary (`#1F4D2E` zone)
- Bright lime accents on CTAs (`#D8FF9A`)
- Near-black text (`#0F1311`)
- Bold geometric sans, generous whitespace, single-column layouts

#### App interior (input + dashboard + viewing reports) = **dark + immersive + glass**
- Deep almost-black background (`#0F1311`)
- Glassmorphic cards: subtle backdrop-blur, semi-transparent dark surfaces, soft glow at edges
- Bright lime CTAs (`#D8FF9A`) — high contrast, clear actions
- Warm white text (`#FDFDFD`)
- Sage / forest green secondary surfaces
- This is the meditation-app feel from the references: premium, app-like, calming-but-confident

#### Weekly report artifact = **light + warm + shareable**
- Light cream or pure white background (renders well on any device, prints well)
- Forest green section headers
- Lime accent dots / progress indicators
- Bold typography for the kid's name + week
- Designed to look great as a *screenshot in a FB group* and as a *printed PDF*
- "Made with Sprout 🌱" watermark in lower corner on free-tier (small, classy, uncroppable)

### Typography

- **Headings**: Geist Sans Bold (already installed). Pending Chase's font preference — may swap for Cabinet Grotesk, General Sans, or similar.
- **Body**: Geist Sans Regular.
- **One typeface, two weights.** No serifs anywhere.

### What we are NOT

- ❌ Etsy / craft-store aesthetic
- ❌ Mailchimp / corporate-friendly aesthetic
- ❌ Khan Academy / EdTech aesthetic
- ❌ Day One / journal-app aesthetic (too soft/precious)
- ❌ Pastel anything

---

## Marketing positioning

The most important strategic decision after pricing. **Anxiety opens the wallet. Pride keeps them paying. Pride drives sharing.**

Sprout markets the parent's anxiety, but the product itself is about the kid. The two registers stay strictly separated by surface — never mixed within a single surface.

### The principle

- **Anxiety opens the wallet.** Nobody pays $29/mo to "watch their kid grow" — that's free on Instagram. They pay to make a recurring negative emotional state stop. This is why BetterHelp ($240/mo) is bigger than Tinybeans ($59/yr).
- **Pride creates retention.** Once subscribed, the artifact week-over-week builds Sunday-night dopamine. That's what justifies month 6 and month 12.
- **Pride drives sharing.** Mum doesn't post "I felt so anxious this week" in a FB group — too vulnerable. She posts "look what Charlie did this week 🌱" — brag-worthy and community-positive.

### Register by surface

| Surface | Lead emotion | Why |
|---------|-------------|-----|
| Landing page hero | Anxiety relief | Wallet-opening trigger |
| Landing page body | Bridges to kid pride (show the artifact) | Convert the anxious mum by showing what she'll create |
| Paid ads (Meta, podcast) | Anxiety relief | The click happens on relief, not pride |
| Founder content / brand presence | Anxiety relief | Positions Sprout as the one who understands the 3am question |
| App interior | Kid-focused, gentle | She came for relief; the app is about Charlie |
| The weekly report artifact | 100% kid pride | Kid's name biggest on page, parent only in footer |
| Email — welcome / onboarding | Anxiety relief | "You're not doing it wrong" |
| Email — Sunday delivery | Kid pride | "Charlie's week is ready 🌱" |
| Auto-generated share text | Kid pride | "Look what Charlie did this week" — never about mum's feelings |
| Community testimonials we showcase | Kid pride | We never coach mums to share anxiety stories |

### The cardinal rule

**Never mix the two registers in a single surface.** A landing page that says *"Stop wondering AND watch your kid grow!"* dilutes both messages. Pick the lead per surface, follow with the supporting message, never blend.

**Especially: never put parent-anxiety language INSIDE the weekly report itself.** The artifact is sacred — it's about the kid. Anything that reminds mum "you were anxious before this came" cheapens her share moment and breaks the spell.

### Reference copy (the canon)

**Landing page hero (anxiety register):**
> # Prove the week counted.
> *Stop wondering if you're doing enough. Sprout turns your homeschool week into proof your kid is on track — every Sunday night.*

**Landing page section 2 (anxiety → pride bridge):**
> ## Watch your week become their growth.
> *(sample weekly report shown)*

**Weekly report artifact (kid pride only):**
> # Charlie's week
> *Week 12 · 8 May – 14 May 2026*

**Founder content / Instagram (anxiety register):**
> "If you're a homeschool mum and you've ever lay awake on a Sunday night wondering if this week was enough — that's why I built Sprout."

**Welcome email (anxiety register):**
> Subject: *You're not doing it wrong.*

**Sunday delivery email (kid pride register):**
> Subject: *Charlie's week is ready 🌱*

**Auto-generated share text (kid pride register, baked into the share button):**
> "Look what [Kid] did this week 🌱 [link]"

**Mum's organic FB-group share (kid pride — never coached but reliably emerges):**
> "this is probably my favourite app I've ever paid for 🌱 charlie's weekly report dropped and reframed every chaotic moment — baking = fractions?? volcano docs = science?? 😭"

### The discipline

When writing copy for any new surface, the first question is always: *"Which register does this surface lead with?"* Answer that before writing a single word. If a surface tries to do both, it will do neither.

---

## Pricing & monetization

### Plans

- **Monthly**: AUD $29 / month
- **Annual**: AUD $249 / year (~$20.75/mo equivalent, ~28% discount, cash upfront)
- **Free trial**: 7 days, full feature access, **first weekly report fully unlocked and downloadable forever** (this is intentional — see below)

NZ pricing displayed in NZD at equivalent (approx NZD $32 / NZD $269 — adjusted for FX).

### The first-report-unlocked rule (critical)

The first weekly report a user generates is **fully unlocked, watermarked but uncroppably so, and theirs to keep forever**, even if they don't subscribe. This is non-negotiable.

**Why:** the shareability of the report IS the marketing channel. Mums posting "look what we did this week 🌱" in homeschool FB groups is the viral loop. If we lock the first report, we kill our distribution mechanism. The "Made with Sprout" watermark in the corner is the marketing.

The paywall kicks in at the **second** weekly report. By then the parent has felt the magic and emotionally committed. Conversion follows naturally.

### Watermark rules

- **Free trial users**: small "Made with Sprout 🌱" mark in lower corner of the report. Cannot be cropped without breaking the report layout (positioned to overlap the bottom-most content block).
- **Paid users**: clean, no watermark.
- The watermark is not ugly — it's a small, deliberately-designed brand mark that looks intentional, not extractive.

### Why $29/mo is justified for one feature

The weekly report does **three jobs at once** through one artifact:

1. **Emotional**: Sunday-night relief, "you're on track" certainty
2. **Functional**: a saved, dated, growing portfolio of evidence (latent compliance value parent never has to think about, but knows is there)
3. **Social**: shareable status signal in the homeschool community

Most $29/mo SaaS products do one job. Sprout does three through one artifact. That's the value justification.

Comparable price anchors:
- BetterHelp: $240-360/mo (anxiety/therapy)
- Headspace / Calm: $70/yr (anxiety/meditation)
- Tinybeans Premium: $59/yr (parent identity/memory)
- Day One Premium: $35/yr (journaling)
- Euka Education (AU homeschool curriculum): $50-100/mo
- AU therapy session: $150-250

Emotional pain commands premium. $29/mo is positioned as *"less than $1 a day for the relief you've been missing."*

### Future monetization (NOT v0.1 — listed for awareness)

- Family yearbook (printed annual book of all reports, $79 one-off)
- Sprout for Co-ops (B2B for homeschool co-op leaders, multi-family management)
- Affiliate / referral revenue from curriculum partners (carefully, only if mum-aligned)
- Always: no ads, no data sales, no third-party tracking beyond essential

---

## Data model

### Entities

```
Account (1)
├── Parent profile (1)
├── Subscription (1)
└── Kids (1..N)
    ├── Daily inputs (0..N) — voice/photo/text, tagged to kid(s) or "all"
    └── Weekly reports (1 per ISO week, generated Sunday)
```

### Notes

- One account = one parent (in v0.1). Multi-parent / family-sharing in v0.2.
- Inputs can be tagged to one kid, multiple kids, or "all kids" (whole family activity).
- Reports are always per-kid. Inputs tagged "all" are referenced in every kid's report.
- Reports are immutable once generated (artifact integrity). Re-generation requires a deliberate action.

### Storage

- Voice memos: file storage (Supabase Storage), transcribed on upload
- Photos: file storage, with optional AI description on upload
- Text inputs: database
- Reports: stored as both structured data (for the timeline view) and rendered HTML/PDF (for the artifact)

---

## Technical stack

### Confirmed

- **Next.js 16.2.6** (App Router, Turbopack)
- **React 19.2.4**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (base-ui under the hood)
- **Geist Sans** (Vercel's font, free)
- **Lucide icons**
- **Hosting**: Vercel (default for Next.js, free tier covers v0.1)

### Planned (add when needed)

- **Supabase**: auth, Postgres database, file storage. AU region.
- **Anthropic Claude API**: weekly report generation (Sonnet for quality, Haiku for transcription if needed)
- **OpenAI Whisper** (or Deepgram): voice memo transcription
- **Resend**: transactional emails (welcome, weekly report ready, etc.)
- **Stripe**: subscription billing, AUD primary, NZD support
- **react-pdf** or **Puppeteer**: PDF generation of reports
- **Posthog**: product analytics (privacy-respecting)

### Will NOT use

- No native mobile framework (React Native, Expo) — responsive web only
- No CMS (we don't have content marketing in v0.1)
- No GraphQL (REST/server actions are simpler)
- No third-party tracking pixels (privacy first)

---

## User flows

### Onboarding (60 seconds)

1. **Land on /signup** — email + password (or magic link via Supabase auth)
2. **Parent details** — first name (used in copy)
3. **Add your kids** — for each: name, age, one-line "what they're like" (optional)
4. **What's your homeschool style?** — single-select: structured/curriculum, eclectic/hybrid, unschooling, "still figuring it out"
5. **Set Sunday delivery time** — default 7pm local
6. **Trial starts** — land on dashboard with first daily input prompt visible

### Daily input (30-60 seconds)

1. **Open app** — see "What did [Charlie] do today?" or "What did the family do today?"
2. **Pick input mode** — voice (default, big mic button), photo, or text
3. **Tag the kid(s)** — pre-selected to "all kids" or last-tagged kid
4. **Submit** — quick confirmation, return to dashboard with input added to the running "this week so far" view

### Sunday report delivery

1. **6pm local Sunday**: AI generation kicks off (background job)
2. **Sunday delivery time**: email lands ("Charlie's week is ready 🌱")
3. **Tap email**: open report in browser (no login required if using a signed link)
4. **View / download / share**: the report screen has prominent download and share actions
5. **Subscription prompt** (week 2+ only, free-trial users): elegant inline upsell at bottom of report

### Subscription

1. **Trigger**: end of trial OR attempt to access second weekly report
2. **Page**: clean pricing screen, monthly + annual options, lime CTAs
3. **Stripe checkout** — embedded, AUD/NZD detected from billing address
4. **Confirmation** — return to app, paid badge, watermark removed from future reports

---

## The weekly report artifact

This is the entire product. Get this right and Sprout works. Get this wrong and nothing else matters.

### Structure (single page, vertical scroll, designed for screenshot/print)

1. **Hero** — Kid's name + week dates + soft tagline ("This week, Charlie grew.")
2. **The week in skills** — 4-6 developmental dimensions visualised (Curiosity, Communication, Problem-Solving, Self-Direction, Physical, Social-Emotional). Each as a soft progress indicator + a one-sentence reflection grounded in the parent's actual inputs.
3. **Learning highlights** — 3-5 specific moments, reframed. Example: *"Baking cookies on Tuesday touched maths (fractions, sequencing) and life skills (following instructions, patience)."* This is the magic — turning chaotic real life into legitimate learning.
4. **A moment to remember** — one specific moment from the week, written warmly, evocatively. The "save-this-forever" piece.
5. **Forward suggestion** — ONE gentle next-week prompt. *"Charlie loved the volcano doc — a follow-up library trip might extend that spark."* Specific, not generic.
6. **Footer** — week number ("Week 12 of Charlie's Sprout journey"), a subtle "Made with Sprout 🌱" mark for free tier.

### Design principles

- One screen, designed to look complete in a screenshot
- Print-perfect at A4
- The kid's name is the largest element on the page
- Warm photography (if parent uploaded photos, one feature image)
- Forest green section headers, lime green accents on the visual indicators
- No data dashboards, no graphs, no metrics that look "EdTech"
- Reads like a *letter to the parent about their kid*, not a *report card*

### AI generation

- **Model**: Claude Sonnet (quality matters more than cost on this — it's the entire product)
- **Input context**: all inputs from the past week, the kid's profile, prior weekly reports (for arc continuity)
- **Output**: structured JSON → rendered template
- **Tone**: warm, specific, never generic, never patronising, never inflated. If the week was thin, acknowledge it gently — don't fabricate growth.
- **Quality bar**: every report should make the parent feel SEEN. Not impressed by the AI. Seen.

---

## Multi-child handling

- Account holds multiple kids
- Daily inputs can be tagged to one kid, several kids, or "all kids"
- Each kid gets their **own** weekly report (separate artifacts)
- An "all kids" tagged input appears in every kid's report context
- Optional: a household summary roll-up view (NOT a separate report — just an in-app aggregate). Build only if user testing demands it.
- Pricing remains flat per family — no per-kid pricing, ever.

---

## Privacy & data handling

### Principles

- AU/NZ user data lives in **AU region** (Supabase Sydney region or equivalent)
- No data sold, ever
- No third-party tracking pixels (analytics via Posthog self-hosted or privacy mode)
- Photos / voice memos of children are treated with extreme care — never used for training, never shared
- Parent can export all their data at any time (JSON + media bundle)
- Parent can delete account and all data with one click (real deletion, not soft delete)

### Compliance

- AU Privacy Act 1988 (Australian Privacy Principles)
- NZ Privacy Act 2020
- COPPA-equivalent care for kid-related content (we don't collect from kids, but we hold info about them — extra care)
- Clear privacy policy in plain English (not legalese)

---

## Distribution & marketing

### Channel priority (community-led, not paid first)

1. **AU/NZ homeschool Facebook groups** — Home Education Network (VIC), state-specific NSW/QLD/WA groups, Christian homeschool networks, NZ homeschool groups. Total reachable: 30k-50k+ engaged members.
2. **Ambassador mums** — recruit 10 lifetime-free users in exchange for sharing their reports authentically when proud.
3. **Homeschool podcasts** — sponsor 2-3 of the bigger AU/NZ homeschool shows. Founder appearances.
4. **In-person homeschool meetups** — show up, take photos, build the human-behind-the-brand presence.
5. **Founder social presence** — Chase posts on Instagram building Sprout in public; warm trust building.
6. **Word-of-mouth viral loop** — the unlocked, shareable weekly report itself is the marketing.
7. **Paid Meta ads** — ONLY after messaging is dialed in from real customer language (months 6+).

### Messaging principles

- Use exact phrases mums use in FB groups (capture during validation phase)
- Lead with the emotion ("the Sunday-night relief"), not the feature
- Show the artifact, always — every piece of marketing should include a screenshot of a real (or carefully designed sample) weekly report
- Never use the words "EdTech," "platform," "solution," "engagement," "analytics"

### Brand promise (the one line)

> *"Prove the week counted."*

That's the tagline, the marketing line, the elevator pitch, the hook. Repeat everywhere.

---

## The validation plan

Running in parallel with v0.1 build (Chase's call — validation-AND-build, not validation-then-build).

### Week 1-2

- [ ] Join 5-10 AU/NZ homeschool Facebook groups, lurk and read 100+ posts
- [ ] Capture verbatim language mums use about their anxiety
- [ ] DM 10-20 mums for 15-min calls
- [ ] On each call: ask "what's the hardest emotional part of homeschooling?" and "how do you know if you're doing enough?" — listen, don't pitch

**Validation gate:** if 7+ unprompted mums describe the "am I doing enough" anxiety, the wedge is real and we keep building. If they describe a different pain (time, curriculum, isolation), we pivot the product to that pain BEFORE building further v0.1 features.

### Week 3-4

- [ ] Recruit 5 mums for a concierge MVP
- [ ] They send their weeks via email/voice memo; Chase manually generates beautiful weekly reports using Claude in the background
- [ ] Email the report Sunday night
- [ ] Watch for the reaction — *"holy shit"* vs *"thanks"*

**Validation gate:** if 4/5 say they'd pay $29/mo for this delivered automatically, we're a go. If less, we revise the artifact format.

### Week 5+

- [ ] Onboard the 5 concierge users into the real app as founding users (free for life)
- [ ] Their organic shares in FB groups become the first marketing
- [ ] Open paid signups
- [ ] Start dialling in Meta ads with real customer-language copy

---

## Roadmap

### v0.1 — Validation + first paying users (months 1-3)

- Multi-child accounts
- Daily input (voice / photo / text)
- Weekly report generation (per-kid)
- Web view + PDF + email delivery
- Stripe billing
- 7-day trial, first report unlocked
- Goal: 10-25 paying users by end of month 3

### v0.2 — Polish + retention (months 4-6)

- Household summary view (if requested)
- Better photo handling (auto-grouping by week)
- Anniversary reports (3-month, 6-month milestones)
- Refined onboarding based on call data
- Goal: 50 paying users by end of month 6

### v1.0 — Niche dominance push (months 7-12)

- Family-sharing (parent A + parent B on one account)
- Annual yearbook (printed deluxe artifact, $79 one-off upsell)
- Light "co-op" features for homeschool group leaders (if demand surfaces)
- AU/NZ podcast sponsorships, paid Meta ads, ambassador program scale
- Goal: **100 paying users by end of month 12**

### v2.0+ — Beyond AU/NZ (year 2)

- UK launch (similar regulatory environment, similar parent psychology)
- Optional regulator-export feature (NSW NESA, QLD HEU portfolio formats)
- Sprout for Co-ops (B2B tier)

---

## Success metrics

### 12-month north star

**100 paying users.**

That's the win. Everything else is downstream.

At a healthy mix of monthly + annual subscriptions, this implies:
- ~$3,000-4,000 MRR
- ~$36k-48k ARR
- A defensible niche-leader position in AU/NZ homeschool tech
- Validated product-market fit for the $29/mo emotion-relief wedge
- Foundation for v2.0 expansion (UK, B2B co-ops, yearbook upsells)

### Leading indicators (track weekly)

- Weekly active parents (logged input in past 7 days)
- Reports generated per week
- Trial → paid conversion rate (target: 25%+)
- Reports shared in FB groups (track via UTM on watermark link)
- Average inputs per week per family (signal of habit)
- Churn rate (target: <5% monthly for paid)

### Anti-metrics (do not optimize for these)

- DAU (daily active users) — we don't WANT them in the app every day; the weekly report is the moment
- Streak length — we explicitly don't gamify
- Time-in-app — less is better
- Number of features — strict scope forever

---

## Key risks

### 1. The pain hypothesis is wrong

**Risk**: parents say they have anxiety but actually want curriculum/planners more.
**Mitigation**: validation phase weeks 1-2. If 10 calls don't surface the anxiety pain unprompted, pivot to the pain that IS surfaced before building further.

### 2. Anxiety is a year-1 problem, not evergreen

**Risk**: parents anxious in year 1 of homeschool, less so by year 3 → high churn.
**Mitigation**: ICP intentionally targets newer homeschool families. Add v0.2 features (anniversary reports, growth-arc visualisation) to extend emotional value into years 2-3.

### 3. Shareability doesn't drive viral growth

**Risk**: parents like the report but don't actually share it, so paid acquisition becomes the only channel.
**Mitigation**: design the report explicitly for shareability; instrument and track shares; if low, redesign artifact OR add explicit share prompts in-app.

### 4. AI quality is inconsistent

**Risk**: bad weekly reports kill the magic moment instantly.
**Mitigation**: use Claude Sonnet (quality > cost), tight prompt engineering with continuity context, manual review of first 50 reports before fully automating, founder-readable QA loop.

### 5. AU/NZ market is too small to support the business at $29/mo

**Risk**: 100 paying users is achievable but stalling beyond that limits growth.
**Mitigation**: roadmap explicitly includes UK expansion (year 2) and B2B co-op tier. Niche dominance first, then expansion from a strong base.

### 6. ChatGPT or competitor copies the wedge

**Risk**: a generic AI tool adds a "homeschool weekly report" feature.
**Mitigation**: niche brand depth, community trust, the artifact-as-marketing flywheel, AU/NZ localisation. Defensibility comes from being the *most loved* in the niche, not from feature uniqueness.

### 7. Founder burnout / focus drift

**Risk**: solo founder, all-in focus, multiple past projects could pull attention.
**Mitigation**: explicit working agreement (this doc), tight scope discipline, 12-month north star clear and modest enough to be motivating not crushing.

---

## Working agreement

### Cofounder dynamic

- Chase is the founder. I (Claude) operate as cofounder for this project.
- I push back hard when I disagree, especially on:
  - Scope creep ("what about a planner?", "what about lesson plans?")
  - Premature feature work before validation
  - Anti-shareability monetization (e.g. screenshot-blocking the artifact)
  - Overconfident claims about market or willingness-to-pay
- I deliver momentum when the call is right.
- I own and admit when I've overstated something.
- I do not gas Chase up. Cofounder honesty over yes-man behaviour.

### Decision-making

- Strategic decisions (pricing, ICP, scope, brand): joint, with Chase final.
- Tactical decisions (architecture, naming, copy first-drafts, design tokens): I make them as cofounder, Chase corrects if needed.
- Anything ambiguous: I ask 1-3 sharp questions, then move.

### Anti-patterns to call out

- Mentioning Chase's other projects (Ether, LegerFlow, Section 8, etc.) — Sprout-only conversations, zero cross-references.
- Bloating responses with caveats and hedging when a decision is needed.
- Building infrastructure before there's a user-facing screen that needs it.

### When to update this document

- After any major scoping decision
- After significant validation findings
- After pricing changes
- Before each version milestone (v0.2, v1.0)

---

## Open items / pending

- [ ] Brand palette + fonts from Chase (in progress, references shared)
- [ ] Domain decision (sproutweekly.com, getsprout.app, sprout.family — TBD)
- [ ] Privacy policy + terms (closer to launch)
- [ ] First 5 concierge MVP recipients identified
- [ ] First 10 mum interviews scheduled

---

*This is the master document. All other docs in this project should reference it. When in doubt, this is the source of truth.*
