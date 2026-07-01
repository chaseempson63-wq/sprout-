"use client";

// Upvote toggle backed by the DB. Optimistic, reconciles with the server count.
// Disabled (with a hint) until the user has set their name, since votes are
// attributed to a maker. Used on community posts, forum threads, and comments.

import { useState } from "react";
import { ArrowBigUp } from "lucide-react";
import { makerWire, toggleVote } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { GlassButton } from "@/components/ui/glass";
import type { VoteTarget } from "@/lib/resources/types";

export function UpvoteButton({
  targetType,
  targetId,
  count,
  voted = false,
  className = "",
}: {
  targetType: VoteTarget;
  targetId: string;
  count: number;
  voted?: boolean;
  className?: string;
}) {
  const { account } = useResources();
  const [n, setN] = useState(count);
  const [on, setOn] = useState(voted);
  const [busy, setBusy] = useState(false);

  async function click() {
    if (!account || busy) return;
    setBusy(true);
    const prevOn = on;
    const prevN = n;
    const nextOn = !on;
    setOn(nextOn);
    setN((c) => c + (nextOn ? 1 : -1));
    const res = await toggleVote(makerWire(account), targetType, targetId);
    if (res.disabled) {
      setOn(prevOn);
      setN(prevN);
    } else {
      setOn(res.voted);
      setN(res.upvotes);
    }
    setBusy(false);
  }

  const label = account ? (on ? "Remove your upvote" : "Upvote") : "Add your name to vote";

  // Active = a solid green pill (unmistakable "upvoted"). Inactive keeps the
  // glass look. Rendering a plain button when on avoids the glass overlay
  // swallowing the fill.
  if (on) {
    return (
      <button
        type="button"
        onClick={click}
        disabled={!account || busy}
        aria-pressed
        title={label}
        className={`inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-[#2E7D32] px-2.5 text-xs font-bold text-white shadow-[0_6px_16px_-6px_rgba(46,125,50,0.65)] transition active:scale-95 disabled:opacity-70 ${className}`}
      >
        <ArrowBigUp className="size-4 fill-white text-white" />
        {n}
      </button>
    );
  }

  return (
    <GlassButton
      onClick={click}
      disabled={!account || busy}
      aria-pressed={false}
      title={label}
      className={`h-8 gap-1 px-2.5 text-xs ${className}`}
    >
      <ArrowBigUp className="size-4" />
      {n}
    </GlassButton>
  );
}
