# Sprout Resources — session handoff

Read this first when resuming work on the Sprout Resources worksheet platform.
It is the single source of truth for current state, locked decisions, the open
risk, and the next job. Last updated 2026-06-23: six things are MERGED to main,
deployed, and CONFIRMED on prod (hisprout.app) — the mul/div fallback cap fix +
masked presets (`1150413`), the Build-your-own + Community social layer
(`f3bed5e`), the custom-sheet blank-PDF print fix (`64c0e21`), the print
pagination + banner/mascot-color fix (`3b893d4`), and resource MODES — teach mode
+ honest SVG visuals + the field-coercion fix (`d694a2e` / `e56a5bd`). See section
3. Nothing is pending prod re-test. **Next: the multi-page BOOKLET format (pass 2),
built on this proven single-sheet engine. Raster image gen stays deferred.**

Resources is the web worksheet-maker at route `/resources` in this landing repo
(a SEPARATE product from the Sprout Journal mobile app). Full spec: `docs/RESOURCES.md`.
Live at **hisprout.app/resources** (unlinked from the homepage nav). Push to
`main` auto-deploys to production via Vercel.

---

## 1. What shipped this session (all on `main`, HEAD = `3deae6c`)

Newest last. Every commit is deployed to prod.

- `3aa18a6` — intent engine (`lib/resources/intent.ts`) + first-class child
  profiles (`/resources/child/[id]`, photo/avatar, birthday, interests, learning
  style, learning-moment feed) + social layer (local account/creator, attribution,
  likes, ranking, badges, `/resources/creator/[handle]`). All local-first.
- `2cd290c` — voice pass: strip em/en dashes from generated worksheet text + UI.
- `5cfca62` — rebuilt the create-profile modal as a real portaled `@base-ui/react`
  Dialog (was a `fixed` div trapped inside `<header>`); profile switcher.
- `1cc0e68` — agentic generation feel: live "thinking trace" while building,
  streamed chat replies, sheet reveal animation.
- `8410bfa` — on-template content for ALL 30 templates (deterministic engine
  rewrite), edits actually apply, text addressed to the child, named title
  ("Chase's X"), removed the answer-key section + the AGE label, prominent
  "Made with Sprout" branding, standard circular profile avatars, comfortable
  `max-w-7xl` width.
- `f49ad95` — first liquid-glass pass on 3 surfaces (SUPERSEDED by `9f6df85`).
- `9f6df85` — wiped that and rebuilt ONE glass treatment on EVERY button from the
  provided GlassEffect (`components/ui/glass.tsx`: `GlassButton`/`GlassLink`/
  `GlassPanel`/`GlassFilter`).
- `09d00b4` — typewriter hero ("We were born to [create/learn/grow/...]", word
  cycles, 3s hold) + honest privacy page (`/resources/privacy`).
- `84723c6` — trimmed chat presets to the 5 edit controls (removed theme chips);
  removed the stale "Sample mode" message; feedback became a copy-paste popup (no
  mailto); added the privacy entry points.
- `f4a2aa9` — the real UI difficulty bug: request-sequence guard (kills the race
  where a stale lower-age result won), `send()` no longer blocked by `loading`,
  debounced age stepper; grounded difficulty in `ageBenchmark`; removed the
  multiplication "1-12 times tables" cap; `dedupeWorksheet` for commutative pairs.
- `3deae6c` — multiplication word problems are multiplication-only (fixed the
  subtraction leak); money uses dollars-and-cents for age 9+, whole-dollar for young.

**These two were built on branch, then MERGED to main via `1150413` and CONFIRMED on prod (see §3):**

- `931a24f` — age-aware operand ceiling for the deterministic mul/div fallback.
  The fallback hard-capped multiplication AND division at the 12x times tables for
  EVERY age (`Math.min(12, fmax)` in `mathBlock`), so when Venice was unavailable a
  13-year-old silently got `4 x 6`. New `factorCeiling(age, diff)` in
  `lib/resources/generate.ts`: ages 3-9 keep the existing friendly times-table ramp
  unchanged; age 10+ climbs to genuine multi-digit, tracking `ageBenchmark`. Chat
  harder/easier still nudges it; divisor stays 1-2 digit while the quotient scales
  (multi-digit dividend, like Venice). This is the most likely root cause of the
  local-vs-prod difficulty gap (section 5). Verified by a pure-function test AND a
  real-module e2e run of `templateWorksheet` (the exact fallback path):
  age 13 -> `71 x 90`, `1023 / 11`; age 7 -> `8 x 6`, `28 / 7`. All four of Chase's
  quality gates pass. **Merged + confirmed on prod (§3).**

