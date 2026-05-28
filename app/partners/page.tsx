import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SproutLogo } from "../_components/Glass";
import { EmailApply } from "../_components/EmailApply";

/*
  Sprout partner / affiliate recruitment page  (/partners)
  Audience: homeschool + homesteader moms who already share what they use
  and have an audience that trusts them.
  Frame: this is carrying the flag, not an affiliate hustle. For the people.
  Grown mom to mom. Money is honest and generous (20% recurring for 12
  months, buyer gets 20% off the whole first year) but the stand carries
  the page, not the payout. App screenshots get added once the MVP exists.
  Style: founder voice, AU/NZ, no exclamation marks, NO em dashes.
*/

// Single source of truth for the contact address. Swap to a branded inbox
// (e.g. partners@hisprout.app) here when one exists.
const CONTACT_EMAIL = "chaseempson63@gmail.com";

export const metadata: Metadata = {
  title: "Earn with Sprout: bring moms in, get paid for a year",
  description:
    "You're already the mom others ask. Share Sprout: your followers get 20% off for their whole first year, and you keep 20% of every subscription for 12 months. For the people. Raising humans, not students.",
};

const STEPS = [
  {
    n: "01",
    title: "Show it for 3 to 5 seconds",
    body: "Include the app for 3 to 5 seconds in your video, you actually using it. Bang. It's that easy. You don't have to make full promo videos or write scripts. It should feel natural, because it is. You're already documenting your week.",
  },
  {
    n: "02",
    title: "Your followers get 20% off, all year",
    body: "20% off their whole first 12 months. A real discount on something you actually use with your own kids, not a random code for a product you've never touched. We're for the people, and the discount's real.",
  },
  {
    n: "03",
    title: "You get paid for 12 months",
    body: "Keep 20% of every subscription they pay, every month, for a full year, per family. As more of your people come across, the more you make.",
  },
];

const MOVEMENT = [
  "We see you. We have the most tight-knit community on this edge of the internet. We're growing together. We're getting stronger together. We're moms growing with other moms.",
  "Every family you bring on means more of us getting stronger by the day, documenting the small things that add up. This is the movement. Sprout is here for the people. Sprout is here for the parents growing the next generation and raising humans, not students, one week at a time.",
  "You are a part of this. You're not only compensated for it, you're giving your audience, and giving back to the community, something it's been craving for a long time. And we all get rewarded for it, and grow together as a community.",
];

const NO_STRINGS =
  "There's no commitment and nothing to keep up. No set number of posts a week, no quotas. Share it as much or as little as you like, and what you put in is what you get back. If you bring 50 families in and then stop posting tomorrow, you still get paid on every one of them, every month, right to the end of their 12 months. Once they're yours, they're yours.";

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
      <section className="relative px-6 md:px-12 pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
            For the moms other moms already ask
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
            You already share what works for your own kids.
            Sprout works the same way, except you keep{" "}
            <strong className="text-sprout-cream font-bold">
              20% of every subscription you bring in, every month, for a full 12 months
            </strong>
            . Your followers get{" "}
            <strong className="text-sprout-cream font-bold">20% off for their whole first year</strong>.
            Most affiliate links pay you once. This one keeps paying.
          </p>

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

      {/* How it works */}
      <section className="relative px-6 md:px-12 py-16 md:py-24">
        <div className="relative max-w-5xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-12 flex items-center gap-3">
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

      {/* Quick math, the price anchor they can headcount against */}
      <section className="relative px-6 md:px-12 py-16 md:py-24">
        <div className="relative max-w-4xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-8 flex items-center gap-3">
            <span className="block w-8 h-px bg-sprout-cream/30" />
            Do the math on your own audience
          </div>

          <p
            className="text-sprout-cream/85 leading-relaxed max-w-2xl mb-10"
            style={{ fontSize: "clamp(17px, 1.7vw, 21px)" }}
          >
            About <strong className="text-sprout-cream font-bold">$5 a month for every family</strong> who
            joins through you, every month, for a full year.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-3xl bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 p-8">
              <div className="text-sprout-cream/65 text-xs uppercase tracking-[0.25em] font-bold mb-3">
                50 families
              </div>
              <div className="font-bold text-sprout-cream leading-none" style={{ fontSize: "clamp(34px, 5vw, 52px)" }}>
                ~$250<span className="text-sprout-cream/55 text-lg font-semibold">/mo</span>
              </div>
            </div>
            <div className="rounded-3xl bg-[#F4EDE0] p-8 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.45)]">
              <div className="text-[#1B3722]/70 text-xs uppercase tracking-[0.25em] font-bold mb-3">
                400 families
              </div>
              <div className="font-bold text-[#1B3722] leading-none" style={{ fontSize: "clamp(34px, 5vw, 52px)" }}>
                ~$2,000<span className="text-[#1B3722]/55 text-lg font-semibold">/mo</span>
              </div>
            </div>
          </div>

          <p
            className="mt-10 text-sprout-cream font-semibold leading-relaxed max-w-2xl"
            style={{ fontSize: "clamp(16px, 1.5vw, 18px)" }}
          >
            If you&apos;ve been looking for the next side hustle that actually serves the people and is stupid simple to be a part of, you&apos;ve found the gem.
            Become a part of the team and start growing with Sprout.
          </p>
        </div>
      </section>

      {/* For the people, the stand */}
      <section className="relative px-6 md:px-12 py-20 md:py-28">
        <div className="relative max-w-3xl mx-auto">
          <h2
            className="font-bold tracking-[-0.03em] leading-[1.04] text-sprout-cream headline-lit mb-8"
            style={{ fontSize: "clamp(32px, 4.8vw, 56px)" }}
          >
            For the homeschool moms.
          </h2>
          <div className="space-y-6">
            {MOVEMENT.map((para, i) => (
              <p
                key={i}
                className={
                  i === MOVEMENT.length - 1
                    ? "text-sprout-cream font-semibold leading-relaxed"
                    : "text-sprout-cream/80 leading-relaxed"
                }
                style={{ fontSize: "clamp(17px, 1.6vw, 20px)" }}
              >
                {para}
              </p>
            ))}
          </div>
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
              I read every note myself and reply. Tell me who you are, where you post, your
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

          <p className="mt-8 text-center text-sprout-cream/55 text-sm">Chase</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#0F1A12] text-sprout-cream/70 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 text-sprout-cream font-bold">
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </Link>
          <Link href="/" className="text-xs uppercase tracking-[0.3em] hover:text-sprout-cream transition-colors">
            Back to Sprout
          </Link>
          <div className="text-xs uppercase tracking-[0.3em]">© 2026 · vol.01 · issue 26</div>
        </div>
      </footer>
    </main>
  );
}
