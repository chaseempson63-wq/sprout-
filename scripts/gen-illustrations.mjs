// One-time generator for the pre-built illustration set used by Sprout Resources.
//
// Run ONCE with your Venice key, from the repo root:
//
//     VENICE_API_KEY=sk-... node scripts/gen-illustrations.mjs
//
// (or just put VENICE_API_KEY in .env.local and run `node scripts/gen-illustrations.mjs`).
//
// It reads the topic list straight out of lib/resources/illustrations.ts (no
// drift), calls Venice image generation for each, and writes
// public/resources/illustrations/<key>.webp. Idempotent: it SKIPS any file that
// already exists, so re-running only fills gaps and costs nothing for what's done.
//
// Rough cost: ~1 cent per image, so the full set is about US$0.85 one time.
// After this, the app serves these as static files: free, instant, no API calls.

import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG = path.join(ROOT, "lib/resources/illustrations.ts");
const OUT_DIR = path.join(ROOT, "public/resources/illustrations");

const BASE = process.env.VENICE_BASE_URL || "https://api.venice.ai/api/v1";
const MODEL = process.env.VENICE_IMAGE_MODEL || "venice-sd35";
const SIZE = Math.min(1280, Math.max(256, Number(process.env.VENICE_IMAGE_SIZE) || 1024));

const STYLE =
  "children's book illustration, warm and friendly, soft rounded shapes, bright simple colors, thick clean outlines, flat vector style, single subject centered, on a plain solid white background, no text, no words, no labels, no frame, no border";
const NEG =
  "text, words, letters, numbers, captions, watermark, signature, frame, border, photo, photorealistic, 3d render, blurry, deformed, scary, creepy, gore, nsfw, multiple panels, collage";

function loadKey() {
  let key = process.env.VENICE_API_KEY || process.env.VENICE_INFERENCE_KEY || process.env.VENUS_API_KEY;
  const envPath = path.join(ROOT, ".env.local");
  if (!key && existsSync(envPath)) {
    const env = readFileSync(envPath, "utf8");
    const m = env.match(/^\s*(?:VENICE_API_KEY|VENICE_INFERENCE_KEY|VENUS_API_KEY)\s*=\s*(.+)\s*$/m);
    if (m) key = m[1].trim().replace(/^["']|["']$/g, "");
  }
  return key;
}

async function parseCatalog() {
  const src = await readFile(CATALOG, "utf8");
  const re = /\{\s*key:\s*"([^"]+)",\s*prompt:\s*"([^"]+)"/g;
  const items = [];
  let m;
  while ((m = re.exec(src))) items.push({ key: m[1], prompt: m[2] });
  return items;
}

async function generateOne(key, prompt, apiKey) {
  const res = await fetch(`${BASE}/image/generate`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      prompt: `${prompt}. ${STYLE}.`,
      negative_prompt: NEG,
      width: SIZE,
      height: SIZE,
      format: "webp",
      safe_mode: true,
      return_binary: false,
      hide_watermark: true,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
  const data = await res.json();
  const b64 = data?.images?.[0];
  if (typeof b64 !== "string" || !b64) throw new Error("no image in response");
  await writeFile(path.join(OUT_DIR, `${key}.webp`), Buffer.from(b64, "base64"));
}

async function main() {
  const apiKey = loadKey();
  if (!apiKey) {
    console.error("No Venice key. Set VENICE_API_KEY (env or .env.local) and re-run.");
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });
  const items = await parseCatalog();
  const existing = new Set((await readdir(OUT_DIR).catch(() => [])).map((f) => f.replace(/\.webp$/, "")));
  const todo = items.filter((it) => !existing.has(it.key));

  console.log(`${items.length} topics, ${existing.size} already done, ${todo.length} to generate.`);
  console.log(`Model ${MODEL} at ${SIZE}px -> ${OUT_DIR}\n`);

  let done = 0;
  const failed = [];
  const queue = [...todo];
  const CONCURRENCY = Math.max(1, Number(process.env.GEN_CONCURRENCY) || 4);
  async function worker() {
    while (queue.length) {
      const it = queue.shift();
      if (!it) break;
      try {
        await generateOne(it.key, it.prompt, apiKey);
        done++;
        console.log(`  ok    ${it.key}  (${done + failed.length}/${todo.length})`);
      } catch (e) {
        failed.push(it.key);
        console.log(`  FAIL  ${it.key}  (${e.message})`);
      }
    }
  }
  // A few in parallel so the run finishes in minutes. If a few rate-limit and
  // fail, they are listed and a re-run (idempotent) picks up only those.
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, () => worker()));

  console.log(`\nGenerated ${done}, skipped ${existing.size}, failed ${failed.length}.`);
  if (failed.length) console.log(`Re-run to retry the ${failed.length} that failed: ${failed.join(", ")}`);
  console.log(`\nNext: commit public/resources/illustrations/ and push, then they go live.`);
}

main();
