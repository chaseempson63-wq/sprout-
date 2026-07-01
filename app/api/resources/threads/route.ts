// GET  /api/resources/threads  → list forum discussion threads
// POST /api/resources/threads  → start a thread, or owner-hide one

import {
  clampText,
  cleanClamp,
  clientKey,
  hideIfOwner,
  isUuid,
  mapThread,
  rateLimit,
  serverSupabase,
  socialEnabled,
  upsertMaker,
  type ThreadRow,
} from "@/lib/resources/social-server";
import type { MakerRef } from "@/lib/resources/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await socialEnabled())) return Response.json({ threads: [], disabled: true });

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  const sort = url.searchParams.get("sort") === "top" ? "top" : "new";

  let query = serverSupabase().from("resource_threads").select("*, maker:resource_makers(photo)").eq("hidden", false).limit(50);
  query =
    sort === "top"
      ? query.order("upvotes", { ascending: false }).order("created_at", { ascending: false })
      : query.order("created_at", { ascending: false });
  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  if (error) return Response.json({ threads: [], disabled: true });
  return Response.json({ threads: ((data ?? []) as ThreadRow[]).map(mapThread), disabled: false });
}

export async function POST(request: Request) {
  if (!(await socialEnabled())) return Response.json({ id: null, disabled: true });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = (body ?? {}) as { op?: string; maker?: MakerRef; title?: unknown; body?: unknown; id?: string };
  const maker = o.maker;

  if (!rateLimit("thread:" + clientKey(request, maker?.id), 10)) {
    return Response.json({ error: "Slow down a moment." }, { status: 429 });
  }

  if (o.op === "hide") {
    if (!maker || !isUuid(maker.id) || !isUuid(o.id ?? "")) return Response.json({ ok: false }, { status: 400 });
    const ok = await hideIfOwner("resource_threads", o.id!, maker.id);
    return Response.json({ ok });
  }

  if (!(await upsertMaker(maker))) return Response.json({ error: "Add your name first." }, { status: 400 });
  const title = cleanClamp(o.title, 140);
  if (!title) return Response.json({ error: "Give your post a title." }, { status: 400 });
  const text = cleanClamp(o.body, 4000);

  const { data, error } = await serverSupabase()
    .from("resource_threads")
    .insert({
      maker_id: maker!.id,
      handle: clampText(maker!.handle, 40) || "maker",
      creator_name: clampText(maker!.displayName, 60),
      title,
      body: text,
    })
    .select("id")
    .single();
  if (error || !data) return Response.json({ error: "Could not post." }, { status: 500 });
  return Response.json({ id: (data as { id: string }).id });
}
