// Sprout Resources — worksheet generation (server-side).
//
//   aiWorksheet()        -> Venice AI when VENICE_API_KEY is set. Produces a
//                           themed, kid-facing fill-in worksheet from the chat.
//   templateWorksheet()  -> offline fallback that builds REAL blocks (math
//                           problems, tracing rows, count sets, fill-in-the-blank
//                           with a word bank) so the product works before the key
//                           is wired. It is deterministic and themable but limited.

import { getTemplate } from "./catalog";
import type { ChatMessage, Worksheet, WorksheetBlock, WorksheetTemplate } from "./types";

// ── theme + difficulty parsing (offline path) ───────────────────────────────

const THEMES: Record<string, { emoji: string; nouns: string[] }> = {
  space: { emoji: "🚀", nouns: ["rockets", "planets", "stars", "astronauts", "moons"] },
  dinosaur: { emoji: "🦕", nouns: ["dinosaurs", "eggs", "bones", "ferns", "volcanoes"] },
  ocean: { emoji: "🐠", nouns: ["fish", "shells", "crabs", "waves", "boats"] },
  animal: { emoji: "🐢", nouns: ["animals", "puppies", "kittens", "rabbits", "ducks"] },
  horse: { emoji: "🐴", nouns: ["horses", "ponies", "saddles", "carrots", "foals"] },
  food: { emoji: "🍎", nouns: ["apples", "cookies", "pizzas", "bananas", "cupcakes"] },
  sport: { emoji: "⚽", nouns: ["balls", "goals", "medals", "jerseys", "trophies"] },
  flower: { emoji: "🌸", nouns: ["flowers", "petals", "seeds", "leaves", "gardens"] },
  car: { emoji: "🚗", nouns: ["cars", "wheels", "trucks", "roads", "races"] },
  bug: { emoji: "🐛", nouns: ["bugs", "ants", "bees", "ladybugs", "leaves"] },
};
const DEFAULT_THEME = { emoji: "⭐", nouns: ["stars", "apples", "blocks", "balls", "leaves"] };

function detectTheme(text: string): { key?: string; emoji: string; nouns: string[] } {
  const t = text.toLowerCase();
  for (const key of Object.keys(THEMES)) {
    if (t.includes(key) || t.includes(`${key}s`)) return { key, ...THEMES[key] };
  }
  if (/dino/.test(t)) return { key: "dinosaur", ...THEMES.dinosaur };
  if (/sea|under the sea|fish|shark/.test(t)) return { key: "ocean", ...THEMES.ocean };
  return { emoji: DEFAULT_THEME.emoji, nouns: DEFAULT_THEME.nouns };
}

function detectDifficulty(text: string): number {
  const t = text.toLowerCase();
  if (/harder|tricky|trickier|challeng|advanced|tougher|more difficult/.test(t)) return 1;
  if (/easier|simpler|simple|gentle|beginner|too hard/.test(t)) return -1;
  return 0;
}

function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── offline block builders ───────────────────────────────────────────────────

function mathBlock(age: number, diff: number, op: "add" | "sub" | "mul" | "money", n = 8): WorksheetBlock {
  const items: string[] = [];
  const answers: string[] = [];
  const f = diff === 1 ? 1.8 : diff === -1 ? 0.5 : 1;
  if (op === "mul") {
    const fmax = Math.max(2, Math.round((age <= 7 ? 5 : age <= 9 ? 10 : 12) * f));
    for (let i = 0; i < n; i++) {
      const a = rint(1, Math.min(12, fmax));
      const b = rint(1, Math.min(12, fmax));
      items.push(`${a} × ${b} =`);
      answers.push(`${a * b}`);
    }
  } else if (op === "money") {
    for (let i = 0; i < n; i++) {
      const a = rint(1, Math.round(50 * f));
      const b = rint(1, Math.round(50 * f));
      items.push(`${a}c + ${b}c =`);
      answers.push(`${a + b}c`);
    }
  } else {
    const max = Math.round((age <= 6 ? 10 : age <= 8 ? 20 : age <= 10 ? 50 : 100) * f);
    for (let i = 0; i < n; i++) {
      const a = rint(1, max);
      const b = rint(1, op === "sub" ? a : max);
      items.push(op === "sub" ? `${a} − ${b} =` : `${a} + ${b} =`);
      answers.push(`${op === "sub" ? a - b : a + b}`);
    }
  }
  return { kind: "math", prompt: "Solve each one. Write your answer in the box.", items, answers };
}

