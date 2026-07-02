"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { Check, FolderPlus } from "lucide-react";
import { useResources } from "@/lib/resources/store";
import { capName } from "@/lib/resources/util";
import { cn } from "@/lib/utils";
import type { Worksheet } from "@/lib/resources/types";

// "Add to a kid's profile" — saves the worksheet you're looking at into one of
// your kids' private profiles (kid profiles never leave this browser). Opens a
// small picker of your kids; if you have none yet, it points you to add one.
export function AddToKid({ worksheet, source = "ai", className = "" }: { worksheet: Worksheet; source?: "ai" | "template"; className?: string }) {
  const { kids, saveWorksheet } = useResources();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  function add(kidId: string, kidName: string) {
    saveWorksheet(worksheet, source, kidId);
    track("resources_add_to_kid", {});
    setOpen(false);
    setDone(capName(kidName));
    window.setTimeout(() => setDone(null), 2600);
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2E5A35] font-bold text-white shadow-[0_10px_24px_-10px_rgba(46,90,53,0.7)] transition hover:bg-[#346a3f] active:scale-95",
          className,
        )}
      >
        {done ? (
          <>
            <Check className="size-4 shrink-0" /> Added to {done}
          </>
        ) : (
          <>
            <FolderPlus className="size-4 shrink-0" /> Add to a kid
          </>
        )}
      </button>

      {open && (
        <>
          <button aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-[55] cursor-default" />
          <div className="absolute right-0 z-[60] mt-2 w-60 overflow-hidden rounded-2xl border border-[#2E5A35]/15 bg-[#FBF7EE] p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)]">
            <p className="px-2 py-1.5 text-[11px] font-bold tracking-[0.12em] text-[#2E5A35]/70 uppercase">Save to a kid&apos;s profile</p>
            {kids.length === 0 ? (
              <p className="px-2 py-2 text-sm leading-relaxed text-[#1B3722]/65">
                No kids yet. Add one from the{" "}
                <Link href="/resources" className="font-semibold text-[#2E5A35] underline-offset-2 hover:underline">
                  library
                </Link>
                , then save worksheets to their profile.
              </p>
            ) : (
              kids.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => add(k.id, k.name)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-[#1B3722] transition hover:bg-[#2E5A35]/[0.08]"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#2E5A35] text-xs font-bold text-white">{capName(k.name).charAt(0)}</span>
                  <span className="min-w-0 flex-1 truncate">{capName(k.name)}</span>
                  <span className="shrink-0 text-xs text-[#1B3722]/50">age {k.age}</span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
