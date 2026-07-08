# Sprout Brand Kit — design-sync notes

This design system is **authored**, not extracted from a shipped component
library. Sprout's repo is a Next.js app (`app/`), not a component package. The
source of truth for the look is `docs/BRAND.md` and the live landing page
(`app/page.tsx`, hisprout.app). The synced components live in
`.design-sync/brand-kit/` (committed) and are built directly from source by the
converter — there is no separate `dist`.

## How this is built (re-sync recipe)

- Shape is `package`. Entry is the authored source, not a dist:
  ```sh
  node .ds-sync/package-build.mjs --config .design-sync/config.json \
    --node-modules ./node_modules \
    --entry ./.design-sync/brand-kit/src/index.tsx --out ./ds-bundle
  ```
  `--node-modules ./node_modules` is the Sprout app's own — that's where React 19
  resolves. There is no `sprout-brand-kit` package in node_modules, hence `--entry`.
- React 19 ships no UMD; the converter bundles React into `_vendor/react.js` via
  esbuild automatically (log line "react@… has no UMD — bundling via esbuild"). Expected.
- Styling: all CSS is in `.design-sync/brand-kit/styles/`. `src/index.tsx`
  imports `../styles/index.css`, so esbuild inlines everything (tokens, classes,
  and the two Nunito woff2 files as data-URIs) into `_ds_bundle.css`. `styles.css`
  `@import`s that, so designs get the full closure. No `cssEntry`/`extraFonts` needed.
- Fonts: Nunito latin + latin-ext variable woff2 in `brand-kit/fonts/`, pulled
  once from Google Fonts. Self-contained; no `[FONT_MISSING]`.

## Render verification

- Playwright/Chromium is NOT installed. Verified previews with headless Google
  Chrome instead (`/Applications/Google Chrome.app/.../Google Chrome --headless=new
  --screenshot`), then ran `package-validate.mjs ./ds-bundle --no-render-check`.
  All 7 cards were eyeballed on-brand. If a future run wants the automated gate,
  install Playwright and drop `--no-render-check`.

## Known render warns

- `[RENDER_SKIPPED]` on every validate run — expected, because we pass
  `--no-render-check` (see above). Not a new warn.

## Decisions / brand rules baked in

- **No serifs.** The Cormorant Garamond carousel exception is RETIRED (BRAND.md,
  founder's call 2026-07-08). CarouselSlide uses the main Nunito system.
- **No em dashes** in any visible copy or JSDoc (founder's hard rule). Numeric
  ranges (`8–15%`) use en dashes and are fine.
- Canvas gradient stops (`#2A5132 → #3D6643 → #1B3722`) come from the live
  `app/page.tsx`, NOT the BRAND.md locked hexes — they're the warmer rendered
  values. The PaletteCard documents the locked palette (Forest #1F4D2E etc.).
- Components are container-query sized (`cqw`) so one render works at card and
  full-export scale. `cardMode`/`viewport` overrides were not needed.

## Re-sync risks (what can silently go stale)

- **Landing-page drift.** If `app/page.tsx` or `app/globals.css` change the
  gradient, glass recipe, or type, this kit will NOT auto-update — it's a
  hand-mirrored copy. Re-diff `app/page.tsx` gradients + `components/ui/glass.tsx`
  against `brand-kit/styles/index.css` on any brand refresh.
- **Fonts pinned to Google Fonts v32.** The woff2 in `brand-kit/fonts/` are a
  point-in-time fetch. They won't change unless re-fetched; fine to leave.
- **Group is flat ("general").** All 7 sit in one group by design (no docs tree).
  The synthesized `.prompt.md` from JSDoc is high quality; don't add category
  stubs (they'd blank the prompt.md).
