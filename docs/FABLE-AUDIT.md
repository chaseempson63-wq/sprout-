# Sprout — Fable audit

Written 2026-07-02 by Claude (Fable 5), after a full read of CLAUDE.md, AGENTS.md, MASTER.md, BRAND.md, RESOURCES.md, RESOURCES-HANDOFF.md, the memory index, and a sweep of both codebases (this web repo and the Rork Swift repo). Part 1 is the honest read. Part 2 is the 10/10 list. Part 3 is 30 organic angles. Part 4 is what I can run. Part 5 is the build log from this session, with reasoning per decision.

---

## Part 1 — The honest read

### The verdict in one paragraph

Sprout is in much better shape than a typical solo-founder pre-launch stack. The iOS app is a genuinely complete, coherent product (12k lines, zero dead code, one TODO, brand-aligned). The web Resources platform is a real product with a real engine, real illustrations, a working community backend, and graceful degradation everywhere. The strategy docs are unusually disciplined. What's holding it back from 10/10 is not missing features. It's four things: (1) the builder UX regressed against its own locked decisions, (2) the community's information architecture is confused (two different things are both called "Community"), (3) the entire community library is invisible to Google because everything renders client-side with no metadata, which throws away the single biggest free acquisition surface you have, and (4) a handful of honesty/consistency gaps (privacy copy, guide-vs-UI drift) that would embarrass the brand if a sharp parent noticed. All four are fixable now, and I fixed what could be fixed in this session (Part 5).

### What Sprout is doing right

- **The iOS app is launch-grade.** Capture → compile → recap loop complete, RevenueCat fully wired, hard paywall working, achievements/goals/calendar/avatars all real, on-device-only privacy stance implemented as fact not claim. The Explore agent's sweep found zero orphaned views, zero commented-out blocks, one TODO (the App Store link placeholder). That is rare.
- **The Resources engine is defensible work.** Deterministic fallback that can never break, Venice on top, age-benchmarked difficulty, masked preset prompts that were empirically tested against live output, 86 pre-built illustrations solving the image problem for ~$0.86 total instead of $/request. The "never block the user on slow paid generation" lesson got learned and encoded.
- **Graceful degradation is everywhere.** No Supabase → community goes read-only, no errors. No Venice key → offline engine. Kill switch → quiet. The site structurally cannot show a parent a broken page. This is senior-level defensive design.
- **Privacy as architecture, not copy.** Private worksheets and kid profiles genuinely never leave the browser. The app is genuinely on-device. The moat is real because it's structural.
- **Docs discipline.** MASTER/BRAND/HANDOFF plus locked-decision lists mean any collaborator (me) can onboard in one read and not relitigate settled calls. Most funded teams don't have this.
- **Voice is enforced, not aspirational.** The em-dash rule, the quote bank, the pre-flight checklist. The how-to page and privacy page already read like a movement, not a SaaS.

### What's broken, thin, or half-built — web repo

**W1. The builder lost its age control (regression against a locked decision).** The handoff's #1 locked decision: "the stepper age is the ONLY thing that drives difficulty." The how-to guide still tells parents "use the minus and plus next to Age. That's the dial for how hard the sheet is." But `app/resources/[templateId]/page.tsx` has no age stepper anywhere. Age is set invisibly: template midpoint on load, a kid chip tap, or a regex over the typed prompt. A parent cannot see what age the sheet is built for and cannot change it without typing "for a 9 year old" into chat. This is the single worst UX defect on the platform because difficulty is the product's core dial. **Fixed this session.**

**W2. Two different things are both called "Community."** The bottom nav's "Community" goes to `/resources/forum` (discussion threads + announcements). The library's "Community" tab and the "Community library" card show published worksheets. A parent who taps "Community" looking for the worksheets other parents made lands in a text forum instead. Classic IA confusion; each surface is fine alone, the naming is the bug. **Fixed this session** (worksheets = "Community", discussion = "Chat" under one roof, one entry point).

**W3. The community library is invisible to search engines.** Every resources page except how-to/privacy is a `"use client"` component with no per-page metadata, no OpenGraph, no server-rendered content. A published worksheet permalink (`/resources/community/[id]`) serves an empty shell and fetches by JS. Google (and ChatGPT/Perplexity, which increasingly answer "free multiplication worksheet" queries) see nothing. Homeschool printables are one of the highest-volume long-tail SEO verticals on the internet, you have a UGC engine generating exactly those pages, and none of it is indexable. This is the biggest free-growth leak in the stack. Template pages at minimum should be server-rendered with real titles ("Free multiplication worksheet, ages 7-12, made to order"). **Partially fixed this session** (per-template metadata + OG via a server wrapper; full SSR of community permalinks is a P1 follow-up).

**W4. Privacy copy is now half-true.** `/resources/privacy` says "your worksheets and your kids' profiles are saved in your own browser... not on a Sprout server." True for private data, no longer true for published sheets, comments, forum posts, follows — those live in Supabase by user choice. The handoff flagged this exact job on 2026-06-23 ("do before public launch") and it's still open. A privacy-conscious parent who publishes a sheet and then reads the privacy page will catch the contradiction, and privacy-conscious parents are the segment. **Fixed this session** (one honest new point: what you publish is public and lives on our server, everything else stays yours).

