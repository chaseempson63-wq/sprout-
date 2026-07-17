"use client";

// A story template: one pre-authored, illustrated worksheet in six difficulty
// versions (bands), served as static JSON — no generation, instant. Harder and
// easier step through the bands; a kid's profile sets the starting band. See
// lib/resources/stories.ts.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowLeft, Check, Download } from "lucide-react";
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

const tuneBtn =
  "inline-flex h-10 items-center gap-1.5 rounded-full bg-[#FFFDF6] px-5 text-sm font-bold text-[#1B3722] shadow-[0_10px_24px_-10px_rgba(8,22,12,0.6),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-45";

export default function StoryTemplate() {
  const params = useParams();
  const raw = params?.key;
  const key = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const meta = getStoryMeta(key);
  const { kids, saveWorksheet } = useResources();

  const [story, setStory] = useState<StoryFile | null>(null);
  const [failed, setFailed] = useState(false);
  // The kid's age (or the 7-year-old default) picks the STARTING band; the
  // harder/easier buttons step through the six bands from there.
  const [age, setAge] = useState(7);
  const [bump, setBump] = useState(0);
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

  const band = Math.min(6, Math.max(1, bandForAge(age) + bump));
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

      {/* who is this for: the kid chip sets the starting band */}
      {kids.length > 0 && (
        <div className="no-print mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sprout-cream/60 text-sm">Making for:</span>
          {kids.map((k) => (
            <GlassButton
              key={k.id}
              onClick={() => {
                setChildId(k.id);
                setAge(Math.min(13, Math.max(3, k.age)));
                setBump(0);
              }}
              className={`h-9 px-3 text-sm ${childId === k.id ? "ring-2 ring-[#2E5A35]/45" : ""}`}
            >
              {capName(k.name)} <span className="opacity-60">· {k.age}</span>
            </GlassButton>
          ))}
        </div>
      )}

      {/* the tune buttons: harder/easier step through the six pre-built bands,
          changing the story and the questions, not just the length */}
      <div className="no-print mb-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setBump((v) => v + 1)}
          disabled={band >= 6}
          className={tuneBtn}
        >
          Harder
        </button>
        <button
          type="button"
          onClick={() => setBump((v) => v - 1)}
          disabled={band <= 1}
          className={tuneBtn}
        >
          Easier
        </button>
      </div>
      <p className="no-print mb-4 text-center text-sm text-sprout-cream/60">
        Harder and easier change the story and the questions, not just the length.
      </p>

      {/* the sheet — zoomed out on desktop so it reads like paper on the desk */}
      {worksheet ? (
        <div className="lg:mx-auto lg:max-w-[880px] lg:[zoom:0.72]">
          <WorksheetDoc worksheet={worksheet} />
        </div>
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
