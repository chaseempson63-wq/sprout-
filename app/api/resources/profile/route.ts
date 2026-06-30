// POST /api/resources/profile  { maker }  → upsert the public maker row.
// Lets a creator's name / photo / bio reach the shared profile immediately
// (otherwise the maker only updates on the next publish/comment/vote/follow).

import { rateLimit, clientKey, socialEnabled, upsertMaker } from "@/lib/resources/social-server";
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
  const maker = (body as { maker?: MakerRef })?.maker;
  if (!rateLimit("profile:" + clientKey(request, maker?.id), 20)) {
    return Response.json({ error: "Slow down a moment." }, { status: 429 });
  }
  const ok = await upsertMaker(maker);
  return Response.json({ ok });
}
