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
import { ILLUSTRATION_HINT, hasIllustration, pickIllustrationFor } from "./illustrations";
import { detectTheme, intentPreamble, type Theme } from "./intent";
import { SVG_ART } from "./svg-art";
import { capName } from "./util";
import type { ChatMessage, Worksheet, WorksheetBlock, WorksheetTemplate } from "./types";

// ── shared helpers ───────────────────────────────────────────────────────────

const article = (w: string) => (/^[aeiou]/i.test(w.trim()) ? "an" : "a");
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Each "make it harder" compounds and each "easier" steps back, so pressing
// harder again visibly raises difficulty every time. Returns the net level.
function detectDifficulty(text: string): number {
  const t = text.toLowerCase();
  const up = (t.match(/harder|tricky|trickier|challeng|advanced|tougher|more difficult/g) || []).length;
  const down = (t.match(/easier|simpler|simple|gentle|beginner|too hard|younger/g) || []).length;
  return Math.max(-3, Math.min(5, up - down));
}

function detectMore(text: string): number {
  const t = text.toLowerCase();
  const up = (t.match(/\b(more|longer|add|extra|additional|another|lots|in.?depth)\b/g) || []).length;
  const down = (t.match(/\b(shorter|fewer|less|briefer|quicker)\b/g) || []).length;
  return Math.max(0.35, Math.min(2.8, 1 + up * 0.6 - down * 0.3));
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

// Six difficulty bands across the 3-13 stepper. This is what makes age change
// the actual CONTENT (concepts, vocabulary, question types), not just the
// number of questions. Chat harder/easier asks shift the band itself, so an
// explicit ask always visibly changes the work.
//   1: 3-4 (pre-K)   2: 5-6 (K-1)   3: 7-8 (Gr 2-3)
//   4: 9-10 (Gr 4-5) 5: 11-12 (Gr 6-7) 6: 13 (Gr 8)
type Band = 1 | 2 | 3 | 4 | 5 | 6;
function band(age: number, diff = 0): Band {
  const a = Math.min(13, Math.max(3, age));
  const base = a <= 4 ? 1 : a <= 6 ? 2 : a <= 8 ? 3 : a <= 10 ? 4 : a <= 12 ? 5 : 6;
  const shift = diff === 0 ? 0 : Math.sign(diff) * Math.min(2, Math.abs(diff));
  return Math.min(6, Math.max(1, base + shift)) as Band;
}
const byBand = <T,>(ctx: Ctx, table: [T, T, T, T, T, T]): T => table[band(ctx.age, ctx.diff) - 1];

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
  theme: Theme;
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
  const b6 = band(ctx.age, ctx.diff);
  if (op === "mul") {
    // Floor rises with the ceiling: age 13 gets 30..99 × 30..99, never 2 × 3.
    const hi = factorCeiling(ctx.age, ctx.diff);
    const lo = hi >= 15 ? Math.max(3, Math.round(hi * 0.3)) : 2;
    for (let i = 0; i < count; i++) {
      const a = rint(lo, hi);
      const b = rint(lo, hi);
      items.push(`${a} × ${b} =`);
      answers.push(`${a * b}`);
    }
  } else if (op === "div") {
    const hi = factorCeiling(ctx.age, ctx.diff);
    const lo = hi >= 15 ? Math.max(3, Math.round(hi * 0.3)) : 2;
    for (let i = 0; i < count; i++) {
      const b = rint(2, Math.min(12, hi)); // divisor stays a clean 1-2 digit, like Venice
      const ans = rint(lo, hi); // quotient scales with age -> multi-digit dividend
      items.push(`${b * ans} ÷ ${b} =`);
      answers.push(`${ans}`);
    }
  } else {
    // Band-driven ranges with REAL FLOORS so age 13 never rolls "3 − 2" and
    // age 4 never rolls 3-digit borrowing. [aMin, aMax, bMin] per band; the
    // tables keep aMin > 2×bMin so subtraction answers stay meaty too.
    const [aMin, aMax, bMin] = byBand<[number, number, number]>(ctx, [
      [2, 10, 1], // 1 · pre-K: within 10
      [6, 20, 2], // 2 · K-1: within 20
      [15, 99, 6], // 3 · Gr 2-3: 2-digit with carrying/borrowing
      [120, 999, 45], // 4 · Gr 4-5: 3-digit
      [1200, 9999, 350], // 5 · Gr 6-7: 4-digit, some decimals
      [12000, 99999, 4500], // 6 · Gr 8: 5-digit, decimals, integers
    ]);
    const dp = b6 === 5 ? 1 : b6 === 6 ? 2 : 0; // top bands mix in decimals
    const scale = Math.pow(10, dp);
    const neg = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);
    for (let i = 0; i < count; i++) {
      // Band 6 subtraction: every 4th problem is Grade-8 integers, where the
      // answer can genuinely go below zero.
      if (op === "sub" && b6 === 6 && i % 4 === 3) {
        const a = rint(-90, 90);
        const c = rint(-90, 90);
        items.push(`${neg(a)} − (${neg(c)}) =`);
        answers.push(neg(a - c));
        continue;
      }
      const A = rint(aMin, aMax);
      const B = op === "sub" ? rint(bMin, A - bMin) : rint(bMin, aMax);
      if (dp > 0 && i % 3 === 2) {
        // decimals built from the same integer draw, so answers stay exact
        items.push(`${(A / scale).toFixed(dp)} ${op === "sub" ? "−" : "+"} ${(B / scale).toFixed(dp)} =`);
        answers.push(((op === "sub" ? A - B : A + B) / scale).toFixed(dp));
      } else {
        items.push(op === "sub" ? `${A} − ${B} =` : `${A} + ${B} =`);
        answers.push(`${op === "sub" ? A - B : A + B}`);
      }
    }
  }
  // The math renderer gives open working space under each problem, no answer
  // box — the instruction has to match what's on the page.
  return { kind: "math", prompt: "Solve each one. Show your work.", items, answers };
}

