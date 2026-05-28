# Sprout — Affiliate / Creator Program

> **Status:** design v0 (2026-05-28). Living doc — open decisions flagged below.
> Most-leveraged of the 5 acquisition lanes: other people's audiences, ~$0 upfront, compounds. Blocked on the MVP existing (creators can't film an app that doesn't exist) — MVP targeted ~next week.

## The model (locked-ish)

- Mum creators show **natural 3-5s usage** of Sprout in their content (not a hard promo) → soft CTA in the description → link in bio → their affiliate link.
- Deal: **20% off for the buyer (first 3 months)** + **20% commission for the creator.**
- **Zero commitment for creators (locked 2026-05-28):** no required posting cadence or quota — they share as much or as little as they want. Commission vests: if they stop promoting, they still get paid the remainder of the 12-month term on every subscriber they already referred. The only obligation is Sprout's — pay them on time. (Page states the no-commitment + vesting part; the "pay on time" obligation is internal, not on the page.)
- Optimising trust/distribution over margin for ~3 months (priority ladder: trust + distribution → refinement → LTV).

## Positioning: "side-hustle mama" (the sharp bit)

Homeschool mums / homesteaders **already** push affiliate links (Amazon books, gear, "use my link"). Pitch Sprout as a **recurring passive-income stream** on a product they actually use, that also gets their followers a real discount. They're already hustlers — this is a better link than the Amazon ones (recurring vs one-off, a product they believe in).

- Needs its **own recruitment page** + its **own voice register** — an opportunity pitch, NOT the anxious-mum wound voice. (The `sprout-truth` skill is tuned for the customer-mum, not the partner-mum. Still AU/NZ, still no-slop, but a different job.)

## Architecture (decided — do NOT rebuild from scratch)

- **Web-first payment (the Spotify play):** mum's link → web signup page → Stripe checkout (20% coupon auto-applied) → account created → "download the app + log in" → onboarding continues. **Apple never touches the transaction → no 30% App Store cut.** Keep the app a pure "log into an existing account" experience; never nudge to web-pay from inside the app (Apple compliance line).
- **Affiliate tracking: off-the-shelf.** Stripe + one of PromoteKit (free tier) / Tolt (~$49/mo) / Rewardful ($49/mo). All handle unique links, auto-applied discount, commission tracking, payouts, and a creator-facing dashboard. Do NOT have CC build affiliate infra from scratch — that's rebuilding $0-49/mo software and owning the bugs forever. Edge is distribution + copy, not maintaining affiliate plumbing.
- **First ~10 creators:** manual links + a spreadsheet. Don't buy the tool until the channel's proven.
- **CC's only real build job:** the **login-gate** — app checks account status on login (active sub → in; no account → "sign up at [url]"). Small, well-defined, not a new codebase.

## Open decisions (need locking)

1. **Commission duration — DECIDED 2026-05-28: 20% recurring for 12 months** per referred subscriber (not lifetime, not 3mo-capped). The "20% off" applies to the buyer for their first 3 months; the creator earns 20% of every payment that subscriber makes for a full 12 months. That recurring-for-a-year structure is what makes the "side hustle that keeps paying" pitch honest vs a one-off Amazon link. (Recruitment page now live at `/partners`, linked from the footer.)
2. **Tool pick.** Start PromoteKit (free) to prove it; or Tolt if the branded mum-dashboard matters for recruiting early (it probably does — it's part of the "passive income machine" feeling).
3. **Economics / expectation-setting** (below) — pitch "compounds over months," not "couple grand fast."
4. **Disclosure.** Creators must disclose affiliate/#ad (AU ACCC / general). Bake it into the creator guidelines so the program doesn't create compliance headaches.
5. **Recruitment-page voice** — its own register (see Positioning).

## Economics reality (so creators aren't over-promised)

At $29/mo, 20% commission ≈ **~$5/mo per active referred subscriber** (≈$4.64 during the 3-month discount window, ~$5.80 after).

| Active retained referrals | Creator/mo (recurring) |
|---|---|
| 50 | ~$250 |
| 100 | ~$500 |
| 200 | ~$1,000 |
| 400 | ~$2,000 |

- "A couple grand a month" needs **~400 retained paying subs** from one mum — achievable for a strong creator, but it **builds over months and only if commission is recurring + churn is low.** Pitch as a compounding stream, not instant money. Over-promising "couple grand" to a mum who then makes $150 burns the exact trust this channel runs on.
- For Sprout: cheap, compounding CAC — commission paid only out of real subscription revenue. Sustainable at 20% recurring if retention's decent. Far cheaper than paid ads.

## MVP wedge — flag

The 2026-05-28 dump described the MVP as *"parent inputs weekly recap → gets a learning report back."* Heads up: **"gets a learning report back" is the retired AI-generated-report model.** The locked pivot is the timeline / weekly-view, **no AI synthesis in the app loop.** Decide consciously — is the MVP the navigable timeline + weekly view (current model), or are you reintroducing a generated report? Not blocking; just don't let it drift back by accident.
