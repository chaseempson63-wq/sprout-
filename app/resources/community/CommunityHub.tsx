"use client";

// The one Community. Everything shared by Sprout parents lives here, behind
// three tabs:
//   Worksheets    — sheets other parents built and published (the library feed).
//   Chat          — discussion threads: ask, swap ideas, request packs.
//   Announcements — Sprout Team product updates (read-only broadcasts).
// Before this hub existed, "Community" meant two different things (the
// worksheet feed on the library page AND the forum) — one word, one place now.
// Reads/writes the shared DB; degrades to a friendly offline panel when social
// is off. Opening this page clears the announcement badge in the nav.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe, MessageSquare, MessagesSquare, Plus, Search, Send, X } from "lucide-react";
import { createThread, listAnnouncementHearts, listCommunity, listThreads, makerWire } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName, firstImageKey, timeAgo } from "@/lib/resources/util";
import { cn } from "@/lib/utils";
import { pill } from "@/lib/resources/pill";
import { ANNOUNCEMENTS, unseenAnnouncements } from "@/lib/resources/announcements";
import { COMMUNITY_SAMPLES } from "@/lib/resources/samples";
import { TOPICS } from "@/lib/resources/catalog";
import { printWorksheet } from "@/lib/resources/print-fit";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { WorksheetDoc } from "../_components/WorksheetDoc";
import { DocumentNudge } from "../_components/DocumentNudge";
import { MakerAvatar } from "../_components/MakerAvatar";
import { UpvoteButton } from "../_components/UpvoteButton";
import { SheetStack, sheet } from "../_components/paper";
import { AnnouncementHeart } from "../_components/AnnouncementHeart";
import { noteTint } from "@/lib/resources/note-tint";
import { GlassButton } from "@/components/ui/glass";
import type { CommunityPost, ForumThread, Worksheet } from "@/lib/resources/types";

export type CommunityTab = "worksheets" | "chat" | "announcements";

