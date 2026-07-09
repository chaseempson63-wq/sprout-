import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SproutLogo } from "./Glass";

/* Reusable legal page shell (Privacy, Terms). On-brand green canvas with a
   readable prose column. No client interactivity, no em dashes. */

export type LegalSection = {
  h: string;
  p?: string[];
  bullets?: string[];
  after?: string[];
};

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="text-sprout-cream min-h-screen overflow-x-hidden relative flex flex-col">
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132] via-[#3D6643] to-[#1B3722]" />
      </div>

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

      <article className="relative z-10 max-w-3xl mx-auto w-full px-6 md:px-12 py-12 md:py-20 flex-1">
        <h1 className="font-bold tracking-[-0.02em] text-sprout-cream" style={{ fontSize: "clamp(36px, 6vw, 60px)" }}>
          {title}
        </h1>
        <p className="mt-4 text-sprout-cream/55 text-xs uppercase tracking-[0.2em]">Last updated {updated}</p>
        <p className="mt-8 text-sprout-cream/85 leading-relaxed" style={{ fontSize: "18px" }}>
          {intro}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-bold tracking-tight text-sprout-cream mb-4" style={{ fontSize: "22px" }}>
                {s.h}
              </h2>
              {s.p?.map((para, i) => (
                <p key={`p-${i}`} className="text-sprout-cream/80 leading-relaxed mb-4" style={{ fontSize: "16px" }}>
                  {para}
                </p>
              ))}
              {s.bullets && (
                <ul className="space-y-2 mb-4">
                  {s.bullets.map((b, i) => (
                    <li
                      key={`b-${i}`}
                      className="text-sprout-cream/80 leading-relaxed pl-5 relative"
                      style={{ fontSize: "16px" }}
                    >
                      <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-sprout-cream/40" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {s.after?.map((para, i) => (
                <p key={`a-${i}`} className="text-sprout-cream/80 leading-relaxed mb-4" style={{ fontSize: "16px" }}>
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <footer className="relative bg-[#0F1A12] text-sprout-cream/70 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 text-sprout-cream font-bold">
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </Link>
          <div className="flex items-center gap-5 text-xs uppercase tracking-[0.3em]">
            <Link href="/blog" className="hover:text-sprout-cream transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-sprout-cream transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-sprout-cream transition-colors">Terms</Link>
            <Link href="/partners" className="hover:text-sprout-cream transition-colors">Earn with Sprout</Link>
          </div>
          <div className="text-xs uppercase tracking-[0.3em]">© 2026 · vol.01 · issue 26</div>
        </div>
      </footer>
    </main>
  );
}
