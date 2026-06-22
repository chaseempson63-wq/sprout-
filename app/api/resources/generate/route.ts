// POST /api/resources/generate
// Body: GenerateRequest { templateId, age, messages }.
// Returns { worksheet: Worksheet, source: "ai" | "template" }.
//
// Uses Venice AI when VENICE_API_KEY is set, otherwise the offline template
// builder so the chat still produces a real worksheet with zero setup.

import { getTemplate } from "@/lib/resources/catalog";
import { aiWorksheet, customFallback, dedupeWorksheet, templateWorksheet } from "@/lib/resources/generate";
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

  if (key) {
    const ai = await aiWorksheet(template, age, messages, key, childName);
    if (ai) return Response.json({ worksheet: dedupeWorksheet(ai), source: "ai" });
  }

  // Freeform "Build your own" has no deterministic generator; fall back to a
  // friendly retry sheet instead of the template engine.
  const fallback =
    template.id === "custom"
      ? customFallback(age, childName)
      : templateWorksheet(template, age, instruction, childName);
  return Response.json({ worksheet: dedupeWorksheet(fallback), source: "template" });
}
