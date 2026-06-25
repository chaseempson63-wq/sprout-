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
  | "passage" // a reading/teaching passage (heading in prompt, body in text)
  | "fact" // a "did you know?" fun-fact callout (the fact in text)
  | "image" // a real picture: AI-generated (imagePrompt -> dataUrl) or curated svg line art
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
  answers?: string[]; // correct answers for this block, stored only, never printed on the sheet
  imageKey?: string; // image block: key into the pre-built illustration set (public/resources/illustrations)
  notes?: string[]; // image block: short fun facts about the subject, printed flanking the picture
  svgKey?: string; // image block: key into the curated SVG line-art library (legacy fallback)
  imagePrompt?: string; // image block: description for live AI image gen (dormant, opt-in path)
  dataUrl?: string; // image block: a generated raster as a data: URL (dormant, opt-in path)
}

export interface Worksheet {
  title: string;
  subtitle: string;
  intro?: string;
  blocks: WorksheetBlock[];
  meta: { templateId: string; templateLabel: string; age: number; theme?: string; childName?: string };
}

export interface SavedWorksheet extends Worksheet {
  id: string;
  childId?: string;
  favorite: boolean;
  published: boolean;
  creatorHandle?: string; // attribution (the creator who made it)
  creatorName?: string;
  createdAt: number;
  source: "ai" | "template";
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  birthday?: string; // ISO date (optional; age drives difficulty)
  photo?: string; // data URL (optional; falls back to colored avatar)
  interests: string[];
  learningStyle?: string;
  color: string;
  createdAt: number;
}

// A logged learning-story moment on a child's profile feed.
export interface LearningMoment {
  id: string;
  childId: string;
  text: string;
  photo?: string; // data URL (optional)
  createdAt: number;
}

// The local account / public creator identity.
export interface CreatorProfile {
  id: string; // stable per-browser uuid; sent to the server as the maker id
  handle: string; // unique-ish slug, e.g. "daniel"
  displayName: string;
  photo?: string;
  bio?: string;
  createdAt: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string; // what the model receives (for a preset chip, the masked instruction)
  display?: string; // what the chat bubble shows instead of content (the one-word chip label)
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
  childName?: string;
  messages: ChatMessage[]; // conversation so far; last user message is the new ask
}

// ─────────────────────────────────────────────────────────────────
// Social layer — shared web wire types (the camelCase shapes the API
// returns and the client sends). DB rows are snake_case; the server
// routes map between the two. createdAt is always ms-epoch here.
// ─────────────────────────────────────────────────────────────────

export type VoteTarget = "post" | "thread" | "comment";

// Anonymous maker identity sent with every social write, built from the
// local CreatorProfile. There is no login — the id is a per-browser uuid.
export interface MakerRef {
  id: string;
  handle: string;
  displayName: string;
  photo?: string;
  bio?: string;
}

// A published community worksheet.
export interface CommunityPost {
  id: string;
  makerId: string;
  handle: string;
  creatorName: string;
  photo?: string; // maker avatar, for cards + profile header
  title: string;
  subtitle: string;
  templateId: string;
  topic: string;
  worksheet: Worksheet;
  upvotes: number;
  commentCount: number;
  createdAt: number;
}

// A forum discussion thread (the public feedback surface).
export interface ForumThread {
  id: string;
  makerId: string;
  handle: string;
  creatorName: string;
  title: string;
  body: string;
  upvotes: number;
  commentCount: number;
  createdAt: number;
}

// A threaded comment on a post or a thread. `replies` is populated after
// the flat rows are assembled into a tree.
export interface Comment {
  id: string;
  targetType: "post" | "thread";
  targetId: string;
  parentId: string | null;
  makerId: string;
  handle: string;
  creatorName: string;
  body: string;
  upvotes: number;
  createdAt: number;
  replies?: Comment[];
}
