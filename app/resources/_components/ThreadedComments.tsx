"use client";

// Reddit-style threaded comments for a community post or a forum thread.
// Owns the comment tree, the top-level + inline reply composers, optimistic
// insert, owner-hide removal, and per-comment upvotes. Renders on the dark
// canvas; each comment is a light chip so text stays readable.

import { useMemo, useState } from "react";
import Link from "next/link";
import { CornerDownRight, Send } from "lucide-react";
import { makerWire, postComment } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName, timeAgo } from "@/lib/resources/util";
import { GlassButton } from "@/components/ui/glass";
import type { Comment } from "@/lib/resources/types";
import { UpvoteButton } from "./UpvoteButton";
import { MakerAvatar } from "./MakerAvatar";
import { ReportControl } from "./ReportControl";
import { HideControl } from "./HideControl";

function insertComment(tree: Comment[], c: Comment): Comment[] {
  const node = { ...c, replies: [] };
  if (!c.parentId) return [...tree, node];
  const add = (list: Comment[]): Comment[] =>
    list.map((n) =>
      n.id === c.parentId
        ? { ...n, replies: [...(n.replies ?? []), node] }
        : { ...n, replies: n.replies ? add(n.replies) : n.replies },
    );
  return add(tree);
}

function removeComment(tree: Comment[], id: string): Comment[] {
  return tree
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, replies: n.replies ? removeComment(n.replies, id) : n.replies }));
}

function Composer({
  placeholder,
  onSubmit,
  autoFocus,
}: {
  placeholder: string;
  onSubmit: (text: string) => Promise<boolean>;
  autoFocus?: boolean;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function go() {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    const ok = await onSubmit(t);
    setSending(false);
    if (ok) setText("");
  }

  return (
    <div className="rounded-xl bg-white/70 p-2 ring-1 ring-[#2E5A35]/10">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        autoFocus={autoFocus}
        className="w-full resize-none bg-transparent px-1 py-1 text-sm text-[#1B3722] outline-none placeholder:text-[#1B3722]/40"
      />
      <div className="mt-1 flex justify-end">
        <GlassButton onClick={go} disabled={!text.trim() || sending} className="h-8 gap-1 px-3 text-xs">
          <Send className="size-3.5" /> {sending ? "Posting..." : "Post"}
        </GlassButton>
      </div>
    </div>
  );
}

function CommentNode({
  node,
  depth,
  voted,
  targetType,
  submit,
  onHidden,
}: {
  node: Comment;
  depth: number;
  voted: Set<string>;
  targetType: "post" | "thread";
  submit: (parentId: string | null, text: string) => Promise<boolean>;
  onHidden: (id: string) => void;
}) {
  const { account } = useResources();
  const [replyOpen, setReplyOpen] = useState(false);
  const replies = node.replies ?? [];

  return (
    <div className="text-sm">
      <div className="rounded-xl bg-white/70 px-3 py-2 ring-1 ring-[#2E5A35]/10">
        <div className="flex items-center gap-2">
          <MakerAvatar name={node.creatorName} photo={node.photo} px={24} />
          <Link href={`/resources/creator/${node.handle}`} className="font-semibold text-[#1B3722] hover:underline">
            {capName(node.creatorName)}
          </Link>
          <span className="text-xs text-[#1B3722]/45">{timeAgo(node.createdAt)}</span>
        </div>
        <p className="mt-1.5 break-words whitespace-pre-wrap text-[#1B3722]/85">{node.body}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <UpvoteButton targetType="comment" targetId={node.id} count={node.upvotes} voted={voted.has(node.id)} />
          {account && (
            <GlassButton onClick={() => setReplyOpen((v) => !v)} className="h-7 gap-1 px-2.5 text-xs">
              <CornerDownRight className="size-3.5" /> Reply
            </GlassButton>
          )}
          <ReportControl targetType="comment" targetId={node.id} />
          <HideControl targetType="comment" targetId={node.id} ownerId={node.makerId} onHidden={() => onHidden(node.id)} />
        </div>
        {replyOpen && (
          <div className="mt-2">
            <Composer
              autoFocus
              placeholder={`Reply to ${capName(node.creatorName)}...`}
              onSubmit={async (t) => {
                const ok = await submit(node.id, t);
                if (ok) setReplyOpen(false);
                return ok;
              }}
            />
          </div>
        )}
      </div>

      {replies.length > 0 &&
        (depth < 5 ? (
          <div className="mt-3 space-y-3 border-l border-[#2E5A35]/15 pl-3 sm:pl-4">
            {replies.map((r) => (
              <CommentNode key={r.id} node={r} depth={depth + 1} voted={voted} targetType={targetType} submit={submit} onHidden={onHidden} />
            ))}
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {replies.map((r) => (
              <CommentNode key={r.id} node={r} depth={depth} voted={voted} targetType={targetType} submit={submit} onHidden={onHidden} />
            ))}
          </div>
        ))}
    </div>
  );
}

export function ThreadedComments({
  targetType,
  targetId,
  initialComments,
  votedIds = [],
}: {
  targetType: "post" | "thread";
  targetId: string;
  initialComments: Comment[];
  votedIds?: string[];
}) {
  const { account } = useResources();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const voted = useMemo(() => new Set(votedIds), [votedIds]);

  async function submit(parentId: string | null, text: string): Promise<boolean> {
    if (!account) return false;
    const res = await postComment(makerWire(account), targetType, targetId, text, parentId ?? undefined);
    if (res.comment) {
      const c = { ...res.comment, photo: res.comment.photo ?? account.photo };
      setComments((prev) => insertComment(prev, c));
      return true;
    }
    return false;
  }

  function onHidden(id: string) {
    setComments((prev) => removeComment(prev, id));
  }

  return (
    <div>
      {account ? (
        <Composer placeholder="Share a comment, or ask the maker something..." onSubmit={(t) => submit(null, t)} />
      ) : (
        <p className="rounded-xl bg-white/60 px-3 py-2 text-sm text-[#1B3722]/70 ring-1 ring-[#2E5A35]/10">
          Add your name (top right) to join the conversation.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {comments.length === 0 ? (
          <p className="text-sprout-cream/55 text-sm">No comments yet. Start the conversation.</p>
        ) : (
          comments.map((c) => (
            <CommentNode key={c.id} node={c} depth={0} voted={voted} targetType={targetType} submit={submit} onHidden={onHidden} />
          ))
        )}
      </div>
    </div>
  );
}
