"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Entry, Kid } from "@/lib/sprout/types";
import { subjectById, type Subject } from "@/lib/sprout/subjects";
import { timeLabel } from "@/lib/sprout/stats";
import { card } from "./ui";
import { KidChip, SubjectChip } from "./chips";

/* A moment in the timeline. Photo on top when there is one, the note,
   then who + what kind of thing + when. */

export function EntryCard({
  entry,
  kids,
  highlight = false,
}: {
  entry: Entry;
  kids: Kid[];
  highlight?: boolean;
}) {
  const subject = subjectById(entry.subjectId);
  const src = entry.photo ?? entry.photoUrl ?? null;
  const entryKids = kids.filter((k) => entry.kidIds.includes(k.id));

  return (
    <article className={cn(card, "overflow-hidden", highlight && "animate-app-rise")}>
      {src && <EntryPhoto src={src} subject={subject} />}
      <div className="px-4 py-3.5">
        <p className="text-[15px] leading-relaxed text-app-pine">{entry.note}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          {entryKids.map((kid) => (
            <KidChip key={kid.id} kid={kid} />
          ))}
          {subject && <SubjectChip subject={subject} />}
          <span className="ml-auto text-[11.5px] text-app-pine/45">
            {timeLabel(entry.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

/* Demo photos are remote; if one ever fails to load the card falls back
   to a quiet subject-tinted frame instead of a broken image. */
function EntryPhoto({ src, subject }: { src: string; subject: Subject | null }) {
  const [failed, setFailed] = useState(false);
  const tint = subject?.color ?? "#1e4636";
  const Icon = subject?.icon ?? Camera;

  if (failed) {
    return (
      <div
        aria-hidden="true"
        className="grid aspect-[4/3] w-full place-items-center"
        style={{
          background: `linear-gradient(150deg, ${tint}0d 0%, ${tint}26 100%)`,
        }}
      >
        <Icon size={36} strokeWidth={1.75} style={{ color: `${tint}99` }} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- local data URLs + demo images, no optimizer needed
    <img
      src={src}
      alt="Photo from this moment"
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-[4/3] w-full object-cover"
    />
  );
}
