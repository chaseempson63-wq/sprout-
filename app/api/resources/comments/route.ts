// POST /api/resources/comments → add a threaded comment, or owner-hide one.
// Body: { maker, targetType: "post"|"thread", targetId, parentId?, body }
//   or  { op: "hide", maker, id }

import {
  clampText,
  cleanClamp,
  clientKey,
  hideIfOwner,
  isUuid,
  mapComment,
  rateLimit,
  serverSupabase,
  socialEnabled,
  upsertMaker,
  type CommentRow,
} from "@/lib/resources/social-server";
import type { MakerRef } from "@/lib/resources/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await socialEnabled())) return Response.json({ comment: null, disabled: true });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = (body ?? {}) as {
    op?: string;
    maker?: MakerRef;
    targetType?: string;
    targetId?: string;
    parentId?: string;
    body?: unknown;
    id?: string;
  };
  const maker = o.maker;

  if (!rateLimit("comment:" + clientKey(request, maker?.id), 20)) {
    return Response.json({ error: "Slow down a moment." }, { status: 429 });
  }

  if (o.op === "hide") {
    if (!maker || !isUuid(maker.id) || !isUuid(o.id ?? "")) return Response.json({ ok: false }, { status: 400 });
    const ok = await hideIfOwner("resource_comments", o.id!, maker.id);
    return Response.json({ ok });
  }

  const targetType = o.targetType === "post" || o.targetType === "thread" ? o.targetType : null;
  if (!targetType || !isUuid(o.targetId ?? "")) return Response.json({ error: "Bad target." }, { status: 400 });
  if (!(await upsertMaker(maker))) return Response.json({ error: "Add your name first." }, { status: 400 });

  const text = cleanClamp(o.body, 2000);
  if (!text) return Response.json({ error: "Write something first." }, { status: 400 });

  const sb = serverSupabase();
  const targetTable = targetType === "post" ? "resource_posts" : "resource_threads";

  // Target must exist and be visible.
  const { data: tgt } = await sb.from(targetTable).select("id").eq("id", o.targetId!).eq("hidden", false).maybeSingle();
  if (!tgt) return Response.json({ error: "That post is no longer available." }, { status: 404 });

  // A reply's parent must belong to the same target (no cross-thread grafting).
  let parentId: string | null = null;
  if (o.parentId && isUuid(o.parentId)) {
    const { data: par } = await sb
      .from("resource_comments")
      .select("id")
      .eq("id", o.parentId)
      .eq("target_type", targetType)
      .eq("target_id", o.targetId!)
      .eq("hidden", false)
      .maybeSingle();
    if (!par) return Response.json({ error: "That comment is no longer available." }, { status: 400 });
    parentId = o.parentId;
  }

  const { data, error } = await sb
    .from("resource_comments")
    .insert({
      target_type: targetType,
      target_id: o.targetId!,
      parent_id: parentId,
      maker_id: maker!.id,
      handle: clampText(maker!.handle, 40) || "maker",
      creator_name: clampText(maker!.displayName, 60),
      body: text,
    })
    .select("*")
    .single();
  if (error || !data) return Response.json({ error: "Could not post." }, { status: 500 });
  return Response.json({ comment: mapComment(data as CommentRow) });
}
