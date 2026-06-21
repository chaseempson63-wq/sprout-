// PLACEHOLDER community seed. Replace the worksheets and creator names with
// real curated content + real creators when ready. These exist only so the
// community hub, attribution, likes and ranking are demonstrable on a fresh
// install. They render exactly like generated worksheets.

import type { Worksheet } from "./types";

export interface CommunitySample {
  id: string;
  creatorName: string; // PLACEHOLDER
  creatorHandle: string; // PLACEHOLDER
  worksheet: Worksheet;
}

export const COMMUNITY_SAMPLES: CommunitySample[] = [
  {
    id: "sample-dino-addition",
    creatorName: "[Placeholder Creator]",
    creatorHandle: "placeholder-1",
    worksheet: {
      title: "Dinosaur Addition",
      subtitle: "Age 6 · dinosaur",
      blocks: [
        { kind: "instructions", prompt: "Help the dinosaurs count their eggs. Solve each problem." },
        { kind: "math", prompt: "Write your answer in the box.", items: ["3 + 4 =", "5 + 2 =", "6 + 3 =", "4 + 4 =", "7 + 2 =", "1 + 8 ="], answers: ["7", "7", "9", "8", "9", "9"] },
        { kind: "count", prompt: "Count the eggs in each row and write how many.", emoji: "🥚", items: ["4", "6", "3"], answers: ["4", "6", "3"] },
      ],
      meta: { templateId: "addition", templateLabel: "Addition", age: 6, theme: "dinosaur" },
    },
  },
  {
    id: "sample-ocean-counting",
    creatorName: "[Placeholder Creator]",
    creatorHandle: "placeholder-2",
    worksheet: {
      title: "Under the Sea Counting",
      subtitle: "Age 4 · ocean",
      blocks: [
        { kind: "instructions", prompt: "Count the sea friends and finish the number line." },
        { kind: "count", prompt: "How many in each row?", emoji: "🐠", items: ["3", "5", "2"], answers: ["3", "5", "2"] },
        { kind: "missing-numbers", prompt: "Fill in the missing numbers.", items: ["1,  2,  ____,  4,  ____", "2,  ____,  6,  ____,  10"], answers: ["3, 5", "4, 8"] },
      ],
      meta: { templateId: "counting", templateLabel: "Counting & Numbers", age: 4, theme: "ocean" },
    },
  },
  {
    id: "sample-space-reading",
    creatorName: "[Placeholder Creator]",
    creatorHandle: "placeholder-3",
    worksheet: {
      title: "A Trip to Space",
      subtitle: "Age 8 · space",
      blocks: [
        { kind: "passage", prompt: "Read the story, then answer the questions.", text: "Nova zipped past the moon in her little rocket. She wanted to find the brightest star in the sky. Along the way she counted seven planets, waved at a comet, and ate her lunch upside down. The best part of the trip was still ahead." },
        { kind: "short-answer", prompt: "Answer in a full sentence.", items: ["Who is the story about?", "What did Nova want to find?", "How many planets did she count?"], rows: 2, answers: ["Nova", "the brightest star", "seven"] },
      ],
      meta: { templateId: "reading", templateLabel: "Reading Comprehension", age: 8, theme: "space" },
    },
  },
];
