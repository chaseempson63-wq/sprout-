"use client";

// The public forum: where feedback lives now. Parents post, others discuss and
// upvote. Reads/writes the shared DB; degrades to a friendly offline panel when
// the social layer is off.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, MessageSquare, Plus, Search, Send, X } from "lucide-react";
import { createThread, listThreads, makerWire } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName, timeAgo } from "@/lib/resources/util";
import { GlassButton, GlassLink, GlassPanel } from "@/components/ui/glass";
import type { ForumThread } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

export default function ForumHome() {
  const router = useRouter();
  const { ready, account } = useResources();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [off, setOff] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");

  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

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
    if (res.id) {
      router.push(`/resources/forum/${res.id}`);
    }
  }

  return (
    <div>
      <GlassLink href="/resources" className="mb-5 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-sprout-cream flex items-center gap-2 text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
            <MessageSquare className="size-8" /> Forum
          </h1>
          <p className="text-sprout-cream/70 mt-2 max-w-xl">
            Tell us what you want Sprout to make, swap ideas, and talk to other parents. This is where feedback lives now, out in the open.
          </p>
        </div>
        {account ? (
          <GlassButton onClick={() => setComposing((v) => !v)} className="h-10 gap-1 px-4 text-sm">
            {composing ? <X className="size-4" /> : <Plus className="size-4" />} {composing ? "Cancel" : "New post"}
          </GlassButton>
        ) : (
          <span className="text-sprout-cream/60 text-sm">Add your name (top right) to post.</span>
        )}
      </div>

      {composing && account && (
        <div className={`${lightCard} mb-6 p-4`}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A clear title — e.g. Can someone make more multiplication packs?"
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
            <GlassButton onClick={post} disabled={!title.trim() || posting} className="h-10 gap-1 px-4 text-sm">
              <Send className="size-4" /> {posting ? "Posting..." : "Post"}
            </GlassButton>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <GlassPanel radius="rounded-full" className="min-w-0 flex-1">
          <div className="flex items-center gap-2 px-4">
            <Search className="size-4 shrink-0 text-[#1B3722]/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the forum..."
              className="h-11 w-full bg-transparent text-sm text-[#1B3722] outline-none placeholder:text-[#1B3722]/45"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear" className="text-[#1B3722]/50 hover:text-[#1B3722]">
                <X className="size-4" />
              </button>
            )}
          </div>
        </GlassPanel>
        <GlassButton onClick={() => setSort("new")} className={`h-9 px-4 text-sm ${sort === "new" ? "ring-2 ring-[#2E5A35]/45" : ""}`}>
          New
        </GlassButton>
        <GlassButton onClick={() => setSort("top")} className={`h-9 px-4 text-sm ${sort === "top" ? "ring-2 ring-[#2E5A35]/45" : ""}`}>
          Top
        </GlassButton>
      </div>

      {loading ? (
        <p className="text-sprout-cream/60 text-sm">Loading…</p>
      ) : off ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">The forum is offline right now. Check back soon.</p>
        </div>
      ) : threads.length === 0 ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">{q ? "No posts match that." : "No posts yet. Start the first conversation."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((t, i) => (
            <Link
              key={t.id}
              href={`/resources/forum/${t.id}`}
              style={{ animationDelay: `${Math.min(i, 11) * 35}ms` }}
              className={`${lightCard} animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-center gap-4 p-4 duration-500 transition hover:-translate-y-0.5`}
            >
              <span className="grid w-12 shrink-0 place-items-center">
                <span className="text-lg font-bold text-[#2E5A35]">{t.upvotes}</span>
                <span className="text-[10px] tracking-wide text-[#1B3722]/45 uppercase">votes</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-[#1B3722]">{t.title}</span>
                <span className="mt-0.5 block text-xs text-[#1B3722]/60">
                  {capName(t.creatorName)} · {timeAgo(t.createdAt)} · {t.commentCount} {t.commentCount === 1 ? "reply" : "replies"}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-[#2E5A35]" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