function columnMathBlock(ctx: Ctx, op: "add" | "sub"): WorksheetBlock {
  // Same band tables idea as mathBlock, tuned for column work: both numbers
  // are always multi-digit enough that lining up the digits means something.
  const [aMin, aMax, bMin] = byBand<[number, number, number]>(ctx, [
    [6, 10, 2], // 1 · pre-K (rarely hit: column math starts with the 5+ templates)
    [10, 30, 4], // 2 · K-1
    [25, 99, 12], // 3 · Gr 2-3: 2-digit
    [250, 999, 120], // 4 · Gr 4-5: 3-digit
    [2500, 9999, 1200], // 5 · Gr 6-7: 4-digit
    [25000, 99999, 12000], // 6 · Gr 8: 5-digit
  ]);
  const forceRegroup = band(ctx.age, ctx.diff) >= 3;
  const count = cnt(6, ctx, 12);
  const items: string[] = [];
  const answers: string[] = [];
  for (let i = 0; i < count; i++) {
    let a = rint(aMin, aMax);
    let b = op === "sub" ? rint(bMin, a - bMin) : rint(bMin, aMax);
    // Column work exists to practise carrying/borrowing — from band 3 up,
    // redraw a few times until the ones column actually regroups.
    for (let t = 0; forceRegroup && t < 8 && !(op === "sub" ? a % 10 < b % 10 : (a % 10) + (b % 10) >= 10); t++) {
      a = rint(aMin, aMax);
      b = op === "sub" ? rint(bMin, a - bMin) : rint(bMin, aMax);
    }
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
  // Band 4+ works in dollars AND cents with decimals; younger stays whole-dollar.
  const cents = band(ctx.age, ctx.diff) >= 4;
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
  const b = band(ctx.age, ctx.diff);
  const d = (c: number) => `$${(c / 100).toFixed(2)}`;
  if (b >= 6) {
    const weeklyC = rint(8, 20) * 100;
    const itemC = Math.round(rint(2400, 6000) / 4) * 4;
    const hourlyC = rint(12, 18) * 100;
    const hours = rint(3, 6);
    const spendC = hourlyC * hours - rint(500, 1500);
    const phoneC = Math.round(rint(30000, 80000) / 100) * 100;
    return {
      kind: "short-answer",
      prompt: "Work each one out step by step. Write the answer with a $ sign.",
      items: [
        `${subj} ${ctx.name ? "saves" : "save"} ${d(weeklyC)} a week toward a ${d(itemC)} item. How many weeks until ${ctx.name ? "Sam" : "you"} can buy it, and how much is left over?`,
        `A job pays ${d(hourlyC)} an hour. After working ${hours} hours and spending ${d(spendC)}, how much is left?  $____`,
        `A ${d(phoneC)} phone is 20% off, then 10% tax is added to the sale price. What do you actually pay?  $____`,
        `Which is the better deal: 3 notebooks for ${d(750)}, or 5 notebooks for ${d(1150)}? Show the price per notebook.`,
      ],
      rows: 2,
      answers: [
        `${Math.ceil(itemC / weeklyC)} weeks, ${d(Math.ceil(itemC / weeklyC) * weeklyC - itemC)} left over`,
        d(hourlyC * hours - spendC),
        d(Math.round(phoneC * 0.8 * 1.1)),
        `5 for ${d(1150)} (${d(230)} each vs ${d(250)} each)`,
      ],
    };
  }
  if (b >= 4) {
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
  const hi = byBand(ctx, [6, 10, 15, 20, 20, 20]);
  const rows = cnt(4, ctx, 6);
  const items = Array.from({ length: rows }, () => String(rint(2, hi)));
  const what = ctx.theme.key !== "everyday" ? ctx.theme.nouns[0] : "pictures";
  return { kind: "count", prompt: `Count the ${what} in each row. Write how many in the box.`, emoji: ctx.theme.emoji, items, answers: items };
}

function missingNumbersBlock(ctx: Ctx, skipOnly = false): WorksheetBlock {
  // Step sizes AND direction track the band: little kids count on by 1s and
  // 2s, big kids run 2-digit steps and descending sequences.
  const steps = skipOnly
    ? byBand(ctx, [[2], [2, 5, 10], [2, 3, 4, 5, 10], [3, 4, 6, 7, 25], [6, 7, 8, 9, 12, 15], [11, 13, 15, 25, 50]])
    : byBand(ctx, [[1], [1, 2, 5], [2, 3, 5, 10], [3, 4, 6, 25], [7, 8, 9, 12, 15], [12, 15, 25, 40, 50]]);
  const descend = band(ctx.age, ctx.diff) >= 4;
  const rows = cnt(5, ctx, 8);
  const items: string[] = [];
  const answers: string[] = [];
  for (let r = 0; r < rows; r++) {
    const step = steps[rint(0, steps.length - 1)];
    const down = descend && r % 3 === 2; // every third row runs backwards for older kids
    const start = down ? (rint(6, 12) + 5) * step : rint(0, 6) * step;
    const seq = Array.from({ length: 6 }, (_, i) => start + (down ? -i : i) * step);
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
  // Floor scales with the ceiling so older kids never get 2-and-3 word problems.
  const lo = hi >= 12 ? Math.max(3, Math.round(hi * 0.35)) : 2;
  for (let i = 0; i < count; i++) {
    const a = rint(lo, hi);
    const b = rint(lo, hi);
    if (id === "multiplication") {
      items.push(`${subj} ${has} ${a} boxes of ${noun} with ${b} in each box. How many ${noun} in all?`);
      answers.push(`${a * b}`);
    } else if (id === "division") {
      const groups = rint(2, Math.min(12, hi));
      const each = rint(lo, hi);
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
  const b = band(ctx.age, ctx.diff);
  const name: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Write the fraction for one half or one whole.",
      items: ["One out of two equal parts = ____", "Two out of two equal parts = ____"],
      rows: 1,
      answers: ["1/2", "2/2 (one whole)"],
    },
    {
      kind: "short-answer",
      prompt: "Write the fraction (top number over bottom number).",
      items: ["One out of two equal parts = ____", "One out of four = ____", "Three out of four = ____"],
      rows: 1,
      answers: ["1/2", "1/4", "3/4"],
    },
    {
      kind: "short-answer",
      prompt: "Write the fraction (top number over bottom number).",
      items: ["One out of two equal parts = ____", "One out of four = ____", "Three out of four = ____", "Two out of three = ____"],
      rows: 1,
      answers: ["1/2", "1/4", "3/4", "2/3"],
    },
    {
      kind: "short-answer",
      prompt: "Write the fraction, simplified where possible.",
      items: ["Two out of five equal parts = ____", "Three out of eight = ____", "Four out of eight, simplified = ____", "Six out of nine, simplified = ____"],
      rows: 1,
      answers: ["2/5", "3/8", "1/2", "2/3"],
    },
    {
      kind: "short-answer",
      prompt: "Add or subtract. Give the answer in its simplest form.",
      items: ["1/5 + 2/5 = ____", "7/8 − 3/8 = ____", "1/2 + 1/4 = ____", "2/3 − 1/6 = ____"],
      rows: 1,
      answers: ["3/5", "1/2", "3/4", "1/2"],
    },
    {
      kind: "short-answer",
      prompt: "Work each one out. Give answers in simplest form.",
      items: ["2/3 × 3/4 = ____", "1/2 ÷ 1/4 = ____", "1 3/4 + 2 1/2 = ____", "Write 3/5 as a percent: ____"],
      rows: 1,
      answers: ["1/2", "2", "4 1/4", "60%"],
    },
  ]);
  const f = scaleFactor(ctx.age, ctx.diff);
  const ofItems: string[] = [];
  const ofAns: string[] = [];
  const denoms = byBand(ctx, [[2], [2, 4], [2, 3, 4], [3, 4, 5, 8], [4, 5, 6, 8, 10], [6, 8, 12, 20, 25]]);
  const numeratorsToo = b >= 5; // 3/4 of 20, not just 1/4
  for (let i = 0; i < cnt(4, ctx, 8); i++) {
    const d = denoms[rint(0, denoms.length - 1)];
    const mult = rint(1, Math.max(2, Math.round(3 * f)));
    const whole = d * mult;
    const num = numeratorsToo ? rint(1, d - 1) : 1;
    ofItems.push(`${num}/${d} of ${whole} =`);
    ofAns.push(`${(whole / d) * num}`);
  }
  const ofNum: WorksheetBlock = { kind: "math", prompt: "Find the fraction of the number.", items: ofItems, answers: ofAns };
  const compare: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Circle the bigger share.",
      items: ["Half a cookie or a whole cookie → ____", "1/2 or 1/4 of the same pizza → ____"],
      rows: 1,
      answers: ["a whole cookie", "1/2"],
    },
    {
      kind: "short-answer",
      prompt: "Circle the bigger fraction.",
      items: ["1/2 or 1/4 → ____", "2/3 or 1/3 → ____", "3/4 or 1/2 → ____"],
      rows: 1,
      answers: ["1/2", "2/3", "3/4"],
    },
    {
      kind: "short-answer",
      prompt: "Circle the bigger fraction.",
      items: ["1/2 or 1/4 → ____", "2/3 or 1/3 → ____", "3/4 or 1/2 → ____", "2/5 or 2/3 → ____"],
      rows: 1,
      answers: ["1/2", "2/3", "3/4", "2/3"],
    },
    {
      kind: "short-answer",
      prompt: "Write the bigger fraction, then complete the equivalent fraction.",
      items: ["3/4 or 2/3 → ____", "5/8 or 1/2 → ____", "1/2 = ?/4 → ____", "1/3 = ?/9 → ____"],
      rows: 1,
      answers: ["3/4", "5/8", "2/4", "3/9"],
    },
    {
      kind: "short-answer",
      prompt: "Convert between fractions and decimals.",
      items: ["1/2 = ____ (decimal)", "0.75 = ____ (fraction)", "3/10 = ____ (decimal)", "0.2 = ____ (fraction, simplest form)"],
      rows: 1,
      answers: ["0.5", "3/4", "0.3", "1/5"],
    },
    {
      kind: "short-answer",
      prompt: "Order each set from smallest to largest.",
      items: ["2/3,  0.6,  70% → ____", "1/4,  0.3,  1/5 → ____", "0.45,  4/10,  1/2 → ____"],
      rows: 1,
      answers: ["0.6, 2/3, 70%", "1/5, 1/4, 0.3", "4/10, 0.45, 1/2"],
    },
  ]);
  return [intro(ctx), name, ofNum, compare];
}

// ── place value ──────────────────────────────────────────────────────────────

function placeValueBlocks(ctx: Ctx): WorksheetBlock[] {
  const value: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Count the tens and ones.",
      items: ["1 ten and 3 ones = ____", "2 tens and 0 ones = ____", "1 ten and 7 ones = ____"],
      rows: 1,
      answers: ["13", "20", "17"],
    },
    {
      kind: "short-answer",
      prompt: "Write what the first digit is worth.",
      items: ["In 53 the 5 is worth ____", "In 91 the 9 is worth ____", "In 24 the 2 is worth ____", "In 68 the 6 is worth ____"],
      rows: 1,
      answers: ["50", "90", "20", "60"],
    },
    {
      kind: "short-answer",
      prompt: "Write what the bold digit is worth.",
      items: ["In 53 the 5 is worth ____", "In 248 the 2 is worth ____", "In 91 the 9 is worth ____", "In 607 the 6 is worth ____"],
      rows: 1,
      answers: ["50", "200", "90", "600"],
    },
    {
      kind: "short-answer",
      prompt: "Write what the bold digit is worth.",
      items: ["In 4,827 the 8 is worth ____", "In 1,560 the 1 is worth ____", "In 3,094 the 9 is worth ____", "In 7,213 the 2 is worth ____"],
      rows: 1,
      answers: ["800", "1,000", "90", "200"],
    },
    {
      kind: "short-answer",
      prompt: "Write what the bold digit is worth (watch the decimals).",
      items: ["In 46,205 the 6 is worth ____", "In 3.72 the 7 is worth ____", "In 518,940 the 5 is worth ____", "In 12.083 the 8 is worth ____"],
      rows: 1,
      answers: ["6,000", "7 tenths (0.7)", "500,000", "8 hundredths (0.08)"],
    },
    {
      kind: "short-answer",
      prompt: "Round each number to the place given.",
      items: ["4,268,371 to the nearest hundred thousand = ____", "6.4518 to the nearest hundredth = ____", "35,449 to the nearest thousand = ____", "0.0972 to the nearest tenth = ____"],
      rows: 1,
      answers: ["4,300,000", "6.45", "35,000", "0.1"],
    },
  ]);
  const expand: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Write the number.",
      items: ["1 ten and 5 ones = ____", "2 tens and 2 ones = ____"],
      rows: 1,
      answers: ["15", "22"],
    },
    {
      kind: "short-answer",
      prompt: "Write the number.",
      items: ["4 tens and 3 ones = ____", "6 tens and 0 ones = ____", "20 + 9 = ____"],
      rows: 1,
      answers: ["43", "60", "29"],
    },
    {
      kind: "short-answer",
      prompt: "Write the number.",
      items: ["4 tens and 3 ones = ____", "2 hundreds, 0 tens, 7 ones = ____", "300 + 50 + 6 = ____"],
      rows: 1,
      answers: ["43", "207", "356"],
    },
    {
      kind: "short-answer",
      prompt: "Write the number.",
      items: ["3 thousands, 4 hundreds, 0 tens, 6 ones = ____", "5,000 + 200 + 70 + 1 = ____", "Expanded form of 2,408 = ____"],
      rows: 1,
      answers: ["3,406", "5,271", "2,000 + 400 + 0 + 8"],
    },
    {
      kind: "short-answer",
      prompt: "Write each one.",
      items: ["Expanded form of 60,159 = ____", "40,000 + 3,000 + 20 + 5 = ____", "Expanded form of 8.34 = ____", "Two hundred six thousand, fifty in digits = ____"],
      rows: 1,
      answers: ["60,000 + 100 + 50 + 9", "43,025", "8 + 0.3 + 0.04", "206,050"],
    },
    {
      kind: "short-answer",
      prompt: "Write each one.",
      items: ["7.4 million in digits = ____", "Expanded form of 3,050,208 = ____", "9 × 10,000 + 4 × 100 + 7 × 0.1 = ____", "Half a million minus one = ____"],
      rows: 1,
      answers: ["7,400,000", "3,000,000 + 50,000 + 200 + 8", "90,400.7", "499,999"],
    },
  ]);
  const order: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Put the numbers in order, smallest first.",
      items: ["8   3   6 → ____", "12   9   15 → ____"],
      rows: 1,
      answers: ["3, 6, 8", "9, 12, 15"],
    },
    {
      kind: "short-answer",
      prompt: "Put the numbers in order, smallest first.",
      items: ["34   7   19   52 → ____", "105   99   150 → ____"],
      rows: 1,
      answers: ["7, 19, 34, 52", "99, 105, 150"],
    },
    {
      kind: "short-answer",
      prompt: "Put the numbers in order, smallest first.",
      items: ["340   87   190   520 → ____", "1,005   999   1,050 → ____"],
      rows: 1,
      answers: ["87, 190, 340, 520", "999, 1,005, 1,050"],
    },
    {
      kind: "short-answer",
      prompt: "Put the numbers in order, smallest first.",
      items: ["1,240   980   1,209   875 → ____", "3,001   3,010   2,999 → ____"],
      rows: 1,
      answers: ["875, 980, 1,209, 1,240", "2,999, 3,001, 3,010"],
    },
    {
      kind: "short-answer",
      prompt: "Put the numbers in order, smallest first.",
      items: ["0.5   0.45   0.505 → ____", "12,090   12,900   12,009 → ____", "3.2   3.02   3.22 → ____"],
      rows: 1,
      answers: ["0.45, 0.5, 0.505", "12,009, 12,090, 12,900", "3.02, 3.2, 3.22"],
    },
    {
      kind: "short-answer",
      prompt: "Put each set in order, smallest first (watch the negatives).",
      items: ["−4   2   −7   0 → ____", "0.099   0.1   0.09 → ____", "−1.5   −1.05   −1.55 → ____"],
      rows: 1,
      answers: ["−7, −4, 0, 2", "0.09, 0.099, 0.1", "−1.55, −1.5, −1.05"],
    },
  ]);
  return [intro(ctx), value, expand, order];
}

