// POST /api/resources/generate
// Body: GenerateInput. Returns { resource: GeneratedResource, source: "ai" | "template" }.
//
// Tries Venice AI when VENICE_API_KEY is set, otherwise falls back to the
// deterministic template generator so the product works with zero setup.

import { aiResource, templateResource } from "@/lib/resources/generate";
import type { Difficulty, GenerateInput, ResourceType } from "@/lib/resources/types";

export const runtime = "nodejs";

const TYPES: ResourceType[] = [
  "math",
  "reading",
  "writing",
  "science",
  "unit-study",
  "lesson-plan",
  "project",
];
const DIFFICULTIES: Difficulty[] = ["easier", "on-level", "challenge"];

function clean(input: unknown): GenerateInput | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  const type = TYPES.includes(o.type as ResourceType) ? (o.type as ResourceType) : null;
  if (!type) return null;
  const difficulty = DIFFICULTIES.includes(o.difficulty as Difficulty)
    ? (o.difficulty as Difficulty)
    : "on-level";
  const ageNum = Number(o.age);
  const age = Number.isFinite(ageNum) ? Math.min(18, Math.max(3, Math.round(ageNum))) : 8;
  const interests = Array.isArray(o.interests)
    ? o.interests.filter((i): i is string => typeof i === "string").map((i) => i.trim()).filter(Boolean)
    : [];
  const str = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 200) : "");
  return {
    type,
    childName: str(o.childName),
    age,
    level: str(o.level),
    subject: str(o.subject),
    topic: str(o.topic),
    interests: interests.slice(0, 8),
    difficulty,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = clean(body);
  if (!input) return Response.json({ error: "Invalid input" }, { status: 400 });

  const key = process.env.VENICE_API_KEY;
  if (key) {
    const ai = await aiResource(input, key);
    if (ai) return Response.json({ resource: ai, source: "ai" });
  }

  return Response.json({ resource: templateResource(input), source: "template" });
}
