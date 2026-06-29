// POST /api/resources/admin → moderation, token-protected via x-admin-token.
//
// Actions:
//   { action: "kill", enabled: boolean }                 → flip the global kill switch
//   { action: "hide", targetType, targetId, hidden? }    → hide/unhide anyone's content
//   { action: "resolveReport", id }                      → mark a report resolved
//
// Unlike the other routes this does NOT gate on socialEnabled (it must work
// while the kill switch is OFF, to turn it back on). It requires the env vars.

import { adminOk, isUuid, serverSupabase, socialConfigured } from "@/lib/resources/social-server";
import { SEED_MAKERS, buildPosts, buildThreads, uid, SEED_VERSION } from "@/lib/resources/seed-data";
import type { VoteTarget } from "@/lib/resources/types";

export const runtime = "nodejs";

// daysAgo offset → ISO timestamp (clamped just before now for fresh rows).
const at = (daysAgo: number): string =>
  new Date(Date.now() - Math.max(60_000, daysAgo * 86_400_000)).toISOString();

const TABLES: Record<VoteTarget, string> = {
  post: "resource_posts",
  thread: "resource_threads",
  comment: "resource_comments",
};

export async function POST(request: Request) {
  if (!adminOk(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!socialConfigured()) return Response.json({ error: "Social backend not configured." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = (body ?? {}) as {
    action?: string;
    enabled?: boolean;
    targetType?: string;
    targetId?: string;
    hidden?: boolean;
    id?: string;
  };
  const sb = serverSupabase();

  if (o.action === "kill") {
    const { error } = await sb
      .from("resource_settings")
      .update({ social_enabled: o.enabled !== false, updated_at: new Date().toISOString() })
      .eq("id", 1);
    return Response.json({ ok: !error, socialEnabled: o.enabled !== false });
  }

  if (o.action === "hide") {
    const targetType = (["post", "thread", "comment"] as const).find((t) => t === o.targetType);
    if (!targetType || !isUuid(o.targetId ?? "")) return Response.json({ ok: false }, { status: 400 });
    const { error } = await sb.from(TABLES[targetType]).update({ hidden: o.hidden !== false }).eq("id", o.targetId!);
    return Response.json({ ok: !error });
  }

  if (o.action === "resolveReport") {
    if (!isUuid(o.id ?? "")) return Response.json({ ok: false }, { status: 400 });
    const { error } = await sb.from("resource_reports").update({ resolved: true }).eq("id", o.id!);
    return Response.json({ ok: !error });
  }

  // One-time curated seed of the community + forum so it reads as a lived-in
  // space. Idempotent: deterministic ids + ignoreDuplicates, so re-running
  // only inserts what's missing. Inserts parents before children (FK order),
  // and lets the comment-count trigger maintain counts.
  if (o.action === "seed") {
    const ins = async (
      table: string,
      rows: Record<string, unknown>[],
    ): Promise<{ inserted: number; error: string | null }> => {
      if (rows.length === 0) return { inserted: 0, error: null };
      const { data, error } = await sb
        .from(table)
        .upsert(rows, { onConflict: "id", ignoreDuplicates: true })
        .select("id");
      return { inserted: data?.length ?? 0, error: error?.message ?? null };
    };

    const makerRows = SEED_MAKERS.map((m) => ({
      id: uid(`maker:${m.slug}`),
      handle: m.handle,
      display_name: m.name,
      bio: m.bio,
    }));
    const posts = buildPosts().map((p) => ({
      id: p.id, maker_id: p.maker_id, handle: p.handle, creator_name: p.creator_name,
      title: p.title, subtitle: p.subtitle, template_id: p.template_id, topic: p.topic,
      worksheet: p.worksheet, upvotes: p.upvotes, created_at: at(p.daysAgo),
    }));
    const { threads, topComments, replies } = buildThreads();
    const threadRows = threads.map((t) => ({
      id: t.id, maker_id: t.maker_id, handle: t.handle, creator_name: t.creator_name,
      title: t.title, body: t.body, upvotes: t.upvotes, created_at: at(t.daysAgo),
    }));
    const commentRow = (c: typeof topComments[number]) => ({
      id: c.id, target_type: "thread", target_id: c.target_id, parent_id: c.parent_id,
      maker_id: c.maker_id, handle: c.handle, creator_name: c.creator_name,
      body: c.body, upvotes: c.upvotes, created_at: at(c.daysAgo),
    });

    // Makers first (FK target), then posts + threads, then comments (parents
    // before replies). Stop and report on the first hard error.
    const steps: [string, () => Promise<{ inserted: number; error: string | null }>][] = [
      ["makers", () => ins("resource_makers", makerRows)],
      ["posts", () => ins("resource_posts", posts)],
      ["threads", () => ins("resource_threads", threadRows)],
      ["comments", () => ins("resource_comments", topComments.map(commentRow))],
      ["replies", () => ins("resource_comments", replies.map(commentRow))],
    ];
    const result: Record<string, number> = {};
    for (const [name, run] of steps) {
      const { inserted, error } = await run();
      if (error) return Response.json({ ok: false, step: name, error, result }, { status: 500 });
      result[name] = inserted;
    }
    return Response.json({ ok: true, version: SEED_VERSION, inserted: result });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
