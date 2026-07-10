"use client";

// The Resources library, on the "paper on the green desk" system (see
// _components/paper.tsx). Structure, top to bottom:
//   1. Hero — mascot + the born-to line.
//   2. The PROMPT BAR — the hero DOES the thing: type what you want, press
//      Build, land in the freeform builder with your words already sent.
//   3. The creation row — Slideshows (new), Community, Profiles.
//   4. The paper control sheet — search, Templates/Mine, topic tags.
//   5. The template wall — every template wears a real illustration sticker,
//      hand-placed with a slight tilt, like a wall of picture books.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, Globe, Play, Plus, Search, Send, Star, Trash2, X } from "lucide-react";
import { SproutMascotIcon } from "../_components/SproutMascotIcon";
import { WorksheetDoc } from "./_components/WorksheetDoc";
import { BackupControl } from "./_components/BackupControl";
import { DocumentNudge } from "./_components/DocumentNudge";
import { Typewriter } from "./_components/Typewriter";
import { AgeTag, SheetStack, Sticker, forestCta, sheet, tiltFor } from "./_components/paper";
import { TEMPLATES, TOPICS, topicForTemplate } from "@/lib/resources/catalog";
import { artFor } from "@/lib/resources/template-art";
import { printWorksheet } from "@/lib/resources/print-fit";
import { colorClasses, useResources } from "@/lib/resources/store";
import { capName, firstImageKey } from "@/lib/resources/util";
import { GlassButton } from "@/components/ui/glass";
import { cn } from "@/lib/utils";
import { RESOURCES_DEMO } from "@/lib/resources/demo";
import { ComingSoonModal, type TeaseFeature } from "./_components/ComingSoon";
import type { SavedWorksheet, Worksheet } from "@/lib/resources/types";

// Hero: "We were born to ___" cycles the final word only.
const BORN_TO = ["create", "learn", "grow", "wonder", "explore", "imagine", "discover", "make", "build", "question"];

// The prompt bar types through real asks while empty, previewing exactly what
// the builder does before you touch it.
const BUILD_EXAMPLES = [
  "a science sheet on how grass grows",
  "addition with dinosaurs, 12 problems",
  "a reading passage about the moon, age 7",
  "spelling practice for the -ight word family",
  "telling time, o'clock and half past",
  "fractions of a shape for a 9 year old",
  "handwriting practice for b and d",
  "a money worksheet, making change up to $5",
  "label the butterfly life cycle",
  "a story starter about a dragon, with lines to write on",
];

const STARTER_CHIPS = ["addition with dinosaurs", "the water cycle, age 9", "sight words for a 6 year old"];

type Tab = "templates" | "mine";

function match(q: string, text: string): boolean {
  return q.trim() === "" || text.toLowerCase().includes(q.trim().toLowerCase());
}

