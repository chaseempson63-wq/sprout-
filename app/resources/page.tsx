"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBigUp, ArrowRight, Check, Globe, MessageSquare, Plus, Printer, Search, SlidersHorizontal, Sparkles, Sprout, Star, Trash2, Users, X } from "lucide-react";
import { SproutMascotIcon } from "../_components/SproutMascotIcon";
import { WorksheetDoc } from "./_components/WorksheetDoc";
import { HowItWorks, type HowStep } from "./_components/HowItWorks";
import { Typewriter } from "./_components/Typewriter";
import { TEMPLATES, TOPICS, topicForTemplate } from "@/lib/resources/catalog";
import { COMMUNITY_SAMPLES } from "@/lib/resources/samples";
import { listCommunity } from "@/lib/resources/social";
import { colorClasses, useResources } from "@/lib/resources/store";
import { capName, cardTint, timeAgo } from "@/lib/resources/util";
import { GlassButton, GlassPanel } from "@/components/ui/glass";
import type { CommunityPost, SavedWorksheet, Worksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

// Hero: "We were born to ___" cycles the final word only.
const BORN_TO = ["create", "learn", "grow", "wonder", "explore", "imagine", "discover", "make", "build", "question"];

// The loop, in three quiet lines under the hero. A friend showing you, not a
// help desk. Few words.
const HOME_STEPS: HowStep[] = [
  { icon: Sparkles, title: "Pick or describe", blurb: "Start from a worksheet, or tell Sprout what you want." },
  { icon: SlidersHorizontal, title: "Make it theirs", blurb: "Add their age and something they love." },
  { icon: Printer, title: "Print or share", blurb: "Keep it, print it, or post it for other parents." },
];

type Tab = "templates" | "mine" | "community";
type Creation = { id: string; worksheet: Worksheet; creatorName: string; creatorHandle: string; createdAt: number };

function match(q: string, text: string): boolean {
  return q.trim() === "" || text.toLowerCase().includes(q.trim().toLowerCase());
}

export default function LibraryHome() {
  const { ready, kids, worksheets, account, addChild, toggleFavorite, togglePublish, removeWorksheet } = useResources();
  const [tab, setTab] = useState<Tab>("templates");
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [viewing, setViewing] = useState<{ ws: Worksheet; savedId?: string } | null>(null);

  // Community is the shared DB feed. When the social layer is off (unconfigured
  // / kill switch) socialOff flips and we fall back to the local + sample
  // showcase below, read-only, so the page never breaks.
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [socialOff, setSocialOff] = useState(false);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [creator, setCreator] = useState("");
  const [yoursOn, setYoursOn] = useState(false);

  const inTopic = (templateId: string) => topic === "all" || topicForTemplate(templateId) === topic;
  const templates = TEMPLATES.filter((t) => inTopic(t.id) && match(query, `${t.title} ${t.blurb}`));
  const mine = (ready ? worksheets : []).filter((w) => inTopic(w.meta.templateId) && match(query, `${w.title} ${w.subtitle}`));

  // Fallback community (used ONLY when the social backend is off): the user's own
  // published custom sheets + the seed placeholders, read-only.
  const fallbackCreations: Creation[] = [
    ...(ready ? worksheets : [])
      .filter((w) => w.published && w.meta.templateId === "custom")
      .map((w) => ({ id: w.id, worksheet: w as Worksheet, creatorName: w.creatorName || account?.displayName || "a Sprout parent", creatorHandle: w.creatorHandle || account?.handle || "", createdAt: w.createdAt })),
    ...COMMUNITY_SAMPLES.map((s) => ({ id: s.id, worksheet: s.worksheet, creatorName: s.creatorName, creatorHandle: s.creatorHandle, createdAt: 0 })),
  ]
    .filter((c) => match(query, `${c.worksheet.title} ${c.worksheet.subtitle} ${c.creatorName}`))
    .sort((a, b) => b.createdAt - a.createdAt);

  // The real community feed lives in the shared DB. Refetch (debounced) when the
  // search, creator filter, or "Yours" toggle change.
  useEffect(() => {
    if (!ready) return;
    let live = true;
    const t = window.setTimeout(() => {
      setLoadingCommunity(true);
      listCommunity({ q: query, creator: creator || undefined, mine: yoursOn ? account?.id : undefined }).then((res) => {
        if (!live) return;
        setPosts(res.posts);
        setSocialOff(res.disabled);
        setLoadingCommunity(false);
      });
    }, 250);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [ready, query, creator, yoursOn, account?.id]);

  const communityCount = socialOff ? fallbackCreations.length : posts.length;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "templates", label: "Templates", count: templates.length },
    { key: "mine", label: "My worksheets", count: mine.length },
  ];

  return (
    <div>
      <div className="mb-12 flex items-center gap-4 sm:mb-16 sm:gap-5">
        <span className="bg-sprout-cream/95 grid size-20 shrink-0 place-items-center rounded-3xl shadow-md sm:size-24">
          <SproutMascotIcon className="h-14 w-14 sm:h-16 sm:w-16" />
        </span>
        <div>
          <h1 className="text-sprout-cream text-5xl font-bold tracking-[-0.02em] sm:text-6xl">
            We were born to <Typewriter words={BORN_TO} className="text-sprout-lime" />
          </h1>
          <p className="text-sprout-cream/70 mt-2">Pick a worksheet, tell Sprout about your kid, and print it in a minute.</p>
          <Link href="/resources/privacy" className="text-sprout-cream/55 hover:text-sprout-cream mt-1.5 inline-flex items-center gap-1 text-xs font-medium underline-offset-2 hover:underline">
            Your data stays yours. See how.
          </Link>
        </div>
      </div>

      <HowItWorks steps={HOME_STEPS} className="mb-12 sm:mb-16" />

      {ready && (
        <div className="mb-12 grid items-stretch gap-6 sm:mb-16 md:grid-cols-3">
          <KidsManager kids={kids} account={account} onAdd={addChild} />
          <BuildYourOwnCard />
          <CommunityCard
            count={communityCount}
            active={tab === "community"}
            onOpen={() => setTab(tab === "community" ? "templates" : "community")}
          />
        </div>
      )}

      <GlassPanel radius="rounded-full" className="mb-4">
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
        <div className="mb-8 flex flex-wrap gap-2">
          <TopicChip active={topic === "all"} onClick={() => setTopic("all")} label="All" emoji="✨" />
          {TOPICS.map((t) => (
            <TopicChip key={t.key} active={topic === t.key} onClick={() => setTopic(t.key)} label={t.label} emoji={t.emoji} />
          ))}
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => (
            <Link key={t.id} href={`/resources/${t.id}`} style={{ animationDelay: `${Math.min(i, 11) * 35}ms` }} className="group animate-in fade-in slide-in-from-bottom-3 fill-mode-both block duration-500 transition hover:-translate-y-0.5">
              <div className={`${cardTint(i)} h-full p-7`}>
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mine.map((w, i) => (
                <SavedCard key={w.id} i={i} ws={w} onOpen={() => setViewing({ ws: w, savedId: w.id })} onFavorite={() => toggleFavorite(w.id)} onDelete={() => removeWorksheet(w.id)} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "community" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sprout-cream/65 flex items-center gap-2 text-sm">
              <Globe className="size-4" /> Worksheets built and shared by Sprout parents. Tap a maker to see everything they have made.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <GlassPanel radius="rounded-full">
                <div className="flex items-center gap-2 px-3">
                  <Users className="size-4 shrink-0 text-[#1B3722]/50" />
                  <input
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Filter by maker..."
                    className="h-9 w-40 bg-transparent text-sm text-[#1B3722] outline-none placeholder:text-[#1B3722]/45"
                  />
                  {creator && (
                    <button onClick={() => setCreator("")} aria-label="Clear maker filter" className="text-[#1B3722]/50 hover:text-[#1B3722]">
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </GlassPanel>
              {account && (
                <GlassButton onClick={() => setYoursOn((v) => !v)} className={`h-9 px-4 text-sm ${yoursOn ? "ring-2 ring-[#2E5A35]/45" : ""}`}>
                  Yours
                </GlassButton>
              )}
            </div>
          </div>

          {socialOff ? (
            <>
              <p className="text-sprout-cream/55 mb-3 text-xs">Showing your own published worksheets. The shared community is offline right now.</p>
              {fallbackCreations.length === 0 ? (
                <div className={`${lightCard} p-8 text-center`}>
                  <p className="text-[#1B3722]/70">No worksheets here yet. Build one from scratch and publish it.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {fallbackCreations.map((c, i) => (
                    <div key={c.id} className={`${cardTint(i)} flex flex-col p-5`}>
                      <button onClick={() => setViewing({ ws: c.worksheet })} className="min-w-0 flex-1 text-left">
                        <h3 className="truncate font-bold text-[#1B3722]">{c.worksheet.title}</h3>
                        <p className="mt-0.5 text-xs text-[#1B3722]/60">{c.worksheet.subtitle}</p>
                      </button>
                      <p className="mt-3 truncate border-t border-black/5 pt-3 text-xs text-[#1B3722]/70">
                        Made with Sprout by{" "}
                        {c.creatorHandle ? (
                          <Link href={`/resources/creator/${c.creatorHandle}`} className="font-semibold text-[#2E5A35] hover:underline">
                            {c.creatorName}
                          </Link>
                        ) : (
                          <span className="font-semibold text-[#2E5A35]">{c.creatorName}</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : loadingCommunity ? (
            <p className="text-sprout-cream/60 text-sm">Loading…</p>
          ) : posts.length === 0 ? (
            <div className={`${lightCard} p-8 text-center`}>
              <p className="text-[#1B3722]/70">
                {query || creator || yoursOn ? "No worksheets match that." : "No worksheets here yet. Build one from scratch and publish it."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${Math.min(i, 11) * 40}ms` }} className={`${cardTint(i)} animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex flex-col p-5 duration-500`}>
                  <Link href={`/resources/community/${p.id}`} className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-[#1B3722]">{p.title}</h3>
                    {p.subtitle && <p className="mt-0.5 text-xs text-[#1B3722]/60">{p.subtitle}</p>}
                  </Link>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-black/5 pt-3 text-xs text-[#1B3722]/70">
                    <span className="min-w-0 truncate">
                      by{" "}
                      <Link href={`/resources/creator/${p.handle}`} className="font-semibold text-[#2E5A35] hover:underline">
                        {capName(p.creatorName)}
                      </Link>
                      <span className="text-[#1B3722]/45"> · {timeAgo(p.createdAt)}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-[#1B3722]/55">
                      <span className="inline-flex items-center gap-0.5"><ArrowBigUp className="size-3.5" />{p.upvotes}</span>
                      <span className="inline-flex items-center gap-0.5"><MessageSquare className="size-3.5" />{p.commentCount}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

// Equal-billing sibling to the Profiles card: the freeform "I know what I want"
// path into the same builder, and the only path whose sheets can be published.
// Compact (half its old footprint) so all three top cards read as one row.
function BuildYourOwnCard() {
  return (
    <Link href="/resources/custom" className="group block h-full">
      <div className={`${lightCard} flex h-full flex-col p-7 transition group-hover:-translate-y-0.5`}>
        <h2 className="text-sm font-bold tracking-wide text-[#2E5A35] uppercase">Build your own</h2>
        <span className="mt-4 grid size-12 place-items-center rounded-2xl bg-[#2E5A35] text-white shadow-md">
          <Sprout className="size-6" />
        </span>
        <h3 className="mt-3 text-lg font-bold text-[#1B3722]">Start from scratch</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#1B3722]/70">
          Describe any worksheet and Sprout builds it. Yours to share with the community.
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#2E5A35]">
          Build one <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

// Third member of the top row: the doorway into community-made sheets. Promoted
// up here as a peer to Profiles + Build your own instead of buried in the tab
// pills. Clicking it flips the library below to the community view (and back).
function CommunityCard({ count, active, onOpen }: { count: number; active: boolean; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="group h-full w-full text-left">
      <div className={`${lightCard} flex h-full flex-col p-7 transition group-hover:-translate-y-0.5 ${active ? "ring-2 ring-[#2E5A35]/45" : ""}`}>
        <h2 className="text-sm font-bold tracking-wide text-[#2E5A35] uppercase">Community</h2>
        <span className="mt-4 grid size-12 place-items-center rounded-2xl bg-[#2E5A35] text-white shadow-md">
          <Users className="size-6" />
        </span>
        <h3 className="mt-3 text-lg font-bold text-[#1B3722]">Community library</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#1B3722]/70">
          Worksheets built and shared by Sprout parents. {count} to explore.
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#2E5A35]">
          Browse <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
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
    <div className={`${lightCard} h-full p-7`}>
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