- `012d467` — masked preset instructions (the chip -> Venice layer). Each edit chip
  (harder/easier/longer/shorter/more questions) still shows ONE word but now sends
  Venice a concrete, template-specific instruction built from the stepper age, with
  a worked example along the template's natural dimension (more digits for
  arithmetic, more sides/faces for geometry, change/tax/discount for money). New
  `DIFFICULTY_HINTS` (all 30 templates) + `presetPrompt()` in
  `lib/resources/intent.ts`; `ChatMessage.display` so the bubble shows the word not
  the masked text; `app/resources/[templateId]/page.tsx` chips call `sendPreset()`.
  Each difficulty chip carries exactly one keyword so cumulative compounding holds;
  a generic grade-benchmark recital tested WORSE than baseline so it is deliberately
  NOT used. Verified: a 150-string audit (30x5) = 0 keyword failures, 0 theme
  triggers; a live-Venice quality test across arithmetic/geometry/money all move the
  right way (age 13 "harder" multiplication -> 3-digit x 2-digit not times tables;
  money "harder" doubles change/tax, "easier" -> whole-dollar <= $20). Type-clean.
  **Merged + confirmed on prod (§3).**

## 2. Verified working

- AI generation is LIVE on prod (Venice, `source: ai` confirmed via the API).
- Generation is on-template for all 30 (deterministic stress test passed 222/222).
- Difficulty scales with age and "make it harder" compounds each press — verified
  in the real UI: age-13 multiplication went 2-digit then 4-5 digit across presses.
- Multiplication contains only multiplication (verified, no subtraction phrasing).
- Money: cents for age 9+, whole-dollar for young (verified deterministic builder).
- Commutative dedupe runs on both AI and fallback output.
- Glass on every button; copy-paste feedback popup; privacy page + header/footer
  links; typewriter hero — all verified in preview.

## 3. CONFIRMED ON PROD — 2026-06-22 (the PENDING items are now CLOSED)

Branch `claude/silly-rubin-e31ec9` was merged to main (`1150413`) and deployed:
prod deployment `dpl_FytLsMrj2UqP5DvK15CM7Q198x3j`, sha `1150413`, target
production, READY, aliased to hisprout.app. Full battery run on hisprout.app:

- **Age source — CONFIRMED on prod (the long-pending item).** Driven through the
  real prod UI: created a child profile age 7, selected it (stepper defaulted to 7),
  then bumped the stepper to 13. Every outgoing request carried the STEPPER age
  (captured ages 8,9,10,11,12,13), the final request `age:13`, and the rendered
  sheet was "Testkid's Multiplication" with 3-digit x 2-digit problems (426x38,
  509x47...). The profile age 7 did NOT override the stepper. Test child removed
  after (localStorage clean).
- **Fallback cap — CONFIRMED on prod (the important one).** Forced the fallback by
  rate-limiting Venice with a concurrent burst (3 of 42 calls returned
  `source: template`). The fallback responses: mult age 13 multi-digit (92x67,
  96x31, max operand 96 — NOT 4x6), mult age 7 friendly times tables (8x5, 2x7,
  max 8), div age 13 multi-digit dividend (712/8, max 1023). The fallback that
  looked broken on prod every time is now correct on prod.
- **Masked presets — CONFIRMED on prod.** Captured the actual chip-click request on
  the prod UI: clicking "harder" sent `content:"Make this harder for a 10-year-old:
  up to 3-digit by 2-digit, like 426 × 38, never times tables..."` with
  `display:"harder"` — the bubble showed only the word, the model got the masked
  instruction built from the stepper age. Sheet stepped up to multi-digit. Also
  via API on prod: shapes "harder" skews advanced / "easier" basic; money "harder"
  decimals + change/tax / "easier" whole-dollar <= $20. All directions correct.
- **Build-your-own + Community social layer (`f3bed5e`) — CONFIRMED.** Full
  click-through verified on the Vercel PREVIEW first (layout half-width + tints;
  publish gate both ways — template/edited-template show no Publish, custom
  publishes; community "Made with Sprout by {name}" → maker profile; seed credits
  resolve; how-this-works bubble + presets-gating). Then on PROD: freeform Venice
  generation returns a REAL topic-titled sheet ("The Solar System" with an accurate
  reading passage + comprehension questions), NOT the retry fallback. No test data
  was published to the live Community. NOTE: the Venice key is Production-scoped, so
  preview deploys can't do freeform gen (they show the customFallback) — expected.
