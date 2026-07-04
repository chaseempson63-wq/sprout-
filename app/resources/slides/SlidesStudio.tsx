"use client";

// The Slides studio: type a topic, set the age (the stepper is the only
// difficulty dial, same rule as worksheets), and Sprout builds an illustrated
// teaching deck. Present it full screen, flick with arrows or keys, or print
// it one slide per landscape page. Venice builds the real thing; the engine's
// honest fallback covers the gaps (lib/resources/slides.ts).
//
// A deck is shareable like a worksheet now: Save keeps it in your library,
// Add to a kid files it on their profile, and Publish puts it in the
// Community's Slideshows tab. "Add the matching worksheet" builds a sheet on
// the same topic and links the pair, so they save and publish as one lesson.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { ArrowLeft, Check, FileText, Globe, Loader2, Minus, Play, Plus, Sparkles, Trash2 } from "lucide-react";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { WorksheetDoc } from "../_components/WorksheetDoc";
import { AddToKid } from "../_components/AddToKid";
import { SlideDeckPlayer, SlideDeckPrintCopy } from "../_components/SlideDeck";
import { forestCta, sheet } from "../_components/paper";
import { makeBundle } from "@/lib/resources/slides";
import { makerWire, publishSlideshow } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { GlassButton, GlassLink } from "@/components/ui/glass";
import { cn } from "@/lib/utils";
import { pill } from "@/lib/resources/pill";
import type { Slideshow } from "@/lib/resources/slides";
import type { Worksheet } from "@/lib/resources/types";

const STARTERS = ["the water cycle", "sea turtles", "how rainbows form", "the solar system", "ancient dinosaurs", "how plants grow"];

