// Sprout Resources — worksheet generation (server-side).
//
//   aiWorksheet()        -> Venice AI when VENICE_API_KEY is set. Private model
//                           (no prompts stored, no training), structured JSON out.
//   templateWorksheet()  -> offline fallback that builds REAL blocks so the product
//                           works before the key is wired. Deterministic + themable.

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

// Difficulty rises with age AND with explicit "harder/easier" asks.
function scaleFactor(age: number, diff: number): number {
  const byAge = 0.5 + (Math.min(12, Math.max(3, age)) - 3) * 0.18; // 0.5 at age 3 -> ~2.1 at age 12
  const byAsk = diff === 1 ? 1.6 : diff === -1 ? 0.6 : 1;
  return byAge * byAsk;
}

interface Ctx {
  template: WorksheetTemplate;
  age: number;
  diff: number;
  theme: { emoji: string; nouns: string[] };
  name: string;
}

// ── offline block builders ───────────────────────────────────────────────────

function mathBlock(ctx: Ctx, op: "add" | "sub" | "mul", n = 8): WorksheetBlock {
  const { age, diff } = ctx;
  const items: string[] = [];
  const answers: string[] = [];
  const f = scaleFactor(age, diff);
  if (op === "mul") {
    const fmax = Math.max(2, Math.round(6 * f));
    for (let i = 0; i < n; i++) {
      const a = rint(1, Math.min(12, fmax));
      const b = rint(1, Math.min(12, fmax));
      items.push(`${a} × ${b} =`);
      answers.push(`${a * b}`);
    }
  } else {
    const max = Math.max(5, Math.round(20 * f));
    for (let i = 0; i < n; i++) {
      const a = rint(1, max);
      const b = rint(1, op === "sub" ? a : max);
      items.push(op === "sub" ? `${a} − ${b} =` : `${a} + ${b} =`);
      answers.push(`${op === "sub" ? a - b : a + b}`);
    }
  }
  return { kind: "math", prompt: "Solve each one. Write your answer in the box.", items, answers };
}

function columnMathBlock(ctx: Ctx, op: "add" | "sub", n = 4): WorksheetBlock {
  const f = scaleFactor(ctx.age, ctx.diff);
  const max = Math.max(12, Math.round(60 * f));
  const items: string[] = [];
  const answers: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = rint(10, max);
    const b = rint(1, op === "sub" ? a : max);
    items.push(op === "sub" ? `${a} - ${b}` : `${a} + ${b}`);
    answers.push(`${op === "sub" ? a - b : a + b}`);
  }
  return { kind: "column-math", prompt: "Line up the digits and solve.", items, answers };
}

function moneyBlock(ctx: Ctx): WorksheetBlock {
  const f = scaleFactor(ctx.age, ctx.diff);
  const hi = Math.max(2, Math.round(12 * f));
  const items: string[] = [];
  const answers: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = rint(1, hi);
    const b = rint(1, hi);
    items.push(`$${a} + $${b} =`);
    answers.push(`$${a + b}`);
  }
  return { kind: "math", prompt: "Add up the money. Write the total with a $ sign.", items, answers };
}

function moneyWordProblems(ctx: Ctx): WorksheetBlock {
  const f = scaleFactor(ctx.age, ctx.diff);
  const price = rint(2, Math.max(4, Math.round(9 * f)));
  const paid = price + rint(1, 9);
  const snack = rint(2, 6);
  const drink = rint(1, 4);
  const items = [
    `${ctx.name} buys a toy for $${price} and pays with $${paid}. How much change? $____`,
    `A snack costs $${snack} and a drink costs $${drink}. How much for both? $____`,
    `How many cents are in 2 dimes and 1 nickel? ____ ¢`,
  ];
  return {
    kind: "short-answer",
    prompt: "Work it out, then write the answer with a $ or ¢ sign.",
    items,
    rows: 2,
    answers: [`$${paid - price}`, `$${snack + drink}`, "25 ¢"],
  };
}

function countBlock(ctx: Ctx): WorksheetBlock {
  const hi = ctx.age <= 4 ? 6 : ctx.age <= 6 ? 10 : 15;
  const items = [String(rint(2, hi)), String(rint(2, hi)), String(rint(2, hi))];
  return { kind: "count", prompt: "Count the pictures in each row. Write how many in the box.", emoji: ctx.theme.emoji, items, answers: items };
}

function missingNumbersBlock(ctx: Ctx): WorksheetBlock {
  const steps = ctx.diff === 1 || ctx.age >= 8 ? [2, 3, 5, 10] : ctx.diff === -1 ? [1, 2] : [1, 2, 5];
  const items: string[] = [];
  const answers: string[] = [];
  for (let r = 0; r < 3; r++) {
    const step = steps[rint(0, steps.length - 1)];
    const start = rint(0, 6) * step;
    const seq = Array.from({ length: 6 }, (_, i) => start + i * step);
    const blanks = new Set([2, 4]);
    items.push(seq.map((v, i) => (blanks.has(i) ? "____" : String(v))).join(",  "));
    answers.push([...blanks].map((i) => String(seq[i])).join(", "));
  }
  return { kind: "missing-numbers", prompt: "Fill in the missing numbers.", items, answers };
}

