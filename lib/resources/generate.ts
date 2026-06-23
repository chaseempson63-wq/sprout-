// Sprout Resources — worksheet generation (server-side).
//
//   templateWorksheet()  -> the deterministic engine. Subject-aware, on-template
//                           content for EVERY template, sized to the age,
//                           re-themed and re-leveled by the chat. This is the
//                           reliable backbone and the AI fallback.
//   aiWorksheet()        -> Venice AI when a key is set. Enhances variety; its
//                           output is validated and, if weak, we use the
//                           deterministic engine instead.

import { getTemplate } from "./catalog";
import { detectTheme, intentPreamble } from "./intent";
import { SVG_ART, SVG_KEYS } from "./svg-art";
import { capName } from "./util";
import type { ChatMessage, Worksheet, WorksheetBlock, WorksheetTemplate } from "./types";

// ── shared helpers ───────────────────────────────────────────────────────────

const article = (w: string) => (/^[aeiou]/i.test(w.trim()) ? "an" : "a");

// Each "make it harder" compounds and each "easier" steps back, so pressing
// harder again visibly raises difficulty every time. Returns the net level.
function detectDifficulty(text: string): number {
  const t = text.toLowerCase();
  const up = (t.match(/harder|tricky|trickier|challeng|advanced|tougher|more difficult/g) || []).length;
  const down = (t.match(/easier|simpler|simple|gentle|beginner|too hard|younger/g) || []).length;
  return Math.max(-3, Math.min(5, up - down));
}

function detectMore(text: string): number {
  const c = (text.toLowerCase().match(/\b(more|longer|add|extra|additional|another|lots|in.?depth)\b/g) || []).length;
  return Math.min(2.8, 1 + c * 0.6);
}

function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Difficulty rises with age AND compounds with each harder/easier ask.
function scaleFactor(age: number, diff: number): number {
  const byAge = 0.4 + (Math.min(13, Math.max(3, age)) - 3) * 0.22; // ~0.4 at 3 -> ~2.6 at 13
  const byAsk = Math.pow(1.45, diff); // 0=1x, +1=1.45x, +2=2.1x, +3=3.05x, -1=0.69x
  return byAge * byAsk;
}

// Real-world anchor: what an average child that age actually does at school
// (rough US grade bands). Difficulty is grounded in this, not guessed.
function ageBenchmark(age: number): string {
  const a = Math.min(13, Math.max(3, age));
  if (a <= 4) return "preschool: counting and recognising numbers to 5";
  if (a <= 6) return "Kindergarten to Grade 1: numbers to 20, single-digit addition and subtraction, basic shapes and letters";
  if (a <= 8) return "Grade 2 to 3: numbers into the hundreds and thousands, the times tables, multi-digit addition and subtraction, simple fractions";
  if (a <= 10) return "Grade 4 to 5: multi-digit multiplication and division, fractions and decimals, longer reading";
  return "Grade 6 to 8: multi-digit and multi-step problems, fractions, decimals, percentages, negative numbers and early algebra";
}

// The largest single factor a multiplication/division problem should use at this
// age. This is the deterministic fallback's operand ceiling, and it MUST track
// the stepper age the same way the Venice path does — that is the whole point.
// Bug it fixes: the old code pinned every age at the 12x times tables
// (Math.min(12, ...)), so when Venice was unavailable a 13-year-old silently got
// 4x6. Young children still land in the friendly times-table range (unchanged);
// from age 10 the numbers go genuinely multi-digit, climbing with age to match
// the age benchmark. The chat's harder/easier (diff) still nudges it either way.
function factorCeiling(age: number, diff: number): number {
  const a = Math.min(13, Math.max(3, age));
  // Ages 3-9: keep the existing gentle ramp (age 5 ~ up to 5, age 9 ~ up to 10).
  if (a <= 9) return Math.min(12, Math.max(2, Math.round(6 * scaleFactor(a, diff))));
  // Ages 10+: real multi-digit, tracking the benchmark (Grade 4-5 then Grade 6-8).
  const base = a === 10 ? 25 : a === 11 ? 45 : a === 12 ? 70 : 99;
  return Math.max(12, Math.round(base * Math.pow(1.4, diff)));
}

interface Ctx {
  template: WorksheetTemplate;
  age: number;
  diff: number;
  more: number;
  theme: { key: string; emoji: string; nouns: string[]; facts: string[] };
  name: string; // capitalized, or "" if none
}

const who = (c: Ctx) => c.name || "you";
const cnt = (base: number, ctx: Ctx, max = 30) => Math.min(max, Math.round(base * ctx.more));
// "harder"/"easier" always win over age, so an explicit ask is always honored.
const harder = (ctx: Ctx) => ctx.diff >= 1 || (ctx.age >= 9 && ctx.diff >= 0);
const older = (ctx: Ctx) => ctx.diff >= 1 || (ctx.age >= 7 && ctx.diff >= 0);

// child-directed opening line (identity lives in the named title)
function intro(ctx: Ctx): WorksheetBlock {
  const lead = ctx.name ? `${ctx.name}, take your time and do your best.` : "Take your time and do your best.";
  return { kind: "instructions", prompt: lead };
}

// ── numeric builders ──────────────────────────────────────────────────────────

function mathBlock(ctx: Ctx, op: "add" | "sub" | "mul" | "div"): WorksheetBlock {
  const count = cnt(12, ctx, 24);
  const items: string[] = [];
  const answers: string[] = [];
  const f = scaleFactor(ctx.age, ctx.diff);
  if (op === "mul") {
    const hi = factorCeiling(ctx.age, ctx.diff);
    for (let i = 0; i < count; i++) {
      const a = rint(2, hi);
      const b = rint(2, hi);
      items.push(`${a} × ${b} =`);
      answers.push(`${a * b}`);
    }
  } else if (op === "div") {
    const hi = factorCeiling(ctx.age, ctx.diff);
    for (let i = 0; i < count; i++) {
      const b = rint(2, Math.min(12, hi)); // divisor stays a clean 1-2 digit, like Venice
      const ans = rint(2, hi); // quotient scales with age -> multi-digit dividend
      items.push(`${b * ans} ÷ ${b} =`);
      answers.push(`${ans}`);
    }
  } else {
    const max = Math.max(5, Math.round(20 * f));
    for (let i = 0; i < count; i++) {
      const a = rint(1, max);
      const b = rint(1, op === "sub" ? a : max);
      items.push(op === "sub" ? `${a} − ${b} =` : `${a} + ${b} =`);
      answers.push(`${op === "sub" ? a - b : a + b}`);
    }
  }
  return { kind: "math", prompt: "Solve each one. Write your answer in the box.", items, answers };
}

function columnMathBlock(ctx: Ctx, op: "add" | "sub"): WorksheetBlock {
  const f = scaleFactor(ctx.age, ctx.diff);
  const max = Math.max(12, Math.round(60 * f));
  const count = cnt(6, ctx, 12);
  const items: string[] = [];
  const answers: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = rint(10, max);
    const b = rint(1, op === "sub" ? a : max);
    items.push(op === "sub" ? `${a} - ${b}` : `${a} + ${b}`);
    answers.push(`${op === "sub" ? a - b : a + b}`);
  }
  return { kind: "column-math", prompt: "Line up the digits and solve.", items, answers };
}

function moneyBlock(ctx: Ctx): WorksheetBlock {
  const f = scaleFactor(ctx.age, ctx.diff);
  const count = cnt(8, ctx, 16);
  const items: string[] = [];
  const answers: string[] = [];
  // Age 9+ (or harder) work in dollars AND cents with decimals.
  const cents = ctx.age >= 9 || ctx.diff >= 1;
  if (cents) {
    const hi = Math.max(500, Math.round(4000 * f)); // up to ~$40+ scaled
    const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
    for (let i = 0; i < count; i++) {
      const a = rint(125, hi);
      const b = rint(125, hi);
      items.push(`${fmt(a)} + ${fmt(b)} =`);
      answers.push(fmt(a + b));
    }
  } else {
    const hi = Math.max(2, Math.round(12 * f));
    for (let i = 0; i < count; i++) {
      const a = rint(1, hi);
      const b = rint(1, hi);
      items.push(`$${a} + $${b} =`);
      answers.push(`$${a + b}`);
    }
  }
  return { kind: "math", prompt: "Add up the money. Write the total with a $ sign.", items, answers };
}

