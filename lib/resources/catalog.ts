// Sprout Resources — client-safe catalog of resource types and labels.
// Kept separate from generate.ts so the UI can import this without pulling
// the server-only generator (fetch / process.env) into the client bundle.

import type { Difficulty, ResourceType } from "./types";

export const RESOURCE_ORDER: ResourceType[] = [
  "math",
  "reading",
  "writing",
  "science",
  "unit-study",
  "lesson-plan",
  "project",
];

export const RESOURCE_META: Record<
  ResourceType,
  { label: string; tagline: string; defaultSubject: string; sampleTopic: string }
> = {
  math: {
    label: "Math Worksheet",
    tagline: "Practice problems tuned to their level",
    defaultSubject: "Math",
    sampleTopic: "multiplication facts",
  },
  reading: {
    label: "Reading Comprehension",
    tagline: "A reading task plus questions",
    defaultSubject: "Reading",
    sampleTopic: "main idea and details",
  },
  writing: {
    label: "Writing Prompt",
    tagline: "Get them writing about something they care about",
    defaultSubject: "Writing",
    sampleTopic: "a short story",
  },
  science: {
    label: "Science Activity",
    tagline: "Hands-on, low-prep, kitchen-table science",
    defaultSubject: "Science",
    sampleTopic: "how plants grow",
  },
  "unit-study": {
    label: "Unit Study",
    tagline: "One theme across every subject for a week",
    defaultSubject: "Cross-curricular",
    sampleTopic: "the solar system",
  },
  "lesson-plan": {
    label: "Lesson Plan",
    tagline: "A simple plan you can teach today",
    defaultSubject: "General",
    sampleTopic: "telling time",
  },
  project: {
    label: "Project-Based Activity",
    tagline: "One bigger build to sink into",
    defaultSubject: "General",
    sampleTopic: "build a bird feeder",
  },
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easier: "Gentle",
  "on-level": "On level",
  challenge: "Challenge",
};
