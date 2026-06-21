import type { Metadata } from "next";
import Link from "next/link";
import { SproutLogo } from "../_components/Glass";
import { ResourcesProvider } from "@/lib/resources/store";

export const metadata: Metadata = {
  title: "Sprout Resources — make resources tailored to your child",
  description:
    "Create worksheets, activities, and lesson plans tailored to each child in minutes. Your data stays yours.",
};

// Same fractal-noise overlay the homepage uses over the green canvas.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")";

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResourcesProvider>
      <div className="text-sprout-cream relative flex min-h-screen flex-col overflow-x-hidden">
        {/* Continuous green canvas — same brand surface as the homepage. */}
        <div className="fixed inset-0 -z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132] via-[#3D6643] to-[#1B3722]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
            style={{ backgroundImage: NOISE }}
          />
        </div>

        <header className="no-print relative z-10">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
            <Link href="/resources" className="text-sprout-cream flex items-center gap-2 text-lg font-bold">
              <SproutLogo className="text-sprout-cream h-5 w-5" />
              <span>
                Sprout <span className="text-sprout-cream/55 font-semibold">Resources</span>
              </span>
            </Link>
            <Link
              href="/"
              className="bg-sprout-cream/10 border-sprout-cream/20 text-sprout-cream hover:bg-sprout-cream/15 inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold backdrop-blur-md transition-colors"
            >
              Back to site
            </Link>
          </div>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>

        <footer className="no-print border-sprout-cream/10 text-sprout-cream/55 relative z-10 border-t px-6 py-6 text-center text-xs">
          Made with Sprout · your data stays yours, never sold, never used to train AI.
        </footer>
      </div>
    </ResourcesProvider>
  );
}
