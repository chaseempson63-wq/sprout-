"use client";

// Shareable permalink for one published community worksheet: the worksheet
// itself (printable) plus a Reddit-style comment thread, an upvote, a report,
// and an owner-only hide. Reads from the shared DB; degrades to a friendly
// panel when the social layer is off.

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { WorksheetDoc } from "../../_components/WorksheetDoc";
import { UpvoteButton } from "../../_components/UpvoteButton";
import { ReportControl } from "../../_components/ReportControl";
import { HideControl } from "../../_components/HideControl";
import { ThreadedComments } from "../../_components/ThreadedComments";
import { getCommunityPost } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName, timeAgo } from "@/lib/resources/util";
import { GlassButton, GlassLink } from "@/components/ui/glass";
import type { Comment, CommunityPost } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

export default function CommunityPostPage() {
  const params = useParams();
  const raw = params?.id;
  const id = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const router = useRouter();
  const { ready, account } = useResources();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!ready) return;
    let live = true;
    getCommunityPost(id, account?.id).then((res) => {
      if (!live) return;
      setPost(res.post);
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
      <GlassLink href="/resources" className="no-print mb-5 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

      {loading ? (
        <div className="text-sprout-cream/60 flex items-center justify-center gap-2 py-20 text-sm">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : !post ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">This worksheet isn&apos;t available. It may have been removed, or the community is offline right now.</p>
        </div>
      ) : (
        <>
          <div className={`${lightCard} no-print mb-4 flex flex-wrap items-center justify-between gap-3 p-4`}>
            <p className="min-w-0 text-xs text-[#1B3722]/65">
              Made with Sprout by{" "}
              <Link href={`/resources/creator/${post.handle}`} className="font-semibold text-[#2E5A35] hover:underline">
                {capName(post.creatorName)}
              </Link>{" "}
              · {timeAgo(post.createdAt)}
            </p>
            <div className="flex items-center gap-2">
              <UpvoteButton targetType="post" targetId={post.id} count={post.upvotes} voted={votedIds.includes(post.id)} />
              <GlassButton onClick={() => window.print()} className="h-8 gap-1 px-3 text-xs">
                <Download className="size-3.5" /> PDF
              </GlassButton>
              <ReportControl targetType="post" targetId={post.id} />
              <HideControl targetType="post" targetId={post.id} ownerId={post.makerId} onHidden={() => router.push("/resources")} />
            </div>
          </div>

          <WorksheetDoc worksheet={post.worksheet} />

          <div className="no-print mt-5 flex justify-center">
            <button
              onClick={() => window.print()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2E5A35] px-6 text-base font-bold text-white shadow-[0_12px_28px_-10px_rgba(46,90,53,0.7)] transition hover:-translate-y-0.5 hover:bg-[#346a3f] active:scale-95"
            >
              <Download className="size-5" /> Download PDF
            </button>
          </div>

          <div className="no-print mt-8">
            <h2 className="text-sprout-cream mb-3 text-xl font-bold">
              Comments {post.commentCount > 0 ? <span className="text-sprout-cream/50">· {post.commentCount}</span> : null}
            </h2>
            <ThreadedComments targetType="post" targetId={post.id} initialComments={comments} votedIds={votedIds} />
          </div>
        </>
      )}
    </div>
  );
}