function traceBlock(ctx: Ctx): WorksheetBlock {
  let text: string;
  if (ctx.template.id === "number-tracing") text = "0  1  2  3  4  5  6  7  8  9";
  else if (ctx.template.id === "spelling") text = ctx.theme.nouns.slice(0, 3).join("   ");
  else text = "A a   B b   C c   D d   E e";
  return { kind: "trace", prompt: "Trace each one, then keep going on your own.", text };
}

function fillBlankBlock(ctx: Ctx): WorksheetBlock {
  const [n1, n2, n3] = ctx.theme.nouns;
  const items = [`The two ____ played in the sun all day.`, `I can see ____ near the big ____.`, `My favorite thing is the ____.`];
  return { kind: "fill-blank", prompt: "Use the word bank to finish each sentence.", items, wordBank: [n1, n2, n3], answers: [n1, `${n2}, ${n3}`, n1] };
}

function shortAnswerMath(ctx: Ctx): WorksheetBlock {
  const noun = ctx.theme.nouns[0];
  const f = scaleFactor(ctx.age, ctx.diff);
  const a = rint(2, Math.max(4, Math.round(8 * f)));
  const b = rint(2, Math.max(4, Math.round(8 * f)));
  const items = [
    `${ctx.name} has ${a} bags of ${noun}. Each bag holds ${b}. How many ${noun} in all?`,
    `${ctx.name} had ${a * b} ${noun} and gave ${b} away. How many are left?`,
  ];
  return { kind: "short-answer", prompt: "Show your work, then write the answer.", items, rows: 2, answers: [`${a * b}`, `${a * b - b}`] };
}

function passageBlock(ctx: Ctx): WorksheetBlock {
  const n = ctx.theme.nouns;
  const hero = ctx.name;
  const text =
    ctx.age <= 7
      ? `${hero} woke up early. The sun was warm. ${hero} went to find ${n[1]}. On the way, ${hero} saw ${n[2]} and waved hello. It was a happy day.`
      : `Every morning, ${hero} set off to explore. Today ${hero} wanted to find ${n[1]} near the old hill. Along the path were ${n[2]}, shining in the light. ${hero} counted them, smiled, and kept going, sure the best part of the day was still ahead.`;
  return { kind: "passage", prompt: "Read the story, then answer the questions.", text };
}

function comprehensionQs(ctx: Ctx): WorksheetBlock {
  return {
    kind: "short-answer",
    prompt: "Answer in a full sentence.",
    items: [`Who is the story about?`, `What did ${ctx.name} go to find?`, "How do you think they felt? Why?"],
    rows: 2,
    answers: [ctx.name, ctx.theme.nouns[1], "happy / excited"],
  };
}

function comprehensionMC(ctx: Ctx): WorksheetBlock {
  return {
    kind: "multiple-choice",
    prompt: "Circle the best answer. What is the story mostly about?",
    items: [`${ctx.name} looking for ${ctx.theme.nouns[1]}`, "A rainy day indoors", "A trip to the dentist"],
    answers: [`${ctx.name} looking for ${ctx.theme.nouns[1]}`],
  };
}

function matchingBlock(): WorksheetBlock {
  return {
    kind: "matching",
    prompt: "Draw a line to match each number to its word.",
    pairs: [
      { left: "1", right: "one" },
      { left: "2", right: "two" },
      { left: "3", right: "three" },
      { left: "4", right: "four" },
      { left: "5", right: "five" },
    ],
  };
}

function buildBlock(kind: WorksheetBlock["kind"], ctx: Ctx): WorksheetBlock {
  const { template, name } = ctx;
  const isMoney = template.id === "money";
  const op: "add" | "sub" | "mul" = template.id === "subtraction" ? "sub" : template.id === "multiplication" ? "mul" : "add";
  switch (kind) {
    case "instructions":
      return { kind: "instructions", prompt: `${template.title} for ${name}. Take your time and do your best.` };
    case "trace":
      return traceBlock(ctx);
    case "handwriting":
      return { kind: "handwriting", prompt: "Now write them yourself.", rows: 3 };
    case "math":
      return isMoney ? moneyBlock(ctx) : mathBlock(ctx, op === "mul" ? "mul" : op);
    case "column-math":
      return columnMathBlock(ctx, op === "sub" ? "sub" : "add");
    case "count":
      return countBlock(ctx);
    case "missing-numbers":
      return missingNumbersBlock(ctx);
    case "matching":
      return matchingBlock();
    case "fill-blank":
      return fillBlankBlock(ctx);
    case "word-bank":
      return { kind: "word-bank", prompt: "Word bank", wordBank: ctx.theme.nouns.slice(0, 5) };
    case "short-answer":
      return isMoney ? moneyWordProblems(ctx) : template.id === "reading" ? comprehensionQs(ctx) : shortAnswerMath(ctx);
    case "multiple-choice":
      return comprehensionMC(ctx);
    case "passage":
      return passageBlock(ctx);
    case "draw":
      return { kind: "draw", prompt: `Draw a ${ctx.theme.nouns[0].replace(/s$/, "")} and label two parts.`, rows: 6 };
    default:
      return { kind: "instructions", prompt: "" };
  }
}