function moneyWordProblems(ctx: Ctx): WorksheetBlock {
  const subj = who(ctx);
  const buys = ctx.name ? "buys" : "buy";
  const pays = ctx.name ? "pays" : "pay";
  const adv = ctx.age >= 9 || ctx.diff >= 1;
  const d = (c: number) => `$${(c / 100).toFixed(2)}`;
  if (adv) {
    const priceC = rint(500, 4000);
    const paidC = priceC + rint(75, 2500);
    const aC = rint(300, 2500);
    const bC = rint(300, 2500);
    const jacketC = Math.round(rint(2000, 9000) / 4) * 4; // clean 25% off
    const billC = Math.round(rint(1500, 6000) / 10) * 10; // clean 10% tax
    return {
      kind: "short-answer",
      prompt: "Work it out. Write the answer with a $ sign.",
      items: [
        `${subj} ${buys} a book for ${d(priceC)} and ${pays} with ${d(paidC)}. How much change?  $____`,
        `One item costs ${d(aC)} and another costs ${d(bC)}. What is the total?  $____`,
        `A ${d(jacketC)} jacket is 25% off. What is the sale price?  $____`,
        `A bill is ${d(billC)}. Add 10% tax. What is the total?  $____`,
      ],
      rows: 2,
      answers: [d(paidC - priceC), d(aC + bC), d(jacketC * 0.75), d(Math.round(billC * 1.1))],
    };
  }
  const price = rint(2, 9);
  const paid = price + rint(1, 9);
  const snack = rint(2, 6);
  const drink = rint(1, 4);
  const save = rint(1, 5);
  return {
    kind: "short-answer",
    prompt: "Work it out, then write the answer with a $ or ¢ sign.",
    items: [
      `${subj} ${buys} a toy for $${price} and ${pays} with $${paid}. How much change?  $____`,
      `A snack costs $${snack} and a drink costs $${drink}. How much for both?  $____`,
      `How many cents are in 2 dimes and 1 nickel?  ____ ¢`,
      `${subj} ${ctx.name ? "saves" : "save"} $${save} a week. How much after 4 weeks?  $____`,
    ],
    rows: 2,
    answers: [`$${paid - price}`, `$${snack + drink}`, "25 ¢", `$${save * 4}`],
  };
}

function countBlock(ctx: Ctx): WorksheetBlock {
  const hi = ctx.age <= 4 ? 6 : ctx.age <= 6 ? 10 : 15;
  const rows = cnt(4, ctx, 6);
  const items = Array.from({ length: rows }, () => String(rint(2, hi)));
  const what = ctx.theme.key !== "everyday" ? ctx.theme.nouns[0] : "pictures";
  return { kind: "count", prompt: `Count the ${what} in each row. Write how many in the box.`, emoji: ctx.theme.emoji, items, answers: items };
}

function missingNumbersBlock(ctx: Ctx, skipOnly = false): WorksheetBlock {
  const steps = skipOnly
    ? harder(ctx) ? [3, 4, 5, 10] : [2, 5, 10]
    : harder(ctx) ? [2, 3, 5, 10] : ctx.diff === -1 ? [1, 2] : [1, 2, 5];
  const rows = cnt(5, ctx, 8);
  const items: string[] = [];
  const answers: string[] = [];
  for (let r = 0; r < rows; r++) {
    const step = steps[rint(0, steps.length - 1)];
    const start = rint(0, 6) * step;
    const seq = Array.from({ length: 6 }, (_, i) => start + i * step);
    const blanks = new Set([2, 4]);
    items.push(seq.map((v, i) => (blanks.has(i) ? "____" : String(v))).join(",  "));
    answers.push([...blanks].map((i) => String(seq[i])).join(", "));
  }
  return { kind: "missing-numbers", prompt: "Fill in the missing numbers.", items, answers };
}

// Word problems whose OPERATION matches the template, so a multiplication sheet
// never carries a subtraction problem. Generic "word-problems" stays a real mix.
function shortAnswerMath(ctx: Ctx): WorksheetBlock {
  const noun = ctx.theme.nouns[0];
  const f = scaleFactor(ctx.age, ctx.diff);
  const count = cnt(5, ctx, 8);
  const items: string[] = [];
  const answers: string[] = [];
  const subj = who(ctx);
  const has = ctx.name ? "has" : "have";
  const id = ctx.template.id;
  const hi = Math.max(4, Math.round(8 * f));
  for (let i = 0; i < count; i++) {
    const a = rint(2, hi);
    const b = rint(2, hi);
    if (id === "multiplication") {
      items.push(`${subj} ${has} ${a} boxes of ${noun} with ${b} in each box. How many ${noun} in all?`);
      answers.push(`${a * b}`);
    } else if (id === "division") {
      const groups = rint(2, Math.min(12, hi));
      const each = rint(2, hi);
      items.push(`${subj} ${has} ${groups * each} ${noun} to share equally among ${groups} friends. How many does each friend get?`);
      answers.push(`${each}`);
    } else {
      const r = i % 3;
      if (r === 0) {
        items.push(`${subj} ${has} ${a} bags of ${noun} with ${b} in each. How many ${noun} in all?`);
        answers.push(`${a * b}`);
      } else if (r === 1) {
        items.push(`${subj} ${has} ${a + b} ${noun} and ${ctx.name ? "gives" : "give"} ${b} away. How many are left?`);
        answers.push(`${a}`);
      } else {
        items.push(`${subj} ${has} ${a} ${noun} and ${ctx.name ? "finds" : "find"} ${b} more. How many ${noun} now?`);
        answers.push(`${a + b}`);
      }
    }
  }
  return { kind: "short-answer", prompt: "Show your work, then write the answer.", items, rows: 2, answers };
}

// ── fractions ──────────────────────────────────────────────────────────────

function fractionsBlocks(ctx: Ctx): WorksheetBlock[] {
  const name: WorksheetBlock = {
    kind: "short-answer",
    prompt: "Write the fraction (top number over bottom number).",
    items: harder(ctx)
      ? ["Two out of five equal parts = ____", "Three out of eight = ____", "Five out of six = ____", "Seven out of ten = ____"]
      : ["One out of two equal parts = ____", "One out of four = ____", "Three out of four = ____", "Two out of three = ____"],
    rows: 1,
    answers: harder(ctx) ? ["2/5", "3/8", "5/6", "7/10"] : ["1/2", "1/4", "3/4", "2/3"],
  };
  const f = scaleFactor(ctx.age, ctx.diff);
  const ofItems: string[] = [];
  const ofAns: string[] = [];
  const denoms = harder(ctx) ? [3, 4, 5, 8] : [2, 3, 4];
  for (let i = 0; i < cnt(4, ctx, 8); i++) {
    const d = denoms[rint(0, denoms.length - 1)];
    const mult = rint(1, Math.max(2, Math.round(3 * f)));
    const whole = d * mult;
    ofItems.push(`1/${d} of ${whole} =`);
    ofAns.push(`${whole / d}`);
  }
  const ofNum: WorksheetBlock = { kind: "math", prompt: "Find the fraction of the number.", items: ofItems, answers: ofAns };
  const compare: WorksheetBlock = {
    kind: "short-answer",
    prompt: harder(ctx) ? "Write the bigger fraction, then complete the equivalent fraction." : "Circle the bigger fraction.",
    items: harder(ctx)
      ? ["3/4 or 2/3 → ____", "5/8 or 1/2 → ____", "1/2 = ?/4 → ____", "1/3 = ?/9 → ____"]
      : ["1/2 or 1/4 → ____", "2/3 or 1/3 → ____", "3/4 or 1/2 → ____"],
    rows: 1,
    answers: harder(ctx) ? ["3/4", "5/8", "2/4", "3/9"] : ["1/2", "2/3", "3/4"],
  };
  return [intro(ctx), name, ofNum, compare];
}

// ── place value ──────────────────────────────────────────────────────────────

