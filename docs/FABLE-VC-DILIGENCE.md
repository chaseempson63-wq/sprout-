# Sprout — VC diligence memo

Written 2026-07-04 by Claude (Fable 5), wearing the hat Chase asked for: a skeptical VC and quant doing real diligence before a check. Sources: both codebases at HEAD (web `dcffa25`, iOS `7aee485`+), CLAUDE.md, MASTER, BRAND, RESOURCES, the handoff, the memory index, and the last 30 commits. Everything dated. Where a doc and the code disagreed, I used the code. This memo is deliberately unkind in places; that is the job. The co-founder view (what to build, how to fix) lives in FABLE-AUDIT.md. This is the money view.

---

## 1. The one-paragraph read

Sprout is a pre-revenue, pre-launch consumer subscription with unusually strong craft and unusually weak proof. The founder ships product faster and at higher quality than most funded teams, has real qualitative wound validation (target customers describing the product in its own vocabulary, unprompted), and has built two coherent products plus a distribution thesis. Against that: zero paying customers ever, an App Store submission that has slipped roughly a month past "end of this week," a 30-day sprint that targeted 1,000 waitlist signups and delivered about 6, the strongest acquisition lane orphaned when its operator left, a hard-paywall price point with no willingness-to-pay evidence behind it, and a community whose visible activity is largely manufactured. I would not write a venture check today. I would consider a small founder-bet angel check the week the app is live with even a handful of organic paid subscriptions. Section 7 has the terms.

## 2. What genuinely works (real, verifiable)

1. **Execution velocity and quality.** In roughly six weeks, one founder plus AI tooling produced: a complete iOS app (~12k lines, capture/recap/goals/paywall/RevenueCat wired, near-zero dead code), a live web platform (worksheet generator with deterministic fallback, 86-asset illustration system, slideshow generator, community with posts/comments/votes/follows/moderation/rate limiting/kill switch), a landing page, an affiliate page, and App Store creative. The defensive engineering (graceful degradation everywhere, honest fallbacks) is senior-grade. Whatever else is true, the build function is not the bottleneck.
2. **Qualitative wound validation.** Two unprompted DMs in 24 hours (2026-06-04) used the product's exact framing before seeing it: "hoping these will ease my anxiety, then I can focus on how and what he learns" and "recording AND recognising learning opportunities." A 40-comment FB thread produced a public stranger (Linda Kimpton) pitching the mechanic in her own words. This is the correct early signal and it is real. It is validation of the wound, not of the wallet.
3. **Audience-language discipline.** The quote bank, banned-vocabulary lists, and voice pre-flight are the kind of marketing infrastructure most seed-stage consumer companies never build. Copy that reaches the audience sounds like the audience.
4. **The privacy stance is structural, not copy.** The app is genuinely on-device; private web data genuinely never leaves the browser. Competitors backed by ad networks or LLM training loops cannot cheaply copy the posture.
5. **The free-tool funnel exists.** hisprout.app/resources is a real, working, free product in a category (printables) with enormous evergreen search demand. As a top-of-funnel asset it is unusual for this stage. As of today it is an unaimed asset (see 3.4).

## 3. What's broken or fragile

