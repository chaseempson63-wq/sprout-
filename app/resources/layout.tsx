import type { Metadata } from "next";
import Link from "next/link";
import { ResourcesProvider } from "@/lib/resources/store";

export const metadata: Metadata = {
  title: "Sprout Resources — make resources tailored to your child",
  description:
    "Create worksheets, activities, and lesson plans tailored to each child in minutes. Your data stays yours.",
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResourcesProvider>
      <div className="bg-sprout-cream text-sprout-ink flex min-h-screen flex-col">
        <header className="no-print border-border/70 bg-sprout-cream/85 sticky top-0 z-20 border-b backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/resources" className="flex items-center gap-2">
              <span className="bg-sprout-forest text-sprout-cream font-display grid size-7 place-items-center rounded-lg text-sm">
                S
              </span>
              <span className="font-display text-lg tracking-tight">
                Sprout <span className="text-sprout-forest">Resources</span>
              </span>
            </Link>
            <span className="border-sprout-forest/20 text-sprout-forest rounded-full border bg-white px-3 py-1 text-xs font-medium">
              Free plan
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>

        <footer className="no-print border-border/70 text-muted-foreground border-t py-6 text-center text-xs">
          Made with Sprout · your data stays yours, never sold, never used to train AI.
        </footer>
      </div>
    </ResourcesProvider>
  );
}