function placeValueBlocks(ctx: Ctx): WorksheetBlock[] {
  const big = harder(ctx);
  const value: WorksheetBlock = {
    kind: "short-answer",
    prompt: "Write what the bold digit is worth.",
    items: big
      ? ["In 4,827 the 8 is worth ____", "In 1,560 the 1 is worth ____", "In 3,094 the 9 is worth ____", "In 7,213 the 2 is worth ____"]
      : ["In 53 the 5 is worth ____", "In 248 the 2 is worth ____", "In 91 the 9 is worth ____", "In 607 the 6 is worth ____"],
    rows: 1,
    answers: big ? ["800", "1,000", "90", "200"] : ["50", "200", "90", "600"],
  };
  const expand: WorksheetBlock = {
    kind: "short-answer",
    prompt: "Write the number.",
    items: big
      ? ["3 thousands, 4 hundreds, 0 tens, 6 ones = ____", "5,000 + 200 + 70 + 1 = ____", "Expanded form of 2,408 = ____"]
      : ["4 tens and 3 ones = ____", "2 hundreds, 0 tens, 7 ones = ____", "300 + 50 + 6 = ____"],
    rows: 1,
    answers: big ? ["3,406", "5,271", "2,000 + 400 + 0 + 8"] : ["43", "207", "356"],
  };
  const order: WorksheetBlock = {
    kind: "short-answer",
    prompt: "Put the numbers in order, smallest first.",
    items: big ? ["1,240   980   1,209   875 → ____", "3,001   3,010   2,999 → ____"] : ["34   7   19   52 → ____", "105   99   150 → ____"],
    rows: 1,
    answers: big ? ["875, 980, 1,209, 1,240", "2,999, 3,001, 3,010"] : ["7, 19, 34, 52", "99, 105, 150"],
  };
  return [intro(ctx), value, expand, order];
}

// ── telling time ───────────────────────────────────────────────────────────

function timeBlocks(ctx: Ctx): WorksheetBlock[] {
  const adv = older(ctx) || ctx.diff === 1;
  const write: WorksheetBlock = {
    kind: "short-answer",
    prompt: "Write each time with numbers, like 3:00.",
    items: adv
      ? ["Quarter past 4 = ____", "Quarter to 8 = ____", "Half past 6 = ____", "Ten o'clock = ____", "Twenty-five past 2 = ____"]
      : ["Three o'clock = ____", "Half past 6 = ____", "Nine o'clock = ____", "Half past 11 = ____"],
    rows: 1,
    answers: adv ? ["4:15", "7:45", "6:30", "10:00", "2:25"] : ["3:00", "6:30", "9:00", "11:30"],
  };
  const match: WorksheetBlock = {
    kind: "matching",
    prompt: "Draw a line to match each time to the way we say it.",
    pairs: adv
      ? [
          { left: "2:15", right: "quarter past two" },
          { left: "5:45", right: "quarter to six" },
          { left: "8:30", right: "half past eight" },
          { left: "11:00", right: "eleven o'clock" },
        ]
      : [
          { left: "3:00", right: "three o'clock" },
          { left: "6:30", right: "half past six" },
          { left: "9:00", right: "nine o'clock" },
          { left: "12:30", right: "half past twelve" },
        ],
  };
  const blocks = [intro(ctx), write, match];
  if (adv) {
    blocks.push({
      kind: "short-answer",
      prompt: "Work out the time.",
      items: ["It is 2:00. What time is it 3 hours later? ____", "It is 4:30. What time is it 1 hour later? ____", "School starts at 9:00 and lunch is 3 hours later. What time is lunch? ____"],
      rows: 1,
      answers: ["5:00", "5:30", "12:00"],
    });
  }
  return blocks;
}

// ── shapes & geometry ────────────────────────────────────────────────────────

function shapesBlocks(ctx: Ctx): WorksheetBlock[] {
  const young = ctx.age <= 5 && ctx.diff !== 1;
  const sides: WorksheetBlock = {
    kind: "short-answer",
    prompt: "Write how many sides each shape has.",
    items: young
      ? ["A triangle has ____ sides.", "A square has ____ sides.", "A circle has ____ sides.", "A rectangle has ____ sides."]
      : ["A triangle has ____ sides.", "A square has ____ sides.", "A pentagon has ____ sides.", "A hexagon has ____ sides.", "An octagon has ____ sides."],
    rows: 1,
    answers: young ? ["3", "4", "0", "4"] : ["3", "4", "5", "6", "8"],
  };
  const match: WorksheetBlock = {
    kind: "matching",
    prompt: "Draw a line to match each shape to the number of sides it has.",
    pairs: young
      ? [
          { left: "triangle", right: "3 sides" },
          { left: "square", right: "4 sides" },
          { left: "circle", right: "round, 0 sides" },
        ]
      : [
          { left: "triangle", right: "3 sides" },
          { left: "rectangle", right: "4 sides" },
          { left: "pentagon", right: "5 sides" },
          { left: "hexagon", right: "6 sides" },
        ],
  };
  const draw: WorksheetBlock = {
    kind: "draw",
    prompt: young
      ? "Draw a circle, a square and a triangle. Write the name under each one."
      : "Draw a pentagon and a hexagon. Next to each, write how many sides and corners it has.",
    rows: 7,
  };
  return [intro(ctx), sides, match, draw];
}

// ── patterns ─────────────────────────────────────────────────────────────────

function patternsBlocks(ctx: Ctx): WorksheetBlock[] {
  const num = older(ctx) || ctx.diff === 1;
  const complete: WorksheetBlock = {
    kind: "missing-numbers",
    prompt: "Finish each pattern. Write what comes in the blanks.",
    items: num
      ? ["2,  4,  6,  ____,  ____", "5,  10,  15,  ____,  ____", "A,  B,  C,  ____,  ____", "1,  2,  4,  8,  ____"]
      : ["red,  blue,  red,  blue,  ____", "circle,  square,  circle,  square,  ____", "A,  B,  A,  B,  ____,  ____", "up,  down,  up,  ____"],
    answers: num ? ["8, 10", "20, 25", "D, E", "16"] : ["red", "circle", "A, B", "down"],
  };
  const draw: WorksheetBlock = {
    kind: "draw",
    prompt: "Make your own pattern. Draw at least six shapes or colors in a row that repeat.",
    rows: 5,
  };
  return [intro(ctx), complete, draw];
}

// ── phonics ──────────────────────────────────────────────────────────────────

function phonicsBlocks(ctx: Ctx): WorksheetBlock[] {
  const adv = ctx.age >= 6 || ctx.diff === 1;
  const trace: WorksheetBlock = {
    kind: "trace",
    prompt: "Trace each one, then say the sound out loud.",
    text: adv ? "-at: cat  hat  bat    -ig: pig  dig  wig    sh   ch   th" : "s   a   t   p   i   n   m   d",
  };
  const fill: WorksheetBlock = {
    kind: "fill-blank",
    prompt: "Add the missing letter to finish each word. Use the word bank.",
    items: adv ? ["__at  (a cat says meow)", "p__g  (lives on a farm)", "__un  (it is hot)", "d__g  (man's best friend)"] : ["c__t", "d__g", "s__n", "b__g"],
    wordBank: adv ? ["c", "i", "s", "o"] : ["a", "o", "u"],
    answers: adv ? ["cat", "pig", "sun", "dog"] : ["cat", "dog", "sun", "bug"],
  };
  return [intro(ctx), trace, fill];
}

// ── sight words ──────────────────────────────────────────────────────────────

function sightWordsBlocks(ctx: Ctx): WorksheetBlock[] {
  const adv = ctx.age >= 7 || ctx.diff === 1;
  const words = adv ? ["because", "there", "their", "would", "could"] : ["the", "and", "you", "was", "said"];
  const trace: WorksheetBlock = { kind: "trace", prompt: "Trace each word, then write it once on your own.", text: words.join("    ") };
  const use: WorksheetBlock = {
    kind: "fill-blank",
    prompt: "Finish each sentence with a word from the list.",
    items: adv
      ? ["I stayed inside ____ it was raining.", "We left our bags over ____.", "The kids lost ____ ball.", "I ____ like to help."]
      : ["I can see ____ dog.", "____ you like it?", "We ____ very happy.", "Mum ____ hello."],
    wordBank: words,
    answers: adv ? ["because", "there", "their", "would"] : ["the", "and", "was", "said"],
  };
  return [intro(ctx), trace, use];
}

