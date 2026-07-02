"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, Globe, Plus, Search, Star, Trash2, Users, X } from "lucide-react";
import { SproutMascotIcon } from "../_components/SproutMascotIcon";
import { WorksheetDoc } from "./_components/WorksheetDoc";
import { BackupControl } from "./_components/BackupControl";
import { DocumentNudge } from "./_components/DocumentNudge";
import { HowItWorks, type HowStep } from "./_components/HowItWorks";
import { Typewriter } from "./_components/Typewriter";
import { DescribeIcon, ShareSheetIcon, SproutStepIcon } from "./_components/StepIcons";
import { TEMPLATES, TOPICS, topicForTemplate } from "@/lib/resources/catalog";
import { printWorksheet } from "@/lib/resources/print-fit";
import { colorClasses, useResources } from "@/lib/resources/store";
import { capName, cardTint } from "@/lib/resources/util";
import { GlassButton } from "@/components/ui/glass";
import { pill } from "@/lib/resources/pill";
import type { SavedWorksheet, Worksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

// Hero: "We were born to ___" cycles the final word only.
const BORN_TO = ["create", "learn", "grow", "wonder", "explore", "imagine", "discover", "make", "build", "question"];

// The Build-your-own hero types through real example prompts, the way a parent
// would actually ask, so the card previews exactly what the builder does.
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

// The loop, in three quiet lines under the hero. A friend showing you, not a
// help desk. Few words.
const HOME_STEPS: HowStep[] = [
  { icon: DescribeIcon, title: "Pick or describe", blurb: "Start from a worksheet, or tell Sprout what you want." },
  { icon: SproutStepIcon, title: "Make it theirs", blurb: "Add their age and something they love." },
  { icon: ShareSheetIcon, title: "Print or share", blurb: "Keep it, print it, or post it for other parents." },
];

type Tab = "templates" | "mine";

function match(q: string, text: string): boolean {
  return q.trim() === "" || text.toLowerCase().includes(q.trim().toLowerCase());
}

export default function LibraryHome() {
  const { ready, kids, worksheets, account, addChild, toggleFavorite, togglePublish, removeWorksheet } = useResources();
  const [tab, setTab] = useState<Tab>("templates");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [viewing, setViewing] = useState<{ ws: Worksheet; savedId?: string } | null>(null);

  const inTopic = (templateId: string) => topic === "all" || topicForTemplate(templateId) === topic;
  const templates = TEMPLATES.filter((t) => inTopic(t.id) && match(query, `${t.title} ${t.blurb}`));
  const mine = (ready ? worksheets : []).filter((w) => inTopic(w.meta.templateId) && match(query, `${w.title} ${w.subtitle}`));

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "templates", label: "Templates", count: templates.length },
    { key: "mine", label: "My worksheets", count: mine.length },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-center sm:gap-5">
        <span className="bg-sprout-cream/95 grid size-16 shrink-0 place-items-center rounded-2xl shadow-md sm:size-24 sm:rounded-3xl">
          <SproutMascotIcon className="h-11 w-11 sm:h-16 sm:w-16" />
        </span>
        <div>
          {/* Mobile: big, one line (never wraps — a 2nd line jumped the page as the
              word cycled), and sized with a viewport clamp so the longest word fits
              INSIDE the screen (no early cutoff box; the phone edge is the only
              bound). Desktop unchanged (sm: restores text-6xl + normal wrapping). */}
          <h1 className="text-sprout-cream text-[clamp(1.8rem,8.5vw,3rem)] font-bold tracking-[-0.02em] whitespace-nowrap sm:text-6xl sm:whitespace-normal">
            We were born to <Typewriter words={BORN_TO} className="text-sprout-lime" />
          </h1>
          <p className="text-sprout-cream/70 mt-2">Pick a worksheet, tell Sprout about your kid, and print it in a minute.</p>
          <Link href="/resources/privacy" className="text-sprout-cream/55 hover:text-sprout-cream mt-1.5 inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline">
            Your data stays yours. See how.
          </Link>
        </div>
      </div>

      <HowItWorks steps={HOME_STEPS} className="hidden sm:mb-16 sm:block" />

      {ready && (
        <div className="mb-8 space-y-3 sm:mb-16 sm:space-y-6">
          <BuildYourOwnHero />
          <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-6">
            <KidsManager kids={kids} account={account} onAdd={addChild} />
            <CommunityCard />
          </div>
        </div>
      )}

      {/* One grouped control area: search, what you're looking at, and how to
          narrow it. Built for a parent seeing this cold, not a power-user strip. */}
      <div className="border-sprout-cream/15 bg-sprout-cream/[0.05] mb-8 rounded-3xl border p-4 sm:mb-16 sm:p-7">
        <div className="flex items-center gap-3 rounded-full border border-[#2E5A35]/15 bg-sprout-cream px-5 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.55)]">
          <Search className="size-5 shrink-0 text-[#1B3722]/50" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search worksheets..." className="h-12 w-full bg-transparent text-[15px] text-[#1B3722] outline-none placeholder:text-[#1B3722]/45" />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="text-[#1B3722]/50 hover:text-[#1B3722]">
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {tabs.map((t) => {
            const on = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className={pill(on, "h-10 px-4 text-sm")}>
                {t.label}
                <span className={`rounded-full px-1.5 text-xs ${on ? "bg-[#1B3722]/10 text-[#1B3722]" : "bg-sprout-cream/15"}`}>{t.count}</span>
              </button>
            );
          })}
          <Link href="/resources/community" className={pill(false, "h-10 px-4 text-sm")}>
            <Globe className="size-4" /> Community
          </Link>
        </div>

        <div className="border-sprout-cream/10 mt-5 border-t pt-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <TopicChip active={topic === "all"} onClick={() => setTopic("all")} label="All" emoji="✨" />
            {TOPICS.map((t) => (
              <TopicChip key={t.key} active={topic === t.key} onClick={() => setTopic(t.key)} label={t.label} emoji={t.emoji} />
            ))}
          </div>
        </div>
      </div>

      {tab === "templates" && (
        <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-3">
          {templates.map((t, i) => (
            <Link key={t.id} href={`/resources/${t.id}`} style={{ animationDelay: `${Math.min(i, 11) * 35}ms` }} className="group animate-in fade-in slide-in-from-bottom-3 fill-mode-both block duration-500 transition hover:-translate-y-0.5">
              <div className={`${cardTint(i)} h-full p-3 sm:p-7`}>
                <div className="flex items-start justify-between">
                  <span className={`grid size-9 place-items-center rounded-xl text-xl sm:size-11 sm:text-2xl ${t.accent}`}>{t.emoji}</span>
                </div>
                <h3 className="mt-2 text-sm leading-snug font-bold text-[#1B3722] sm:mt-3 sm:text-lg sm:leading-normal">{t.title}</h3>
                <p className="mt-1 hidden text-sm leading-relaxed text-[#1B3722]/70 sm:block">{t.blurb}</p>
                <span className="mt-3 hidden items-center gap-1 text-sm font-semibold text-[#2E5A35] sm:inline-flex">
                  Make one <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
          {templates.length === 0 && <p className="text-sprout-cream/60 text-sm">No templates match that. Try another topic or search.</p>}
        </div>
      )}

      {tab === "mine" && (
        <>
          {!ready ? (
            <p className="text-sprout-cream/60 text-sm">Loading…</p>
          ) : mine.length === 0 ? (
            <div className={`${lightCard} p-8 text-center`}>
              <p className="text-[#1B3722]/70">Nothing here yet. Make a worksheet, hit save, and it lands here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {mine.map((w, i) => (
                <SavedCard key={w.id} i={i} ws={w} onOpen={() => setViewing({ ws: w, savedId: w.id })} onFavorite={() => toggleFavorite(w.id)} onDelete={() => removeWorksheet(w.id)} />
              ))}
            </div>
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

// The headline action of the whole hub. A big, full-width hero whose mock prompt
// box types through real example prompts, previewing the builder before you open
// it. Tapping anywhere goes to the freeform builder.
function BuildYourOwnHero() {
  return (
    <Link href="/resources/custom" className="group block">
      <div className="border-sprout-lime/40 group-hover:-translate-y-1 relative overflow-hidden rounded-3xl border bg-gradient-to-br from-[#2E5A35] to-[#16331E] p-6 shadow-[0_30px_60px_-20px_rgba(15,32,20,0.9),inset_0_1px_0_rgba(255,255,255,0.12)] transition sm:p-10">
        <div aria-hidden className="bg-sprout-lime/15 pointer-events-none absolute -top-16 -right-16 size-64 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="bg-sprout-cream grid size-11 place-items-center rounded-2xl shadow-md sm:size-12">
              <SproutMascotIcon className="size-7 sm:size-8" />
            </span>
            <span className="text-sprout-lime text-xs font-bold tracking-[0.15em] uppercase sm:text-sm">Build your own</span>
          </div>

          <h2 className="text-sprout-cream mt-5 text-3xl font-bold tracking-[-0.02em] sm:mt-6 sm:text-5xl">
            Describe it. Sprout builds it.
          </h2>
          <p className="text-sprout-cream/75 mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
            Any worksheet, any topic, any age. Just type what you want, in your own words.
          </p>

          {/* Mock prompt box — looks like the builder's input, typing real prompts. */}
          <div className="border-sprout-cream/15 mt-6 flex items-center gap-3 rounded-2xl border bg-[#0F2114]/60 px-4 py-3.5 backdrop-blur-sm sm:mt-8 sm:px-5 sm:py-4">
            <span className="text-sprout-cream min-w-0 flex-1 overflow-hidden text-[15px] whitespace-nowrap sm:text-lg">
              <Typewriter words={BUILD_EXAMPLES} holdMs={1600} className="text-sprout-cream" />
            </span>
            <span className="bg-sprout-lime text-sprout-ink ml-1 hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold sm:inline-flex">
              Build <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Third member of the top row: the doorway into everything shared — the
// community's worksheets, chat, and team announcements now live in ONE place
// at /resources/community (they used to be split across two surfaces that were
// both called "Community", which sent people to the wrong one).
function CommunityCard() {
  return (
    <Link href="/resources/community" className="group block h-full">
      <div className={`${lightCard} flex h-full flex-col p-4 transition group-hover:-translate-y-0.5 sm:p-7`}>
        <h2 className="text-sm font-bold tracking-wide text-[#2E5A35] uppercase">Community</h2>
        <span className="mt-4 grid size-12 place-items-center rounded-2xl bg-[#2E5A35] text-white shadow-md">
          <Users className="size-6" />
        </span>
        <h3 className="mt-3 text-lg font-bold text-[#1B3722]">Worksheets, chat, and updates</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#1B3722]/70">
          Sheets other parents built and shared, a place to ask and swap ideas, and news from the team.
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#2E5A35]">
          Open the Community <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function TopicChip({ active, onClick, label, emoji }: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  return (
    <button onClick={onClick} className={pill(active, "h-10 px-4 text-sm")}>
      <span>{emoji}</span>
      {label}
    </button>
  );
}

function SavedCard({ ws, i, onOpen, onFavorite, onDelete }: { ws: SavedWorksheet; i: number; onOpen: () => void; onFavorite: () => void; onDelete: () => void }) {
  return (
    <div className={`${cardTint(i)} flex items-center justify-between gap-3 p-4`}>
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
        <GlassButton onClick={onFavorite} aria-label="Favorite" className="size-8">
          <Star className={`size-4 ${ws.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
        </GlassButton>
        <GlassButton onClick={onDelete} aria-label="Delete" className="size-8">
          <Trash2 className="size-4" />
        </GlassButton>
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

const tileLabel = "w-full truncate text-xs font-semibold text-[#1B3722]";
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
    <div className={`${lightCard} flex h-full flex-col p-4 sm:p-7`}>
      <h2 className="text-sm font-bold tracking-wide text-[#2E5A35] uppercase">Profiles</h2>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        {/* main account */}
        {account && (
          <Link href={`/resources/creator/${account.handle}`} className="group animate-in fade-in zoom-in-95 fill-mode-both flex w-16 flex-col items-center gap-2 text-center duration-300">
            {account.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={account.photo} alt="" className={`size-14 rounded-full object-cover ${tileRing}`} />
            ) : (
              <span className={`grid size-14 place-items-center rounded-full bg-[#2E5A35] text-xl font-bold text-white ${tileRing}`}>{capName(account.displayName).charAt(0)}</span>
            )}
            <span className={tileLabel}>{capName(account.displayName)}</span>
            <span className={tileSub}>account</span>
          </Link>
        )}
        {/* kid sub-profiles */}
        {kids.map((k, i) => {
          const cc = colorClasses(k.color);
          return (
            <Link key={k.id} href={`/resources/child/${k.id}`} style={{ animationDelay: `${(i + 1) * 60}ms` }} className="group animate-in fade-in zoom-in-95 fill-mode-both flex w-16 flex-col items-center gap-2 text-center duration-300">
              <span className={`grid size-14 place-items-center rounded-full text-xl font-bold ${cc.bg} ${tileRing}`}>{capName(k.name).charAt(0)}</span>
              <span className={tileLabel}>{capName(k.name)}</span>
              <span className={tileSub}>age {k.age}</span>
            </Link>
          );
        })}
        {/* add a child */}
        {!adding ? (
          <button onClick={() => setAdding(true)} className="group animate-in fade-in zoom-in-95 fill-mode-both flex w-16 flex-col items-center gap-2 text-center duration-300">
            <span className="grid size-14 place-items-center rounded-full border-2 border-dashed border-[#2E5A35]/30 text-[#2E5A35] transition group-hover:border-[#2E5A35]/60 group-hover:bg-[#2E5A35]/5">
              <Plus className="size-6" />
            </span>
            <span className="text-xs font-semibold text-[#2E5A35]">Add child</span>
          </button>
        ) : (
          <div className="flex w-full flex-col gap-2 rounded-2xl border border-black/10 bg-white p-3 sm:w-48">
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
      {kids.length === 0 && !adding && (
        <p className="mt-4 text-sm text-[#1B3722]/55">Add a child to make worksheets with their name and right age, all kept together in their own profile.</p>
      )}
      {/* Everything above lives in this browser only. One tap saves a copy you
          can carry to another device or restore after a cleared browser. */}
      <div className="mt-auto pt-4">
        <BackupControl />
      </div>
    </div>
  );
}
