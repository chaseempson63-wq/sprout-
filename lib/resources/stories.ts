// Sprout Resources — story templates (the illustration-topic library).
//
// One story template per pre-built illustration: an original story built
// around the picture plus questions and activities, in SIX pre-authored
// difficulty versions (bands). Everything is static JSON committed to the
// repo and served from public/resources/stories/<key>.json — no Venice, no
// runtime generation, instant load.
//
//   band 1 · ages 3-4   read-aloud story, count/trace/match, drawing
//   band 2 · ages 5-6   short story, recall questions, word-bank blanks
//   band 3 · ages 7-8   real passage, recall + why, vocabulary, writing lines
//   band 4 · ages 9-10  longer passage, inference + main idea, paragraph
//   band 5 · ages 11-12 rich passage, author's purpose, summary writing
//   band 6 · age 13     essay-length passage, evidence-citing, extensions
//
// The index below is GENERATED from the authored JSON files by
// scripts/build-stories-index.mjs — a story only appears in the library once
// its file exists and passes scripts/lint-stories.mjs. Never hand-edit
// stories-index.json.

import type { Worksheet } from "./types";
import STORY_INDEX_JSON from "./stories-index.json";

export interface StoryFile {
  key: string; // illustration key; the asset is /resources/illustrations/<key>.webp
  title: string; // card + sheet title, kid-appealing
  blurb: string; // one line on the card
  topic: string; // one of STORY_TOPICS keys
  bands: Record<string, Worksheet>; // "1".."6", each a complete printable worksheet
}

export interface StoryMeta {
  key: string;
  title: string;
  blurb: string;
  topic: string;
}

// Browse categories for the story wall. Separate from the six skill TOPICS
// (math/reading/...) — these are what the sheet is ABOUT, not the skill.
export const STORY_TOPICS: { key: string; label: string; emoji: string }[] = [
  { key: "animals", label: "Animals", emoji: "🦁" },
  { key: "ocean", label: "Ocean", emoji: "🐠" },
  { key: "birds-bugs", label: "Birds & Bugs", emoji: "🐝" },
  { key: "space", label: "Space", emoji: "🚀" },
  { key: "science", label: "Science", emoji: "🔬" },
  { key: "earth-weather", label: "Earth & Weather", emoji: "🌦️" },
  { key: "dinosaurs", label: "Dinosaurs", emoji: "🦖" },
  { key: "body-health", label: "My Body", emoji: "🫀" },
  { key: "food", label: "Food", emoji: "🍎" },
  { key: "vehicles", label: "Things That Go", emoji: "🚗" },
  { key: "make-believe", label: "Make-Believe", emoji: "🦄" },
  { key: "our-world", label: "Our World", emoji: "🌍" },
];

export const STORY_INDEX: StoryMeta[] = STORY_INDEX_JSON as StoryMeta[];

export const STORY_TEMPLATE_PREFIX = "story-";
export const storyTemplateId = (key: string) => `${STORY_TEMPLATE_PREFIX}${key}`;
export const isStoryTemplateId = (id: string) => id.startsWith(STORY_TEMPLATE_PREFIX);

export function getStoryMeta(key: string): StoryMeta | undefined {
  return STORY_INDEX.find((s) => s.key === key);
}

// Stepper age -> band, mirroring the engine's banding (generate.ts). Kept
// standalone so client pages don't pull the whole engine into the bundle.
export function bandForAge(age: number): 1 | 2 | 3 | 4 | 5 | 6 {
  const a = Math.min(13, Math.max(3, age));
  return a <= 4 ? 1 : a <= 6 ? 2 : a <= 8 ? 3 : a <= 10 ? 4 : a <= 12 ? 5 : 6;
}

// Representative stepper age for a band (used when harder/easier steps the band).
export const BAND_AGES: Record<1 | 2 | 3 | 4 | 5 | 6, number> = { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 13 };
