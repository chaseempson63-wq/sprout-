// GET /api/resources/community/[id] → one published post + its comment tree.

import {
  collectCommentIds,
  commentsFor,
  isUuid,
  mapPost,
  serverSupabase,
  socialEnabled,
  votedSet,
  type PostRow,
} from "@/lib/resources/social-server";

export const runtime = "nodejs";

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!(await socialEnabled())) return Response.json({ post: null, comments: [], votedIds: [], disabled: true });
  if (!isUuid(id)) return Response.json({ post: null, comments: [], votedIds: [], disabled: false });

  const { data, error } = await serverSupabase()
    .from("resource_posts")
    .select("*, maker:resource_makers(photo)")
    .eq("id", id)
    .eq("hidden", false)
    .maybeSingle();
  if (error || !data) return Response.json({ post: null, comments: [], votedIds: [], disabled: false });

  const me = new URL(request.url).searchParams.get("me");
  const comments = await commentsFor("post", id);
  const votedIds = await votedSet(me, { type: "post", id }, collectCommentIds(comments));
  return Response.json({ post: mapPost(data as PostRow), comments, votedIds, disabled: false });
}
