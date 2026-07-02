"use client";

// A heart reaction on a Sprout Team announcement. Optimistic toggle, reconciles
// with the server. Disabled until the reader has a name (reactions are
// attributed) and when the social layer is off. `light` styles it for the dark
// (latest) announcement card.

import { useState } from "react";
import { Heart } from "lucide-react";
import { makerWire, toggleAnnouncementHeart } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { cn } from "@/lib/utils";

export function AnnouncementHeart({
  id,
  count,
  hearted,
  light = false,
}: {
  id: string;
  count: number;
  hearted: boolean;
  light?: boolean;
}) {
  const { account } = useResources();
  const [n, setN] = useState(count);
  const [on, setOn] = useState(hearted);
  const [busy, setBusy] = useState(false);

  async function click() {
    if (!account || busy) return;
    setBusy(true);
    const prevOn = on;
    const prevN = n;
    const next = !on;
    setOn(next);
    setN((c) => Math.max(0, c + (next ? 1 : -1)));
    const res = await toggleAnnouncementHeart(makerWire(account), id);
    if (res.disabled) {
      setOn(prevOn);
      setN(prevN);
    } else {
      setOn(res.hearted);
      setN(res.count);
    }
    setBusy(false);
  }

  const title = account ? (on ? "Remove your heart" : "Leave a heart") : "Add your name to react";

  return (
    <button
      type="button"
      onClick={click}
      disabled={!account || busy}
      aria-pressed={on}
      title={title}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition active:scale-95 disabled:cursor-default disabled:opacity-70",
        on
          ? "bg-rose-500/90 text-white shadow-[0_6px_16px_-6px_rgba(244,63,94,0.6)]"
          : light
            ? "bg-sprout-cream/15 text-sprout-cream hover:bg-sprout-cream/25"
            : "border border-[#2E5A35]/20 bg-white/60 text-[#1B3722]/70 hover:bg-white",
      )}
    >
      <Heart className={cn("size-3.5", on && "fill-white")} />
      {n > 0 ? n : ""}
    </button>
  );
}
