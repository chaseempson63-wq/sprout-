# Sprout — Brand Brief

The visual brand specification. Pair this with [`MASTER.md`](MASTER.md) (which holds product/strategy) for the complete picture.

This doc is designed to be paste-able into any design tool (Claude Design, Midjourney, Figma, a hired designer's brief) and produce on-brand work.

---

## The brand in one sentence

Sprout is a **premium editorial wellness-tier homeschool product** — confident bold typography, real organic textures (grass, sprouts, new growth), glass and chrome decorative accents, deep forest greens with bright lime-green energy, on generous white space.

**Reference brands by mood (visual register):**
- Linear, Vercel, Arc Browser → confidence, restraint, premium-tech
- Calm, Headspace → immersive depth, glassmorphism
- Editorial fashion + lifestyle posters → bold type, real textures, magazine-quality composition
- Soul / Wellness brand poster aesthetic → grass-and-flower 3D type as hero

**Anti-references (we are NOT this):**
- Etsy / craft-store
- Mailchimp / corporate friendly
- Khan Academy / EdTech
- Day One / journal-app preciousness
- Any pastel-anything

---

## Color palette (locked)

### Primary

| Name | Hex | OKLCH (Tailwind v4) | When |
|------|-----|---------------------|------|
| **Sprout Forest** | `#1F4D2E` | `oklch(0.42 0.10 150)` | Primary brand, body confident moments, headings, section headers, button text on cream |
| **Sprout Deep** | `#0F2614` | — | Deepest green, page-bottom gradients, footer base |
| **Sprout Mid** | `#3A5F3F` / `#2D4F32` | — | Mid-tone gradients, organic background base |
| **Sprout Sage** | `#A4C9A8` | — | Soft accents, lighter gradient overlays, decorative |
| **Sprout Ink** | `#0F1311` | `oklch(0.15 0.01 150)` | Text on light surfaces, phone mockup interior |
| **Sprout Cream** | `#FDFDFD` | `oklch(0.985 0 0)` | Text on green backgrounds, **CTA buttons**, premium card backgrounds |
| **Sprout Lime** ⚠️ deprecated for v0.1 | `#D8FF9A` | — | Originally planned for CTAs but felt jarring against deep greens. **Retired in favour of cream-on-green.** May return as in-app accent indicators (status pills, etc.) but never as a primary CTA color. |

### Supporting

| Name | Hex / RGBA | When |
|------|-----------|------|
| **Sprout Sage** | `#A4C9A8` | Soft surfaces, secondary moments, decorative |
| **Sprout Glass (light)** | `rgba(15,19,17,0.06)` | Frosted card overlays on light backgrounds |
| **Sprout Glass (dark)** | `rgba(255,255,255,0.06)` | Frosted card overlays on dark backgrounds |
| **Sprout Border** | `oklch(0.92 0.005 150)` | Subtle dividers, borders, hairline separators |

### Usage rules

- **Forest is the brand.** When in doubt, lean into Forest as the dominant color choice.
- **CTA buttons are CREAM with FOREST text** on green backgrounds. This is the premium move — think Apple white-on-dark. Never lime.
- **Marketing pages are CONTINUOUS green canvas** — one fixed gradient behind the entire page, with each section adding its own gradient overlays + SVG waves for variation. No alternating cream/green sections (that breaks cohesion and readability).
- **Glass cards float on the green** with `bg-sprout-cream/8` to `bg-sprout-cream/15` + `backdrop-blur-xl` + `border border-sprout-cream/15`. Cream text inside. High contrast.
- **Sage is a whisper, not a shout.** Use for subtle decorative orbs, soft accent text, never primary.
- **Never use pure black (#000) or pure white (#FFF).** Always Ink and Cream — they're warmer and feel deliberate.
- **Lime is retired** for primary use (see palette table). May appear as small in-app status indicators only.

---

## Typography

### Locked: two-font system (updated 2026-05-14)

**Cabinet Grotesk** — display headlines (loaded via Fontshare CDN in layout.tsx).
- Use via `.font-display` utility class (defined in globals.css)
- Weights: 700 Bold, 800 Extra Bold for big display moments
- Letter-spacing: `-0.035em` (tight)
- Apply to ALL major H1/H2 headlines, big numbers ($29, $249), key card titles

**Geist Sans** (Vercel's font, free, geometric sans) — body text.
- Default font for everything that's not a display headline
- Weights: 400 Regular (body), 700 Bold (subheads, emphasis)
- No need for utility class — it's the default via `--font-geist-sans`

### Why two fonts now (was previously one)

Single-font system left headlines and body subheads visually too close — same family, similar weights, only size separation. Adding Cabinet Grotesk for display creates real hierarchy: bold geometric *display* sans for headlines, clean *body* sans for everything else. Premium editorial feel without going serif.

### Hierarchy in practice

| Tier | Font | Weight | Tracking | Example |
|------|------|--------|----------|---------|
| Display | Cabinet Grotesk | 800 Extra Bold | -0.035em | Hero h1, section h2s, $29, "Sprout" wordmark in cards |
| Subhead | Geist Sans | 700 Bold | tight | Card titles, eyebrow labels |
| Body | Geist Sans | 400 Regular | default | All paragraph text, captions |

### Rules unchanged

- One display font, one body font. Two weights of body only. Don't add more.
- All caps reserved for tracking-wide eyebrows + section labels.
- No italics in UI. Italics only for editorial poster moments + verbatim quote attributions.
- No serifs in app, landing, email, or weekly artifact.

### Scoped exception — IG/FB carousels (added 2026-05-21)

**Cormorant Garamond** (Google Fonts, free) is the locked serif for typographic IG/FB story-arc carousels only.

- Channel scope: IG carousels + FB carousels. Nowhere else. Not landing, not app, not artifact, not email.
- Why: warm, editorial, book-feeling register is the right match for story-arc carousels aimed at homeschool mums. Cabinet Grotesk's premium-tech register fights the warmth the format needs. See `~/.claude/skills/sprout-truth/playbooks/instagram-carousel.md` for the full reasoning and layout rules.
- Weights: 500 Medium for hooks, 400 Regular for texture/reframe lines. No Bold (the serif's own weight carries it).
- Colour pairings: Sprout Forest type on Sprout Cream background, or Sprout Cream type on Sprout Forest background. Never on white. Never on lime.
- Fallback: EB Garamond if Cormorant unavailable for any reason.

This is a **scoped exception, not a brand evolution.** Cabinet Grotesk + Geist Sans remain the system for everything else.

### Type scale

Display tier (landing hero, "wow" moments):
- Desktop: 96px - 160px
- Mobile: 48px - 80px
- Tracking: `-0.02em` (tight)
- Weight: Bold (700)

Heading tier:
- H1: 48-64px desktop / 32-40px mobile
- H2: 32-40px desktop / 24-28px mobile
- H3: 24-28px desktop / 20-22px mobile

Body tier:
- Large: 18-20px (lead paragraphs, hero subtitles)
- Default: 16px (most body)
- Small: 14px (captions, secondary)
- Micro: 12px (footnotes, legal, registration marks)

### Typography rules

- **One typeface throughout the entire brand**, with one scoped exception: Cormorant Garamond on typographic IG/FB carousels only (see "Scoped exception" above). Never mix on a single surface.
- **Two weights only.** Never use Light, Medium, or Black variants.
- **Bold for type that has confidence to assert.** Regular for everything else.
- **Tight tracking on display tier.** Loose tracking is for editorial small-caps moments only.
- **No italics in the UI.** Italics only allowed in editorial poster contexts (rare).
- **Body line-height: 1.5-1.6.** Display line-height: 0.95-1.0 (tight).

---

## The premium feel — concrete rules

### 1. Editorial composition

Not "marketing landing page." Think **premium magazine cover** or **Apple keynote slide**.
- Massive single focal element per screen
- Generous negative space (40%+ of canvas should be empty)
- One main subject per composition
- Asymmetry over symmetry when it serves the eye

### 2. Real-world textures (the brand metaphor)

Sprout is built on the metaphor of **real, organic growth.** Visuals reference:
- Real grass, real sprouts, real seedlings, real soil
- Photoreal or 3D-rendered, never illustrated cartoons
- Macro / close-up photography of plants
- Soft natural light, never harsh

### 3. Glass + chrome decorative accents

Small, intentional, sparse. Signal "premium product" without taking center stage.
- Chrome / glass flower icons (decorative garnish)
- Frosted glass cards (used in app interior, occasionally on marketing)
- Subtle glass orb shapes
- Used as **garnish, never the main course**

### 4. Editorial supporting marks

The "premium magazine" signals. Used very sparingly:
- Registration crosshairs in a corner of a poster
- A date stamp ("01.08.2026")
- A small barcode treated as design element
- Tiny iconographic accents (asterisk, compass rose, sun mark)

### 5. Negative space is sacred

- At least 40% of any composition should be empty
- The eye needs room to rest
- Crowded ≠ valuable

### 6. CTAs

- One per screen. Never two competing.
- **Sprout Lime** background, **Sprout Ink** text
- Pill-shape or rounded rectangle (12-16px radius)
- Large enough to be unmissable, never gaudy
- Hover: subtle brightness increase, not transform/shadow

### 7. No fakery

- No gradients on flat type
- No drop shadows on text
- No glow effects on text
- Decorative elements may have soft glow, type does not
- The type is bold enough on its own

### 8. Photography style (when used)

- Warm, natural light
- Slightly desaturated
- Cinematic / documentary feel
- Never stock-photo bright
- Never staged "happy family" energy
- Real moments — kid's hands at work, books on a kitchen table, a parent's quiet pause

### 9. Motion

- Subtle is the rule
- Frosted glass cards shift slightly on scroll
- Sprout textures sway gently (if animated)
- Never aggressive parallax
- Never spinning loaders (use skeleton states)
- Calm motion only

### 10. The keynote test

If it would feel at home in a Linear, Arc Browser, or Apple keynote — it's right.
If it would feel at home in a generic SaaS landing template — it's wrong.

---

## Image generation prompts (paste-ready)

### Hero asset — the 3D Sprout wordmark

For Claude Design or Midjourney. The single most important brand asset.

```
A 3D render of the word "SPROUT" as massive bold black sans-serif uppercase
letters on a clean white background. Hyper-realistic green grass, small white
wildflowers, and tiny green seedlings grow through and out of the letterforms,
as if the letters themselves are alive and growing. Soft natural lighting,
editorial poster aesthetic, premium magazine cover style. Generous negative
space around the type. Subtle chrome and glass flower accents floating
nearby as small decorative elements. Square aspect ratio. Inspired by
editorial design like Soul Bloom posters — but cleaner, more confident,
more premium. Photorealistic textures, depth of field, high detail.
```

### Hero variant — for blog headers or secondary marketing

```
A hyperrealistic 3D render of a single new green sprout breaking through
dark soil into a clean white space, with one tiny droplet of water on the
leaf. Soft natural lighting from upper left, editorial product photography
style, generous negative space, premium magazine quality, square format.
```

### Macro / texture asset — for landing page sections

```
Hyperrealistic close-up macro photograph of fresh green grass blades with
small dewdrops, slightly desaturated, soft natural light, editorial
photography, premium magazine quality. Clean composition with generous
negative white space at the top half of the frame.
```

### App interior background texture

```
A subtle dark abstract background in deep almost-black forest green
(#0F1311), with very faint hints of organic plant growth at the edges
and soft ambient glow. Premium app UI background, glassmorphic style,
calm and immersive. Designed to sit behind glass cards and white text.
4K resolution, subtle depth without distraction.
```

### Brand pattern / decorative repeat

```
A minimalist seamless tile pattern of tiny green sprout silhouettes
scattered sparsely on a clean cream background (#FDFDFD). Editorial
print style, very subtle, suitable for use as a background pattern at
3-5% opacity. Premium feel.
```

### "Made with Sprout" watermark element

```
A small minimalist logo lockup: a simple geometric sprout / leaf icon
in deep forest green (#1F4D2E) next to the wordmark "Made with Sprout"
in bold sans-serif. Clean, professional, designed to be unobtrusive
when placed in the corner of a document. Square aspect ratio with
transparent background.
```

---

## Brand do's and don'ts (visual)

### DO

- Massive bold black or forest-green typography
- Real organic textures (grass, sprouts, leaves) as hero elements
- Generous negative space around all elements
- Glass and chrome decorative accents (sparingly)
- Editorial supporting marks (registration crosshairs, date stamps, etc.) in poster contexts
- Single focal point per composition
- Lime green CTAs only — never lime as a background
- Warm, slightly desaturated photography (when photos are used)
- One typeface, two weights
- Calm, subtle motion

### DON'T

- Cartoon illustrations of plants
- Pastel colors
- Cute kid illustrations or emoji-style plants
- Stock photography of smiling families
- EdTech aesthetics (charts, graphs as hero elements)
- Multiple competing focal points in one composition
- Gradient overlays on type
- Soft drop shadows on text
- Spinning or pulsing loaders
- Pop-up modals interrupting the landing experience
- Cookie banners that demand attention
- Three or more font weights anywhere
- Pure black (#000) or pure white (#FFF) — always Ink and Cream
- Excessive parallax or animation

---

## Voice → visual translation cheat sheet

Sprout's voice is **direct & confident** (Linear/Vercel register). The visual brand needs to reinforce this:

| Voice principle | Visual equivalent |
|-----------------|-------------------|
| Short sentences, no fluff | Short visual statements, no decorative noise |
| No exclamation marks | No glow, sparkle, or "shiny" effects on type |
| Respects the reader's intelligence | Doesn't over-explain with stock graphics |
| Warmth comes through what's said | Warmth comes through real organic textures, not soft pastels |
| AU/NZ English | Subtle southern-hemisphere sensibility — confident but not American-loud |

---

## Working with this brand

### When generating new visual work

1. Check this doc first.
2. Use the locked palette codes — never invent new colors.
3. Start every image gen prompt with the "premium editorial wellness-tier" framing.
4. Make sure the result passes the **keynote test** (Linear/Arc/Apple, not generic SaaS).
5. If unsure, default to: **less is more, real over illustrated, bold over decorative.**

### When updating this doc

- Add new image gen prompts here as we discover what works
- Lock in the final font choice when Chase decides
- Add real Midjourney / Claude Design output examples once we have them (best 3-5 hero renders saved as reference)

---

*This is the visual source of truth. Pair with MASTER.md for product context. Pair with CLAUDE.md for cofounder working agreement.*
