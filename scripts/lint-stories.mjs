// Quality gate for authored story templates (public/resources/stories/*.json).
//
//     node scripts/lint-stories.mjs            # lint everything
//     node scripts/lint-stories.mjs axolotl    # lint one key
//
// A story file only ships if it passes. Checks: schema shape, all 6 bands,
// per-band passage word-count floors/ceilings, question blocks carry stored
// answers, imageKey exists in the illustration catalog, no em/en dashes
// anywhere, no UK spellings, no banned vocabulary, meta wired correctly.
// Exit code 1 on any failure, with a per-file report.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/resources/stories");
const CATALOG = path.join(ROOT, "lib/resources/illustrations.ts");

const KNOWN_KINDS = new Set([
  "instructions", "trace", "handwriting", "fill-blank", "word-bank", "math", "column-math",
  "count", "matching", "multiple-choice", "short-answer", "missing-numbers", "passage",
  "fact", "image", "draw",
]);
const TOPICS = new Set([
  "animals", "ocean", "birds-bugs", "space", "science", "earth-weather",
  "dinosaurs", "body-health", "food", "vehicles", "make-believe", "our-world",
]);
// Passage word budgets per band: [min total story words, max].
const WORDS = { 1: [30, 90], 2: [55, 130], 3: [110, 220], 4: [180, 330], 5: [270, 460], 6: [360, 700] };
// Question-bearing blocks that must carry answers.
const NEEDS_ANSWERS = new Set(["fill-blank", "math", "column-math", "count", "multiple-choice", "missing-numbers", "matching"]);
// UK spellings + banned vocab (word-boundary). "volcano" is allowed ONLY in
// the volcano story itself.
const BANNED = [
  /\bmum\b/i, /\bmaths\b/i, /colou?r\bcolour/i, /\bcolour/i, /\bfavourite/i, /\brealise/i, /\borganise/i,
  /\bcentre\b/i, /\bmetre\b/i, /\blitre\b/i, /\bpractise\b/i, /\bartifact/i,
];

async function catalogKeys() {
  const src = await readFile(CATALOG, "utf8");
  const keys = new Set();
  const re = /\{\s*key:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) keys.add(m[1]);
  return keys;
}

function textOf(ws) {
  const parts = [ws.title, ws.subtitle, ws.intro];
  for (const b of ws.blocks ?? []) {
    parts.push(b.prompt, b.text, ...(b.items ?? []), ...(b.wordBank ?? []), ...(b.notes ?? []));
    for (const p of b.pairs ?? []) parts.push(p.left, p.right);
  }
  return parts.filter(Boolean).join("\n");
}

function lintBand(key, bandNo, ws, illKeys, errs) {
  const at = `band ${bandNo}`;
  if (!ws || typeof ws !== "object") return errs.push(`${at}: missing worksheet`);
  if (!ws.title?.trim()) errs.push(`${at}: no title`);
  if (!Array.isArray(ws.blocks) || ws.blocks.length < 4) errs.push(`${at}: fewer than 4 blocks (feels thin)`);
  if (ws.meta?.templateId !== `story-${key}`) errs.push(`${at}: meta.templateId must be "story-${key}"`);

  let passageWords = 0;
  let hasImage = false;
  let activities = 0;
  for (const [i, b] of (ws.blocks ?? []).entries()) {
    if (!KNOWN_KINDS.has(b.kind)) errs.push(`${at} block ${i}: unknown kind "${b.kind}"`);
    if (b.kind === "passage") passageWords += (b.text ?? "").split(/\s+/).filter(Boolean).length;
    if (b.kind === "image") {
      hasImage = true;
      if (b.imageKey !== key) errs.push(`${at} block ${i}: image must use imageKey "${key}"`);
      if (!Array.isArray(b.notes) || b.notes.length < 3) errs.push(`${at} block ${i}: image needs 3+ fun-fact notes`);
    }
    if (["fill-blank", "short-answer", "multiple-choice", "matching", "count", "missing-numbers", "math", "column-math", "trace", "handwriting", "draw"].includes(b.kind)) activities++;
    if (NEEDS_ANSWERS.has(b.kind) && b.kind !== "matching") {
      // matching carries its answer in the pairs themselves; multiple-choice
      // stores only the correct option(s), not one answer per item.
      const a = (b.answers ?? []).length;
      if (!Array.isArray(b.answers) || a === 0) errs.push(`${at} block ${i} (${b.kind}): no stored answers`);
      else if (b.kind === "multiple-choice") {
        for (const ans of b.answers) {
          if (!(b.items ?? []).includes(ans)) errs.push(`${at} block ${i}: answer "${ans}" is not one of the options`);
        }
      } else if (a < (b.items ?? []).length) {
        errs.push(`${at} block ${i} (${b.kind}): ${(b.items ?? []).length} items but ${a} answers`);
      }
    }
    if (b.kind === "short-answer" && (!Array.isArray(b.answers) || b.answers.length === 0)) {
      errs.push(`${at} block ${i}: short-answer needs answers (use "(opinion)" style markers where open)`);
    }
  }
  if (!hasImage) errs.push(`${at}: no image block (every story leads with its illustration)`);
  if (activities < 3) errs.push(`${at}: fewer than 3 activity blocks`);
  const [lo, hi] = WORDS[bandNo];
  if (passageWords < lo) errs.push(`${at}: story too short (${passageWords} words, floor ${lo})`);
  if (passageWords > hi) errs.push(`${at}: story too long (${passageWords} words, ceiling ${hi})`);

  const text = textOf(ws);
  if (/[—–]/.test(text)) errs.push(`${at}: contains an em/en dash`);
  for (const re of BANNED) {
    const m = text.match(re);
    if (m && !(key === "volcano" && /volcano/i.test(m[0]))) errs.push(`${at}: banned/UK word "${m[0]}"`);
  }
  if (key !== "volcano" && /volcano/i.test(text)) errs.push(`${at}: "volcano" outside the volcano story`);
}

async function lintFile(file, illKeys) {
  const errs = [];
  let doc;
  try {
    doc = JSON.parse(await readFile(path.join(DIR, file), "utf8"));
  } catch (e) {
    return [`invalid JSON: ${e.message}`];
  }
  const key = file.replace(/\.json$/, "");
  if (doc.key !== key) errs.push(`key "${doc.key}" does not match filename`);
  if (!illKeys.has(key)) errs.push(`no illustration named "${key}" in the catalog`);
  if (!doc.title?.trim()) errs.push("no title");
  if (!doc.blurb?.trim()) errs.push("no blurb");
  if (!TOPICS.has(doc.topic)) errs.push(`topic "${doc.topic}" is not a STORY_TOPICS key`);
  for (const b of [1, 2, 3, 4, 5, 6]) lintBand(key, b, doc.bands?.[String(b)], illKeys, errs);
  return errs;
}

async function main() {
  const only = process.argv[2];
  const illKeys = await catalogKeys();
  const files = (await readdir(DIR).catch(() => []))
    .filter((f) => f.endsWith(".json"))
    .filter((f) => !only || f === `${only}.json`);
  if (files.length === 0) {
    console.log("No story files to lint.");
    return;
  }
  let bad = 0;
  for (const f of files.sort()) {
    const errs = await lintFile(f, illKeys);
    if (errs.length) {
      bad++;
      console.log(`FAIL  ${f}`);
      for (const e of errs) console.log(`      - ${e}`);
    } else {
      console.log(`ok    ${f}`);
    }
  }
  console.log(`\n${files.length - bad}/${files.length} passed.`);
  if (bad) process.exit(1);
}

main();
