// Sprout Slides — the slideshow engine.
//
// Same architecture as the worksheet engine (lib/resources/generate.ts):
// Venice builds the real deck; a deterministic path takes over when Venice is
// unavailable. The fallback is HONEST — if the topic matches a curated theme
// it builds a small deck from the theme's real facts; otherwise it returns a
// friendly try-again slide (never invented filler dressed up as teaching).
//
// A deck is a list of typed SLIDES the parent presents full-screen or prints
// (one slide per landscape page). Illustrations come from the same pre-built
// static set worksheets use — free, instant, never blocking on image gen.

import { ILLUSTRATION_HINT, ILLUSTRATION_KEYS } from "./illustrations";
import { detectTheme } from "./intent";

export type SlideKind = "title" | "content" | "fact" | "recap";

export interface Slide {
  kind: SlideKind;
  title: string;
  points?: string[]; // content: 2-4 short teaching points · recap: talk-about-it questions
  fact?: string; // fact slides: one real did-you-know
  imageKey?: string; // from the pre-built illustration set
}

export interface Slideshow {
  title: string;
  subtitle: string;
  slides: Slide[];
  meta: { topic: string; age: number };
}

// ── Prompt ────────────────────────────────────────────────────────────

function benchNote(age: number): string {
  if (age <= 5) return "very short sentences, everyday words, one idea per point";
  if (age <= 7) return "short simple sentences, familiar words, concrete ideas";
  if (age <= 9) return "clear sentences, introduce one or two new words and explain them";
  if (age <= 11) return "confident sentences, real terminology with quick plain explanations";
  return "meatier content, real terminology, cause-and-effect reasoning";
}

function systemPrompt(age: number): string {
  return [
    "You write short, warm, factually accurate teaching slideshows for children, presented by a parent at home.",
    `The child is ${age}. Style: ${benchNote(age)}. No em dashes. No exclamation marks. Never invent facts.`,
    "Return STRICT JSON only (no prose, no code fences) with this exact shape:",
    `{"title": string, "subtitle": string, "slides": [`,
    `  {"kind":"title","title":string,"imageKey":string},`,
    `  {"kind":"content","title":string,"points":[2-4 short strings],"imageKey":string},`,
    `  {"kind":"fact","title":string,"fact":string,"imageKey":string},`,
    `  {"kind":"recap","title":string,"points":[3 talk-about-it questions]}`,
    `]}`,
    "Build 7 to 9 slides: one title slide, 4-6 content slides that actually teach in a sensible order, 1-2 fact slides with a real surprising fact, and one recap slide with three questions a parent can ask out loud.",
    `Every imageKey MUST be chosen from this list (pick the closest; omit the field if nothing fits): ${ILLUSTRATION_HINT}`,
  ].join("\n");
}

// ── Normalize (tolerant parse + honest validation) ────────────────────

function stripDashes(s: string): string {
  return s.replace(/\s*[—–]\s*/g, ", ").trim();
}

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function normalizeSlides(parsed: unknown, topic: string, age: number): Slideshow | null {
  const o = parsed as { title?: unknown; subtitle?: unknown; slides?: unknown };
  if (!o || !Array.isArray(o.slides)) return null;
  const kinds: SlideKind[] = ["title", "content", "fact", "recap"];
  const slides: Slide[] = [];
  for (const raw of o.slides.slice(0, 12)) {
    const s = raw as { kind?: unknown; title?: unknown; points?: unknown; fact?: unknown; imageKey?: unknown };
    const kind = kinds.includes(s.kind as SlideKind) ? (s.kind as SlideKind) : null;
    const title = typeof s.title === "string" ? stripDashes(s.title).slice(0, 90) : "";
    if (!kind || !title) continue;
    const points = Array.isArray(s.points)
      ? s.points.filter((p): p is string => typeof p === "string").map((p) => stripDashes(p).slice(0, 180)).slice(0, 4)
      : undefined;
    const fact = typeof s.fact === "string" ? stripDashes(s.fact).slice(0, 240) : undefined;
    const imageKey = typeof s.imageKey === "string" && ILLUSTRATION_KEYS.has(s.imageKey.trim().toLowerCase()) ? s.imageKey.trim().toLowerCase() : undefined;
    if (kind === "content" && (!points || points.length < 2)) continue;
    if (kind === "fact" && !fact) continue;
    if (kind === "recap" && (!points || points.length < 2)) continue;
    slides.push({ kind, title, points, fact, imageKey });
  }
  // A deck that lost its teaching core is a failed generation, not a deck.
  if (slides.filter((s) => s.kind === "content").length < 3) return null;
  if (!slides.some((s) => s.kind === "title")) {
    slides.unshift({ kind: "title", title: typeof o.title === "string" ? stripDashes(o.title) : topic, imageKey: slides.find((s) => s.imageKey)?.imageKey });
  }
  return {
    title: typeof o.title === "string" && o.title.trim() ? stripDashes(o.title).slice(0, 90) : topic,
    subtitle: typeof o.subtitle === "string" ? stripDashes(o.subtitle).slice(0, 120) : `A slideshow for age ${age}`,
    slides: slides.slice(0, 10),
    meta: { topic, age },
  };
}