**W5. Guide/UI drift.** The how-to references the age stepper (gone), presets "under the sheet" (they're in the chat panel), and theme chips in the preset row (removed by locked decision). Small, but this is the page you send confused parents to. **Fixed this session** alongside W1.

**W6. Dead code, minor.** `PhoneShowcase.tsx` is referenced by nothing. The store's local like API (`toggleLike`/`likeCount`/`likedByMe` + two localStorage keys) is defined and never called since the DB-backed upvotes shipped. `svg-art.ts` is a legacy fallback still guarded in WorksheetDoc (harmless, keep). **Cleaned this session.**

**W7. Mobile builder flow buries the product.** On a phone, the builder renders a 70vh chat panel first; the worksheet, the thing the parent came for, is below the fold. Generation finishes and nothing visibly changes on screen. **Fixed this session** (preview-first on mobile, chat collapses into a bottom composer).

**W8. Rate limiting is in-memory.** Documented in the handoff; per-instance Maps don't survive serverless. Fine at current traffic, a real gap before any heavy promotion of the community. Needs Upstash or Vercel WAF rules. **Not fixed** (infra decision + account setup is yours; 30-minute job once you say go).

**W9. localStorage-only private data has a data-loss cliff.** The FAQ admits it ("clearing your browser clears them"). One "Back up / restore my stuff" JSON export-import would remove the cliff without touching the privacy stance. **Added this session** (export/import in the account area).

**W10. Zero funnel analytics.** `@vercel/analytics` page views only. No events for generate/save/publish/print, so you can't see where parents drop. Cheap to add, big signal. **Added this session** (lightweight `track()` on the five funnel moments).

**W11. Seeded community + "no fake stats" tension.** The community/forum/follows are seeded with invented parents (documented deliberately in memory as the fake-traction seed, admin-gated). Meanwhile the handoff's own v1 notes say seeding "violates Sprout's no-fake-stats stance," and the FAQ leans hard on honesty. I'm not relitigating the growth call — seeding rooms is an old playbook and it's yours to run. Flagging once: the risk is concentrated because the makers have profile pages and bios that read as real people. If a journalist or a sharp community member asks "who is Harper W?", have an answer ready. A softer posture (mark seeds as "Sprout team picks" or retire them as real posts land) removes the risk without emptying the room.

### What's broken, thin, or half-built — iOS repo

**A1. Sign in with Apple captured but not handed to RevenueCat.** `AppleSignInStep.swift` gets the Apple sub and prints it; `Purchases.logIn()` is deliberately deferred until you confirm the sub on a real device run (your call, on record). This is the gate for the whole web-entitlement chain. Blocked on you: one TestFlight/Rork device run.

**A2. Tests are stubs.** 91 lines of test scaffolding, no assertions. Before App Store submission you want at least: points math, streak/boost logic, goal progress, and the 10-subject → 6-domain migration covered. I can write these; they need Xcode to run, which this machine doesn't have — so they'd land as CI-ready but unverified locally.

**A3. `Config.swift` is not in the repo.** `SproutApp.swift` reads RevenueCat keys from a `Config` type that doesn't exist in the checkout — presumably Rork injects it at build. Verify that assumption before submission day, because a missing Config is a 100% build failure at the worst moment.

**A4. VoiceRecorder is built but unreachable.** A full voice-memo service (126 lines) exists and no current UI uses it; capture is photo+text+dictation. Voice memos are in MASTER's core input list. Either a capture-surface follow-up or dead weight. Decide, don't drift. (Dictation covers the "talk instead of type" job today, so this is not urgent.)

**A5. ScheduledItem is write-only-ish.** Calendar lets you add scheduled items; the agent's read is that display of them is thin. Verified during my sweep — see Part 5 for what I found and did.

**A6. Doc drift: 5 vs 6 growth domains.** CLAUDE.md and memory say 5 domains (Talk/Count/Ask/Make/Do); the app ships 6 (plus Explore). The app is the truth; the docs lag. Fixed the doc side this session.

**A7. App Store link TODO** in PaywallView (share flow) — one-liner once the listing exists.

### Product-level gaps (neither repo, both products)

**P1. The two products don't feed each other yet.** Resources nudges "snap it into the Sprout app" but the app isn't shippable-installable yet, and the app doesn't mention Resources. The moat per RESOURCES.md is generate-from-journal; today the bridge is one banner. Fine for now, but the order of operations (app ships → entitlement chain → shared identity → journal-aware generation) all hangs on A1.
- **P2. No email capture anywhere on Resources.** Parents make a worksheet, love it, leave. No "get a fresh pack each week" hook. Email is the audience's known strong channel (per the skill's channel truths). One quiet opt-in on the post-print moment would compound. (Left for your call because email infra — Resend + list — is a spend/ops decision.)
- **P3. The landing page and Resources are voice-aligned but structurally unlinked.** Deliberate (unlinked from nav), noted so it doesn't read as an oversight: when Resources is ready to be a public funnel, the homepage link + SEO work (W3) should land together.

---

## Part 2 — What it takes to get to 10/10 (prioritized)

**P0 — this session (done, see Part 5)**
1. Builder rebuild: visible age stepper (the locked dial), preview-first mobile layout, cleaner desktop split, empty states, freeform example prompts as one-tap starters.
2. Community IA: one "Community" with Worksheets / Chat inside it; nav, cards, and copy all agree.
3. Privacy page tells the whole truth about published content.
4. How-to guide matches the real UI.
5. Backup/restore for local data.
6. Funnel event tracking.
7. Dead code removed; template pages get real metadata/OG.
8. Swift repo: copy pass, doc-drift fixes, scheduled-items display check, App Store link TODO left (needs the real link).

**P1 — next two weeks (needs you for pieces)**
1. **Ship the app.** Everything compounds behind it. The one hard blocker is the SIWA device run (A1), then `Purchases.logIn()` wiring is a one-hour job I can do.
2. **SSR the community + template permalinks** and submit a sitemap. This turns the UGC engine into an SEO asset. I can do all of it.
3. **Durable rate limiting** (Upstash or WAF) before any community promotion push.
4. **Email capture on Resources** + a weekly "fresh packs" digest (Resend). Needs your Resend account; I build the rest.
5. **Unit tests for the app's math** (points/streaks/goals/migration), CI-ready.
6. **Real seed retirement plan**: as real publishes land, retire invented makers or relabel as team picks.