// ── rhyming ──────────────────────────────────────────────────────────────────

function rhymingBlocks(ctx: Ctx): WorksheetBlock[] {
  const match: WorksheetBlock = {
    kind: "matching",
    prompt: "Draw a line to match each word to the word that rhymes with it.",
    pairs: [
      { left: "cat", right: "hat" },
      { left: "dog", right: "log" },
      { left: "star", right: "car" },
      { left: "sun", right: "bun" },
      { left: "tree", right: "bee" },
    ],
  };
  const fill: WorksheetBlock = {
    kind: "fill-blank",
    prompt: "Finish each line with a word that rhymes. Use the word bank.",
    items: ["The cat sat on a ____.", "A frog jumped over a ____.", "The bright star is in a ____.", "I had fun in the ____."],
    wordBank: ["mat", "log", "jar", "sun"],
    answers: ["mat", "log", "jar", "sun"],
  };
  return [intro(ctx), match, fill];
}

// ── spelling ─────────────────────────────────────────────────────────────────

function spellingBlocks(ctx: Ctx): WorksheetBlock[] {
  const words = ctx.age <= 6 && ctx.diff !== 1 ? ["cat", "dog", "sun", "big", "red"] : ctx.age <= 8 ? ["jump", "play", "rain", "tree", "fish"] : ["because", "friend", "enough", "beautiful", "different"];
  const trace: WorksheetBlock = { kind: "trace", prompt: "Trace each spelling word, then cover it and write it again.", text: words.join("    ") };
  const use: WorksheetBlock = {
    kind: "fill-blank",
    prompt: "Write the missing letters, then read the word.",
    items: words.map((w) => `${w[0]}${"_".repeat(Math.max(1, w.length - 2))}${w[w.length - 1]}`),
    wordBank: words,
    answers: words,
  };
  const write: WorksheetBlock = { kind: "handwriting", prompt: "Pick two words and write a sentence with each.", rows: cnt(4, ctx, 8) };
  return [intro(ctx), trace, use, write];
}

// ── grammar ──────────────────────────────────────────────────────────────────

function grammarBlocks(ctx: Ctx): WorksheetBlock[] {
  const adv = older(ctx) || ctx.diff === 1;
  const id: WorksheetBlock = {
    kind: "short-answer",
    prompt: adv ? "Write N for noun, V for verb, or A for adjective." : "Write N for naming word (noun) or V for doing word (verb).",
    items: adv ? ["dog → ____", "run → ____", "happy → ____", "table → ____", "quickly jump → ____", "bright → ____"] : ["dog → ____", "run → ____", "cat → ____", "jump → ____", "sing → ____"],
    rows: 1,
    answers: adv ? ["N", "V", "A", "N", "V", "A"] : ["N", "V", "N", "V", "V"],
  };
  const fix: WorksheetBlock = {
    kind: "short-answer",
    prompt: "Rewrite each sentence with a capital letter at the start and the right end mark.",
    items: adv ? ["the dog ran to the park", "do you like ice cream", "what a big tree that is", "we read books on saturday"] : ["the sun is hot", "my dog likes to run", "we went to the park"],
    rows: 1,
    answers: adv ? ["The dog ran to the park.", "Do you like ice cream?", "What a big tree that is!", "We read books on Saturday."] : ["The sun is hot.", "My dog likes to run.", "We went to the park."],
  };
  return [intro(ctx), id, fix];
}

// ── reading + comprehension ───────────────────────────────────────────────────

function passageBlock(ctx: Ctx): WorksheetBlock {
  const m = ctx.theme.nouns;
  const hero = ctx.name || "Milo";
  const text =
    ctx.age <= 7
      ? `${hero} woke up early. The sun was warm. ${hero} went outside to look for ${m[1]}. On the way, ${hero} saw ${m[2]} and waved hello. Then ${hero} found a little path and followed it to the top of a hill. From the top, everything looked tiny and bright. It was a very happy day.`
      : `Every morning, ${hero} set off to explore. Today ${hero} wanted to find ${m[1]} near the old hill. Along the winding path were ${m[2]}, shining in the light. ${hero} counted them, drew a quick map, and kept going. The climb was steep, but ${hero} did not give up. At the top was the best view of all, and ${hero} knew the long walk had been worth it.`;
  return { kind: "passage", prompt: "Read the story, then answer the questions.", text };
}

function comprehensionQs(ctx: Ctx): WorksheetBlock {
  const hero = ctx.name || "the character";
  return {
    kind: "short-answer",
    prompt: "Answer each question in a full sentence.",
    items: [`Who is the story about?`, `What did ${hero} go out to find?`, `Where did the path lead?`, `How do you think ${hero} felt at the end? Why?`, `What was your favorite part?`],
    rows: 2,
    answers: [ctx.name || "Milo", ctx.theme.nouns[1], "the top of the hill", "happy / proud", "(opinion)"],
  };
}

function comprehensionMC(ctx: Ctx): WorksheetBlock {
  const hero = ctx.name || "the character";
  return {
    kind: "multiple-choice",
    prompt: "Circle the best answer. What is the story mostly about?",
    items: [`${hero} exploring to find ${ctx.theme.nouns[1]}`, "A rainy day indoors", "A trip to the dentist"],
    answers: [`${hero} exploring to find ${ctx.theme.nouns[1]}`],
  };
}

// ── fill-in-the-blank story ────────────────────────────────────────────────────

function fillStoryBlocks(ctx: Ctx): WorksheetBlock[] {
  const m = ctx.theme.nouns;
  const hero = ctx.name || "Sam";
  const bank = [m[0], m[1], m[2], "happy", "big"];
  const story: WorksheetBlock = {
    kind: "fill-blank",
    prompt: "Read the story and fill each blank with a word from the bank.",
    items: [
      `One day ${hero} went to see the ____.`,
      `There were so many ____ everywhere.`,
      `The biggest one was very ____.`,
      `${hero} felt ____ and ran home to tell everyone about the ____.`,
    ],
    wordBank: bank.filter(Boolean),
    answers: [m[0], m[1], "big", "happy", m[2]],
  };
  return [intro(ctx), { kind: "word-bank", prompt: "Word bank", wordBank: bank.filter(Boolean) }, story];
}

// ── creative writing ──────────────────────────────────────────────────────────

function creativeWritingBlocks(ctx: Ctx): WorksheetBlock[] {
  const prompts: Record<string, string> = {
    space: "You are the first kid to land on a new planet. Write about what you see and the first thing you do.",
    dinosaur: "You find a real dinosaur egg in your backyard, and it starts to hatch. Write what happens next.",
    ocean: "You can breathe underwater for one day. Write about your adventure in the deep ocean.",
    animal: "Your pet can talk for one day. Write about the first conversation you have together.",
    everyday: "Imagine you woke up and could fly. Write a story about where you go first and what you see.",
  };
  const p = prompts[ctx.theme.key] || prompts.everyday;
  const prompt: WorksheetBlock = {
    kind: "instructions",
    prompt: `${p}  You could start with: "It all began when..." or "I could not believe my eyes when..."`,
  };
  const lines: WorksheetBlock = { kind: "handwriting", prompt: "Write your story on the lines below.", rows: cnt(8, ctx, 14) };
  return [prompt, lines];
}

// ── sentence building ──────────────────────────────────────────────────────────

function sentenceBuildingBlocks(ctx: Ctx): WorksheetBlock[] {
  const bank = ["the", "dog", "ran", "fast", "big", "jumped", "happy", "park"];
  return [
    intro(ctx),
    { kind: "word-bank", prompt: "Word bank", wordBank: bank },
    {
      kind: "handwriting",
      prompt: "Use the words to build three full sentences. Start each with a capital letter and end with a full stop.",
      rows: cnt(6, ctx, 10),
    },
  ];
}

// ── tracing ──────────────────────────────────────────────────────────────────

