// Sprout Resources — the INTENT FILE.
//
// This is the shared dictionary loaded before every generation call. It exists
// because the model was guessing: with no agreed meaning for each keyword and
// no real grounding, output came out random and repetitive ("draw a star"
// everywhere). Here:
//   - every EDIT keyword has one precise meaning,
//   - every theme carries REAL nouns and REAL facts (never invented filler),
//   - every template references a DISTINCT intent so no two ask the same thing,
//   - the input vocabulary is exported so the UI can show users the language.

// ── 1. Edit keywords: what the chat words actually do ───────────────────────

export interface EditKeyword {
  word: string;
  does: string;
}

export const EDIT_KEYWORDS: EditKeyword[] = [
  { word: "harder", does: "Raise complexity: bigger and multi-digit numbers, carrying/borrowing, more steps, harder words. Never reshuffle the same answers." },
  { word: "easier", does: "Drop to simpler numbers and words with fewer steps, for a younger child." },
  { word: "longer", does: "Add more items and one extra section so it fills the page." },
  { word: "shorter", does: "Keep only the core items, trim the rest." },
  { word: "more questions", does: "Add more distinct questions of the same kind." },
  { word: "in depth", does: "Ask richer questions that need explanation, not just recall." },
  { word: "answer key", does: "Include the answers for the grown-up." },
  { word: "a theme word", does: "Re-theme every item around that subject. Try space, dinosaurs, ocean, animals, sports, food, vehicles, fairy tales." },
];

// ── 2. Themes: real anchors so themed content is grounded, not invented ─────

export interface Theme {
  key: string;
  label: string;
  emoji: string;
  nouns: string[];
  facts: string[];
}

export const THEMES: Record<string, Theme> = {
  space: {
    key: "space",
    label: "Space",
    emoji: "🚀",
    nouns: ["planets", "rockets", "astronauts", "stars", "moons", "comets"],
    facts: ["There are eight planets in our solar system.", "The Sun is a star.", "The Moon orbits the Earth.", "Mars is called the red planet.", "Astronauts float because of microgravity."],
  },
  dinosaur: {
    key: "dinosaur",
    label: "Dinosaurs",
    emoji: "🦕",
    nouns: ["dinosaurs", "fossils", "eggs", "footprints", "ferns", "volcanoes"],
    facts: ["A T. rex had tiny arms and huge teeth.", "Some dinosaurs ate only plants.", "Fossils are bones turned to rock.", "Triceratops had three horns.", "Dinosaurs lived millions of years ago."],
  },
  ocean: {
    key: "ocean",
    label: "Ocean",
    emoji: "🐠",
    nouns: ["fish", "whales", "crabs", "shells", "waves", "coral"],
    facts: ["A whale is a mammal, not a fish.", "Crabs walk sideways.", "Coral reefs are built by tiny animals.", "The ocean covers most of the Earth.", "Octopuses have eight arms."],
  },
  animal: {
    key: "animal",
    label: "Animals",
    emoji: "🦊",
    nouns: ["foxes", "rabbits", "owls", "deer", "frogs", "bees"],
    facts: ["A baby frog is called a tadpole.", "Owls can turn their heads far around.", "Bees make honey.", "Rabbits have strong back legs.", "Foxes are part of the dog family."],
  },
  sport: {
    key: "sport",
    label: "Sports",
    emoji: "⚽",
    nouns: ["balls", "goals", "teams", "medals", "races", "courts"],
    facts: ["Soccer has eleven players per team.", "A marathon is about 42 kilometres.", "Basketball is played on a court.", "A gold medal is for first place."],
  },
  food: {
    key: "food",
    label: "Food",
    emoji: "🍎",
    nouns: ["apples", "bread", "carrots", "eggs", "berries", "cheese"],
    facts: ["Fruit grows on trees and plants.", "Bread is made from flour.", "Carrots grow underground.", "Bees help fruit grow."],
  },
  vehicle: {
    key: "vehicle",
    label: "Vehicles",
    emoji: "🚗",
    nouns: ["cars", "trucks", "trains", "planes", "boats", "bikes"],
    facts: ["A train runs on tracks.", "Planes have wings to fly.", "A bike has two wheels.", "Boats float on water."],
  },
  fairytale: {
    key: "fairytale",
    label: "Fairy tales",
    emoji: "🏰",
    nouns: ["dragons", "castles", "knights", "crowns", "forests", "wizards"],
    facts: ["A castle has tall stone walls.", "Knights wore armour.", "Dragons are make-believe.", "A crown is worn by a king or queen."],
  },
};

const DEFAULT_THEME: Theme = {
  key: "everyday",
  label: "Everyday",
  emoji: "⭐",
  nouns: ["apples", "books", "balls", "blocks", "leaves", "stars"],
  facts: ["A week has seven days.", "A year has twelve months.", "There are four seasons."],
};

