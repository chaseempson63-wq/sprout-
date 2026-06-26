"use client";

import { Check, UserPlus } from "lucide-react";
import { useResources } from "@/lib/resources/store";
import { cn } from "@/lib/utils";

// Follow / Following toggle for a creator. Stored locally (see the store's
// `following`), so it persists per browser without a backend yet.
export function FollowButton({ handle, name, photo, className = "" }: { handle: string; name: string; photo?: string; className?: string }) {
  const { isFollowing, toggleFollow } = useResources();
  const on = isFollowing(handle);
  return (
    <button
      type="button"
      onClick={() => toggleFollow({ handle, name, photo })}
      aria-pressed={on}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition active:scale-95",
        on
          ? "border border-[#2E5A35]/25 bg-[#2E5A35]/10 text-[#2E5A35] hover:bg-[#2E5A35]/15"
          : "bg-[#2E5A35] text-white shadow-[0_8px_18px_-6px_rgba(46,90,53,0.7)] hover:bg-[#346a3f]",
        className,
      )}
    >
      {on ? (
        <>
          <Check className="size-4" /> Following
        </>
      ) : (
        <>
          <UserPlus className="size-4" /> Follow
        </>
      )}
    </button>
  );
}
