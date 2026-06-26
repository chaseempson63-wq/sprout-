"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { showsResourcesNav } from "@/lib/resources/nav";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { SproutLogo } from "../../_components/Glass";

/* Floating "need help?" Sprout across the Resources pages. Mirrors the landing
   mascot: a cream bubble over the character, with a dismiss × that hides it for
   the rest of the session (a small "bring back" pill takes its place; tapping it
   or a full reload restores it). On the how-to guide it stays put but flips to a
   "go back" prompt instead of vanishing. Dismiss state lives here, and this is
   mounted in the resources layout (which persists across resources navigations),
   so it stays hidden as you move around and resets on reload, exactly like the
   landing mascot.

   Position: on pages that show the bottom nav, it sits higher on mobile so the
   two don't overlap (on desktop the nav is centered, so the corner is clear). */
export function HelpMascot() {
  const pathname = usePathname();
  const onGuide = pathname === "/resources/how-to";
  const [dismissed, setDismissed] = useState(false);

  // Clear the bottom nav on mobile when it's present; desktop stays low (the
  // nav is centered, far from the corner).
  const corner = cn(
    "fixed right-3 z-50 md:right-5 md:bottom-5",
    showsResourcesNav(pathname) ? "bottom-28" : "bottom-3",
  );

  // Dismissed → a small cream "bring back" pill in the same corner.
  if (dismissed) {
    return (
      <button
        type="button"
        onClick={() => setDismissed(false)}
        aria-label="Bring back Sprout help"
        className={cn(
          "no-print animate-mascot-pop flex size-11 items-center justify-center rounded-full bg-[#F4EDE0] text-[#1B3722] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] ring-1 ring-[#1B3722]/10 transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1B3722]/40 focus-visible:outline-none",
          corner,
        )}
      >
        <SproutLogo className="size-5" />
      </button>
    );
  }

  const bubble = onGuide ? "tap to go back" : "need help? tap me";
  const href = onGuide ? "/resources" : "/resources/how-to";
  const label = onGuide ? "Go back to the worksheets" : "Need help? Open the how-to guide";

  return (
    <div className={cn("no-print", corner)}>
      <div className="relative flex flex-col items-end gap-2">
        {/* Dismiss × — a sibling of the link (not inside it) so a tap here hides
            the mascot and never navigates. Same look as the landing mascot. */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Hide Sprout help"
          className="absolute -top-2 -right-2 z-10 flex size-6 items-center justify-center rounded-full bg-[#1B3722] text-[#FBF6EB] transition-colors hover:bg-[#0F1311] focus-visible:ring-2 focus-visible:ring-[#D8FF9A]/60 focus-visible:outline-none"
        >
          <X className="size-3" strokeWidth={2.5} />
        </button>

        <Link href={href} aria-label={label} className="group flex flex-col items-end gap-2">
          <span className="relative rounded-2xl bg-[#F4EDE0] px-4 py-2.5 text-[13px] leading-snug font-bold text-[#1B3722] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] transition-transform group-hover:-translate-y-0.5 md:text-[15px]">
            {bubble}
            <span aria-hidden className="absolute right-7 -bottom-1.5 size-3 rotate-45 bg-[#F4EDE0]" />
          </span>
          <span className="animate-mascot-float aspect-[330/460] h-[116px] md:h-[136px]" aria-hidden>
            <SproutMascotIcon className="h-full w-full" />
          </span>
        </Link>
      </div>
    </div>
  );
}
