import type { Metadata } from "next";
import Link from "next/link";
import { MessagesSquare, ShieldCheck } from "lucide-react";
import { SproutMascotIcon } from "../_components/SproutMascotIcon";
import { AccountChip } from "./_components/AccountChip";
import { FeedbackButton } from "./_components/FeedbackButton";
import { ResourcesIntro } from "./_components/ResourcesIntro";
import { GlassFilter, GlassLink } from "@/components/ui/glass";
import { ResourcesProvider } from "@/lib/resources/store";

export const metadata: Metadata = {
  title: "Sprout Resources. Worksheets tailored to your child.",
  description:
    "Create worksheets, activities, and lesson plans tailored to each child in minutes. Your data stays yours.",
};

// Same fractal-noise overlay the homepage uses over the green canvas.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")";

// Pre-paint gate for the page-load intro (ResourcesIntro). Runs synchronously
// before first paint so a first-time hub visit shows the curtain immediately,
// and returning / reduced-motion / no-JS visitors never flash it. The component
// takes over once hydrated (drives "reveal" → "off").
const INTRO_GATE =
  "(()=>{try{var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;var hub=location.pathname==='/resources';document.documentElement.setAttribute('data-resources-intro',(hub&&!rm)?'play':'off');}catch(e){document.documentElement.setAttribute('data-resources-intro','off');}})()";

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResourcesProvider>
      {/* Pre-paint gate must run before the overlay below is parsed. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      <ResourcesIntro />
      <GlassFilter />
      <div className="text-sprout-cream relative flex min-h-screen flex-col overflow-x-hidden">
        {/* Continuous green canvas — same brand surface as the homepage. */}
        <div className="fixed inset-0 -z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132] via-[#3D6643] to-[#1B3722]" />
          <svg className="absolute inset-x-0 top-0 h-[75vh] w-full" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0,400 C320,280 480,520 720,420 C960,320 1120,560 1440,440 L1440,900 L0,900 Z" fill="#94BC8E" opacity="0.10" />
            <path d="M0,560 C240,460 560,640 880,540 C1120,460 1280,620 1440,560 L1440,900 L0,900 Z" fill="#4D7B53" opacity="0.18" />
            <path d="M0,700 C320,620 720,800 1100,720 C1300,680 1380,740 1440,720 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.30" />
          </svg>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
            style={{ backgroundImage: NOISE }}
          />
        </div>

        <header className="no-print relative z-10">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link href="/resources" className="text-sprout-cream flex shrink-0 items-center gap-2.5 text-lg font-bold whitespace-nowrap">
              {/* Mascot is the top-left header logo on desktop; hidden on mobile to
                  free room so the wordmark + nav read across one line. */}
              <span className="bg-sprout-cream/95 hidden size-9 place-items-center rounded-xl shadow-sm sm:grid">
                <SproutMascotIcon className="h-6 w-6" />
              </span>
              <span>
                Sprout <span className="text-sprout-cream/60 font-semibold">Resources</span>
              </span>
            </Link>
            {/* On mobile the options don't fit, so the bar scrolls sideways and
                shows them all (Create profile, Forum, Message us, Privacy) instead
                of hiding some. Desktop is right-aligned and fits, no scroll. */}
            <div className="flex min-w-0 flex-1 items-center justify-start gap-2 overflow-x-auto sm:justify-end">
              <AccountChip />
              <GlassLink href="/resources/forum" className="h-9 shrink-0 gap-1 px-3 text-xs">
                <MessagesSquare className="size-4" /> Forum
              </GlassLink>
              <FeedbackButton />
              <GlassLink href="/resources/privacy" className="inline-flex h-9 shrink-0 gap-1 px-3 text-xs">
                <ShieldCheck className="size-4" /> Privacy
              </GlassLink>
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-16 lg:px-12">{children}</main>

        <footer className="no-print border-sprout-cream/10 text-sprout-cream/55 relative z-10 border-t px-6 py-6 text-center text-xs">
          Made with Sprout ·{" "}
          <Link href="/resources/privacy" className="hover:text-sprout-cream underline-offset-2 hover:underline">
            your data stays yours, never sold, never used to train AI
          </Link>
          .
        </footer>
      </div>
    </ResourcesProvider>
  );
}
