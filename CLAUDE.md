# Sprout

A homeschool documentation app for AU/NZ parents (multi-child, ages 5-17). One job: capture what the kid did across the week and make it visible — to the parent for clarity, to the kid as proof of the work they're building. Inputs accumulate into a navigable timeline; the app compiles and organises but never synthesises. Fitness-app mechanic (Strava / MyFitnessPal / Apple Health pattern), not AI generation. Replaces scattered notes, photo galleries, Google Docs, spreadsheets — and the 9pm "am I screwing my kid up" Facebook post — with one private place where the week is visible.

@AGENTS.md

## Source of truth

- **[`docs/MASTER.md`](docs/MASTER.md)** — full A-Z product/strategy spec. Read it before making any product, scope, or positioning decision. When in doubt, MASTER wins.
- **[`docs/BRAND.md`](docs/BRAND.md)** — visual brand spec (palette, typography, premium-feel rules, paste-ready image gen prompts). Read before making any design, copy, or asset-generation decision.

## Quick orientation

- **The wedge**: parental anxiety ("am I screwing my kid up?"), not curriculum
- **The mechanic**: inputs across the week (voice memo, photo, sentence, scheduled activity, deadline, calendar item) → the app auto-compiles into a per-kid navigable timeline + weekly view → both parent and kid can scroll the work building up. Fitness-app mimic. No AI synthesis in the app loop. No data training. Privacy is the moat.
- **Pricing**: AUD $29/mo or $249/yr **placeholder** (not committed — see Operating context), 7-day trial, first week's compiled view exportable-and-yours-forever (shareability = marketing)
- **Multi-child from day one**: parent → kids[], inputs tagged per-kid or "all," timeline per-kid, flat per-family pricing
- **Scope (v0.1)**: relentlessly tight — no curriculum, no lesson plans, no rego paperwork as the headline (latent benefit only), no streaks/gamification, no native mobile app (web responsive), no AI synthesis in the app loop, no data sold or shared or trained on, no community features. **In scope**: calendar with deadlines, scheduled activities, voice/photo/text documentation, per-kid timeline, weekly view, kid-facing visual view (accessed from parent's session for now — separate kid logins TBD).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Geist Sans · Lucide. Planned (add when needed): Supabase (AU region) · Resend · Stripe. **No LLM API in the app loop** — Sprout organises and visualises, doesn't generate. Voice memos may be transcribed via on-device or third-party transcription only (no training data shared). If that ever changes, it's a positioning decision, not a technical one.

## Brand at a glance

Three moods, one brand:
- **Marketing/landing**: light + confident (white, deep forest green, lime accents, bold sans)
- **App interior**: dark + immersive + glassmorphic (deep almost-black, frosted cards, lime CTAs)
- **Timeline / weekly view artifact**: light + warm + shareable (cream/white, forest green headers, designed for screenshot + print). Both parent-side and kid-side render with the same warm shareable aesthetic — the kid-facing view is the same artifact, not a dumbed-down version.

Voice: direct & confident. Linear/Vercel register. AU/NZ English. No exclamation marks. No emojis-as-decoration. **One well-placed swear is now in-bounds** when it mirrors the audience's actual register — "shit" / "eff" are verified-corpus anchors (Jenna Galley, Mum Central AU). Stronger swears ("fuck") need an attributed mum-verbatim before they go in Sprout's voice — don't write them on training-data assumption alone. Never gratuitous. Never in CTA microcopy. Warmth comes from what we say, not how excitedly we say it.

## Working agreement

Push back on scope creep, premature feature work, anti-shareability monetization, and overconfident market claims. Don't gas the founder up. Don't reference Chase's other projects — Sprout only.

**Trust the outbound loop you can't see.** Chase runs his content production, warm conversations, and outbound in day-to-day life on his phone — not in CC sessions. When he's prompting here, he's doing building/testing/strategy work, which has its own value. Don't reflexively pivot prompts toward *"have you talked to a parent yet"* or *"how many posts did you ship today."* Don't lecture on drift if the work he's prompting for is real (mobile fixes, mascot, content, copy, etc). The 5/10 viability read and the 30-day sprint plan are noted and locked (see Current state below) — don't re-surface them every session; the Monday check-in routine handles accountability. If a genuine polish-forever pattern shows up across multiple sessions in a row, flag it **once**, briefly, and drop it. One mention max, no repeats. Ship what Chase prompts for; trust the loop.

12-month north star: **100 paying users.**

---

## Current state (snapshot · 2026-05-23)

A clean save-state for future sessions. Read this first before assuming what's been built or decided.

### Operating context (where Sprout actually is right now)

- **Acquisition motion (as of 2026-05-23 sprint)**: dual track. (1) Broad distribution via 3x/day TikTok + 3x/day Instagram + Facebook warming to drive a 1,000-person waitlist in 30 days. (2) Warm parent conversations — showing the landing page to homeschool parents Chase has access to and capturing verbal value-feedback (NOT for site iteration; for validation that the wound and the artifact-promise actually land). The earlier "deferred cold distribution" posture is superseded by this sprint — Chase has decided to test broad distribution and the founder-non-member problem in the same 30-day window.
- **Landing page job (updated 2026-05-23)**: dual purpose. (1) Concept-explainer for warm contacts ("oh that's the thing"). (2) Waitlist conversion surface for cold TikTok/IG/FB traffic arriving from the 30-day content sprint. Polish should match those two jobs — clear value prop, frictionless waitlist signup — and not exceed them.
- **Pricing status**: **exploratory placeholder, not committed.** The $29/mo number in [`docs/MASTER.md`](docs/MASTER.md) is an anchor for thinking, not a decision. Real pricing gets discovered after warm contacts have felt the artifact land — ask "what would you pay?" then, not now. Earlier comparisons to Tinybeans / Day One were treating a placeholder as a decision; ignore that framing.
- **Product framing (updated 2026-05-24)**: stupid simple. One pain (parent can't see what the week added up to + the kid can't see their own work building over time). One output (a navigable per-kid timeline + weekly view, both parent and kid can see). **Fitness-app for homeschool documentation** — Strava / MyFitnessPal / Apple Health pattern: structured logging in, visible accumulation out, no AI synthesis. Not a SaaS platform thesis. Not a curriculum. Not a journaling app. Not a planner — though scheduling, deadlines, and calendar items live inside it. The structural differentiator vs every existing tracker/journal: Sprout doesn't sell or train AI on your kid's data. Privacy is the moat.

### Shipped

- **Landing page** at `sprout-sigma-eight.vercel.app` (deploys auto-trigger from `main` push via Vercel GitHub integration). Voice/copy locked, fake stats removed, 5-star badge removed, "homeschool families" labels aligned across hero/footer/CTA, multi-kid pricing line removed from hero, Step 02 + Step 04 floating cards repositioned off cream phone screen.
- **Brand voice rules** documented in [`docs/MASTER.md`](docs/MASTER.md) and [`docs/BRAND.md`](docs/BRAND.md).
- **`sprout-truth` skill** (lives in `~/.claude/skills/sprout-truth/`, not committed to repo):
  - `quote-bank.md` — ~25 verbatim quotes, ~13 cross-verified AU + ~5 cross-verified US. Anchors: Charlene Hess (Hess UnAcademy, US), Jenna Galley (Mum Central, AU), Louise (School Can't Australia, NSW), Sara (Australian Homeschool Stories Podcast, QLD). Gaps: Category 3 (scattered records), Category 4 (registration-officer dread), Category 8 (post-launch reaction) all empty.
  - `audience-truths.md` — primary persona ("the anxious-but-committed mum"), niche segments, channel truths, research-pending list.
  - `language-inventory.md` — avoid/use vocab, SaaS-marketing register vs forum vernacular, AU/NZ register markers.
  - `voice-and-positioning.md` — five voice rules with reasoning, positioning frame, structural responses to strongest critiques.
  - `playbooks/` — facebook-static-post, facebook-group-engagement, instagram-caption, email, landing-copy.

### Not shipped (and not on the critical path right now)

- **The product itself.** Codebase is landing-page-only. No auth, no Supabase, no Stripe, no AI pipeline, no daily input UI, no report generation, no email delivery, no app interior. Stack in `package.json` is Next.js 16 + Tailwind + shadcn only.
- **Customer conversations.** Zero mum interviews conducted. Zero concierge MVP deliveries.
- **Distribution presence.** No FB group access (auth-walled, Chase is non-member). No IG account. No Substack. No podcast guesting.

### Locked decisions (do not relitigate without strong evidence)

- **Audience**: AU/NZ homeschool families. Mums dominant; on-page label is "families" for inclusivity but voice writes to the mum.
- **Wound**: parental anxiety ("am I screwing my kid up?"), never curriculum.
- **Mechanic (updated 2026-05-24)**: voice/photo/text inputs + calendar/scheduled-activities/deadlines across the week → app auto-compiles into a per-kid timeline + weekly view → both parent and kid can see it accumulate. **No AI synthesis in the app loop.** No data sold, shared, or trained on. Fitness-app pattern (Strava / MyFitnessPal / Apple Health) applied to homeschool documentation. The "Sunday-night AI-generated artifact" mechanic from earlier spec is retired — the artifact IS the timeline, accessible any time, naturally surfaced as a weekly view.
- **Pricing structure** (locked): flat per family, not per kid. 7-day trial. First weekly report unlocked + watermarked + yours-forever even if user cancels. **The specific price number is NOT locked** — see Operating context above.
- **Voice**: AU/NZ register, no exclamation marks, no SaaS jargon, no emojis-as-decoration, founder voice / lowercase energy. **One well-placed swear permitted** (anchored to verified-corpus "shit"/"eff" — Jenna Galley, Mum Central AU); stronger swears need attributed mum-verbatim before use in Sprout's voice.
- **Scope fence (updated 2026-05-24)**: no curriculum, no lesson plans, no compliance positioning (rego-officer use is latent benefit, not headline), no streaks/gamification, no native mobile app (web responsive), no community features, no AI synthesis in the app loop, no data sold or shared or trained on. **Calendar, deadlines, scheduled activities, and a kid-facing visual view are IN scope** — accessed from the parent's session for now (separate kid logins TBD, not blocked).
- **12-month north star**: 100 paying users.

### Open questions (need real-world validation, not more thinking)

- **Will an AU/NZ homeschool mum actually pay $29/mo for the timeline + privacy product?** Zero evidence yet. Comparables: Tinybeans $5/mo, Day One $3/mo are low; fitness-app comparables (MyFitnessPal Premium $20/mo, Strava $12/mo) are closer to the price point.
- **Does the wound surface unprompted in 10 mum calls**, or do mums describe a different lead pain (time, curriculum, isolation)?
- **Without AI synthesis, does the raw timeline feel like enough proof** when she scrolls it — or does it just feel like a folder of stuff? This is the load-bearing question for the new model. The fitness-app analogy says yes (Strava users feel proof from raw runs, not AI summaries); homeschool documentation is higher-friction input than GPS auto-logging, so it's not a 1:1 lift.
- **Will the kid-facing view actually delight the kid** (Apple-Health-step-count energy) or feel like school-creep? Founder is confident the parallel kid-view is the move; needs real-world test with a 7-year-old and a 13-year-old to confirm.
- **Can Chase (NZ-based, non-homeschool, non-parent, solo founder) authentically enter AU/NZ homeschool communities**, or does the business need a co-founder mum / ambassador on the front?
- **How often does the parent actually open the app** — daily, weekly, only when a registration officer is coming? The continuous-documentation mechanic only works if open rate is non-trivial. Fitness apps get this for free via passive sensors; Sprout requires deliberate input.
- **Does the sparse-input failure mode kill the magic?** If a mum logs 2 voice memos in a chaotic week, is the timeline + weekly view still compelling — or does it expose how thin the week was?

### Market context (updated 2026-05-24 — new model, different bet)

The earlier framing was "Cal AI playbook applied to homeschool" — AI removing input friction, the photo-to-meaning loop. **That's no longer the model.** Sprout's pivoted to the fitness-app pattern: Strava, MyFitnessPal, Apple Health, AllTrails — structured logging in, visible accumulation out, no AI synthesis required. That pattern has built every category-leading consumer tracker. It works without inviting the model-training privacy concerns AI-generated competitors will trip over.

Sprout's wedge in this version: the **niche homeschool-documentation fitness-app, with a privacy stance that says "we don't sell your data, we don't train AI on your kid's voice memos, your week stays yours."** That stance is structurally impossible for ChatGPT-memory or any LLM-backed tracker to copy without retreating from their own training stack. Tinybeans is parent memory-keeping with no kid-facing view. Day One is personal journaling. Sprout sits in a vacant slot: a privacy-first homeschool tracker that compiles a parent's documentation and shows it back to both her and the kid as a navigable timeline. AU/NZ is the beachhead before US expansion.

The bear case still stands (behaviour-adoption unproven, wallet unvalidated, founder distribution problem mitigated by warm-contact motion). The variance shape is different now: less Cal-AI moonshot, more durable niche-leader with a structural privacy moat. The honest tradeoff: fitness-app behaviour adoption depends on either passive sensors (which Sprout doesn't have) or a strong reflection-habit (which Sprout has to build via UX). That's the load-bearing risk to watch.

### Honest viability read (2026-05-20)

**5/10.** Sitting exactly on the validation gate.

- The wound is real but the willingness-to-pay is completely unvalidated.
- The audience long-term is gated and the founder is structurally outside it — but the *current* acquisition motion is warm-contact, so this is deferred risk, not immediate blocker.
- The product is intellectually elegant but behaviourally demanding.
- The competitive moat is narrative (good) and not technical (ChatGPT memory closes the continuity wedge inside 12 months).
- Work to date is brand/voice/research — zero product code, zero customer conversations.

The next 30 days of validation decide whether this is a 7/10 (5 concierge mums say "yes I'd pay") or a 3/10 (the wound proves soft and the pricing thesis dies). The cost of validating is 30 days; the cost of not validating is 6 months of polish on something that may not work. Asymmetry says validate.

### 30-day sprint (2026-05-23 → 2026-06-22) — the only thing that matters right now

**Primary goal:** 1,000 waitlist signups by 2026-06-22.

**Stretch goal:** ~10 founding members at $29/mo. Small backend revenue (helps cover software costs) and a signal that some people actively want to connect with Chase personally about the product. Not the main objective — the waitlist is.

**Post-launch goals (after app is live and Chase emails the waitlist):** 500 downloads, 25% convert to $29/mo plan. After that, every $ goes to ads — aggressive distribution scaling and properly establishing the biz.

**The weekly work** (held accountable via the Monday check-in routine — see Routines reference below):

1. **Content cadence**: 3x/day TikTok + 3x/day Instagram. 42 posts/week total.
2. **Facebook warming**: joining homeschool groups, posting, commenting, building genuine presence (not extraction outreach).
3. **Parent conversations**: showing the landing page to real homeschool parents in Chase's network. Capturing what they actually SAY about it — quotes, not vibes. This is value-validation, not site iteration.

**The binding constraint** is not landing-page polish or product-code building. It is: posts shipped, parents shown the site, waitlist count climbing.

**Monday check-in routine**: `trig_01LW9mZkr44UfMEWq9Qd1APf` — fires every Monday 9am NZST with a structured accountability report (pro-rata targets, self-report checklist, honest flags, one-thing-this-week). Disable around 2026-06-22 when the sprint ends, or extend if Chase keeps scaling. URL: https://claude.ai/code/routines/trig_01LW9mZkr44UfMEWq9Qd1APf

**The earlier concierge-MVP-with-5-families plan is superseded** by this sprint. The validation motion has shifted from "5 mums experience a manual PDF artifact for 4 weeks" to "1,000 waitlist signups + verbal value-feedback from warm parent conversations + post-launch conversion data." Different bet, deliberately taken.

### What NOT to do next (procrastination-as-progress patterns to flag)

- More landing page copy passes beyond what the dual job requires (warm-contact concept-explanation + cold-traffic waitlist conversion)
- More brand polish / more glassmorphism tuning
- Building any product code (auth, Supabase, AI pipeline, etc.) before the 30-day sprint validates that there's a waitlist worth building for
- More quote bank mining
- More research skill building
- Domain selection / waiting on Chase's font preference
- Cold extraction DMs masquerading as engagement (Facebook warming = genuine group participation; if it feels like spam, it is)
- Anything that lets Chase do visible craftwork in CC instead of (a) shipping 42 posts/week, (b) showing the site to real parents, (c) growing the waitlist

All of the above are downstream of the 30-day sprint. None of them get Chase to 1,000 waitlist signups or a felt-artifact moment with a real parent.

**Note on content generation in CC**: content drafts (FB posts, IG captions, video hooks, emails) are no longer flagged as procrastination — they're directly upstream of the 42-posts/week target. Help when asked; help well. The `sprout-truth` skill is the source of truth for voice.

### Deferred for next visual pass (when one happens)

Items deliberately noted and skipped during this session — out of scope for copy-only work, queued for whenever real photography / illustration enters the picture:

- **Photo or illustration of parent + kid + printed report on a kitchen table** — the highest-leverage way to land the shared-pride beat. The page currently carries this through the Friday-afternoon scene + Feature 3 bullet + FAQ #4 (verbal/textual), and that's enough — but a real visual would do more than another paragraph could. Surfaced 2026-05-24 when proposing a third narrative scene; explicitly chose visual-future over copy-now.
- **Real human imagery generally** — the page is 100% SVG / glassmorphism / typography. No actual humans, no actual kids, no actual artifacts in real environments. A future visual pass could selectively introduce one or two on-brand photographs without breaking the design system.
