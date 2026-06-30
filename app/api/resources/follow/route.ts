// GET  /api/resources/follow?handle=X[&follower=ID] → { count, following }
// POST /api/resources/follow  { maker, targetHandle }  → { following, count }
//
// Follows are server-side and aggregate across all users (so a creator's
// follower count is real and seeded creators look established). All access is
// service-role; when the social layer is off every response degrades safely.

import {
  clampText,
  clientKey,
  isUuid,
  rateLimit,
  serverSupabase,
  socialEnabled,
  upsertMaker,
} from "@/lib/resources/social-server";
import type { MakerRef } from "@/lib/resources/types";

export const runtime = "nodejs";

async function followerCount(handle: string): Promise<number> {
  const { count } = await serverSupabase()
    .from("resource_follows")
    .select("id", { count: "exact", head: true })
    .eq("target_handle", handle);
  return count ?? 0;
}

export async function GET(request: Request) {
  if (!(await socialEnabled())) return Response.json({ count: 0, following: false, disabled: true });

  const url = new URL(request.url);
  const handle = clampText(url.searchParams.get("handle"), 40);
  const follower = url.searchParams.get("follower") ?? "";
  if (!handle) return Response.json({ count: 0, following: false });

  const count = await followerCount(handle);

  let following = false;
  if (isUuid(follower)) {
    const { data } = await serverSupabase()
      .from("resource_follows")
      .select("id")
      .eq("follower_id", follower)
      .eq("target_handle", handle)
      .maybeSingle();
    following = !!data;
  }
  return Response.json({ count, following });
}

export async function POST(request: Request) {
  if (!(await socialEnabled())) return Response.json({ following: false, count: 0, disabled: true });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const o = (body ?? {}) as { maker?: MakerRef; targetHandle?: string };
  const maker = o.maker;
  const targetHandle = clampText(o.targetHandle, 40);
  if (!targetHandle) return Response.json({ error: "Bad target." }, { status: 400 });
  // Don't let a maker follow their own handle.
  if (maker?.handle && maker.handle === targetHandle) {
    return Response.json({ following: false, count: await followerCount(targetHandle) });
  }

  if (!rateLimit("follow:" + clientKey(request, maker?.id), 40)) {
    return Response.json({ error: "Slow down a moment." }, { status: 429 });
  }
  if (!(await upsertMaker(maker))) return Response.json({ error: "Add your name first." }, { status: 400 });

  const sb = serverSupabase();
  const followerId = maker!.id;

  // Toggle: insert; a unique-violation (23505) means it already exists → remove.
  const ins = await sb
    .from("resource_follows")
    .insert({ follower_id: followerId, target_handle: targetHandle })
    .select("id")
    .single();

  let following: boolean;
  if (ins.error) {
    if (ins.error.code === "23505") {
      await sb.from("resource_follows").delete().eq("follower_id", followerId).eq("target_handle", targetHandle);
      following = false;
    } else {
      return Response.json({ error: "Could not follow." }, { status: 500 });
    }
  } else {
    following = true;
  }

  return Response.json({ following, count: await followerCount(targetHandle) });
}
