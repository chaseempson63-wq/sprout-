"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Globe, Heart, Plus, Search, Star, Trash2, X } from "lucide-react";
import { SproutMascotIcon } from "../_components/SproutMascotIcon";
import { WorksheetDoc } from "./_components/WorksheetDoc";
import { Typewriter } from "./_components/Typewriter";
import { TEMPLATES, TOPICS, topicForTemplate } from "@/lib/resources/catalog";
import { COMMUNITY_SAMPLES } from "@/lib/resources/samples";
import { colorClasses, useResources } from "@/lib/resources/store";
import { capName } from "@/lib/resources/util";
import { GlassButton, GlassPanel } from "@/components/ui/glass";
import type { SavedWorksheet, Worksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

// Hero: "We were born to ___" cycles the final word only.
const BORN_TO = ["create", "learn", "grow", "wonder", "explore", "imagine", "discover", "make", "build", "question"];

type Tab = "templates" | "mine" | "community";
type Creation = { id: string; worksheet: Worksheet; creatorName: string; creatorHandle: string };

function match(q: string, text: string): boolean {
  return q.trim() === "" || text.toLowerCase().includes(q.trim().toLowerCase());
}

export default function LibraryHome() {
  const { ready, kids, worksheets, account, addChild, toggleFavorite, togglePublish, removeWorksheet, toggleLike, likeCount, likedByMe } = useResources();
  const [tab, setTab] = useState<Tab>("templates");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [communitySel, setCommunitySel] = useState<string | null>(null);
  const [viewing, setViewing] = useState<{ ws: Worksheet; savedId?: string } | null>(null);

  const inTopic = (templateId: string) => topic === "all" || topicForTemplate(templateId) === topic;
  const templates = TEMPLATES.filter((t) => inTopic(t.id) && match(query, `${t.title} ${t.blurb}`));
  const mine = (ready ? worksheets : []).filter((w) => inTopic(w.meta.templateId) && match(query, `${w.title} ${w.subtitle}`));

  // Community creations = everyone's published worksheets + the seed placeholders.
  const creations: Creation[] = [
    ...(ready ? worksheets : [])
      .filter((w) => w.published)
      .map((w) => ({ id: w.id, worksheet: w as Worksheet, creatorName: w.creatorName || account?.displayName || "You", creatorHandle: w.creatorHandle || account?.handle || "me" })),
    ...COMMUNITY_SAMPLES.map((s) => ({ id: s.id, worksheet: s.worksheet, creatorName: s.creatorName, creatorHandle: s.creatorHandle })),
  ];
  const communityInSel = creations
    .filter((c) => (communitySel ? topicForTemplate(c.worksheet.meta.templateId) === communitySel : true) && match(query, `${c.worksheet.title} ${c.worksheet.subtitle} ${c.creatorName}`))
    .sort((a, b) => likeCount(b.id) - likeCount(a.id));

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "templates", label: "Templates", count: templates.length },
    { key: "mine", label: "My worksheets", count: mine.length },
    { key: "community", label: "Community", count: creations.length },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <span className="bg-sprout-cream/95 grid size-16 shrink-0 place-items-center rounded-2xl shadow-md">
          <SproutMascotIcon className="h-11 w-11" />
        </span>
        <div>
          <h1 className="text-sprout-cream text-3xl font-bold tracking-[-0.02em]">
            We were born to <Typewriter words={BORN_TO} className="text-sprout-lime" />
          </h1>
          <p className="text-sprout-cream/70 mt-1">Pick a worksheet, tell Sprout about your kid, and print it in a minute.</p>
          <Link href="/resources/privacy" className="text-sprout-cream/55 hover:text-sprout-cream mt-1.5 inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline">
            Your data stays yours. See how.
          </Link>
        </div>
      </div>

      {ready && <KidsManager kids={kids} account={account} onAdd={addChild} />}

      <GlassPanel radius="rounded-full" className="mb-3">
        <div className="flex items-center gap-2 px-4">
          <Search className="size-4 shrink-0 text-[#1B3722]/50" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search worksheets..." className="h-11 w-full bg-transparent text-sm text-[#1B3722] outline-none placeholder:text-[#1B3722]/45" />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear" className="text-[#1B3722]/50 hover:text-[#1B3722]">
              <X className="size-4" />
            </button>
          )}
        </div>
      </GlassPanel>

      {tab !== "community" && (
        <div className="mb-6 flex flex-wrap gap-2">
          <TopicChip active={topic === "all"} onClick={() => setTopic("all")} label="All" emoji="✨" />
          {TOPICS.map((t) => (
            <TopicChip key={t.key} active={topic === t.key} onClick={() => setTopic(t.key)} label={t.label} emoji={t.emoji} />
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <GlassButton
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`h-9 gap-2 px-4 text-sm ${tab === t.key ? "ring-2 ring-[#2E5A35]/45" : ""}`}
          >
            {t.label}
            <span className="rounded-full bg-[#1B3722]/10 px-1.5 text-xs">{t.count}</span>
          </GlassButton>
        ))}
      </div>

      {tab === "templates" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((t, i) => (
            <Link key={t.id} href={`/resources/${t.id}`} style={{ animationDelay: `${Math.min(i, 11) * 35}ms` }} className="group animate-in fade-in slide-in-from-bottom-3 fill-mode-both block duration-500 transition hover:-translate-y-0.5">
              <div className={`${lightCard} h-full p-5`}>
                <div className="flex items-start justify-between">
                  <span className={`grid size-11 place-items-center rounded-xl text-2xl ${t.accent}`}>{t.emoji}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-[#1B3722]">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#1B3722]/70">{t.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2E5A35]">
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mine.map((w) => (
                <SavedCard key={w.id} ws={w} onOpen={() => setViewing({ ws: w, savedId: w.id })} onFavorite={() => toggleFavorite(w.id)} onDelete={() => removeWorksheet(w.id)} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "community" && (
        <div>
          <p className="text-sprout-cream/65 mb-4 flex items-center gap-2 text-sm">
            <Globe className="size-4" /> Worksheets shared by the Sprout community. Pick a topic to explore, like the best, and watch them climb.
          </p>
          {communitySel === null ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {TOPICS.map((t) => {
                const count = creations.filter((c) => topicForTemplate(c.worksheet.meta.templateId) === t.key).length;
                return (
                  <button key={t.key} onClick={() => setCommunitySel(t.key)} className={`${lightCard} block p-6 text-left transition hover:-translate-y-0.5`}>
                    <div className="text-4xl">{t.emoji}</div>
                    <h3 className="mt-3 text-lg font-bold text-[#1B3722]">{t.label}</h3>
                    <p className="mt-1 text-sm text-[#1B3722]/60">{count} {count === 1 ? "worksheet" : "worksheets"}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <GlassButton onClick={() => setCommunitySel(null)} className="mb-4 h-9 gap-1 px-4 text-sm">
                <ArrowLeft className="size-4" /> All topics
              </GlassButton>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {communityInSel.map((c, i) => (
                  <div key={c.id} style={{ animationDelay: `${Math.min(i, 11) * 40}ms` }} className={`${lightCard} animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex flex-col p-5 duration-500`}>
                    <button onClick={() => setViewing({ ws: c.worksheet })} className="min-w-0 flex-1 text-left">
                      <span className="text-[11px] font-semibold tracking-wide text-[#2E5A35]/70 uppercase">#{i + 1}</span>
                      <h3 className="truncate font-bold text-[#1B3722]">{c.worksheet.title}</h3>
                      <p className="mt-0.5 text-xs text-[#1B3722]/60">{c.worksheet.subtitle}</p>
                    </button>
                    <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3">
                      <Link href={`/resources/creator/${c.creatorHandle}`} className="truncate text-xs font-medium text-[#2E5A35] hover:underline">
                        by {c.creatorName}
                      </Link>
                      <GlassButton
                        onClick={() => toggleLike(c.id)}
                        aria-label="Like"
                        className={`h-8 gap-1 px-2.5 text-sm ${likedByMe(c.id) ? "text-rose-600 ring-2 ring-rose-300" : "text-[#1B3722]/70"}`}
                      >
                        <Heart className={`size-4 ${likedByMe(c.id) ? "fill-rose-500 text-rose-500" : ""}`} /> {likeCount(c.id)}
                      </GlassButton>
                    </div>
                  </div>
                ))}
                {communityInSel.length === 0 && <p className="text-sprout-cream/60 text-sm">No worksheets here yet. Publish one from your saved worksheets.</p>}
              </div>
            </div>
          )}
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

function TopicChip({ active, onClick, label, emoji }: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  return (
    <GlassButton
      onClick={onClick}
      className={`h-9 gap-1.5 px-4 text-sm ${active ? "ring-2 ring-[#2E5A35]/45" : ""}`}
    >
      <span>{emoji}</span>
      {label}
    </GlassButton>
  );
}

function SavedCard({ ws, onOpen, onFavorite, onDelete }: { ws: SavedWorksheet; onOpen: () => void; onFavorite: () => void; onDelete: () => void }) {
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
        <GlassButton onClick={() => window.print()} className="h-10 px-4 text-sm">
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
    <div className={`${lightCard} mb-7 p-5`}>
      <h2 className="text-sm font-bold tracking-wide text-[#2E5A35] uppercase">Profiles</h2>
      <div className="mt-4 flex flex-wrap items-start gap-5">
        {/* main account */}
        {account && (
          <Link href={`/resources/creator/${account.handle}`} className="group animate-in fade-in zoom-in-95 fill-mode-both flex w-20 flex-col items-center gap-2 text-center duration-300">
            {account.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={account.photo} alt="" className={`size-16 rounded-full object-cover ${tileRing}`} />
            ) : (
              <span className={`grid size-16 place-items-center rounded-full bg-[#2E5A35] text-xl font-bold text-white ${tileRing}`}>{capName(account.displayName).charAt(0)}</span>
            )}
            <span className={tileLabel}>{capName(account.displayName)}</span>
            <span className={tileSub}>account</span>
          </Link>
        )}
        {/* kid sub-profiles */}
        {kids.map((k, i) => {
          const cc = colorClasses(k.color);
          return (
            <Link key={k.id} href={`/resources/child/${k.id}`} style={{ animationDelay: `${(i + 1) * 60}ms` }} className="group animate-in fade-in zoom-in-95 fill-mode-both flex w-20 flex-col items-center gap-2 text-center duration-300">
              <span className={`grid size-16 place-items-center rounded-full text-xl font-bold ${cc.bg} ${tileRing}`}>{capName(k.name).charAt(0)}</span>
              <span className={tileLabel}>{capName(k.name)}</span>
              <span className={tileSub}>age {k.age}</span>
            </Link>
          );
        })}
        {/* add a child */}
        {!adding ? (
          <button onClick={() => setAdding(true)} className="group animate-in fade-in zoom-in-95 fill-mode-both flex w-20 flex-col items-center gap-2 text-center duration-300">
            <span className="grid size-16 place-items-center rounded-full border-2 border-dashed border-[#2E5A35]/30 text-[#2E5A35] transition group-hover:border-[#2E5A35]/60 group-hover:bg-[#2E5A35]/5">
              <Plus className="size-6" />
            </span>
            <span className="text-xs font-semibold text-[#2E5A35]">Add child</span>
          </button>
        ) : (
          <div className="flex w-48 flex-col gap-2 rounded-2xl border border-black/10 bg-white p-3">
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
    </div>
  );
}