- **Custom-sheet blank-PDF fix (`64c0e21`) — CONFIRMED (deployed) on prod.** Bug:
  freeform sheets exported a blank PDF (templates were fine). Root cause, diagnosed
  by measuring `.print-area` in the live app: the builder's tailwindcss-animate
  entrance wrapper keeps a transform, which makes it the containing block for the
  absolutely-positioned sheet; out of flow, that wrapper collapses to 0 height (and
  the builder grid pins it to one 360px column), so `inset:0` resolved to 360x0 and
  `overflow-hidden` clipped it. Fix (print CSS only, `app/globals.css @media print`):
  kill entrance animations in print (`[class*="animate-"]{animation:none;
  transform:none;filter:none}`) so the sheet anchors to the page, and use `top:0` +
  auto height + `overflow:visible` (not `inset:0`) so tall sheets paginate. No grid
  rule touched -> the worksheet's internal math grids are preserved. Verified: live
  measurement (360x0 -> full-size box anchored to MAIN), on-screen render of the
  real prod sheet (full content), headless Chrome (15-question sheet -> 2 pages,
  content on both), template still renders full with columns, and the exact fixed
  `@media print` rules confirmed present in the DEPLOYED prod CSS. (The literal
  native PDF-button click wasn't automated cleanly — Chase's Chrome spans a second
  monitor / multiple windows and is read-tier — but everything that determines the
  output is confirmed; a single click on prod is the only manual step left.)

- **Print pagination + banner/mascot colors (`3b893d4`) — CONFIRMED on the live prod
  deploy.** The `64c0e21` blank fix used `position:absolute; top:0`, which renders on
  ONE page and clips overflow — so on a real (taller) prod sheet everything after page
  1 (the math section + draw box) was silently dropped, the green banner's white
  title/subtitle printed muddy gray, and the header mascot printed white/invisible.
  Three fixes, print CSS only (`app/globals.css @media print`): (1) `.print-area`
  switched to `position:static` (normal flow) so a tall sheet PAGINATES instead of
  clipping — abspos elements can't fragment across pages; (2) `[class*="360px"]
  {display:block}` flattens ONLY the builder's 360px chat/preview grid so the sheet
  fills the page (the worksheet's own `grid-cols-2/3` math grids are untouched);
  (3) `print-color-adjust:exact` on the sheet for the banner colors, plus
  `.print-area svg [fill^="url("]{fill:#4e9a3e}` because the mascot fills via a
  `url(#gradient)` whose id is reused across the page and resolved to a `display:none`
  (`.no-print`) instance in print, leaving it unpainted. Verified the RIGHT way this
  time (the earlier blank-fix verification used a synthetic repro that passed while
  prod clipped): pulled the ACTUAL live prod sheet's HTML + the live deployed CSS
  (`0hl1u-b5a7egm.css`) through headless Chrome `--print-to-pdf` (real Blink engine).
  A tall custom sheet (rainforest: passage + 8 questions + column math + word bank +
  draw box) AND the multiplication template both render 2 pages, with the math
  columns + draw box on page 2, math columns intact, banner title/subtitle white
  (~248,248,248), and mascot green (header + footer). Confirmed hisprout.app serves
  SHA `3b893d4` (deployed CSS carries the new rules, old `position:absolute` print rule
  gone). Zero footprint — generated, tested, discarded; nothing saved or published.

- **Resource MODES + honest visuals (`d694a2e`) + field coercion (`e56a5bd`) —
  CONFIRMED on the live prod deploy.** Fixes the "everything renders as a flat
  intro-then-questions doc" problem. `detectMode` routes each request to teach |
  practice | activity; structure adapts per mode instead of one fixed frame.
  Practice keeps the EXACT old `SYSTEM` + path, byte-for-byte (math/etc.
  unchanged). TEACH (freeform "teach me about X"): `SYSTEM_TEACH` leads with a
  hook + 2-4 headed teaching passages + `fact` callouts + an `image`, questions
  optional and last (<=3). ACTIVITY (freeform color/maze/trace + the
  color-by-number/draw-label/life-cycle templates): `SYSTEM_ACTIVITY`, real
  line-art, tiny instructions. New blocks: `fact` (did-you-know) + `image`
  (curated SVG by `svgKey`, `lib/resources/svg-art.ts`, 24 stroke-only keys that
  print as dark line art and dodge the url()-fill print rule). Visual honesty: an
  invalid/invented `svgKey` degrades to an honest draw box; the model may never
  write a picture as text. The validator was reweighted FIRST so teaching-rich
  sheets (passages scored by sentence; fact/image/draw count) stop being
  discarded as "weak". **Field coercion (`e56a5bd`):** the renderer reads one
  primary field per kind; if the model packs content elsewhere (e.g. a math
  equation in `text` when the renderer reads `items`) normalize moves it. Covers
  all items-based kinds (math, column-math, fill-blank, count, missing-numbers,
  multiple-choice, short-answer) + word-bank, so a misplaced field never renders
  blank again. Prod-verified live (`source: ai`): "teach my 6-year-old about the
  ocean" -> TEACH ("The Amazing Ocean": hook -> 3 passages -> 3 facts -> whale
  image -> 3 light Qs); "color by number fish" -> ACTIVITY (fish image + color
  key + 6 math blocks, every equation in `items` after the coercion). Note: a
  burst of generations can hit Venice's rate limit and fall back to the template
  engine (`source: template`); it recovers after a short cooldown. Lesson for any
  future block kind: the renderer reads ONE field per kind, so either emit that
  field or add a coercion in normalize.