// ── telling time ───────────────────────────────────────────────────────────

function timeBlocks(ctx: Ctx): WorksheetBlock[] {
  const b = band(ctx.age, ctx.diff);
  const write: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Write each time with numbers, like 3:00.",
      items: ["Three o'clock = ____", "Seven o'clock = ____", "Ten o'clock = ____"],
      rows: 1,
      answers: ["3:00", "7:00", "10:00"],
    },
    {
      kind: "short-answer",
      prompt: "Write each time with numbers, like 3:00.",
      items: ["Three o'clock = ____", "Half past 6 = ____", "Nine o'clock = ____", "Half past 11 = ____"],
      rows: 1,
      answers: ["3:00", "6:30", "9:00", "11:30"],
    },
    {
      kind: "short-answer",
      prompt: "Write each time with numbers, like 3:00.",
      items: ["Quarter past 4 = ____", "Quarter to 8 = ____", "Half past 6 = ____", "Twenty-five past 2 = ____", "Five to 10 = ____"],
      rows: 1,
      answers: ["4:15", "7:45", "6:30", "2:25", "9:55"],
    },
    {
      kind: "short-answer",
      prompt: "Work out each elapsed time.",
      items: [
        "Practice starts at 3:15 and ends at 4:45. How long is it? ____",
        "A movie starts at 6:40 and runs 1 hour 35 minutes. When does it end? ____",
        "You wake at 7:05 and leave at 8:00. How many minutes is that? ____",
        "Lunch is at 12:30. It is 9:45 now. How long until lunch? ____",
      ],
      rows: 1,
      answers: ["1 hour 30 minutes", "8:15", "55 minutes", "2 hours 45 minutes"],
    },
    {
      kind: "short-answer",
      prompt: "Convert between 12-hour and 24-hour time.",
      items: ["3:20 pm = ____ (24-hour)", "19:45 = ____ (12-hour)", "12:00 midnight = ____ (24-hour)", "08:05 = ____ (12-hour)", "9:10 pm = ____ (24-hour)"],
      rows: 1,
      answers: ["15:20", "7:45 pm", "00:00", "8:05 am", "21:10"],
    },
    {
      kind: "short-answer",
      prompt: "Solve each schedule problem.",
      items: [
        "A train leaves at 09:35 and arrives at 14:10. How long is the trip? ____",
        "It is 4:00 pm in New York and 6 hours later in London. What time is it in London? ____",
        "A ferry runs every 40 minutes starting at 06:20. What time is the 5th ferry? ____",
        "Homework takes 25 minutes per subject. You have 4 subjects and must finish by 8:00 pm. What is the latest you can start? ____",
      ],
      rows: 1,
      answers: ["4 hours 35 minutes", "10:00 pm", "09:00", "6:20 pm"],
    },
  ]);
  const match: WorksheetBlock = {
    kind: "matching",
    prompt: "Draw a line to match each time to the way we say it.",
    pairs:
      b >= 3
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
  if (b === 3) {
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
  const sides: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Write how many sides each shape has.",
      items: ["A triangle has ____ sides.", "A square has ____ sides.", "A circle has ____ sides."],
      rows: 1,
      answers: ["3", "4", "0"],
    },
    {
      kind: "short-answer",
      prompt: "Write how many sides each shape has.",
      items: ["A triangle has ____ sides.", "A square has ____ sides.", "A circle has ____ sides.", "A rectangle has ____ sides."],
      rows: 1,
      answers: ["3", "4", "0", "4"],
    },
    {
      kind: "short-answer",
      prompt: "Write how many sides each shape has.",
      items: ["A triangle has ____ sides.", "A square has ____ sides.", "A pentagon has ____ sides.", "A hexagon has ____ sides.", "An octagon has ____ sides."],
      rows: 1,
      answers: ["3", "4", "5", "6", "8"],
    },
    {
      kind: "short-answer",
      prompt: "Answer each one about 3D shapes.",
      items: ["A cube has ____ faces.", "A cube has ____ edges.", "A square pyramid has ____ faces.", "A cylinder has ____ flat faces.", "A sphere has ____ edges."],
      rows: 1,
      answers: ["6", "12", "5", "2", "0"],
    },
    {
      kind: "short-answer",
      prompt: "Work out the perimeter or the missing side.",
      items: [
        "A rectangle is 8 cm by 5 cm. Perimeter = ____",
        "A square has a perimeter of 36 cm. Each side = ____",
        "A triangle has sides 7 cm, 9 cm and 12 cm. Perimeter = ____",
        "A regular hexagon has 6 cm sides. Perimeter = ____",
      ],
      rows: 1,
      answers: ["26 cm", "9 cm", "28 cm", "36 cm"],
    },
    {
      kind: "short-answer",
      prompt: "Work out the area or perimeter.",
      items: [
        "A rectangle is 9 cm by 7 cm. Area = ____",
        "A square has an area of 64 cm². Each side = ____ and its perimeter = ____",
        "A triangle has a base of 10 cm and a height of 6 cm. Area = ____",
        "An L-shape is a 6x4 rectangle with a 2x2 square cut from one corner. Area = ____",
      ],
      rows: 1,
      answers: ["63 cm²", "8 cm, 32 cm", "30 cm²", "20 cm²"],
    },
  ]);
  const match: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "matching",
      prompt: "Draw a line to match each shape to the number of sides it has.",
      pairs: [
        { left: "triangle", right: "3 sides" },
        { left: "square", right: "4 sides" },
        { left: "circle", right: "round, 0 sides" },
      ],
    },
    {
      kind: "matching",
      prompt: "Draw a line to match each shape to the number of sides it has.",
      pairs: [
        { left: "triangle", right: "3 sides" },
        { left: "rectangle", right: "4 sides" },
        { left: "circle", right: "round, 0 sides" },
        { left: "hexagon", right: "6 sides" },
      ],
    },
    {
      kind: "matching",
      prompt: "Draw a line to match each shape to the number of sides it has.",
      pairs: [
        { left: "triangle", right: "3 sides" },
        { left: "rectangle", right: "4 sides" },
        { left: "pentagon", right: "5 sides" },
        { left: "hexagon", right: "6 sides" },
      ],
    },
    {
      kind: "matching",
      prompt: "Draw a line to match each 3D shape to a real thing with that shape.",
      pairs: [
        { left: "sphere", right: "a basketball" },
        { left: "cylinder", right: "a soup can" },
        { left: "cube", right: "a dice" },
        { left: "cone", right: "an ice cream cone" },
      ],
    },
    {
      kind: "matching",
      prompt: "Draw a line to match each angle to its type.",
      pairs: [
        { left: "90°", right: "right angle" },
        { left: "45°", right: "acute angle" },
        { left: "120°", right: "obtuse angle" },
        { left: "180°", right: "straight angle" },
      ],
    },
    {
      kind: "matching",
      prompt: "Draw a line to match each triangle to its name.",
      pairs: [
        { left: "all sides equal", right: "equilateral" },
        { left: "two sides equal", right: "isosceles" },
        { left: "no sides equal", right: "scalene" },
        { left: "one 90° angle", right: "right triangle" },
      ],
    },
  ]);
  const draw: WorksheetBlock = {
    kind: "draw",
    prompt: byBand(ctx, [
      "Draw a circle, a square and a triangle.",
      "Draw a circle, a square and a triangle. Write the name under each one.",
      "Draw a pentagon and a hexagon. Next to each, write how many sides and corners it has.",
      "Draw a cube (a square with depth). Label one face, one edge, and one corner (vertex).",
      "Draw a rectangle and label its length and width, then write the formula for its perimeter.",
      "Draw a triangle with a base of about 8 cm. Mark its base and height, then write the formula for its area.",
    ]),
    rows: 7,
  };
  return [intro(ctx), sides, match, draw];
}

// ── patterns ─────────────────────────────────────────────────────────────────

