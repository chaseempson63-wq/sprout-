"use client";

// Owner-only hide (soft-delete). Renders nothing unless the signed-in local
// account owns the target. Admin-level "hide anyone" is the /api/resources/admin
// route, not this control. Render on a light surface (dark text).

import { useState } from "react";
import { Check, EyeOff, X } from "lucide-react";
import { hideOwn, makerWire } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { GlassButton } from "@/components/ui/glass";
import type { VoteTarget } from "@/lib/resources/types";

export function HideControl({
  targetType,
  targetId,
  ownerId,
  onHidden,
  className = "",
}: {
  targetType: VoteTarget;
  targetId: string;
  ownerId: string;
  onHidden?: () => void;
  className?: string;
}) {
  const { account } = useResources();
  const [state, setState] = useState<"idle" | "confirm" | "busy">("idle");
  if (!account || account.id !== ownerId) return null;
  const acc = account;

  async function confirm() {
    setState("busy");
    const res = await hideOwn(makerWire(acc), targetType, targetId);
    if (res.ok) onHidden?.();
    else setState("idle");
  }

  if (state === "confirm" || state === "busy") {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <span className="text-xs text-[#1B3722]/60">Hide it?</span>
        <GlassButton onClick={confirm} disabled={state === "busy"} aria-label="Confirm hide" className="size-7">
          <Check className="size-3.5" />
        </GlassButton>
        <GlassButton onClick={() => setState("idle")} disabled={state === "busy"} aria-label="Cancel" className="size-7">
          <X className="size-3.5" />
        </GlassButton>
      </span>
    );
  }

  return (
    <GlassButton onClick={() => setState("confirm")} title="Hide this" aria-label="Hide" className={`size-7 ${className}`}>
      <EyeOff className="size-3.5" />
    </GlassButton>
  );
}
