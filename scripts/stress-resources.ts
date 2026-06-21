/* Ship-gate stress test for the deterministic worksheet engine.
   Generates every template, re-themes, makes harder/easier, opens with a named
   child, and asserts each output is on-topic, named, age-clean, grammar-clean.
   Run: npx tsx scripts/stress-resources.ts */

import { TEMPLATES } from "../lib/resources/catalog";
import { templateWorksheet } from "../lib/resources/generate";
import type { Worksheet } from "../lib/resources/types";

let fails = 0;
let checks = 0;
const log: string[] = [];

function flat(ws: Worksheet): string {
  const parts: string[] = [ws.title, ws.subtitle ?? ""];
  for (const b of ws.blocks) {
    if (b.prompt) parts.push(b.prompt);
    if (b.text) parts.push(b.text);
    if (b.items) parts.push(...b.items);
    if (b.wordBank) parts.push(...b.wordBank);
    if (b.pairs) for (const p of b.pairs) parts.push(p.left, p.right);
  }
  return parts.join(" \n ");
}

function maxNum(s: string): number {
  const nums = s.replace(/,/g, "").match(/\d+/g);
  return nums ? Math.max(...nums.map(Number)) : 0;
}

function assert(name: string, cond: boolean, detail = "") {
  checks++;
  if (!cond) {
    fails++;
    log.push(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// per-template on-topic check: a regex the flat text must match
const ONTOPIC: Record<string, RegExp> = {
  addition: /\+/,
  subtraction: /[−-]/,
  multiplication: /×/,
  division: /÷/,
  fractions: /\b\d\/\d\b/,
  "place-value": /worth|tens|ones|order|thousand/i,
  "telling-time": /\d:\d|o'clock|past|quarter/i,
  money: /\$/,
  "missing-numbers": /____/,
  "word-problems": /how many|how much|\?/i,
  shapes: /side|triangle|square|pentagon|hexagon|circle/i,
  counting: /count/i,
  "skip-counting": /____/,
  patterns: /pattern/i,
  matching: /match/i,
  reading: /story|read/i,
  phonics: /sound|cat|pig|sun|-at|letter/i,
  "sight-words": /\b(the|and|you|was|said|because|there|their|would)\b/i,
  rhyming: /rhyme|cat|hat|log/i,
  spelling: /spell|trace|word/i,
  grammar: /noun|verb|capital|adjective/i,
  "fill-blank-story": /____/,
  "creative-writing": /write|story|imagine|begin/i,
  "sentence-building": /sentence/i,
  "letter-tracing": /trace/i,
  "number-tracing": /trace/i,
  "line-tracing": /trace|line|copy/i,
  "draw-label": /draw|label/i,
  "color-by-number": /color|colour/i,
  "life-cycle": /life cycle|stage|egg|seed|caterpillar/i,
};

const BAD_PARENT = /your child|for the grown|for the parent/i;
const BAD_ARTICLE = /\ba (apple|egg|owl|orange|elephant|octopus|umbrella|ice|astronaut|alien|hour|apple)/i;
const BAD_AGE = /\bages?\s*\d/i;

for (const t of TEMPLATES) {
  const before = fails;

  // 1) base, named child "chase" (lowercase on purpose)
  const base = templateWorksheet(t, Math.round((t.ageMin + t.ageMax) / 2), "", "chase");
  const f = flat(base);
  assert(`${t.id} on-topic`, ONTOPIC[t.id].test(f), `no match for ${ONTOPIC[t.id]}`);
  assert(`${t.id} named title`, base.title === `Chase's ${t.title}`, `got "${base.title}"`);
  assert(`${t.id} no age label`, !BAD_AGE.test(base.subtitle ?? ""), `subtitle "${base.subtitle}"`);
  assert(`${t.id} child-directed`, !BAD_PARENT.test(f), "parent-directed text found");
  assert(`${t.id} grammar (an apple)`, !BAD_ARTICLE.test(f), "found 'a <vowel>'");
  assert(`${t.id} substantial`, base.blocks.length >= 2, `${base.blocks.length} blocks`);

  // 2) no name -> plain title, addresses "you"
  const noName = templateWorksheet(t, t.ageMin, "");
  assert(`${t.id} unnamed title`, noName.title === t.title, `got "${noName.title}"`);

  log.push(before === fails ? `✓ ${t.id} (${t.title})` : `✗ ${t.id} (${t.title})`);
}

// 3) difficulty: harder must use bigger numbers than easier (numeric templates)
for (const id of ["addition", "subtraction", "multiplication", "division", "money", "place-value"]) {
  const t = TEMPLATES.find((x) => x.id === id)!;
  const age = t.ageMax;
  let hSum = 0;
  let eSum = 0;
  for (let i = 0; i < 6; i++) {
    hSum += maxNum(flat(templateWorksheet(t, age, "make it harder", "Chase")));
    eSum += maxNum(flat(templateWorksheet(t, age, "make it easier", "Chase")));
  }
  assert(`${id} harder > easier`, hSum > eSum, `harder=${hSum} easier=${eSum}`);
}

// 4) re-theme to fruits must surface food vocabulary (themed templates)
const FOOD = /apple|bread|carrot|egg|berr|cheese/i;
for (const id of ["counting", "reading", "word-problems", "fill-blank-story", "multiplication"]) {
  const t = TEMPLATES.find((x) => x.id === id)!;
  const themed = flat(templateWorksheet(t, t.ageMax, "change the theme to fruits", "Chase"));
  assert(`${id} re-theme fruits`, FOOD.test(themed), "no food vocab after re-theme");
}

// 5) "more" must add items vs base (a length-responsive template)
{
  const t = TEMPLATES.find((x) => x.id === "addition")!;
  const base = templateWorksheet(t, 9, "", "Chase").blocks.reduce((s, b) => s + (b.items?.length ?? 0), 0);
  const more = templateWorksheet(t, 9, "add more questions", "Chase").blocks.reduce((s, b) => s + (b.items?.length ?? 0), 0);
  assert("addition more > base", more > base, `more=${more} base=${base}`);
}

console.log(log.join("\n"));
console.log(`\n${checks - fails}/${checks} checks passed across ${TEMPLATES.length} templates.`);
if (fails) {
  console.log(`\nFAILURES:\n${log.filter((l) => l.startsWith("  ✗")).join("\n")}`);
  process.exit(1);
}
console.log("ALL GREEN");