function patternsBlocks(ctx: Ctx): WorksheetBlock[] {
  const complete: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "missing-numbers",
      prompt: "Say each pattern out loud, then finish it.",
      items: ["red,  blue,  red,  blue,  ____", "circle,  square,  circle,  square,  ____", "up,  down,  up,  ____"],
      answers: ["red", "circle", "down"],
    },
    {
      kind: "missing-numbers",
      prompt: "Finish each pattern. Write what comes in the blanks.",
      items: ["red,  blue,  red,  blue,  ____", "circle,  square,  circle,  square,  ____", "A,  B,  A,  B,  ____,  ____", "1,  2,  3,  ____,  ____"],
      answers: ["red", "circle", "A, B", "4, 5"],
    },
    {
      kind: "missing-numbers",
      prompt: "Finish each pattern. Write what comes in the blanks.",
      items: ["2,  4,  6,  ____,  ____", "5,  10,  15,  ____,  ____", "A,  B,  C,  ____,  ____", "10,  9,  8,  ____,  ____"],
      answers: ["8, 10", "20, 25", "D, E", "7, 6"],
    },
    {
      kind: "missing-numbers",
      prompt: "Finish each pattern, then write the RULE it follows (like: add 3).",
      items: ["3,  6,  9,  ____,  ____   Rule: ____", "1,  2,  4,  8,  ____   Rule: ____", "50,  45,  40,  ____,  ____   Rule: ____", "1,  4,  9,  16,  ____   Rule: ____"],
      answers: ["12, 15 (add 3)", "16 (double it)", "35, 30 (take away 5)", "25 (square numbers)"],
    },
    {
      kind: "missing-numbers",
      prompt: "Finish each pattern and write the rule. Two of these use TWO steps.",
      items: ["2,  5,  11,  23,  ____   Rule: ____", "1,  1,  2,  3,  5,  8,  ____   Rule: ____", "100,  90,  81,  73,  ____   Rule: ____", "3,  6,  12,  24,  ____   Rule: ____"],
      answers: ["47 (double, then add 1)", "13 (add the two before it)", "66 (subtract 10, 9, 8, 7...)", "48 (double it)"],
    },
    {
      kind: "missing-numbers",
      prompt: "Finish each pattern, write the rule, then write the 10th term where asked.",
      items: [
        "4,  7,  10,  13,  ____   Rule: ____   10th term: ____",
        "2,  6,  18,  54,  ____   Rule: ____",
        "1,  8,  27,  64,  ____   Rule: ____",
        "1,  1,  2,  3,  5,  8,  13,  ____,  ____   Rule: ____",
      ],
      answers: ["16 (add 3), 10th term: 31", "162 (multiply by 3)", "125 (cube numbers)", "21, 34 (add the two before it)"],
    },
  ]);
  const draw: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    { kind: "draw", prompt: "Make your own pattern. Draw at least six shapes or colors in a row that repeat.", rows: 5 },
    { kind: "draw", prompt: "Make your own pattern. Draw at least six shapes or colors in a row that repeat.", rows: 5 },
    { kind: "draw", prompt: "Make your own repeating pattern with THREE things in it (like star, moon, sun).", rows: 5 },
    { kind: "draw", prompt: "Make your own number pattern with a secret rule. Write the first five numbers and see if someone can guess the rule.", rows: 4 },
    { kind: "draw", prompt: "Invent a two-step number pattern (like: double, then subtract 1). Write the first six numbers and the rule.", rows: 4 },
    { kind: "draw", prompt: "Invent a pattern whose rule uses squaring or multiplying. Write the first five terms, the rule, and the 10th term.", rows: 4 },
  ]);
  return [intro(ctx), complete, draw];
}

// ── phonics ──────────────────────────────────────────────────────────────────

function phonicsBlocks(ctx: Ctx): WorksheetBlock[] {
  const trace: WorksheetBlock = {
    kind: "trace",
    prompt: byBand(ctx, [
      "Trace each letter, then say its sound out loud.",
      "Trace each word, then read it out loud.",
      "Trace each one, then say the sound it makes.",
      "Trace each word, then underline the vowel team.",
      "Trace each word part, then say a word that uses it.",
      "Trace each root, then say what it means.",
    ]),
    text: byBand(ctx, [
      "s   a   t   p   i   n   m   d",
      "-at: cat  hat  bat    -ig: pig  dig  wig",
      "sh: ship  shell    ch: chip  chat    th: thin  moth",
      "ai: rain  train    ea: leaf  beach    oa: boat  coat",
      "un-: undo    re-: redo    -ful: helpful    -tion: action",
      "photo (light)    graph (write)    aqua (water)    tele (far)",
    ]),
  };
  const fill: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "fill-blank",
      prompt: "Say the picture word, then write its first letter. Use the word bank.",
      items: ["__at  (it says meow)", "__un  (it is hot and bright)", "__ig  (it says oink)", "__at  (you wear it on your head)"],
      wordBank: ["c", "s", "p", "h"],
      answers: ["cat", "sun", "pig", "hat"],
    },
    {
      kind: "fill-blank",
      prompt: "Add the missing vowel to finish each word. Use the word bank.",
      items: ["c__t", "d__g", "s__n", "b__g", "h__t"],
      wordBank: ["a", "o", "u"],
      answers: ["cat", "dog", "sun", "bug", "hat"],
    },
    {
      kind: "fill-blank",
      prompt: "Add sh, ch, or th to finish each word.",
      items: ["__ip  (it sails on the sea)", "__air  (you sit on it)", "ba__  (you wash in it)", "__ick  (a baby hen)", "tee__  (you brush them)"],
      wordBank: ["sh", "ch", "th"],
      answers: ["ship", "chair", "bath", "chick", "teeth"],
    },
    {
      kind: "fill-blank",
      prompt: "Add the missing vowel team (ai, ea, oa, or ee) to finish each word.",
      items: ["r__n falls from the clouds", "a b__t floats on water", "gr__n is the color of grass", "you h__r with your ears", "t__st for breakfast"],
      wordBank: ["ai", "ea", "oa", "ee"],
      answers: ["rain", "boat", "green", "hear", "toast"],
    },
    {
      kind: "fill-blank",
      prompt: "Add the prefix or suffix that fits. Use the word bank.",
      items: ["__happy means not happy", "__write means write again", "care__ means full of care", "act__ means the act of doing", "__possible means not possible"],
      wordBank: ["un", "re", "ful", "ion", "im"],
      answers: ["unhappy", "rewrite", "careful", "action", "impossible"],
    },
    {
      kind: "fill-blank",
      prompt: "Use the root's meaning to finish each word. Use the word bank.",
      items: ["a __graph writes down your words", "an __rium is a tank of water", "__vision lets you see from far away", "a __grapher takes pictures with light", "__scope means to look at something small"],
      wordBank: ["photo", "aqua", "tele", "micro", "phono"],
      answers: ["phonograph", "aquarium", "television", "photographer", "microscope"],
    },
  ]);
  const extra: WorksheetBlock | null = byBand<WorksheetBlock | null>(ctx, [
    null,
    null,
    {
      kind: "short-answer",
      prompt: "Write one more word for each sound.",
      items: ["Another sh word: ____", "Another ch word: ____", "Another th word: ____"],
      rows: 1,
      answers: ["(any sh word)", "(any ch word)", "(any th word)"],
    },
    {
      kind: "short-answer",
      prompt: "Write how many syllables you hear in each word.",
      items: ["rainbow → ____", "beautiful → ____", "toast → ____", "everywhere → ____"],
      rows: 1,
      answers: ["2", "3", "1", "3"],
    },
    {
      kind: "short-answer",
      prompt: "Break each word into its parts (prefix / base / suffix).",
      items: ["unhelpful → ____", "rebuilding → ____", "carelessly → ____"],
      rows: 1,
      answers: ["un + help + ful", "re + build + ing", "care + less + ly"],
    },
    {
      kind: "short-answer",
      prompt: "Write two English words that use each root.",
      items: ["graph (write) → ____", "aqua (water) → ____", "tele (far) → ____"],
      rows: 1,
      answers: ["(e.g. graphite, autograph)", "(e.g. aquarium, aquatic)", "(e.g. telephone, telescope)"],
    },
  ]);
  return extra ? [intro(ctx), trace, fill, extra] : [intro(ctx), trace, fill];
}

// ── sight words ──────────────────────────────────────────────────────────────

function sightWordsBlocks(ctx: Ctx): WorksheetBlock[] {
  const words = byBand(ctx, [
    ["I", "a", "the", "to", "my"],
    ["the", "and", "you", "was", "said"],
    ["because", "there", "their", "would", "could"],
    ["through", "thought", "enough", "favorite", "different"],
    ["necessary", "definitely", "separate", "immediately", "probably"],
    ["privilege", "occurrence", "rhythm", "guarantee", "conscience"],
  ]);
  const trace: WorksheetBlock = { kind: "trace", prompt: "Trace each word, then write it once on your own.", text: words.join("    ") };
  const use: WorksheetBlock = {
    kind: "fill-blank",
    prompt: "Finish each sentence with a word from the list.",
    items: byBand(ctx, [
      ["____ can run fast.", "I see ____ cat.", "We go ____ the park.", "This is ____ toy."],
      ["I can see ____ dog.", "____ you like it?", "We ____ very happy.", "Mom ____ hello."],
      ["I stayed inside ____ it was raining.", "We left our bags over ____.", "The kids lost ____ ball.", "I ____ like to help."],
      ["We walked ____ the tunnel.", "I ____ about it all day.", "That is my ____ book.", "The twins look completely ____."],
      ["Water is ____ for all living things.", "I will ____ be there on time.", "Keep the paints in ____ jars.", "Come home ____ after practice."],
      ["Being trusted is a ____.", "It was a strange ____.", "The drummer kept a steady ____.", "I ____ it will work."],
    ]),
    wordBank: words,
    answers: byBand(ctx, [
      ["I", "a", "to", "my"],
      ["the", "and", "was", "said"],
      ["because", "there", "their", "would"],
      ["through", "thought", "favorite", "different"],
      ["necessary", "definitely", "separate", "immediately"],
      ["privilege", "occurrence", "rhythm", "guarantee"],
    ]),
  };
  const write: WorksheetBlock | null =
    band(ctx.age, ctx.diff) >= 4
      ? { kind: "handwriting", prompt: "Pick three of the words and use each one in a sentence of your own.", rows: 6 }
      : null;
  return write ? [intro(ctx), trace, use, write] : [intro(ctx), trace, use];
}

