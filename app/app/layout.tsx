import type { Metadata, Viewport } from "next";
import { SproutProvider } from "@/lib/sprout/store";
import { SproutLogo } from "@/app/_components/Glass";
import { AppNav } from "./_components/AppNav";
import { HeaderStreak } from "./_components/HeaderStreak";

/* The app interior. Unlinked from the landing page on purpose and kept
   out of search indexes while the product is pre-launch. */

export const metadata: Metadata = {
  title: "Your week | Sprout",
  description: "Everything they did this week, in one place.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#faf6ec",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SproutProvider>
      <div className="app-canvas min-h-dvh w-full text-app-pine">
        <div className="app-grain" aria-hidden="true" />
        <header className="mx-auto flex w-full max-w-lg items-center justify-between px-5 pb-2 pt-6">
          <div className="flex items-center gap-2">
            <span
              className="grid size-8 place-items-center rounded-xl text-app-lime shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_6px_-1px_rgba(16,40,28,0.35)]"
              style={{ background: "linear-gradient(155deg, #29543f 0%, #16382a 80%)" }}
            >
              <SproutLogo className="size-5" />
            </span>
            <span className="font-display text-[17px] font-bold tracking-tight text-app-forest">
              Sprout
            </span>
          </div>
          <HeaderStreak />
        </header>
        <main className="mx-auto w-full max-w-lg px-5 pb-40 pt-3">{children}</main>
        <AppNav />
      </div>
    </SproutProvider>
  );
}
