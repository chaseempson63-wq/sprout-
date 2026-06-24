import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SproutLogo } from "../_components/Glass";
import { EmailApply } from "../_components/EmailApply";
import { PartnerDashboard } from "../_components/PartnerDashboard";
import { EarningsCalculator } from "../_components/EarningsCalculator";

/*
  Sprout partner / affiliate recruitment page  (/partners)
  Audience: homeschool + homesteader parents who already share what they use.
  Frame: carrying the flag, for the people, grown parent to parent. Money is honest
  and generous (20% recurring for 12 months, buyer gets 20% off the whole
  first year). Rebuilt 2026-06-08 to be visual-first: half the prose cut,
  a live partner-dashboard mock + interactive earnings calculator carry the
  pitch instead of paragraphs. Founder voice, AU/NZ, no exclamation marks,
  NO em dashes.
*/

// Single source of truth for the contact address. Swap to a branded inbox
// (e.g. partners@hisprout.app) here when one exists.
const CONTACT_EMAIL = "sprout.humanintelligence@gmail.com";

export const metadata: Metadata = {
  title: "Earn with Sprout: bring parents in, get paid for a year",
  description:
    "You're already the parent others ask. Share Sprout: your followers get 20% off for their whole first year, and you keep 20% of every subscription for 12 months. For the people. Raising humans, not students.",
};

const HERO_STATS = [
  { v: "20% off", l: "for your people, all year" },
  { v: "20% to you", l: "every single month" },
  { v: "12 months", l: "paid per family" },
];

const STEPS = [
  {
    n: "01",
    title: "Show it for a few seconds",
    body: "Pop the app into a video, actually using it. No scripts, no promo. You already document your week.",
  },
  {
    n: "02",
    title: "Your people get 20% off",
    body: "A real discount on something you use with your own kids, all year. Not a random code for a product you've never touched.",
  },
  {
    n: "03",
    title: "You get paid for 12 months",
    body: "Keep 20% of every subscription they pay, every month, for a full year, per family.",
  },
];

const STAND =
  "This isn't a referral code for something you've never touched. It's the thing you already use with your own kids. You bring a parent in, they get a real discount, you get paid for a year, and the community gets something it has been craving. We grow together. Raising humans, not students.";

const NO_STRINGS =
  "No quotas, no posting schedule. Share it as much or as little as you like. Bring 50 families in and stop tomorrow, you still get paid on every one, every month, right to the end of their year. Once they're yours, they're yours.";