// ── rhyming ──────────────────────────────────────────────────────────────────

function rhymingBlocks(ctx: Ctx): WorksheetBlock[] {
  const match: WorksheetBlock = {
    kind: "matching",
    prompt: "Draw a line to match each word to the word that rhymes with it.",
    pairs: byBand(ctx, [
      [
        { left: "cat", right: "hat" },
        { left: "dog", right: "log" },
        { left: "sun", right: "bun" },
        { left: "bee", right: "tree" },
      ],
      [
        { left: "cat", right: "hat" },
        { left: "dog", right: "log" },
        { left: "star", right: "car" },
        { left: "sun", right: "bun" },
        { left: "tree", right: "bee" },
      ],
      [
        { left: "light", right: "night" },
        { left: "rain", right: "train" },
        { left: "sheep", right: "sleep" },
        { left: "coat", right: "boat" },
        { left: "chair", right: "bear" },
      ],
      [
        { left: "money", right: "funny" },
        { left: "yellow", right: "fellow" },
        { left: "thunder", right: "wonder" },
        { left: "castle", right: "hassle" },
        { left: "flower", right: "shower" },
      ],
      [
        { left: "ocean", right: "motion" },
        { left: "brighter", right: "writer" },
        { left: "curious", right: "furious" },
        { left: "hollow", right: "follow" },
        { left: "weather", right: "together" },
      ],
      [
        { left: "mystery", right: "history" },
        { left: "collide", right: "beside" },
        { left: "horizon", right: "surprising" },
        { left: "remember", right: "December" },
        { left: "gravity", right: "cavity" },
      ],
    ]),
  };
  const fill: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "fill-blank",
      prompt: "Say each word out loud. Finish the line with the rhyme from the word bank.",
      items: ["The cat sat on a ____.", "The dog sat on a ____.", "I see the sun, it is ____."],
      wordBank: ["mat", "log", "fun"],
      answers: ["mat", "log", "fun"],
    },
    {
      kind: "fill-blank",
      prompt: "Finish each line with a word that rhymes. Use the word bank.",
      items: ["The cat sat on a ____.", "A frog jumped over a ____.", "The bright star is in a ____.", "I had fun in the ____."],
      wordBank: ["mat", "log", "jar", "sun"],
      answers: ["mat", "log", "jar", "sun"],
    },
    {
      kind: "fill-blank",
      prompt: "Finish each line with a rhyming word. Use the word bank.",
      items: ["I turned off the light and said good ____.", "The little boat began to ____.", "We ran through the rain to catch the ____.", "The sleepy sheep fell fast a____."],
      wordBank: ["night", "float", "train", "sleep"],
      answers: ["night", "float", "train", "sleep"],
    },
    {
      kind: "short-answer",
      prompt: "Write two words that rhyme with each word.",
      items: ["shower → ____", "funny → ____", "wonder → ____"],
      rows: 1,
      answers: ["(e.g. flower, tower)", "(e.g. money, sunny)", "(e.g. thunder, under)"],
    },
    {
      kind: "handwriting",
      prompt: "Write a two-line rhyme (a couplet). The last word of each line must rhyme.",
      rows: 4,
    },
    {
      kind: "handwriting",
      prompt: "Write a four-line poem where line 1 rhymes with line 3, and line 2 rhymes with line 4 (ABAB).",
      rows: 6,
    },
  ]);
  return [intro(ctx), match, fill];
}

// ── spelling ─────────────────────────────────────────────────────────────────

function spellingBlocks(ctx: Ctx): WorksheetBlock[] {
  const words = byBand(ctx, [
    ["at", "in", "up", "me", "go"],
    ["cat", "dog", "sun", "big", "red"],
    ["jump", "play", "rain", "tree", "fish"],
    ["because", "friend", "enough", "beautiful", "different"],
    ["separate", "necessary", "embarrass", "definitely", "surprise"],
    ["conscience", "acknowledge", "questionnaire", "miscellaneous", "perseverance"],
  ]);
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
  const id: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Write N next to each naming word (a person, animal, or thing).",
      items: ["dog → ____", "run → ____", "cat → ____", "ball → ____"],
      rows: 1,
      answers: ["N", "", "N", "N"],
    },
    {
      kind: "short-answer",
      prompt: "Write N for naming word (noun) or V for doing word (verb).",
      items: ["dog → ____", "run → ____", "cat → ____", "jump → ____", "sing → ____"],
      rows: 1,
      answers: ["N", "V", "N", "V", "V"],
    },
    {
      kind: "short-answer",
      prompt: "Write N for noun, V for verb, or A for adjective.",
      items: ["dog → ____", "run → ____", "happy → ____", "table → ____", "jump → ____", "bright → ____"],
      rows: 1,
      answers: ["N", "V", "A", "N", "V", "A"],
    },
    {
      kind: "short-answer",
      prompt: "Write N for noun, V for verb, A for adjective, or ADV for adverb.",
      items: ["quickly → ____", "mountain → ____", "whisper → ____", "gentle → ____", "yesterday → ____", "explore → ____"],
      rows: 1,
      answers: ["ADV", "N", "V", "A", "ADV", "V"],
    },
    {
      kind: "short-answer",
      prompt: "Underline the subject and circle the verb, then write them.",
      items: ["The old clock chimed at midnight. → ____", "My little brother collects shiny rocks. → ____", "A flock of geese flew over the lake. → ____"],
      rows: 1,
      answers: ["subject: the old clock, verb: chimed", "subject: my little brother, verb: collects", "subject: a flock of geese, verb: flew"],
    },
    {
      kind: "short-answer",
      prompt: "Label each sentence simple, compound, or complex.",
      items: [
        "The storm ended. → ____",
        "The storm ended, and the sun came out. → ____",
        "Although the storm ended, the streets stayed wet. → ____",
        "Because we left early, we caught the first ferry. → ____",
      ],
      rows: 1,
      answers: ["simple", "compound", "complex", "complex"],
    },
  ]);
  const fix: WorksheetBlock = byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Rewrite each one with a capital letter at the start.",
      items: ["the sun is hot", "my dog runs"],
      rows: 1,
      answers: ["The sun is hot.", "My dog runs."],
    },
    {
      kind: "short-answer",
      prompt: "Rewrite each sentence with a capital letter at the start and the right end mark.",
      items: ["the sun is hot", "my dog likes to run", "we went to the park"],
      rows: 1,
      answers: ["The sun is hot.", "My dog likes to run.", "We went to the park."],
    },
    {
      kind: "short-answer",
      prompt: "Rewrite each sentence with a capital letter at the start and the right end mark.",
      items: ["the dog ran to the park", "do you like ice cream", "what a big tree that is", "we read books on saturday"],
      rows: 1,
      answers: ["The dog ran to the park.", "Do you like ice cream?", "What a big tree that is!", "We read books on Saturday."],
    },
    {
      kind: "short-answer",
      prompt: "Rewrite each sentence in the past tense.",
      items: ["I eat breakfast at seven.", "She runs to the bus stop.", "They build a fort in the yard.", "We think about it all day."],
      rows: 1,
      answers: ["I ate breakfast at seven.", "She ran to the bus stop.", "They built a fort in the yard.", "We thought about it all day."],
    },
    {
      kind: "short-answer",
      prompt: "Add the missing commas, then circle the right homophone.",
      items: [
        "We packed apples oranges and grapes.",
        "(Their / There / They're) going to love this.",
        "Before we left we checked the map.",
        "The dog wagged (its / it's) tail.",
      ],
      rows: 1,
      answers: ["We packed apples, oranges, and grapes.", "They're", "Before we left, we checked the map.", "its"],
    },
    {
      kind: "short-answer",
      prompt: "Rewrite each sentence in the active voice.",
      items: ["The ball was thrown by Maya.", "The bridge was crossed by the hikers.", "The experiment was finished by the class before lunch."],
      rows: 1,
      answers: ["Maya threw the ball.", "The hikers crossed the bridge.", "The class finished the experiment before lunch."],
    },
  ]);
  return [intro(ctx), id, fix];
}

// ── reading + comprehension ───────────────────────────────────────────────────

// Themed reading uses a short INFORMATIONAL passage built from the theme's real
// facts (always accurate + coherent). The everyday case keeps a clean narrative.
function isInformational(ctx: Ctx): boolean {
  return ctx.theme.key !== "everyday" && ctx.theme.facts.length >= 2;
}

function passageBlock(ctx: Ctx): WorksheetBlock {
  const hero = ctx.name || "Milo";
  if (!isInformational(ctx)) {
    const text = byBand(ctx, [
      `${hero} sees the sun. The sun is big. ${hero} runs to play. ${hero} is happy.`,
      `${hero} woke up early. The sun was warm, so ${hero} went outside to play. ${hero} found a little path and followed it up a hill. From the top, everything looked tiny and bright. ${hero} smiled. It had been a very good morning.`,
      `${hero} woke up early on Saturday. The sun was warm, so ${hero} packed a snack and went outside to explore. Behind the garden, ${hero} found a little path and followed it all the way to the top of a hill. From the top, the houses looked tiny and the river shone like silver. ${hero} sat down, ate the snack, and smiled. It had been a very good morning.`,
      `Every Saturday, ${hero} set off to explore. Today ${hero} followed a winding path past the old oak tree and up a steep hill. Halfway up, the path grew rocky and ${hero}'s legs began to ache. Stopping felt tempting, but ${hero} remembered what Grandpa always said: one step at a time. At the very top waited the best view in the whole town, and ${hero} knew the long climb had been worth every step.`,
      `The morning fog still clung to the valley when ${hero} slipped out the back gate. The plan was simple: reach the lookout before the fog lifted and watch the whole town appear below. The path was slick with dew, and twice ${hero} nearly turned back. But curiosity is a stubborn engine. When ${hero} finally reached the lookout, breathless and mud-splattered, the fog began to tear apart like tissue paper, and the town emerged rooftop by rooftop. Some views, ${hero} decided, you have to earn.`,
      `${hero} had read about the abandoned lookout in an old library book, the kind with yellowed maps folded into the back cover. According to the book, the tower had guided river boats for eighty years before the new bridge made it unnecessary. Finding it took most of the morning: the trail had long since surrendered to blackberry and bracken, and more than once ${hero} questioned whether the book was simply wrong. It wasn't. The tower rose out of the trees like something from another century, its paint peeling but its bones still proud. Standing at its base, ${hero} understood something the book had never said directly: places, like people, do not stop mattering just because the world stops needing them.`,
    ]);
    return { kind: "passage", prompt: "Read the story, then answer the questions.", text };
  }
  const label = ctx.theme.label.toLowerCase();
  const n = byBand(ctx, [2, 3, 4, 5, 5, 6]);
  const text = `Let's learn about ${label}. ${ctx.theme.facts.slice(0, Math.min(n, ctx.theme.facts.length)).join(" ")}`;
  return { kind: "passage", prompt: "Read the passage, then answer the questions.", text };
}