export default function LibraryHome() {
  const { ready, kids, worksheets, slideshows, account, addChild, toggleFavorite, togglePublish, removeWorksheet, removeSlideshow } = useResources();
  const [tab, setTab] = useState<Tab>("templates");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [viewing, setViewing] = useState<{ ws: Worksheet; savedId?: string } | null>(null);
  // Demo stage: which coming-soon feature preview is open (null = none).
  const [tease, setTease] = useState<TeaseFeature | null>(null);

  const inTopic = (templateId: string) => topic === "all" || topicForTemplate(templateId) === topic;
  const templates = TEMPLATES.filter((t) => inTopic(t.id) && match(query, `${t.title} ${t.blurb}`));
  const mine = (ready ? worksheets : []).filter((w) => inTopic(w.meta.templateId) && match(query, `${w.title} ${w.subtitle}`));

  return (
    <div>
      {/* 1 · hero */}
      <div className="mb-10 flex flex-col gap-5 sm:mb-16 sm:flex-row sm:items-center sm:gap-7">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#FFFDF6] shadow-[0_20px_48px_-14px_rgba(8,22,12,0.7),0_0_36px_-6px_rgba(180,230,120,0.45)] ring-2 ring-sprout-lime/55 sm:size-24 sm:rounded-3xl">
          <SproutMascotIcon className="h-11 w-11 sm:h-16 sm:w-16" />
        </span>
        <div>
          {/* 6.6vw fits the longest cycled word ("discover" + cursor) at 375px
              with no clipping — the nowrap line must never outgrow the screen. */}
          <h1 className="text-sprout-cream text-[clamp(1.5rem,6.6vw,3rem)] font-bold tracking-[-0.02em] whitespace-nowrap sm:text-6xl sm:whitespace-normal">
            We were born to <Typewriter words={BORN_TO} className="text-sprout-lime" />
          </h1>
          <p className="text-sprout-cream/70 mt-5 text-base sm:mt-6 sm:text-lg">
            {RESOURCES_DEMO
              ? "30 worksheet templates, tailored to your kid's age, free to print. Build-your-own and slideshows are coming soon."
              : "Worksheets and slideshows, made to order for your kid. Free to print, always."}
          </p>
          <Link
            href={RESOURCES_DEMO ? "/privacy" : "/resources/privacy"}
            className="text-sprout-cream/55 hover:text-sprout-cream mt-3 inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
          >
            Your data stays yours. See how.
          </Link>
        </div>
      </div>

      {/* 2 · the prompt bar — the hero action (teases the builder in demo) */}
      {ready && <PromptBar onTease={() => setTease("build")} />}

      {/* 3 · creation row */}
      {ready && (
        <div className="mt-12 mb-14 grid grid-cols-1 items-stretch gap-5 sm:mt-16 sm:mb-20 md:grid-cols-3">
          <SlideshowCard onTease={() => setTease("slides")} />
          <CommunityCard onTease={() => setTease("community")} />
          <KidsManager kids={kids} account={account} onAdd={addChild} />
        </div>
      )}

      {/* demo stage: the coming-soon preview pop-up */}
      {tease && <ComingSoonModal feature={tease} onClose={() => setTease(null)} />}

      {/* 4 · the paper control sheet */}
      <div className={cn(sheet, "mb-12 p-4 sm:p-6")}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[#2E5A35]/15 bg-white px-5">
            <Search className="size-5 shrink-0 text-[#1B3722]/45" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search worksheets..." className="h-12 w-full bg-transparent text-[15px] text-[#1B3722] outline-none placeholder:text-[#1B3722]/40" />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="text-[#1B3722]/45 hover:text-[#1B3722]">
                <X className="size-4" />
              </button>
            )}
          </div>
          {/* Templates / Mine segmented switch */}
          <div className="flex items-center gap-1 rounded-full border border-[#2E5A35]/15 bg-white p-1">
            {(
              [
                { key: "templates" as Tab, label: "Templates", count: templates.length },
                { key: "mine" as Tab, label: "My worksheets", count: mine.length },
              ]
            ).map((t) => {
              const on = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition",
                    on ? "bg-[#2E5A35] text-white shadow-sm" : "text-[#1B3722]/60 hover:bg-[#2E5A35]/8",
                  )}
                >
                  {t.label}
                  <span className={cn("rounded-full px-1.5 text-xs", on ? "bg-white/20" : "bg-[#2E5A35]/10 text-[#2E5A35]")}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* topic tags: little paper labels */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#2E5A35]/10 pt-4">
          <TopicTag active={topic === "all"} onClick={() => setTopic("all")} label="All" emoji="✨" />
          {TOPICS.map((t) => (
            <TopicTag key={t.key} active={topic === t.key} onClick={() => setTopic(t.key)} label={t.label} emoji={t.emoji} />
          ))}
        </div>
      </div>

      {/* 5 · the wall */}
      {tab === "templates" && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((t, i) => {
            const art = artFor(t.id);
            return (
              <Link key={t.id} href={`/resources/${t.id}`} style={{ animationDelay: `${Math.min(i, 11) * 35}ms` }} className="group animate-in fade-in slide-in-from-bottom-3 fill-mode-both block duration-500">
                <SheetStack tilt={tiltFor(i)} className="flex h-full flex-col overflow-hidden">
                  {/* full-width illustration, straight, sitting at the top of the card.
                      4:3 band matches the illustration files so nothing crops or floats. */}
                  <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden border-b border-[#2E5A35]/10 bg-white">
                    {art ? (
                      // eslint-disable-next-line @next/next/no-img-element -- static webp
                      <img src={`/resources/illustrations/${art}.webp`} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-5xl">{t.emoji}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-[15px] leading-snug font-bold text-[#1B3722] sm:text-lg">{t.title}</h3>
                    <p className="mt-1 hidden text-sm leading-relaxed text-[#1B3722]/65 sm:block">{t.blurb}</p>
                    <div className="mt-auto flex items-center justify-between pt-3.5">
                      <AgeTag min={t.ageMin} max={t.ageMax} />
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-[#2E5A35]">
                        Make one <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </SheetStack>
              </Link>
            );
          })}
          {templates.length === 0 && <p className="text-sprout-cream/60 col-span-full text-sm">No templates match that. Try another topic or search.</p>}
        </div>
      )}

      {tab === "mine" && (
        <>
          {!ready ? (
            <p className="text-sprout-cream/60 text-sm">Loading…</p>
          ) : mine.length === 0 && slideshows.length === 0 ? (
            <div className={cn(sheet, "p-8 text-center")}>
              <p className="text-[#1B3722]/70">Nothing here yet. Make a worksheet or a slideshow, hit save, and it lands here.</p>
            </div>
          ) : (
            <>
              {/* saved slideshows, one row above the sheets */}
              {slideshows.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-sprout-cream mb-4 text-lg font-bold">My slideshows</h2>
                  <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    {slideshows.map((s) => (
                      <div key={s.id} className={cn(sheet, "flex items-center justify-between gap-3 p-4")}>
                        <Link href={`/resources/slides?saved=${s.id}`} className="min-w-0 flex-1">
                          <span className="block truncate font-bold text-[#1B3722]">{s.slideshow.title}</span>
                          <span className="mt-0.5 block text-xs text-[#1B3722]/60">
                            {s.slideshow.slides.length} slides
                            {s.worksheet ? " · with worksheet" : ""}
                            {s.published ? " · published" : ""}
                          </span>
                        </Link>
                        <GlassButton onClick={() => removeSlideshow(s.id)} aria-label="Delete" className="size-8 shrink-0">
                          <Trash2 className="size-4" />
                        </GlassButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {mine.length > 0 && (
                <>
                  {slideshows.length > 0 && <h2 className="text-sprout-cream mb-4 text-lg font-bold">My worksheets</h2>}
                  <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                    {mine.map((w, i) => (
                      <SavedCard key={w.id} i={i} ws={w} onOpen={() => setViewing({ ws: w, savedId: w.id })} onFavorite={() => toggleFavorite(w.id)} onDelete={() => removeWorksheet(w.id)} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {viewing && (
        <Viewer
          entry={viewing}
          onClose={() => setViewing(null)}
          onPublish={viewing.savedId && worksheets.find((w) => w.id === viewing.savedId)?.meta.templateId === "custom" ? () => togglePublish(viewing.savedId!) : undefined}
          published={viewing.savedId ? worksheets.find((w) => w.id === viewing.savedId)?.published : undefined}
        />
      )}
    </div>
  );
}

// ── 2 · The prompt bar ────────────────────────────────────────────────

function PromptBar({ onTease }: { onTease: () => void }) {
  const router = useRouter();
  const [text, setText] = useState("");

  function go(t?: string) {
    // Demo stage: the builder is a tease — every path in opens the preview.
    if (RESOURCES_DEMO) {
      onTease();
      return;
    }
    const q = (t ?? text).trim();
    router.push(q ? `/resources/custom?prompt=${encodeURIComponent(q)}` : "/resources/custom");
  }

  return (
    <div>
      <SheetStack flat className="relative p-2.5 ring-2 ring-[#4E8A57] shadow-[0_0_0_4px_rgba(78,138,87,0.14),0_0_26px_-4px_rgba(78,138,87,0.45),0_18px_40px_-16px_rgba(8,22,12,0.5)] sm:p-3">
        {RESOURCES_DEMO && (
          <span className="bg-sprout-lime absolute -top-2.5 right-4 z-10 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-[0.16em] text-[#1B3722] uppercase shadow">
            Coming soon
          </span>
        )}
        <div className={cn("flex items-center gap-2 sm:gap-3", RESOURCES_DEMO && "opacity-90")}>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#2E5A35]/8 sm:size-12 sm:rounded-2xl">
            <SproutMascotIcon className="size-7 sm:size-8" />
          </span>
          <div className="relative min-w-0 flex-1">
            <input
              value={text}
              readOnly={RESOURCES_DEMO}
              onFocus={RESOURCES_DEMO ? () => go() : undefined}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              aria-label={RESOURCES_DEMO ? "Build your own is coming soon. See the preview." : "Describe the worksheet you want"}
              className={cn("h-12 w-full bg-transparent text-[15px] text-[#1B3722] outline-none sm:text-lg", RESOURCES_DEMO && "cursor-pointer")}
            />
            {/* the living placeholder */}
            {!text && (
              <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden text-[15px] whitespace-nowrap text-[#1B3722]/45 sm:text-lg">
                <Typewriter words={BUILD_EXAMPLES} holdMs={1600} />
              </span>
            )}
          </div>
          <button onClick={() => go()} className={cn(forestCta, "h-11 shrink-0 px-4 text-sm sm:h-12 sm:px-6 sm:text-base")}>
            <span className="hidden sm:inline">{RESOURCES_DEMO ? "Sneak peek" : "Build it"}</span>
            <Send className="size-4 sm:hidden" />
            <ArrowRight className="hidden size-4 sm:block" />
          </button>
        </div>
      </SheetStack>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 px-1">
        <span className="text-sprout-cream/50 mr-1 text-xs">{RESOURCES_DEMO ? "Soon you can build:" : "Try:"}</span>
        {STARTER_CHIPS.map((s) => (
          <button key={s} onClick={() => go(s)} className="border-sprout-cream/20 bg-sprout-cream/10 text-sprout-cream/85 hover:bg-sprout-cream/20 rounded-full border px-3 py-1.5 text-xs font-bold transition">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 3 · creation row cards ────────────────────────────────────────────

function SlideshowCard({ onTease }: { onTease: () => void }) {
  const inner = (
    <SheetStack flat className="relative h-full overflow-hidden !bg-gradient-to-br !from-[#2E5A35] !to-[#16331E] text-[#FFFDF6]">
      {RESOURCES_DEMO && (
        <span className="bg-sprout-lime absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-[0.16em] text-[#1B3722] uppercase shadow">
          Coming soon
        </span>
      )}
      <div className={cn("flex h-full flex-col p-5 sm:p-6", RESOURCES_DEMO && "opacity-85")}>
        <span className="text-sprout-lime inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase">
          <Play className="size-3.5" /> {RESOURCES_DEMO ? "On the way" : "New"}
        </span>
        <h3 className="mt-3 text-xl font-bold tracking-[-0.01em]">Slideshow generator</h3>
        <p className="text-sprout-cream/70 mt-1 text-sm leading-relaxed">Type a topic, present a little illustrated lesson. Full screen or printed.</p>
        <span className="text-sprout-lime mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold">
          {RESOURCES_DEMO ? "Sneak peek" : "Make one"} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </SheetStack>
  );
  if (RESOURCES_DEMO) {
    return (
      <button onClick={onTease} className="group block h-full w-full text-left">
        {inner}
      </button>
    );
  }
  return (
    <Link href="/resources/slides" className="group block h-full">
      {inner}
    </Link>
  );
}

function CommunityCard({ onTease }: { onTease: () => void }) {
  const inner = (
    <SheetStack flat className="relative h-full">
      {RESOURCES_DEMO && (
        <span className="bg-sprout-lime absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-[0.16em] text-[#1B3722] uppercase shadow">
          Coming soon
        </span>
      )}
      <div className={cn("flex h-full flex-col p-5 sm:p-6", RESOURCES_DEMO && "opacity-85")}>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] text-[#2E5A35] uppercase">
          <Globe className="size-3.5" /> Community
        </span>
        <h3 className="mt-3 text-xl font-bold tracking-[-0.01em] text-[#1B3722]">Worksheets, chat, updates</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#1B3722]/65">Sheets other parents built and shared, a place to swap ideas, and news from the team.</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-[#2E5A35]">
          {RESOURCES_DEMO ? "Sneak peek" : "Open it"} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </SheetStack>
  );
  if (RESOURCES_DEMO) {
    return (
      <button onClick={onTease} className="group block h-full w-full text-left">
        {inner}
      </button>
    );
  }
  return (
    <Link href="/resources/community" className="group block h-full">
      {inner}
    </Link>
  );
}

// ── 5 · saved cards ───────────────────────────────────────────────────

function SavedCard({ ws, i, onOpen, onFavorite, onDelete }: { ws: SavedWorksheet; i: number; onOpen: () => void; onFavorite: () => void; onDelete: () => void }) {
  const img = firstImageKey(ws) ?? artFor(ws.meta.templateId);
  return (
    <SheetStack tilt={tiltFor(i)} className="flex h-full items-center gap-3.5 p-4">
      {img && <Sticker imageKey={img} size={56} angle={i % 2 ? 3 : -3} className="shrink-0" />}
      <button onClick={onOpen} className="min-w-0 flex-1 text-left">
        <span className="flex items-center gap-2">
          {ws.favorite && <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />}
          <span className="truncate font-bold text-[#1B3722]">{ws.title}</span>
        </span>
        <span className="mt-0.5 block text-xs text-[#1B3722]/55">
          {ws.subtitle}
          {ws.published ? " · published" : ""}
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-1">
        <button onClick={onFavorite} aria-label="Favorite" className="grid size-9 place-items-center rounded-full text-[#1B3722]/55 transition hover:bg-[#2E5A35]/8">
          <Star className={cn("size-4", ws.favorite && "fill-amber-400 text-amber-400")} />
        </button>
        <button onClick={onDelete} aria-label="Delete" className="grid size-9 place-items-center rounded-full text-[#1B3722]/55 transition hover:bg-[#2E5A35]/8">
          <Trash2 className="size-4" />
        </button>
      </div>
    </SheetStack>
  );
}

function TopicTag({ active, onClick, label, emoji }: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition active:scale-95",
        active ? "bg-[#2E5A35] text-white shadow-[0_8px_18px_-6px_rgba(46,90,53,0.6)]" : "border border-[#2E5A35]/15 bg-white/70 text-[#1B3722]/70 hover:bg-white",
      )}
    >
      <span>{emoji}</span>
      {label}
    </button>
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
        <GlassButton onClick={() => printWorksheet()} className="h-10 px-4 text-sm">
          Print / PDF
        </GlassButton>
        {onPublish && (
          <GlassButton onClick={onPublish} className="h-10 px-4 text-sm">
            <Globe className="size-4" /> {published ? "Unpublish" : "Publish to community"}
          </GlassButton>
        )}
        <GlassButton onClick={onClose} aria-label="Close" className="h-10 px-4 text-sm">
          <X className="size-4" /> Close
        </GlassButton>
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 pb-16">
        <WorksheetDoc worksheet={entry.ws} />
        <DocumentNudge />
      </div>
    </div>
  );
}

// ── Profiles (kids + account + backup) ────────────────────────────────

const tileLabel = "w-full truncate text-xs font-bold text-[#1B3722]";
const tileSub = "-mt-0.5 text-[10px] text-[#1B3722]/50";
const tileRing = "ring-2 ring-transparent transition group-hover:ring-[#2E5A35]/45";

function KidsManager({
  kids,
  account,
  onAdd,
}: {
  kids: { id: string; name: string; age: number; color: string }[];
  account: { handle: string; displayName: string; photo?: string } | null;
  onAdd: (d: { name: string; age: number; interests: string[]; color: string }) => { id: string };
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [aName, setAName] = useState("");
  const [aAge, setAAge] = useState("7");

  function add() {
    const nm = aName.trim();
    if (!nm) return;
    const k = onAdd({ name: nm, age: Math.min(13, Math.max(3, parseInt(aAge, 10) || 7)), interests: [], color: "lime" });
    setAName("");
    setAdding(false);
    router.push(`/resources/child/${k.id}`);
  }

  return (
    <SheetStack flat className="flex h-full flex-col p-5 sm:p-6">
      <span className="text-[11px] font-bold tracking-[0.18em] text-[#2E5A35] uppercase">Profiles</span>
      <div className="mt-3.5 flex flex-wrap items-start gap-3.5">
        {account && (
          <Link href={`/resources/creator/${account.handle}`} className="group flex w-14 flex-col items-center gap-1.5 text-center">
            {account.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={account.photo} alt="" className={cn("size-12 rounded-full object-cover", tileRing)} />
            ) : (
              <span className={cn("grid size-12 place-items-center rounded-full bg-[#2E5A35] text-lg font-bold text-white", tileRing)}>{capName(account.displayName).charAt(0)}</span>
            )}
            <span className={tileLabel}>{capName(account.displayName)}</span>
            <span className={tileSub}>account</span>
          </Link>
        )}
        {kids.map((k) => {
          const cc = colorClasses(k.color);
          return (
            <Link key={k.id} href={`/resources/child/${k.id}`} className="group flex w-14 flex-col items-center gap-1.5 text-center">
              <span className={cn("grid size-12 place-items-center rounded-full text-lg font-bold", cc.bg, tileRing)}>{capName(k.name).charAt(0)}</span>
              <span className={tileLabel}>{capName(k.name)}</span>
              <span className={tileSub}>age {k.age}</span>
            </Link>
          );
        })}
        {!adding ? (
          <button onClick={() => setAdding(true)} className="group flex w-14 flex-col items-center gap-1.5 text-center">
            <span className="grid size-12 place-items-center rounded-full border-2 border-dashed border-[#2E5A35]/30 text-[#2E5A35] transition group-hover:border-[#2E5A35]/60 group-hover:bg-[#2E5A35]/5">
              <Plus className="size-5" />
            </span>
            <span className="text-xs font-bold text-[#2E5A35]">Add</span>
          </button>
        ) : (
          <div className="flex w-full flex-col gap-2 rounded-2xl border border-[#2E5A35]/12 bg-white p-3">
            <input value={aName} onChange={(e) => setAName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Name" autoFocus className="h-9 rounded-lg border border-black/10 bg-white px-2 text-sm text-[#1B3722] outline-none focus:border-[#2E5A35]" />
            <div className="flex items-center gap-2">
              <input type="number" min={3} max={13} value={aAge} onChange={(e) => setAAge(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} className="h-9 w-16 rounded-lg border border-black/10 bg-white px-2 text-sm text-[#1B3722] outline-none focus:border-[#2E5A35]" aria-label="Age" />
              <button onClick={add} className="ml-auto inline-flex h-9 items-center gap-1 rounded-full bg-[#2E5A35] px-3 text-xs font-bold text-white">
                <Check className="size-3.5" /> Add
              </button>
              <button onClick={() => setAdding(false)} aria-label="Cancel" className="rounded-md p-1.5 text-[#1B3722]/50 hover:bg-black/5">
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {kids.length === 0 && !adding && <p className="mt-3 text-xs leading-relaxed text-[#1B3722]/55">Add a child to make worksheets with their name and right age.</p>}
      <div className="mt-auto pt-4">
        <BackupControl />
      </div>
    </SheetStack>
  );
}
