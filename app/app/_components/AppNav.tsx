"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/app", label: "This week", icon: House },
  { href: "/app/timeline", label: "Timeline", icon: CalendarDays },
];

/* Floating glass pill with the capture button in the middle. Hidden on the
   capture screen itself so the moment gets the full frame. */

export function AppNav() {
  const pathname = usePathname();
  if (pathname === "/app/new") return null;

  const [week, timeline] = TABS;

  return (
    <nav
      aria-label="Sprout"
      className="fixed inset-x-0 z-40 flex justify-center px-5"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-1.5 rounded-full border border-app-pine/[0.07] bg-white/80 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_8px_rgba(16,40,28,0.06),0_12px_36px_-8px_rgba(16,40,28,0.24)] backdrop-blur-2xl">
        <Tab tab={week} active={pathname === week.href} />
        <Link
          href="/app/new"
          aria-label="Log a moment"
          className="grid size-12 place-items-center rounded-full text-app-forest shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_16px_rgba(133,176,44,0.5)] transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(165deg, #cdf271 0%, #aad63e 90%)" }}
        >
          <Plus size={22} strokeWidth={2.75} />
        </Link>
        <Tab tab={timeline} active={pathname.startsWith(timeline.href)} />
      </div>
    </nav>
  );
}

function Tab({
  tab,
  active,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
}) {
  const Icon = tab.icon;
  return (
    <Link
      href={tab.href}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors duration-200",
        active
          ? "bg-app-forest text-app-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
          : "text-app-forest/60 hover:text-app-forest",
      )}
    >
      <Icon size={15} strokeWidth={2.25} aria-hidden="true" />
      {tab.label}
    </Link>
  );
}