function traceBlock(ctx: Ctx): WorksheetBlock {
  let text: string;
  if (ctx.template.id === "number-tracing") {
    text = ctx.age <= 4 ? "0  1  2  3  4  5" : ctx.age <= 6 ? "0  1  2  3  4  5  6  7  8  9" : "10  11  12  13  14  15  16  17  18  19  20";
  } else if (ctx.template.id === "line-tracing") {
    text = "|   |   /   \\   ∿   ◠   ◡   O";
  } else {
    text = ctx.age <= 4 ? "A a    B b    C c    D d" : "A a   B b   C c   D d   E e   F f   G g";
  }
  return { kind: "trace", prompt: "Trace each one, then keep going on your own.", text };
}

// ── creativity ──────────────────────────────────────────────────────────────

function drawLabelBlocks(ctx: Ctx): WorksheetBlock[] {
  let subject = "a plant";
  let parts = "the roots, the stem, a leaf and the flower";
  if (ctx.theme.key === "animal" || ctx.theme.key === "ocean" || ctx.theme.key === "dinosaur") {
    const noun = ctx.theme.nouns[0].replace(/s$/, "");
    subject = `${article(noun)} ${noun}`;
    parts = "the head, the body, the legs and the tail";
  } else if (ctx.theme.key === "space") {
    subject = "a rocket";
    parts = "the nose, the body, the fins and the flames";
  } else if (ctx.theme.key === "vehicle") {
    subject = "a car";
    parts = "the wheels, the windows, the doors and the lights";
  }
  return [
    intro(ctx),
    { kind: "draw", prompt: `Draw ${subject}. Then label ${parts}.`, rows: 8 },
    { kind: "handwriting", prompt: "Write one sentence about what you drew.", rows: cnt(3, ctx, 6) },
  ];
}

function colorByNumberBlocks(ctx: Ctx): WorksheetBlock[] {
  const f = scaleFactor(ctx.age, ctx.diff);
  const items: string[] = [];
  const answers: string[] = [];
  const hi = Math.max(3, Math.round(5 * f));
  for (let i = 0; i < cnt(8, ctx, 12); i++) {
    const a = rint(1, hi);
    const b = rint(0, hi);
    items.push(`${a} + ${b} =`);
    answers.push(`${a + b}`);
  }
  return [
    { kind: "instructions", prompt: "Color key:  1 = red   2 = blue   3 = green   4 = yellow   5 = orange.  Solve each problem, then color its box the color of the answer." },
    { kind: "math", prompt: "Solve each one.", items, answers },
    { kind: "draw", prompt: "Color the picture using your answers and the color key above.", rows: 7 },
  ];
}

function lifeCycleBlocks(ctx: Ctx): WorksheetBlock[] {
  let cycle = "a butterfly: egg, caterpillar, chrysalis, butterfly";
  let after = "What does the caterpillar turn into?";
  let afterAns = "a chrysalis";
  if (ctx.theme.key === "animal" || /frog/.test(ctx.theme.nouns.join(" "))) {
    cycle = "a frog: egg, tadpole, froglet, frog";
    after = "What does the tadpole grow into?";
    afterAns = "a froglet, then a frog";
  } else if (ctx.theme.key === "food" || ctx.theme.key === "everyday") {
    cycle = "a plant: seed, sprout, plant, flower";
    after = "What does the seed grow into first?";
    afterAns = "a sprout";
  }
  return [
    intro(ctx),
    { kind: "draw", prompt: `Draw the life cycle of ${cycle}. Draw the four stages in order and label each one.`, rows: 9 },
    {
      kind: "short-answer",
      prompt: "Answer each question in a full sentence.",
      items: ["What is the first stage?", after, "Why is each stage important?"],
      rows: 2,
      answers: ["the egg / seed", afterAns, "(each stage helps it grow to the next)"],
    },
  ];
}

function matchingBlocks(ctx: Ctx): WorksheetBlock[] {
  const young = ctx.age <= 5 && ctx.diff !== 1;
  const pairs = young
    ? [
        { left: "1", right: "one" },
        { left: "2", right: "two" },
        { left: "3", right: "three" },
        { left: "4", right: "four" },
        { left: "5", right: "five" },
      ]
    : [
        { left: "big", right: "small" },
        { left: "hot", right: "cold" },
        { left: "up", right: "down" },
        { left: "day", right: "night" },
        { left: "fast", right: "slow" },
      ];
  return [intro(ctx), { kind: "matching", prompt: young ? "Draw a line to match each number to its word." : "Draw a line to match each word to its opposite.", pairs }];
}

// ── per-template composition ──────────────────────────────────────────────────

function compose(ctx: Ctx): WorksheetBlock[] {
  const id = ctx.template.id;
  switch (id) {
    case "addition":
      return [intro(ctx), mathBlock(ctx, "add"), columnMathBlock(ctx, "add")];
    case "subtraction":
      return [intro(ctx), mathBlock(ctx, "sub"), columnMathBlock(ctx, "sub")];
    case "multiplication":
      return [intro(ctx), mathBlock(ctx, "mul"), shortAnswerMath(ctx)];
    case "division":
      return [intro(ctx), mathBlock(ctx, "div"), shortAnswerMath(ctx)];
    case "money":
      return [intro(ctx), moneyBlock(ctx), moneyWordProblems(ctx)];
    case "word-problems":
      return [intro(ctx), shortAnswerMath(ctx)];
    case "missing-numbers":
      return [intro(ctx), missingNumbersBlock(ctx)];
    case "skip-counting":
      return [intro(ctx), missingNumbersBlock(ctx, true)];
    case "counting":
      return [intro(ctx), countBlock(ctx), missingNumbersBlock(ctx)];
    case "fractions":
      return fractionsBlocks(ctx);
    case "place-value":
      return placeValueBlocks(ctx);
    case "telling-time":
      return timeBlocks(ctx);
    case "shapes":
      return shapesBlocks(ctx);
    case "patterns":
      return patternsBlocks(ctx);
    case "matching":
      return matchingBlocks(ctx);
    case "reading":
      return [passageBlock(ctx), comprehensionQs(ctx), comprehensionMC(ctx)];
    case "phonics":
      return phonicsBlocks(ctx);
    case "sight-words":
      return sightWordsBlocks(ctx);
    case "rhyming":
      return rhymingBlocks(ctx);
    case "spelling":
      return spellingBlocks(ctx);
    case "grammar":
      return grammarBlocks(ctx);
    case "fill-blank-story":
      return fillStoryBlocks(ctx);
    case "creative-writing":
      return creativeWritingBlocks(ctx);
    case "sentence-building":
      return sentenceBuildingBlocks(ctx);
    case "letter-tracing":
    case "number-tracing":
      return [intro(ctx), traceBlock(ctx), { kind: "handwriting", prompt: "Now write each one yourself on the lines.", rows: cnt(5, ctx, 8) }];
    case "line-tracing":
      return [intro(ctx), traceBlock(ctx), { kind: "draw", prompt: "Copy each line and curve in the space below.", rows: 6 }];
    case "draw-label":
      return drawLabelBlocks(ctx);
    case "color-by-number":
      return colorByNumberBlocks(ctx);
    case "life-cycle":
      return lifeCycleBlocks(ctx);
    default:
      return [intro(ctx), shortAnswerMath(ctx)];
  }
}

export function templateWorksheet(template: WorksheetTemplate, age: number, instruction: string, childName?: string): Worksheet {
  const theme = detectTheme(instruction);
  const diff = detectDifficulty(instruction);
  const more = detectMore(instruction);
  const name = capName(childName);
  const ctx: Ctx = { template, age, diff, more, theme, name };
  const blocks = compose(ctx);
  const themed = theme.key && theme.key !== "everyday";
  return {
    title: name ? `${name}'s ${template.title}` : template.title,
    subtitle: themed ? `A ${theme.label.toLowerCase()} worksheet` : "",
    blocks,
    meta: { templateId: template.id, templateLabel: template.title, age, theme: theme.key, childName: name || undefined },
  };
}

