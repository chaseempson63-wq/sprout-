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
import { SEED_MAKERS, POST_SPECS, buildThreads, postMeta, seedMakerIds, uid, SEED_VERSION } from "@/lib/resources/seed-data";
import { getTemplate, topicForTemplate } from "@/lib/resources/catalog";
import { aiWorksheet, dedupeWorksheet, templateWorksheet } from "@/lib/resources/generate";
import { hasIllustration } from "@/lib/resources/illustrations";
import type { ChatMessage, VoteTarget, Worksheet } from "@/lib/resources/types";

export const runtime = "nodejs";
// Generating worksheets through Venice is slow (~25s each); allow long batches.
export const maxDuration = 300;

const veniceKey = (): string =>
  process.env.VENICE_API_KEY || process.env.VENUS_API_KEY || process.env.VENICE_INFERENCE_KEY || "";

// daysAgo offset → ISO timestamp (clamped just before now for fresh rows).
const at = (daysAgo: number): string =>
  new Date(Date.now() - Math.max(60_000, daysAgo * 86_400_000)).toISOString();

// True if the worksheet already carries a real, renderable illustration.
const hasRealImage = (ws: Worksheet): boolean =>
  ws.blocks.some((b) => b.kind === "image" && (hasIllustration(b.imageKey) || !!b.dataUrl));

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
    offset?: number;
    limit?: number;
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

  // Rebuild the community POSTS by generating each through the REAL engine
  // (aiWorksheet / Venice) so they are indistinguishable from a sheet a user
  // builds, with the themed illustration forced on. Batched: pass offset+limit
  // and loop until done (each Venice call is ~25s; a single request can't do
  // all of them inside the function timeout).
  if (o.action === "reseed") {
    const total = POST_SPECS.length;
    const offset = Math.max(0, Math.min(total, Math.floor(Number(o.offset) || 0)));
    const limit = Math.max(1, Math.min(8, Math.floor(Number(o.limit) || 4)));
    const key = veniceKey();

    // First batch clears every prior seed post (incl. the old thin ones) so we
    // replace rather than accumulate. Keyed on the seed makers only.
    if (offset === 0) {
      const { error } = await sb.from("resource_posts").delete().in("maker_id", seedMakerIds());
      if (error) return Response.json({ ok: false, step: "clear", error: error.message }, { status: 500 });
    }

    const slice = POST_SPECS.slice(offset, offset + limit);
    const src = { ai: 0, template: 0 };
    const failed: string[] = [];

    for (const spec of slice) {
      const template = getTemplate(spec.templateId);
      if (!template) { failed.push(`${spec.slug}:unknown-template`); continue; }
      const messages: ChatMessage[] = [{ role: "user", content: spec.instruction }];

      let ws: Worksheet | null = key ? await aiWorksheet(template, spec.age, messages, key) : null;
      if (ws) src.ai++;
      else { ws = templateWorksheet(template, spec.age, spec.instruction); src.template++; }
      ws = dedupeWorksheet(ws);
      ws.meta = { ...ws.meta, theme: spec.theme };

      // Force the themed picture on if the sheet has no real illustration, so a
      // dinosaur sheet always shows a dinosaur (the model often omits images on
      // pure-practice sheets).
      if (!hasRealImage(ws) && hasIllustration(spec.imageKey)) {
        const idx = ws.blocks.length > 1 ? 1 : 0;
        ws.blocks.splice(idx, 0, { kind: "image", imageKey: spec.imageKey, notes: spec.notes });
      }

      const meta = postMeta(spec);
      const { error } = await sb.from("resource_posts").upsert(
        {
          id: meta.id, maker_id: meta.maker_id, handle: meta.handle, creator_name: meta.creator_name,
          title: ws.title, subtitle: ws.subtitle || `Age ${spec.age} · ${spec.theme}`,
          template_id: spec.templateId, topic: topicForTemplate(spec.templateId),
          worksheet: ws, upvotes: meta.upvotes, created_at: at(meta.daysAgo),
        },
        { onConflict: "id" },
      );
      if (error) failed.push(`${spec.slug}:${error.message}`);
    }

    const next = offset + slice.length;
    return Response.json({
      ok: true, version: SEED_VERSION, total,
      processed: next, next: next >= total ? null : next, done: next >= total,
      source: src, failed, veniceConfigured: !!key,
    });
  }

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