function columnMathBlock(age: number, diff: number, op: "add" | "sub" | "mul" | "money", n = 4): WorksheetBlock {
  const items: string[] = [];
  const answers: string[] = [];
  const f = diff === 1 ? 2 : diff === -1 ? 0.6 : 1;
  const max = Math.round((age <= 7 ? 20 : age <= 9 ? 99 : 999) * f);
  for (let i = 0; i < n; i++) {
    const a = rint(10, Math.max(12, max));
    const b = rint(1, op === "sub" ? a : Math.max(12, max));
    items.push(op === "sub" ? `${a} - ${b}` : `${a} + ${b}`);
    answers.push(`${op === "sub" ? a - b : a + b}`);
  }
  return { kind: "column-math", prompt: "Line up the digits and solve.", items, answers };
}

function countBlock(age: number, theme: { emoji: string }): WorksheetBlock {
  const hi = age <= 4 ? 6 : age <= 6 ? 10 : 15;
  const items = [String(rint(2, hi)), String(rint(2, hi)), String(rint(2, hi))];
  return {
    kind: "count",
    prompt: "Count the pictures in each row. Write how many in the box.",
    emoji: theme.emoji,
    items,
    answers: items,
  };
}

function missingNumbersBlock(age: number, diff: number): WorksheetBlock {
  const steps = diff === 1 ? [2, 3, 5, 10] : diff === -1 ? [1, 2] : [1, 2, 5];
  const items: string[] = [];
  const answers: string[] = [];
  for (let r = 0; r < 3; r++) {
    const step = steps[rint(0, steps.length - 1)];
    const start = rint(0, 6) * step;
    const seq: number[] = [];
    for (let i = 0; i < 6; i++) seq.push(start + i * step);
    const blanks = new Set([2, 4]);
    items.push(seq.map((v, i) => (blanks.has(i) ? "____" : String(v))).join(",  "));
    answers.push([...blanks].map((i) => String(seq[i])).join(", "));
  }
  return { kind: "missing-numbers", prompt: "Fill in the missing numbers.", items, answers };
}

function traceBlock(template: WorksheetTemplate, theme: { nouns: string[] }): WorksheetBlock {
  let text: string;
  if (template.id === "number-tracing") text = "0  1  2  3  4  5  6  7  8  9";
  else if (template.id === "spelling") text = theme.nouns.slice(0, 3).join("   ");
  else text = "A a   B b   C c   D d   E e";
  return { kind: "trace", prompt: "Trace each one, then keep going on your own.", text };
}

function fillBlankBlock(theme: { nouns: string[] }): WorksheetBlock {
  const [n1, n2, n3] = theme.nouns;
  const items = [
    `The two ____ played in the sun all day.`,
    `I can see ____ near the big ____.`,
    `My favorite thing is the ____.`,
  ];
  return {
    kind: "fill-blank",
    prompt: "Use the word bank to finish each sentence.",
    items,
    wordBank: [n1, n2, n3],
    answers: [n1, `${n2}, ${n3}`, n1],
  };
}

function shortAnswerMath(age: number, diff: number, theme: { nouns: string[] }): WorksheetBlock {
  const noun = theme.nouns[0];
  const f = diff === 1 ? 2 : diff === -1 ? 0.6 : 1;
  const a = rint(2, Math.round(9 * f));
  const b = rint(2, Math.round(9 * f));
  const items = [
    `There are ${a} bags of ${noun}. Each bag has ${b}. How many ${noun} in total?`,
    `You had ${a * b} ${noun} and gave ${b} away. How many are left?`,
  ];
  return { kind: "short-answer", prompt: "Show your work, then write the answer.", items, rows: 2, answers: [`${a * b}`, `${a * b - b}`] };
}