Nothing is pending prod re-test anymore. (Earlier dev/local verification notes for
these moved here once confirmed live.)

## 4. Locked product decisions (do not relitigate)

- **The stepper age is the ONLY thing that drives difficulty.** The child's
  profile age is identity/metadata only. Selecting a child MAY default the stepper
  to their age, but it must NEVER override the stepper after that. The age in the
  outgoing request == the stepper age, no exceptions.
- Difficulty is grounded in an age benchmark (`ageBenchmark()` → US grade bands;
  age 13 = Grade 6-8). Not ungrounded guessing.
- Commutative pairs are deduped — never `7x11` and `11x7` (or `a+b`/`b+a`) on one
  sheet (`dedupeWorksheet`).
- A multiplication sheet contains ONLY multiplication. Word problems match the
  template's operation.
- Money scales to dollars-and-cents (decimals, change/discount/tax) for age 9+;
  whole-dollar only for ages 6-8.
- "Make it harder" is cumulative (each press compounds) and must NEVER return
  easier output.
- Chat presets are the 5 edit controls only (harder, easier, longer, shorter,
  more questions). No theme chips.
- Feedback is a copy-paste template popup (warm note + editable template + Copy
  button + the destination email). NO mailto / no opening the mail app.
- The privacy page (`/resources/privacy`) is linked from the header ("Privacy")
  and the footer. It names the exact Venice model, states data is not stored/kept/
  trained-on and is the user's, and links to https://venice.ai/privacy as proof.
- (Earlier locks still hold: child profiles are first-class; social is local-first
  pending a Supabase backend; child names auto-capitalize everywhere.)

## 5. KNOWN OPEN RISK — local vs prod gap (most important thread)

**Likely root cause FOUND this session (2026-06-22).** For the *difficulty* gap
specifically, it was not a cache/env gap at all: the deterministic FALLBACK
capped mul/div at the 12x times tables for every age. Prod runs Venice (correct,
multi-digit) until Venice is slow or rate-limited, then it silently falls back to
the capped engine. Same code, different Venice availability = "fine in dev, broken
on prod." Fixed in `931a24f` (see section 1). NOTE: while probing I rate-limited
the Venice key with ~40 rapid calls and prod started returning `source: template`;
it recovered on its own. So sustained traffic CAN push prod onto the fallback.

For any OTHER "fixed in dev, broken on prod" bug, still run the checklist:

CC's fixes have verified in DEV but Chase has REPEATEDLY hit them still broken on
PROD. There may be an environment/caching gap between local and production. If a
"fixed" bug survives on prod, investigate the gap BEFORE assuming the code is wrong:
- Confirm the prod deployment's commit sha matches `HEAD` and its `target` is
  `production` and state is `READY` (Vercel MCP `list_deployments`).
- Confirm env vars are present on the production deployment (they snapshot per
  deploy; a stale deploy can run old env). `VENICE_API_KEY` must be set.
- Rule out browser cache: hard-refresh / incognito on hisprout.app.
- Hit the prod API directly (`POST https://hisprout.app/api/resources/generate`)
  to separate "prod serving stale code" from "browser cached".

## 6. NEXT PRIORITY — none queued; this session's work is shipped + prod-confirmed

**Both builds shipped and CONFIRMED on prod (§3):** cap fix `931a24f`, masked
presets `012d467`, merged as `1150413`. The age-source item that had been pending
across sessions is also confirmed closed. No specific next build is queued — pick
the next item from the broader Resources roadmap (`docs/RESOURCES.md`) with Chase.

**The masked-preset findings are kept below as the record of WHY it is built this
way — DO NOT re-derive.** Tested against LIVE Venice (prod endpoint, multiplication
age 13, 3 reps each):