export function detectTheme(text: string): Theme {
  const t = text.toLowerCase();
  for (const key of Object.keys(THEMES)) {
    if (t.includes(key) || t.includes(`${key}s`)) return THEMES[key];
  }
  if (/dino/.test(t)) return THEMES.dinosaur;
  if (/sea|under the sea|fish|shark|whale/.test(t)) return THEMES.ocean;
  if (/car|truck|train|plane|boat/.test(t)) return THEMES.vehicle;
  if (/dragon|castle|knight|princess|wizard/.test(t)) return THEMES.fairytale;
  return DEFAULT_THEME;
}

// ── 3. Template intents: a distinct, real-grounded definition per template ──
// `defines` = what this worksheet IS (so it never collides with another).
// `skills`  = the real skills it practises.
// `grounding` = real reference sets the model must draw from (no invented filler).

export interface TemplateIntent {
  defines: string;
  skills: string[];
  grounding: string[];
}

export const TEMPLATE_INTENT: Record<string, TemplateIntent> = {
  addition: {
    defines: "addition practice, from single digits up to multi-digit column sums",
    skills: ["number bonds", "adding within 10/20/100/1000 by age", "carrying", "column addition"],
    grounding: ["real number ranges sized to the age, distinct sums every time"],
  },
  subtraction: {
    defines: "subtraction practice, take-away and difference",
    skills: ["subtracting within 10/20/100/1000 by age", "borrowing", "column subtraction"],
    grounding: ["real number ranges sized to the age, no negative answers for young children"],
  },
  multiplication: {
    defines: "multiplication facts and times tables, building to 2-digit",
    skills: ["times tables 1-12", "arrays", "multi-digit multiplication for older children"],
    grounding: ["the standard 1-12 times tables"],
  },
  division: {
    defines: "division as sharing and grouping, with and without remainders",
    skills: ["dividing by 1-12", "sharing equally", "remainders for older children"],
    grounding: ["division facts that invert the 1-12 times tables"],
  },
  fractions: {
    defines: "naming, shading and comparing fractions",
    skills: ["identify a fraction", "shade a fraction of a shape", "compare and find equivalent fractions", "fraction of a number"],
    grounding: ["real fractions: halves, thirds, quarters, fifths, eighths"],
  },
  "place-value": {
    defines: "place value: the value of each digit and ordering numbers",
    skills: ["ones/tens/hundreds/thousands", "expanded form", "ordering and comparing numbers"],
    grounding: ["real numbers up to hundreds (younger) or thousands (older)"],
  },
  "telling-time": {
    defines: "reading and writing the time on a clock",
    skills: ["o'clock", "half past", "quarter past and quarter to", "five-minute intervals for older"],
    grounding: ["real clock times; for older children, simple elapsed-time questions"],
  },
  money: {
    defines: "counting money and making change",
    skills: ["adding amounts", "counting coins", "making change"],
    grounding: ["real coins and notes (1c, 5c, 10c, 25c, $1, $5, $10) shown with $ and ¢"],
  },
  "missing-numbers": {
    defines: "completing number sequences",
    skills: ["counting on", "skip counting", "spotting the rule"],
    grounding: ["real arithmetic sequences sized to the age"],
  },
  "word-problems": {
    defines: "real-life word problems, one- and two-step",
    skills: ["choose the operation", "two-step reasoning for older", "show working"],
    grounding: ["everyday scenarios (shopping, sharing, distance, time) with the child's name"],
  },
  shapes: {
    defines: "recognising 2D (and simple 3D) shapes and their properties",
    skills: ["name shapes", "count sides and corners", "draw shapes"],
    grounding: ["real shapes: circle, square, triangle, rectangle, pentagon, hexagon, and cube/sphere/cone for older"],
  },
  counting: {
    defines: "counting objects and writing how many",
    skills: ["one-to-one correspondence", "counting to 10/20/100 by age", "number formation"],
    grounding: ["real countable sets drawn as the theme emoji"],
  },
  "skip-counting": {
    defines: "skip counting by 2s, 5s, 10s (and 3s/4s for older)",
    skills: ["count in steps", "spot multiples"],
    grounding: ["real skip-counting sequences"],
  },
  patterns: {
    defines: "completing and extending repeating patterns",
    skills: ["AB, ABB, ABC patterns", "what comes next", "make your own pattern"],
    grounding: ["real shape, colour and number patterns"],
  },
  matching: {
    defines: "matching pairs across two columns",
    skills: ["numeral to number word", "picture to label", "opposites"],
    grounding: ["real pairs (1-one, big-small, sun-day) sized to the age"],
  },
  reading: {
    defines: "a short reading passage with comprehension questions",
    skills: ["main idea", "sequencing", "character and setting", "cause and effect", "inference for older"],
    grounding: ["an original short passage about the theme, then questions tied to that passage"],
  },
  phonics: {
    defines: "beginning sounds and decoding CVC words",
    skills: ["initial and final sounds", "blending CVC words", "digraphs sh/ch/th for older"],
    grounding: ["real CVC word families: -at, -an, -ig, -op, -un, -et, -ad"],
  },
  "sight-words": {
    defines: "reading, tracing and using high-frequency sight words",
    skills: ["read on sight", "trace", "write", "use in a sentence"],
    grounding: ["the Dolch and Fry sight word lists (the, and, a, to, said, you, was, for, are, they, with, have, this, what, when)"],
  },
  rhyming: {
    defines: "matching and completing rhymes",
    skills: ["hear rhyme", "match rhyming pairs", "finish a rhyme"],
    grounding: ["real rhyming families: cat/hat/bat, dog/log/frog, star/car/jar"],
  },
  spelling: {
    defines: "practising a set of spelling words",
    skills: ["trace", "write", "use in a sentence", "spot the pattern"],
    grounding: ["age-appropriate spelling patterns (CVC, magic-e, blends, common suffixes)"],
  },
  "fill-blank-story": {
    defines: "a short themed story with blanks, completed from a word bank",
    skills: ["read for meaning", "use context", "choose the right word"],
    grounding: ["an original short story about the theme with a matching word bank"],
  },
  "creative-writing": {
    defines: "a writing prompt with sentence starters and lines to write on",
    skills: ["narrative ideas", "sentence starters", "full sentences"],
    grounding: ["a vivid, specific prompt tied to the theme; age-appropriate length"],
  },
  grammar: {
    defines: "parts of speech and punctuation practice",
    skills: ["nouns, verbs, adjectives", "capital letters", "end punctuation", "fix the sentence"],
    grounding: ["real grammar rules; sentences to identify, correct and rewrite"],
  },
  "sentence-building": {
    defines: "building full sentences from given words",
    skills: ["word order", "capital letter and full stop", "expand a sentence"],
    grounding: ["a real word bank the child arranges into correct sentences"],
  },
  "letter-tracing": {
    defines: "tracing letters to build handwriting",
    skills: ["letter formation", "upper and lower case"],
    grounding: ["real letters A-Z, a-z; group by similar strokes"],
  },
  "number-tracing": {
    defines: "tracing numerals to build number writing",
    skills: ["numeral formation"],
    grounding: ["0-9 for the youngest, teens and tens for older"],
  },
  "line-tracing": {
    defines: "pre-writing strokes for the youngest hands",
    skills: ["vertical, horizontal, diagonal, curved and zig-zag lines"],
    grounding: ["the standard pre-writing stroke set"],
  },
  "draw-label": {
    defines: "drawing something and labelling its parts",
    skills: ["observe", "draw", "label with the right words"],
    grounding: ["real parts: a plant (roots, stem, leaf, flower), a body, a bug, a place"],
  },
  "color-by-number": {
    defines: "solve simple problems, then colour by the answer",
    skills: ["solve", "match answer to colour", "fine motor colouring"],
    grounding: ["a small answer-to-colour key and a picture area"],
  },
  "life-cycle": {
    defines: "drawing and labelling a life cycle or simple science topic",
    skills: ["sequence the stages", "label", "explain why each stage matters"],
    grounding: ["real cycles: butterfly, frog, plant, chicken; or the water cycle and states of matter"],
  },
};

// ── 4. Build the preamble injected before every generation ──────────────────

export function intentPreamble(templateId: string, age: number): string {
  const ti = TEMPLATE_INTENT[templateId];
  const dict = EDIT_KEYWORDS.map((k) => `"${k.word}" = ${k.does}`).join(" | ");
  const intent = ti
    ? `THIS worksheet is: ${ti.defines}. Practise these skills: ${ti.skills.join(", ")}. ` +
      `Ground every item in: ${ti.grounding.join("; ")}. Do not drift into another worksheet type.`
    : `Build a clear, age-appropriate worksheet for templateId "${templateId}".`;
  return (
    `INTENT (follow exactly). ${intent} ` +
    `The child is ${age} years old, so size everything to age ${age}. ` +
    `Keyword dictionary, obey precisely: ${dict}. ` +
    `Use only real, factual references; never invent filler; every item must be distinct.`
  );
}

// ── 5. Vocabulary surfaced to users (so they can see the language) ──────────

export const INPUT_VOCABULARY = {
  edits: EDIT_KEYWORDS,
  themes: Object.values(THEMES).map((t) => ({ key: t.key, label: t.label, emoji: t.emoji })),
};