// Freeform "Build your own" has no deterministic generator (it can be any topic),
// so when Venice is unavailable we return an honest, friendly retry sheet rather
// than bogus filler. The builder renders it like any worksheet.
export function customFallback(age: number, childName?: string): Worksheet {
  return {
    title: "Let's try that again",
    subtitle: "",
    blocks: [
      {
        kind: "instructions",
        prompt: "I could not build that one just now. Describe what you want in a bit more detail (the topic, how many questions, and any theme) and send it again.",
      },
    ],
    meta: { templateId: "custom", templateLabel: "Build Your Own", age, childName: capName(childName) || undefined },
  };
}

// Drop duplicate problems, treating commutative pairs (a+b/b+a, a×b/b×a) as the
// same so a sheet never shows both. Runs on every worksheet, AI or fallback.
export function dedupeWorksheet(ws: Worksheet): Worksheet {
  const blocks = ws.blocks.map((b) => {
    if ((b.kind !== "math" && b.kind !== "column-math") || !b.items) return b;
    const seen = new Set<string>();
    const items: string[] = [];
    const answers: string[] = [];
    b.items.forEach((it, i) => {
      const m = it.replace(/=/g, "").trim().match(/^(\d[\d.,]*)\s*([+\-−×x*÷/])\s*(\d[\d.,]*)/);
      let key = it.trim().toLowerCase();
      if (m) {
        const a = m[1].replace(/,/g, "");
        const op = m[2];
        const c = m[3].replace(/,/g, "");
        const commutative = /[+×x*]/.test(op);
        key = commutative ? `${[a, c].sort().join("|")}|${op}` : `${a}|${op}|${c}`;
      }
      if (seen.has(key)) return;
      seen.add(key);
      items.push(it);
      if (b.answers) answers.push(b.answers[i]);
    });
    return { ...b, items, ...(b.answers ? { answers } : {}) };
  });
  return { ...ws, blocks };
}

// ── AI path (Venice, OpenAI-compatible, structured output) ───────────────────

const SYSTEM = [
  "You design printable worksheets that a CHILD completes by hand after a parent prints them (ages 3-12).",
  "Write everything ADDRESSED TO THE CHILD ('Solve each one', 'Trace the shapes'). NEVER write directions to the parent and never use the phrase 'your child'.",
  "Produce ONLY content that matches the requested worksheet type. A shapes worksheet must be about shapes; a telling-time worksheet must be about clocks. Never drift into number-word matching or generic drawing.",
  'Return ONLY valid JSON: {"title":string,"subtitle":string,"blocks":[Block]}.',
  'Block = {"kind":string,"prompt"?:string,"text"?:string,"items"?:[string],"pairs"?:[{"left":string,"right":string}],"emoji"?:string,"wordBank"?:[string],"rows"?:number,"answers"?:[string]}.',
  "Allowed kinds: instructions, trace, handwriting, fill-blank, word-bank, math, column-math, count, matching, multiple-choice, short-answer, missing-numbers, passage, draw.",
  "FILL A FULL A4 PAGE: 3 to 5 blocks. Practice sheets need 12 to 20 items; reading needs a passage of 6 to 10 sentences plus 4 to 6 questions; tracing needs several rows. Never return a tiny 2-3 item sheet.",
  "Difficulty MUST scale to the EXACT age: 3-4 = numbers to 5, single letters, tracing, simple shapes; 5-6 = numbers to 20, CVC words, basic shapes and patterns; 7-8 = numbers to 100, times tables, fractions of a shape; 9-10 = multi-digit operations, division, fractions, longer reading; 11-13 = multi-step problems, fractions and decimals, place value to thousands.",
  "HARDER means genuinely MORE COMPLEX (bigger and multi-digit numbers, carrying/borrowing, more steps, harder vocabulary), never the same answers reshuffled. EASIER means simpler. Every item must be distinct.",
  "Use PLAIN TEXT only: no LaTeX, no markdown. math/column-math hold ONLY bare equations like '24 × 37 ='; put word problems in short-answer. Money uses $ and ¢. For count, set emoji and items to quantities. For matching use pairs. For missing-numbers, items are sequences containing ____.",
  "Treat each parent message as an EDIT: a theme word re-themes every item; 'harder'/'easier' changes difficulty; 'more'/'longer' adds items. Always return the FULL updated worksheet.",
  "Do not include an answer-key section in the prompts; put correct answers only in each block's 'answers' array. If a child's name is given use it in word problems and stories; otherwise address the child as 'you' and never invent a name. Do not put raw line breaks inside JSON string values.",
].join(" ");

// ── resource MODE: structure adapts to intent, not one fixed worksheet frame ──
// practice = the existing block/fill-in path (SYSTEM above, UNCHANGED).
// teach    = lead with real teaching; questions optional and light.
// activity = a hands-on doing sheet with real line-art, not described pictures.
type ResourceMode = "teach" | "practice" | "activity";

// Templates that are hands-on visual activities rather than practice drills.
const ACTIVITY_TEMPLATES = new Set(["color-by-number", "draw-label", "life-cycle"]);

const TEACH_RE =
  /\b(teach|learn(ing)?|tell me|all about|explain|lesson|introduce|facts? about|what (is|are|was|were|do|does|happens?)|who (is|are|was|were)|where (is|are|do|does)|how (do|does|did|is|are|can)|why (do|does|did|is|are))\b/i;
const ACTIVITY_RE =
  /\b(colou?r by number|colou?r[- ]?in|colou?ring|colou?r the|dot[- ]?to[- ]?dot|connect the dots|maze|trace|tracing|cut[- ]?out|spot the|find the|matching game|draw and colou?r)\b/i;

// Classify a request. Templates keep their lane (practice unless explicitly an
// activity); only freeform "Build your own" is classified from the parent's words.
function detectMode(template: WorksheetTemplate, messages: ChatMessage[]): ResourceMode {
  if (template.id !== "custom") return ACTIVITY_TEMPLATES.has(template.id) ? "activity" : "practice";
  const text = messages.filter((m) => m.role === "user").map((m) => m.content).join(" ");
  if (ACTIVITY_RE.test(text)) return "activity";
  if (TEACH_RE.test(text)) return "teach";
  return "practice";
}

// ── AI image generation config (Venice /image/generate) ──────────────────────
// On by default whenever a Venice key is present. Turn off with RESOURCES_IMAGES=0
// to fall back to the curated SVG line-art / draw boxes. The model + per-sheet cap
// are env-tunable so quality vs cost can be dialed without a code change.
function imagesEnabled(): boolean {
  return process.env.RESOURCES_IMAGES !== "0";
}
function imageModel(): string {
  return process.env.VENICE_IMAGE_MODEL || "venice-sd35";
}
function imageMax(): number {
  const n = Number(process.env.VENICE_IMAGE_MAX);
  return Number.isFinite(n) && n > 0 ? Math.min(4, Math.round(n)) : 2;
}

// Shared JSON-shape + visual-honesty rules for teach and activity modes. (The
// practice SYSTEM above is left byte-for-byte as-is so practice never changes.)
// imagesOn flips the picture rule: when AI image generation is enabled the model
// describes a picture freely in 'imagePrompt'; when off it picks a key from the
// curated SVG menu, exactly as before.
function schemaSpec(imagesOn: boolean): string[] {
  const imageLine = imagesOn
    ? "image = a picture: set 'imagePrompt' to ONE vivid sentence describing exactly what the picture shows (the subject, a couple of details, a simple setting). Draw anything that fits the topic, you are NOT limited to a list."
    : `image = a picture: set 'svgKey' to EXACTLY ONE of: ${SVG_KEYS.join(", ")}. If none of those fits, use a draw block instead.`;
  return [
    'Return ONLY valid JSON: {"title":string,"subtitle":string,"blocks":[Block]}.',
    'Block = {"kind":string,"prompt"?:string,"text"?:string,"items"?:[string],"pairs"?:[{"left":string,"right":string}],"emoji"?:string,"wordBank"?:[string],"rows"?:number,"answers"?:[string],"svgKey"?:string,"imagePrompt"?:string}.',
    "Allowed kinds: instructions, passage, fact, image, draw, short-answer, multiple-choice, fill-blank, word-bank, matching, count, missing-numbers, trace, handwriting, math, column-math.",
    "passage = a short heading in 'prompt' and the teaching text in 'text'. fact = one surprising fact in 'text'. draw = a box the child draws in, say what in 'prompt'.",
    imageLine,
    'NEVER write a picture as words or a bracketed description like "[a friendly fish]"; use an image or draw block.',
    "Write everything ADDRESSED TO THE CHILD; never write directions to the parent and never say 'your child'. If a name is given use it; otherwise say 'you' and never invent a name.",
    "Use PLAIN TEXT only: no LaTeX, no markdown. Do not put raw line breaks inside JSON string values. Do not include an answer-key section in the prompts; put any answers only in each block's 'answers' array.",
  ];
}

