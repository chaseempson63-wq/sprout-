import Link from "next/link";
import { Plus, ArrowRight, Check } from "lucide-react";
import { SproutLogo, GlassCard, GLASS_CARD_SOFT, FloatingGlass } from "./_components/Glass";
import {
  PhoneFrame,
  PhoneScreenDropIn,
  PhoneScreenMemory,
  PhoneScreenReport,
  PhoneScreenYear,
} from "./_components/Phone";
import {
  SectionEyebrow,
  CenteredEyebrow,
  FeatureBlock,
  VerbatimCard,
} from "./_components/Sections";
import { PhoneShowcase } from "./_components/PhoneShowcase";
import { Mascot } from "./_components/Mascot";
import { Waitlist } from "./_components/Waitlist";

/* ─────────────────────────────────────────────────────────────────────
   Sprout landing page v2 — structural rebuild against bevel.health
   layout. All Sprout brand, copy, colors, fonts stay exactly as on
   app/page.tsx. The shape changes: product shown before explained,
   social proof distributed at 3 distinct points, feature blocks
   repeat the same 2-column shape, final CTA mirrors the hero.
   ───────────────────────────────────────────────────────────────────── */

export default function HomeV2() {
  return (
    <main className="text-sprout-cream min-h-screen overflow-x-hidden relative">

      {/* Continuous green canvas — same brand surface as v1 */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132] via-[#3D6643] to-[#1B3722]" />
        <div className="absolute inset-0 opacity-[0.10] mix-blend-overlay pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'a\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23a)\'/%3E%3C/svg%3E")'
        }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HERO  (bevel position 2 — heading + sub + CTA + rating badge)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col">

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4D7B53]/40 via-transparent to-[#2A5132]/60" />
          <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,400 C320,280 480,520 720,420 C960,320 1120,560 1440,440 L1440,900 L0,900 Z" fill="#76A77A" opacity="0.15" />
            <path d="M0,560 C240,460 560,640 880,540 C1120,460 1280,620 1440,560 L1440,900 L0,900 Z" fill="#4D7B53" opacity="0.4" />
            <path d="M0,700 C320,620 720,800 1100,720 C1300,680 1380,740 1440,720 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.7" />
          </svg>
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[#94BC8E]/15 blur-3xl animate-drift-1" />
          <div className="absolute bottom-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-[#76A77A]/10 blur-3xl animate-drift-2" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-2 text-sprout-cream font-bold text-lg">
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </div>
          <Link
            href="#start"
            className="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors"
          >
            Save my spot
          </Link>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-3xl w-full">

            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-[10px] md:text-xs uppercase tracking-[0.18em] md:tracking-[0.25em] font-semibold whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
                For parents who walked away
              </div>
            </div>

            <h1 className="text-center font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                style={{ fontSize: "clamp(64px, 11vw, 140px)" }}>
              You did more<br />than you think.
            </h1>

            <p className="mt-10 text-center text-sprout-cream/85 leading-relaxed max-w-xl mx-auto"
               style={{ fontSize: "clamp(17px, 1.6vw, 21px)" }}>
              It&apos;s 11pm on Wednesday night and you&apos;re wondering if
              today counted. The endless pages of notes, the endless tabs, and
              the book they scribble in scattered everywhere. Sprout is where
              you document what your homeschooling week actually was. Clarity
              for you. A sense of achievement for them.
            </p>
            <p className="mt-5 text-center text-sprout-cream font-bold leading-relaxed max-w-xl mx-auto"
               style={{ fontSize: "clamp(16px, 1.5vw, 19px)" }}>
              Preserving Human Intelligence &mdash; Growing The Next Generation.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
              <Link
                href="#start"
                className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-base hover:bg-[#FBF6EB] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sprout-cream/40"
              >
                Save my spot
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Hero-tier social proof — stripped to single label, sized to
                match the top audience pill for visual consistency. */}
            <div className="mt-14 flex justify-center">
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-[10px] md:text-xs uppercase tracking-[0.18em] md:tracking-[0.25em] font-semibold whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
                Voiced by real homeschool mums
              </div>
            </div>

          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between px-6 md:px-12 pb-8 text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <SproutLogo className="w-3 h-3 text-sprout-cream/50" />
            <span>SPROUT·CO</span>
          </div>
          <div className="flex items-center gap-2">
            <span>SCROLL</span>
            <span className="block w-px h-8 bg-sprout-cream/30" />
          </div>
          <div className="font-mono text-[9px]">
            ‖‖‖ ‖‖ ‖‖‖‖ ‖ ‖‖‖
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRODUCT SHOWCASE STRIP  (bevel position 3 — show before explain)
          Three phone screens, side-by-side, no copy on top.
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B3722]/30 via-[#3D6643]/40 to-[#2A5132]/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-[#94BC8E]/8 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <PhoneShowcase>
            <PhoneFrame tilt="rotateY(15deg) rotateX(4deg)">
              <PhoneScreenDropIn />
            </PhoneFrame>
            <PhoneFrame tilt="rotateY(0deg) rotateX(2deg) translateZ(20px)">
              <PhoneScreenReport />
            </PhoneFrame>
            <PhoneFrame tilt="rotateY(-15deg) rotateX(4deg)">
              <PhoneScreenYear />
            </PhoneFrame>
          </PhoneShowcase>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF #1 — VERBATIM WALL
          (bevel position 4–5: logo wall + awards. Sprout has no
          integrations to brag about, so we lean on what we DO have:
          verbatim quotes pulled from real forum threads.)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#2A5132]/40 via-[#3D6643]/30 to-[#4D7B53]/30" />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-[#A4C9A8]/8 blur-3xl animate-drift-1" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <CenteredEyebrow number="01" label="Pulled from real forum threads" />
            <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream max-w-3xl mx-auto"
                style={{ fontSize: "clamp(40px, 6vw, 64px)" }}>
              Built for the parents<br />who walked away from the system.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <VerbatimCard
              quote="I envision all the other parents judging me and thinking I'm a horrible teacher who is failing my kids. When I hear my daughter stumble over words I was reading at her age, I worry."
              name="Charlene"
              location="Verbatim · Hess UnAcademy · US"
            />
            <VerbatimCard
              quote="Today was shit."
              name="Jenna"
              location="Verbatim · Mum Central · AU"
            />
            <VerbatimCard
              quote="In survival mode, learning is impossible."
              name="Louise"
              location="Verbatim · School Can't Australia · NSW"
            />
            <VerbatimCard
              quote={`I'm so afraid of my daughter being "behind"!!!`}
              name="Amanda"
              location="Verbatim · Not That Hard To Homeschool · US"
            />
            <VerbatimCard
              quote="'Just keep trying' is slow harm, not strategy."
              name="Louise"
              location="Verbatim · School Can't Australia · NSW"
            />
            <VerbatimCard
              quote="I'm having the time of my life. Thank God I chose this."
              name="Sara"
              location="Verbatim · Australian Homeschool Stories · QLD"
            />
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION INTRO HEADING — THE 3AM MOMENT
          (bevel position 8 — "Start the day with confidence" intro
          heading. Here we use it as the section transition into the
          repeating feature blocks.)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D6643]/0 via-[#4D7B53]/40 to-[#3D6643]/0" />
          <svg className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/3 translate-x-1/3 opacity-30" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="280" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="220" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="160" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="100" fill="#A4C9A8" opacity="0.08" />
          </svg>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#76A77A]/15 blur-3xl animate-drift-1" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          <SectionEyebrow number="02" label="The reason Sprout exists" />

          <div className="space-y-2 mb-16">
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream"
                style={{ fontSize: "clamp(40px, 6vw, 82px)" }}>
              It&apos;s 11:42 PM.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream/65"
                style={{ fontSize: "clamp(40px, 6vw, 82px)" }}>
              You&apos;re staring
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream/65"
                style={{ fontSize: "clamp(40px, 6vw, 82px)" }}>
              at the ceiling.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream pt-6 headline-lit"
                style={{ fontSize: "clamp(40px, 6vw, 82px)" }}>
              Wondering if<br />today counted.
            </h2>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <p className="text-sprout-cream/80 leading-relaxed" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
                You baked. You walked to the library. She wouldn&apos;t stop asking
                about volcanoes. You answered the phone twice during her maths.
                You think she got through one page. Maybe two. The washing&apos;s
                still on the line.
              </p>
              <p className="mt-6 text-sprout-cream leading-relaxed font-bold" style={{ fontSize: "clamp(20px, 2vw, 26px)" }}>
                None of it felt like school.<br />All of it was.
              </p>
            </div>

            <div className="md:col-span-5">
              <GlassCard className="p-8 rounded-3xl" glow="warm">
                <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-4">
                  ✱ Charlie · 4:17pm
                </div>
                <p className="text-sprout-cream leading-relaxed italic" style={{ fontSize: "clamp(15px, 1.4vw, 17px)" }}>
                  &ldquo;Mum, why does the volcano have fire inside?&rdquo;
                </p>
                <div className="mt-6 text-xs text-sprout-cream/65 uppercase tracking-widest">
                  Voice memo · Tuesday
                </div>
              </GlassCard>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EMOTIONAL BRIDGE — unnumbered scene between 3am wound
          (Section 02) and How It Works mechanic (Section 03). Mirrors
          the Friday-afternoon scene structurally. Lands the
          fragments-have-a-home relief before the mechanic kicks in.
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D6643]/30 via-[#4D7B53]/20 to-[#3D6643]/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#A4C9A8]/8 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">

          <div className="inline-flex items-center gap-3 text-sprout-cream/55 text-[10px] uppercase tracking-[0.3em] font-bold mb-8 md:mb-10">
            <span className="block w-8 h-px bg-sprout-cream/30" />
            <span>The thing you&apos;ve already been doing</span>
            <span className="block w-8 h-px bg-sprout-cream/30" />
          </div>

          <p className="text-sprout-cream leading-snug"
             style={{ fontSize: "clamp(24px, 3.8vw, 44px)", lineHeight: "1.2" }}>
            You&apos;re already doing it.
          </p>

          <p className="mt-5 text-sprout-cream/70 leading-relaxed max-w-xl mx-auto"
             style={{ fontSize: "clamp(15px, 1.5vw, 19px)" }}>
            The voice memos. The photos. The bits scribbled in the back of the calendar.
          </p>

          <p className="mt-10 md:mt-12 text-sprout-cream leading-snug"
             style={{ fontSize: "clamp(24px, 3.8vw, 44px)", lineHeight: "1.2" }}>
            What you needed was somewhere for it to live.
          </p>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          REPEATING FEATURE BLOCKS  (bevel positions 9–12)
          Same 2-column shape, alternating left/right. Four blocks.
          Each one: eyebrow + H3 + body + phone + floating UI card.
          Repetition IS the point.
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4D7B53]/30 via-[#76A77A]/15 to-[#2A5132]/40" />
          <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-[#94BC8E]/10 blur-3xl animate-drift-2" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="mb-24">
            <SectionEyebrow number="03" label="How it works" />
            <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream max-w-3xl headline-lit"
                style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
              Three stupid simple<br />moves. The year<br />builds itself.
            </h2>
            <p className="mt-8 text-sprout-cream/70 max-w-xl leading-relaxed" style={{ fontSize: "clamp(17px, 1.5vw, 19px)" }}>
              For when you&apos;re already doing too much.
              You capture; Sprout compiles. No AI making things up about your kid.
            </p>
          </div>

          <div className="space-y-32 md:space-y-48">

            {/* Feature 1 — Drop in a moment */}
            <FeatureBlock
              index="01"
              eyebrow="Drop in a moment"
              title="A voice memo while you fold the washing."
              body={
                <>
                  <p>
                    Voice memo. Photo. One sentence at 9pm. A scheduled
                    activity. A deadline coming Friday. Tag which kid (or
                    the whole family). That&apos;s the entire input.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    There when you open it &mdash; Sunday, Tuesday, whenever.
                    The bits you captured add up to more than you remember.
                  </p>
                </>
              }
              visual={
                <div className="relative" style={{ perspective: "1600px" }}>
                  <div className="absolute -inset-16 rounded-full bg-gradient-to-br from-[#A4C9A8]/25 via-[#94BC8E]/15 to-transparent blur-3xl -z-10" />
                  <PhoneFrame tilt="rotateY(-8deg) rotateX(3deg) rotateZ(-1deg)">
                    <PhoneScreenDropIn />
                  </PhoneFrame>
                  <FloatingGlass
                    className="absolute -bottom-2 md:-bottom-4 -left-3 md:-left-20 w-[150px] md:w-[200px] z-20"
                    tilt="rotateY(14deg) rotateX(-4deg) rotateZ(-3deg)"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-md bg-[#F4EDE0] flex items-center justify-center">
                        <SproutLogo className="w-3 h-3 text-[#1B3722]" />
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-sprout-cream/85 font-bold">Captured</span>
                      <span className="ml-auto text-[8px] text-sprout-cream/55">just now</span>
                    </div>
                    <p className="text-[11px] font-bold text-sprout-cream leading-tight mb-0.5">
                      Voice memo · 0:47s
                    </p>
                    <p className="text-[10px] text-sprout-cream/75 leading-snug">
                      Tagged for Charlie · Added to the timeline
                    </p>
                  </FloatingGlass>
                </div>
              }
            />

            {/* Feature 2 — Sprout remembers (text right, phone left) */}
            <FeatureBlock
              reverse
              index="02"
              eyebrow="The timeline holds"
              title={
                <>
                  Connects this Tuesday <em className="not-italic text-[#A4C9A8]">to six weeks ago.</em>
                </>
              }
              body={
                <>
                  <p>
                    Notes apps give you a longer scroll. ChatGPT forgets
                    every session &mdash; and trains on what you tell it.
                    Sprout keeps every moment, organised by kid, and lets
                    you scroll back through six weeks or six months.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    Continuity is the whole product. One kid&apos;s record,
                    growing every week. Yours, not anyone else&apos;s.
                  </p>
                </>
              }
              visual={
                <div className="relative" style={{ perspective: "1600px" }}>
                  <div className="absolute -inset-16 rounded-full bg-gradient-to-br from-[#94BC8E]/20 via-[#76A77A]/10 to-transparent blur-3xl -z-10" />
                  <PhoneFrame tilt="rotateY(8deg) rotateX(3deg) rotateZ(1deg)">
                    <PhoneScreenMemory />
                  </PhoneFrame>
                  <FloatingGlass
                    className="absolute -bottom-2 md:-bottom-4 -right-3 md:-right-20 w-[155px] md:w-[220px] z-20"
                    tilt="rotateY(-14deg) rotateX(-4deg) rotateZ(3deg)"
                  >
                    <div className="text-[9px] uppercase tracking-[0.2em] text-sprout-cream/85 font-bold mb-2">
                      6 weeks · 24 captures
                    </div>
                    <p className="text-[11px] font-bold text-sprout-cream leading-tight mb-1.5">
                      Scroll back any week.
                    </p>
                    <div className="grid grid-cols-6 gap-1">
                      {[0.3, 0.5, 0.2, 0.7, 0.4, 0.9].map((h, i) => (
                        <div key={i} className="rounded-sm bg-[#A4C9A8]" style={{ height: `${10 + h * 20}px`, opacity: 0.4 + h * 0.5 }} />
                      ))}
                    </div>
                    <p className="text-[9px] text-sprout-cream/65 mt-2 leading-snug">
                      Wk 8 · Wk 9 · Wk 10 · Wk 11 · Wk 12 · this week.
                    </p>
                  </FloatingGlass>
                </div>
              }
            />

            {/* Feature 3 — Sunday becomes art */}
            <FeatureBlock
              index="03"
              eyebrow="Clarity for you. Pride for them."
              title={
                <>
                  The same week, <em className="not-italic text-[#A4C9A8]">seen two ways.</em>
                </>
              }
              body={
                <>
                  <p>
                    Open it any Sunday night. The week is already there
                    &mdash; voice memos, photos, structured journaling,
                    scheduled days, deadlines met, what your kid actually
                    did. No AI making anything up. Just the captures,
                    organised. One timeline per kid. Charlie&apos;s grows
                    separately to Emma&apos;s.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    You scroll the week and the chaos turns into clarity.
                    Your kid scrolls their own view and feels a sense of
                    achievement. Same week, two screens, no model in the
                    middle.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Documenting your week is a new habit — Sprout makes it the easy one.",
                      "Teaching your kid to journal is a life-long skill. Hand them the phone.",
                      "Doubles as a record of learning if your registration officer ever asks.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sprout-cream/80" style={{ fontSize: "15px" }}>
                        <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-sprout-cream/15 flex items-center justify-center border border-sprout-cream/10">
                          <Check className="w-2.5 h-2.5 text-sprout-cream" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              }
              visual={
                <div className="relative" style={{ perspective: "1600px" }}>
                  <div className="absolute -inset-16 rounded-full bg-gradient-to-br from-[#A4C9A8]/30 via-[#94BC8E]/15 to-transparent blur-3xl -z-10 animate-breathe" />
                  <PhoneFrame tilt="rotateY(-9deg) rotateX(3deg) rotateZ(-1deg)">
                    <PhoneScreenReport />
                  </PhoneFrame>
                  <FloatingGlass
                    className="absolute -top-3 md:-top-6 -left-3 md:-left-24 w-[150px] md:w-[210px] z-20"
                    tilt="rotateY(12deg) rotateX(-4deg) rotateZ(-3deg)"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-md bg-[#F4EDE0] flex items-center justify-center">
                        <SproutLogo className="w-3 h-3 text-[#1B3722]" />
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-sprout-cream/85 font-bold">Sprout</span>
                      <span className="ml-auto text-[8px] text-sprout-cream/55">Sun · 6pm</span>
                    </div>
                    <p className="text-[12px] font-bold text-sprout-cream leading-tight mb-0.5">
                      Charlie&apos;s week is ready 🌱
                    </p>
                    <p className="text-[10px] text-sprout-cream/75 leading-snug">
                      Open it together. 7 captures this week.
                    </p>
                  </FloatingGlass>
                </div>
              }
            />

            {/* Feature 4 — Year of growth */}
            <FeatureBlock
              reverse
              index="04"
              eyebrow="A year of growth"
              title="Weeks stack into months. Months into a year."
              body={
                <>
                  <p>
                    Weeks compile into monthly snapshots. Monthly snapshots
                    compile into a year-end retrospective you can hold in
                    your hand and hand to your kid.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    Every kid you add grows their own year. The record
                    builds itself while you&apos;re busy living.
                  </p>
                </>
              }
              visual={
                <div className="relative" style={{ perspective: "1600px" }}>
                  <div className="absolute -inset-16 rounded-full bg-gradient-to-br from-[#76A77A]/20 via-[#A4C9A8]/10 to-transparent blur-3xl -z-10" />
                  <PhoneFrame tilt="rotateY(8deg) rotateX(3deg) rotateZ(1deg)">
                    <PhoneScreenYear />
                  </PhoneFrame>
                  <FloatingGlass
                    className="absolute -bottom-2 md:-bottom-4 -right-3 md:-right-20 w-[150px] md:w-[210px] z-20"
                    tilt="rotateY(-14deg) rotateX(-4deg) rotateZ(3deg)"
                  >
                    <div className="text-[9px] uppercase tracking-[0.2em] text-sprout-cream/85 font-bold mb-2">
                      Year-end · Term 1
                    </div>
                    <p className="text-[18px] font-bold text-sprout-cream leading-none mb-1">
                      47 moments
                    </p>
                    <p className="text-[10px] text-sprout-cream/75 leading-snug">
                      12 weeks captured across 3 months. Ready to print on
                      the kitchen wall.
                    </p>
                  </FloatingGlass>
                </div>
              }
            />

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DIFFERENTIATOR  (bevel position 21 — "And that's not all" grid)
          Notes vs ChatGPT vs Spreadsheets vs Sprout. Existing copy.
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tl from-[#2A5132]/40 via-[#3D6643]/30 to-[#4D7B53]/20" />
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,400 C320,300 720,500 1080,380 C1280,320 1380,400 1440,380 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.4" />
          </svg>
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-[#76A77A]/10 blur-3xl animate-drift-2" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <SectionEyebrow number="04" label="Why Sprout, not another tool" />

          <div className="space-y-2 mb-12">
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream/65"
                style={{ fontSize: "clamp(40px, 5.5vw, 62px)" }}>
              Books on the floor. Pages on the bench.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream/65"
                style={{ fontSize: "clamp(40px, 5.5vw, 62px)" }}>
              ChatGPT trains on every word you tell it.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream pt-4 headline-lit"
                style={{ fontSize: "clamp(40px, 5.5vw, 62px)" }}>
              Sprout doesn&apos;t sell. Doesn&apos;t train. Doesn&apos;t forget.
            </h2>
          </div>

          <p className="text-sprout-cream/75 leading-relaxed max-w-2xl mb-20" style={{ fontSize: "clamp(17px, 1.6vw, 20px)" }}>
            The kid&apos;s scribble book on the kitchen counter. Library books
            stacked in the corner. The half-finished worksheet on the table.
            Hundreds of photos buried in your camera roll. The Notes app you
            stopped scrolling. The ChatGPT chats that get used to train someone
            else&apos;s model. None of it <em className="not-italic text-sprout-cream">remembers</em> Charlie
            from week to week. None connects this Tuesday to six weeks ago. And
            none of it stays yours.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

            {[
              {
                title: "Books & paper",
                you: "The kid's scribble book. The pile of library books. The half-finished worksheet.",
                get: "Stacks no one re-opens. Pages that lose what was on them.",
              },
              {
                title: "iPhone Notes",
                you: "Type fast. Promise to come back to it.",
                get: "A list you scroll past. Forgotten by Friday.",
              },
              {
                title: "ChatGPT",
                you: "Re-explain who Charlie is. Every. Single. Time.",
                get: "An answer that's gone next session. And every word you typed trains the next model. Yours, used for theirs.",
              },
            ].map((alt) => (
              <GlassCard key={alt.title} className="p-7 rounded-3xl" glow="sage" soft>
                <div className="text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">The alternative</div>
                <h3 className="font-bold tracking-tight text-sprout-cream/90 mb-6" style={{ fontSize: "22px" }}>
                  {alt.title}
                </h3>
                <div className="space-y-4 text-sprout-cream/80" style={{ fontSize: "13.5px", lineHeight: "1.6" }}>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-sprout-cream/65 mb-1">What you do</div>
                    <div>{alt.you}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-sprout-cream/65 mb-1">What you get</div>
                    <div>{alt.get}</div>
                  </div>
                </div>
              </GlassCard>
            ))}

            <div className="relative p-7 rounded-3xl bg-[#F4EDE0] backdrop-blur-xl border-2 border-[#F4EDE0] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5),0_30px_60px_-20px_rgba(0,0,0,0.3)]">
              <div className="text-[#1B3722]/70 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">The Sprout way</div>
              <h3 className="font-bold tracking-tight text-[#1B3722] mb-6 flex items-center gap-2" style={{ fontSize: "22px" }}>
                <SproutLogo className="w-5 h-5 text-[#1B3722]" />
                Sprout
              </h3>
              <div className="space-y-4 text-[#1B3722]/85" style={{ fontSize: "13.5px", lineHeight: "1.6" }}>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#1B3722]/55 mb-1">What you do</div>
                  <div>Drop in a moment. Voice memo, photo, sentence, scheduled day.</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#1B3722]/55 mb-1">What you get</div>
                  <div>Every voice memo, every photo, every deadline &mdash; organised by kid, scrollable by week, month, year. Yours to keep. Theirs to see. The corps don&apos;t get a single byte.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRIVACY PROMISE  (between Differentiator and Friday scene)
          Three-card explicit statement: data ownership, no selling, no
          AI training. Chase wanted this stated plainly, not buried in FAQ.
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

          <div className="grid md:grid-cols-3 gap-5">
            <GlassCard className="p-7 rounded-3xl h-full" glow="warm" soft>
              <div className="text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">01 · You own it</div>
              <h3 className="font-bold tracking-tight text-sprout-cream mb-4" style={{ fontSize: "22px" }}>
                The data is yours.
              </h3>
              <p className="text-sprout-cream/80 leading-relaxed" style={{ fontSize: "15px" }}>
                Voice memos, photos, journaling, what your kid did
                &mdash; all of it belongs to your family. Stored on your
                device, backed up to your private cloud. Yours to export.
                Yours to delete. Yours to keep.
              </p>
            </GlassCard>
            <GlassCard className="p-7 rounded-3xl h-full" glow="sage" soft>
              <div className="text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">02 · Not ours to sell</div>
              <h3 className="font-bold tracking-tight text-sprout-cream mb-4" style={{ fontSize: "22px" }}>
                We can&apos;t sell what isn&apos;t ours.
              </h3>
              <p className="text-sprout-cream/80 leading-relaxed" style={{ fontSize: "15px" }}>
                Sprout is the platform. Your captures are your
                family&apos;s, not ours. The architecture is built that
                way &mdash; there&apos;s nothing for us to sell, even if
                we wanted to.
              </p>
            </GlassCard>
            <GlassCard className="p-7 rounded-3xl h-full" glow="warm" soft>
              <div className="text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">03 · Not training big tech</div>
              <h3 className="font-bold tracking-tight text-sprout-cream mb-4" style={{ fontSize: "22px" }}>
                AI isn&apos;t being trained on you or your kids.
              </h3>
              <p className="text-sprout-cream/80 leading-relaxed" style={{ fontSize: "15px" }}>
                No AI inside Sprout. Nothing summarises, nothing learns
                from what your kid says. Big tech doesn&apos;t get to
                train on your family&apos;s week.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

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

          <p className="mt-10 md:mt-12 text-sprout-cream leading-snug max-w-xl mx-auto"
             style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: "1.3" }}>
            The week, captured. Nothing slipping through.
          </p>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ / OBJECTIONS  (sits between the Friday scene and the
          "I see you" trust seal — payoff → objections handled →
          emotional re-warm → close. Pricing section removed; the
          waitlist + Founding Family block in the Final CTA is the
          single offer surface now.)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3D6643]/40 via-[#4D7B53]/30 to-[#76A77A]/20" />
          <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#A4C9A8]/8 blur-3xl animate-drift-1" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-[#76A77A]/10 blur-3xl animate-drift-2" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          <SectionEyebrow number="06" label="What you&apos;ll ask first" />

          <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream mb-16 headline-lit"
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            Pulled from real forum<br />threads. Answered straight.
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Will this turn into another app I forget I&apos;m using?",
                a: "No. The whole loop is one voice memo, photo, or sentence — dropped in when life lets you. If a week goes by quiet, the next week&apos;s view is shorter, that&apos;s it. Sprout is welcomed-not-required by design; the timeline keeps building whether you put in five captures this week or one.",
              },
              {
                q: "How is Sprout different from my Notes app or ChatGPT?",
                a: "Notes apps don&apos;t compile your week, they give you a longer scroll. ChatGPT forgets every session — and trains on what you tell it. Sprout remembers every moment and references back, but only for you. Continuity is the whole product. Your week stays yours.",
              },
              {
                q: "Do you sell or train on our data?",
                a: "No, and we never will. Your kid&apos;s voice memos, photos, journaling, and timeline stay yours. We don&apos;t sell them. We don&apos;t train AI on them — there&apos;s no AI inside Sprout to train. We don&apos;t share them with advertisers. The whole point of Sprout is that your family&apos;s week is yours alone. Selling it or feeding it to a model would defeat the entire reason this exists.",
              },
              {
                q: "Can my kid record their own entries?",
                a: "Yes — and we&apos;d encourage it. Journaling is a life-long skill, and it forms faster between ages six and eleven than at any later age. Hand them the phone, let them voice-memo what they made, what they figured out, what they got stuck on. Their timeline becomes their voice — not just yours about them. It&apos;s healthy for both of you, and it teaches a habit they keep for life.",
              },
              {
                q: "What if I forget to log for a week?",
                a: "Then that week&apos;s view is shorter. Next week, whatever you capture compiles into what&apos;s there. The timeline builds on what&apos;s there, not what isn&apos;t.",
              },
              {
                q: "Will Sprout help with my state&apos;s record-keeping?",
                a: "Indirectly, yes. Most regulators that ask homeschool families for some form of &apos;record of learning&apos; will accept what Sprout produces — its monthly and yearly compilations are designed for exactly that, without you scrambling the night before review. It&apos;s not the headline, but it&apos;s there.",
              },
              {
                q: "I&apos;m not techy. Will I be able to use it?",
                a: "If you can send a voice memo or take a photo, you can use Sprout. No setup. No dashboard. Open, drop in, close.",
              },
              {
                q: "What if I unschool? My week doesn&apos;t look like school.",
                a: "Even better. The cooking, the questions, the YouTube rabbit holes, the library walks &mdash; all of it goes in the timeline, exactly as it happened. You and your kid can scroll the week and see what was actually there. We don&apos;t measure. We just show what happened.",
              },
              {
                q: "Can I track more than one kid?",
                a: "Yes. Each kid gets their own timeline, their own week, their own year. Sprout treats them as the distinct humans they are.",
              },
            ].map((item, i) => (
              <details key={i} className={`${GLASS_CARD_SOFT} group rounded-2xl`}>
                <summary className="relative cursor-pointer list-none p-6 flex items-start justify-between gap-6">
                  <span className="font-bold text-sprout-cream leading-tight" style={{ fontSize: "clamp(17px, 1.5vw, 19px)" }} dangerouslySetInnerHTML={{ __html: item.q }} />
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-sprout-cream font-bold group-open:rotate-45 transition-transform border border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                </summary>
                <div className="relative px-6 pb-6 -mt-2 text-sprout-cream/85 leading-relaxed" style={{ fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: item.a }} />
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA — MIRRORS HERO  (bevel position 24)
          Same structural shape as the hero: centered headline + sub +
          primary CTA + small badge above. Bookend.
          ═══════════════════════════════════════════════════════════════ */}
      <section id="start" className="relative min-h-screen flex flex-col px-6 md:px-12 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132]/60 via-[#3D6643]/40 to-[#1B3722]/80" />
          <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,500 C320,400 720,600 1080,480 C1280,420 1380,500 1440,480 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.6" />
            <path d="M0,300 C320,200 720,400 1100,320 C1300,280 1380,340 1440,320 L1440,0 L0,0 Z" fill="#76A77A" opacity="0.15" />
          </svg>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#76A77A]/12 blur-3xl animate-breathe" />
          <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-[#94BC8E]/10 blur-3xl animate-drift-1" />
        </div>

        <div className="relative z-10 flex items-center justify-between px-0 md:px-0 pt-12 text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <Plus className="w-2.5 h-2.5" strokeWidth={1.5} />
            <span>VOL.01 · ISSUE 26</span>
          </div>
          <div className="flex items-center gap-3">
            <span>SUNDAY · 6:00 PM</span>
            <Plus className="w-2.5 h-2.5" strokeWidth={1.5} />
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-16">
          <div className="w-full">

            <div className="text-center max-w-3xl mx-auto">

              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-xs uppercase tracking-[0.25em] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
                  Two ways in
                </div>
              </div>

              <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                  style={{ fontSize: "clamp(64px, 11vw, 120px)" }}>
                Sleep on<br />Sunday.
              </h2>

              <p className="mt-8 md:mt-12 text-sprout-cream/85 leading-snug max-w-xl mx-auto"
                 style={{ fontSize: "clamp(18px, 2vw, 26px)", lineHeight: "1.3" }}>
                The week is there. So is next week.
              </p>

              <p className="mt-6 md:mt-8 text-sprout-cream/70 leading-relaxed max-w-xl mx-auto"
                 style={{ fontSize: "clamp(17px, 1.6vw, 21px)" }}>
                You&apos;re not the only one doing it this way.
              </p>

            </div>

            {/* Two-card section: free waitlist + founding family. Same
                backend pattern lifted from Ether's Ask.tsx, Sprout-painted. */}
            <Waitlist />

            <div className="mt-12 md:mt-16 flex justify-center">
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-[10px] md:text-xs uppercase tracking-[0.18em] md:tracking-[0.25em] font-semibold whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
                Voiced by real homeschool mums
              </div>
            </div>

          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between px-0 md:px-0 pb-8 text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <SproutLogo className="w-3 h-3 text-sprout-cream/50" />
            <span>SPROUT·CO</span>
          </div>
          <div className="font-mono text-[9px]">
            ‖‖‖ ‖‖ ‖‖‖‖ ‖ ‖‖‖
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative bg-[#0F1A12] text-sprout-cream/70 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sprout-cream font-bold">
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </div>
          <div className="text-xs uppercase tracking-[0.3em]">
            For homeschool families · Made with care
          </div>
          <div className="text-xs uppercase tracking-[0.3em]">
            © 2026 · vol.01 · issue 26
          </div>
        </div>
      </footer>

      <Mascot />
    </main>
  );
}
