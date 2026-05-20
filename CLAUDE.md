# Sprout

A weekly reflection app for AU/NZ homeschool parents (multi-child, ages 5-17). One job: turn a chaotic homeschool week into a beautiful, AI-generated weekly artifact (per kid) that proves the week counted. Replaces 3am parental anxiety with Sunday-night relief.

@AGENTS.md

## Source of truth

- **[`docs/MASTER.md`](docs/MASTER.md)** — full A-Z product/strategy spec. Read it before making any product, scope, or positioning decision. When in doubt, MASTER wins.
- **[`docs/BRAND.md`](docs/BRAND.md)** — visual brand spec (palette, typography, premium-feel rules, paste-ready image gen prompts). Read before making any design, copy, or asset-generation decision.

## Quick orientation

- **The wedge**: parental anxiety ("am I screwing my kid up?"), not curriculum
- **The mechanic**: welcomed-not-required daily inputs (voice/photo/text) → AI-generated weekly report (per kid, every Sunday night) → beautiful shareable artifact
- **Pricing**: AUD $29/mo or $249/yr, 7-day trial, first weekly report unlocked-and-shareable forever (shareability = marketing)
- **Multi-child from day one**: parent → kids[], inputs tagged per-kid or "all," reports per-kid, flat per-family pricing
- **Scope**: relentlessly tight — no curriculum, no lesson plans, no rego paperwork, no kid logins, no streaks/gamification, no native mobile app

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Geist Sans · Lucide. Planned (add when needed): Supabase (AU region) · Anthropic Claude API · Resend · Stripe.

## Brand at a glance

Three moods, one brand:
- **Marketing/landing**: light + confident (white, deep forest green, lime accents, bold sans)
- **App interior**: dark + immersive + glassmorphic (deep almost-black, frosted cards, lime CTAs)
- **Weekly report artifact**: light + warm + shareable (cream/white, forest green headers, designed for screenshot + print)

Voice: direct & confident. Linear/Vercel register. AU/NZ English. No exclamation marks. No emojis-as-decoration. Warmth comes from what we say, not how excitedly we say it.

## Working agreement

Push back on scope creep, premature feature work, anti-shareability monetization, and overconfident market claims. Don't gas the founder up. Don't reference Chase's other projects — Sprout only.

**Trust the outbound loop you can't see.** Chase runs his warm conversations and outbound in day-to-day life on his phone — not in CC sessions. When he's prompting here, he's doing building/testing/strategy work, which has its own value. Don't reflexively pivot prompts toward *"have you talked to a parent yet."* Don't lecture on drift if the work he's prompting for is real (mobile fixes, mascot, content, copy, etc). The 5/10 viability read and concierge MVP plan are noted and locked (see Current state below) — don't re-surface them every session. If a genuine polish-forever pattern shows up across multiple sessions in a row, flag it **once**, briefly, and drop it. One mention max, no repeats. Ship what Chase prompts for; trust the loop.

12-month north star: **100 paying users.**

---

## Current state (snapshot · 2026-05-20)

A clean save-state for future sessions. Read this first before assuming what's been built or decided.

### Operating context (where Sprout actually is right now)

- **Acquisition motion**: warm conversations with homeschool family friends Chase already has access to. **NOT** cold outbound into auth-walled FB groups. The cold-distribution problem (founder is non-member of AU/NZ homeschool community) is real but **deferred** — only resurfaces if/when Sprout grows past Chase's warm network.
- **Landing page job**: concept-explainer for warm contacts who've already heard about Sprout from Chase. Someone he's talked to should land on the page and think *"oh that's the thing."* It is **not** a cold-traffic conversion page. Polish should match that job, not exceed it.
- **Pricing status**: **exploratory placeholder, not committed.** The $29/mo number in [`docs/MASTER.md`](docs/MASTER.md) is an anchor for thinking, not a decision. Real pricing gets discovered after warm contacts have felt the artifact land — ask "what would you pay?" then, not now. Earlier comparisons to Tinybeans / Day One were treating a placeholder as a decision; ignore that framing.
- **Product framing**: stupid simple. One pain (parents lose track of what their kid learned this week). One output (a printable weekly report the parent can show their kid). Not a SaaS platform thesis. Not a journaling app. One input flow, one artifact.

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
- **Mechanic**: voice/photo/text input across the week → AI weekly per-kid report → beautiful shareable artifact, Sunday night.
- **Pricing structure** (locked): flat per family, not per kid. 7-day trial. First weekly report unlocked + watermarked + yours-forever even if user cancels. **The specific price number is NOT locked** — see Operating context above.
- **Voice**: AU/NZ register, no exclamation marks, no SaaS jargon, no emojis-as-decoration, founder voice / lowercase energy.
- **Scope fence**: no curriculum, no lesson plans, no compliance positioning, no streaks/gamification, no kid logins, no native mobile app, no community features.
- **12-month north star**: 100 paying users.

