"use client";

// The community space, two sections behind a simple filter:
//   Announcements — Sprout Team product updates (read-only broadcasts).
//   Community     — parent posts/discussion, each its own card, upvote + reply.
// Reads/writes the shared DB; degrades to a friendly offline panel when social
// is off. Opening this page clears the announcement badge in the nav.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBigUp, ArrowLeft, MessageSquare, Plus, Search, Send, X } from "lucide-react";
import { createThread, listThreads, makerWire } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName, cardTint, cardTintFor, timeAgo } from "@/lib/resources/util";
import { cn } from "@/lib/utils";
import { pill } from "@/lib/resources/pill";
import { ANNOUNCEMENTS, unseenAnnouncements } from "@/lib/resources/announcements";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { GlassLink } from "@/components/ui/glass";
import type { ForumThread } from "@/lib/resources/types";

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

export default function CommunityHome() {
  const router = useRouter();
  const { ready, account, markAnnouncementsSeen, announcementsSeenAt } = useResources();
  const [tab, setTab] = useState<"announcements" | "community">(() =>
    unseenAnnouncements(announcementsSeenAt) > 0 ? "announcements" : "community",
  );
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [off, setOff] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");

  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  // Opening the Community clears the announcement badge in the nav.
  useEffect(() => {
    markAnnouncementsSeen();
  }, [markAnnouncementsSeen]);

  useEffect(() => {
    if (!ready) return;
    let live = true;
    const t = window.setTimeout(() => {
      listThreads({ q, sort }).then((res) => {
        if (!live) return;
        setThreads(res.threads);
        setOff(res.disabled);
        setLoading(false);
      });
    }, 250);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [q, sort, ready]);

  async function post() {
    if (!account) return;
    const t = title.trim();
    if (!t || posting) return;
    setPosting(true);
    const res = await createThread(makerWire(account), t, body.trim());
    setPosting(false);
    if (res.id) router.push(`/resources/forum/${res.id}`);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <GlassLink href="/resources" className="mb-5 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

      <div className="mb-6">
        <h1 className="text-sprout-cream flex items-center gap-2.5 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
          <MessageSquare className="size-7" /> Community
        </h1>
        <p className="text-sprout-cream/70 mt-1.5 text-sm sm:text-base">
          Updates from the Sprout team, and a place to ask, swap ideas, and tell us what to build next.
        </p>
      </div>

      {/* Filter: the two sections people switch between. */}
      <div className="mb-6 flex items-center gap-2">
        <button onClick={() => setTab("announcements")} className={pill(tab === "announcements", "h-10 px-5 text-sm")}>
          🚨 Announcements
          {unseenAnnouncements(announcementsSeenAt) > 0 && tab !== "announcements" && (
            <span className="grid size-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unseenAnnouncements(announcementsSeenAt)}
            </span>
          )}
        </button>
        <button onClick={() => setTab("community")} className={pill(tab === "community", "h-10 px-5 text-sm")}>
          Community
        </button>
      </div>

      {tab === "announcements" ? (
        <div className="space-y-4">
          {ANNOUNCEMENTS.map((a, i) => {
            const latest = i === 0;
            return (
              <div
                key={a.id}
                className={cn(
                  "rounded-2xl border p-5 shadow-[0_16px_36px_-14px_rgba(0,0,0,0.5)]",
                  latest ? "border-[#CDEFA0]/30 bg-gradient-to-br from-[#2E5A35] to-[#16331E]" : "border-[#2E5A35]/15 bg-[#E9F3E6]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className={cn("grid size-7 place-items-center rounded-full shadow-sm", latest ? "bg-sprout-cream" : "ring-[#2E5A35]/15 bg-white ring-1")}>
                      <SproutMascotIcon className="size-5" />
                    </span>
                    <span className={cn("text-sm font-bold", latest ? "text-sprout-lime" : "text-[#2E5A35]")}>🚨 Sprout Team</span>
                  </span>
                  <span className={cn("text-xs font-medium", latest ? "text-sprout-cream/50" : "text-[#1B3722]/45")}>{fmtDate(a.ts)}</span>
                </div>
                <h3 className={cn("mt-3 text-lg font-bold", latest ? "text-sprout-cream" : "text-[#1B3722]")}>{a.title}</h3>
                <p className={cn("mt-1.5 text-sm leading-relaxed", latest ? "text-sprout-cream/75" : "text-[#1B3722]/70")}>{a.body}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <div className="border-sprout-cream/15 bg-sprout-cream/10 flex min-w-0 flex-1 items-center gap-2 rounded-full border px-4">
              <Search className="text-sprout-cream/50 size-4 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the community..."
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
            <div className={cn(cardTint(0), "mb-5 p-4")}>
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

          {loading ? (
            <p className="text-sprout-cream/60 text-sm">Loading…</p>
          ) : off ? (
            <div className={cn(cardTint(0), "p-8 text-center")}>
              <p className="text-[#1B3722]/70">The community is offline right now. Check back soon.</p>
            </div>
          ) : threads.length === 0 ? (
            <div className={cn(cardTint(0), "p-8 text-center")}>
              <p className="text-[#1B3722]/70">{q ? "No posts match that." : "No posts yet. Start the first conversation."}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {threads.map((t, i) => (
                <Link
                  key={t.id}
                  href={`/resources/forum/${t.id}`}
                  style={{ animationDelay: `${Math.min(i, 11) * 35}ms` }}
                  className={cn(cardTintFor(t.id), "group animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex flex-col p-4 duration-500 transition hover:-translate-y-1")}
                >
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
                  <p className="mt-2.5 flex-1 font-bold leading-snug text-[#1B3722]">{t.title}</p>
                  <div className="mt-3 flex items-center gap-4 border-t border-[#2E5A35]/10 pt-3 text-xs text-[#1B3722]/55">
                    <span className="inline-flex items-center gap-1">
                      <ArrowBigUp className="size-3.5" /> {t.upvotes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="size-3.5" /> {t.commentCount} {t.commentCount === 1 ? "reply" : "replies"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
