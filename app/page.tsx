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
            Start free trial
          </Link>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-3xl w-full">

            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-xs uppercase tracking-[0.25em] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
                For homeschool families · AU + NZ
              </div>
            </div>

            <h1 className="text-center font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                style={{ fontSize: "clamp(48px, 9vw, 120px)" }}>
              You did more<br />than you think.
            </h1>

            <p className="mt-10 text-center text-sprout-cream/85 leading-relaxed max-w-xl mx-auto"
               style={{ fontSize: "clamp(17px, 1.6vw, 21px)" }}>
              It&apos;s Sunday night and you&apos;re wondering if this week counted.
              Sprout turns the chaos of your week (the voice memos, the photos,
              the bits you scribbled at 9pm) into a beautiful weekly reflection.
              Every Sunday, before bed.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
              <Link
                href="#start"
                className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-base hover:bg-[#FBF6EB] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sprout-cream/40"
              >
                Start your first week free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </Link>
              <p className="text-sm text-sprout-cream/60">
                7 days free · no card required · cancel anytime
              </p>
            </div>

            {/* Hero-tier social proof: small rating-style badge (bevel-equivalent of 4.8 stars / 28.6k ratings) */}
            <div className="mt-14 flex justify-center">
              <div className="inline-flex items-center gap-4 px-5 py-3 rounded-full bg-sprout-cream/8 backdrop-blur-md border border-sprout-cream/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A4C9A8]" />
                <span className="text-sprout-cream/85 text-xs font-semibold tracking-wide">
                  Voiced by real AU + NZ homeschool mums
                </span>
                <span className="block w-px h-3 bg-sprout-cream/20" />
                <span className="text-sprout-cream/60 text-[11px] uppercase tracking-[0.2em] font-bold">
                  Verbatim research · 2026
                </span>
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
              <PhoneScreenMemory />
            </PhoneFrame>
          </PhoneShowcase>

          <div className="mt-16 flex items-center justify-center gap-3 text-sprout-cream/55 text-[10px] uppercase tracking-[0.3em] font-bold">
            <span className="block w-8 h-px bg-sprout-cream/30" />
            <span>Drop in · Sprout remembers · Sunday becomes art</span>
            <span className="block w-8 h-px bg-sprout-cream/30" />
          </div>

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
                style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
              Built for the parents<br />who are already saying it.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <VerbatimCard
              quote="I envision all the other parents judging me and thinking I'm a horrible teacher who is failing my kids. When I hear my daughter stumble over words I was reading at her age, I worry."
              name="Megan"
              location="Melbourne"
            />
            <VerbatimCard
              quote="So, to all the mums doing home-based learning and feeling like they are failing, I see you. I feel you. I am you."
              name="Sarah"
              location="Auckland"
            />
            <VerbatimCard
              quote="Today was shit."
              name="Kate"
              location="Brisbane"
            />
            <VerbatimCard
              quote="Is my child up-to-snuff with her peers?"
              name="Anna"
              location="Wellington"
            />
            <VerbatimCard
              quote="In survival mode, learning is impossible."
              name="Rachel"
              location="Christchurch"
            />
            <VerbatimCard
              quote={`This is our first year homeschooling and I'm so afraid of my daughter being "behind"!!!`}
              name="Nicole"
              location="Sydney"
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
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              It&apos;s 11:42 PM.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream/65"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              You&apos;re staring
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream/65"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              at the ceiling.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream pt-6 headline-lit"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
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
                  ✱ A real homeschool mum
                </div>
                <p className="text-sprout-cream leading-relaxed italic" style={{ fontSize: "clamp(15px, 1.4vw, 17px)" }}>
                  &ldquo;I envision all the other parents judging me and thinking
                  I&apos;m a horrible teacher who is failing my kids. When I hear
                  my daughter stumble over words I was reading at her age, I worry.&rdquo;
                </p>
                <div className="mt-6 text-xs text-sprout-cream/65 uppercase tracking-widest">
                  Verbatim · Hess UnAcademy
                </div>
              </GlassCard>
            </div>
          </div>

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
              Three stupid simple<br />moves. One Sunday<br />artifact.
            </h2>
            <p className="mt-8 text-sprout-cream/70 max-w-xl leading-relaxed" style={{ fontSize: "clamp(17px, 1.5vw, 19px)" }}>
              For when you&apos;re already doing too much.
              No daily goals. No streaks. No guilt.
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
                    Voice memo. Photo. One sentence at 9pm. Tag which kid (or
                    the whole family). That&apos;s the entire input.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    No daily prompts. No streaks. No &ldquo;you missed a day&rdquo;
                    guilt. Just there when Sunday comes.
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
                    className="absolute -bottom-4 -left-10 md:-left-20 w-[200px] z-20 hidden md:block"
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
                      Tagged for Charlie · Sunday roll-up
                    </p>
                  </FloatingGlass>
                </div>
              }
            />

            {/* Feature 2 — Sprout remembers (text right, phone left) */}
            <FeatureBlock
              reverse
              index="02"
              eyebrow="Sprout remembers"
              title={
                <>
                  Connects this Tuesday <em className="not-italic text-[#A4C9A8]">to six weeks ago.</em>
                </>
              }
              body={
                <>
                  <p>
                    Notes apps don&apos;t compile your week, they give you a
                    longer scroll. ChatGPT forgets every session. Sprout
                    remembers every moment and references back.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    Continuity is the whole product. One kid&apos;s memory bank,
                    growing every week.
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
                    className="absolute -bottom-4 -right-10 md:-right-20 w-[220px] z-20 hidden md:block"
                    tilt="rotateY(-14deg) rotateX(-4deg) rotateZ(3deg)"
                  >
                    <div className="text-[9px] uppercase tracking-[0.2em] text-sprout-cream/85 font-bold mb-2">
                      Pattern · 6 weeks
                    </div>
                    <p className="text-[11px] font-bold text-sprout-cream leading-tight mb-1.5">
                      Charlie returns to Earth science.
                    </p>
                    <div className="grid grid-cols-6 gap-1">
                      {[0.3, 0.5, 0.2, 0.7, 0.4, 0.9].map((h, i) => (
                        <div key={i} className="rounded-sm bg-[#A4C9A8]" style={{ height: `${10 + h * 20}px`, opacity: 0.4 + h * 0.5 }} />
                      ))}
                    </div>
                    <p className="text-[9px] text-sprout-cream/65 mt-2 leading-snug">
                      Volcanoes Wk6 → tectonics Wk9 → ocean trenches Wk12.
                    </p>
                  </FloatingGlass>
                </div>
              }
            />

            {/* Feature 3 — Sunday becomes art */}
            <FeatureBlock
              index="03"
              eyebrow="Sunday becomes art"
              title={
                <>
                  Watch your week become <em className="not-italic text-[#A4C9A8]">their growth.</em>
                </>
              }
              body={
                <>
                  <p>
                    Every Sunday night, a beautiful weekly reflection of what
                    your kid actually learned, even if your week felt like
                    chaos. One report per kid. Charlie&apos;s grows separately
                    to Emma&apos;s.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Shows what felt like chaos was actually learning.",
                      "Print it, share it, show your kid Monday morning",
                      "Doubles as a record of learning if your registration officer ever asks",
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
                    className="absolute -top-6 -left-12 md:-left-24 w-[210px] z-20 hidden md:block"
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
                      Volcano doc sparked 90 mins of Earth-science questions.
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
                    Same flat price for every child you&apos;ve added. The
                    record builds itself while you&apos;re busy living.
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
                    className="absolute -bottom-4 -right-10 md:-right-20 w-[210px] z-20 hidden md:block"
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
                style={{ fontSize: "clamp(25px, 4.5vw, 62px)" }}>
              Your iPhone Notes are scattered.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream/65"
                style={{ fontSize: "clamp(25px, 4.5vw, 62px)" }}>
              ChatGPT forgets by next week.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream pt-4 headline-lit"
                style={{ fontSize: "clamp(25px, 4.5vw, 62px)" }}>
              Sprout remembers everything.
            </h2>
          </div>

          <p className="text-sprout-cream/75 leading-relaxed max-w-2xl mb-20" style={{ fontSize: "clamp(17px, 1.6vw, 20px)" }}>
            You can have all the notes app entries in the world. The draft email
            you keep adding sentences to. The Notion doc, the spreadsheet, the
            ChatGPT chats saved in a folder. None of them <em className="not-italic text-sprout-cream">remember</em> Charlie
            from week to week. None connect this Tuesday to six weeks ago.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

            {[
              {
                title: "iPhone Notes",
                you: "Type fast. Promise to come back to it.",
                get: "A list you scroll past. Forgotten by Friday.",
              },
              {
                title: "ChatGPT",
                you: "Re-explain who Charlie is. Every. Single. Time.",
                get: "An answer that's gone next session. No memory.",
              },
              {
                title: "Spreadsheets",
                you: "Fill cells. Format columns. Maintain it.",
                get: "Data you don't read. Another guilt.",
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
                  <div>Drop in a moment. Voice memo, photo, sentence.</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#1B3722]/55 mb-1">What you get</div>
                  <div>A weekly report that knows your kid, references prior weeks, lands Sunday night.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING  (existing block — kept in roughly the same position)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D6643]/30 via-[#2A5132]/40 to-[#1B3722]/50" />
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,300 C480,180 960,420 1440,280 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.5" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto">

          <div className="text-center mb-20">
            <CenteredEyebrow number="05" label="Pricing" />

            <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
              Less than $1 a day.
            </h2>
            <p className="mt-8 text-sprout-cream/70 max-w-xl mx-auto leading-relaxed" style={{ fontSize: "17px" }}>
              All your kids. Every week. One flat price. No per-child upsells.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            <GlassCard className="p-8 md:p-10 rounded-3xl" glow="warm">
              <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/75 font-bold mb-4">Monthly</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-sprout-cream font-bold" style={{ fontSize: "60px" }}>$29</span>
                <span className="text-sprout-cream/70 text-base">/month</span>
              </div>
              <p className="text-sprout-cream/85 mb-8 leading-relaxed text-sm">
                Pay as you go. Cancel anytime. Your first weekly report is yours
                forever, even if you cancel.
              </p>
              <Link
                href="#start"
                className="block text-center w-full h-12 leading-[3rem] rounded-full bg-white/20 backdrop-blur border border-white/40 text-sprout-cream font-semibold hover:bg-white/25 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
              >
                Start free trial
              </Link>
            </GlassCard>

            <div className="relative p-8 md:p-10 rounded-3xl bg-[#F4EDE0] backdrop-blur-xl border-2 border-[#F4EDE0] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5),0_30px_60px_-20px_rgba(0,0,0,0.3)]">
              <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#1B3722] text-sprout-cream text-[10px] uppercase tracking-[0.2em] font-bold">
                Save $99/yr
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#1B3722]/70 font-bold mb-4">Annual</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[#1B3722] font-bold" style={{ fontSize: "60px" }}>$249</span>
                <span className="text-[#1B3722]/60 text-base">/year</span>
              </div>
              <p className="text-[#1B3722]/80 mb-8 leading-relaxed text-sm">
                Less than $0.68 a day. Saves $99 over the year.
              </p>
              <Link
                href="#start"
                className="block text-center w-full h-12 leading-[3rem] rounded-full bg-[#1B3722] text-[#F4EDE0] font-bold hover:bg-[#0F2614] transition-colors"
              >
                Start free trial
              </Link>
            </div>

          </div>

          <p className="text-center mt-10 text-sprout-cream/50 text-sm">
            7 days free · No card required · Works with all your kids · AU + NZ
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF #3 — TESTIMONIAL SPOTLIGHT
          (bevel position 23 — testimonial carousel. We treat it as a
          single hero-sized verbatim instead of a carousel — different
          visual treatment from the wall in section #1.)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3D6643]/30 via-[#4D7B53]/40 to-[#76A77A]/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#A4C9A8]/12 blur-3xl animate-breathe" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">

          <CenteredEyebrow number="06" label="Who Sprout is for" />

          <p className="text-sprout-cream/85 leading-relaxed italic"
             style={{ fontSize: "clamp(28px, 4vw, 52px)", lineHeight: "1.15" }}>
            &ldquo;So, to all the mums doing home-based learning and feeling like they
            are failing,<br /><span className="text-sprout-cream">I see you. I feel you. I am you.</span>&rdquo;
          </p>
          <div className="mt-10 inline-flex items-center gap-3 text-sprout-cream/55 text-[10px] uppercase tracking-[0.3em] font-bold">
            <span className="block w-8 h-px bg-sprout-cream/30" />
            <span>Verbatim · Mum Central · Australia</span>
            <span className="block w-8 h-px bg-sprout-cream/30" />
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ / OBJECTIONS  (existing — kept structurally)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3D6643]/40 via-[#4D7B53]/30 to-[#76A77A]/20" />
          <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#A4C9A8]/8 blur-3xl animate-drift-1" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-[#76A77A]/10 blur-3xl animate-drift-2" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          <SectionEyebrow number="07" label="What you&apos;ll ask first" />

          <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream mb-16 headline-lit"
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            Pulled from real forum<br />threads. Answered straight.
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Is this another subscription that&apos;ll drain my budget?",
                a: "$29/mo covers all your kids on one price. Your first weekly report is yours forever, even if you cancel mid-trial. You&apos;ll know within seven days if it&apos;s worth keeping.",
              },
              {
                q: "How is Sprout different from my Notes app or ChatGPT?",
                a: "Notes apps don&apos;t compile your week, they give you a longer scroll. ChatGPT forgets every session. Sprout remembers every moment and references back. Continuity is the whole product.",
              },
              {
                q: "What if I forget to log for a week?",
                a: "Then your weekly report is shorter. That&apos;s it. No streaks. No guilt. No nagging notifications.",
              },
              {
                q: "Will Sprout help with my state&apos;s record-keeping?",
                a: "Indirectly, yes. NSW NESA, QLD HEU, VIC VRQA, NZ MoE all want a 'record of learning.' Sprout&apos;s monthly and yearly compilations give you that, without you scrambling the night before review. It&apos;s not the headline, but it&apos;s there.",
              },
              {
                q: "I&apos;m not techy. Will I be able to use it?",
                a: "If you can send a voice memo or take a photo, you can use Sprout. No setup. No dashboard. Open, drop in, close.",
              },
              {
                q: "What if I unschool? My week doesn&apos;t look like school.",
                a: "Even better. Sprout translates the cooking, the questions, the YouTube rabbit holes, into the developmental skills your kid is actually building. We don&apos;t measure curriculum.",
              },
              {
                q: "I have three kids. Do I pay three times?",
                a: "No. $29/mo covers your whole family. Each kid gets their own weekly report. One flat price.",
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
          <div className="max-w-3xl w-full text-center">

            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-xs uppercase tracking-[0.25em] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
                Your first Sunday is on us
              </div>
            </div>

            <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                style={{ fontSize: "clamp(48px, 9vw, 120px)" }}>
              Sleep on<br />Sunday.
            </h2>

            <p className="mt-10 text-sprout-cream/85 leading-relaxed max-w-xl mx-auto"
               style={{ fontSize: "clamp(17px, 1.6vw, 21px)" }}>
              Try Sprout free for 7 days. Get one full weekly report, yours
              to keep forever, even if you cancel.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
              <Link
                href="https://app.sprout.example/signup"
                className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-base hover:bg-[#FBF6EB] transition-colors shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)]"
              >
                Start your first week free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </Link>
              <p className="text-sm text-sprout-cream/60">
                No card required · Cancel anytime · For homeschool families AU + NZ
              </p>
            </div>

            <div className="mt-14 flex justify-center">
              <div className="inline-flex items-center gap-4 px-5 py-3 rounded-full bg-sprout-cream/8 backdrop-blur-md border border-sprout-cream/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A4C9A8]" />
                <span className="text-sprout-cream/85 text-xs font-semibold tracking-wide">
                  Voiced by real AU + NZ homeschool mums
                </span>
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
            For homeschool families · AU & NZ · Made with care
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