// ── Venice ────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function aiSlideshow(topic: string, age: number, key: string): Promise<Slideshow | null> {
  const base = process.env.VENICE_BASE_URL || "https://api.venice.ai/api/v1";
  const model = process.env.VENICE_MODEL || "qwen3-235b-a22b-instruct-2507";
  const reqBody = JSON.stringify({
    model,
    messages: [
      { role: "system", content: systemPrompt(age) },
      { role: "user", content: `Make a slideshow about: ${topic}` },
    ],
    temperature: 0.55,
    max_tokens: 3600,
    venice_parameters: { include_venice_system_prompt: false },
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: reqBody,
      });
      if (!res.ok) {
        if (attempt === 0 && (res.status === 429 || res.status >= 500)) {
          await sleep(1800);
          continue;
        }
        return null;
      }
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = data?.choices?.[0]?.message?.content;
      const deck = text ? normalizeSlides(extractJson(text), topic, age) : null;
      if (!deck) {
        if (attempt === 0) {
          await sleep(700);
          continue;
        }
        return null;
      }
      return deck;
    } catch {
      if (attempt === 0) {
        await sleep(1800);
        continue;
      }
      return null;
    }
  }
  return null;
}

// ── Deterministic fallback (honest) ───────────────────────────────────

export function fallbackSlideshow(topic: string, age: number): { deck: Slideshow; real: boolean } {
  const theme = detectTheme(topic);
  // "everyday" is detectTheme's catch-all, not a real match — a deck built
  // from it for an arbitrary topic would be filler wearing a lesson's clothes.
  if (theme && theme.key !== "everyday" && theme.facts.length >= 3) {
    // Real curated facts -> a small real deck.
    const slides: Slide[] = [
      { kind: "title", title: theme.label, imageKey: theme.image && ILLUSTRATION_KEYS.has(theme.image) ? theme.image : undefined },
      {
        kind: "content",
        title: `Meet ${theme.label.toLowerCase()}`,
        points: theme.nouns.slice(0, 4).map((n) => `Look out for ${n}.`),
        imageKey: theme.image && ILLUSTRATION_KEYS.has(theme.image) ? theme.image : undefined,
      },
      ...theme.facts.slice(0, 3).map((f): Slide => ({ kind: "fact", title: "Did you know?", fact: f })),
      {
        kind: "recap",
        title: "Talk about it",
        points: [
          `What surprised you most about ${theme.label.toLowerCase()}?`,
          "Which fact would you tell a friend?",
          "What do you want to find out next?",
        ],
      },
    ];
    return { deck: { title: theme.label, subtitle: `A mini slideshow for age ${age}`, slides, meta: { topic, age } }, real: true };
  }
  // No curated material -> say so honestly, never fake a lesson.
  return {
    real: false,
    deck: {
      title: "Let's try that again",
      subtitle: "Sprout could not reach the builder just now",
      slides: [
        {
          kind: "content",
          title: "Give it another go",
          points: ["The slideshow builder is catching its breath.", "Hit Generate again in a few seconds.", "Your topic is still in the box."],
        },
      ],
      meta: { topic, age },
    },
  };
}
