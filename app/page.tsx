import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowRight, Check } from "lucide-react";
import { SproutLogo, GlassCard } from "./_components/Glass";
import {
  SectionEyebrow,
  CenteredEyebrow,
  FeatureBlock,
  VerbatimCard,
} from "./_components/Sections";
import { OnboardingVisual } from "./_components/OnboardingVisuals";
import { Mascot } from "./_components/Mascot";
import { Waitlist } from "./_components/Waitlist";
import { PartnerDashboard } from "./_components/PartnerDashboard";

/* A rendered App Store phone screenshot, floated on the green canvas. */
function PhoneShot({
  src,
  alt,
  tilt,
  className = "",
}: {
  src: string;
  alt: string;
  tilt: string;
  className?: string;
}) {
  return (
    <div className={className} style={{ transform: tilt, transformStyle: "preserve-3d" }}>
      <Image
        src={src}
        alt={alt}
        width={960}
        height={2160}
        sizes="(max-width: 768px) 70vw, 32vw"
        className="w-full h-auto drop-shadow-[0_45px_90px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}

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

        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
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

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="max-w-3xl w-full">

            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-[10px] md:text-xs uppercase tracking-[0.18em] md:tracking-[0.25em] font-semibold whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
                For parents who walked away
              </div>
            </div>

            <h1 className="text-center font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                style={{ fontSize: "clamp(56px, 9.5vw, 128px)" }}>
              You did more<br />than you think.
            </h1>

            <p className="mt-10 text-center text-sprout-cream/85 leading-relaxed max-w-xl mx-auto"
               style={{ fontSize: "clamp(17px, 1.6vw, 21px)" }}>
              It&apos;s 11pm on Wednesday night and you&apos;re wondering if
              today counted. The endless pages of notes, the countless tabs, and
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
                Voiced by real homeschool parents
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

          <div className="flex items-center justify-center gap-3 md:gap-6" style={{ perspective: "1800px" }}>
            <PhoneShot
              src="/app-capture.png"
              alt="Capturing a moment in the Sprout app"
              tilt="rotateY(16deg) rotateX(4deg)"
              className="hidden md:block w-[30%]"
            />
            <PhoneShot
              src="/app-week.png"
              alt="A week sorted into a printable report"
              tilt="rotateY(0deg) rotateX(2deg) translateZ(30px)"
              className="w-[64%] sm:w-[48%] md:w-[34%] relative z-10"
            />
            <PhoneShot
              src="/app-journey.png"
              alt="A timeline of the year, kept"
              tilt="rotateY(-16deg) rotateX(4deg)"
              className="hidden md:block w-[30%]"
            />
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
                about volcanoes. You answered the phone twice during her math.
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
                  &ldquo;Why does the volcano have fire inside?&rdquo;
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

          <div className="mb-16">
            <SectionEyebrow number="03" label="How it works" />
          </div>

          <div className="space-y-32 md:space-y-48">

            {/* Feature 1 — Drop in a moment */}
            <FeatureBlock
              index="01"
              eyebrow="Drop in a moment"
              title={
                <>
                  Did today even <em className="not-italic text-[#A4C9A8]">count?</em>
                </>
              }
              body={
                <>
                  <p className="font-semibold">Drop in one thing. Done.</p>
                  <p className="mt-5">
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
              visual={<OnboardingVisual variant="capture" />}
            />

            {/* Feature 2 — Sprout remembers (text right, phone left) */}
            <FeatureBlock
              reverse
              index="02"
              eyebrow="Somewhere it lives"
              title={
                <>
                  What do I have to <em className="not-italic text-[#A4C9A8]">show for it?</em>
                </>
              }
              body={
                <>
                  <p className="font-semibold">Look back. It&apos;s all still here.</p>
                  <p className="mt-5">
                    You&apos;re already doing it &mdash; scattered across
                    your phone, your camera roll, the back of the calendar.
                    Notes pile up but never connect. ChatGPT loses the
                    thread between sessions &mdash; and what you typed
                    becomes theirs, not yours. Sprout keeps every moment,
                    organised by kid, and lets you look back through six
                    weeks or six months.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    Continuity is the whole product. One kid&apos;s record,
                    growing every week. Yours, not anyone else&apos;s.
                  </p>
                </>
              }
              visual={<OnboardingVisual variant="sort" />}
            />

            {/* Feature 3 — Sunday becomes art */}
            <FeatureBlock
              index="03"
              eyebrow="The week, seen"
              title={
                <>
                  What did we actually <em className="not-italic text-[#A4C9A8]">do this week?</em>
                </>
              }
              body={
                <>
                  <p className="font-semibold">Open it Sunday. The week&apos;s right there.</p>
                  <p className="mt-5">
                    Every capture this week, sitting in one place.
                    Charlie&apos;s timeline stays Charlie&apos;s.
                    Emma&apos;s stays Emma&apos;s.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    Open the week. Chaos turns into clarity. The kid
                    opens theirs and sees what they actually built.
                    Same week. Two screens.
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
              visual={<OnboardingVisual variant="together" />}
            />

            {/* Feature 4 — Year of growth */}
            <FeatureBlock
              reverse
              index="04"
              eyebrow="A year of it"
              title={
                <>
                  Is this going to <em className="not-italic text-[#A4C9A8]">add up to something?</em>
                </>
              }
              body={
                <>
                  <p className="font-semibold">Print the year. Hand it to whoever&apos;s asking.</p>
                  <p className="mt-5">
                    Weeks compile into monthly snapshots. Monthly snapshots
                    compile into a year-end retrospective you can hold and
                    hand to your kid.
                  </p>
                  <p className="mt-5 text-sprout-cream/65">
                    Every kid you add gets their own year. Print it,
                    hand it over, keep it on the shelf.
                  </p>
                </>
              }
              visual={<OnboardingVisual variant="report" />}
            />

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EARN WITH SPROUT — teaser, between How it works and Why Sprout.
          Partner-portal preview + a big green button. Full program on /partners.
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A5132]/30 via-[#1B3722]/45 to-[#2A5132]/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[#CDEFA0]/8 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <CenteredEyebrow number="04" label="Earn with Sprout" />
            <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream max-w-3xl mx-auto"
                style={{ fontSize: "clamp(40px, 6vw, 64px)" }}>
              Love Sprout? Get paid<br />to share it.
            </h2>
            <p className="mt-6 text-sprout-cream/75 leading-relaxed max-w-xl mx-auto"
               style={{ fontSize: "clamp(16px, 1.5vw, 19px)" }}>
              Share it with the parents who need it. When a family joins through
              you, you earn every month they stay. For a whole year.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <PartnerDashboard />
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/partners"
              className="group inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full bg-gradient-to-r from-[#3D6643] to-[#2A5132] text-sprout-cream font-bold text-base border border-[#CDEFA0]/40 shadow-[0_12px_34px_-10px_rgba(0,0,0,0.55)] hover:from-[#46734D] hover:to-[#2F5D38] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#CDEFA0]/40"
            >
              Earn with Sprout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </Link>
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

          <SectionEyebrow number="05" label="Why Sprout, not another tool" />

          <div className="space-y-2 mb-12">
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream/65"
                style={{ fontSize: "clamp(40px, 5.5vw, 62px)" }}>
              Books on the floor. Pages on the bench.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream/65"
                style={{ fontSize: "clamp(40px, 5.5vw, 62px)" }}>
              ChatGPT owns your data and sells it.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream pt-4 headline-lit"
                style={{ fontSize: "clamp(40px, 5.5vw, 62px)" }}>
              Sprout doesn&apos;t own, sell or forget.
            </h2>
          </div>

          <p className="text-sprout-cream/75 leading-relaxed max-w-2xl mb-20" style={{ fontSize: "clamp(17px, 1.6vw, 20px)" }}>
            The kid&apos;s scribble book on the kitchen counter. Library books
            stacked in the corner. The half-finished worksheet on the table.
            Hundreds of photos buried in your camera roll. The Notes app you
            stopped opening. The ChatGPT chats OpenAI now owns and feeds to
            their next model. None of it <em className="not-italic text-sprout-cream">remembers</em> Charlie
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
                get: "A list you skim past. Forgotten by Friday.",
              },
              {
                title: "ChatGPT",
                you: "Re-explain who Charlie is. Every. Single. Time.",
                get: "An answer that's gone next session. Your words become OpenAI's — logged, owned, sold to whoever pays for the dataset.",
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
                  <div>Open. Drop in. Close. 20 seconds, then back to the day.</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#1B3722]/55 mb-1">What you get</div>
                  <div>A continuous per-kid record. Browse any week, month, year. Yours to keep. Theirs to see. The corps don&apos;t get a single byte.</div>
                </div>
              </div>
            </div>

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

              <h2 className="font-bold tracking-[-0.03em] text-sprout-cream headline-lit max-w-4xl mx-auto"
                  style={{ fontSize: "clamp(30px, 5.5vw, 60px)", lineHeight: "1.12" }}>
                Their week of learning.<br />Summarized while you<br />sleep on Sunday.
              </h2>

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
                Voiced by real homeschool parents
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
          <div className="flex items-center gap-5 text-xs uppercase tracking-[0.3em]">
            <Link href="/partners" className="hover:text-sprout-cream transition-colors">Earn with Sprout</Link>
            <Link href="/privacy" className="hover:text-sprout-cream transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-sprout-cream transition-colors">Terms</Link>
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
