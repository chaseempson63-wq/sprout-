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

  return (
    <GlassButton
      onClick={click}
      disabled={!account || busy}
      aria-pressed={on}
      title={account ? (on ? "Remove your upvote" : "Upvote") : "Add your name to vote"}
      className={`h-8 gap-1 px-2.5 text-xs ${on ? "ring-2 ring-[#2E5A35]/50" : ""} ${className}`}
    >
      <ArrowBigUp className={`size-4 ${on ? "fill-[#2E5A35] text-[#2E5A35]" : ""}`} />
      {n}
    </GlassButton>
  );
}
