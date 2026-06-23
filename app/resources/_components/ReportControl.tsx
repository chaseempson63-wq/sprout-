"use client";

// A lightweight two-step report flag (no form). Writes a row to the moderation
// queue. Low-friction by design — anyone can report, name optional. Render on a
// light surface (dark text).

import { useState } from "react";
import { Check, Flag, X } from "lucide-react";
import { makerWire, reportTarget } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { GlassButton } from "@/components/ui/glass";
import type { VoteTarget } from "@/lib/resources/types";

export function ReportControl({
  targetType,
  targetId,
  className = "",
}: {
  targetType: VoteTarget;
  targetId: string;
  className?: string;
}) {
  const { account } = useResources();
  const [state, setState] = useState<"idle" | "confirm" | "done">("idle");

  async function confirm() {
    setState("done");
    await reportTarget(account ? makerWire(account) : null, targetType, targetId);
  }

  if (state === "done") return <span className={`text-xs text-[#1B3722]/50 ${className}`}>Reported, thanks</span>;

  if (state === "confirm") {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <span className="text-xs text-[#1B3722]/60">Report this?</span>
        <GlassButton onClick={confirm} aria-label="Confirm report" className="size-7">
          <Check className="size-3.5" />
        </GlassButton>
        <GlassButton onClick={() => setState("idle")} aria-label="Cancel" className="size-7">
          <X className="size-3.5" />
        </GlassButton>
      </span>
    );
  }

  return (
    <GlassButton onClick={() => setState("confirm")} title="Report" aria-label="Report" className={`size-7 ${className}`}>
      <Flag className="size-3.5" />
    </GlassButton>
  );
}