export default function PartnersPage() {
  return (
    <main className="text-sprout-cream min-h-screen overflow-x-hidden relative">
      {/* Continuous green canvas, same brand surface as the landing page */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132] via-[#3D6643] to-[#1B3722]" />
        <div
          className="absolute inset-0 opacity-[0.10] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'a\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23a)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/" className="flex items-center gap-2 text-sprout-cream font-bold text-lg">
          <SproutLogo className="w-5 h-5 text-sprout-cream" />
          <span>Sprout</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sprout-cream/70 text-sm font-semibold hover:text-sprout-cream transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to Sprout
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-12 md:pt-16 pb-10 md:pb-14">
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
            For the side hustle mamas
          </div>

          <h1
            className="font-bold tracking-[-0.03em] leading-[0.98] text-sprout-cream headline-lit"
            style={{ fontSize: "clamp(44px, 7.5vw, 92px)" }}
          >
            The side hustle that
            <br />
            actually keeps paying.
          </h1>

          <p
            className="mt-8 text-sprout-cream/85 leading-relaxed max-w-2xl"
            style={{ fontSize: "clamp(17px, 1.7vw, 21px)" }}
          >
            You already share what works for your own kids. Sprout pays you for
            it. Keep{" "}
            <strong className="text-sprout-cream font-bold">
              20% of every subscription you bring in, every month, for a full
              year
            </strong>
            . Most links pay once. This one keeps paying.
          </p>

          {/* Tiny proof chips, the deal at a glance */}
          <div className="mt-9 flex flex-wrap gap-3">
            {HERO_STATS.map((s) => (
              <div
                key={s.v}
                className="rounded-2xl bg-sprout-cream/[0.07] backdrop-blur-md border border-sprout-cream/12 px-4 py-3"
              >
                <div className="font-display font-extrabold text-sprout-cream text-lg leading-none">
                  {s.v}
                </div>
                <div className="text-sprout-cream/55 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="#apply"
              className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-base hover:bg-[#FBF6EB] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sprout-cream/40"
            >
              Apply to join
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* The dashboard zone — the pitch, made visible */}
      <section className="relative px-6 md:px-12 py-14 md:py-20">
        {/* soft glow for depth behind the panels */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] max-w-full rounded-full bg-[#94BC8E]/10 blur-3xl pointer-events-none -z-0" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-6 flex items-center gap-3">
            <span className="block w-8 h-px bg-sprout-cream/30" />
            Your dashboard
          </div>

          <h2
            className="font-bold tracking-[-0.02em] text-sprout-cream leading-[1.04] max-w-2xl mb-4 headline-lit"
            style={{ fontSize: "clamp(28px, 4vw, 46px)" }}
          >
            See what a single post is really worth.
          </h2>
          <p
            className="text-sprout-cream/75 leading-relaxed max-w-xl mb-10"
            style={{ fontSize: "clamp(16px, 1.5vw, 18px)" }}
          >
            Every family you bring in shows up here and keeps paying you for a
            full 12 months. One post can pay you all year.
          </p>

          <PartnerDashboard />

          <div className="mt-7 mb-7 flex items-center gap-3 text-sprout-cream/60 text-sm font-semibold">
            <span className="block w-8 h-px bg-sprout-cream/25" />
            Now run your own audience through it
          </div>

          <EarningsCalculator />

          <div className="mt-10">
            <Link
              href="#apply"
              className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-base hover:bg-[#FBF6EB] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sprout-cream/40"
            >
              Start earning with Sprout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-6 md:px-12 py-14 md:py-20">
        <div className="relative max-w-5xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-10 flex items-center gap-3">
            <span className="block w-8 h-px bg-sprout-cream/30" />
            How it works
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-3xl bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 p-7"
              >
                <div className="text-sprout-cream/55 text-sm font-bold tracking-[0.2em] mb-5">{step.n}</div>
                <h3 className="font-bold tracking-tight text-sprout-cream mb-3" style={{ fontSize: "21px" }}>
                  {step.title}
                </h3>
                <p className="text-sprout-cream/80 leading-relaxed" style={{ fontSize: "15px" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For the people, the stand */}
      <section className="relative px-6 md:px-12 py-16 md:py-24">
        <div className="relative max-w-3xl mx-auto">
          <h2
            className="font-bold tracking-[-0.03em] leading-[1.04] text-sprout-cream headline-lit mb-8"
            style={{ fontSize: "clamp(32px, 4.8vw, 56px)" }}
          >
            For the homeschool parents.
          </h2>
          <p
            className="text-sprout-cream/85 leading-relaxed"
            style={{ fontSize: "clamp(17px, 1.7vw, 21px)" }}
          >
            {STAND}
          </p>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="relative px-6 md:px-12 py-20 md:py-28 scroll-mt-20">
        <div className="relative max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
              Want in
            </div>
            <h2
              className="font-bold tracking-[-0.03em] leading-[1.02] text-sprout-cream headline-lit"
              style={{ fontSize: "clamp(34px, 5.5vw, 60px)" }}
            >
              Come grow this with us.
            </h2>
            <p
              className="mt-6 text-sprout-cream/75 leading-relaxed max-w-xl mx-auto"
              style={{ fontSize: "clamp(16px, 1.5vw, 18px)" }}
            >
              We read every note and reply. Tell us who you are, where you post, your
              audience size, and what got you interested.
            </p>
          </div>

          <EmailApply email={CONTACT_EMAIL} />

          <div className="mt-6 rounded-2xl border border-sprout-cream/15 bg-sprout-cream/5 p-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-3">
              No strings
            </div>
            <p className="text-sprout-cream/80 leading-relaxed" style={{ fontSize: "15px" }}>
              {NO_STRINGS}
            </p>
          </div>

          <p className="mt-8 text-center text-sprout-cream/55 text-sm">The Sprout team</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#0F1A12] text-sprout-cream/70 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 text-sprout-cream font-bold">
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </Link>
          <div className="flex items-center gap-5 text-xs uppercase tracking-[0.3em]">
            <Link href="/" className="hover:text-sprout-cream transition-colors">Back to Sprout</Link>
            <Link href="/privacy" className="hover:text-sprout-cream transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-sprout-cream transition-colors">Terms</Link>
          </div>
          <div className="text-xs uppercase tracking-[0.3em]">© 2026 · vol.01 · issue 26</div>
        </div>
      </footer>
    </main>
  );
}
