import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SproutLogo } from "@/app/_components/Glass";

/* Shared shell for the blog: warm cream reading canvas (the timeline mood:
   light, warm, shareable), forest-ink type, same dark footer as the rest of
   the site. Articles are the one Sprout surface built for long reading, so
   the canvas stays quiet. */

export function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col bg-[#FBF8F1] text-[#1B3722]">
      <nav className="flex items-center justify-between px-6 md:px-12 py-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#1B3722] font-bold text-lg"
        >
          <SproutLogo className="w-5 h-5 text-[#1B3722]" />
          <span>Sprout</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-[#1B3722]/70 text-sm font-semibold hover:text-[#1B3722] transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/resources"
            className="text-[#1B3722]/70 text-sm font-semibold hover:text-[#1B3722] transition-colors hidden sm:inline"
          >
            Free worksheets
          </Link>
          <Link
            href="/#start"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B3722] text-sprout-cream text-sm font-semibold hover:bg-[#2A5132] transition-colors"
          >
            Join the waitlist
          </Link>
        </div>
      </nav>

      <div className="flex-1">{children}</div>

      <footer className="bg-[#0F1A12] text-sprout-cream/70 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sprout-cream font-bold"
          >
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </Link>
          <div className="flex items-center gap-5 text-xs uppercase tracking-[0.3em]">
            <Link href="/blog" className="hover:text-sprout-cream transition-colors">
              Blog
            </Link>
            <Link href="/resources" className="hover:text-sprout-cream transition-colors">
              Resources
            </Link>
            <Link href="/partners" className="hover:text-sprout-cream transition-colors">
              Earn with Sprout
            </Link>
            <Link href="/privacy" className="hover:text-sprout-cream transition-colors">
              Privacy
            </Link>
          </div>
          <div className="text-xs uppercase tracking-[0.3em]">
            For homeschool families · Made with care
          </div>
        </div>
      </footer>
    </main>
  );
}

/* The article-end conversion card. Headline is a locked approved line, so it
   ships verbatim. One CTA to the waitlist, one soft path to Resources. */
export function ArticleCta() {
  return (
    <aside className="mt-14 rounded-3xl bg-[#1B3722] text-sprout-cream px-7 py-9 md:px-10 md:py-11 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#76A77A]/20 blur-3xl" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sprout-cream/10 border border-sprout-cream/15 text-sprout-cream/90 text-[10px] uppercase tracking-[0.25em] font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
          Sprout
        </div>
        <h2
          className="font-bold tracking-[-0.02em] text-sprout-cream"
          style={{ fontSize: "clamp(26px, 4vw, 38px)", lineHeight: 1.15 }}
        >
          You did more than you think.
        </h2>
        <p
          className="mt-4 text-sprout-cream/75 leading-relaxed max-w-xl"
          style={{ fontSize: "17px" }}
        >
          Sprout puts the week somewhere you can see it. The photos, the voice
          memos, the one-line notes, compiled into a timeline per kid. Never
          sold. Never trained on.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Link
            href="/#start"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sprout-cream text-[#1B3722] font-bold hover:bg-white transition-colors"
          >
            Join the waitlist
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <Link
            href="/resources"
            className="text-sprout-cream/70 hover:text-sprout-cream text-sm font-semibold transition-colors"
          >
            Or make a free worksheet while you wait
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function BackToBlog() {
  return (
    <Link
      href="/blog"
      className="inline-flex items-center gap-2 text-[#1B3722]/60 text-sm font-semibold hover:text-[#1B3722] transition-colors"
    >
      <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
      All articles
    </Link>
  );
}
