"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Heart, X } from "lucide-react";
import { WorksheetDoc } from "../../_components/WorksheetDoc";
import { earnedBadges } from "@/lib/resources/badges";
import { COMMUNITY_SAMPLES } from "@/lib/resources/samples";
import { useResources } from "@/lib/resources/store";
import type { Worksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";
const glassBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-sprout-cream/10 border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors";

type Creation = { id: string; worksheet: Worksheet; creatorName: string };

export default function CreatorProfile() {
  const params = useParams();
  const raw = params?.handle;
  const handle = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const { ready, account, worksheets, kids, moments, likeCount, toggleLike, likedByMe } = useResources();
  const [viewing, setViewing] = useState<Worksheet | null>(null);

  if (!ready) return <div className="text-sprout-cream/60 py-20 text-center text-sm">Loading…</div>;

  const isMe = account?.handle === handle;
  const sampleMatch = COMMUNITY_SAMPLES.find((s) => s.creatorHandle === handle);
  const displayName = isMe ? (account?.displayName ?? handle) : (sampleMatch?.creatorName ?? handle);
  const photo = isMe ? account?.photo : undefined;

  const creations: Creation[] = [
    ...worksheets
      .filter((w) => w.published && (isMe || w.creatorHandle === handle))
      .map((w) => ({ id: w.id, worksheet: w as Worksheet, creatorName: w.creatorName || displayName })),
    ...COMMUNITY_SAMPLES.filter((s) => s.creatorHandle === handle).map((s) => ({ id: s.id, worksheet: s.worksheet, creatorName: s.creatorName })),
  ].sort((a, b) => likeCount(b.id) - likeCount(a.id));

  const totalLikes = creations.reduce((s, c) => s + likeCount(c.id), 0);
  const badges = earnedBadges({
    published: creations.length,
    totalLikes,
    worksheetsMade: isMe ? worksheets.length : creations.length,
    kids: isMe ? kids.length : 0,
    moments: isMe ? moments.length : 0,
  });

  return (
    <div>
      <Link href="/resources" className="no-print text-sprout-cream/80 hover:text-sprout-cream mb-5 inline-flex items-center gap-1 text-sm font-semibold">
        <ArrowLeft className="size-4" /> Library
      </Link>

      <div className={`${lightCard} mb-6 p-6`}>
        <div className="flex flex-wrap items-center gap-4">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={displayName} className="size-16 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#2E5A35] text-2xl font-bold text-white">{displayName.charAt(0).toUpperCase()}</span>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1B3722]">{displayName}</h1>
            <p className="text-sm text-[#1B3722]/55">@{handle}{isMe ? " · this is you" : ""}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { n: creations.length, l: creations.length === 1 ? "creation" : "creations" },
            { n: totalLikes, l: "likes" },
            { n: badges.length, l: "badges" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-[#2E5A35]/8 px-2 py-3 text-center">
              <div className="text-xl font-bold text-[#2E5A35]">{s.n}</div>
              <div className="text-[11px] text-[#1B3722]/60">{s.l}</div>
            </div>
          ))}
        </div>
        {badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b.id} title={b.desc} className="inline-flex items-center gap-1 rounded-full bg-[#2E5A35]/10 px-2.5 py-1 text-xs font-semibold text-[#2E5A35]">
                <span>{b.emoji}</span> {b.label}
              </span>
            ))}
          </div>
        )}
        {isMe && creations.length === 0 && (
          <p className="mt-4 text-sm text-[#1B3722]/60">You have not published anything yet. Make a worksheet, save it, then hit Publish to share it here.</p>
        )}
      </div>

      <h2 className="text-sprout-cream mb-3 text-xl font-bold">Creations</h2>
      {creations.length === 0 ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">No public creations yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {creations.map((c) => (
            <div key={c.id} className={`${lightCard} flex flex-col p-5`}>
              <button onClick={() => setViewing(c.worksheet)} className="min-w-0 flex-1 text-left">
                <h3 className="truncate font-bold text-[#1B3722]">{c.worksheet.title}</h3>
                <p className="mt-0.5 text-xs text-[#1B3722]/60">{c.worksheet.subtitle}</p>
              </button>
              <div className="mt-3 flex items-center justify-end border-t border-black/5 pt-3">
                <button
                  onClick={() => toggleLike(c.id)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm transition ${likedByMe(c.id) ? "bg-rose-100 text-rose-600" : "bg-black/5 text-[#1B3722]/70 hover:bg-black/10"}`}
                  aria-label="Like"
                >
                  <Heart className={`size-4 ${likedByMe(c.id) ? "fill-rose-500 text-rose-500" : ""}`} /> {likeCount(c.id)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0F1A12]/80 backdrop-blur-sm">
          <div className="no-print sticky top-0 flex items-center justify-end gap-2 p-4">
            <button onClick={() => window.print()} className={glassBtn}>
              Print / PDF
            </button>
            <button onClick={() => setViewing(null)} className={glassBtn}>
              <X className="size-4" /> Close
            </button>
          </div>
          <div className="mx-auto w-full max-w-3xl px-4 pb-16">
            <WorksheetDoc worksheet={viewing} />
          </div>
        </div>
      )}
    </div>
  );
}
