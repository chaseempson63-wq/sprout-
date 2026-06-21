# Sprout Resources — Platform Vision & Roadmap

Status: vision / pre-build spec. Source: Chase's roadmap (2026-06-21), refined by CC.

Read [`MASTER.md`](MASTER.md) and [`BRAND.md`](BRAND.md) first. Where this touches a locked decision, the reconciliation is spelled out under "Where this sits against locked decisions."

---

## What this is

Sprout is two products in one ecosystem:

- **Sprout Journal** (mobile app) — captures what a child *has* learned. Documentation, photos, timeline, weekly view, reports. Retrospective. Answers "did this week count?"
- **Sprout Resources** (web platform, this doc) — helps a parent create and decide what the child learns *next*. AI resource generation, a growing library, eventually a creator and tutor marketplace. Prospective. Answers "what should my child learn next?"

Journal captures what was learned. Resources determines what's next. Together they are a homeschool operating system.

---

## What changed from the source roadmap (so you can veto)

1. **Positioning leads on the journal connection, not generation.** Standalone AI generation is commoditized (see The Moat). V1 is framed as "resources tailored to your child," with the journal tie-in as the structural moat, pulled as close to V1 as feasible rather than parked as a later add-on.
2. **Privacy promise restated precisely** so "Generate from Journal" reinforces the moat instead of breaking it: no training, no selling, no sharing. Not "AI never touches your data." Detail under Privacy.
3. **Product separation made explicit** so Resources never leaks curriculum features back into the Journal (which has a locked no-curriculum fence).
4. **Naming:** the mobile app is referred to here as **Sprout Journal**. Confirm if that's the public name.

Everything else is Chase's roadmap, lightly cleaned.

---

## Core mission

Enable any homeschooling parent to create high-quality educational resources tailored to their specific child in minutes, by age, level, interests, subject, and objective. Every resource is Sprout-branded and feeds the ecosystem's value.

Instead of searching thousands of generic worksheets, the parent generates exactly what they need.

---

## The Moat (read before building)

The AI generation itself is **not** a moat. As of 2026 a parent can get a themed worksheet free from ChatGPT, and a dozen funded tools do exactly what V1 describes (MagicSchool, Diffit, Twinkl AI, Education.com, Khanmigo). Demand for AI-generated resources is mostly already validated and already served.

The one thing those tools cannot copy is **generation from the child's own documented history**: "make next week from what my kid actually did." That requires the Journal. So:

- **V1** personalizes from what the **parent types** (age, interests, level).
- **Generate from Journal** personalizes from what the **kid actually did** (pulled from Journal entries).
- The moat deepens as the Journal fills.

This is why Generate-from-Journal is core to the thesis, not a post-V1 nice-to-have. Position even V1 around "tailored to your child," and treat the journal connection as the fast-follow that automates the personalization.

---

## Privacy: how Resources keeps the moat intact

Sprout's moat is privacy. Resources sends data (a child profile, and for Generate-from-Journal, journal content) to an AI to generate. The promise must be stated precisely so this holds:

- **No training.** Sprout never trains models on user data, and uses a provider (Venice AI) chosen because it does not train on inputs.
- **No selling, no sharing.**
- **Processing is per-task and transient.** Data goes to the generator for one generation and is not retained by the processor.
- **Opt-in.** Generate-from-Journal reads journal content only when the parent asks.

Stated this way the feature is a *sharper* moat, not a breach. "AI that reads your kid's journal without ever training on it" is exactly what an LLM-memory competitor cannot credibly offer, because their value depends on training.

This is the positioning change [`MASTER.md`](MASTER.md) anticipated ("if that ever changes, it's a positioning decision, not a technical one"). This is that decision, made deliberately.

---

## Where this sits against locked decisions

- **"No AI synthesis / no LLM in the app loop"** governs **Sprout Journal**. Resources is a separate product and is explicitly an AI generation engine. The two stay separated: the Journal organizes and visualizes and never generates; Resources generates blank resources and never alters or synthesizes the documented timeline.
- **"No curriculum, no lesson plans"** governs **Sprout Journal**. Resources deliberately enters the resource and lesson-plan space. The fence stays on the Journal so it does not bloat into a curriculum app. One bright line between the two products.
- **Audience:** homeschool is the beachhead. The ecosystem expands to all parents later (see [ecosystem vision]).

---

## Library: personal vs shared (do not conflate)

- **Personal library** — a user's own saved and generated resources, download history, favorites. Private.
- **Shared / community library** (V2) — generations that become publicly searchable. This is the UGC flywheel and the SEO / acquisition surface.

Moderation, quality, and copyright stakes apply **only** to the shared library. Auto-publishing user generations into a Sprout-branded public library is a brand and copyright liability (homeschool printables are full of lifted IP). It needs a gate: curate-after-check, rating-based surfacing, or "shareable by link immediately, into the public library after a check."

---

# Version 1 (0 – 2,000 users) — the generation engine

**Objective:** validate demand for child-tailored AI resources. Build the engine, not a big library.