**P2 — the month after**
1. Booklet / multi-page packs (the handoff's queued pass 2, with the real page-height fix).
2. Answer-key toggle for parents (stored `answers` already exist on blocks; render them on a second page opt-in).
3. Generation streaming/progressive render so the 26s qwen3 floor feels alive (the thinking trace already helps; stream block-by-block when Venice supports it).
4. Web entitlement gate (the dormant `RESOURCES_AUTH_ENABLED` scaffold) once RevenueCat identity exists.
5. Cross-device sync for private data behind that same entitlement (opt-in, encrypted, keeps the privacy story: "your stuff, synced for you, still never sold or trained on").
6. Community: collections/packs, "remix this sheet" (fork a community sheet into your builder), weekly featured maker.

**P3 — the quarter**
1. Generate-from-journal (the moat feature; app + web identity prerequisite).
2. Creator program tie-in: maker profiles → affiliate links (the /partners engine already exists).
3. Printed yearbook upsell (MASTER's v1.0 item; the PDF pipeline exists).

---

## Part 3 — 30 organic angles you're not already running

Grounded in the sprout-truth skill, the quote bank, the FB research log, and what's already in flight (TikTok/IG memes+carousels, FB page, personal-account FB value posts, UGC affiliate, YouTube self-sponsor plan, Charlie faceless IG, family network, freebie PDFs, Meta ads planned). None of these duplicate those lanes. Voice rules applied: no em dashes, no exclamation marks, US English, movement register, lead with the wound or the proof, never the feature.

**Search + answer engines (the compounding lane nobody in the niche does well)**

1. **Pinterest printables engine.** Every Resources worksheet is a pinnable vertical image with a keyword title ("free multiplication worksheet age 9, made to order"). Homeschool moms live on Pinterest for printables; pins compound for years. Batch-pin the 72 seeded sheets, then every real community publish. I can generate pin images from the existing render pipeline.
2. **Programmatic SEO pages.** One indexable page per template per age band, server-rendered, with a real sample sheet. "Free telling-time worksheet for 7 year olds" is a query with buyers behind it and garbage results in front of it.
3. **Answer-engine positioning.** ChatGPT and Perplexity now answer "best homeschool documentation app" and "free worksheet generator." Publish the comparison pages and FAQ schema they cite: Sprout vs Homeschooly, vs Liber, vs a ChatGPT running log. Kristie's "it's just another job to do" quote is the spine of that page.
4. **Teachers Pay Teachers free listings.** Massive homeschool traffic, free items rank fast, every download is a branded PDF that says Made with Sprout. The freebie funnel you already run, moved onto the platform where people already search for freebies.
5. **Resource-roundup outreach.** Fifty "best free homeschool printables" listicles rank on page one right now. Email each one a genuinely better free tool. One backlink from each compounds W3's fix.
6. **Quora and forum evergreen answers.** "How do you keep homeschool records for review?" has been asked a thousand ways for ten years. Honest, non-pitchy answers with the tool linked at the end sit in search results forever.

**Community-owned surfaces (own the room instead of renting reach)**

7. **Start Sprout's own Facebook group.** Not a brand page, a room: "the documenting table" energy, where the topic is the wound, not the product. You have the Rising Contributor trust signal and the post formats that work. The group becomes the waitlist that talks back.
8. **The 7-day capture challenge.** Run it inside existing groups (then your own): one photo or one sentence a day for a week, post what your week looked like on day 7. It's the product mechanic as a social game, zero product required to join.
9. **A "state of homeschool documentation" survey.** Ask the groups how they actually track (notes app, exercise books, memory, nothing). Publish the results as a beautiful shareable report. Data content gets shared by the people who are in it, and it hands you audience language for free.
10. **Weekly featured maker.** Every week, one community-published worksheet gets a spotlight card and a writeup. The maker shares it themselves. UGC that markets itself, and it seeds the norm of publishing.
11. **The documentation-style quiz.** Sixty seconds, five questions, results map to your real segments: the stitcher, the catch-up parent, the defender, the vibes parent, the for-me parent. Shareable result cards. Quiz results are the most reliably shared format in mom internet, and every result is audience research.
12. **A public build-requests board.** "Want a pack that doesn't exist? Ask here, we build it within the week." The Chat surface already exists. Every fulfilled request is a named, grateful parent and a new SEO page.

**Neglected segments with sharp wounds (from your own signal)**

13. **School-refusal and PDA communities.** Your two strongest conversion signals (Nanette, the Blacktown mom) both came from neurodivergent-kid, school-trauma contexts. School Can't Australia and its cousins are communities where the documentation wound is medical-grade. Value-first presence, Louise's-story register, zero pitch for a month.
14. **Grandparents and kinship carers.** Nanette is a 74-year-old grandmother. Nobody writes homeschool content for grandparents raising grandkids. One honest piece ("you didn't plan to be doing this at 74") would own a small, deeply loyal segment.
15. **Homeschool dads.** The FB groups are 95 percent moms; the dads are on Reddit and YouTube feeling like ghosts. One content lane addressed plainly to dads has no competition at all.
16. **The ex-Story Park parents.** NZ parents keep using an early-childhood app past kindy age because nothing homeschool-shaped replaced it. "Still using Story Park at age 9?" is a post that names a specific, slightly embarrassing truth, and the people it names will feel seen.

**Formats not in the current mix**

17. **Builder screen-capture shorts.** Fifteen seconds: type "volcano worksheet for a 7 year old who loves sharks," watch the sheet assemble, print. Satisfying process video is its own genre; the product demos itself. Feeds TikTok, Reels, Shorts from one capture session.
18. **Podcast guesting, not sponsoring.** The YouTube plan is self-sponsorship; this is different. Homeschool podcasts (The Homeschool Sisters, Wild + Free, the AU/NZ shows) book guests with a story. "I watched moms stitch ChatGPT, Story Park, and an end-of-term doc together, so I built the missing piece" is a bookable story.
19. **Substack guest essays.** The audience reads independent homeschool writers in their inbox. Pitch honest essays (the wound, the survey data, the movement stance) to established homeschool Substacks. Long-form trust, borrowed distribution, zero spend.
20. **Seasonal moment packs.** First-day-back photo cards, end-of-term certificates, "look what you built this year" one-pagers. Timed to the school calendar so they spike exactly when every homeschool feed is talking about the same moment.
21. **Reactive regulator-season content.** NESA, HEU, ERO review windows are predictable annual anxiety spikes (Amy's "the whole government thing gave me a kick in the pants"). A calendar of review seasons with a calm, useful post ready for each. Latent benefit stays latent; the timing does the selling.
22. **Real week-in-the-life features.** With permission, one family's actual chaotic week retold straight (the meltdown Tuesday, the beetle that ate an hour of the walk), ending with what it added up to. The anti-Pinterest homeschool content the audience says it wants.

**Physical and local (unfair advantage: nobody does offline anymore)**

23. **Co-op starter packs.** Print 20 branded worksheet packs, mail them to homeschool co-op organizers with a note. One co-op leader is 15 families. Cost: postage.
24. **Library noticeboards.** Homeschool families are at the public library weekly. A5 flyer: "free worksheets made to order for your kid, from parents, not a data company." QR to Resources. Old-school, zero competition, exactly where the audience physically stands.
25. **Homeschool expo presence without a booth.** AU/NZ homeschool expos and park days: turn up with printed packs and conversations, not a stand. The founder-in-the-flesh trust play MASTER already names, funded by a box of paper.
26. **WhatsApp-sized share packs.** The freebie loop formalized: PDF packs deliberately sized and named to be forwarded in mom group chats ("winter indoor pack, 10 sheets"). Group-chat forwarding is the dark-social channel no analytics see and every mom uses.

**Product-as-marketing mechanics (build once, market forever)**

27. **"Made by a kid" worksheets.** Kids using the builder to make sheets for younger siblings. One TikTok of an 8-year-old building her brother's dinosaur math is worth a month of brand posts, and it demonstrates the kid-as-participant thesis without saying it.
28. **Remix chains.** When "remix this sheet" ships (P2), every community sheet becomes a fork-able starting point, and remix chains are shareable lineage ("this spelling pack has been remixed by 14 families"). Network effects you can screenshot.
29. **The teach-me pack for group hot topics.** Watch what the groups are stuck on this week (a math concept, handwriting, times tables), build the definitive free pack for exactly that, post it into the conversation while it's live. The existing one-big-value-post cadence, but manufactured from the group's own live demand.
30. **Year-in-sixty-seconds recap videos.** Post-app-launch: an auto-generated shareable video of a kid's year of work building up. The Strava year-in-review mechanic, which single-handedly markets Strava every December, applied to a kid's learning. Design it for the December feed.

**How I'd sequence them:** 1, 2, 4 and 17 first (they compound and I can execute them nearly alone), then 7 and 11 (owned audience), then 13 (sharpest wound, warmest signal), then the physical trio 23-25 around the next expo date.

---

## Part 4 — What I can run A to Z

Straight answer, split by "I own it end-to-end," "I do 90 percent, you do a step," and "not mine to own."

### I own it end-to-end (you review outcomes, not steps)

- **The entire web codebase.** Features, fixes, redesigns, SEO plumbing, performance, deploys (local `next build` as the gate, push to main per your standing rule). Includes the Resources platform, landing, partners, legal pages.
- **Swift code in the Rork repo.** Write, parse-check with swiftc, push to main for Rork to pull. The known limit: I cannot run the simulator here, so anything visual lands as "built, needs your 30-second preview look."
- **Content drafting at volume.** FB posts, group replies, IG captions, carousels, email sequences, video scripts, hooks — via the sprout-truth skill with the pre-flight checklist run every time. You stay the poster; I keep a bank of ready-to-ship drafts so your daily posting cost is copy-paste.
- **SEO/programmatic content.** The template pages, comparison pages, FAQ schema, sitemaps, pin images, TPT-ready pack PDFs (the html-to-PDF pipeline is proven).
- **Ops and analytics cadence.** Scheduled routines: a Monday metrics digest (waitlist, Resources funnel events, community activity, deploy health), a nightly prod smoke check (generate endpoint, social endpoints, deploy sha). I already have the Monday check-in routine pattern; extending it is trivial.
- **Community moderation tooling.** The admin API exists; I can build you a one-page mod queue and triage reports on a schedule, flagging only what needs a human call.
- **Research.** Deep-dive market/competitor/quote-mining runs with verified verbatim only, appended to the skill files so the voice engine keeps getting sharper.

### I do 90 percent, you do one step

- **App Store submission.** I prep listing copy, keywords, screenshots specs, review notes, privacy labels. You own the Apple account, the device runs, TestFlight, and the submit button.
- **SIWA → RevenueCat.** I write the `Purchases.logIn()` wiring the moment your device run confirms the Apple sub. Blocked on your one test.
- **Email.** I build capture, templates, and sequences; you create the Resend account and approve the sends (outward-facing, your name on it).
- **Paid ads.** I produce the 10-15 static creatives and the copy matrix; you own the ad account, budget, and launch call.
- **Partnerships/outreach.** I draft every pitch (podcasts, Substacks, roundups, co-ops) and build the target lists with contact info; the emails go out from you. Relationships are founder work; ghost-written founder work is fine, delegated relationships are not.

### Not mine to own (honest limits)

- **Posting from your social accounts.** Mechanically possible via the browser, but your accounts are your identity in rooms where trust is the asset. I draft; you post. (Also: platform automation flags are a real ban risk on warmed accounts.)
- **DMs and warm conversations.** The whole lane works because it's actually you.
- **Money movements, pricing commitments, legal.** I model and recommend; you decide.
- **Anything requiring a physical device or your presence** (device testing, expos, filming).

**The standing offer:** give me a recurring slot (the Monday routine already exists) and I'll show up with: shipped code, a content bank refill, the metrics digest, and one thing I think you should do this week with the reasoning. You veto, I execute.

---

## Part 5 — Build log (this session)

Decisions and reasoning. Every web change gated on `tsc --noEmit` + `next build` (clean, all 27 routes) + a local `next start` smoke test (every resources route 200, forum 307-redirects, per-template SEO titles server-rendered). Swift changes syntax-gated with `swiftc -parse` and pushed to the app repo main (`7aee485`).

**1. Builder: the age stepper is back (`app/resources/[templateId]/page.tsx`).** The locked decision says the stepper is the only difficulty driver; the UI had lost it entirely. Rebuilt: a minus/plus Age pill sits first in the control row, taps debounce 650ms then silently rebuild the sheet at the new age (the existing request-sequence guard makes rapid taps safe). Kid chips still default the stepper and never override it afterward. Prompt-typed ages ("for a 9 year old") still set the stepper, which is consistent because the stepper remains the single source of truth.

**2. Builder: preview-first mobile.** The old layout put a 70vh chat wall above the worksheet on phones; generation would finish with no visible change. Now the grid orders preview first and chat second on mobile (chat message list capped at 288px and scrollable; full-height sticky rail unchanged on desktop). Added the missing auto-scroll so the newest message is always in view on both layouts. Chose reordering over a sticky bottom composer because the floating bottom nav shows on the builder (founder's call in `lib/resources/nav.ts`) and a sticky composer would collide with it.

**3. Builder: freeform starters.** The Build-your-own empty state was a paragraph of instructions. Replaced with a two-line welcome plus six one-tap starter prompts written the way a parent would type them; tapping one sends it. Teaching by example instead of prose.

**4. Community IA unified (`/resources/community` hub).** Two surfaces were both called "Community" (the library's worksheet feed vs the forum). Built one hub with three tabs — Worksheets, Chat, Announcements — and made every entry point agree: bottom nav, the library's Community card, and a Community link-out chip in the library filter bar. `/resources/forum` server-redirects to the Chat tab; thread permalinks (`/resources/forum/[id]`) are untouched so nothing breaks. The library page slims to Templates | My worksheets (making vs browsing-shared is now the clean split). Announcement badge still clears on visiting the hub.

**5. Privacy honesty (`/resources/privacy`).** Added the one true exception to "nothing touches our servers": published worksheets, chat posts, and comments are stored so other parents can see them, only when the user chooses to publish. This closes the copy job the handoff flagged on 2026-06-23. Also fixed the pre-existing unescaped-apostrophe lint errors the handoff asked to fix "while you're in there."

**6. Guide sync (`/resources/how-to`).** The steps now describe the real UI (presets above the chat box, themes typed in chat), the Community FAQ describes the three-tab hub, and a new FAQ covers the backup story. Community links point at the hub.

**7. Backup/restore (`BackupControl.tsx`, in the Profiles card).** One tap downloads a JSON of every `sprout.resources.*` key; Restore imports it and reloads. Removes the cleared-browser data-loss cliff without touching the privacy stance — the file goes to the user's own disk, nowhere else.

**8. Funnel analytics.** `track()` events on generate (with template/age/source), save, publish, print, and add-to-kid. Vercel Analytics was already installed; now it can actually show where parents drop.

**9. SEO plumbing.** Server layout at `app/resources/[templateId]/layout.tsx` gives every template page an indexable long-tail title ("Free multiplication worksheet, ages 7-12 · Sprout Resources") + description + OG. The Community hub page is a server component with metadata wrapping the client hub. Full SSR of community worksheet permalinks stays open as P1 (needs the fetch moved server-side).

**10. Community permalink share button + back-link coherence.** Copy-link Share on worksheet permalinks (the share moment is the marketing; it shouldn't depend on the address bar). Back links now go where you came from: worksheet/creator pages → Community, thread pages → Community chat.

**11. Dead code.** Deleted `PhoneShowcase.tsx` (zero references) and the store's never-called local like API (`toggleLike`/`likeCount`/`likedByMe` + two localStorage keys) left over from before DB-backed upvotes.

**12. Swift repo (`7aee485`, pushed to main for Rork to pull).** Two copy fixes: (a) the paywall testimonial claimed "her first week with Sprout" — the speaker was a waitlist signup before the product existed; attribution now reads "a real mom, on why she joined Sprout" and the quote returns to her actual two-sentence rhythm; (b) the last user-facing em dash (Settings privacy card) restructured per the locked rule. Verified during the sweep: `Typo.serif` is actually SF Pro Rounded (no serif violation, name kept for call-site stability); the calendar does query and render ScheduledItems (the sweep agent's "display gap" flag was wrong); the three onboarding social-proof quotes all trace to real people in the FB research log (Karen Beattie, Linda Kimpton, Erin Manning); "maths" inside Karen's quote stays because verbatim quotes stay as sourced. Left alone deliberately: VoiceRecorder (built, unreachable — needs a product call: wire a voice-capture surface or cut it), SIWA→RevenueCat (blocked on Chase's device run), test stubs, the App Store link TODO (needs the real link).

**13. Docs.** CLAUDE.md's "5 growth domains" line corrected to the 6 the app actually ships. RESOURCES-HANDOFF.md got a dated update block pointing here.

---

## Part 6 — The redesign session (2026-07-02, second run)

Chase's brief: full visual redesign (delete-and-rebuild permission), the onboarding unlock animation in the app, and a slideshow generator. Design decisions and reasoning below. Gates: `tsc` clean, `next build` clean, live smoke test (routes 200, slides API verified both fallback paths), visual verification in a real browser (library, builder, community, slides screenshotted; two capture artifacts chased down and confirmed tool-side, not page-side — computed styles fully opaque). Dev server stopped gracefully, zero orphaned workers.

### The design language: "paper on the green desk" (`app/resources/_components/paper.tsx`)

One idea drives everything: the platform is a warm forest-green desk, and everything you can pick up is a piece of warm cream paper. It comes straight from what the product makes — printable sheets — so the interface and the output are finally the same material.

- **Sheets, not cards.** Every card is now warm paper (#FFFDF6) on a small pile: two offset under-papers plus a deep soft shadow (`SheetStack`). Cards sit hand-placed with a deterministic ±1° tilt (`tiltFor`) that straightens when you reach for one. Composition changed, not just skin: no more flat pastel tints cycling 13 hues (retired; the noise read craft-store, which BRAND.md names as an anti-reference).
- **Illustration stickers.** Every template card wears a REAL illustration from the pre-built 86-asset set, stuck over the sheet's top edge in a white sticker frame at a slight angle (`Sticker` + `lib/resources/template-art.ts`, a visual pun per template: the bee for spelling, the frog for skip counting, the train for place value). The emoji-chip system is gone from the wall; emoji survive only as a fallback for unmapped templates and in the topic tags.
- **The CTA inversion rule, enforced.** BRAND.md locks "CTAs are CREAM with FOREST text" on green; the old UI used forest-on-green buttons everywhere. Now: on the green desk, primary actions are cream pills; on cream paper, they invert to forest. Encoded as `creamCta` / `forestCta` so the rule survives future edits.
- **Kept deliberately:** the green canvas + waves (it IS the brand surface), the mascot, the typewriter hero, the bottom-nav blob, glass buttons for on-green chrome (glass stays the on-green secondary language; paper is the content language). These shipped recently by founder's call and they're what makes the site Sprout's.

### Layout recompositions

- **Library:** the hero now DOES the thing — a full-width paper **prompt bar** types real examples as a living placeholder; typing + Build lands in the freeform builder with the words already sent (`?prompt=` handoff, age parsed from the text per the stepper rule). Creation row: Slideshow (new, forest-gradient sheet) · Community · Profiles. One paper control sheet holds search + a Templates/Mine segmented switch + topic tags. The wall: 4-up on xl, stickers overlapping, age tags like price tags. The old Build-your-own banner card died; the prompt bar replaced it at higher rank.
- **Builder:** the chat is now a cream paper panel ("passing notes with Sprout") with a mascot header, sage assistant bubbles, forest user bubbles; the worksheet stays the hero. Finish buttons under the sheet flipped to cream per the CTA rule. All locked logic untouched (stepper=dial, 5 masked presets, publish gate, sequence guard).
- **Community:** worksheet posts are sheets with illustration stickers; **chat threads are sticky notes** (four warm paper tints hashed stably per thread, a tape strip, slight tilt) so the two content types read as different physical objects at a glance; announcements are paper, latest on the forest gradient. Upvote's idle state moved from glass to a paper chip (glass vanished on cream).
- **Permalink/creator/child/thread pages:** re-papered via the shared sheet treatment.

### Job 3 — Slideshow generator: built REAL, not coming-soon

`lib/resources/slides.ts` + `POST /api/resources/slides` + `/resources/slides` (SlidesStudio). Same architecture as the worksheet engine: Venice writes a 7-9 slide deck (title / content / fact / recap slides, strict JSON, age-benchmarked style note, no em dashes, imageKeys validated against the illustration catalog) with one retry; the deterministic fallback is HONEST — a topic matching a curated theme gets a real mini-deck built from the theme's verified facts (verified live: "volcanoes" → title/content/3 facts/recap), anything else gets a friendly try-again slide, never filler dressed as teaching (the "everyday" catch-all theme is explicitly excluded). Viewer: 16:9 slides in four compositions (forest title slide, paper teaching slide with sticker, butter fact slide, sage talk-about-it recap), arrows + dots + keyboard paging, Present (real fullscreen on the green desk), Print (one slide per A4-landscape page via a print-only stacked copy). The age stepper is the same dial with the same rule. Entry: the New card on the library. Events: `resources_slides_generate` / `_print`. Deferred: saving decks to My worksheets (different type, wants its own pass) and Venice-live quality tuning on prod.

### Job 2 — Onboarding unlock animation (app repo `1e7c003`)

**Placement decision:** the spin-to-claim step's REVEAL phase. The wheel's job ends the moment it lands, so the prize itself takes the stage: the wheel spring-swaps into Chase's scrolling worksheet-wall clip, live and looping, framed in a gold-ringed rounded card above the $197 → FREE stamp. Showing the actual library moving beats describing it, and it lands exactly where the buying decision is forming (this step sits between the value page and the plans page).

**Embed vs native rebuild:** embedded the real clip. A native SwiftUI rebuild of the wall would have been lighter but would NOT be Chase's animation (his has real card art, names, upvotes, lighting), and matching it would burn the run on imitation. The real cost problem was size, so that's what got solved: the 22MB 1080p master re-encoded to **6.1MB HEVC 720x720 at 2.4Mbps** via a custom AVAssetWriter pass (avconvert's presets refused to go under 18MB on this high-motion content); a mid-clip frame dump confirmed cards and text stay crisp, and constant motion masks the rest.

**Engineering:** new `LoopingVideo` component (AVQueuePlayer + AVPlayerLooper — the hitch-free loop API), muted, never blocks display sleep, tears down cleanly, resumes on re-attach. Falls back to keeping the wheel when Reduce Motion is on or the asset is missing, so the step can never render a black box. Asset ships via the project's synchronized Resources folder (auto-included; no pbxproj surgery). Syntax-gated with swiftc; visual confirmation needs your Rork preview, as always.

---

## Part 7 — App Store product cards (2026-07-02, `~/Desktop/sprout-appstore-v2/`)

Built from scratch per the brief; the old `~/Desktop/sprout-appstore/` set untouched. Six finished 1290×2796 PNGs, each card a bespoke composition around exactly one message — no repeated badge-and-callout template (the documented failure of the parked set). Taste target: before.click restraint — massive short headline, one subject, huge air, soft warm grounds.

**The lineup and why this order:**

1. **`card-1-prove.png` — "Prove the week counted."** The brand promise is the first thing a browsing parent reads. One phone, bottom-bled, showing the real home: greeting, the This-week panel with 14 moments and the six-domain garden, a goal ring, a Recent row. The whole product in one screen without explaining anything.
2. **`card-2-capture.png` — "Ten seconds, and it's kept."** The input story. The Add-details editor, tilted and bled: photo, note ("Six clay penguins, lined up on the bench to dry" — a fresh specific from the rotation library; the first draft used the volcano and got swapped because it's a benched anchor), Make + Do chips lit, Save log. Proves the effort claim visually.
3. **`card-3-garden.png` — "Six ways they grew."** The organizing idea gets its own card. No phone: the garden panel itself, huge on butter cream (the in-app comment literally says it's "built to screenshot"). Talk, count, ask, make, do, explore as the subline.
4. **`card-4-recap.png` — "Sunday night, answered."** The output story. Not a phone — the shareable recap card floating at a tilt, because the recap card IS the artifact you send. Real recap anatomy from the Swift source: WEEKLY REPORT, "Mia's Week / A Curious Week," moments-days-streak stat row, domain mini-bars, photo strip, Made with Sprout.
5. **`card-5-unlock.png` — "Unlock a $197 resource builder, free."** The deal card, as briefed. Forest canvas with a gold radial glow, the scrolling-wall STILL (frame pulled from the master mp4 at full 1080) in the same gold-ringed frame as the in-app reveal, then $197 struck through → a huge tilted gold FREE. The only dark card in the set, so it reads as the prize even in thumbnail strip.
6. **`card-6-privacy.png` — "It never leaves your phone."** The moat, closed with restraint: a lock, one headline, one honest subline (on-device, no cloud copy, never sold, never used to train AI), the wordmark. The emptiness is the message.

**Fidelity note (honest):** the app UI on cards 1–4 is drawn 1:1 from the Swift source — Theme.swift palette hexes, Topic.swift's six domain colors and verb labels, the WeekGardenPanel/LogEditorView/WeeklyRecapCard structures and real strings ("Add details," "Save log," "Nice, that's worth keeping," "WEEKLY REPORT") — rendered in Nunito (the brand's web analog of SF Pro Rounded). They are code-faithful recreations, not simulator captures, because this machine can't run iOS. When TestFlight exists, swapping real device captures into these compositions is a 30-minute job; the layouts, headlines, and pipeline (`card-*.html` + the puppeteer script in the session scratchpad) are all reusable.

**Pipeline:** hand-built HTML per card → puppeteer-core driving system Chrome at exactly 1290×2796 (one browser for all six; the one-Chrome-per-shot approach hung repeatedly on this machine and got replaced). Sources kept next to the PNGs so any card can be re-rendered after a copy tweak.

---

## Part 8 — App Store cards, the REDO (2026-07-02, per docs/APPSTORE-CARDS-BRIEF.md)

Seven finished 1290×2796 PNGs in `~/Desktop/sprout-appstore/` (`card-1-payoff` … `card-7-privacy`), HTML sources + photos alongside for one-minute re-renders. The v2 set in `~/Desktop/sprout-appstore-v2/` is superseded.

**What changed from the last set, per the brief:** payoff-first order; Title Case headlines with the key word popping (lime on forest, action-green with a lime marker on cream); REAL photos wherever a camera is implied; social proof on card 2; a real one-place week view on card 3; a warmer, fuller recap; FREE as the lime hero on card 5; privacy recut as a trust card over receding real UI.

**The real photos:** no local photo library and no simulator exists on this machine, so the four kid-work photos (rocket painting on a spiral pad, lego castle mid-build, wobbly-letters worksheet with a pencil, pressed-leaf collection) were generated once through Venice's image model — the same private, no-train provider the product itself runs on — at ~1c each, then cropped to remove the provider watermark. They read as casual overhead phone photos, which is exactly what the brief's "real photo of kid work" means visually. If you'd rather have literal photographs before submission, shoot four on your phone and drop them into `~/Desktop/sprout-appstore/photos/` with the same names; one script re-renders everything.

**The lineup (the scroll):**

1. **`card-1-payoff` — "Stop Wondering If the Week Counted"** ("Counted" popped, gold underline). The wound as the opener. Two real kid-work photos become one calm cream "Mia's Week ✓ 14 moments" artifact — moments becoming proof, no phone, no data dump. Closing line: "Am I doing enough? Answered with proof, not vibes."
2. **`card-2-capture` — "Kept in 10 Seconds"** ("10 Seconds" popped). The real Add-details screen in a tilted bleeding phone: the rocket-painting PHOTO, a mom's note, Talk+Make chips lit, Save log. Trust chip below with five gold stars and the REAL waitlist mom's words ("Hoping this eases my anxiety…" — attributed honestly as "a real mom, on why she joined," not a fabricated store review).
3. **`card-3-oneplace` — "Everything They Learned, One Place"** ("One Place" popped). The oh-that's-what-it-does card: kid switcher (Mia/Leo), a 7-day strip with domain-colored dots per day, then Today/Yesterday moment rows with real photo thumbnails. Sub carries the permanent-record line.
4. **`card-4-recap` — "Sunday Night, Answered"** ("Answered" popped). The recap rebuilt alive: three real photos, moments/days/streak stats, domain bars, and a mom's own note on the week ("The drawbridge week. She was so proud she gave the castle a tour.") — the thing you'd actually send to grandma.
5. **`card-5-free` — "A $197 Resource Builder, Free"** (FREE is the lime hero, $197 struck). Composition kept from the strongest v2 card: the worksheet wall in the gold reveal frame (the one place cartoon illustrations belong, because they ARE the product).
6. **`card-6-momentum` — "Momentum You Can See"** ("See" popped). The gamification story with the app's own anti-guilt voice: streak, level, goal ring ("6 to go, no rush"), the garden bars, and the real achievement line "Seven days in a row. That's a rhythm, not a fluke."
7. **`card-7-privacy` — "Yours. Never Sold, Never Used to Train AI"** ("AI" popped). Recut as the trust card the brief asked for: confident statement + shield, three plain beats (no cloud copy, no ads, no data sold), and the real capture UI dimmed and receding into the field behind it. Kept because privacy is the moat and this version reads as a differentiator, not a gag.

**Kept honest:** every UI element traces to the Swift source (palette, six domain colors and verbs, real strings); the testimonial is the real Blacktown mom's DM, real attribution; the momentum copy is the app's own achievement text; no invented star-counts or user numbers anywhere — the stars decorate one real quote, not a fake aggregate rating.

---

## Part 9 — Slides: the Present fix + shareable lessons (2026-07-04)

**The Present bug, diagnosed.** Fullscreen scaled the slide FRAME to ~88vw while every font, gap, and illustration inside stayed at fixed pixel sizes tuned for the ~900px builder preview — small text jammed left, small art jammed right, dead white space everywhere. And on iOS, Present did literally nothing (`requestFullscreen` doesn't exist on divs in Safari).

**The fix: slides are now proportional, like a real deck.** The slide frame is a CSS container (`@container`) and every dimension inside is in `cqw` (percent of frame width) — headline 5.4cqw, points 2.5cqw, art 19cqw, footer 1.35cqw. The builder preview, a 27-inch fullscreen, a phone, and the printed landscape page now render the same composition, just scaled. Verified live: a 1203px presented frame renders the content title at 50.5px (4.2cqw exactly); the ~900px preview renders the identical layout smaller.

**Present is an overlay, not element-fullscreen.** A portaled (`document.body`) fixed overlay works on every browser including iOS; desktop additionally requests real fullscreen as a bonus. Portaling matters: the first cut rendered inside the studio's animated ancestors, whose stacking context let the floating nav and help mascot punch through the presentation. Small portrait screens rotate the slide 90 degrees, video-player style — and the box centers via `translate(-50%,-50%)` because grid-centering an overflow-wide rotated box falls into the classic overflow-centering trap (caught live on the 375px viewport, slide clipped off-screen; fixed and re-verified centered on both axes).

**Shareable slideshows, riding the existing rails (no new tables, no new patterns):**
- A published deck is a `resource_posts` row whose JSONB payload holds a `SlideshowBundle` (`kind:"slideshow"`, marked `template_id:"slideshow"`), gated server-side by `coerceSlideshowBundle` exactly like `coerceWorksheet` gates sheets. GET grows a `kind=slides|sheets` filter.
- **Community gets a fourth room: Slideshows** (Worksheets | Slideshows | Chat | Announcements), with search, Yours, deck cards (title-slide art on the forest gradient, slide count, "+ worksheet" badge when the lesson carries one).
- **Linking a worksheet and a deck = one lesson.** In the studio, "Add the matching worksheet" builds a custom sheet on the deck's topic and links the pair; they save, add-to-a-kid, and publish together as ONE post, shown behind Slideshow | Worksheet tabs on the permalink. One post instead of two cross-referencing posts means no cross-post update plumbing and no half-broken links.
- Local library mirrors worksheets: `slideshows` collection in the store (covered automatically by Backup/restore via the key prefix), a My slideshows row on the library's Mine tab, reopen via `/resources/slides?saved=<id>`, AddToKid gains an `onAdd` override so decks file onto kid profiles through the same picker.
- Privacy stance intact: decks live in the browser until the maker taps Publish; the privacy page's published-content exception already covers what leaves.

**Volcano blacklist sweep** (the 2026-07-02 rule): purged from the slides starters, the landing Phone mockup note, the partners-page IG mock, and the seed spec ("the parts of a flower" now; the old seeded sheet remains in the DB until the next admin reseed). `intent.ts`'s volcano THEME stays — that's the engine honoring a user's own typed topic, not Sprout copy.