### Open questions (need real-world validation, not more thinking)

- **Will an AU/NZ homeschool mum actually pay $29/mo for the Sunday-night artifact?** Zero evidence yet. Comparables (Tinybeans $5/mo, Day One $3/mo) suggest the price is aggressive.
- **Does the wound surface unprompted in 10 mum calls**, or do mums describe a different lead pain (time, curriculum, isolation)?
- **Will AI-generated weekly reports feel specific enough** to her kid that she cries-in-a-good-way, or will they feel like ChatGPT slop?
- **Can Chase (NZ-based, non-homeschool, non-parent, solo founder) authentically enter AU/NZ homeschool communities**, or does the business need a co-founder mum / ambassador on the front?
- **What time does the doubt actually surface** — Sunday night, Friday afternoon, mid-week? The "Sunday night" framing is a brand assumption, not a researched truth.
- **Does the sparse-input failure mode kill the magic?** If a mum logs 2 voice memos in a chaotic week, is the report still good?

### Market context (the bull-case backdrop the 5/10 doesn't capture)

AI tracking apps are in a major boom cycle right now — Cal AI (photo-based calorie tracking) exited for ~9 figures, and the category leaders aren't winning on tracking, they're winning on removing input friction with AI. Sprout's mechanic (voice memo / photo / sentence → AI compiles meaning) is the Cal AI playbook applied to homeschool, in a niche with no direct competitor: Tinybeans is typical-parent memory-keeping, Day One is personal journaling — neither sits in the "AI compiles your homeschool week into proof your kid is learning" mental slot. AU/NZ homeschool is a defensible beachhead before US expansion. The bear case in the viability read still stands (behaviour adoption unproven, wallet unvalidated, founder distribution problem mitigated by warm-contact motion) — but both cases coexist. This is a higher-variance bet than the 5/10 captures: a niche-leading AI tracker in a booming category with no direct competitor and unproven behaviour adoption is the shape of a bet that goes to zero or to nine figures, not mediocre.

### Honest viability read (2026-05-20)

**5/10.** Sitting exactly on the validation gate.

- The wound is real but the willingness-to-pay is completely unvalidated.
- The audience long-term is gated and the founder is structurally outside it — but the *current* acquisition motion is warm-contact, so this is deferred risk, not immediate blocker.
- The product is intellectually elegant but behaviourally demanding.
- The competitive moat is narrative (good) and not technical (ChatGPT memory closes the continuity wedge inside 12 months).
- Work to date is brand/voice/research — zero product code, zero customer conversations.

The next 30 days of validation decide whether this is a 7/10 (5 concierge mums say "yes I'd pay") or a 3/10 (the wound proves soft and the pricing thesis dies). The cost of validating is 30 days; the cost of not validating is 6 months of polish on something that may not work. Asymmetry says validate.

### Single highest-leverage next action (the only thing that moves Sprout forward right now)

**Concierge MVP with 5 warm-contact homeschool families.** Chase manually generates a printable weekly report (PDF) for each family, every Sunday, for 3-4 weeks. Free. No pricing conversation upfront.

Watch for: (a) does the wound surface in the conversations unprompted, (b) does the artifact actually land — do they cry-in-a-good-way, show it to the kid, screenshot it, want next week's, (c) what do they call it back to Chase in their own words.

Only *after* the artifact has been felt — week 3 or 4 — ask what they'd pay for this delivered automatically every Sunday. That's where price gets discovered, not before.

The binding constraint is not DMs sent or landing-page polish. It is: 5 warm-contact families committed, weeks of manual reports done well, real reactions captured.

### What NOT to do next (procrastination-as-progress patterns to flag)

- More landing page copy passes (it's a concept-explainer for warm contacts now, not a conversion page — polish should match that job, not exceed it)
- More brand polish / more glassmorphism tuning
- Building any product code (auth, Supabase, AI pipeline, etc.) before concierge has proven the artifact lands
- More quote bank mining
- More research skill building
- More content generation (FB drafts, IG captions, emails) — useful when Sprout goes past warm contacts, not now
- Domain selection / waiting on Chase's font preference
- Cold DMs into auth-walled communities — wrong motion for this phase
- Anything that lets Chase do visible craftwork instead of invisible relationship work with the 5 warm-contact families

All of the above are downstream of validation. None of them get Chase to a felt-artifact moment with a real family.