function passageBlock(age: number, theme: { nouns: string[] }): WorksheetBlock {
  const n = theme.nouns;
  const text =
    age <= 7
      ? `Milo the ${n[0].replace(/s$/, "")} woke up early. The sun was warm. Milo went to find ${n[1]}. ` +
        `On the way, Milo saw ${n[2]} and waved hello. It was a happy day.`
      : `Every morning, Milo set off to explore. Today Milo wanted to find ${n[1]} near the old ${n[3] || "hill"}. ` +
        `Along the path were ${n[2]}, shining in the light. Milo counted them, smiled, and kept going, ` +
        `sure that the best part of the day was still ahead.`;
  return { kind: "passage", prompt: "Read the story, then answer the questions.", text };
}

function comprehensionQs(): WorksheetBlock {
  return {
    kind: "short-answer",
    prompt: "Answer in a full sentence.",
    items: ["Who is the story about?", "What did they go to find?", "How do you think they felt? Why?"],
    rows: 2,
  };
}

function comprehensionMC(theme: { nouns: string[] }): WorksheetBlock {
  return {
    kind: "multiple-choice",
    prompt: "Circle the best answer. What is the story mostly about?",
    items: [`A character looking for ${theme.nouns[1]}`, "A rainy day indoors", "A trip to the dentist"],
    answers: [`A character looking for ${theme.nouns[1]}`],
  };
}

function matchingBlock(): WorksheetBlock {
  const pairs = [
    { left: "1", right: "one" },
    { left: "2", right: "two" },
    { left: "3", right: "three" },
    { left: "4", right: "four" },
    { left: "5", right: "five" },
  ];
  return { kind: "matching", prompt: "Draw a line to match each number to its word.", pairs };
}

function buildBlock(
  kind: WorksheetBlock["kind"],
  ctx: { template: WorksheetTemplate; age: number; diff: number; theme: { emoji: string; nouns: string[] } },
): WorksheetBlock {
  const { template, age, diff, theme } = ctx;
  const op: "add" | "sub" | "mul" | "money" =
    template.id === "subtraction" ? "sub" : template.id === "multiplication" ? "mul" : template.id === "money" ? "money" : "add";
  switch (kind) {
    case "instructions":
      return { kind: "instructions", prompt: `${template.title} for a ${age} year old. Take your time and do your best.` };
    case "trace":
      return traceBlock(template, theme);
    case "handwriting":
      return { kind: "handwriting", prompt: "Now write them yourself.", rows: 3 };
    case "math":
      return mathBlock(age, diff, op);
    case "column-math":
      return columnMathBlock(age, diff, op);
    case "count":
      return countBlock(age, theme);
    case "missing-numbers":
      return missingNumbersBlock(age, diff);
    case "matching":
      return matchingBlock();
    case "fill-blank":
      return fillBlankBlock(theme);
    case "word-bank":
      return { kind: "word-bank", prompt: "Word bank", wordBank: theme.nouns.slice(0, 5) };
    case "short-answer":
      return template.id === "reading" ? comprehensionQs() : shortAnswerMath(age, diff, theme);
    case "multiple-choice":
      return comprehensionMC(theme);
    case "passage":
      return passageBlock(age, theme);
    case "draw":
      return { kind: "draw", prompt: `Draw a ${theme.nouns[0].replace(/s$/, "")} and label two parts.`, rows: 6 };
    default:
      return { kind: "instructions", prompt: "" };
  }
}

export function templateWorksheet(template: WorksheetTemplate, age: number, instruction: string): Worksheet {
  const theme = detectTheme(instruction);
  const diff = detectDifficulty(instruction);
  const blocks = template.plan.map((kind) => buildBlock(kind, { template, age, diff, theme }));
  const themeLabel = theme.key ? ` · ${theme.key}` : "";
  return {
    title: template.title,
    subtitle: `Ages ${template.ageMin}-${template.ageMax}${themeLabel}`,
    intro: undefined,
    blocks,
    meta: { templateId: template.id, templateLabel: template.title, age, theme: theme.key },
  };
}

// ── AI path (Venice, OpenAI-compatible) ──────────────────────────────────────