function comprehensionQs(ctx: Ctx): WorksheetBlock {
  const hero = ctx.name || "the character";
  const heroName = ctx.name || "Milo";
  if (!isInformational(ctx)) {
    return byBand<WorksheetBlock>(ctx, [
      {
        kind: "short-answer",
        prompt: "Answer each question. A grown-up can write for you.",
        items: ["Who is the story about?", "What does the sun look like?", `How does ${hero} feel?`],
        rows: 1,
        answers: [heroName, "big", "happy"],
      },
      {
        kind: "short-answer",
        prompt: "Answer each question in a full sentence.",
        items: ["Who is the story about?", `Where did ${hero} go?`, `How did ${hero} feel at the end?`, "What was your favorite part?"],
        rows: 2,
        answers: [heroName, "outside, up the hill", "happy", "(opinion)"],
      },
      {
        kind: "short-answer",
        prompt: "Answer each question in a full sentence.",
        items: [`What did ${hero} pack before leaving?`, "Where did the little path lead?", "What did the river look like from the top?", `Why do you think ${hero} smiled at the end?`],
        rows: 2,
        answers: ["a snack", "to the top of a hill", "it shone like silver", "(inference: proud / happy about the morning)"],
      },
      {
        kind: "short-answer",
        prompt: "Answer each question. Two of these ask what you THINK, not just what the story says.",
        items: [
          "What made the climb difficult?",
          `What did Grandpa's advice mean to ${hero}?`,
          `What kind of person is ${hero}? Give one word and explain why.`,
          "What is the lesson of this story?",
        ],
        rows: 2,
        answers: ["the rocky path / aching legs", "keep going little by little", "(e.g. determined, with a reason)", "(perseverance pays off)"],
      },
      {
        kind: "short-answer",
        prompt: "Answer each question. Use evidence from the story where you can.",
        items: [
          `What was ${hero}'s plan, in your own words?`,
          `The story says curiosity is a stubborn engine. What does that mean?`,
          `Find the sentence that shows ${hero} almost gave up, and write it here.`,
          `What does the last line mean: some views you have to earn?`,
        ],
        rows: 2,
        answers: [
          "reach the lookout before the fog lifted",
          "(curiosity keeps pushing you forward)",
          "twice (the hero) nearly turned back",
          "(the best things take effort)",
        ],
      },
      {
        kind: "short-answer",
        prompt: "Answer each question. Cite the story's exact words as evidence where asked.",
        items: [
          "Why was the lookout abandoned? Quote the evidence.",
          "What obstacles made the tower hard to find?",
          "The tower's paint was peeling but its bones were still proud. What is this language doing?",
          `Explain the story's final idea in your own words. Do you agree with ${hero}? Why or why not?`,
        ],
        rows: 2,
        answers: [
          "the new bridge made it unnecessary",
          "the trail had surrendered to blackberry and bracken",
          "(personification, giving the tower dignity)",
          "(things keep mattering even when no longer needed; opinion with reason)",
        ],
      },
    ]);
  }
  const label = ctx.theme.label.toLowerCase();
  return byBand<WorksheetBlock>(ctx, [
    {
      kind: "short-answer",
      prompt: "Talk about it, then a grown-up can write your answer.",
      items: ["What is the passage about?", `Say one thing you learned about ${label}.`],
      rows: 1,
      answers: [ctx.theme.label, "(one fact from the passage)"],
    },
    {
      kind: "short-answer",
      prompt: "Answer each question. You can look back at the passage.",
      items: ["What is the passage mostly about?", "Write one fact you learned.", `What else do you want to know about ${label}?`],
      rows: 2,
      answers: [ctx.theme.label, "(a fact from the passage)", "(child's question)"],
    },
    {
      kind: "short-answer",
      prompt: "Answer each question. You can look back at the passage.",
      items: ["What is the passage mostly about?", "Write two facts you learned from the passage.", `Which fact about ${label} did you find the most interesting? Why?`, `Use the passage to write one sentence of your own about ${label}.`],
      rows: 2,
      answers: [ctx.theme.label, "(two facts from the passage)", "(opinion)", "(child's own sentence)"],
    },
    {
      kind: "short-answer",
      prompt: "Answer each question in full sentences.",
      items: [
        "What is the main idea of this passage?",
        "Write two facts from the passage IN YOUR OWN WORDS.",
        `What is one thing the passage does NOT tell you about ${label} that you would want to find out?`,
        "Which fact would you use to teach a younger kid? Why that one?",
      ],
      rows: 2,
      answers: ["(main idea)", "(two paraphrased facts)", "(child's question)", "(choice with reason)"],
    },
    {
      kind: "short-answer",
      prompt: "Answer each question in full sentences.",
      items: [
        "Summarize the passage in exactly two sentences.",
        `Which fact about ${label} is the most surprising, and what makes it surprising?`,
        "Is this passage written to inform, persuade, or entertain? How can you tell?",
        `Write a question about ${label} that this passage cannot answer, and guess where you could find the answer.`,
      ],
      rows: 2,
      answers: ["(two-sentence summary)", "(opinion with reason)", "inform, because it presents facts", "(question + a source)"],
    },
    {
      kind: "short-answer",
      prompt: "Answer each question in full sentences, citing the passage where asked.",
      items: [
        "Summarize the passage in one sentence without copying any phrase from it.",
        "Which two facts are the most closely connected? Explain the connection.",
        `A younger student says the passage proves everything about ${label}. Explain what a passage this short can and cannot show.`,
        `Plan a one-paragraph report on ${label}: write your topic sentence and list the two facts you would keep.`,
      ],
      rows: 2,
      answers: ["(original one-sentence summary)", "(two facts + connection)", "(short texts give partial pictures)", "(topic sentence + two facts)"],
    },
  ]);
}

function comprehensionMC(ctx: Ctx): WorksheetBlock {
  const hero = ctx.name || "the character";
  if (!isInformational(ctx)) {
    const right = byBand(ctx, [
      `${hero} playing in the sun`,
      `${hero} climbing to the top of a hill`,
      `${hero} exploring a path to the top of a hill`,
      `${hero} finishing a hard climb one step at a time`,
      `${hero} earning a view by pushing through the fog`,
      `${hero} finding a forgotten tower and what it still means`,
    ]);
    return {
      kind: "multiple-choice",
      prompt: "Circle the best answer. What is the story mostly about?",
      items: [right, "A rainy day indoors", "A trip to the grocery store"],
      answers: [right],
    };
  }
  return {
    kind: "multiple-choice",
    prompt: "Circle the best title for this passage.",
    items: [ctx.theme.label, "My Trip to the Grocery Store", "A Lost Library Book"],
    answers: [ctx.theme.label],
  };
}

// ── fill-in-the-blank story ────────────────────────────────────────────────────

function fillStoryBlocks(ctx: Ctx): WorksheetBlock[] {
  const m = ctx.theme.nouns;
  const hero = ctx.name || "Sam";
  const b = band(ctx.age, ctx.diff);
  if (b <= 2) {
    const bank = [m[0], "big", "happy"].filter(Boolean);
    const story: WorksheetBlock = {
      kind: "fill-blank",
      prompt: "Read the story out loud and fill each blank with a word from the bank.",
      items: [`${hero} sees a ____.`, `It is so ____!`, `${hero} feels ____.`],
      wordBank: bank,
      answers: [m[0], "big", "happy"],
    };
    return [intro(ctx), { kind: "word-bank", prompt: "Word bank", wordBank: bank }, story];
  }
  if (b <= 4) {
    const bank = [m[0], m[1], m[2], "happy", "big"].filter(Boolean);
    const story: WorksheetBlock = {
      kind: "fill-blank",
      prompt: "Read the story and fill each blank with a word from the bank.",
      items: [
        `One day ${hero} went to see the ____.`,
        `There were so many ____ everywhere.`,
        `The biggest one was very ____.`,
        `${hero} felt ____ and ran home to tell everyone about the ____.`,
      ],
      wordBank: bank,
      answers: [m[0], m[1], "big", "happy", m[2]],
    };
    return [intro(ctx), { kind: "word-bank", prompt: "Word bank", wordBank: bank }, story];
  }
  // Older kids: the blanks ask for a PART OF SPEECH, not a word from a bank —
  // the classic mad-libs upgrade, then they read their story back.
  const story: WorksheetBlock = {
    kind: "fill-blank",
    prompt: "Fill each blank with your own word. The hint in parentheses tells you what KIND of word it needs.",
    items: [
      `Early one morning, ${hero} discovered a ____ (adjective) ${m[0] || "creature"} behind the ____ (noun).`,
      `It ____ (past-tense verb) so ____ (adverb) that ${hero} nearly dropped the ____ (noun).`,
      `Together they decided to ____ (verb) all the way to the ____ (place).`,
      `By sunset, everyone agreed it was the most ____ (adjective) day since the great ____ (noun) incident.`,
    ],
    answers: ["(any adjective + noun)", "(past-tense verb, adverb, noun)", "(verb + place)", "(adjective + noun)"],
  };
  const readBack: WorksheetBlock = {
    kind: "handwriting",
    prompt: b >= 6 ? "Now rewrite the whole story in your own words, and give it a twist ending." : "Now read your story out loud, then write your favorite sentence from it.",
    rows: b >= 6 ? 8 : 3,
  };
  return [intro(ctx), story, readBack];
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
  const b = band(ctx.age, ctx.diff);
  if (b <= 2) {
    return [
      { kind: "instructions", prompt: p },
      { kind: "draw", prompt: "Draw your story here.", rows: 9 },
      { kind: "handwriting", prompt: "Write one sentence about your picture. A grown-up can help.", rows: 2 },
    ];
  }
  if (b === 3) {
    return [
      { kind: "instructions", prompt: `${p}  You could start with: "It all began when..." or "I could not believe my eyes when..."` },
      { kind: "handwriting", prompt: "Write your story on the lines below.", rows: cnt(8, ctx, 14) },
      { kind: "draw", prompt: "Draw your favorite moment from your story.", rows: 6 },
    ];
  }
  if (b === 4) {
    return [
      { kind: "instructions", prompt: p },
      {
        kind: "short-answer",
        prompt: "Plan first. One line each.",
        items: ["Beginning (how it starts):", "Middle (the problem):", "End (how it works out):"],
        rows: 1,
        answers: ["(plan)", "(plan)", "(plan)"],
      },
      { kind: "handwriting", prompt: "Now write your story. Follow your plan, but let it surprise you.", rows: cnt(10, ctx, 16) },
    ];
  }
  return [
    { kind: "instructions", prompt: p },
    {
      kind: "short-answer",
      prompt: b >= 6 ? "Plan like a writer. One line each." : "Plan first. One line each.",
      items:
        b >= 6
          ? ["Main character (one flaw they have):", "Setting (use two senses to describe it):", "The problem:", "The resolution (avoid 'it was all a dream'):"]
          : ["Main character:", "Setting:", "The problem:", "The resolution:"],
      rows: 1,
      answers: ["(plan)", "(plan)", "(plan)", "(plan)"],
    },
    {
      kind: "handwriting",
      prompt:
        b >= 6
          ? "Write your story. Requirements: at least one line of dialogue, one metaphor or simile, and an ending that echoes your opening line."
          : "Write your story. Include at least one line of dialogue (someone speaking).",
      rows: cnt(12, ctx, 18),
    },
  ];
}

