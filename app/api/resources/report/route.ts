// POST /api/resources/report → flag a post/thread/comment for review.
// Low-friction: no name gate. Writes a row to resource_reports (a moderation
// queue read directly in Supabase). Body: { maker?, targetType, targetId, reason? }

import {
  cleanClamp,
  clientKey,
  isUuid,
  rateLimit,
  serverSupabase,
  socialEnabled,
  upsertMaker,
} from "@/lib/resources/social-server";
import type { MakerRef } from "@/lib/resources/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await socialEnabled())) return Response.json({ ok: false, disabled: true });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = (body ?? {}) as { maker?: MakerRef | null; targetType?: string; targetId?: string; reason?: unknown };
  const targetType = (["post", "thread", "comment"] as const).find((t) => t === o.targetType);
  if (!targetType || !isUuid(o.targetId ?? "")) return Response.json({ ok: false }, { status: 400 });

  if (!rateLimit("report:" + clientKey(request, o.maker?.id), 20)) {
    return Response.json({ error: "Slow down a moment." }, { status: 429 });
  }

  // Attach the reporter only when they have a usable identity (FK requires the
  // maker row to exist), otherwise report anonymously.
  let makerId: string | null = null;
  if (o.maker && isUuid(o.maker.id) && (await upsertMaker(o.maker))) makerId = o.maker.id;

  const { error } = await serverSupabase().from("resource_reports").insert({
    target_type: targetType,
    target_id: o.targetId!,
    maker_id: makerId,
    reason: cleanClamp(o.reason, 500) || null,
  });
  return Response.json({ ok: !error });
}
