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
  if (/sea|under the sea|fish|shark|whale|mermaid|underwater/.test(t)) return THEMES.ocean;
  if (/fruit|apple|banana|veg|snack|pizza|cookie|cake/.test(t)) return THEMES.food;
  if (/puppy|dog|cat|bear|lion|tiger|jungle|safari|zoo|bug|insect|frog|bird/.test(t)) return THEMES.animal;
  if (/soccer|football|basketball|tennis|race|swim|cricket|rugby|ball/.test(t)) return THEMES.sport;
  if (/rocket|planet|star|moon|galaxy|alien|astronaut/.test(t)) return THEMES.space;
  if (/car|truck|train|plane|boat|bike|bus/.test(t)) return THEMES.vehicle;
  if (/dragon|castle|knight|princess|prince|wizard|fairy/.test(t)) return THEMES.fairytale;
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
    defines: "multiplication: times tables for younger children, genuine multi-digit for older",
    skills: ["times tables for ages 7-9", "2-digit by 1-digit for age 9-10", "2-digit by 2-digit and beyond for age 11+"],
    grounding: ["times tables only for ages 7-9; real multi-digit multiplication (e.g. 34 x 27, 128 x 6) for ages 10+; NEVER cap an older child at the 1-12 tables"],
  },
  division: {
    defines: "division as sharing and grouping, scaling to long division for older",
    skills: ["table-based division for ages 8-9", "multi-digit division and remainders for age 10+"],
    grounding: ["table facts only for ages 8-9; real multi-digit division (e.g. 864 / 6, 1,250 / 25) for ages 10+; NEVER cap an older child at the 1-12 tables"],
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
    defines: "counting money, making change, and money operations with decimals",
    skills: ["counting coins (young)", "dollars and cents with decimals", "change, discount and tax for older children"],
    grounding: ["whole-dollar amounts only for ages 6-8; for age 9+ use dollars AND cents with decimals (e.g. $11.27 + $97.82) plus change, discount and tax problems; never give an older child whole-dollar sums under $50"],
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

// ── 6. Masked preset instructions (the chip -> Venice layer) ─────────────────
//
// Each edit chip shows ONE word but sends Venice a concrete, template-specific
// instruction WITH a worked example. Testing settled the design: concrete+example
// produced ~5x the difficulty of baseline, consistently; reciting a generic grade
// benchmark ("fractions, decimals, percentages") came back EASIER than baseline.
// So each hint names a real harder/easier example along the dimension that fits
// the template (more digits for arithmetic, more sides/faces for geometry, real
// money amounts for money math). The wrapper supplies exactly ONE difficulty
// keyword (harder/easier); the hint text itself stays free of difficulty AND
// length keywords, so cumulative compounding and the length edits stay clean.

interface DifficultyHint {
  harder: string;
  easier: string;
}

const DIFFICULTY_HINTS: Record<string, DifficultyHint> = {
  addition: {
    harder: "two and three-digit sums with regrouping, like 367 + 248, set out in columns",
    easier: "single-digit sums within ten, like 4 + 3, no regrouping",
  },
  subtraction: {
    harder: "two and three-digit problems that need borrowing, like 504 - 178, set out in columns",
    easier: "small take-aways within ten, like 9 - 4, with no borrowing",
  },
  multiplication: {
    harder: "up to 3-digit by 2-digit, like 426 × 38, never times tables",
    easier: "single-digit times tables, like 4 × 6",
  },
  division: {
    harder: "multi-digit division with remainders, like 847 ÷ 6, not basic tables",
    easier: "basic table facts, like 12 ÷ 3",
  },
  money: {
    harder: "dollars and cents with change, discount or tax, like 15% off a $42.80 jacket",
    easier: "whole-dollar amounts under twenty, like $5 + $3",
  },
  "word-problems": {
    harder: "two-step problems combining operations, like buy 3 packs of 12 then share among 4",
    easier: "one-step problems with small numbers, like 5 plus 3 makes 8",
  },
  fractions: {
    harder: "unlike denominators and fraction-of-a-number, like 3/8 of 24, and equivalents",
    easier: "halves and quarters of a shape, like shading 1/2 of a circle",
  },
  "place-value": {
    harder: "numbers into the thousands, like the value of 8 in 4,827, and ordering them",
    easier: "tens and ones to 100, like the value of 5 in 53",
  },
  "telling-time": {
    harder: "five-minute intervals and elapsed time, like what time is 40 minutes after 3:15",
    easier: "o'clock and half past only, like reading 3:00 and 6:30",
  },
  "missing-numbers": {
    harder: "bigger steps from larger first numbers, like 150, 175, ____, 225",
    easier: "count by ones and twos with small numbers, like 2, 4, ____, 8",
  },
  "skip-counting": {
    harder: "skip count by 3s, 4s and 6s from a larger first number, like 24, 30, 36, ____",
    easier: "skip count by twos, fives and tens from zero, like 5, 10, ____",
  },
  counting: {
    harder: "count sets up to twenty and write the numeral, like counting 17 dots",
    easier: "count small sets up to five, like counting 4 dots",
  },
  patterns: {
    harder: "number and growing patterns, like 1, 2, 4, 8, ____, and ABC shape patterns",
    easier: "two-step color patterns, like red, blue, red, blue, ____",
  },
  shapes: {
    harder: "pentagons, hexagons and octagons, and basic 3D shapes, naming sides, corners and faces, like a cube's 6 faces",
    easier: "naming circle, square and triangle, and counting their sides",
  },
  matching: {
    harder: "abstract pairs like opposites or synonyms, such as matching 'big' to 'enormous'",
    easier: "match numerals to number words, like 3 to three",
  },
  reading: {
    harder: "a fuller passage with inference and cause-and-effect questions, like why a character felt worried, not just recall",
    easier: "a short, plain passage with literal who and what questions",
  },
  phonics: {
    harder: "digraphs and blends, like sh, ch, th and decoding words like 'shrub'",
    easier: "single beginning sounds and short CVC words, like 'mat' and 'pin'",
  },
  "sight-words": {
    harder: "less common multi-letter sight words, like 'because', 'through' and 'would'",
    easier: "the most common short sight words, like 'the', 'and', 'you'",
  },
  rhyming: {
    harder: "completing rhyming couplets and less obvious rhymes, like 'mountain' and 'fountain'",
    easier: "matching short rhyming pairs, like 'top' and 'hop'",
  },
  spelling: {
    harder: "multi-syllable words with patterns like magic-e and suffixes, such as 'beautiful'",
    easier: "short CVC words, like 'big', 'red', 'top'",
  },
  "fill-blank-story": {
    harder: "a fuller story with blanks needing context to solve, not obvious word-bank picks",
    easier: "a short story with a few clear blanks straight from the word bank",
  },
  "creative-writing": {
    harder: "a richer prompt asking for detail, dialogue and a full piece, like describing a character's feelings",
    easier: "a short prompt with sentence openers and a few lines",
  },
  grammar: {
    harder: "adjectives and adverbs, not just nouns and verbs, plus fixing punctuation, like correcting 'the small boy ran fast'",
    easier: "telling nouns from verbs, and putting a capital and full stop on each sentence",
  },
  "sentence-building": {
    harder: "fuller sentences to arrange that include describing words, like 'the tall tree swayed slowly'",
    easier: "short three or four word sentences, like 'the boy ran'",
  },
  "letter-tracing": {
    harder: "the full alphabet in upper and lower case, like Aa Bb Cc through Zz",
    easier: "a few first letters, like A, B and C",
  },
  "number-tracing": {
    harder: "teen and two-digit numbers, like 10 through 20",
    easier: "single digits, like 0 to 5",
  },
  "line-tracing": {
    harder: "curved, looping and zig-zag strokes, like waves and spirals",
    easier: "straight up-and-down and across lines",
  },
  "draw-label": {
    harder: "several parts to label with a sentence on each, like a plant's roots, stem, leaf and flower and what each does",
    easier: "a few main parts to label, like the head, body and legs",
  },
  "color-by-number": {
    harder: "two-step problems behind each color, like 6 × 7 mapping to a color",
    easier: "single-digit sums behind each color, like 2 + 3",
  },
  "life-cycle": {
    harder: "all stages in order with a sentence on why each matters, like the four stages of a butterfly",
    easier: "naming the main stages in order, like seed then plant",
  },
};

// Safety net only — every catalog template has a real hint above.
const GENERIC_HINT: DifficultyHint = {
  harder: "bigger numbers and one further reasoning step",
  easier: "smaller numbers and fewer steps",
};

// Compose the masked instruction for an edit chip. The chip shows `word`; Venice
// receives this. Difficulty edits carry exactly one keyword (harder/easier) so
// repeated presses still compound; length edits stay difficulty-neutral. The
// concrete example is anchored (e.g. "up to 3-digit by 2-digit") so repeated
// "harder" escalates within a sane ceiling, not into absurd operands.
export function presetPrompt(word: string, templateId: string, age: number): string {
  const hint = DIFFICULTY_HINTS[templateId] ?? GENERIC_HINT;
  switch (word) {
    case "harder":
      return `Make this harder for a ${age}-year-old: ${hint.harder}. Keep every item distinct.`;
    case "easier":
      return `Make this easier for a ${age}-year-old: ${hint.easier}. Keep every item distinct.`;
    case "longer":
      return `Make this longer so it fills the whole page for a ${age}-year-old, keeping the difficulty the same: a fuller set of questions and one further section.`;
    case "shorter":
      return `Make this shorter and tighter for a ${age}-year-old, keeping the difficulty the same: only the handful of core questions, trim the rest.`;
    case "more questions":
      return `Include more questions of the same kind and difficulty for a ${age}-year-old, keeping the existing ones, with no repeats or reverses.`;
    default:
      return word;
  }
}