const SYSTEM = [
  "You design printable worksheets that a CHILD completes by hand after a parent prints them (ages 3-12).",
  "NEVER write directions addressed to the parent. Write the actual exercises the child fills in:",
  "problems to solve, blanks to complete, letters or numbers to trace, objects to count, lines to match.",
  'Return ONLY valid minified JSON: {"title":string,"subtitle":string,"intro":string,"blocks":[Block]}.',
  'Block = {"kind":string,"prompt"?:string,"text"?:string,"items"?:[string],"pairs"?:[{"left":string,"right":string}],"emoji"?:string,"wordBank"?:[string],"rows"?:number,"answers"?:[string]}.',
  "Allowed kinds: instructions, trace, handwriting, fill-blank, word-bank, math, column-math, count, matching, multiple-choice, short-answer, missing-numbers, passage, draw.",
  "Rules: size everything to the child's age. Put real gaps with ____ where the child writes.",
  "math/column-math items look like '7 + 8 ='. For count, set emoji and items to the quantities to draw (e.g. ['4','7']).",
  "For matching use pairs. For missing-numbers, items are sequences containing ____ . For passage, put the text in 'text' then follow with short-answer/multiple-choice.",
  "Always include an 'answers' array for any block that has correct answers. Keep language warm and simple. Theme the content to whatever the parent asks.",
].join(" ");

export function buildMessages(template: WorksheetTemplate, age: number, messages: ChatMessage[]) {
  const asks = messages.filter((m) => m.role === "user").map((m) => m.content.trim()).filter(Boolean);
  const askText = asks.length ? asks.map((a, i) => `(${i + 1}) ${a}`).join(" ") : "Make a standard one.";
  const user =
    `Worksheet type: ${template.title}. ${template.brief} ` +
    `Child age: ${age}. Parent requests in order: ${askText} ` +
    `Build the latest request, keeping earlier context (theme, difficulty). Aim for 3 to 5 blocks.`;
  return [
    { role: "system", content: SYSTEM },
    { role: "user", content: user },
  ];
}

function normalize(parsed: Record<string, unknown>, template: WorksheetTemplate, age: number): Worksheet | null {
  const rawBlocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
  const allowed = new Set([
    "instructions", "trace", "handwriting", "fill-blank", "word-bank", "math",
    "column-math", "count", "matching", "multiple-choice", "short-answer", "missing-numbers", "passage", "draw",
  ]);
  const blocks: WorksheetBlock[] = [];
  for (const b of rawBlocks) {
    if (!b || typeof b !== "object") continue;
    const o = b as Record<string, unknown>;
    if (typeof o.kind !== "string" || !allowed.has(o.kind)) continue;
    const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : undefined);
    const block: WorksheetBlock = { kind: o.kind as WorksheetBlock["kind"] };
    if (typeof o.prompt === "string") block.prompt = o.prompt;
    if (typeof o.text === "string") block.text = o.text;
    if (typeof o.emoji === "string") block.emoji = o.emoji;
    if (typeof o.rows === "number") block.rows = o.rows;
    const items = strArr(o.items);
    if (items) block.items = items;
    const wb = strArr(o.wordBank);
    if (wb) block.wordBank = wb;
    const ans = strArr(o.answers);
    if (ans) block.answers = ans;
    if (Array.isArray(o.pairs)) {
      block.pairs = o.pairs
        .map((p) => (p && typeof p === "object" ? (p as Record<string, unknown>) : null))
        .filter((p): p is Record<string, unknown> => !!p && typeof p.left === "string" && typeof p.right === "string")
        .map((p) => ({ left: p.left as string, right: p.right as string }));
    }
    blocks.push(block);
  }
  if (blocks.length === 0) return null;
  return {
    title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title : template.title,
    subtitle:
      typeof parsed.subtitle === "string" && parsed.subtitle.trim() ? parsed.subtitle : `Ages ${template.ageMin}-${template.ageMax}`,
    intro: typeof parsed.intro === "string" ? parsed.intro : undefined,
    blocks,
    meta: { templateId: template.id, templateLabel: template.title, age },
  };
}

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function aiWorksheet(
  template: WorksheetTemplate,
  age: number,
  messages: ChatMessage[],
  key: string,
): Promise<Worksheet | null> {
  const base = process.env.VENICE_BASE_URL || "https://api.venice.ai/api/v1";
  const model = process.env.VENICE_MODEL || "llama-3.3-70b";
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: buildMessages(template, age, messages), temperature: 0.7, max_tokens: 2200 }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return null;
    const parsed = extractJson(text);
    if (!parsed) return null;
    return normalize(parsed, template, age);
  } catch {
    return null;
  }
}

export { getTemplate };
