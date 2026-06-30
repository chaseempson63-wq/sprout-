// GET  /api/resources/community  → list published community worksheets
// POST /api/resources/community  → publish a build-your-own sheet, or owner-hide one
//
// All access is server-side via the service-role client. When the social layer
// is off (unconfigured / kill switch) every response degrades to { disabled }.

import { topicForTemplate } from "@/lib/resources/catalog";
import {
  clampText,
  clientKey,
  coerceWorksheet,
  hideIfOwner,
  isUuid,
  mapPost,
  rateLimit,
  serverSupabase,
  socialEnabled,
  upsertMaker,
  type PostRow,
} from "@/lib/resources/social-server";
import type { MakerRef } from "@/lib/resources/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await socialEnabled())) return Response.json({ posts: [], disabled: true });

  const url = new URL(request.url);
  const creator = url.searchParams.get("creator")?.trim();
  const topic = url.searchParams.get("topic")?.trim();
  const q = url.searchParams.get("q")?.trim();
  const mine = url.searchParams.get("mine")?.trim();
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 50));

  let query = serverSupabase()
    .from("resource_posts")
    .select("*, maker:resource_makers(photo,bio)")
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (creator) query = query.eq("handle", creator);
  if (topic) query = query.eq("topic", topic);
  if (mine && isUuid(mine)) query = query.eq("maker_id", mine);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  if (error) return Response.json({ posts: [], disabled: true });
  return Response.json({ posts: ((data ?? []) as PostRow[]).map(mapPost), disabled: false });
}

export async function POST(request: Request) {
  if (!(await socialEnabled())) return Response.json({ id: null, disabled: true });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = (body ?? {}) as { op?: string; maker?: MakerRef; worksheet?: unknown; id?: string };
  const maker = o.maker;

  if (!rateLimit("publish:" + clientKey(request, maker?.id), 10)) {
    return Response.json({ error: "Slow down a moment." }, { status: 429 });
  }

  // Owner hide (unpublish) of their own post.
  if (o.op === "hide") {
    if (!maker || !isUuid(maker.id) || !isUuid(o.id ?? "")) return Response.json({ ok: false }, { status: 400 });
    const ok = await hideIfOwner("resource_posts", o.id!, maker.id);
    return Response.json({ ok });
  }

  if (!(await upsertMaker(maker))) return Response.json({ error: "Add your name first." }, { status: 400 });
  const ws = coerceWorksheet(o.worksheet);
  if (!ws) return Response.json({ error: "Only build-your-own worksheets can be published." }, { status: 400 });

  const { data, error } = await serverSupabase()
    .from("resource_posts")
    .insert({
      maker_id: maker!.id,
      handle: clampText(maker!.handle, 40) || "maker",
      creator_name: clampText(maker!.displayName, 60),
      title: clampText(ws.title, 120) || "Untitled worksheet",
      subtitle: clampText(ws.subtitle, 200),
      template_id: "custom",
      topic: topicForTemplate(ws.meta.templateId),
      worksheet: ws,
    })
    .select("id")
    .single();
  if (error || !data) return Response.json({ error: "Could not publish." }, { status: 500 });
  return Response.json({ id: (data as { id: string }).id });
}