// Light by design: a three-beat skeleton with real creative leeway inside it,
// not a rigid block-count recipe. The only hard rails are the JSON contract and
// Sprout's voice (both in schemaSpec). Everything else is the model's call.
function systemTeach(imagesOn: boolean): string {
  return [
    "You design printable LEARNING resources for a child (ages 3-12) to read at home. The child wants to LEARN this topic, so teach it, do not quiz it.",
    "Follow one simple three-beat shape, and be creative inside it:",
    "1) HOOK: open with a warm, exciting line (an 'instructions' block) that makes the child want to know more.",
    "2) TEACH: this is the heart of it. Use 'passage' blocks (a short fun heading in 'prompt', a few vivid sentences in 'text'), 'fact' blocks for surprising 'did you know?' bites, and at least one 'image'. Use as many as the topic deserves and fill the page. Simple words, real examples, things a child can picture.",
    "3) OPTIONAL: a light question or two at the very end, answerable from what you taught. Often none is better. Never lead with questions.",
    "There is no fixed format beyond those three beats and the JSON rules. If the request is playful, specific, or unusual, lean into it, match its energy, and run with the idea.",
    "Pitch every word so a curious child of that age leans in and actually learns something, never like homework.",
    ...schemaSpec(imagesOn),
  ].join(" ");
}

function systemActivity(imagesOn: boolean): string {
  return [
    "You design printable hands-on ACTIVITY sheets for a child (ages 3-12) to DO after printing. The doing is the point.",
    "One simple three-beat shape, be creative inside it: 1) a tiny instruction line; 2) the activity itself, big and fun, built around at least one 'image' to colour, trace, label, count, or complete; 3) nothing else unless it genuinely adds to the fun.",
    "Colour by number: an 'image' block plus a short colour key as an 'instructions' block (e.g. '1 = blue, 2 = green'); the child solves simple problems and colours each part by its answer.",
    "If the request is playful or specific, run with it. Never describe a picture in words, use an image or draw block.",
    "Make it something a curious child of that age wants to pick up and finish, never like homework.",
    ...schemaSpec(imagesOn),
  ].join(" ");
}

export function buildMessages(template: WorksheetTemplate, age: number, messages: ChatMessage[], childName?: string) {
  const asks = messages.filter((m) => m.role === "user").map((m) => m.content.trim()).filter(Boolean);
  const askText = asks.length ? asks.map((a, i) => `(${i + 1}) ${a}`).join(" ") : "Make a standard full-page one.";
  const name = capName(childName);
  const who2 = name ? `The child is named ${name}, age ${age}. Use ${name} in word problems and stories.` : `The child is age ${age}; no name was given, so address them as 'you' and never invent a name.`;
  const lvl = detectDifficulty(asks.join(" "));
  const target = Math.round(20 * scaleFactor(age, lvl));
  const diffNote =
    lvl > 0
      ? `DIFFICULTY: the parent has asked to make it harder ${lvl} time(s). Make this clearly harder than a standard age-${age} sheet, and harder with each request: for number problems use values up to roughly ${target}, with carrying/borrowing and multi-step where it fits; for words and reading use longer, richer content. `
      : lvl < 0
        ? `DIFFICULTY: the parent has asked to make it easier. Make this clearly gentler than a standard age-${age} sheet: smaller numbers (up to about ${target}) and fewer steps. `
        : "";
  const benchNote = `An average ${age}-year-old works at this level in school: ${ageBenchmark(age)}. Match that grade level and never go below it. `;

  const mode = detectMode(template, messages);
  const imagesOn = imagesEnabled();

  // TEACH: lead with real teaching content; questions optional. (Freeform only.)
  if (mode === "teach") {
    const teachUser =
      `The child wants to learn about this topic, newest message last: ${askText}. ` +
      `${who2} ${benchNote}${diffNote}` +
      `Teach it for a ${age}-year-old following the rules above: a hook, rich teaching passages, fun facts, a picture, and only a few light questions at the end if any. Give it a clear, specific title that names the topic. Return ONLY the worksheet JSON.`;
    return [
      { role: "system", content: systemTeach(imagesOn) },
      { role: "user", content: teachUser },
    ];
  }

  // ACTIVITY: a hands-on doing sheet with real line-art (freeform or an activity template).
  if (mode === "activity") {
    const what =
      template.id === "custom"
        ? `The child wants this activity, newest message last: ${askText}.`
        : `This is a "${template.title}" activity (${template.brief}). Parent requests, newest last: ${askText}.`;
    const activityUser =
      `${what} ${who2} ${benchNote}${diffNote}` +
      `Build it for a ${age}-year-old following the rules above, using a real picture (an image block) wherever one helps. Give it a clear, specific title. Return ONLY the worksheet JSON.`;
    return [
      { role: "system", content: systemActivity(imagesOn) },
      { role: "user", content: activityUser },
    ];
  }

  // PRACTICE (unchanged from here down).
  // Freeform "Build your own": the parent's own description is the spec. Reuse the
  // same SYSTEM rules + pipeline, but let the model pick the format and topic.
  if (template.id === "custom") {
    const customUser =
      `The parent will describe the worksheet they want, newest message last: ${askText}. ` +
      `Build EXACTLY what they describe as a printable worksheet for a ${age}-year-old. Pick whatever block types fit the request (math, column-math, short-answer, passage, fill-blank, word-bank, matching, multiple-choice, missing-numbers, count, trace, handwriting, draw). ` +
      `${who2} ${benchNote}${diffNote}` +
      `Give it a clear, specific title that names the topic (never the words "Build Your Own"). Make it a FULL A4 page (3 to 5 blocks). Address the child directly. Return ONLY the worksheet JSON.`;
    return [
      { role: "system", content: SYSTEM },
      { role: "user", content: customUser },
    ];
  }
  const user =
    `${intentPreamble(template.id, age)} ` +
    `This worksheet type is "${template.title}" (${template.brief}). Produce ONLY ${template.title} content. ` +
    `${who2} ${benchNote}${diffNote}` +
    `Parent requests, newest last: ${askText}. Apply the newest as an edit, keeping earlier theme/difficulty/length. ` +
    `Make it a FULL A4 page (3 to 5 blocks). Address the child directly. No problem and its reverse (e.g. 7x11 and 11x7) on the same sheet. Return ONLY the worksheet JSON.`;
  return [
    { role: "system", content: SYSTEM },
    { role: "user", content: user },
  ];
}

const ALLOWED = new Set([
  "instructions", "trace", "handwriting", "fill-blank", "word-bank", "math",
  "column-math", "count", "matching", "multiple-choice", "short-answer", "missing-numbers",
  "passage", "fact", "image", "draw",
]);

// Block kinds whose renderer reads `items` as its primary content. If the model
// instead packs that content into `text` (e.g. a math equation, a fill-blank
// sentence), normalize moves it into `items` so it isn't silently dropped.
// (instructions/passage/fact read text or prompt, so they are NOT in this set.)
const ITEM_KINDS = new Set([
  "math", "column-math", "fill-blank", "count", "missing-numbers", "multiple-choice", "short-answer",
]);

