"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { WorksheetDoc } from "../../_components/WorksheetDoc";
import { COMMUNITY_SAMPLES } from "@/lib/resources/samples";
import { useResources } from "@/lib/resources/store";
import { cardTint } from "@/lib/resources/util";
import { GlassButton, GlassLink } from "@/components/ui/glass";
import type { Worksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

type Creation = { id: string; worksheet: Worksheet; creatorName: string; createdAt: number };

export default function CreatorProfile() {
  const params = useParams();
  const raw = params?.handle;
  const handle = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const { ready, account, worksheets } = useResources();
  const [viewing, setViewing] = useState<Worksheet | null>(null);

  if (!ready) return <div className="text-sprout-cream/60 py-20 text-center text-sm">Loading…</div>;

  const isMe = account?.handle === handle;
  const sampleMatch = COMMUNITY_SAMPLES.find((s) => s.creatorHandle === handle);
  const displayName = isMe ? (account?.displayName ?? handle) : (sampleMatch?.creatorName ?? handle);
  const photo = isMe ? account?.photo : undefined;

  const creations: Creation[] = [
    ...worksheets
      .filter((w) => w.published && w.meta.templateId === "custom" && (isMe || w.creatorHandle === handle))
      .map((w) => ({ id: w.id, worksheet: w as Worksheet, creatorName: w.creatorName || displayName, createdAt: w.createdAt })),
    ...COMMUNITY_SAMPLES.filter((s) => s.creatorHandle === handle).map((s) => ({ id: s.id, worksheet: s.worksheet, creatorName: s.creatorName, createdAt: 0 })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div>
      <GlassLink href="/resources" className="no-print mb-5 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

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
        <p className="mt-4 text-sm font-medium text-[#2E5A35]">{creations.length} published {creations.length === 1 ? "worksheet" : "worksheets"}</p>
        {isMe && creations.length === 0 && (
          <p className="mt-2 text-sm text-[#1B3722]/60">You have not published anything yet. Build a worksheet from scratch, then hit Publish to share it here.</p>
        )}
      </div>

      <h2 className="text-sprout-cream mb-3 text-xl font-bold">Creations</h2>
      {creations.length === 0 ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">No public creations yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {creations.map((c, i) => (
            <button key={c.id} onClick={() => setViewing(c.worksheet)} className={`${cardTint(i)} block p-5 text-left transition hover:-translate-y-0.5`}>
              <h3 className="truncate font-bold text-[#1B3722]">{c.worksheet.title}</h3>
              <p className="mt-0.5 text-xs text-[#1B3722]/60">{c.worksheet.subtitle}</p>
            </button>
          ))}
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0F1A12]/80 backdrop-blur-sm">
          <div className="no-print sticky top-0 flex items-center justify-end gap-2 p-4">
            <GlassButton onClick={() => window.print()} className="h-10 px-4 text-sm">
              Print / PDF
            </GlassButton>
            <GlassButton onClick={() => setViewing(null)} className="h-10 px-4 text-sm">
              <X className="size-4" /> Close
            </GlassButton>
          </div>
          <div className="mx-auto w-full max-w-3xl px-4 pb-16">
            <WorksheetDoc worksheet={viewing} />
          </div>
        </div>
      )}
    </div>
  );
}
