# Archived landing sections

Sections removed from `app/page.tsx` but preserved here in case they're needed back. Paste-restorable: drop the JSX into page.tsx where the section was.

---

## Privacy Promise — "Your kid's stuff stays yours"

Removed: 2026-06-01.
Reason: founder call to tighten the page; flow goes Differentiator → Final CTA directly.

### Section context
- Eyebrow: `05 · Yours. Not ours. Not big tech's.`
- H2: `Your kid's stuff stays yours.`
- Three cards: data ownership / not ours to sell / not training big tech.

### JSX (current state at removal — mobile carousel + bullet copy)

```tsx
{/* ═══════════════════════════════════════════════════════════════
    PRIVACY PROMISE  (between Differentiator and Friday scene)
    Three-card explicit statement: data ownership, no selling, no
    AI training. Mobile: horizontal-scroll carousel.
    ═══════════════════════════════════════════════════════════════ */}
<section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-[#1B3722]/40 via-[#2A5132]/30 to-[#3D6643]/30" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#A4C9A8]/8 blur-3xl" />
  </div>

  <div className="relative max-w-5xl mx-auto">
    <CenteredEyebrow number="05" label="Yours. Not ours. Not big tech's." />

    <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream text-center max-w-3xl mx-auto mb-16 headline-lit"
        style={{ fontSize: "clamp(48px, 7vw, 80px)" }}>
      Your kid&apos;s stuff<br />stays yours.
    </h2>

    {/* Mobile: horizontal-scroll carousel, 1 card visible with peek.
        Desktop (md+): standard 3-column grid. */}
    <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-2 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <div className="flex-shrink-0 w-[85%] md:w-auto snap-start">
        <GlassCard className="p-7 rounded-3xl h-full" glow="warm" soft>
          <div className="text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">01 · You own it</div>
          <h3 className="font-bold tracking-tight text-sprout-cream mb-4" style={{ fontSize: "22px" }}>
            The data is yours.
          </h3>
          <ul className="space-y-2.5 text-sprout-cream/80" style={{ fontSize: "15px" }}>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>On your device. Backed up to your private cloud.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>Export anytime.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>Delete anytime.</span>
            </li>
          </ul>
        </GlassCard>
      </div>
      <div className="flex-shrink-0 w-[85%] md:w-auto snap-start">
        <GlassCard className="p-7 rounded-3xl h-full" glow="sage" soft>
          <div className="text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">02 · Not ours to sell</div>
          <h3 className="font-bold tracking-tight text-sprout-cream mb-4" style={{ fontSize: "22px" }}>
            We can&apos;t sell what isn&apos;t ours.
          </h3>
          <ul className="space-y-2.5 text-sprout-cream/80" style={{ fontSize: "15px" }}>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>You hold the captures, not Sprout.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>Architecture leaves us nothing to sell.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>Even if we wanted to.</span>
            </li>
          </ul>
        </GlassCard>
      </div>
      <div className="flex-shrink-0 w-[85%] md:w-auto snap-start">
        <GlassCard className="p-7 rounded-3xl h-full" glow="warm" soft>
          <div className="text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">03 · Not training big tech</div>
          <h3 className="font-bold tracking-tight text-sprout-cream mb-4" style={{ fontSize: "22px" }}>
            No AI in Sprout. None.
          </h3>
          <ul className="space-y-2.5 text-sprout-cream/80" style={{ fontSize: "15px" }}>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>Nothing summarises.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>Nothing learns from your kid.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sprout-cream/60" />
              <span>Big tech doesn&apos;t get a byte.</span>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  </div>
</section>
```

---

## Friday scene — "we did that"

Removed: 2026-06-01.
Reason: founder call to cut the page; flow goes Differentiator → Final CTA directly.

### Section context
- Eyebrow chip: `Friday afternoon`
- Main copy: "The printed week sits on the kitchen table, still warm. Charlie climbs up next to you and points at the volcano week — 'we did that.'"
- Sub: "Both of you see what the week was."

### JSX

```tsx
{/* ═══════════════════════════════════════════════════════════════
    SHARED MOMENT  (unnumbered scene between Why-Sprout and Pricing)
    Kitchen table on Friday — parent + kid + the printed week.
    Closes the emotional loop the 3am section opens. One scene, no
    marketing claims. Voice = founder, painted.
    ═══════════════════════════════════════════════════════════════ */}
<section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-[#2A5132]/30 via-[#3D6643]/20 to-[#1B3722]/40" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#94BC8E]/10 blur-3xl" />
  </div>

  <div className="relative max-w-3xl mx-auto text-center">

    <div className="inline-flex items-center gap-3 text-sprout-cream/55 text-[10px] uppercase tracking-[0.3em] font-bold mb-10 md:mb-12">
      <span className="block w-8 h-px bg-sprout-cream/30" />
      <span>Friday afternoon</span>
      <span className="block w-8 h-px bg-sprout-cream/30" />
    </div>

    <p className="text-sprout-cream/85 leading-snug"
       style={{ fontSize: "clamp(24px, 3.8vw, 44px)", lineHeight: "1.2" }}>
      The printed week sits on the kitchen table, still warm.
      Charlie climbs up next to you and points at the volcano
      week —{" "}
      <span className="text-sprout-cream italic">&ldquo;we did that.&rdquo;</span>
    </p>

    <p className="mt-8 text-sprout-cream/65 leading-relaxed max-w-xl mx-auto"
       style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}>
      Both of you see what the week was.
    </p>

  </div>
</section>
```
