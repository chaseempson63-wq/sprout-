"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Entry, Kid } from "@/lib/sprout/types";
import { subjectById, type Subject } from "@/lib/sprout/subjects";
import { timeLabel } from "@/lib/sprout/stats";
import { alpha } from "@/lib/sprout/color";
import { card } from "./ui";
import { KidChip, SubjectChip } from "./chips";

/* A moment in the timeline. Photo on top when there is one, the note,
   then who + what kind of thing + when. `vt` names the card as a shared
   element so it can morph into its grid tile. */

export function EntryCard({
  entry,
  kids,
  highlight = false,
  vt,
}: {
  entry: Entry;
  kids: Kid[];
  highlight?: boolean;
  vt?: string;
}) {
  const subject = subjectById(entry.subjectId);
  const src = entry.photo ?? entry.photoUrl ?? null;
  const entryKids = kids.filter((k) => entry.kidIds.includes(k.id));

  return (
    <article
      style={vt ? { viewTransitionName: vt } : undefined}
      className={cn(
        card,
        "overflow-hidden transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-[0_2px_3px_rgba(16,40,28,0.04),0_20px_44px_-18px_rgba(16,40,28,0.18)]",
        highlight && "animate-app-rise",
      )}
    >
      {src && <EntryPhoto src={src} subject={subject} />}
      <div className="px-4 py-3.5">
        <p className="text-[15px] leading-[1.55] text-app-pine">{entry.note}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          {entryKids.map((kid) => (
            <KidChip key={kid.id} kid={kid} />
          ))}
          {subject && <SubjectChip subject={subject} />}
          <span className="ml-auto text-[11.5px] tabular-nums text-app-pine/45">
            {timeLabel(entry.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

/* Demo photos are remote; if one ever fails to load the card falls back
   to a quiet subject-tinted frame instead of a broken image. The inset
   hairline keeps light photo edges from bleeding into the card. */
function EntryPhoto({ src, subject }: { src: string; subject: Subject | null }) {
  const [failed, setFailed] = useState(false);
  const tintColor = subject?.color ?? "#1e4636";
  const Icon = subject?.icon ?? Camera;

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className="grid aspect-[4/3] w-full place-items-center"
        style={{
          background: `linear-gradient(150deg, ${alpha(tintColor, 0.05)} 0%, ${alpha(tintColor, 0.15)} 100%)`,
        }}
      >
        <Icon size={36} strokeWidth={1.75} style={{ color: alpha(tintColor, 0.6) }} />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element -- local data URLs + demo images, no optimizer needed */}
      <img
        src={src}
        alt="Photo from this moment"
        loading="lazy"
        onError={() => setFailed(true)}
        className="aspect-[4/3] w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(20,46,34,0.06),inset_0_-24px_32px_-28px_rgba(20,46,34,0.35)]"
      />
    </div>
  );
}
