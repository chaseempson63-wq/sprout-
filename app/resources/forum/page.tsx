"use client";

// The community space: a chat-style feed where parents post, discuss, and
// upvote, with a pinned Announcements bar for Sprout product updates at the top.
// Reads/writes the shared DB; degrades to a friendly offline panel when social
// is off. Opening this page clears the announcement badge in the nav.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBigUp, ArrowLeft, ArrowRight, Megaphone, MessageSquare, Plus, Search, Send, X } from "lucide-react";
import { createThread, listThreads, makerWire } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName, timeAgo } from "@/lib/resources/util";
import { cn } from "@/lib/utils";
import { pill } from "@/lib/resources/pill";
import { ANNOUNCEMENTS } from "@/lib/resources/announcements";
import { GlassLink } from "@/components/ui/glass";
import type { ForumThread } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

// Deterministic pastel avatar per name so the feed reads like people talking.
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

export default function CommunityHome() {
  const router = useRouter();
  const { ready, account, markAnnouncementsSeen } = useResources();
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
    <div className="mx-auto max-w-2xl">
      <GlassLink href="/resources" className="mb-5 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-sprout-cream flex items-center gap-2.5 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            <MessageSquare className="size-7" /> Community
          </h1>
          <p className="text-sprout-cream/70 mt-1.5 text-sm sm:text-base">
            Ask anything, swap ideas, and tell Sprout what to build next.
          </p>
        </div>
        {account ? (
          <button
            onClick={() => setComposing((v) => !v)}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#2E5A35] px-4 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(46,90,53,0.7)] transition hover:bg-[#346a3f] active:scale-95"
          >
            {composing ? <X className="size-4" /> : <Plus className="size-4" />} {composing ? "Cancel" : "New post"}
          </button>
        ) : (
          <span className="text-sprout-cream/60 text-sm">Add your name (top right) to post.</span>
        )}
      </div>

      {/* Announcements — pinned Sprout product updates. */}
      {ANNOUNCEMENTS.length > 0 && (
        <div className="border-sprout-lime/30 mb-6 overflow-hidden rounded-2xl border bg-gradient-to-br from-[#2E5A35] to-[#16331E] p-4 shadow-[0_18px_40px_-18px_rgba(15,32,20,0.9)] sm:p-5">
          <div className="text-sprout-lime flex items-center gap-2 text-xs font-bold tracking-[0.12em] uppercase">
            <Megaphone className="size-4" /> Announcements
          </div>
          <div className="mt-3 space-y-3">
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <div key={a.id} className="border-sprout-lime/40 border-l-2 pl-3">
                <p className="text-sprout-cream font-bold">{a.title}</p>
                <p className="text-sprout-cream/70 mt-0.5 text-sm leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {composing && account && (
        <div className={`${lightCard} mb-6 p-4`}>
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

      <div className="mb-4 flex flex-wrap items-center gap-2">
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
      </div>

      {loading ? (
        <p className="text-sprout-cream/60 text-sm">Loading…</p>
      ) : off ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">The community is offline right now. Check back soon.</p>
        </div>
      ) : threads.length === 0 ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">{q ? "No posts match that." : "No posts yet. Start the first conversation."}</p>
        </div>
      ) : (
        <div className="divide-sprout-cream/10 border-sprout-cream/10 bg-sprout-cream/[0.04] divide-y overflow-hidden rounded-2xl border">
          {threads.map((t, i) => (
            <Link
              key={t.id}
              href={`/resources/forum/${t.id}`}
              style={{ animationDelay: `${Math.min(i, 11) * 30}ms` }}
              className="group animate-in fade-in fill-mode-both hover:bg-sprout-cream/[0.07] flex gap-3 px-3 py-3.5 duration-500 transition sm:px-4"
            >
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold", avatarClass(t.creatorName))}>
                {capName(t.creatorName).charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sprout-cream truncate text-sm font-bold">{capName(t.creatorName)}</span>
                  <span className="text-sprout-cream/40 shrink-0 text-xs">{timeAgo(t.createdAt)}</span>
                </div>
                <p className="text-sprout-cream/90 mt-0.5 leading-snug">{t.title}</p>
                <div className="text-sprout-cream/50 mt-2 flex items-center gap-4 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <ArrowBigUp className="size-3.5" /> {t.upvotes}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="size-3.5" /> {t.commentCount} {t.commentCount === 1 ? "reply" : "replies"}
                  </span>
                </div>
              </div>
              <ArrowRight className="text-sprout-cream/25 group-hover:text-sprout-cream/60 size-4 shrink-0 self-center transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