const AVATARS = [
  "bg-[#CDEFA0] text-[#1B3722]",
  "bg-[#A4C9A8] text-[#1B3722]",
  "bg-amber-200 text-[#1B3722]",
  "bg-sky-200 text-[#0F1A12]",
  "bg-rose-200 text-[#1B3722]",
  "bg-violet-200 text-[#1B3722]",
];
function avatarClass(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATARS[h % AVATARS.length];
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type Creation = { id: string; worksheet: Worksheet; creatorName: string; creatorHandle: string; createdAt: number };

export function CommunityHub({ initialTab }: { initialTab: CommunityTab }) {
  const router = useRouter();
  const { ready, account, worksheets, markAnnouncementsSeen, announcementsSeenAt } = useResources();
  const [tab, setTab] = useState<CommunityTab>(initialTab);

  // ── Worksheets tab state ─────────────────────────────────────────────
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [socialOff, setSocialOff] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [yoursOn, setYoursOn] = useState(false);
  const [viewing, setViewing] = useState<Worksheet | null>(null);

  // ── Chat tab state ───────────────────────────────────────────────────
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [chatOff, setChatOff] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  // ── Announcement hearts ─────────────────────────────────────────────
  const [heartCounts, setHeartCounts] = useState<Record<string, number>>({});
  const [heartMine, setHeartMine] = useState<string[]>([]);

  // Opening the Community clears the announcement badge in the nav.
  useEffect(() => {
    markAnnouncementsSeen();
  }, [markAnnouncementsSeen]);

  // Load announcement heart counts when the Announcements tab is open.
  useEffect(() => {
    if (!ready || tab !== "announcements") return;
    let live = true;
    listAnnouncementHearts(account?.id).then((res) => {
      if (!live) return;
      setHeartCounts(res.counts);
      setHeartMine(res.mine);
    });
    return () => {
      live = false;
    };
  }, [ready, tab, account?.id]);

  // Worksheet feed: refetch (debounced) when search / topic / Yours change.
  useEffect(() => {
    if (!ready) return;
    let live = true;
    const t = window.setTimeout(() => {
      setLoadingPosts(true);
      listCommunity({ q: query, topic: topic !== "all" ? topic : undefined, mine: yoursOn ? account?.id : undefined }).then((res) => {
        if (!live) return;
        setPosts(res.posts);
        setSocialOff(res.disabled);
        setLoadingPosts(false);
      });
    }, 250);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [ready, query, topic, yoursOn, account?.id]);

  // Chat threads: refetch (debounced) when search / sort change.
  useEffect(() => {
    if (!ready) return;
    let live = true;
    const t = window.setTimeout(() => {
      listThreads({ q, sort }).then((res) => {
        if (!live) return;
        setThreads(res.threads);
        setChatOff(res.disabled);
        setLoadingThreads(false);
      });
    }, 250);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [q, sort, ready]);

  // Offline fallback for the worksheet feed: the user's own published custom
  // sheets + the seed placeholders, read-only, so the page never breaks.
  const fallbackCreations: Creation[] = [
    ...(ready ? worksheets : [])
      .filter((w) => w.published && w.meta.templateId === "custom")
      .map((w) => ({ id: w.id, worksheet: w as Worksheet, creatorName: w.creatorName || account?.displayName || "a Sprout parent", creatorHandle: w.creatorHandle || account?.handle || "", createdAt: w.createdAt })),
    ...COMMUNITY_SAMPLES.map((s) => ({ id: s.id, worksheet: s.worksheet, creatorName: s.creatorName, creatorHandle: s.creatorHandle, createdAt: 0 })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  async function post() {
    if (!account) return;
    const t = title.trim();
    if (!t || posting) return;
    setPosting(true);
    const res = await createThread(makerWire(account), t, body.trim());
    setPosting(false);
    if (res.id) router.push(`/resources/forum/${res.id}`);
  }

  const unseen = unseenAnnouncements(announcementsSeenAt);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-sprout-cream flex items-center gap-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          <span className="bg-sprout-cream/95 grid size-11 shrink-0 place-items-center rounded-2xl shadow-md">
            <SproutMascotIcon className="size-7" />
          </span>
          Community
        </h1>
        <p className="text-sprout-cream/70 mt-3 text-sm sm:text-base">
          Worksheets built by Sprout parents, a place to ask and swap ideas, and updates from the team.
        </p>
      </div>

      {/* The three rooms — three main cards. */}
      <div className="mb-10 grid grid-cols-3 gap-3 sm:gap-4">
        <RoomCard active={tab === "worksheets"} onClick={() => setTab("worksheets")} icon={<Globe className="size-5" />} title="Worksheets" sub="Sheets parents built and shared" />
        <RoomCard active={tab === "chat"} onClick={() => setTab("chat")} icon={<MessagesSquare className="size-5" />} title="Chat" sub="Ask and swap ideas" />
        <RoomCard
          active={tab === "announcements"}
          onClick={() => setTab("announcements")}
          icon={<span className="text-lg leading-none">🚨</span>}
          title="Announcements"
          sub="News from the team"
          badge={unseen > 0 && tab !== "announcements" ? unseen : undefined}
        />
      </div>

      {/* ── Worksheets ──────────────────────────────────────────────── */}
      {tab === "worksheets" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="border-sprout-cream/15 bg-sprout-cream/10 flex min-w-0 flex-1 items-center gap-2 rounded-full border px-4 backdrop-blur-sm">
              <Search className="text-sprout-cream/50 size-4 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shared worksheets..."
                className="text-sprout-cream placeholder:text-sprout-cream/40 h-11 w-full bg-transparent text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear" className="text-sprout-cream/50 hover:text-sprout-cream">
                  <X className="size-4" />
                </button>
              )}
            </div>
            {account && (
              <button onClick={() => setYoursOn((v) => !v)} className={pill(yoursOn, "h-11 px-4 text-sm")}>
                Yours
              </button>
            )}
          </div>
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <button onClick={() => setTopic("all")} className={pill(topic === "all", "h-9 px-4 text-sm")}>
              ✨ All
            </button>
            {TOPICS.map((t) => (
              <button key={t.key} onClick={() => setTopic(t.key)} className={pill(topic === t.key, "h-9 px-4 text-sm")}>
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>

          {socialOff ? (
            <>
              <p className="text-sprout-cream/55 mb-3 text-xs">Showing your own published worksheets. The shared community is offline right now.</p>
              {fallbackCreations.length === 0 ? (
                <EmptyCard text="No worksheets here yet. Build one from scratch and publish it." />
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-3">
                  {fallbackCreations.map((c) => {
                    const img = firstImageKey(c.worksheet);
                    return (
                      <div key={c.id}>
                        <SheetStack flat className="flex h-full flex-col overflow-hidden">
                          <button onClick={() => setViewing(c.worksheet)} aria-label={c.worksheet.title} className="grid aspect-[4/3] w-full place-items-center overflow-hidden border-b border-[#2E5A35]/10 bg-white">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element -- static webp
                              <img src={`/resources/illustrations/${img}.webp`} alt="" className="h-full w-full object-contain" />
                            ) : (
                              <span className="text-4xl">📄</span>
                            )}
                          </button>
                          <div className="flex flex-1 flex-col p-4 sm:p-5">
                            <button onClick={() => setViewing(c.worksheet)} className="min-w-0 flex-1 text-left">
                              <h3 className="leading-snug font-bold text-[#1B3722]">{c.worksheet.title}</h3>
                              <p className="mt-0.5 text-xs text-[#1B3722]/60">{c.worksheet.subtitle}</p>
                            </button>
                            <p className="mt-3 truncate border-t border-[#2E5A35]/10 pt-3 text-xs text-[#1B3722]/70">
                              Made with Sprout by{" "}
                              {c.creatorHandle ? (
                                <Link href={`/resources/creator/${c.creatorHandle}`} className="font-bold text-[#2E5A35] hover:underline">
                                  {c.creatorName}
                                </Link>
                              ) : (
                                <span className="font-bold text-[#2E5A35]">{c.creatorName}</span>
                              )}
                            </p>
                          </div>
                        </SheetStack>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : loadingPosts ? (
            <p className="text-sprout-cream/60 text-sm">Loading…</p>
          ) : posts.length === 0 ? (
            <EmptyCard text={query || topic !== "all" || yoursOn ? "No worksheets match that." : "No worksheets here yet. Build one from scratch and publish it."} />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-3">
              {posts.map((p, i) => {
                const img = firstImageKey(p.worksheet);
                return (
                  <div key={p.id} style={{ animationDelay: `${Math.min(i, 11) * 40}ms` }} className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500">
                    <SheetStack flat className="flex h-full flex-col overflow-hidden">
                      <Link href={`/resources/community/${p.id}`} aria-label={p.title} className="grid aspect-[4/3] w-full place-items-center overflow-hidden border-b border-[#2E5A35]/10 bg-white">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element -- static webp
                          <img src={`/resources/illustrations/${img}.webp`} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-4xl">📄</span>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <Link href={`/resources/community/${p.id}`} className="min-w-0 flex-1">
                          <h3 className="leading-snug font-bold text-[#1B3722]">{p.title}</h3>
                          {p.subtitle && <p className="mt-0.5 text-xs text-[#1B3722]/60">{p.subtitle}</p>}
                        </Link>
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#2E5A35]/10 pt-3 text-xs text-[#1B3722]/70">
                          <span className="flex min-w-0 items-center gap-1.5 truncate">
                            <MakerAvatar name={p.creatorName} photo={p.photo} px={22} />
                            <Link href={`/resources/creator/${p.handle}`} className="truncate font-bold text-[#2E5A35] hover:underline">
                              {capName(p.creatorName)}
                            </Link>
                            <span className="shrink-0 text-[#1B3722]/45">· {timeAgo(p.createdAt)}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1.5">
                            <UpvoteButton targetType="post" targetId={p.id} count={p.upvotes} />
                            <Link href={`/resources/community/${p.id}#comments`} aria-label="Comments" className="inline-flex h-8 items-center gap-1 rounded-full border border-[#2E5A35]/20 bg-white/60 px-2.5 text-xs font-bold text-[#1B3722]/75 transition hover:bg-white">
                              <MessageSquare className="size-3.5" /> {p.commentCount}
                            </Link>
                          </span>
                        </div>
                      </div>
                    </SheetStack>
                  </div>
                );
              })}
            </div>
          )}

          {/* the doorway back to making one */}
          <div className="mt-8 flex justify-center">
            <Link href="/resources/custom" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2E5A35] px-5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(46,90,53,0.7)] transition hover:-translate-y-0.5 hover:bg-[#346a3f]">
              <Plus className="size-4" /> Build your own to share
            </Link>
          </div>
        </div>
      )}

      {/* ── Chat ────────────────────────────────────────────────────── */}
      {tab === "chat" && (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <div className="border-sprout-cream/15 bg-sprout-cream/10 flex min-w-0 flex-1 items-center gap-2 rounded-full border px-4 backdrop-blur-sm">
              <Search className="text-sprout-cream/50 size-4 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the chat..."
                className="text-sprout-cream placeholder:text-sprout-cream/40 h-11 w-full bg-transparent text-sm outline-none"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear" className="text-sprout-cream/50 hover:text-sprout-cream">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <button onClick={() => setSort("new")} className={pill(sort === "new", "h-9 px-4 text-sm")}>
              New
            </button>
            <button onClick={() => setSort("top")} className={pill(sort === "top", "h-9 px-4 text-sm")}>
              Top
            </button>
            {account ? (
              <button
                onClick={() => setComposing((v) => !v)}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#2E5A35] px-4 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(46,90,53,0.7)] transition hover:bg-[#346a3f] active:scale-95"
              >
                {composing ? <X className="size-4" /> : <Plus className="size-4" />} {composing ? "Cancel" : "New post"}
              </button>
            ) : (
              <span className="text-sprout-cream/60 text-sm">Add your name (top right) to post.</span>
            )}
          </div>

          {composing && account && (
            <div className={cn(sheet, "mb-5 p-4")}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind? e.g. Can you add more multiplication packs?"
                autoFocus
                className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-[#1B3722] outline-none focus:border-[#2E5A35]"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Add detail (optional)."
                rows={4}
                className="mt-2 w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm leading-relaxed text-[#1B3722] outline-none focus:border-[#2E5A35]"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={post}
                  disabled={!title.trim() || posting}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#2E5A35] px-4 text-sm font-bold text-white transition hover:bg-[#346a3f] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Send className="size-4" /> {posting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}

          {loadingThreads ? (
            <p className="text-sprout-cream/60 text-sm">Loading…</p>
          ) : chatOff ? (
            <EmptyCard text="The community is offline right now. Check back soon." />
          ) : threads.length === 0 ? (
            <EmptyCard text={q ? "No posts match that." : "No posts yet. Start the first conversation."} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {threads.map((t, i) => (
                <div
                  key={t.id}
                  style={{ animationDelay: `${Math.min(i, 11) * 35}ms` }}
                  className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both block duration-500"
                >
                  {/* a sticky note pinned to the desk, with a strip of tape — flat, not tilted */}
                  <div
                    className={cn(
                      "relative flex h-full flex-col rounded-lg p-5 pt-6 ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1.5",
                      "shadow-[0_12px_26px_-12px_rgba(8,22,12,0.55),0_26px_50px_-28px_rgba(8,22,12,0.4)]",
                      noteTint(t.id),
                    )}
                  >
                    <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rounded-[2px] bg-white/55 shadow-[0_1px_2px_rgba(8,22,12,0.15)]" />
                    {/* Card body opens the post; the upvote below does NOT navigate. */}
                    <Link href={`/resources/forum/${t.id}`} className="block flex-1">
                      <div className="flex items-center gap-2">
                        {t.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.photo} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                        ) : (
                          <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold", avatarClass(t.creatorName))}>
                            {capName(t.creatorName).charAt(0)}
                          </span>
                        )}
                        <span className="min-w-0 truncate text-sm font-bold text-[#1B3722]">{capName(t.creatorName)}</span>
                        <span className="shrink-0 text-xs text-[#1B3722]/45">{timeAgo(t.createdAt)}</span>
                      </div>
                      <p className="mt-2.5 leading-snug font-bold text-[#1B3722]">{t.title}</p>
                    </Link>
                    <div className="mt-3 flex items-center gap-2 border-t border-[#1B3722]/10 pt-3">
                      <UpvoteButton targetType="thread" targetId={t.id} count={t.upvotes} />
                      <Link
                        href={`/resources/forum/${t.id}#comments`}
                        aria-label="Replies"
                        className="inline-flex h-8 items-center gap-1 rounded-full border border-[#1B3722]/15 bg-white/55 px-2.5 text-xs font-bold text-[#1B3722]/70 transition hover:bg-white/85"
                      >
                        <MessageSquare className="size-3.5" /> {t.commentCount}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Announcements ───────────────────────────────────────────── */}
      {tab === "announcements" && (
        <div className="space-y-4">
          {ANNOUNCEMENTS.map((a, i) => {
            const latest = i === 0;
            return (
              <div
                key={a.id}
                className={cn(
                  latest
                    ? "rounded-[22px] border border-[#CDEFA0]/30 bg-gradient-to-br from-[#2E5A35] to-[#16331E] p-5 shadow-[0_16px_36px_-14px_rgba(0,0,0,0.5)]"
                    : cn(sheet, "p-5"),
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className={cn("grid size-7 place-items-center rounded-full shadow-sm", latest ? "bg-sprout-cream" : "ring-[#2E5A35]/15 bg-white ring-1")}>
                      <SproutMascotIcon className="size-5" />
                    </span>
                    <span className={cn("text-sm font-bold", latest ? "text-sprout-lime" : "text-[#2E5A35]")}>🚨 Sprout Team</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2.5">
                    <AnnouncementHeart
                      key={`${a.id}:${heartCounts[a.id] ?? 0}:${heartMine.includes(a.id)}`}
                      id={a.id}
                      count={heartCounts[a.id] ?? 0}
                      hearted={heartMine.includes(a.id)}
                      light={latest}
                    />
                    <span className={cn("text-xs font-medium", latest ? "text-sprout-cream/50" : "text-[#1B3722]/45")}>{fmtDate(a.ts)}</span>
                  </span>
                </div>
                <h3 className={cn("mt-3 text-lg font-bold", latest ? "text-sprout-cream" : "text-[#1B3722]")}>{a.title}</h3>
                <p className={cn("mt-1.5 text-sm leading-relaxed", latest ? "text-sprout-cream/75" : "text-[#1B3722]/70")}>{a.body}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Fallback viewer for offline-mode worksheet cards (no permalink). */}
      {viewing && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0F1A12]/80 backdrop-blur-sm">
          <div className="no-print sticky top-0 flex items-center justify-end gap-2 p-4">
            <GlassButton onClick={() => printWorksheet()} className="h-10 px-4 text-sm">
              Print / PDF
            </GlassButton>
            <GlassButton onClick={() => setViewing(null)} aria-label="Close" className="h-10 px-4 text-sm">
              <X className="size-4" /> Close
            </GlassButton>
          </div>
          <div className="mx-auto w-full max-w-3xl px-4 pb-16">
            <WorksheetDoc worksheet={viewing} />
            <DocumentNudge />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className={cn(sheet, "p-8 text-center")}>
      <p className="text-[#1B3722]/70">{text}</p>
    </div>
  );
}

// One of the three big room cards — the frosted-glass panel (same as the guide's
// "Still stuck?" card): translucent cream over the green, backdrop blur, hairline
// cream border. The active room just reads brighter; no colour swap.
function RoomCard({
  active,
  onClick,
  icon,
  title,
  sub,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sprout-cream flex flex-col items-start gap-2.5 rounded-2xl border p-4 text-left backdrop-blur-sm transition sm:gap-3 sm:p-5",
        active
          ? "border-sprout-cream/40 bg-sprout-cream/20 shadow-[0_14px_30px_-14px_rgba(8,22,12,0.5)]"
          : "border-sprout-cream/15 bg-sprout-cream/10 hover:bg-sprout-cream/[0.16]",
      )}
    >
      <span className={cn("relative grid size-10 shrink-0 place-items-center rounded-xl sm:size-11", active ? "bg-sprout-cream/30" : "bg-sprout-cream/15")}>
        {icon}
        {badge ? (
          <span className="absolute -top-1.5 -right-1.5 grid size-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{badge}</span>
        ) : null}
      </span>
      <span className="text-sm font-bold sm:text-base">{title}</span>
      <span className="text-sprout-cream/65 hidden text-xs leading-snug sm:block">{sub}</span>
    </button>
  );
}