- **Output genuinely changes.** "easier" -> max product ~70; baseline ~8.4k; a
  concrete "harder" -> ~42k. Confirmed not-just-the-prompt.
- **Concrete, template-specific phrasing WINS.** "make it harder; 3-digit by
  2-digit like 426 x 38, never times tables" reliably produced the hardest output.
- **A generic benchmark RECITAL BACKFIRED.** Pasting "Grade 6-8: fractions,
  decimals, percentages..." came back EASIER than baseline (it diluted the
  multiplication signal). So the lever is a concrete per-template escalation WITH an
  example, NOT a longer generic prompt. The benchmark is already in `buildMessages`
  (`benchNote`); do not re-recite it in the ask.
- **Design to implement:** each chip sends `"Make this {harder/easier} for a
  {age}-year-old. For this worksheet that means {concrete per-template hint + an
  example}..."`, ONE difficulty keyword per send (so cumulative compounding stays
  intact), chip still shows one word. Will need a per-template hint map (likely
  `harder`/`easier` fields on `TEMPLATE_INTENT`) + a `presetPrompt()` composer +
  a `display?: string` on `ChatMessage` so the bubble shows the word, not the
  hidden prompt. NOT YET BUILT.

**The original spec —**
**Mask the chat presets behind fuller prompts to Venice.** Right now each preset
chip just does `setInput(k.word)` — it drops the literal word ("harder") into the
chat input. Rework so each preset sends a FULLER, behind-the-scenes instruction to
the model while the user still sees only the one-word label. Example: clicking
"harder" should send something like "make this noticeably harder for a 13-year-old;
reference what a Grade 7-8 student is learning (multi-digit, multi-step, fractions/
decimals)" — built from the current age + `ageBenchmark` + the template intent.

- Test several prompt phrasings against the live Venice model and confirm the
  OUTPUT actually changes (not just the prompt). Compare difficulty before/after.
- Relevant code: presets render in `app/resources/[templateId]/page.tsx` (the
  vocab chips, `INPUT_VOCABULARY.edits`). The hidden-prompt mapping can live there
  (compose a richer message on click) or in `lib/resources/generate.ts` /
  `intent.ts`. `ageBenchmark` + `intentPreamble` already exist to draw context from.

## File map (so nothing needs re-explaining)

- `lib/resources/generate.ts` — the engine. `templateWorksheet()` (deterministic,
  subject-aware per template, the reliable fallback), `aiWorksheet()` (Venice),
  `buildMessages()` (the prompt: intentPreamble + ageBenchmark + diffNote +
  numeric target), `scaleFactor`, `detectDifficulty` (cumulative net up-down),
  `dedupeWorksheet`, `ageBenchmark`, per-template block builders.
- `lib/resources/intent.ts` — `TEMPLATE_INTENT` (per-template grounding), `THEMES`,
  `EDIT_KEYWORDS`, `INPUT_VOCABULARY`, `detectTheme`, `intentPreamble`.
- `lib/resources/catalog.ts` — the 30 `TEMPLATES`, `TOPICS`, topic mapping.
- `lib/resources/store.tsx` — local-first store (account, kids, worksheets,
  moments, likes) + `capName`. `lib/resources/util.ts` — `capName`.
- `app/resources/[templateId]/page.tsx` — builder UI: age stepper, "Making for"
  child selector, chat + presets + send, `runGenerate` (sequence guard + debounce),
  variation controls, thinking trace + streaming bubble components.
- `app/api/resources/generate/route.ts` — POST endpoint: clamps age 3-13, reads
  the Venice key (name-tolerant), tries AI then falls back, applies `dedupeWorksheet`.
- `app/resources/page.tsx` — library (search/filters/tabs/profiles/community).
- `app/resources/layout.tsx` — header (profile chip, Feedback, Privacy, Back to
  site), `GlassFilter`, footer privacy link.
- `components/ui/glass.tsx` — the glass primitives. `app/resources/_components/`:
  `FeedbackButton.tsx`, `Typewriter.tsx`, `WorksheetDoc.tsx`, `AccountChip.tsx`.
- `app/resources/privacy/page.tsx` — the privacy page.

## Venice / generation config

- Model `qwen3-235b-a22b-instruct-2507` (code default; prod needs no `VENICE_MODEL`
  env). Key read tolerates `VENICE_API_KEY` / `VENUS_API_KEY` / `VENICE_INFERENCE_KEY`.
- `temperature: 0.55`, `venice_parameters.include_venice_system_prompt: false`,
  NO `response_format` (qwen rejects it; rely on strict-JSON instruction + tolerant
  parser). Venice is private/no-train (the privacy promise).
