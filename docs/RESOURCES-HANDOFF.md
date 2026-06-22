# Sprout Resources — session handoff

Read this first when resuming work on the Sprout Resources worksheet platform.
It is the single source of truth for current state, locked decisions, the open
risk, and the next job. Last updated end of the session that shipped `3deae6c`.

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

## 3. PENDING CHASE'S PROD RE-TEST (NOT closed)

- **The age-source fix is verified in DEV only.** With Chase (profile age 7)
  selected and the stepper at 13, the outgoing request carried age 13 and the
  rendered sheet was multi-digit. BUT Chase still needs to confirm this on the
  LIVE prod deploy before it is considered done. Do not assume it is closed.

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

CC's fixes have verified in DEV but Chase has REPEATEDLY hit them still broken on
PROD. There may be an environment/caching gap between local and production. If a
"fixed" bug (especially the age bug) survives on prod, investigate the gap BEFORE
assuming the code is wrong:
- Confirm the prod deployment's commit sha matches `HEAD` and its `target` is
  `production` and state is `READY` (Vercel MCP `list_deployments`).
- Confirm env vars are present on the production deployment (they snapshot per
  deploy; a stale deploy can run old env). `VENICE_API_KEY` must be set.
- Rule out browser cache: hard-refresh / incognito on hisprout.app.
- Hit the prod API directly (`POST https://hisprout.app/api/resources/generate`)
  to separate "prod serving stale code" from "browser cached".

## 6. NEXT PRIORITY — first build of the next session

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
