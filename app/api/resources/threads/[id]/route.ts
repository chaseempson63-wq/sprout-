// GET /api/resources/threads/[id] → one forum thread + its comment tree.

import {
  collectCommentIds,
  commentsFor,
  isUuid,
  mapThread,
  serverSupabase,
  socialEnabled,
  votedSet,
  type ThreadRow,
} from "@/lib/resources/social-server";

export const runtime = "nodejs";

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!(await socialEnabled())) return Response.json({ thread: null, comments: [], votedIds: [], disabled: true });
  if (!isUuid(id)) return Response.json({ thread: null, comments: [], votedIds: [], disabled: false });

  const { data, error } = await serverSupabase()
    .from("resource_threads")
    .select("*")
    .eq("id", id)
    .eq("hidden", false)
    .maybeSingle();
  if (error || !data) return Response.json({ thread: null, comments: [], votedIds: [], disabled: false });

  const me = new URL(request.url).searchParams.get("me");
  const comments = await commentsFor("thread", id);
  const votedIds = await votedSet(me, { type: "thread", id }, collectCommentIds(comments));
  return Response.json({ thread: mapThread(data as ThreadRow), comments, votedIds, disabled: false });
}
