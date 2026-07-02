// Every template card wears a real illustration from the pre-built set
// (lib/resources/illustrations.ts) instead of an emoji chip. Each pick is a
// small visual pun on what the sheet teaches, so the grid reads like a wall
// of picture books, not a settings menu. Keys must exist in ILLUSTRATIONS —
// validated by the artFor fallback (undefined -> the card renders no sticker).

import { ILLUSTRATION_KEYS } from "./illustrations";

const TEMPLATE_ART: Record<string, string> = {
  addition: "balloon", // one more balloon
  subtraction: "cake", // pieces keep disappearing
  multiplication: "rocket", // numbers taking off
  division: "grapes", // sharing the bunch
  fractions: "pizza", // the eternal fraction food
  "place-value": "train", // each carriage is a place
  "telling-time": "clock",
  money: "treasure-chest",
  "missing-numbers": "caterpillar", // segments with gaps
  "word-problems": "robot", // work it out step by step
  shapes: "kite",
  counting: "ladybug", // count the spots
  "skip-counting": "frog", // counts in jumps
  patterns: "snake", // stripes repeat
  matching: "penguin", // finds its pair
  reading: "books",
  phonics: "parrot", // says the sounds
  "sight-words": "eye",
  rhyming: "drum", // rhythm and rhyme
  spelling: "bee", // spelling bee
  "fill-blank-story": "castle",
  "creative-writing": "dragon",
  grammar: "owl", // the wise editor
  "sentence-building": "house", // built brick by brick
  "letter-tracing": "paintbrush",
  "number-tracing": "snail", // leaves a perfect trail
  "line-tracing": "worm", // wiggly lines
  "draw-label": "flower-parts",
  "color-by-number": "rainbow",
  "life-cycle": "butterfly-life-cycle",
};

export function artFor(templateId: string): string | undefined {
  const key = TEMPLATE_ART[templateId];
  return key && ILLUSTRATION_KEYS.has(key) ? key : undefined;
}
