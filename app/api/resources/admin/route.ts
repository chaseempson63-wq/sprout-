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
import type { VoteTarget } from "@/lib/resources/types";

export const runtime = "nodejs";

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

  return Response.json({ error: "Unknown action" }, { status: 400 });
}
