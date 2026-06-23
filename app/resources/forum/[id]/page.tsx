"use client";

// One forum thread: the original post plus a Reddit-style comment thread, an
// upvote, a report, and an owner-only hide. Reads the shared DB; degrades to a
// friendly panel when the social layer is off.

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { UpvoteButton } from "../../_components/UpvoteButton";
import { ReportControl } from "../../_components/ReportControl";
import { HideControl } from "../../_components/HideControl";
import { ThreadedComments } from "../../_components/ThreadedComments";
import { getThread } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName, timeAgo } from "@/lib/resources/util";
import { GlassLink } from "@/components/ui/glass";
import type { Comment, ForumThread } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

export default function ForumThreadPage() {
  const params = useParams();
  const raw = params?.id;
  const id = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const router = useRouter();
  const { ready, account } = useResources();

  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!ready) return;
    let live = true;
    getThread(id, account?.id).then((res) => {
      if (!live) return;
      setThread(res.thread);
      setComments(res.comments);
      setVotedIds(res.votedIds);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, [id, ready, account?.id]);

  return (
    <div>
      <GlassLink href="/resources/forum" className="mb-5 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Forum
      </GlassLink>

      {loading ? (
        <div className="text-sprout-cream/60 flex items-center justify-center gap-2 py-20 text-sm">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : !thread ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">This post isn&apos;t available. It may have been removed, or the forum is offline right now.</p>
        </div>
      ) : (
        <>
          <div className={`${lightCard} mb-6 p-6`}>
            <h1 className="text-2xl font-bold text-[#1B3722]">{thread.title}</h1>
            <p className="mt-1 text-xs text-[#1B3722]/55">
              <Link href={`/resources/creator/${thread.handle}`} className="font-semibold text-[#2E5A35] hover:underline">
                {capName(thread.creatorName)}
              </Link>{" "}
              · {timeAgo(thread.createdAt)}
            </p>
            {thread.body && <p className="mt-4 break-words whitespace-pre-wrap text-[#1B3722]/85">{thread.body}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <UpvoteButton targetType="thread" targetId={thread.id} count={thread.upvotes} voted={votedIds.includes(thread.id)} />
              <ReportControl targetType="thread" targetId={thread.id} />
              <HideControl targetType="thread" targetId={thread.id} ownerId={thread.makerId} onHidden={() => router.push("/resources/forum")} />
            </div>
          </div>

          <h2 className="text-sprout-cream mb-3 text-xl font-bold">
            Replies {thread.commentCount > 0 ? <span className="text-sprout-cream/50">· {thread.commentCount}</span> : null}
          </h2>
          <ThreadedComments targetType="thread" targetId={thread.id} initialComments={comments} votedIds={votedIds} />
        </>
      )}
    </div>
  );
}
