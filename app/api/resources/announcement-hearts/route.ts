// Hearts on Sprout Team announcements — a light reaction so the team can see
// how many people are reading each update.
//   GET  ?maker=<id> → { counts: {id:n}, mine: string[], disabled }
//   POST { maker, announcementId } → { hearted, count, disabled } (toggle)
// Backed by the resource_announcement_hearts table (see supabase/
// announcement-hearts.sql). Degrades to disabled if the table/social is off.

import { ANNOUNCEMENTS } from "@/lib/resources/announcements";
import { clientKey, rateLimit, serverSupabase, socialEnabled, upsertMaker } from "@/lib/resources/social-server";
import type { MakerRef } from "@/lib/resources/types";

export const runtime = "nodejs";

const TABLE = "resource_announcement_hearts";
const IDS = new Set(ANNOUNCEMENTS.map((a) => a.id));

export async function GET(request: Request) {
  if (!(await socialEnabled())) return Response.json({ counts: {}, mine: [], disabled: true });
  const makerId = new URL(request.url).searchParams.get("maker") ?? "";

  const sb = serverSupabase();
  const { data, error } = await sb.from(TABLE).select("announcement_id, maker_id");
  if (error) return Response.json({ counts: {}, mine: [], disabled: true });

  const counts: Record<string, number> = {};
  const mine: string[] = [];
  for (const row of (data ?? []) as { announcement_id: string; maker_id: string }[]) {
    counts[row.announcement_id] = (counts[row.announcement_id] ?? 0) + 1;
    if (makerId && row.maker_id === makerId) mine.push(row.announcement_id);
  }
  return Response.json({ counts, mine, disabled: false });
}

export async function POST(request: Request) {
  if (!(await socialEnabled())) return Response.json({ hearted: false, count: 0, disabled: true });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = (body ?? {}) as { maker?: MakerRef; announcementId?: string };
  const maker = o.maker;
  const announcementId = o.announcementId ?? "";
  if (!IDS.has(announcementId)) return Response.json({ error: "Unknown announcement." }, { status: 400 });

  if (!rateLimit("heart:" + clientKey(request, maker?.id), 40)) {
    return Response.json({ error: "Slow down a moment." }, { status: 429 });
  }
  if (!(await upsertMaker(maker))) return Response.json({ error: "Add your name first." }, { status: 400 });

  const sb = serverSupabase();
  const makerId = maker!.id;

  // Toggle: insert; unique-violation means it exists → remove it.
  const ins = await sb
    .from(TABLE)
    .insert({ announcement_id: announcementId, maker_id: makerId })
    .select("id")
    .single();

  let hearted: boolean;
  if (ins.error) {
    if (ins.error.code === "23505") {
      await sb.from(TABLE).delete().eq("announcement_id", announcementId).eq("maker_id", makerId);
      hearted = false;
    } else {
      return Response.json({ error: "Could not react." }, { status: 500 });
    }
  } else {
    hearted = true;
  }

  const { count } = await sb.from(TABLE).select("id", { count: "exact", head: true }).eq("announcement_id", announcementId);
  return Response.json({ hearted, count: count ?? 0 });
}