function normalize(parsed: Record<string, unknown>, template: WorksheetTemplate, age: number, childName?: string): Worksheet | null {
  const rawBlocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
  const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : undefined);
  const noDash = (s: string) => s.replace(/\s*[—–]\s*/g, ", ");
  const blocks: WorksheetBlock[] = [];
  for (const b of rawBlocks) {
    if (!b || typeof b !== "object") continue;
    const o = b as Record<string, unknown>;
    if (typeof o.kind !== "string" || !ALLOWED.has(o.kind)) continue;
    const block: WorksheetBlock = { kind: o.kind as WorksheetBlock["kind"] };
    if (typeof o.prompt === "string") block.prompt = noDash(o.prompt);
    if (typeof o.text === "string") block.text = noDash(o.text);
    if (typeof o.emoji === "string") block.emoji = o.emoji;
    if (typeof o.rows === "number") block.rows = o.rows;
    if (typeof o.svgKey === "string") block.svgKey = o.svgKey;
    if (typeof o.imagePrompt === "string") block.imagePrompt = noDash(o.imagePrompt).trim().slice(0, 300);
    // Visual honesty: an image must resolve to REAL art, either an imagePrompt we can
    // generate from or a valid curated svgKey. With neither it degrades to a draw box
    // ("draw it yourself"), never a blank or a text description pretending to be a picture.
    if (block.kind === "image" && !block.imagePrompt && !(block.svgKey && SVG_ART[block.svgKey])) {
      block.prompt = block.prompt || (block.svgKey ? `Draw a ${block.svgKey} here.` : "Draw the picture here.");
      block.kind = "draw";
      block.rows = block.rows ?? 7;
      delete block.svgKey;
    }
    const items = strArr(o.items);
    if (items) block.items = items.map(noDash);
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
    // Field-shape coercion: each kind's renderer reads ONE primary field. If the
    // model put the content where the renderer never looks, move it. Common case:
    // an items-based block (a math equation, a fill-blank line) arrives as `text`.
    // Newline-split so multiple items packed into one string still separate, with
    // the whole string as a single item otherwise. The `prompt` label is kept.
    if (ITEM_KINDS.has(block.kind) && (!block.items || block.items.length === 0) && block.text && block.text.trim()) {
      const parts = block.text.split(/\r?\n+/).map((s) => s.trim()).filter(Boolean);
      block.items = (parts.length ? parts : [block.text.trim()]).map(noDash);
      delete block.text;
    }
    // word-bank reads `wordBank`; accept items (or a comma/newline list in text).
    if (block.kind === "word-bank" && (!block.wordBank || block.wordBank.length === 0)) {
      if (block.items && block.items.length) {
        block.wordBank = block.items;
        delete block.items;
      } else if (block.text && block.text.trim()) {
        block.wordBank = block.text.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
        delete block.text;
      }
    }
    // De-dupe the fact label: the renderer already prints a "Did you know?" header,
    // so strip a leading "did you know?" the model also wrote into the fact text
    // (any casing/punctuation), then re-capitalize. Label de-dup, not a fact cap.
    if (block.kind === "fact" && block.text) {
      const stripped = block.text.replace(/^\s*did\s+you\s+know(\s+that)?[\s?!.:,-]*/i, "").trim();
      if (stripped && stripped !== block.text) block.text = stripped.charAt(0).toUpperCase() + stripped.slice(1);
    }
    blocks.push(block);
  }
  // Validation: reject weak AI output so the caller falls back to the engine.
  // Teaching content is real content: a passage is weighted by its sentences (not a
  // flat 3), and fact/image/draw blocks count too, so a teach sheet that leads with
  // explanation instead of a long item list is no longer discarded as "weak".
  const sentences = (t?: string) =>
    t ? Math.min(12, (t.match(/[.!?]+/g)?.length ?? Math.ceil(t.length / 60)) || 1) : 0;
  const weight = blocks.reduce((s, b) => {
    let w = (b.items?.length ?? 0) + (b.pairs?.length ?? 0);
    if (b.text) w += b.kind === "passage" ? sentences(b.text) : 1;
    if (b.kind === "fact") w += 2; // a fun-fact callout is real teaching
    if (b.kind === "image" || b.kind === "draw") w += 1; // a visual is real content
    return s + w;
  }, 0);
  if (blocks.length < 2 || weight < 5) return null;

  const name = capName(childName);
  const subtitleRaw = typeof parsed.subtitle === "string" ? noDash(parsed.subtitle) : "";
  const subtitle = subtitleRaw.replace(/\bages?\s*\d+\s*(-\s*\d+)?\b/gi, "").replace(/^[\s·,-]+|[\s·,-]+$/g, "");
  // Freeform sheets keep the model's own topic title; templates use the named pattern.
  const parsedTitle = (typeof parsed.title === "string" ? noDash(parsed.title) : "")
    .replace(/\bages?\s*\d+\s*(-\s*\d+)?\b/gi, "")
    .replace(/^[\s·,-]+|[\s·,-]+$/g, "")
    .trim();
  const title =
    template.id === "custom"
      ? parsedTitle || "Custom Worksheet"
      : name
        ? `${name}'s ${template.title}`
        : template.title;
  return {
    title,
    subtitle,
    blocks,
    meta: { templateId: template.id, templateLabel: template.title, age, childName: name || undefined },
  };
}

function stripControlChars(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) out += s.charCodeAt(i) < 32 ? " " : s[i];
  return out;
}

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    try {
      return JSON.parse(stripControlChars(slice));
    } catch {
      return null;
    }
  }
}

// Per-mode art direction appended to the model's imagePrompt. Teach gets a warm
// full-color storybook look; activity gets clean colour-in line art; practice (rare)
// gets a simple friendly picture. A shared negative prompt keeps text/watermarks out.
const IMAGE_STYLE: Record<ResourceMode, string> = {
  teach: "children's book illustration, friendly and colorful, soft rounded shapes, simple, on a clean solid white background",
  activity: "black and white coloring-book line art, bold clean even outlines, no shading, no fill, no grey, on a pure white background",
  practice: "simple friendly illustration, clean solid white background",
};
const IMAGE_NEG =
  "text, words, letters, numbers, labels, captions, watermark, signature, frame, border, blurry, deformed, extra limbs, scary, gore, photorealistic, nsfw";

// One image. Returns a data: URL or null (caller degrades nulls to a draw box).
async function generateImage(imagePrompt: string, mode: ResourceMode, key: string): Promise<string | null> {
  const base = process.env.VENICE_BASE_URL || "https://api.venice.ai/api/v1";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const res = await fetch(`${base}/image/generate`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: imageModel(),
        prompt: `${imagePrompt}. ${IMAGE_STYLE[mode]}.`.slice(0, 1400),
        negative_prompt: IMAGE_NEG,
        width: 1024,
        height: 1024,
        format: "webp",
        safe_mode: true,
        return_binary: false,
        hide_watermark: true,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { images?: string[] };
    const b64 = data?.images?.[0];
    return typeof b64 === "string" && b64.length > 0 ? `data:image/webp;base64,${b64}` : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Fill the worksheet's image blocks with real generated art (in parallel, capped),
// then enforce visual honesty: any image block left with neither a generated picture
// nor a real curated svgKey degrades to an honest "draw it yourself" box, never blank.
async function attachImages(ws: Worksheet, mode: ResourceMode, key: string): Promise<void> {
  const targets = ws.blocks.filter((b) => b.kind === "image" && b.imagePrompt);
  await Promise.all(
    targets.slice(0, imageMax()).map(async (b) => {
      const url = await generateImage(b.imagePrompt as string, mode, key);
      if (url) b.dataUrl = url;
    }),
  );
  for (const b of ws.blocks) {
    if (b.kind !== "image") continue;
    const hasArt = b.dataUrl || (b.svgKey && SVG_ART[b.svgKey]);
    if (!hasArt) {
      b.kind = "draw";
      b.prompt = b.prompt || "Draw the picture here.";
      b.rows = b.rows ?? 7;
      delete b.imagePrompt;
      delete b.svgKey;
    }
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
  const model = process.env.VENICE_MODEL || "qwen3-235b-a22b-instruct-2507";
  const msgs = buildMessages(template, age, messages, childName);
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: msgs,
        temperature: 0.55,
        max_tokens: 4000,
        venice_parameters: { include_venice_system_prompt: false },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return null;
    const parsed = extractJson(text);
    if (!parsed) return null;
    const ws = normalize(parsed, template, age, childName);
    if (ws && imagesEnabled()) await attachImages(ws, detectMode(template, messages), key);
    return ws;
  } catch {
    return null;
  }
}

export { getTemplate };
