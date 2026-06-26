import { cn } from "@/lib/utils";

// The shared "alive" pill look across the Resources chrome — the header actions
// (profile, Message us), the library tabs, and the topic + community filters.
// One language so the whole surface feels cohesive with the bottom nav: a
// translucent cream pill at rest, and a filled cream pill that pops forward
// (scale + shadow) when it's the selected one. `extra` carries size/spacing.

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-full font-bold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sprout-cream/50";
const ACTIVE = "bg-sprout-cream text-sprout-ink shadow-[0_8px_18px_-5px_rgba(0,0,0,0.5)] scale-[1.05]";
const INACTIVE = "bg-sprout-cream/10 text-sprout-cream/90 border border-sprout-cream/20 hover:bg-sprout-cream/20";

export function pill(active?: boolean, extra?: string): string {
  return cn(BASE, active ? ACTIVE : INACTIVE, extra);
}
