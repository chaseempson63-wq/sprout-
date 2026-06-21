"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Globe, Star, Trash2, X } from "lucide-react";
import { SproutMascotIcon } from "../_components/SproutMascotIcon";
import { WorksheetDoc } from "./_components/WorksheetDoc";
import { ageBand, TEMPLATES } from "@/lib/resources/catalog";
import { COMMUNITY_SAMPLES } from "@/lib/resources/samples";
import { useResources } from "@/lib/resources/store";
import type { SavedWorksheet, Worksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#F7F2E7] border border-black/5 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.45)]";
const glassBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-sprout-cream/10 border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors";

type Tab = "templates" | "mine" | "community";

export default function LibraryHome() {
  const { ready, worksheets, toggleFavorite, togglePublish, removeWorksheet } = useResources();
  const [tab, setTab] = useState<Tab>("templates");
  const [viewing, setViewing] = useState<{ ws: Worksheet; savedId?: string } | null>(null);

  const published = ready ? worksheets.filter((w) => w.published) : [];
  const community: Worksheet[] = [...COMMUNITY_SAMPLES, ...published];

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "templates", label: "Templates", count: TEMPLATES.length },
    { key: "mine", label: "My worksheets", count: ready ? worksheets.length : undefined },
    { key: "community", label: "Community", count: community.length },
  ];

  return (
    <div>
      {/* hero */}
      <div className="mb-8 flex items-center gap-4">
        <span className="bg-sprout-cream/95 grid size-16 shrink-0 place-items-center rounded-2xl shadow-md">
          <SproutMascotIcon className="h-11 w-11" />
        </span>
        <div>
          <h1 className="text-sprout-cream text-3xl font-bold tracking-[-0.02em]">What should we make today?</h1>
          <p className="text-sprout-cream/70 mt-1">Pick a worksheet, tell Sprout about your kid, and print it in a minute.</p>
        </div>
      </div>

      {/* tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-[#F4EDE0] text-[#1B3722]"
                : "text-sprout-cream/80 hover:text-sprout-cream bg-sprout-cream/10"
            }`}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className={`rounded-full px-1.5 text-xs ${tab === t.key ? "bg-[#1B3722]/10" : "bg-sprout-cream/15"}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "templates" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Link key={t.id} href={`/resources/${t.id}`} className="group block transition hover:-translate-y-0.5">
              <div className={`${lightCard} h-full p-5`}>
                <div className="flex items-start justify-between">
                  <span className={`grid size-11 place-items-center rounded-xl text-2xl ${t.accent}`}>{t.emoji}</span>
                  <span className="rounded-full bg-[#2E5A35]/10 px-2 py-0.5 text-[11px] font-semibold text-[#2E5A35]">{ageBand(t)}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-[#1B3722]">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#1B3722]/70">{t.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2E5A35]">
                  Make one <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === "mine" && (
        <>
          {!ready ? (
            <p className="text-sprout-cream/60 text-sm">Loading…</p>
          ) : worksheets.length === 0 ? (
            <div className={`${lightCard} p-8 text-center`}>
              <p className="text-[#1B3722]/70">Nothing saved yet. Make a worksheet and hit save, and it lands here.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {worksheets.map((w) => (
                <SavedCard
                  key={w.id}
                  ws={w}
                  onOpen={() => setViewing({ ws: w, savedId: w.id })}
                  onFavorite={() => toggleFavorite(w.id)}
                  onDelete={() => removeWorksheet(w.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "community" && (
        <div>
          <p className="text-sprout-cream/65 mb-4 flex items-center gap-2 text-sm">
            <Globe className="size-4" /> Worksheets made by the Sprout community. Publish your own from a saved worksheet.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {community.map((w, i) => (
              <button key={i} onClick={() => setViewing({ ws: w })} className={`${lightCard} block p-5 text-left transition hover:-translate-y-0.5`}>
                <h3 className="text-lg font-bold text-[#1B3722]">{w.title}</h3>
                <p className="mt-1 text-sm text-[#1B3722]/65">{w.subtitle}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2E5A35]">
                  Preview <ArrowRight className="size-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {viewing && (
        <Viewer
          entry={viewing}
          onClose={() => setViewing(null)}
          onPublish={viewing.savedId ? () => togglePublish(viewing.savedId!) : undefined}
          published={viewing.savedId ? worksheets.find((w) => w.id === viewing.savedId)?.published : undefined}
        />
      )}
    </div>
  );
}

function SavedCard({
  ws,
  onOpen,
  onFavorite,
  onDelete,
}: {
  ws: SavedWorksheet;
  onOpen: () => void;
  onFavorite: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`${lightCard} flex items-center justify-between gap-3 p-4`}>
      <button onClick={onOpen} className="min-w-0 flex-1 text-left">
        <span className="flex items-center gap-2">
          {ws.favorite && <Star className="size-3.5 fill-amber-400 text-amber-400" />}
          <span className="truncate font-bold text-[#1B3722]">{ws.title}</span>
        </span>
        <span className="mt-0.5 block text-xs text-[#1B3722]/60">
          {ws.subtitle}
          {ws.published ? " · published" : ""}
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-1">
        <button onClick={onFavorite} aria-label="Favorite" className="rounded-md p-1.5 text-[#1B3722]/60 hover:bg-black/5">
          <Star className={`size-4 ${ws.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
        </button>
        <button onClick={onDelete} aria-label="Delete" className="rounded-md p-1.5 text-[#1B3722]/60 hover:bg-black/5">
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Viewer({
  entry,
  onClose,
  onPublish,
  published,
}: {
  entry: { ws: Worksheet; savedId?: string };
  onClose: () => void;
  onPublish?: () => void;
  published?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0F1A12]/80 backdrop-blur-sm">
      <div className="no-print sticky top-0 flex items-center justify-end gap-2 p-4">
        <button onClick={() => window.print()} className={glassBtn}>
          Print / PDF
        </button>
        {onPublish && (
          <button onClick={onPublish} className={glassBtn}>
            <Globe className="size-4" /> {published ? "Unpublish" : "Publish"}
          </button>
        )}
        <button onClick={onClose} aria-label="Close" className={glassBtn}>
          <X className="size-4" /> Close
        </button>
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 pb-16">
        <WorksheetDoc worksheet={entry.ws} />
      </div>
    </div>
  );
}