1. **The launch has slipped ~4 weeks and counting.** "MVP end of this week" appears in the record from early June. Today is July 4: no App Store submission, no TestFlight cohort, no listing. The single hard blocker for the entitlement chain (one Sign-in-with-Apple device run) has been pending founder action since ~2026-06-23. Meanwhile the repo shows where the energy went: a full web redesign, two App Store card sets, landing reshuffles, a slideshow generator, community polish. Every one of those is downstream of an app that isn't shipped. CLAUDE.md itself names this pattern ("procrastination-as-progress... visible craftwork in CC instead of shipping"). The docs know; the calendar doesn't.
2. **Distribution regressed.** The one lane with demonstrated pull (personal-account FB value posts, 50 inbound DMs, 100+ comment posts, both real signups) was run substantially by Alice, who left the project 2026-06-21. Nothing in the record shows that lane replaced at volume. Brand TikTok/IG were algorithm-throttled as of last reading; YouTube "stagnant" by the founder's own log; UGC affiliate and paid ads are correctly gated on the app existing. Net: the acquisition machine is weaker today than it was on June 4.
3. **The sprint metric was missed by two orders of magnitude.** 30-day target (2026-05-23 to 06-22): 1,000 waitlist signups. Delivered: ~6. The two quality signals are genuinely more valuable than 500 junk emails, and the freebie-first sequencing was deliberate. But a 0.6% attainment on the company's only self-set public number is a governance fact a diligence process cannot wave off, and the postmortem discipline (what replaces the sprint?) is absent from the record.
4. **The free funnel has no capture and no end.** Resources has no email capture, no account, and until the app ships, "snap it into the Sprout app" points at nothing installable. Every Venice generation costs real money and ~26 seconds; the visitor leaves with a PDF and no thread back. A cost center that manufactures goodwill and zero addressable contacts.
5. **Manufactured traction is a live integrity risk.** The community's 72 worksheets, the maker profiles with names/avatars/bios, the follows, chat threads, and the landing page's "just joined" ticker are seeded, i.e., invented. This is on the record as a deliberate growth call, and seeding empty rooms is an old playbook. But this brand's core claim is "we're the honest ones, the tech giants lie to you," the FAQ says "we're parents building this for parents" (the founder is neither), and the paywall dangles "a $197 resource builder, free" where $197 is an invented anchor for a tool that is free on the open web, made by the same company. Any single one of these is survivable; the stack of them is a loaded gun for the first sharp journalist, competitor, or community moderator who asks "who is Aroha, exactly?" For a privacy-and-honesty brand, this is the kind of thing that doesn't degrade the asset, it detonates it.
6. **Key-person concentration is total.** One founder does build, content, distribution, and ops, in a niche he does not belong to demographically (NZ-based, non-parent, non-homeschooler), with the community-facing warm layer previously outsourced to a collaborator who is gone. The docs' own open question ("can Chase authentically enter these communities?") remains open, and the answer got harder on June 21.
7. **Product contradictions that will surface in reviews.** (a) "Your child's permanent learning record" stored on-device only: a lost phone destroys the permanent record; there is no sync and no backup path in the shipped app. (b) "No AI inside the app, nothing to train on" as app positioning, while the same brand's web platform is an AI generator; defensible with the two-product framing, but one support email away from "wait, so you DO send kids' stuff to an AI?" (c) A hard paywall with zero brand trust at install time is the highest-friction possible first touch for a wallet-unvalidated product.
8. **In-memory rate limiting and a service-role bottleneck** on the community remain unfixed before any promotion push (known, documented, cheap to fix, still open).

## 4. The honest numbers (all of them)

| Metric | Value | Real? |
|---|---|---|
| Paying customers, ever | 0 | real zero |
| Revenue, ever | $0 | real zero |
| App installs / TestFlight users | 0 | app never distributed |
| Waitlist | ~6 (last logged 2026-06-04) | real; target was 1,000 |
| Qualified inbound signals | 2 strong (Nanette, Blacktown mom) + ~8 warm commenters | real |
| Freebies distributed | ~60 (via a funnel whose operator has left) | real, historical |
| FB post engagement peak | 100+ comments, 50 DMs in 24h | real, historical, not repeated since operator left |
| Community worksheets visible on prod | ~72 | **seeded, not users** |
| Community makers/follows/chat | profiles, bios, follows, threads | **seeded, not users** |
| Landing "just joined" ticker | scrolling names | **seeded, not users** |
| IG/TT posts shipped | ~14 + queue (as of 6/03) | real, reach throttled |
| Price point | $29.99/mo, $14.99/wk, $287.99/yr, hard paywall | placeholder, zero WTP evidence |
| "$197 resource builder" anchor | on paywall + App Store card | invented anchor for a free tool |
| Founder runway posture | 12 months, ~NZ$3k/mo draw | self-reported |
| Real ARR needed for founder breakeven | ~NZ$36k + opex, i.e. ~120-150 subs at placeholder pricing | arithmetic |

The quant note: with zero cohorts there is no retention curve, no CAC, no conversion rate, no LTV. Every economic claim in the plan is currently a prior, not a measurement. The only measured funnel to date: 1 FB post → 50 DMs → ~60 freebies → 2 waitlist signups with product-language fit. That's a 4% inbound-to-signal rate on one trial of one channel, operator since departed.

## 5. The bear case, specifically

**Willingness to pay.** The comparison set the customer actually shops: Homeschooly and similar trackers at a fraction of the price, Story Park habits carried from ECE, ChatGPT free, notes apps free, exercise books ~$3. $29.99/mo hard-gated at first open asks a wallet-unvalidated audience to pay therapy-adjacent pricing for a habit product before trying it. The stated justification (three jobs in one artifact) is a seller's syllogism, not a buyer's quote. Nobody in the record has said a number. Bear outcome: conversion in low single digits, price forced down to $9.99 territory, and the 100-subscriber north star now requires 3-5x the users.

**Adoption and retention.** The fitness-app pattern works when sensors log passively. Sprout requires a deliberate parental act N times a week, forever, from the demographic with the least spare attention on earth. The product's own docs flag the sparse-week failure mode ("if the week was thin, the week looks thin") and the open question of open-rate. Homeschool anxiety is also seasonal (review windows, term starts); an annual-spike wound supports lead magnets better than it supports month-eight subscription retention. No cohort data exists to rebut any of this.