export function templateWorksheet(template: WorksheetTemplate, age: number, instruction: string, childName?: string): Worksheet {
  const theme = detectTheme(instruction);
  const diff = detectDifficulty(instruction);
  const name = childName?.trim() || "your child";
  const ctx: Ctx = { template, age, diff, theme, name };
  const blocks = template.plan.map((kind) => buildBlock(kind, ctx));
  const themeLabel = theme.key ? ` · ${theme.key}` : "";
  return {
    title: template.title,
    subtitle: `Age ${age}${themeLabel}`,
    blocks,
    meta: { templateId: template.id, templateLabel: template.title, age, theme: theme.key, childName: childName?.trim() || undefined },
  };
}

// ── AI path (Venice, OpenAI-compatible, structured output) ───────────────────

const SYSTEM = [
  "You design printable worksheets that a CHILD completes by hand after a parent prints them (ages 3-12).",
  "NEVER write directions addressed to the parent. Write the actual exercises the child fills in:",
  "problems to solve, blanks to complete, letters or numbers to trace, objects to count, lines to match.",
  'Return ONLY valid JSON: {"title":string,"subtitle":string,"intro":string,"blocks":[Block]}.',
  'Block = {"kind":string,"prompt"?:string,"text"?:string,"items"?:[string],"pairs"?:[{"left":string,"right":string}],"emoji"?:string,"wordBank"?:[string],"rows"?:number,"answers"?:[string]}.',
  "Allowed kinds: instructions, trace, handwriting, fill-blank, word-bank, math, column-math, count, matching, multiple-choice, short-answer, missing-numbers, passage, draw.",
  "Rules: difficulty MUST match the age (a 4 year old gets numbers under 10; a 10 year old gets larger numbers, multi-step). Put real gaps with ____ where the child writes.",
  "math/column-math items look like '7 + 8 ='. Money must use a $ sign (e.g. '$3 + $5 =') and real change problems.",
  "For count, set emoji and items to the quantities to draw. For matching use pairs. For missing-numbers, items are sequences containing ____ .",
  "For passage, put the text in 'text' then follow with short-answer/multiple-choice. Always include an 'answers' array for blocks with correct answers.",
  "If a child's name is given, use it in the word problems and the story. If no name is given, address the child as 'you' and never state or invent a name. Keep language warm and simple. Theme the content to whatever the parent asks.",
].join(" ");

export function buildMessages(template: WorksheetTemplate, age: number, messages: ChatMessage[], childName?: string) {
  const asks = messages.filter((m) => m.role === "user").map((m) => m.content.trim()).filter(Boolean);
  const askText = asks.length ? asks.map((a, i) => `(${i + 1}) ${a}`).join(" ") : "Make a standard one.";
  const who = childName?.trim()
    ? `The child is named ${childName.trim()}, age ${age}.`
    : `The child is age ${age}; no name was given, so do not state or invent a name.`;
  const user =
    `Worksheet type: ${template.title}. ${template.brief} ` +
    `${who} ` +
    `Parent requests in order: ${askText} ` +
    `Build the latest request, keeping earlier context (theme, difficulty). Size the difficulty to age ${age}. Aim for 3 to 5 blocks.`;
  return [
    { role: "system", content: SYSTEM },
    { role: "user", content: user },
  ];
}

const ALLOWED = new Set([
  "instructions", "trace", "handwriting", "fill-blank", "word-bank", "math",
  "column-math", "count", "matching", "multiple-choice", "short-answer", "missing-numbers", "passage", "draw",
]);

function normalize(parsed: Record<string, unknown>, template: WorksheetTemplate, age: number, childName?: string): Worksheet | null {
  const rawBlocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
  const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : undefined);
  const blocks: WorksheetBlock[] = [];
  for (const b of rawBlocks) {
    if (!b || typeof b !== "object") continue;
    const o = b as Record<string, unknown>;
    if (typeof o.kind !== "string" || !ALLOWED.has(o.kind)) continue;
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
    subtitle: typeof parsed.subtitle === "string" && parsed.subtitle.trim() ? parsed.subtitle : `Age ${age}`,
    intro: typeof parsed.intro === "string" ? parsed.intro : undefined,
    blocks,
    meta: { templateId: template.id, templateLabel: template.title, age, childName: childName?.trim() || undefined },
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
  childName?: string,
): Promise<Worksheet | null> {
  const base = process.env.VENICE_BASE_URL || "https://api.venice.ai/api/v1";
  const model = process.env.VENICE_MODEL || "venice-uncensored";
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: buildMessages(template, age, messages, childName),
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return null;
    const parsed = extractJson(text);
    if (!parsed) return null;
    return normalize(parsed, template, age, childName);
  } catch {
    return null;
  }
}

export { getTemplate };
