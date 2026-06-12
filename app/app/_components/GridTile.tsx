"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import type { Entry, Kid } from "@/lib/sprout/types";
import { subjectById } from "@/lib/sprout/subjects";
import { alpha } from "@/lib/sprout/color";

/* The grid form of a moment: a square, image-first tile. Photo entries are
   full-bleed with a scrim and a two-line caption; text entries become quiet
   typographic tiles in their subject's tint. Shares its view-transition
   name with the EntryCard so the two morph into each other. */

export function GridTile({
  entry,
  kids,
  vt,
}: {
  entry: Entry;
  kids: Kid[];
  vt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const subject = subjectById(entry.subjectId);
  const src = entry.photo ?? entry.photoUrl ?? null;
  const entryKids = kids.filter((k) => entry.kidIds.includes(k.id));
  const color = subject?.color ?? "#1e4636";
  const Icon = subject?.icon ?? PenLine;

  const style = vt ? { viewTransitionName: vt } : undefined;

  if (src && !failed) {
    return (
      <figure
        style={style}
        className="group relative aspect-square overflow-hidden rounded-[18px] bg-app-sand shadow-[0_1px_2px_rgba(16,40,28,0.05),0_10px_24px_-14px_rgba(16,40,28,0.2)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local data URLs + demo images */}
        <img
          src={src}
          alt="Photo from this moment"
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/65 via-black/25 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(20,46,34,0.05)]"
        />
        {subject && (
          <span className="absolute left-2 top-2 grid size-6 place-items-center rounded-full bg-white/85 backdrop-blur-sm">
            <Icon size={12} strokeWidth={2.25} style={{ color }} aria-hidden="true" />
          </span>
        )}
        <KidDots kids={entryKids} className="absolute right-2 top-2" />
        <figcaption className="absolute inset-x-0 bottom-0 p-2.5">
          <p className="line-clamp-2 text-[12px] font-medium leading-snug text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
            {entry.note}
          </p>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      style={{
        ...style,
        backgroundColor: alpha(color, 0.07),
        boxShadow: `inset 0 0 0 1px ${alpha(color, 0.14)}`,
      }}
      className="relative flex aspect-square flex-col rounded-[18px] p-3"
    >
      <div className="flex items-start justify-between">
        <Icon size={16} strokeWidth={2.25} style={{ color }} aria-hidden="true" />
        <KidDots kids={entryKids} />
      </div>
      <p className="mt-auto line-clamp-5 text-[12.5px] leading-snug text-app-pine/85">
        {entry.note}
      </p>
    </figure>
  );
}

function KidDots({ kids, className = "" }: { kids: Kid[]; className?: string }) {
  if (kids.length === 0) return null;
  return (
    <span className={`flex -space-x-1 ${className}`}>
      {kids.map((kid) => (
        <span
          key={kid.id}
          title={kid.name}
          className="grid size-4 place-items-center rounded-full text-[8px] font-bold text-white ring-1 ring-white/70"
          style={{ backgroundColor: kid.color }}
        >
          {kid.name[0]}
        </span>
      ))}
    </span>
  );
}
