"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutGrid, MessagesSquare, PenLine, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { showsResourcesNav } from "@/lib/resources/nav";

/* Floating bottom nav for Sprout Resources. A row of icon pills sitting on a
   raised, 3D, wavy green "blob" a couple shades brighter than the page canvas,
   so it lifts off the background. The current page's item expands into a cream
   pill with its label (so it's always clear where you are, even on mobile);
   on desktop, hovering any other item expands it too. No animation library —
   pure CSS width/opacity transitions. */

const ITEMS: { href: string; label: string; Icon: typeof LayoutGrid; match: (p: string) => boolean }[] = [
  { href: "/resources", label: "Library", Icon: LayoutGrid, match: (p) => p === "/resources" },
  { href: "/resources/custom", label: "Build", Icon: PenLine, match: (p) => p === "/resources/custom" },
  { href: "/resources/forum", label: "Forum", Icon: MessagesSquare, match: (p) => p.startsWith("/resources/forum") },
  { href: "/resources/how-to", label: "Guide", Icon: BookOpen, match: (p) => p === "/resources/how-to" },
  { href: "/resources/privacy", label: "Privacy", Icon: ShieldCheck, match: (p) => p === "/resources/privacy" },
];

export function ResourcesNav() {
  const pathname = usePathname();
  if (!showsResourcesNav(pathname)) return null;

  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto relative">
        {/* Soft glow halo behind the blob. */}
        <div aria-hidden className="absolute -inset-3 rounded-[2.5rem] bg-[#9BD27E]/25 blur-2xl" />

        {/* The 3D green blob — brighter sage at the top fading to forest, lifted
            with a deep drop shadow + a bright inner top edge, rimmed in lime. */}
        <div
          aria-hidden
          className="absolute -inset-x-2.5 -inset-y-2 overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-[#6FA877] to-[#33583a] ring-1 ring-[#CDEFA0]/30"
          style={{
            boxShadow:
              "0 22px 45px -12px rgba(0,0,0,0.65), 0 6px 14px rgba(0,0,0,0.35), inset 0 2px 1px rgba(255,255,255,0.45), inset 0 -4px 8px rgba(0,0,0,0.28)",
          }}
        >
          {/* Wave texture, echoing the page background's layered waves. */}
          <svg className="absolute inset-x-0 top-0 h-9 w-full" preserveAspectRatio="none" viewBox="0 0 420 40" aria-hidden>
            <path d="M0,22 C70,8 150,30 210,20 C270,10 340,30 420,18 L420,0 L0,0 Z" fill="#C3E6B4" opacity="0.45" />
            <path d="M0,30 C90,18 160,36 240,26 C300,18 360,32 420,26 L420,40 L0,40 Z" fill="#2C4D33" opacity="0.30" />
          </svg>
        </div>

        {/* Nav items. */}
        <nav className="relative flex items-center gap-1 px-1.5 py-1.5" aria-label="Sprout Resources">
          {ITEMS.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                title={label}
                className={cn(
                  "group/item relative flex items-center justify-center rounded-full px-3 py-2.5 text-sm font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sprout-cream/60",
                  active
                    ? "bg-sprout-cream text-sprout-ink shadow-[0_4px_12px_-2px_rgba(0,0,0,0.45)]"
                    : "text-sprout-cream/90 hover:bg-white/15",
                )}
              >
                <Icon className="size-5 shrink-0" strokeWidth={2.2} />
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
                    active
                      ? "ml-2 max-w-[6rem] opacity-100"
                      : "ml-0 max-w-0 opacity-0 md:group-hover/item:ml-2 md:group-hover/item:max-w-[6rem] md:group-hover/item:opacity-100",
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