## User experience

Parent logs into Sprout Resources and is greeted with: "What would you like to create today?"

Categories: Math Worksheet · Reading Comprehension · Writing Prompt · Science Activity · Unit Study · Lesson Plan · Project-Based Learning Activity.

## AI resource builder

Parent enters: child age, subject, topic, interests, difficulty level.

Example: "My daughter is 8, loves horses, and is learning multiplication."

AI generates: worksheet, activities, questions, discussion prompts, extension tasks. Displayed instantly.

## Resource actions

Download PDF · Save to Library · Edit Resource · Regenerate Resource.

## User dashboard

Saved Resources · Recent Generations · Download History · Favorite Resources.

---

# Version 2 (2,000 – 10,000 users) — self-growing ecosystem

**Objective:** create a self-growing resource ecosystem.

- **Smart resource library:** every generated resource becomes searchable, auto-categorized by age, subject, difficulty, topic. The library grows through user activity (gated per the shared-library moderation note above).
- **Recommendations:** based on previous downloads, child age, subjects studied, parent behavior.
- **Journal integration (the moat feature):** Journal and Resources share data. Journal shows the kid finished fractions and likes dinosaurs; Resources suggests dinosaur multiplication worksheets and fraction practice. Per The Moat, bring the child-context personalization as far forward as feasible.
- **Resource collections:** parents bundle resources into weekly learning packs, monthly plans, unit studies.

---

# Version 3 (10,000 – 50,000 users) — content marketplace

**Objective:** transform Sprout into a homeschool content marketplace.

- **Creator program:** verified educators (teachers, tutors, curriculum designers, subject experts) contribute resources to the marketplace.
- **Revenue sharing:** creators get a percentage of sales. Sprout handles hosting, discovery, payments, distribution. (Ties to the existing affiliate program, see [`AFFILIATE.md`](AFFILIATE.md).)
- **AI-assisted creation:** creators use AI tools to build faster, expand materials, generate curriculum variations.
- **Premium collections:** curated packs (e.g. Year 1 Science, New Zealand Curriculum Packs, Reading Mastery Programs, Unit Study Bundles).

---

# Version 4 (50,000+ users) — homeschool operating system

**Objective:** become the central operating system for homeschooling families.

- **Tutor marketplace:** parents search tutors, subject specialists, coaches, consultants. Profiles with expertise, availability, pricing, reviews.
- **AI learning assistant:** a child-specific assistant aware of learning history, interests, previous activities, progress. Helps generate personalized recommendations. (Privacy promise above applies in full.)
- **Curriculum planning:** annual, quarterly, weekly plans, AI-generated.
- **Learning analytics:** subjects covered, learning consistency, resource usage, educational gaps.

---

## Subscription tiers

- **Free** — basic resource library + limited AI generations. Open to anyone. This is the top-of-funnel acquisition surface: free generations pull non-subscribers toward the Journal app (product-led growth).
- **Sprout Subscriber** — included with the Sprout Journal subscription. Increased generation allowance, resource saving, PDF exports.
- **Pro** — unlimited generations, advanced customization (including removing Sprout branding), priority generation. Aim Pro at the creator / tutor / commercial user, not as a second charge on the parent who already pays for Journal. (Free outputs keep Sprout branding on purpose, because the branding is the marketing.)

---

## Technical stack

- **Frontend:** Next.js + React (App Router). NOTE: per [`AGENTS.md`](../AGENTS.md), this Next.js has breaking changes from training data. Read `node_modules/next/dist/docs/` before writing any code.
- **Backend / Auth / DB:** Supabase (PostgreSQL + Supabase Auth). Share one account system with Sprout Journal so a user has one identity across app and web. Entitlement (free / subscriber / pro) resolves from RevenueCat as the single source of truth, not from emailed access links.
- **AI:** Venice AI (chosen because it does not train on inputs, which is what the privacy promise depends on).
- **PDF generation:** reuse the existing headless-Chrome html-to-PDF pipeline (already working from the freebie work) rather than building a new renderer.
- **Hosting:** Vercel.

---

## Open decisions (not locked)

1. **Moderation / curation gate** on the shared library (copyright + brand). Required before any auto-publish-to-public mechanic ships.
2. **Pro vs Subscriber boundary.** Aim de-branding + unlimited at commercial users; don't nickel-and-dime the core parent.
3. **Public logged-out browse + free generation** as the acquisition funnel: how much is usable before a login wall.
4. **Naming** (is the app's public name "Sprout Journal"?).
5. **Build sequencing.** Vision is locked. Build Resources after Sprout Journal ships on the App Store, not in parallel, to protect solo-founder bandwidth.

---

## Long-term vision

The goal is not a worksheet website. It's the platform where homeschooling families document learning, generate resources, discover resources, purchase resources, hire tutors, plan curriculum, and track progress, in one ecosystem.

Sprout Journal captures what has been learned. Sprout Resources determines what should be learned next. Together they are a complete homeschool operating system.
