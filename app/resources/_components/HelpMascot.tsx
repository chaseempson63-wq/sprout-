"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";

/* Floating "need help?" Sprout on the Resources pages. Taps through to the
   how-to guide. Hidden on the guide itself (you're already there). Mirrors the
   landing mascot's cream-bubble-over-character look so it reads as the same
   Sprout, just here to help. Pure link, no client state beyond the route check. */
export function HelpMascot() {
  const pathname = usePathname();
  if (pathname === "/resources/how-to") return null;

  return (
    <Link
      href="/resources/how-to"
      aria-label="Need help? Open the how-to guide"
      className="no-print group fixed right-3 bottom-3 z-50 flex flex-col items-end gap-2 md:right-5 md:bottom-5"
    >
      <span className="relative rounded-2xl bg-[#F4EDE0] px-4 py-2.5 text-[13px] leading-snug font-bold text-[#1B3722] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] transition-transform group-hover:-translate-y-0.5 md:text-[15px]">
        need help? tap me
        <span aria-hidden className="absolute right-7 -bottom-1.5 size-3 rotate-45 bg-[#F4EDE0]" />
      </span>
      <span className="animate-mascot-float aspect-[330/460] h-[116px] self-end md:h-[136px]" aria-hidden>
        <SproutMascotIcon className="h-full w-full" />
      </span>
    </Link>
  );
}
