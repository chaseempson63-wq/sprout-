"use client";

// A story template: one pre-authored, illustrated worksheet in six difficulty
// versions (bands), served as static JSON — no generation, instant. The age
// stepper is the only difficulty control: it picks the band, exactly like the
// engine templates. See lib/resources/stories.ts.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowLeft, Check, Download, Minus, Plus } from "lucide-react";
import { WorksheetDoc } from "../../_components/WorksheetDoc";
import { AddToKid } from "../../_components/AddToKid";
import { DocumentNudge } from "../../_components/DocumentNudge";
import { printWorksheet } from "@/lib/resources/print-fit";
import { BAND_AGES, bandForAge, getStoryMeta, type StoryFile } from "@/lib/resources/stories";
import { useResources } from "@/lib/resources/store";
import { capName } from "@/lib/resources/util";
import { GlassButton, GlassLink } from "@/components/ui/glass";
import type { Worksheet } from "@/lib/resources/types";

const finishBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FFFDF6] px-6 text-base font-bold text-[#1B3722] shadow-[0_14px_30px_-12px_rgba(8,22,12,0.65),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

export default function StoryTemplate() {
  const params = useParams();
  const raw = params?.key;
  const key = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const meta = getStoryMeta(key);
  const { kids, saveWorksheet } = useResources();

  const [story, setStory] = useState<StoryFile | null>(null);
  const [failed, setFailed] = useState(false);
  const [age, setAge] = useState(7);
  const [childId, setChildId] = useState("");
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;
    let alive = true;
    fetch(`/resources/stories/${key}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((doc: StoryFile) => alive && setStory(doc))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [key]);

  const band = bandForAge(age);
  const worksheet: Worksheet | null = useMemo(() => {
    const ws = story?.bands?.[String(band)];
    if (!ws) return null;
    // The stepper age travels in meta so saves and prints carry it.
    return { ...ws, meta: { ...ws.meta, age } };
  }, [story, band, age]);

  function say(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }
  function save() {
    if (!worksheet || saved.has(band)) return;
    saveWorksheet(worksheet, "template", childId || undefined);
    setSaved((prev) => new Set(prev).add(band));
    track("resources_story_save", { story: key, band });
    say("Saved to your library");
  }
  function print() {
    if (!worksheet) return;
    track("resources_story_print", { story: key, band });
    printWorksheet();
  }

  if (!meta || failed) {
    return (
      <div className="py-20 text-center">
        <p className="text-sprout-cream/70">That story is not in the library yet.</p>
        <GlassLink href="/resources" className="mt-4 h-10 px-4">
          Back to the library
        </GlassLink>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* header row: back + title + actions */}
      <div className="no-print mb-5 flex flex-wrap items-center gap-3">
        <Link href="/resources" className="text-sprout-cream/70 hover:text-sprout-cream inline-flex items-center gap-1.5 text-sm font-semibold transition">
          <ArrowLeft className="size-4" /> Library
        </Link>
        <h1 className="text-sprout-cream min-w-0 flex-1 truncate text-xl font-bold sm:text-2xl">{meta.title}</h1>
        <div className="border-sprout-cream/20 bg-sprout-cream/10 flex shrink-0 items-center gap-1 rounded-full border p-1 backdrop-blur-sm">
          <GlassButton onClick={save} disabled={!worksheet || saved.has(band)} className="h-9 gap-1.5 px-3.5 text-sm">
            <Check className="size-4" /> {saved.has(band) ? "Saved" : "Save"}
          </GlassButton>
          <GlassButton onClick={print} disabled={!worksheet} className="h-9 gap-1.5 px-3.5 text-sm">
            <Download className="size-4" /> PDF
          </GlassButton>
        </div>
      </div>

      {/* the difficulty dial: stepper age picks the band, same as everywhere */}
      <div className="no-print mb-6 flex flex-wrap items-center gap-2">
        <div className="border-sprout-cream/20 bg-sprout-cream/10 flex items-center gap-0.5 rounded-full border p-1">
          <button
            type="button"
            onClick={() => setAge((a) => Math.max(3, a - 1))}
            disabled={age <= 3}
            aria-label="Younger"
            className="text-sprout-cream hover:bg-sprout-cream hover:text-sprout-ink grid size-8 place-items-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-35"
          >
            <Minus className="size-4" />
          </button>
          <span className="text-sprout-cream min-w-[3.6rem] text-center text-sm font-bold">Age {age}</span>
          <button
            type="button"
            onClick={() => setAge((a) => Math.min(13, a + 1))}
            disabled={age >= 13}
            aria-label="Older"
            className="text-sprout-cream hover:bg-sprout-cream hover:text-sprout-ink grid size-8 place-items-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-35"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <span className="text-sprout-cream/60 text-sm">Version {band} of 6 · changes the story and the questions, not just the length</span>
        {kids.length > 0 && <span className="text-sprout-cream/60 ml-1 text-sm">Making for:</span>}
        {kids.map((k) => (
          <GlassButton
            key={k.id}
            onClick={() => {
              setChildId(k.id);
              setAge(Math.min(13, Math.max(3, k.age)));
            }}
            className={`h-9 px-3 text-sm ${childId === k.id ? "ring-2 ring-[#2E5A35]/45" : ""}`}
          >
            {capName(k.name)} <span className="opacity-60">· {k.age}</span>
          </GlassButton>
        ))}
      </div>

      {/* the sheet */}
      {worksheet ? (
        <WorksheetDoc worksheet={worksheet} />
      ) : (
        <div className="border-sprout-cream/20 grid h-72 place-items-center rounded-[28px] border-2 border-dashed">
          <p className="text-sprout-cream/60 text-sm">Opening the story...</p>
        </div>
      )}

      {/* big finish, where your hand already is */}
      {worksheet && (
        <div className="no-print mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={save} disabled={saved.has(band)} className={finishBtn}>
            <Check className="size-5" /> {saved.has(band) ? "Saved" : "Save it"}
          </button>
          <AddToKid worksheet={worksheet} source="template" />
          <button onClick={print} className={finishBtn}>
            <Download className="size-5" /> Download PDF
          </button>
        </div>
      )}
      <DocumentNudge />

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#1B3722] px-5 py-2.5 text-sm font-bold text-[#FFFDF6] shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
