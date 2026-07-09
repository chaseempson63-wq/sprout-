// POST /api/resources/slides
// Body: { topic: string, age: number }.
// Returns { slideshow: Slideshow, source: "ai" | "template" }.
//
// Venice when VENICE_API_KEY is set; otherwise (or on failure) the honest
// deterministic fallback — a real mini-deck when the topic matches curated
// facts, a friendly try-again slide when it doesn't.

import { aiSlideshow, fallbackSlideshow } from "@/lib/resources/slides";
import { requirePremium } from "@/lib/resources/premium";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Slideshows are a premium feature (access model 2026-07-09). The middleware
  // gates the page; this is the fresh server-side check on the spend itself.
  // Dormant no-op until RESOURCES_AUTH_ENABLED flips on.
  const gate = await requirePremium();
  if (!gate.ok) return Response.json({ error: gate.error }, { status: gate.status });

  const key =
    process.env.VENICE_API_KEY ||
    process.env.VENUS_API_KEY ||
    process.env.VENICE_INFERENCE_KEY ||
    "";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const o = (body ?? {}) as { topic?: unknown; age?: unknown };
  const topic = typeof o.topic === "string" ? o.topic.trim().slice(0, 200) : "";
  if (!topic) return Response.json({ error: "Topic required" }, { status: 400 });
  const ageNum = Number(o.age);
  const age = Number.isFinite(ageNum) ? Math.min(13, Math.max(3, Math.round(ageNum))) : 7;

  if (key) {
    const deck = await aiSlideshow(topic, age, key);
    if (deck) return Response.json({ slideshow: deck, source: "ai" });
  }

  const { deck } = fallbackSlideshow(topic, age);
  return Response.json({ slideshow: deck, source: "template" });
}
