// Sprout Resources — core types.
//
// A worksheet is a list of typed BLOCKS that a child fills in after printing
// (trace these letters, solve these problems, fill these blanks). This is the
// real artifact, not a list of instructions for the parent.
//
// Everything is keyed to the child's AGE — no grades, no year levels.

export type BlockKind =
  | "instructions" // a short line of directions
  | "trace" // dotted letters/numbers/words to trace
  | "handwriting" // blank ruled lines to write on
  | "fill-blank" // sentences with ____ gaps to complete
  | "word-bank" // a box of words to choose from
  | "math" // horizontal problems with an answer blank
  | "column-math" // stacked vertical problems
  | "count" // count the objects, write how many
  | "matching" // draw a line from left to right
  | "multiple-choice" // question + options to circle
  | "short-answer" // question + blank lines
  | "missing-numbers" // a sequence with gaps to fill
  | "passage" // a short reading passage
  | "draw"; // a labelled box to draw in

export interface WorksheetBlock {
  kind: BlockKind;
  prompt?: string; // the instruction shown above this block
  text?: string; // passage text, or the letters/word for a trace block
  items?: string[]; // problems, sentences (with ____), counts, sequences, options
  pairs?: { left: string; right: string }[]; // matching block
  emoji?: string; // object drawn for count blocks
  wordBank?: string[]; // words for a word-bank block
  rows?: number; // blank lines (handwriting) or draw-box height hint
  answers?: string[]; // answer-key entries for this block
}

export interface Worksheet {
  title: string;
  subtitle: string;
  intro?: string;
  blocks: WorksheetBlock[];
  meta: { templateId: string; templateLabel: string; age: number; theme?: string };
}

export interface SavedWorksheet extends Worksheet {
  id: string;
  childId?: string;
  favorite: boolean;
  published: boolean;
  createdAt: number;
  source: "ai" | "template";
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  interests: string[];
  color: string;
  createdAt: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface WorksheetTemplate {
  id: string;
  title: string;
  blurb: string;
  emoji: string;
  ageMin: number;
  ageMax: number;
  accent: string; // tailwind classes for the card's emoji chip
  plan: BlockKind[]; // blocks the offline generator builds
  brief: string; // guidance handed to the AI
}

// Request body for POST /api/resources/generate
export interface GenerateRequest {
  templateId: string;
  age: number;
  messages: ChatMessage[]; // conversation so far; last user message is the new ask
}
