// Regenerate lib/resources/stories-index.json from the authored story files.
//
//     node scripts/build-stories-index.mjs
//
// Run AFTER lint-stories.mjs passes. The library only shows stories that are
// in this index, so the index is the publish switch: no file, no card.

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/resources/stories");
const OUT = path.join(ROOT, "lib/resources/stories-index.json");

const files = (await readdir(DIR).catch(() => [])).filter((f) => f.endsWith(".json")).sort();
const index = [];
for (const f of files) {
  const doc = JSON.parse(await readFile(path.join(DIR, f), "utf8"));
  index.push({ key: doc.key, title: doc.title, blurb: doc.blurb, topic: doc.topic });
}
await writeFile(OUT, JSON.stringify(index, null, 1) + "\n");
console.log(`stories-index.json: ${index.length} stories.`);
