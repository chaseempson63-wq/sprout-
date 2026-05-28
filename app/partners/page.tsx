import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SproutLogo } from "../_components/Glass";
import { EmailApply } from "../_components/EmailApply";

/* ─────────────────────────────────────────────────────────────────────
   Sprout partner / affiliate recruitment page  (/partners)
   Audience: homeschool + homesteader mums who already push affiliate
   links (Amazon, gear, curriculum). This is the "side-hustle mama" pitch.
   Voice = opportunity/partner, NOT the customer wound voice. Honest about
   the money: 20% recurring for 12 months, compounds, beats a one-off link.
   No dollar figures on purpose — pricing is a placeholder, not committed.
   Examples / app screenshots get added once the MVP exists.
   ───────────────────────────────────────────────────────────────────── */

// Single source of truth for the contact address — swap to a branded
// inbox (e.g. partners@hisprout.app) here when one exists.
const CONTACT_EMAIL = "chaseempson63@gmail.com";

export const metadata: Metadata = {
  title: "Earn with Sprout — the side hustle that keeps paying",
  description:
    "Share Sprout with your homeschool audience. Earn 20% of every subscription you refer for a full 12 months — and get your followers 20% off.",
};

const STEPS = [
  {
    n: "01",
    title: "Share it like you already do",
    body: "Show Sprout in your content the way you show the readers, the curriculum, the gear you actually use. Drop your link in your bio or description. No hard pitch.",
  },
  {
    n: "02",
    title: "Your followers get 20% off",
    body: "A real discount on something built for exactly your people — not a random promo code for a product you&apos;ve never touched.",
  },
  {
    n: "03",
    title: "You get paid for 12 months",
    body: "20% of every subscription they pay — every month, for a full year, for each person who joins through you. It stacks as more of your audience comes across.",
  },
];

export default function PartnersPage() {
  return (
    <main className="text-sprout-cream min-h-screen overflow-x-hidden relative">
      {/* Continuous green canvas — same brand surface as the landing page */}
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
            For mums who already share what they love
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
            You already share the books, the curriculum, the gear you use with
            your kids. Sprout pays you <strong className="text-sprout-cream font-bold">20% of every
            subscription you refer &mdash; every month, for a full 12 months</strong> &mdash;
            and gets your followers <strong className="text-sprout-cream font-bold">20% off</strong>.
            Most affiliate links pay you once. This one pays you all year.
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
                <div className="text-sprout-cream/55 text-sm font-bold tracking-[0.2em] mb-5">
                  {step.n}
                </div>
                <h3 className="font-bold tracking-tight text-sprout-cream mb-3" style={{ fontSize: "21px" }}>
                  {step.title}
                </h3>
                <p
                  className="text-sprout-cream/80 leading-relaxed"
                  style={{ fontSize: "15px" }}
                  dangerouslySetInnerHTML={{ __html: step.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The honest recurring bit */}
      <section className="relative px-6 md:px-12 py-20 md:py-28">
        <div className="relative max-w-3xl mx-auto text-center">
          <h2
            className="font-bold tracking-[-0.03em] leading-[1.05] text-sprout-cream headline-lit"
            style={{ fontSize: "clamp(30px, 4.5vw, 52px)" }}
          >
            It compounds.
          </h2>
          <p
            className="mt-7 text-sprout-cream/80 leading-relaxed max-w-2xl mx-auto"
            style={{ fontSize: "clamp(16px, 1.6vw, 19px)" }}
          >
            This isn&apos;t get-rich-quick. It&apos;s a recurring stream that grows. Every
            mum who joins through you pays you for twelve months &mdash; so the more of
            your audience comes across, the bigger your monthly cheque, and it keeps
            building on itself. A one-off Amazon link pays you once and it&apos;s gone. This
            one keeps paying.
          </p>
        </div>
      </section>

      {/* Why you */}
      <section className="relative px-6 md:px-12 py-16 md:py-24">
        <div className="relative max-w-3xl mx-auto">
          <div className="rounded-3xl bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 p-8 md:p-10">
            <p
              className="text-sprout-cream/85 leading-relaxed"
              style={{ fontSize: "clamp(17px, 1.7vw, 21px)" }}
            >
              You&apos;re already the mum other mums ask. You share what works, because you
              actually use it. This is the same move &mdash; on a tool built for exactly your
              people, by someone who&apos;d rather put money in the pockets of mums who believe
              in it than burn it on ads.
            </p>
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
              Send me a quick note.
            </h2>
            <p
              className="mt-6 text-sprout-cream/75 leading-relaxed max-w-xl mx-auto"
              style={{ fontSize: "clamp(16px, 1.5vw, 18px)" }}
            >
              I read every one and reply personally. Tell me who you are, where you post,
              your audience size, and what got you interested.
            </p>
          </div>

          <EmailApply email={CONTACT_EMAIL} />

          <p className="mt-8 text-center text-sprout-cream/55 text-sm">
            &mdash; Chase, building Sprout
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#0F1A12] text-sprout-cream/70 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 text-sprout-cream font-bold">
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.3em] hover:text-sprout-cream transition-colors"
          >
            Back to Sprout
          </Link>
          <div className="text-xs uppercase tracking-[0.3em]">© 2026 · vol.01 · issue 26</div>
        </div>
      </footer>
    </main>
  );
}
