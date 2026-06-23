// POST /api/resources/vote → idempotent upvote toggle.
// Body: { maker, targetType: "post"|"thread"|"comment", targetId }
// Returns { voted, upvotes } (the count is maintained by a DB trigger).

import {
  clientKey,
  isUuid,
  rateLimit,
  serverSupabase,
  socialEnabled,
  upsertMaker,
} from "@/lib/resources/social-server";
import type { MakerRef, VoteTarget } from "@/lib/resources/types";

export const runtime = "nodejs";

const TABLES: Record<VoteTarget, string> = {
  post: "resource_posts",
  thread: "resource_threads",
  comment: "resource_comments",
};

export async function POST(request: Request) {
  if (!(await socialEnabled())) return Response.json({ voted: false, upvotes: 0, disabled: true });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = (body ?? {}) as { maker?: MakerRef; targetType?: string; targetId?: string };
  const maker = o.maker;
  const targetType = (["post", "thread", "comment"] as const).find((t) => t === o.targetType);
  if (!targetType || !isUuid(o.targetId ?? "")) return Response.json({ error: "Bad target." }, { status: 400 });

  if (!rateLimit("vote:" + clientKey(request, maker?.id), 40)) {
    return Response.json({ error: "Slow down a moment." }, { status: 429 });
  }
  if (!(await upsertMaker(maker))) return Response.json({ error: "Add your name first." }, { status: 400 });

  const sb = serverSupabase();
  const targetId = o.targetId!;
  const makerId = maker!.id;

  // Toggle: try to insert a vote; a unique-violation means it already exists → remove it.
  const ins = await sb
    .from("resource_votes")
    .insert({ target_type: targetType, target_id: targetId, maker_id: makerId })
    .select("id")
    .single();

  let voted: boolean;
  if (ins.error) {
    if (ins.error.code === "23505") {
      await sb
        .from("resource_votes")
        .delete()
        .eq("target_type", targetType)
        .eq("target_id", targetId)
        .eq("maker_id", makerId);
      voted = false;
    } else {
      return Response.json({ error: "Could not vote." }, { status: 500 });
    }
  } else {
    voted = true;
  }

  const { data } = await sb.from(TABLES[targetType]).select("upvotes").eq("id", targetId).maybeSingle();
  return Response.json({ voted, upvotes: (data as { upvotes: number } | null)?.upvotes ?? 0 });
}
