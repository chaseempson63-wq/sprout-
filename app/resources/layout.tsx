import type { Metadata } from "next";
import Link from "next/link";
import { SproutMascotIcon } from "../_components/SproutMascotIcon";
import { AccountChip } from "./_components/AccountChip";
import { FeedbackButton } from "./_components/FeedbackButton";
import { HelpMascot } from "./_components/HelpMascot";
import { ResourcesNav } from "./_components/ResourcesNav";
import { ResourcesTutorial } from "./_components/ResourcesTutorial";
import { GlassFilter } from "@/components/ui/glass";
import { ResourcesProvider } from "@/lib/resources/store";
import { RESOURCES_DEMO, RESOURCES_MINIMAL } from "@/lib/resources/demo";

export const metadata: Metadata = {
  title: "Sprout Resources. Worksheets tailored to your child.",
  description:
    "336 free printable worksheet templates for ages 3 to 13, every one in 6 difficulty levels. No account, no email, no watermark. Your data stays yours.",
  // Without this the page inherits the root card ("Where your kid's week of
  // learning lives"), which pitches the app on a link people are sharing for
  // the free worksheets. Every share of /resources should say what /resources is.
  openGraph: {
    title: "336 free homeschool worksheets. No account, no email.",
    description:
      "Printable worksheets for ages 3 to 13. Every story comes in 6 levels, so a 5 year old and an 11 year old can work from the same one at the same table.",
    url: "https://hisprout.app/resources",
    siteName: "Sprout",
    type: "website",
  },
};

// Same fractal-noise overlay the homepage uses over the green canvas.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")";

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResourcesProvider>
      {/* The page-load intro is mounted site-wide in the root layout. */}
      <GlassFilter />
      {/* First-run how-to, once per session, after the intro finishes.
          Minimal stage: nothing pops over the library, you land on worksheets. */}
      {!RESOURCES_MINIMAL && <ResourcesTutorial />}
      {/* Floating "need help?" Sprout → the how-to guide (hides itself on it). */}
      {!RESOURCES_MINIMAL && <HelpMascot />}
      {/* Floating bottom nav on a 3D green blob (hidden on the builder; see lib/resources/nav). */}
      <ResourcesNav />
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
            {/* Brand actions only — Forum and Privacy now live in the bottom nav. */}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              {/* Creator profiles pair with the community — hidden while it's teased. */}
              {!RESOURCES_DEMO && <AccountChip />}
              <FeedbackButton />
            </div>
          </div>
        </header>

        <main className="intro-stagger relative z-10 mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-10 sm:py-16 lg:px-16">{children}</main>

        <footer className="no-print border-sprout-cream/10 text-sprout-cream/55 relative z-10 border-t px-6 pt-6 pb-28 text-center text-xs">
          Made with Sprout ·{" "}
          <Link
            href={RESOURCES_DEMO ? "/privacy" : "/resources/privacy"}
            className="hover:text-sprout-cream underline-offset-2 hover:underline"
          >
            your data stays yours, never sold, never used to train AI
          </Link>
          .
        </footer>
      </div>
    </ResourcesProvider>
  );
}
