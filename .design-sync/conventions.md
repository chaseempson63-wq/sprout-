# Sprout Brand Kit — how to build with it

This is Sprout's **marketing & social** design system: a continuous forest-green
canvas, frosted cream glass, one warm rounded typeface (Nunito), cream-on-forest
CTAs. It exists to make on-brand marketing images and social posts. Match the
landing page (hisprout.app) exactly. **No serifs anywhere.**

All components live on `window.SproutDS`: `GradientCanvas`, `GlassCard`,
`CtaButton`, `PaletteCard`, `TypographyCard`, `SocialPost`, `CarouselSlide`.

## Wrapping and setup

Every marketing image sits on the **green canvas**. Wrap any composition in
`<GradientCanvas>` (or the `.sprout-canvas` class): it paints the fixed
forest-green gradient + noise + wave bands + orbs, and text inside inherits
Sprout Cream. Without it you get unstyled black-on-white — that is off-brand.

- Fixed-size posters: put content in a `.sprout-poster` frame
  (`--square` 1:1, `--portrait` 4:5, `--story` 9:16). The frame sets
  `container-type: inline-size`, so size type and spacing in **`cqw`** units
  (1cqw = 1% of the poster width) and one component renders identically at
  card size or a full 1080px export.
- `GlassCard` (`.sprout-glass`) only reads correctly **on the green** — never on white.

## The styling idiom

Style with **props + Sprout utility classes + CSS variables** — never invent
class names or colours. The vocabulary shipped in `styles.css`:

- **Type** (hierarchy is weight + size, one family): `.sprout-display` (800,
  tight tracking), `.sprout-subhead` (700), `.sprout-body` (400),
  `.sprout-eyebrow` (700, uppercase, tracked — for small all-caps labels).
- **Surfaces**: `.sprout-canvas` (+ `__noise`, `__waves`, `__orb`, `__content`),
  `.sprout-glass` / `.sprout-glass--soft`, `.sprout-poster` (+ `--square`,
  `--portrait`, `--story`).
- **CTA**: `.sprout-cta` (cream pill, forest text — the default), plus
  `.sprout-cta--glass` (frosted secondary), `.sprout-cta--sm` / `--lg`.
- **Colour tokens** (`var(--…)`): `--sprout-forest` `--sprout-deep`
  `--sprout-mid` `--sprout-sage` `--sprout-cream` `--sprout-ink`; canvas stops
  `--sprout-canvas-1/2/3`, waves `--sprout-wave-hi/mid/lo`, `--sprout-orb`;
  glass `--sprout-glass-bg` / `-bg-soft` / `-border` / `-border-soft` /
  `-shadow`; type `--sprout-font`, `--sprout-tracking-display/-eyebrow`.

## Hard brand rules

- **Nunito only, no serifs.** The old Cormorant carousel style is retired.
- **CTAs are CREAM with FOREST text, one per composition. Never lime.**
- **Sage is a whisper** — decorative accents only, never primary.
- **Negative space is sacred** — keep 40%+ of a composition empty.
- Never pure black/white — use `--sprout-ink` / `--sprout-cream`.

## Where the truth lives

Read the design system's `styles.css` (and the `_ds_bundle.css` it imports) for
the real token values and class rules, and each component's `.prompt.md` /
`.d.ts` for its props. Prefer reading those over guessing.

## One build snippet

```jsx
const { GradientCanvas, CtaButton } = window.SproutDS;

<div className="sprout-poster sprout-poster--square">
  <GradientCanvas style={{ position: 'absolute', inset: 0 }}>
    <div style={{ position: 'absolute', inset: 0, padding: '8cqw',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', gap: '4cqw' }}>
      <p className="sprout-eyebrow" style={{ fontSize: '3cqw', color: 'var(--sprout-sage)' }}>
        For homeschool families
      </p>
      <h1 className="sprout-display" style={{ fontSize: '11cqw' }}>Prove the week counted</h1>
      <CtaButton style={{ fontSize: '3.4cqw' }}>Save my spot</CtaButton>
    </div>
  </GradientCanvas>
</div>
```

For a whole post in one component, use `<SocialPost>` (or `<CarouselSlide>` for
carousels) and pass `eyebrow` / `headline` / `body` / `cta` / `format`.
