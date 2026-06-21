// Sprout Resources — core types.
// The data model is parent -> children (subaccounts) -> per-child saved
// resources. v0 is local-first (see store.tsx); these types map 1:1 to the
// Supabase tables when auth is wired in later.

export type ResourceType =
  | "math"
  | "reading"
  | "writing"
  | "science"
  | "unit-study"
  | "lesson-plan"
  | "project";

export type Difficulty = "easier" | "on-level" | "challenge";

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  interests: string[];
  level: string; // free text, e.g. "Year 3" or "early reader"
  color: string; // avatar color key, see AVATAR_COLORS in store
  createdAt: number;
}

export interface ResourceSection {
  heading: string;
  items: string[];
  note?: string;
}

export interface GeneratedResource {
  title: string;
  subtitle: string;
  intro: string;
  sections: ResourceSection[];
  answerKey?: string[];
  meta: {
    type: ResourceType;
    subject: string;
    topic: string;
    ageLabel: string;
    difficulty: Difficulty;
  };
}

export interface SavedResource extends GeneratedResource {
  id: string;
  childId: string;
  favorite: boolean;
  createdAt: number;
  source: "ai" | "template";
}

export interface GenerateInput {
  type: ResourceType;
  childName: string;
  age: number;
  level: string;
  subject: string;
  topic: string;
  interests: string[];
  difficulty: Difficulty;
}
