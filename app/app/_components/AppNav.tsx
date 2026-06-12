"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/app", label: "This week", icon: House },
  { href: "/app/timeline", label: "Timeline", icon: CalendarDays },
];

/* Floating pill nav with the capture button in the middle. Hidden on the
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
      <div className="flex items-center gap-1.5 rounded-full border border-app-pine/[0.07] bg-white/85 p-1.5 shadow-[0_8px_30px_rgba(16,40,28,0.14)] backdrop-blur-xl">
        <Tab tab={week} active={pathname === week.href} />
        <Link
          href="/app/new"
          aria-label="Log a moment"
          className="grid size-12 place-items-center rounded-full bg-app-lime text-app-forest shadow-[0_4px_14px_rgba(133,176,44,0.45)] transition-transform hover:scale-105 active:scale-95"
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
        "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors",
        active
          ? "bg-app-forest text-app-cream"
          : "text-app-forest/60 hover:text-app-forest",
      )}
    >
      <Icon size={15} strokeWidth={2.25} aria-hidden="true" />
      {tab.label}
    </Link>
  );
}
