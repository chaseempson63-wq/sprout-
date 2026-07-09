// POST /api/resources/generate
// Body: GenerateRequest { templateId, age, messages }.
// Returns { worksheet: Worksheet, source: "ai" | "template" }.
//
// Uses Venice AI when VENICE_API_KEY is set, otherwise the offline template
// builder so the chat still produces a real worksheet with zero setup.

import { getTemplate } from "@/lib/resources/catalog";
import { aiWorksheet, customFallback, dedupeWorksheet, templateWorksheet } from "@/lib/resources/generate";
import { requirePremium } from "@/lib/resources/premium";
import type { ChatMessage, GenerateRequest } from "@/lib/resources/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  const o = (body ?? {}) as Partial<GenerateRequest>;
  const template = typeof o.templateId === "string" ? getTemplate(o.templateId) : undefined;
  if (!template) return Response.json({ error: "Unknown template" }, { status: 400 });

  const ageNum = Number(o.age);
  const age = Number.isFinite(ageNum) ? Math.min(13, Math.max(3, Math.round(ageNum))) : 7;
  const childName = typeof o.childName === "string" ? o.childName.trim().slice(0, 40) : undefined;

  const messages: ChatMessage[] = Array.isArray(o.messages)
    ? o.messages
        .filter(
          (m): m is ChatMessage =>
            !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
        )
        .slice(-12)
    : [];

  const instruction = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ");

  // Freeform "Build your own" is the ONLY path that needs open-ended AI
  // generation, so it's the only one that calls Venice (with an honest retry
  // sheet when the key is missing or the call fails).
  if (template.id === "custom") {
    // Build-your-own is the only PREMIUM path in this route (template generation
    // stays free-tier), so the fresh entitlement check — the Venice-spend gate —
    // runs only here. Dormant no-op until RESOURCES_AUTH_ENABLED flips on.
    const gate = await requirePremium();
    if (!gate.ok) return Response.json({ error: gate.error }, { status: gate.status });
    if (key) {
      const ai = await aiWorksheet(template, age, messages, key, childName);
      if (ai) return Response.json({ worksheet: dedupeWorksheet(ai), source: "ai" });
    }
    return Response.json({ worksheet: dedupeWorksheet(customFallback(age, childName)), source: "template" });
  }

  // Fixed templates render INSTANTLY from the deterministic engine — themed,
  // illustrated, and scaled to the age/difficulty. No Venice call, so no ~26s
  // wait, no per-request cost, and the same request always prints the same sheet.
  return Response.json({
    worksheet: dedupeWorksheet(templateWorksheet(template, age, instruction, childName)),
    source: "template",
  });
}