export function SlidesStudio() {
  const { ready, account, slideshows, saveSlideshow, markSlideshowPublished } = useResources();
  const [topic, setTopic] = useState("");
  const [age, setAge] = useState(7);
  const [deck, setDeck] = useState<Slideshow | null>(null);
  const [source, setSource] = useState<"ai" | "template" | null>(null);
  const [loading, setLoading] = useState(false);
  // the linked matching worksheet (the pair travels as one lesson)
  const [linked, setLinked] = useState<Worksheet | null>(null);
  const [linking, setLinking] = useState(false);
  const [view, setView] = useState<"slides" | "worksheet">("slides");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const genSeq = useRef(0);
  const didInit = useRef(false);

  // Reopen a saved deck: /resources/slides?saved=<id> (window.location keeps
  // this out of the prerender path; no Suspense dance needed).
  useEffect(() => {
    if (didInit.current || !ready) return;
    didInit.current = true;
    const id = new URLSearchParams(window.location.search).get("saved");
    if (!id) return;
    const s = slideshows.find((x) => x.id === id);
    if (!s) return;
    setDeck(s.slideshow);
    setLinked(s.worksheet ?? null);
    setSource("ai");
    setSavedId(s.id);
    setTopic(s.slideshow.meta.topic);
    setAge(s.slideshow.meta.age);
  }, [ready, slideshows]);

  function showToast(m: string) {
    setToast(m);
    window.setTimeout(() => setToast(null), 2600);
  }

  async function generate(t?: string) {
    const q = (t ?? topic).trim();
    if (!q) return;
    if (t) setTopic(t);
    const myseq = ++genSeq.current;
    setLoading(true);
    try {
      const res = await fetch("/api/resources/slides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: q, age }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { slideshow: Slideshow; source: "ai" | "template" };
      if (myseq !== genSeq.current) return;
      setDeck(data.slideshow);
      setSource(data.source);
      setLinked(null);
      setView("slides");
      setSavedId(null);
      setPublishedId(null);
      track("resources_slides_generate", { age, source: data.source });
    } catch {
      if (myseq === genSeq.current) {
        setDeck(null);
        setSource(null);
      }
    } finally {
      if (myseq === genSeq.current) setLoading(false);
    }
  }

  // Build the matching worksheet on the same topic and link it to the deck.
  async function addWorksheet() {
    if (!deck || linking) return;
    setLinking(true);
    try {
      const res = await fetch("/api/resources/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          templateId: "custom",
          age: deck.meta.age,
          messages: [{ role: "user", content: `Build a one-page practice worksheet about ${deck.meta.topic}, matching a lesson a parent just presented on it.` }],
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { worksheet: Worksheet };
      setLinked(data.worksheet);
      setView("worksheet");
      setSavedId(null); // the lesson changed; save again to keep the pair
      track("resources_slides_link_worksheet", {});
      showToast("Worksheet linked to this slideshow");
    } catch {
      showToast("Could not build the worksheet. Try again.");
    } finally {
      setLinking(false);
    }
  }

  function save(childId?: string) {
    if (!deck) return;
    const s = saveSlideshow(deck, linked ?? undefined, childId);
    setSavedId(s.id);
    track("resources_slides_save", {});
    showToast(childId ? "Saved to their profile" : "Saved to your slideshows");
    return s;
  }

  async function publish() {
    if (!deck) return;
    if (!account) {
      showToast("Add your name first. Tap Create profile, top right.");
      return;
    }
    const saved = savedId ? { id: savedId } : save();
    const res = await publishSlideshow(makerWire(account), makeBundle(deck, linked ?? undefined));
    if (res.id) {
      if (saved) markSlideshowPublished(saved.id);
      setPublishedId(res.id);
      track("resources_slides_publish", { linked: !!linked });
      showToast("Published to the community");
    } else if (res.disabled) showToast("Saved. The community is offline right now.");
    else showToast(res.error || "Saved. Could not publish right now.");
  }

  return (
    <div className="mx-auto max-w-5xl">
      {toast && (
        <div className="no-print text-sprout-cream border-sprout-cream/15 fixed bottom-6 left-1/2 z-[130] -translate-x-1/2 rounded-full border bg-[#0F1A12] px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <GlassLink href="/resources" className="no-print mb-6 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

      <div className="no-print mb-7 flex items-start gap-4">
        <span className="bg-sprout-cream grid size-14 shrink-0 place-items-center rounded-2xl shadow-md sm:size-16">
          <SproutMascotIcon className="size-9 sm:size-11" />
        </span>
        <div>
          <p className="text-sprout-lime text-xs font-bold tracking-[0.2em] uppercase">New</p>
          <h1 className="text-sprout-cream text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Slideshow generator</h1>
          <p className="text-sprout-cream/70 mt-1 text-sm sm:text-base">Type a topic, and Sprout builds a little lesson you can present, print, or share.</p>
        </div>
      </div>

      {/* The control sheet: topic + the age dial + Generate. */}
      <div className={cn(sheet, "no-print mb-8 p-4 sm:p-5")}>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="What should the slideshow teach? e.g. the water cycle"
            className="h-12 min-w-0 flex-1 rounded-full border border-[#2E5A35]/15 bg-white px-5 text-[15px] text-[#1B3722] outline-none placeholder:text-[#1B3722]/40 focus:border-[#2E5A35]/40"
          />
          <div className="flex items-center gap-0.5 rounded-full border border-[#2E5A35]/15 bg-white p-1">
            <button type="button" onClick={() => setAge((a) => Math.max(3, a - 1))} disabled={age <= 3} aria-label="Younger" className="grid size-9 place-items-center rounded-full text-[#2E5A35] transition hover:bg-[#2E5A35]/10 disabled:pointer-events-none disabled:opacity-35">
              <Minus className="size-4" />
            </button>
            <span className="min-w-[3.6rem] text-center text-sm font-bold text-[#1B3722]">Age {age}</span>
            <button type="button" onClick={() => setAge((a) => Math.min(13, a + 1))} disabled={age >= 13} aria-label="Older" className="grid size-9 place-items-center rounded-full text-[#2E5A35] transition hover:bg-[#2E5A35]/10 disabled:pointer-events-none disabled:opacity-35">
              <Plus className="size-4" />
            </button>
          </div>
          <button onClick={() => generate()} disabled={!topic.trim() || loading} className={cn(forestCta, "h-12")}>
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />} Generate
          </button>
        </div>
        {!deck && !loading && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STARTERS.map((s) => (
              <button key={s} onClick={() => void generate(s)} className="rounded-full border border-[#2E5A35]/20 bg-white/70 px-3 py-1.5 text-xs font-bold text-[#1B3722]/75 transition hover:bg-white">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The stage. */}
      {loading ? (
        <BuildingTrace topic={topic} age={age} />
      ) : deck ? (
        <div>
          {/* the lesson tabs, once a worksheet is linked */}
          {linked && (
            <div className="no-print mb-4 flex items-center justify-center gap-2">
              <button onClick={() => setView("slides")} className={pill(view === "slides", "h-10 px-5 text-sm")}>
                <Play className="size-4" /> Slideshow
              </button>
              <button onClick={() => setView("worksheet")} className={pill(view === "worksheet", "h-10 px-5 text-sm")}>
                <FileText className="size-4" /> Worksheet
              </button>
              <button
                onClick={() => {
                  setLinked(null);
                  setView("slides");
                  setSavedId(null);
                }}
                aria-label="Remove the linked worksheet"
                title="Remove the linked worksheet"
                className="text-sprout-cream/60 hover:text-sprout-cream grid size-9 place-items-center rounded-full transition hover:bg-white/10"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )}

          {view === "worksheet" && linked ? (
            <div>
              <WorksheetDoc worksheet={linked} />
              <div className="no-print mt-5 flex justify-center">
                <button onClick={() => window.print()} className={cn(forestCta, "h-11 text-sm")}>Print the worksheet</button>
              </div>
            </div>
          ) : (
            <>
              <SlideDeckPlayer
                deck={deck}
                onPrint={() => track("resources_slides_print", {})}
                controlsExtra={
                  <>
                    <GlassButton onClick={() => save()} disabled={!!savedId} className="h-11 px-4 text-sm">
                      <Check className="size-4" /> {savedId ? "Saved" : "Save"}
                    </GlassButton>
                    <AddToKid onAdd={(kidId) => void save(kidId)} className="h-11 px-4 text-sm" />
                    <GlassButton onClick={() => void publish()} disabled={!!publishedId} className="h-11 px-4 text-sm">
                      <Globe className="size-4" /> {publishedId ? "Published" : "Publish"}
                    </GlassButton>
                  </>
                }
              />
              {/* deck print copy lives only in the slides view so the print
                  output is exactly what's on screen (one .print-area at a time) */}
              <SlideDeckPrintCopy deck={deck} />
            </>
          )}

          {source === "template" && view === "slides" && (
            <p className="no-print text-sprout-cream/55 mt-3 text-center text-xs">Built from Sprout&apos;s curated facts while the AI builder is busy.</p>
          )}

          {/* one lesson: the matching worksheet */}
          {!linked && (
            <div className="no-print mt-8 flex flex-col items-center gap-1.5 text-center">
              <button onClick={() => void addWorksheet()} disabled={linking} className={cn(forestCta, "h-11 text-sm")}>
                {linking ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
                {linking ? "Building the worksheet..." : "Add the matching worksheet"}
              </button>
              <p className="text-sprout-cream/55 text-xs">Sprout builds a practice sheet on the same topic. They save and publish together, one lesson.</p>
            </div>
          )}
          {publishedId && (
            <p className="no-print text-sprout-cream/70 mt-6 text-center text-sm">
              Live in the community.{" "}
              <Link href={`/resources/community/${publishedId}`} className="text-sprout-cream font-bold underline-offset-2 hover:underline">
                See your post
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="no-print text-sprout-cream/60 flex h-[38vh] flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed border-sprout-cream/20 px-6 text-center text-sm">
          <Play className="size-6 opacity-60" />
          Type a topic above and Sprout builds the whole deck: title, teaching slides, real facts, and talk-about-it questions.
        </div>
      )}
    </div>
  );
}

// ── The build trace while Venice writes the deck ─────────────────────

function BuildingTrace({ topic, age }: { topic: string; age: number }) {
  const steps = [`Reading up on ${topic || "the topic"}`, "Picking what matters most", `Writing it for age ${age}`, "Choosing the pictures", "Laying out the slides"];
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (active >= steps.length - 1) return;
    const t = window.setTimeout(() => setActive((a) => Math.min(a + 1, steps.length - 1)), 2600);
    return () => window.clearTimeout(t);
  }, [active, steps.length]);
  return (
    <div className="no-print border-sprout-cream/20 bg-sprout-cream/[0.04] flex aspect-video items-center justify-center rounded-[24px] border border-dashed p-6">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="bg-sprout-cream/95 grid size-11 shrink-0 place-items-center rounded-2xl shadow">
            <SproutMascotIcon className="animate-mascot-float size-7" />
          </span>
          <div>
            <p className="text-sprout-cream font-bold">Sprout is building the deck</p>
            <p className="text-sprout-cream/50 text-xs">real facts, written for your kid</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {steps.slice(0, active + 1).map((s, n) => (
            <div key={n} className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both flex items-center gap-2.5 duration-300">
              {n === active ? (
                <Loader2 className="text-sprout-lime size-4 shrink-0 animate-spin" />
              ) : (
                <span className="bg-sprout-lime/20 text-sprout-lime grid size-4 shrink-0 place-items-center rounded-full">
                  <Check className="size-3" />
                </span>
              )}
              <span className={cn("text-sm", n === active ? "text-sprout-cream" : "text-sprout-cream/55")}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