// ── sentence building ──────────────────────────────────────────────────────────

function sentenceBuildingBlocks(ctx: Ctx): WorksheetBlock[] {
  const bank = byBand(ctx, [
    ["the", "dog", "cat", "runs", "sits", "big"],
    ["the", "dog", "ran", "fast", "big", "jumped", "happy", "park"],
    ["the", "fluffy", "rabbit", "hopped", "quickly", "under", "green", "bushes"],
    ["and", "but", "so", "storm", "waves", "sailed", "brave", "captain", "harbor"],
    ["because", "although", "while", "discovered", "ancient", "explorer", "hidden", "valley"],
    ["however", "therefore", "meanwhile", "evidence", "argued", "scientist", "surprising", "result"],
  ]);
  const task = byBand(ctx, [
    "Use the words to build two short sentences. Say each one out loud, then write it.",
    "Use the words to build three full sentences. Start each with a capital letter and end with a period.",
    "Use the words to build three sentences. Each one must include at least one describing word (adjective).",
    "Use the words to build three sentences. At least two must join ideas with and, but, or so.",
    "Use the words to build three sentences. At least two must start or connect with because, although, or while.",
    "Use the words to build a short paragraph of four sentences: a topic sentence, two supporting sentences, and a closing sentence.",
  ]);
  return [
    intro(ctx),
    { kind: "word-bank", prompt: "Word bank", wordBank: bank },
    { kind: "handwriting", prompt: task, rows: cnt(byBand(ctx, [4, 6, 6, 7, 7, 8]), ctx, 12) },
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
  const set = byBand<{ prompt: string; pairs: { left: string; right: string }[] }>(ctx, [
    {
      prompt: "Draw a line to match each number to its word.",
      pairs: [
        { left: "1", right: "one" },
        { left: "2", right: "two" },
        { left: "3", right: "three" },
        { left: "4", right: "four" },
        { left: "5", right: "five" },
      ],
    },
    {
      prompt: "Draw a line to match each word to its opposite.",
      pairs: [
        { left: "big", right: "small" },
        { left: "hot", right: "cold" },
        { left: "up", right: "down" },
        { left: "day", right: "night" },
        { left: "fast", right: "slow" },
      ],
    },
    {
      prompt: "Draw a line to match each word to the word that means the same (a synonym).",
      pairs: [
        { left: "happy", right: "glad" },
        { left: "big", right: "huge" },
        { left: "quick", right: "fast" },
        { left: "shout", right: "yell" },
        { left: "tired", right: "sleepy" },
      ],
    },
    {
      prompt: "Draw a line to match each word to its meaning.",
      pairs: [
        { left: "ancient", right: "very, very old" },
        { left: "fragile", right: "easily broken" },
        { left: "voyage", right: "a long journey" },
        { left: "brilliant", right: "very bright or clever" },
        { left: "vanish", right: "to disappear" },
      ],
    },
    {
      prompt: "Draw a line to match each saying (idiom) to what it really means.",
      pairs: [
        { left: "break the ice", right: "get people talking" },
        { left: "piece of cake", right: "something very easy" },
        { left: "under the weather", right: "feeling sick" },
        { left: "spill the beans", right: "tell a secret" },
        { left: "hit the hay", right: "go to bed" },
      ],
    },
    {
      prompt: "Draw a line to match each word root to its meaning.",
      pairs: [
        { left: "bio", right: "life" },
        { left: "chrono", right: "time" },
        { left: "geo", right: "earth" },
        { left: "audi", right: "hear" },
        { left: "dict", right: "say or speak" },
      ],
    },
  ]);
  const follow: WorksheetBlock | null =
    band(ctx.age, ctx.diff) >= 4
      ? {
          kind: "short-answer",
          prompt: "Pick two pairs you matched and use the LEFT word of each in a sentence of your own.",
          items: ["1.", "2."],
          rows: 2,
          answers: ["(child's sentence)", "(child's sentence)"],
        }
      : null;
  const blocks: WorksheetBlock[] = [intro(ctx), { kind: "matching", prompt: set.prompt, pairs: set.pairs }];
  if (follow) blocks.push(follow);
  return blocks;
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

// Offline enrichment: give a themed fallback sheet the same finish as a
// generated one — a real illustration with fun facts beside it (near the top),
// or, when the theme has no matching picture, a "did you know?" fact callout.
// Mutates the block list in place. No-op for the everyday/no-theme case.
function enrichOffline(blocks: WorksheetBlock[], theme: Theme): void {
  if (theme.key === "everyday") return;
  const hasImage = blocks.some((b) => b.kind === "image");
  if (!hasImage && theme.image && hasIllustration(theme.image)) {
    const at = blocks.length > 1 ? 1 : blocks.length;
    blocks.splice(at, 0, { kind: "image", imageKey: theme.image, notes: theme.facts.slice(0, 3) });
    return;
  }
  const hasFact = blocks.some((b) => b.kind === "fact" || b.kind === "image");
  if (!hasFact && theme.facts.length) {
    blocks.push({ kind: "fact", text: theme.facts[rint(0, theme.facts.length - 1)] });
  }
}

export function templateWorksheet(template: WorksheetTemplate, age: number, instruction: string, childName?: string): Worksheet {
  const theme = detectTheme(instruction);
  const diff = detectDifficulty(instruction);
  const more = detectMore(instruction);
  const name = capName(childName);
  const ctx: Ctx = { template, age, diff, more, theme, name };
  const blocks = compose(ctx);
  enrichOffline(blocks, theme);
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
  "For trace, the actual characters to trace (the digits, letters or words themselves) go in 'text', NOT in items, e.g. {\"kind\":\"trace\",\"text\":\"0  1  2  3  4  5\"}; emit several trace blocks for several rows. handwriting is blank ruled lines for free writing: set 'rows' and say what to write in 'prompt' (no items).",
  "Treat each parent message as an EDIT: a theme word re-themes every item; 'harder'/'easier' changes difficulty; 'more'/'longer' adds items. Always return the FULL updated worksheet.",
  "Do not write the correct answers anywhere on the worksheet itself; put correct answers only in each block's 'answers' array. If a child's name is given use it in word problems and stories; otherwise address the child as 'you' and never invent a name. Do not put raw line breaks inside JSON string values.",
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
  // OFF by default (opt-in via RESOURCES_IMAGES=1). The blocking per-sheet image
  // call adds ~15-25s latency, costs real money per attempt, and the extra Venice
  // load starves the text call (rate-limit -> the whole sheet drops to the
  // fallback). Re-enable only behind a non-blocking, budget-aware design.
  return process.env.RESOURCES_IMAGES === "1";
}
function imageModel(): string {
  return process.env.VENICE_IMAGE_MODEL || "venice-sd35";
}
function imageMax(): number {
  const n = Number(process.env.VENICE_IMAGE_MAX);
  return Number.isFinite(n) && n > 0 ? Math.min(4, Math.round(n)) : 1;
}

// Shared JSON-shape + voice rules for teach and activity modes. (The practice
// SYSTEM above is left byte-for-byte as-is so practice never changes.) Rebuilt
// 2026-06-24 around the model's own feedback on what it follows most reliably:
// state each rule ONCE, structure up front, no contradictions, no bloat.
function schemaSpec(): string[] {
  return [
    'Return ONLY valid JSON: {"title":string,"subtitle":string,"blocks":[Block]}. No markdown, no LaTeX, no line breaks inside string values.',
    'Block = {"kind":string,"prompt"?:string,"text"?:string,"items"?:[string],"pairs"?:[{"left":string,"right":string}],"emoji"?:string,"wordBank"?:[string],"rows"?:number,"answers"?:[string],"imageKey"?:string,"notes"?:[string]}.',
    "Block kinds: instructions, passage, fact, image, draw, short-answer, multiple-choice, fill-blank, word-bank, matching, count, missing-numbers, trace, handwriting, math, column-math.",
    "passage = heading in 'prompt', teaching text in 'text'. fact = one surprising fact in 'text'. draw = a box the child draws in (say what in 'prompt').",
    `image = a picture WITH a 'notes' array of 4 to 6 short fun facts about the subject (a few words each, like "Holds its breath 5 minutes"), which print beside it. Set 'imageKey' to the ONE item from this list that genuinely shows the subject: ${ILLUSTRATION_HINT}. If none truly matches (usually a specific named place, person, or thing) OMIT 'imageKey' and set 'prompt' to "Draw the <subject>" instead, keeping the notes. Never force a loose match (a castle is NOT the Great Wall), and never describe a picture in words.`,
    "Address everything to the child ('you'); never write to the parent, never say 'your child', never invent a name. Never print the correct answers on the sheet; put answers only in each block's 'answers' array.",
  ];
}

function systemTeach(): string {
  return [
    "Create a printable LEARNING worksheet about the child's topic (ages 3-12), to be printed and read at home. Build it in this exact order:",
    "1) one 'instructions' block: a warm one-line hook that sparks curiosity about the topic.",
    "2) one picture early: an 'image' block (with its fun-fact notes), following the image rule below.",
    "3) then 3 or 4 short CYCLES. Each cycle = one 'passage' (a short fun heading in 'prompt', a few vivid sentences in 'text'), optionally one 'fact', then 1 or 2 'short-answer' or 'multiple-choice' questions answerable ONLY from that passage. Teach a little, ask a little; never put all the teaching first and all the questions at the end.",
    "Stay strictly on the topic: every passage and question is about it. Never add off-topic content (no math in a nature lesson). To make it harder, go DEEPER on the topic, not into another subject. Match the vocabulary, sentence length and depth to the child's age.",
    ...schemaSpec(),
  ].join(" ");
}

function systemActivity(): string {
  return [
    "You design printable hands-on ACTIVITY sheets for a child (ages 3-12) to DO after printing. The doing is the point.",
    "One simple three-beat shape, be creative inside it: 1) a tiny instruction line; 2) the activity itself, big and fun, built around at least one 'image' to colour, trace, label, count, or complete; 3) nothing else unless it genuinely adds to the fun.",
    "Colour by number: an 'image' block plus a short colour key as an 'instructions' block (e.g. '1 = blue, 2 = green'); the child solves simple problems and colours each part by its answer.",
    "If the request is playful or specific, run with it. Never describe a picture in words, use an image or draw block.",
    "Make it something a curious child of that age wants to pick up and finish, never like homework.",
    ...schemaSpec(),
  ].join(" ");
}

export function buildMessages(template: WorksheetTemplate, age: number, messages: ChatMessage[], childName?: string) {
  const asks = messages.filter((m) => m.role === "user").map((m) => m.content.trim()).filter(Boolean);
  const askText = asks.length ? asks.map((a, i) => `(${i + 1}) ${a}`).join(" ") : "Make a standard full-page one.";
  const name = capName(childName);
  const who2 = name ? `The child is named ${name}, age ${age}. Use ${name} in word problems and stories.` : `The child is age ${age}; no name was given, so address them as 'you' and never invent a name.`;
  const lvl = detectDifficulty(asks.join(" "));
  const target = Math.round(20 * scaleFactor(age, lvl));
  const mode = detectMode(template, messages);
  // teach/activity are CONTENT modes — difficulty + benchmark must be about reading
  // and depth, NEVER the math grade level (which would drag a nature lesson to math).
  const teachy = mode === "teach" || mode === "activity";
  const diffNote =
    lvl > 0
      ? teachy
        ? `DIFFICULTY: asked to make it harder ${lvl} time(s). Go clearly DEEPER than a standard age-${age} sheet, and deeper each time: richer ideas, longer reading, tougher vocabulary and harder (but still on-topic) questions. Never switch to math. `
        : `DIFFICULTY: the parent has asked to make it harder ${lvl} time(s). Make this clearly harder than a standard age-${age} sheet, and harder with each request: for number problems use values up to roughly ${target}, with carrying/borrowing and multi-step where it fits; for words and reading use longer, richer content. `
      : lvl < 0
        ? teachy
          ? `DIFFICULTY: asked to make it easier. Make it clearly gentler than a standard age-${age} sheet: simpler words, shorter passages, easier questions. `
          : `DIFFICULTY: the parent has asked to make it easier. Make this clearly gentler than a standard age-${age} sheet: smaller numbers (up to about ${target}) and fewer steps. `
        : "";
  const benchNote = teachy
    ? `Pitch the vocabulary, sentence length and ideas at what an average ${age}-year-old can read and understand, and never go below that level. `
    : `An average ${age}-year-old works at this level in school: ${ageBenchmark(age)}. Match that grade level and never go below it. `;

  // TEACH: lead with real teaching content; questions optional. (Freeform only.)
  if (mode === "teach") {
    const teachUser =
      `The child wants to learn about this topic, newest message last: ${askText}. ` +
      `${who2} ${benchNote}${diffNote}` +
      `Teach it for a ${age}-year-old following the CYCLE rules above (teach a little, ask a little, all about the topic). Honor exactly what they asked for: if they asked for a quiz, include a solid set of questions about the topic. Give it a clear, specific title that names the topic. Return ONLY the worksheet JSON.`;
    return [
      { role: "system", content: systemTeach() },
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
      { role: "system", content: systemActivity() },
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
    if (typeof o.imageKey === "string") block.imageKey = o.imageKey.trim().toLowerCase().replace(/\s+/g, "-");
    const notesArr = strArr(o.notes);
    if (notesArr) block.notes = notesArr.map((s) => noDash(s).trim()).filter(Boolean).slice(0, 6);
    if (typeof o.svgKey === "string") block.svgKey = o.svgKey;
    if (typeof o.imagePrompt === "string") block.imagePrompt = noDash(o.imagePrompt).trim().slice(0, 300);
    // Visual honesty: an image must resolve to a real picture, normally a pre-built
    // illustration (imageKey). With no usable picture (invented/unknown key) it
    // degrades to an honest draw box, never a blank or a forced bad match.
    if (block.kind === "image" && !hasIllustration(block.imageKey) && !block.dataUrl && !(block.svgKey && SVG_ART[block.svgKey]) && !block.imagePrompt) {
      const want = (block.imageKey || block.svgKey || "").replace(/-/g, " ");
      block.prompt = block.prompt || (want ? `Draw ${article(want)} ${want} here.` : "Draw the picture here.");
      block.kind = "draw";
      block.rows = block.rows ?? 7;
      delete block.svgKey;
      delete block.imageKey;
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
    // trace renders its glyphs from `text` (e.g. "0  1  2  3"). The model very
    // often packs the digits/letters/words into `items` (or wordBank) instead,
    // which the trace renderer never reads -> the characters vanish and only the
    // dashed line shows (a "trace the numbers" sheet with no numbers). Join them
    // back into `text`.
    if (block.kind === "trace" && (!block.text || !block.text.trim())) {
      const glyphs = (block.items && block.items.length ? block.items : block.wordBank) ?? [];
      if (glyphs.length) {
        block.text = glyphs.join("   ");
        delete block.items;
        delete block.wordBank;
      }
    }
    // handwriting is a prompt + blank ruled lines; it has no slot for `items`.
    // If the model listed specific things to write, fold them into the prompt so
    // the child sees them above the lines instead of losing them entirely.
    if (block.kind === "handwriting" && block.items && block.items.length) {
      const list = block.items.join("    ");
      block.prompt = block.prompt ? `${block.prompt}  ${list}` : list;
      delete block.items;
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
  const size = Math.min(1280, Math.max(256, Number(process.env.VENICE_IMAGE_SIZE) || 768));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${base}/image/generate`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      signal: controller.signal,
      body: JSON.stringify({
        model: imageModel(),
        prompt: `${imagePrompt}. ${IMAGE_STYLE[mode]}.`.slice(0, 1400),
        negative_prompt: IMAGE_NEG,
        width: size,
        height: size,
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
    const hasArt = b.dataUrl || hasIllustration(b.imageKey) || (b.svgKey && SVG_ART[b.svgKey]);
    if (!hasArt) {
      b.kind = "draw";
      b.prompt = b.prompt || "Draw the picture here.";
      b.rows = b.rows ?? 7;
      delete b.imagePrompt;
      delete b.svgKey;
    }
  }
}

// Deterministic image safety net. A teach/activity sheet should lead with a
// picture, but the model picks from a 197-item list and intermittently emits no
// image at all (e.g. "teach me about sheep" came back image-less though a sheep
// illustration exists). If there's no real picture, match the topic (title +
// prompt) to a pre-built illustration and drop it in near the top.
function injectIllustrationIfMissing(ws: Worksheet, template: WorksheetTemplate, messages: ChatMessage[]): void {
  const mode = detectMode(template, messages);
  if (mode !== "teach" && mode !== "activity") return;
  const hasPic = ws.blocks.some(
    (b) => b.kind === "image" && (hasIllustration(b.imageKey) || !!b.dataUrl || !!b.imagePrompt || !!(b.svgKey && SVG_ART[b.svgKey])),
  );
  if (hasPic) return;
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const key = pickIllustrationFor(`${ws.title} ${lastUser}`);
  if (!key) return;
  ws.blocks.splice(ws.blocks.length > 1 ? 1 : 0, 0, { kind: "image", imageKey: key });
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
  const reqBody = JSON.stringify({
    model,
    messages: msgs,
    temperature: 0.55,
    max_tokens: 5200,
    venice_parameters: { include_venice_system_prompt: false },
  });
  // One retry on a transient Venice failure (a 429 under load, or a 5xx/network
  // blip), so a brief rate-limit does not drop the whole sheet to the fallback.
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
      const parsed = text ? extractJson(text) : null;
      const ws = parsed ? normalize(parsed, template, age, childName) : null;
      if (!ws) {
        // Soft failure: the call succeeded (200) but the output was empty,
        // unparseable, or too thin. The model does this intermittently, and a
        // fresh attempt almost always succeeds, so retry once before dropping to
        // the "let's try that again" fallback.
        if (attempt === 0) {
          await sleep(700);
          continue;
        }
        return null;
      }
      injectIllustrationIfMissing(ws, template, messages);
      if (imagesEnabled()) await attachImages(ws, detectMode(template, messages), key);
      return ws;
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

export { getTemplate };
