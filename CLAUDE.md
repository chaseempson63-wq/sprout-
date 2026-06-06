# Sprout

A homeschool documentation app for AU/NZ parents (multi-child, ages 5-17). One job: capture what the kid did across the week and make it visible — to the parent for clarity, to the kid as proof of the work they're building. Inputs accumulate into a navigable timeline; the app compiles and organises but never synthesises. Fitness-app mechanic (Strava / MyFitnessPal / Apple Health pattern), not AI generation. Replaces scattered notes, photo galleries, Google Docs, spreadsheets — and the 9pm "am I screwing my kid up" Facebook post — with one private place where the week is visible.

@AGENTS.md

## Source of truth

- **[`docs/MASTER.md`](docs/MASTER.md)** — full A-Z product/strategy spec. Read it before making any product, scope, or positioning decision. When in doubt, MASTER wins.
- **[`docs/BRAND.md`](docs/BRAND.md)** — visual brand spec (palette, typography, premium-feel rules, paste-ready image gen prompts). Read before making any design, copy, or asset-generation decision.

## Quick orientation

- **The wedge**: parental anxiety ("am I screwing my kid up?"), not curriculum
- **The mechanic**: inputs across the week (voice memo, photo, sentence, scheduled activity, deadline, calendar item) → the app auto-compiles into a per-kid navigable timeline + weekly view → both parent and kid can scroll the work building up. Fitness-app mimic. No AI synthesis in the app loop. No data training. Privacy is the moat.
- **Pricing**: AUD $29/mo or $249/yr **placeholder** (not committed — see Operating context). **Hard paywall** (updated 2026-06-03) — no free trial; onboarding does the selling. First week's compiled view exportable-and-yours-forever (shareability = marketing)
- **Multi-child from day one**: parent → kids[], inputs tagged per-kid or "all," timeline per-kid, flat per-family pricing
- **Scope (v0.1)**: relentlessly tight — no curriculum, no lesson plans, no rego paperwork as the headline (latent benefit only), no native mobile app (web responsive), no AI synthesis in the app loop, no data sold or shared or trained on, no community features. **In scope**: calendar with deadlines, scheduled activities, voice/photo/text documentation, per-kid timeline, weekly view, kid-facing visual view (accessed from parent's session for now — separate kid logins TBD), **streaks + gamification + progress rings (added 2026-06-03 — accountability mechanics are working across consumer apps, this is the fitness-app pattern Sprout is built on)**.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Geist Sans · Lucide. Planned (add when needed): Supabase (AU region) · Resend · Stripe. **No LLM API in the app loop** — Sprout organises and visualises, doesn't generate. Voice memos may be transcribed via on-device or third-party transcription only (no training data shared). If that ever changes, it's a positioning decision, not a technical one.

## Brand at a glance

Three moods, one brand:
- **Marketing/landing**: light + confident (white, deep forest green, lime accents, bold sans)
- **App interior**: dark + immersive + glassmorphic (deep almost-black, frosted cards, lime CTAs)
- **Timeline / weekly view**: light + warm + shareable (cream/white, forest green headers, designed for screenshot + print). Both parent-side and kid-side render with the same warm shareable aesthetic — the kid-facing view is the same thing, not a dumbed-down version.

Voice: direct & confident. Linear/Vercel register. US English (mom not mum, math not maths). No exclamation marks. No em dashes (founder's hard rule). No emojis-as-decoration. **One well-placed swear is now in-bounds** when it mirrors the audience's actual register — "shit" / "eff" are verified-corpus anchors (Jenna Galley, Mum Central AU). Stronger swears ("fuck") need an attributed mum-verbatim before they go in Sprout's voice — don't write them on training-data assumption alone. Never gratuitous. Never in CTA microcopy. Warmth comes from what we say, not how excitedly we say it. **Sprout reads as a movement, not a corporate product** — warm, plain, rallying. The word "artifact" is retired (2026-05-28, founder's call): say "the timeline," "your week," "what they built," "the thing."

## Working agreement

Push back on scope creep, premature feature work, anti-shareability monetization, and overconfident market claims. Don't gas the founder up. Don't reference Chase's other projects — Sprout only.

**Trust the outbound loop you can't see.** Chase runs his content production, warm conversations, and outbound in day-to-day life on his phone — not in CC sessions. When he's prompting here, he's doing building/testing/strategy work, which has its own value. Don't reflexively pivot prompts toward *"have you talked to a parent yet"* or *"how many posts did you ship today."* Don't lecture on drift if the work he's prompting for is real (mobile fixes, mascot, content, copy, etc). The viability read (5/10 on 5/20 → founder reads 8–8.5 on 6/3) and the 30-day sprint plan are noted — don't re-surface them every session; the Monday check-in routine handles accountability. If a genuine polish-forever pattern shows up across multiple sessions in a row, flag it **once**, briefly, and drop it. One mention max, no repeats. Ship what Chase prompts for; trust the loop.

**Don't flag funnel "leaks" without the full picture.** Chase intentionally sequences his rollouts (e.g., FB groups: trust-build phase first, Sprout/waitlist push second to avoid admin flags). When you see a metric that looks like a leak (e.g., high inbound + flat waitlist), check whether the conversion step has actually been run yet before flagging it. If unclear, ask before flagging. (Pattern: 2026-06-03, flagged a freebie→waitlist gap that was deliberate sequencing, not a leak.)

**Context dumps are for capture, not critique.** When Chase describes a plan, lane, or new motion in a context dump (especially "just so you know what I'm doing" mode), the job is to log it accurately and ask clarifying questions if needed. Do NOT overlay "watch-items," "open questions," or tactical advice on top of the plan unless he explicitly asks for a read. Tactical observations belong in moments when he asks "how am I tracking" or similar — not on every new lane mention. If a plan has a real load-bearing risk worth flagging, flag it once, briefly, and only when he's in a read-mode prompt. (Pattern: 2026-06-03, added unrequested production-time + wedge watch-items to the YT lane and CTR/conversion watch-items to the Meta paid ads lane during a context dump. Stripped both. Capture only.)

**Peer register, not teaching register.** Chase has years of operating experience across sales, distribution, content, ops. When he describes a strategy or plays back his thinking, do NOT respond with "fair correction, let me sharpen" / "to be intellectually honest" / MBA-class examples of comp companies (MyFitnessPal, Dropbox, Day One, etc.) / framework explanations of basics he already knows (Product × Distribution × Retention math, the Dropbox referral mechanic, B2C subscription dynamics, what constitutes a moat, why speed-as-solo-founder matters, etc.). If you disagree, say it once briefly and move on. If he's right, acknowledge and stop. The recapitulation, comp-company examples, "let me sharpen" / "where I'd still hold the math honestly" / "concession" phrasing all read as condescension. He's the one running the business; calibrate to peer-to-peer co-founder, not MBA-tutor. (Pattern: 2026-06-03, kept getting flagged for over-explaining basic founder concepts in essay form when peer one-liner was the right register.)

12-month north star: **100 paying users.**

---

## Current state (snapshot · 2026-05-28)

A clean save-state for future sessions. Read this first before assuming what's been built or decided.

### Operating context (where Sprout actually is right now)

- **Acquisition motion (baseline 2026-05-28; sprint day-12 update 2026-06-03 below)**: a multi-lane distribution stack, all pointing at the waitlist. (1) **Sprout TikTok + Instagram** — organic ~3x/day, niche memes swung Sprout's way + typographic carousels. (2) **Facebook Page** — live, posting, auto-cross-post from Sprout IG. (3) **Personal-account value funnel (Chase + Alice)** — both inside the homeschool groups; gf posts one high-value giveaway on the week's hot topic, conversation moves to DMs, value delivered first, waitlist link as soft follow-up. (4) **UGC affiliate (planned, blocked on the MVP existing)** — find moms who already believe, app shown 3-5s of natural use (not a pitch), soft CTA in the description, their affiliate link = 20% off (first 3mo only) + 20% creator fee; zero upfront promo spend. (5) **YouTube (planned)** — AI homeschool content with Sprout as the channel sponsor. Warm parent conversations run alongside for value-validation (not site iteration). gf is now a genuine collaborator on the distribution side.

  **Sprint day-12 update (2026-06-03):**
  - **Lane 3 (FB groups) is the strongest signal in the stack so far.** Alice's first post in the groups → 50 inbound DMs, 30 in 24h. **Day-14 update (2026-06-04):** one of Alice's FB posts now has 100+ comments. Freebie distributed to ~60 people across the inbound. Reach + interest still high. One group declined the original post (admin friction). Cadence refined to **one big high-value post per 3 days** — bigger, less spammy, less likely to trip admin filters. Alice is joining more groups in parallel to multiply post surface area; next big post in 3 days. **First two Sprout-specific conversion signals landed within 24 hours of the back-end push going live (2026-06-04):**
    1. **Nanette Zikan** — 74yo grandmother caring for her daughter + 3 grandchildren with complex medical/neurological conditions (AuDHD, CPTSD, diabetes, selective mutism, Tourette's, EDS POTS PDA, endometriosis). Unprompted DM: "These apps are sounding like a dream for me. I have been feeling overwhelmed." Heading into medical urgency so may be unreachable for a few days.
    2. **Second mum (AU, Blacktown area)** — different demographic, same wound. Son with PDA + AuDHD + PTSD profile, long school-refusal history, tried multiple school placements (local HS, ED hub, Blacktown youth college) that all imploded. Both her son and sister dropped out. Now forced to register for homeschool. Her words: *"Hoping these will ease my anxiety. Then I can focus on how and what he learns"* — she used Sprout's wedge phrase unprompted. Also explicitly named the product loop: *"Helping me recording learning opportunities and recognising learning opportunities."* The AU compliance-pain wound is sharper than CLAUDE.md has been treating it (latent benefit only).
    **The pattern is repeating, not a one-off.** Two signups within 24 hours, different demographics (grandma + mum), same wound, both used Sprout's vocabulary unprompted. The funnel is validated. Worth noting Nanette referred to Chase as "your brother" — DM senders are reading Alice + Chase as siblings, not a couple. Doesn't matter for replies, just intel. Alice replying personally to both + asking what other resources they'd want, plus a soft prompt to share the Sprout link with others in similar pain.
  - **New lane added: "Homeschool with Charlie" faceless IG.** Free-PDFs-better-than-the-paid-ones play — competitors sell PDFs, Charlie gives 10x more value for free. Trust-build first, then plug Sprout, then plug Sprout affiliate as income for moms asking "how do people afford to homeschool?" Warming up now, rollout next week.
  - **New lane added: Family network (mom + nana).** Both have homeschool reach. Chase is activating both this week — informal warm intros, soft waitlist push.
  - **Lane 4 (UGC affiliate) groundwork in progress.** Cold-creator list compiled (<30k follower niche, with contact emails). A 10-min "creator block course" is in build — onboarding resource so signed-up creators know how to naturally weave Sprout into their content. Both fire post-MVP.
  - **Lane 1 + 2 (Sprout IG/TT + FB Page)** still warming. 14 IG posts shipped, 6 drafts queued. Same on TikTok. FB Page auto-cross-post from IG live. Reach throttled by algos still warming. TikTok blocked from converting until 1k followers (no link-in-bio). **Founder hypothesis (2026-06-04):** the branded-account look (profile pic, name, bio all on-brand) may be triggering algorithmic soft-throttle pushing him toward paid ads — part of why he's keen to get Charlie (faceless, non-branded) live as a parallel organic lane.
  - **Lane 5 (YouTube) — concrete plan now, queued for ~2 weeks out (~mid-June, post-MVP).** 5-10 minute educational kids videos. Sprout is the **self-sponsor** (no out-of-pocket partnership cost, full creative control): 30-sec baked-in Sprout ad per video + Sprout link in description. Each long-form video gets clipped into Shorts for multi-surface distribution. Why YT now: kids ed is a fast-growing niche, the parent (Sprout's buyer) is in the room when the kid watches, and self-sponsorship turns a channel into a permanent recurring promo slot.
  - **New lane 8: Meta paid ads — concrete plan, gated on MVP-shipped + working A→Z.** Format: 10-15 static creatives (cheaper to produce + iterate than video, faster to A/B, clearer to call out ICP + pain point in one frame). Budget: $30-50/day for 1 week (~$210-350 total). Goal: proof of concept on the full economic loop — does cold paid traffic convert through the funnel.
  - **Sprout back-end push now going live** (started in the 2x/week cadence above). The earlier trust-build-only phase has done its work — the 50 inbound from drop #1 established account credibility in the groups. The waitlist landing page is now being mentioned quietly alongside the free value, soft enough to not get flagged by admins. Conversion data on Sprout-specific signal (waitlist sign-ups, paid commitments, "yes I'd pay" responses) will start landing in the next week or two.
- **Landing page job (updated 2026-05-23)**: dual purpose. (1) Concept-explainer for warm contacts ("oh that's the thing"). (2) Waitlist conversion surface for cold TikTok/IG/FB traffic arriving from the 30-day content sprint. Polish should match those two jobs — clear value prop, frictionless waitlist signup — and not exceed them.
- **Pricing status**: **exploratory placeholder, not committed.** The $29/mo number in [`docs/MASTER.md`](docs/MASTER.md) is an anchor for thinking, not a decision. Real pricing gets discovered after warm contacts have felt the thing land — ask "what would you pay?" then, not now. Earlier comparisons to Tinybeans / Day One were treating a placeholder as a decision; ignore that framing.
- **Product framing (updated 2026-05-24)**: stupid simple. One pain (parent can't see what the week added up to + the kid can't see their own work building over time). One output (a navigable per-kid timeline + weekly view, both parent and kid can see). **Fitness-app for homeschool documentation** — Strava / MyFitnessPal / Apple Health pattern: structured logging in, visible accumulation out, no AI synthesis. Not a SaaS platform thesis. Not a curriculum. Not a journaling app. Not a planner — though scheduling, deadlines, and calendar items live inside it. The structural differentiator vs every existing tracker/journal: Sprout doesn't sell or train AI on your kid's data. Privacy is the moat.

### Shipped

- **Landing page** at `hisprout.app` (registered via Cloudflare 2026-05-27, primary on Vercel; deploys auto-trigger from `main` push via Vercel GitHub integration). Voice/copy locked, fake stats removed, 5-star badge removed, "homeschool families" labels aligned across hero/footer/CTA, multi-kid pricing line removed from hero, Step 02 + Step 04 floating cards repositioned off cream phone screen. **Status (2026-05-28): Chase considers the page good enough for both jobs — do not reopen copy passes unprompted.**
- **Mascot** — shipped and live on the site and across marketing. Not a pending item.
- **Distribution accounts live** — Sprout TikTok + Instagram (active, posting; organic follows from reputable people in the niche, though IG isn't pushing posts in-feed yet — 14 IG posts shipped as of 2026-06-03, 6 drafts queued; same on TikTok), Facebook Page (auto-cross-post from Sprout IG), plus Chase's + Alice's personal accounts inside homeschool FB groups (Alice's first drop yielded 50 inbound, 30 in 24h). **New: "Homeschool with Charlie" faceless IG account** (started 2026-06-02, free-PDFs-better-than-paid play, rollout next week). Alice is a genuine collaborator on distribution.
- **Brand voice rules** documented in [`docs/MASTER.md`](docs/MASTER.md) and [`docs/BRAND.md`](docs/BRAND.md).
- **`sprout-truth` skill** (lives in `~/.claude/skills/sprout-truth/`, not committed to repo):
  - `quote-bank.md` — ~25 verbatim quotes, ~13 cross-verified AU + ~5 cross-verified US. Anchors: Charlene Hess (Hess UnAcademy, US), Jenna Galley (Mum Central, AU), Louise (School Can't Australia, NSW), Sara (Australian Homeschool Stories Podcast, QLD). Gaps: Category 3 (scattered records), Category 4 (registration-officer dread), Category 8 (post-launch reaction) all empty.
  - `audience-truths.md` — primary persona ("the anxious-but-committed mum"), niche segments, channel truths, research-pending list.
  - `language-inventory.md` — avoid/use vocab, SaaS-marketing register vs forum vernacular, AU/NZ register markers.
  - `voice-and-positioning.md` — five voice rules with reasoning, positioning frame, structural responses to strongest critiques.
  - `cult-mechanics.md` — the stand / manifesto vocabulary; the operational filter drafts run through.
  - `playbooks/` — facebook-static-post, facebook-group-engagement, instagram-caption, instagram-carousel, email, landing-copy.

### Not shipped (status updated 2026-05-28)

- **The product (thin MVP now in-flight, target end of this week — 2026-06-03 update).** Codebase is still landing-page-only (some Supabase scaffolding present, no working app interior yet). Shipping has been delayed by content + Alice's FB lead-magnet rollout taking the time; both are now in motion so MVP becomes the next critical path. Once shipped, unblocks the UGC lane (creators need something real to film) and gives warm contacts something to actually use. Distribution-driven, not polish. The fence: ship a usable thin slice, don't gold-plate it.
- **Customer conversations (in motion, no longer zero).** 20+ parents DM'd, 10+ shown the site. Reactions warm but surface-level ("omg yes, love seeing someone help the community"; the new-ideas crowd responds well). No "yes I'd pay" yet — deliberate: Chase gives value first, doesn't chase the sale. No deep interviews or paid commitments yet.
- **Founding members / revenue.** None yet. Stretch goal (~10 at $29/mo) unchanged; not the focus.

### Locked decisions (do not relitigate without strong evidence)

- **Audience (updated 2026-05-28, US pivot)**: US-default now. The affiliate/creator growth engine is US-led, so the customer base skews US; voice writes to the US homeschool mom (mom not mum). AU/NZ was the earlier beachhead, superseded by the US creator motion. Deeper localization (AU regional texture, the record-of-learning bodies, the AU verbatim-quote leads on the landing) is a follow-up content pass.
- **Wound**: parental anxiety ("am I screwing my kid up?"), never curriculum.
- **Mechanic (updated 2026-05-24)**: voice/photo/text inputs + calendar/scheduled-activities/deadlines across the week → app auto-compiles into a per-kid timeline + weekly view → both parent and kid can see it accumulate. **No AI synthesis in the app loop.** No data sold, shared, or trained on. Fitness-app pattern (Strava / MyFitnessPal / Apple Health) applied to homeschool documentation. The earlier "Sunday-night AI-generated report" mechanic is retired — the weekly view IS the timeline, accessible any time, naturally surfaced as a weekly view.
- **Pricing structure** (locked): flat per family, not per kid. **Hard paywall** (updated 2026-06-03 — pivoted from the earlier 7-day trial model; onboarding now does the selling, user pays upfront). First weekly report unlocked + watermarked + yours-forever even if user cancels. **The specific price number is NOT locked** — see Operating context above.
- **Voice (updated 2026-05-28)**: US English (mom not mum, math not maths), no em dashes ever (founder's hard rule), no exclamation marks, no SaaS jargon, no emojis-as-decoration, founder voice / lowercase energy. **One well-placed swear permitted** (anchored to verified-corpus "shit"/"eff" — Jenna Galley, Mum Central AU); stronger swears need attributed mum-verbatim before use in Sprout's voice. **"Artifact" is retired vocab (2026-05-28, founder's call):** Sprout is a movement, not a formal/corporate product — never use "artifact" in copy or internal framing; say "the timeline," "your week," "what they built," "the thing." Register runs warmer/plainer/more rallying, less SaaS-formal.
- **Scope fence (updated 2026-06-03)**: no curriculum, no lesson plans, no compliance positioning (rego-officer use is latent benefit, not headline), no native mobile app (web responsive), no community features, no AI synthesis in the app loop, no data sold or shared or trained on. **Calendar, deadlines, scheduled activities, kid-facing visual view, streaks + gamification + progress rings are IN scope** — accountability mechanics are working across the consumer-app category (Duolingo, Strava, MyFitnessPal, Apple Health). The fitness-app pattern Sprout is built on requires these mechanics to drive retention. Kid-facing view accessed from parent's session for now (separate kid logins TBD, not blocked). The earlier "no streaks/gamification" fence from 5/24 is retired.
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

**Newly-noted competitors (2026-06-03, from founder market scan):** Finch and Homeschooly — both App Store apps that homeschool moms in the forum / FB-group conversations are recommending. Founder read: this is market validation, not threat — *"people are starting to use platforms to find what works, I'll own distribution and positioning and scale tf out of this."* The competitive posture is distribution-and-positioning-first, product-feature-second.

The bear case still stands (behaviour-adoption unproven, wallet unvalidated, founder distribution problem mitigated by warm-contact motion). The variance shape is different now: less Cal-AI moonshot, more durable niche-leader with a structural privacy moat. The honest tradeoff: fitness-app behaviour adoption depends on either passive sensors (which Sprout doesn't have) or a strong reflection-habit (which Sprout has to build via UX). That's the load-bearing risk to watch.

**Founder time horizon (logged 2026-06-03):** 12-month commitment. Personal draw ~**$3k/mo** to cover NZ living baseline (food, transport, basic costs). Operating expenses (Apple Dev, App Store fees, Stripe, Supabase, email service, Vercel, Meta ads test budget, etc.) are treated as biz expenses. **Everything beyond the $3k draw + op costs gets reinvested back into doubling down on the lanes** (distribution, MVP, paid ads, creator program). Stated goal: *"Sprout will be a homeschool household name."* This is the runway / patience posture that frames every operating decision below.

### Honest viability read (last full read 2026-05-20; sprint day-12 update 2026-06-03)

**Founder's stated read (2026-06-03): 8–8.5/10.** Reasoning: Alice's FB lead-magnet system is producing real inbound (50 in 24h from her first drop), Sprout brand accounts are shipping daily content, MVP is days away, multiple lanes are coming online (Charlie faceless IG, family network, creator outreach list). Confidence high, mood high, "lots of moving parts but the play feels right."

**Co-founder note (2026-06-03):** the structural validation gates from 5/20 are still open — willingness-to-pay, behavior-adoption, founder-in-niche, and the core wound (parental anxiety) all remain unproven by hard data. What's new and real: Lane 3 has live demand for a homeschool-affordability lead magnet (50 inbound on Alice's first drop). The Sprout-specific conversion test is intentionally pending — the trust-build phase comes first to avoid admin flags. So the gates haven't closed, but the next test is now well-positioned. The honest watch-item once the Sprout push goes live: does Sprout-specific signal (waitlist sign-ups, paid commitments, "yes I'd pay" responses) actually show up, or does the inbound stay attached to the freebie/affordability wound? That's the load-bearing read.

The original 2026-05-20 read for reference:

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

**Progress (as of 2026-06-04, ~day 14):** **Two Sprout-specific waitlist signups landed today within hours of each other** — (1) Nanette (74, grandmother caring for daughter + 3 grandkids with complex medical needs), (2) AU mum (Blacktown area, son with PDA + AuDHD + PTSD + multi-school-failure history). Both came in via Alice's FB funnel, both wrote unprompted DMs using Sprout's exact wedge language ("ease my anxiety," "this is a dream for me," "recording AND recognising"). The Sprout conversion test cleared and the pattern is repeating, not a one-off. Waitlist ~6 now (up from 4 since 5/28). 14 IG posts on Sprout brand + 6 queued, same on TT, FB Page auto-cross-posting · IG/TT reach throttled — founder hypothesis: branded-account look triggering soft-throttle toward paid · **Alice's FB groups: ~60 freebies distributed across multiple posts, one post hit 100+ comments. First Sprout-specific signup from the back-end push landed 2026-06-04.** Next Alice post in 3 days, joining more groups to expand surface · Charlie warmup at day 3 (warmup doc at ~/Downloads/sprout-instagram-warmup-guide.md, on track), Charlie first post in ~6-7 days · cold-creator outreach list compiled + 10-min creator onboarding course in build (both gated on MVP) · MVP target end of week · family network (mom + nana) activating · YouTube still stagnant. Monday routine handles weekly accountability.

**The weekly work** (held accountable via the Monday check-in routine — see Routines reference below):

1. **Sprout TikTok + IG**: organic posting (niche memes swung Sprout's way + typographic carousels), pointing at the waitlist. Volume ramping as the accounts warm; links/DMs throttled to avoid fresh-account flags.
2. **Facebook — value-drop, not daily grind (refined 2026-05-28).** NOT grinding daily group activity. Textbook play: one high-value post per week on whatever the groups are stuck on, delivered via Chase's + gf's personal accounts, then move on. Quality over quantity. Supersedes the earlier "build genuine daily presence" framing.
3. **Parent conversations**: showing the site to real homeschool parents, capturing what they actually SAY — quotes, not vibes. Value-first, not chasing the sale.
4. **UGC affiliate (once the MVP exists)**: mums who already believe → natural 3-5s app use in their videos → affiliate link (20% off first 3mo + 20% creator fee). No upfront spend.
5. **YouTube (planned)**: AI homeschool content, Sprout as the channel sponsor.

**Priority ladder (Chase's stated order):** trust + distribution → refinement → LTV. Margins don't matter for the first ~3 months — the discount/fee generosity is deliberate; get people using it, optimise the economics later.

**The binding constraint** is not landing-page polish or product-code-beyond-the-thin-MVP. It is: posts shipped, parents shown the site, waitlist count climbing.

**Monday check-in routine**: `trig_01LW9mZkr44UfMEWq9Qd1APf` — fires every Monday 9am NZST with a structured accountability report (pro-rata targets, self-report checklist, honest flags, one-thing-this-week). Disable around 2026-06-22 when the sprint ends, or extend if Chase keeps scaling. URL: https://claude.ai/code/routines/trig_01LW9mZkr44UfMEWq9Qd1APf

**The earlier concierge-MVP-with-5-families plan is superseded** by this sprint. The validation motion has shifted from "5 mums experience a manual PDF for 4 weeks" to "1,000 waitlist signups + verbal value-feedback from warm parent conversations + post-launch conversion data." Different bet, deliberately taken.

### What NOT to do next (procrastination-as-progress patterns to flag)

- More landing page copy passes — Chase considers the page good enough for both jobs. Don't reopen it unprompted.
- More brand polish / more glassmorphism tuning.
- **Gold-plating the MVP.** A thin MVP is now sanctioned (it unblocks UGC) — but ship a usable slice; don't disappear into building the full app interior before the waitlist + UGC motion prove out.
- More quote bank mining / research-skill building beyond what a live content task needs.
- Cold extraction DMs masquerading as engagement — the FB play is one genuine high-value post per week, not spammy outreach. If it feels like spam, it is.
- Anything that lets Chase do visible craftwork in CC instead of (a) shipping content, (b) showing the site to real parents, (c) growing the waitlist, (d) shipping the thin MVP.

**Note (2026-05-28):** the earlier blanket "don't build any product code" line is relaxed — a thin MVP is now on the critical path *because* it unblocks distribution (UGC). Spirit unchanged: don't build product as procrastination; build only the slice the distribution motion needs.

All of the above are downstream of the 30-day sprint. None of them get Chase to 1,000 waitlist signups or a real parent feeling the thing land.

**Note on content generation in CC**: content drafts (FB posts, IG captions, video hooks, emails) are no longer flagged as procrastination — they're directly upstream of the 42-posts/week target. Help when asked; help well. The `sprout-truth` skill is the source of truth for voice.

### Deferred for next visual pass (when one happens)

Items deliberately noted and skipped during this session — out of scope for copy-only work, queued for whenever real photography / illustration enters the picture:

- **Photo or illustration of parent + kid + printed report on a kitchen table** — the highest-leverage way to land the shared-pride beat. The page currently carries this through the Friday-afternoon scene + Feature 3 bullet + FAQ #4 (verbal/textual), and that's enough — but a real visual would do more than another paragraph could. Surfaced 2026-05-24 when proposing a third narrative scene; explicitly chose visual-future over copy-now.
- **Real human imagery generally** — the page is 100% SVG / glassmorphism / typography. No actual humans, no actual kids, no actual printouts or timelines in real environments. A future visual pass could selectively introduce one or two on-brand photographs without breaking the design system.