**The moat.** Privacy is a conviction moat, not a barrier: it converts the 20-40% privacy-salient slice harder but does not stop ChatGPT-memory, Gemini, or an LMS from being good enough for everyone else, free. The claimed durable moat (generate-from-journal: "make next week from what my kid actually did") does not exist yet; its prerequisite chain (app live → RevenueCat identity → shared entitlement → journal-aware generation) has not cleared step one. On the Resources side, generation is explicitly commoditized (MagicSchool, Diffit, Twinkl, ChatGPT) and the deterministic-fallback quality bar, while real, is not a consumer-visible differentiator. Today the honest moat inventory is: brand voice, build speed, and a privacy stance. All real, all fragile, none priced.

**Distribution.** The thesis is organic-first in closed FB groups where the founder is a non-member demographic and the warm operator is gone; brand accounts throttled; everything else gated on a launch that keeps slipping. The affiliate/creator engine (the actual scale mechanism) needs a shipped app, a working entitlement chain, and creator payouts, none live. Meanwhile Hearth launched into the same AU groups in June with a wife-recruited beta cohort, i.e., a founder who IS the demographic.

**Market.** AU+NZ homeschool is perhaps 60-80k families; realistic obtainable share at premium pricing makes this a fine indie lifestyle business and a weak venture story. The US pivot is asserted (voice changed to US English) but undistributed: no US lane has been run. Venture-scale requires the "all parents, not just homeschool" expansion, which today is one paragraph in an ecosystem doc.

**Integrity tail-risk.** Covered in 3.5. In the bear case it is not a growth tactic, it is the story a competitor tells the Facebook groups the week Sprout launches.

## 6. What I'd change to get this to a fundable 10/10 (priority order)

1. **Ship the app this week. Nothing else.** One SIWA device run, wire `Purchases.logIn()`, submit. Every day of web polish is negative-carry. The audit has said this since July 2; the repo says it hasn't happened. If I were on this board, the only agenda item would be the submission date.
2. **Kill or convert the fake-traction surfaces before launch, not after.** Relabel seeded worksheets "Sprout team picks," retire the invented maker personas, kill or clearly label the ticker, and reword the $197 anchor to something true ("the resource builder, included; others charge for less"). Cost: one afternoon. Value: removes the single existential PR risk before anyone is looking. Traction you can't show a journalist isn't traction, it's liability.
3. **Instrument the wallet question.** Soft-gate an actual price test on the waitlist and warm inbound: 10 real "founding family" offers at $29.99 and at $9.99, and count. Two weeks, near-zero build. The entire company thesis currently rests on an unasked question.
4. **Rebuild the FB lane in the founder's own voice or recruit its replacement.** The one proven channel needs an operator. Options in order of speed: Chase's personal account (already has the Rising Contributor badge), an ambassador mum with founding-member economics, a hired community VA in the demographic. The record shows the playbook works; it shows nobody currently running it.
5. **Put a funnel end on the free tool.** Email capture at the post-print moment plus a weekly pack digest. Resources is the only asset generating stranger goodwill today and it currently forgets everyone it delights.
6. **Fix the permanence contradiction.** Ship the app with iCloud backup (or at minimum an export), or stop saying "permanent record" in marketing. One of the two, before reviews say it for you.
7. **Then, and only then:** durable rate limiting, SSR for the community SEO surface, the retention features, the creator program. All good, all premature until 1-6 are done.

## 7. Verdict

**Would I write the check today? No.** Not at any venture valuation. The company has a validated wound, exceptional build capacity, zero revenue, zero launched product, a self-set traction target missed by 99.4%, a regressed distribution machine, and an unpriced integrity risk sitting on its most defensible asset (the honest-brand position). There is nothing to price except the founder.

**What kind of check, when.** This is a pre-seed founder bet, not a business bet. The moment the app is live on the App Store and even 10 strangers have paid the hard paywall organically, I would do a small angel/pre-seed SAFE, and given the AU/NZ-indie comps and solo-founder key-person risk, I would argue for a cap in the NZ$1.5-2.5M range on a NZ$150-400k round. That is money to buy: the SIWA-to-entitlement chain finished, one paid distribution test, and a community operator. It is explicitly not priced on the seeded community, the $197 anchor, or the ecosystem slide.

**The one thing that would move my conviction:** a live app plus one cohort chart. Specifically: 30 days post-launch, N strangers (not warm contacts) through the hard paywall at a real price, and week-4 capture retention above ~40% for those payers. That single artifact converts every prior in this memo (wallet, habit, price, founder-market fit) from argument into measurement. Everything else Sprout could show me this quarter, including another ten thousand lines of excellent code, moves me not at all.

**The uncomfortable summary for the founder:** you are the best builder in your own company and the most junior distributor, and for five weeks the company has bought more of what it has a surplus of. The wound is real, the craft is real, the clock is the enemy. Ship it.
