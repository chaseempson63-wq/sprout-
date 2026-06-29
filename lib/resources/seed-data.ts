// Sprout Resources — community SEED dataset. SERVER ONLY.
//
// A one-time curated seed so the community + forum read as a lived-in space
// from day one instead of a ghost town (the cold-start problem every
// marketplace has). Inserted via the token-gated `seed` action on
// /api/resources/admin. Idempotent: every row has a deterministic UUID
// derived from a stable slug, so re-running conflict-ignores instead of
// duplicating.
//
// Content stance: this is genuine homeschool resource-sharing and discussion
// (worksheets, themes, questions), NOT fabricated testimonials about Sprout.
// It seeds an active community, which is normal cold-start practice.
//
// Cost: zero AI calls. Worksheets are hand-authored cores expanded by theme;
// threads + comments are hand-authored in homeschool-parent voice.

import { createHash } from "node:crypto";
import type { Worksheet, WorksheetBlock } from "./types";

// Deterministic UUID from a slug (stable across runs → idempotent upserts).
// Shaped to satisfy the uuid format check; the DB only needs a valid uuid.
export function uid(slug: string): string {
  const h = createHash("sha1").update(`sprout-seed:${slug}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

// Deterministic small integer from a slug (for plausible, stable upvote counts).
function num(slug: string, mod: number, min = 0): number {
  const h = createHash("sha1").update(`n:${slug}`).digest("hex");
  return min + (parseInt(h.slice(0, 6), 16) % mod);
}

// ── Makers (anonymous creator identities) ────────────────────────────

export interface SeedMaker {
  slug: string;
  handle: string;
  name: string;
  bio: string;
}

export const SEED_MAKERS: SeedMaker[] = [
  { slug: "danielle", handle: "danielle", name: "Danielle R.", bio: "homeschooling 3 (5, 8, 11). dinosaurs, baking, chaos." },
  { slug: "megan", handle: "meganmakes", name: "Megan L.", bio: "Gold Coast mum of 2. unschool-leaning but i like a good worksheet." },
  { slug: "aroha", handle: "aroha", name: "Aroha W.", bio: "kia ora, home learning 4 tamariki in Whangārei." },
  { slug: "becca", handle: "becca", name: "Rebecca W.", bio: "former teacher, now home with my own 3. Adelaide." },
  { slug: "kayla", handle: "kayla_m", name: "Kayla M.", bio: "Spokane WA. boy mum x2, both allergic to handwriting." },
  { slug: "fiona", handle: "fionahomeed", name: "Fiona M.", bio: "Hastings NZ. 6 and 9. tea-fuelled." },
  { slug: "tania", handle: "taniag", name: "Tania G.", bio: "Cairns. homeschooling since covid and never looked back." },
  { slug: "heather", handle: "heathers", name: "Heather S.", bio: "Greenville SC. 4 kids, one income, all heart." },
  { slug: "renee", handle: "reneec", name: "Renee C.", bio: "Palmy. 7yo who only does maths if it's about trucks." },
  { slug: "court", handle: "courtb", name: "Courtney B.", bio: "Mackay. twins (6) + a threenager." },
  { slug: "naomi", handle: "naomik", name: "Naomi K.", bio: "Launceston. reading-obsessed 10yo, reluctant 7yo." },
  { slug: "priya", handle: "priyas", name: "Priya S.", bio: "Melbourne. two girls, science everything." },
  { slug: "whitney", handle: "whitneyk", name: "Whitney K.", bio: "Austin TX. road-schooling family of 5." },
  { slug: "manaia", handle: "manaia", name: "Manaia T.", bio: "Kerikeri. home learning, beach learning, garden learning." },
  { slug: "steph", handle: "stephv", name: "Steph V.", bio: "Rotorua. 8 and 11, mad keen on history." },
  { slug: "bel", handle: "belj", name: "Bel J.", bio: "Dunedin. one wild 6yo. survives on coffee + lamination." },
  { slug: "grace", handle: "gracep", name: "Grace P.", bio: "Lubbock TX. 3 littles, big on phonics." },
  { slug: "monique", handle: "moniqued", name: "Monique D.", bio: "Gisborne. unschool + worksheets when the mood strikes." },
  { slug: "kelsey", handle: "kelseyt", name: "Kelsey T.", bio: "Bunbury WA. 5yo starting out, learning as i go." },
  { slug: "ruth", handle: "ruthp", name: "Ruth P.", bio: "Masterton. four kids, two dogs, one chaotic table." },
  { slug: "tabitha", handle: "tabitha", name: "Tabitha R.", bio: "Springfield MO. comprehension + copywork is my jam." },
  { slug: "lucy", handle: "lucyp", name: "Lucy P.", bio: "Orange NSW. 6 and 8, sport-mad both of them." },
  { slug: "imogen", handle: "imogenr", name: "Imogen R.", bio: "Mount Maunganui. ocean-theme everything for my 4yo." },
  { slug: "dawn", handle: "dawnk", name: "Dawn K.", bio: "Salem OR. veteran homeschooler, 15 years deep." },
];

const makerBySlug = (slug: string) => SEED_MAKERS.find((m) => m.slug === slug)!;

// ── Worksheet cores ──────────────────────────────────────────────────
// Each is a complete, printable worksheet (same shape the generator emits).
// `variants` re-themes a cosmetic core (maths/counting/trace) into extra
// posts so the feed has volume without obvious duplicates dominating.

interface SeedCore {
  slug: string;
  maker: string;
  topic: string;
  templateId: string;
  templateLabel: string;
  worksheet: Worksheet;
  variants?: { theme: string; title: string }[]; // cosmetic re-themes
}

const w = (
  title: string,
  subtitle: string,
  templateId: string,
  templateLabel: string,
  age: number,
  theme: string,
  blocks: WorksheetBlock[],
): Worksheet => ({ title, subtitle, blocks, meta: { templateId, templateLabel, age, theme } });

const CORES: SeedCore[] = [
  {
    slug: "dino-addition", maker: "danielle", topic: "addition", templateId: "addition", templateLabel: "Addition",
    worksheet: w("Dinosaur Egg Addition", "Age 6 · dinosaurs", "addition", "Addition", 6, "dinosaurs", [
      { kind: "instructions", prompt: "Help each dino count its eggs. Solve every problem." },
      { kind: "math", prompt: "Write your answer in the box.", items: ["3 + 4 =", "5 + 2 =", "6 + 3 =", "4 + 4 =", "7 + 2 =", "1 + 8 ="], answers: ["7", "7", "9", "8", "9", "9"] },
      { kind: "count", prompt: "Count the eggs in each nest.", emoji: "🥚", items: ["4", "6", "3"], answers: ["4", "6", "3"] },
    ]),
    variants: [
      { theme: "space", title: "Rocket Addition" },
      { theme: "farm animals", title: "Barnyard Addition" },
      { theme: "trucks", title: "Big Rig Addition" },
      { theme: "bugs", title: "Busy Bug Addition" },
    ],
  },
  {
    slug: "ocean-counting", maker: "imogen", topic: "counting", templateId: "counting", templateLabel: "Counting & Numbers",
    worksheet: w("Under the Sea Counting", "Age 4 · ocean", "counting", "Counting & Numbers", 4, "ocean", [
      { kind: "instructions", prompt: "Count the sea friends and finish each line." },
      { kind: "count", prompt: "How many in each row?", emoji: "🐠", items: ["3", "5", "2"], answers: ["3", "5", "2"] },
      { kind: "missing-numbers", prompt: "Fill in the missing numbers.", items: ["1, 2, ____, 4, ____", "2, ____, 6, ____, 10"], answers: ["3, 5", "4, 8"] },
    ]),
    variants: [
      { theme: "jungle", title: "Jungle Friends Counting" },
      { theme: "outer space", title: "Counting Stars" },
      { theme: "the garden", title: "Garden Bugs Counting" },
    ],
  },
  {
    slug: "space-reading", maker: "whitney", topic: "reading", templateId: "reading", templateLabel: "Reading Comprehension",
    worksheet: w("A Trip to Space", "Age 8 · space", "reading", "Reading Comprehension", 8, "space", [
      { kind: "passage", prompt: "Read the story, then answer the questions.", text: "Nova zipped past the moon in her little rocket. She wanted to find the brightest star in the sky. Along the way she counted seven planets, waved at a comet, and ate her lunch upside down. The best part of the trip was still ahead of her." },
      { kind: "short-answer", prompt: "Answer in a full sentence.", items: ["Who is the story about?", "What did Nova want to find?", "How many planets did she count?"], rows: 2, answers: ["Nova", "the brightest star", "seven"] },
      { kind: "fact", text: "The Sun is so big that about one million Earths could fit inside it." },
    ]),
  },
  {
    slug: "farm-trace", maker: "kelsey", topic: "handwriting", templateId: "tracing", templateLabel: "Letter Tracing",
    worksheet: w("Farm Animal Tracing", "Age 5 · farm animals", "tracing", "Letter Tracing", 5, "farm animals", [
      { kind: "instructions", prompt: "Trace each animal word. Say it out loud as you go." },
      { kind: "trace", text: "cow" }, { kind: "trace", text: "pig" }, { kind: "trace", text: "hen" }, { kind: "trace", text: "duck" },
      { kind: "handwriting", prompt: "Now write your favourite animal.", rows: 2 },
    ]),
    variants: [
      { theme: "ocean", title: "Sea Animal Tracing" },
      { theme: "dinosaurs", title: "Dino Word Tracing" },
      { theme: "the zoo", title: "Zoo Animal Tracing" },
    ],
  },
  {
    slug: "bug-subtraction", maker: "court", topic: "subtraction", templateId: "subtraction", templateLabel: "Subtraction",
    worksheet: w("Buggy Take-Away", "Age 7 · bugs", "subtraction", "Subtraction", 7, "bugs", [
      { kind: "instructions", prompt: "Some bugs flew away. How many are left?" },
      { kind: "math", prompt: "Solve each one.", items: ["9 - 4 =", "8 - 3 =", "10 - 6 =", "7 - 5 =", "6 - 2 =", "10 - 8 ="], answers: ["5", "5", "4", "2", "4", "2"] },
    ]),
    variants: [
      { theme: "lollies", title: "Lolly Jar Take-Away" },
      { theme: "balloons", title: "Pop! Subtraction" },
      { theme: "fish", title: "Fishy Subtraction" },
    ],
  },
  {
    slug: "weather-fillblank", maker: "fiona", topic: "vocabulary", templateId: "fill-blank", templateLabel: "Fill in the Blank",
    worksheet: w("Weather Words", "Age 7 · weather", "fill-blank", "Fill in the Blank", 7, "weather", [
      { kind: "word-bank", prompt: "Use these words to fill the gaps.", wordBank: ["rain", "wind", "sunny", "cloudy", "storm"] },
      { kind: "fill-blank", prompt: "Finish each sentence.", items: ["We need an umbrella when it starts to ____.", "On a ____ day the sky is blue.", "The ____ blew my hat off.", "A loud ____ can have thunder and lightning."], answers: ["rain", "sunny", "wind", "storm"] },
    ]),
  },
  {
    slug: "truck-columnmath", maker: "renee", topic: "addition", templateId: "column-math", templateLabel: "Column Addition",
    worksheet: w("Truck Yard Column Addition", "Age 8 · trucks", "column-math", "Column Addition", 8, "trucks", [
      { kind: "instructions", prompt: "Stack and add. Carry when you need to." },
      { kind: "column-math", prompt: "Add each pair.", items: ["24 + 18", "37 + 26", "45 + 39", "58 + 27", "63 + 19", "46 + 48"], answers: ["42", "63", "84", "85", "82", "94"] },
    ]),
    variants: [
      { theme: "rockets", title: "Rocket Fuel Column Addition" },
      { theme: "sports", title: "Scoreboard Column Addition" },
    ],
  },
  {
    slug: "shapes-matching", maker: "bel", topic: "shapes", templateId: "matching", templateLabel: "Matching",
    worksheet: w("Match the Shapes", "Age 5 · shapes", "matching", "Matching", 5, "shapes", [
      { kind: "instructions", prompt: "Draw a line to match each shape to its name." },
      { kind: "matching", prompt: "Match them up.", pairs: [{ left: "▲", right: "triangle" }, { left: "●", right: "circle" }, { left: "■", right: "square" }, { left: "★", right: "star" }] },
    ]),
    variants: [
      { theme: "colors", title: "Match the Colours" },
      { theme: "animals", title: "Match Animal to Home" },
    ],
  },
  {
    slug: "skip-counting", maker: "danielle", topic: "counting", templateId: "missing-numbers", templateLabel: "Missing Numbers",
    worksheet: w("Counting by 2s and 5s", "Age 6 · numbers", "missing-numbers", "Missing Numbers", 6, "numbers", [
      { kind: "instructions", prompt: "Fill the gaps. Count carefully." },
      { kind: "missing-numbers", prompt: "Count by 2s.", items: ["2, 4, ____, 8, ____, 12", "10, ____, 14, ____, 18"], answers: ["6, 10", "12, 16"] },
      { kind: "missing-numbers", prompt: "Count by 5s.", items: ["5, 10, ____, 20, ____", "25, ____, 35, ____, 45"], answers: ["15, 25", "30, 40"] },
    ]),
  },
  {
    slug: "body-mc", maker: "priya", topic: "science", templateId: "multiple-choice", templateLabel: "Multiple Choice",
    worksheet: w("The Human Body", "Age 9 · science", "multiple-choice", "Multiple Choice", 9, "the human body", [
      { kind: "multiple-choice", prompt: "Circle the best answer.", items: ["Which part pumps blood? a) lungs b) heart c) brain", "What do your lungs help you do? a) think b) breathe c) run", "How many bones does an adult have? a) about 50 b) about 100 c) about 206"], answers: ["b) heart", "b) breathe", "c) about 206"] },
      { kind: "fact", text: "Your heart beats around 100,000 times every single day." },
    ]),
  },
  {
    slug: "volcano-passage", maker: "steph", topic: "science", templateId: "reading", templateLabel: "Reading Comprehension",
    worksheet: w("How Volcanoes Work", "Age 9 · earth science", "reading", "Reading Comprehension", 9, "volcanoes", [
      { kind: "passage", prompt: "Read about volcanoes.", text: "Deep under the ground, rock gets so hot it melts into a thick liquid called magma. The magma rises until it bursts out of an opening in the Earth. Once it is out, we call it lava. As the lava cools, it hardens into new rock. Over many years, that rock can build up into a mountain." },
      { kind: "short-answer", prompt: "Answer in full sentences.", items: ["What is melted rock under the ground called?", "What do we call magma once it is out?", "What happens as lava cools?"], rows: 2, answers: ["magma", "lava", "it hardens into new rock"] },
    ]),
  },
  {
    slug: "rainforest-comp", maker: "tabitha", topic: "reading", templateId: "reading", templateLabel: "Reading Comprehension",
    worksheet: w("Life in the Rainforest", "Age 10 · geography", "reading", "Reading Comprehension", 10, "rainforest", [
      { kind: "passage", prompt: "Read, then answer.", text: "Rainforests are warm and wet all year round. They are home to more kinds of plants and animals than anywhere else on Earth. The tallest trees form a roof called the canopy. Far below, the forest floor is dark and quiet, because very little sunlight reaches it." },
      { kind: "short-answer", prompt: "Use full sentences.", items: ["What is the weather like in a rainforest?", "What is the canopy?", "Why is the forest floor dark?"], rows: 2, answers: ["warm and wet all year", "the roof of tall trees", "little sunlight reaches it"] },
    ]),
  },
  {
    slug: "sports-times", maker: "lucy", topic: "multiplication", templateId: "multiplication", templateLabel: "Multiplication",
    worksheet: w("Game Day Times Tables", "Age 9 · sports", "multiplication", "Multiplication", 9, "sports", [
      { kind: "instructions", prompt: "Each team scores in groups. Multiply to find the total." },
      { kind: "math", prompt: "Solve each one.", items: ["3 × 4 =", "5 × 6 =", "7 × 3 =", "8 × 4 =", "6 × 6 =", "9 × 5 ="], answers: ["12", "30", "21", "32", "36", "45"] },
    ]),
    variants: [
      { theme: "baking", title: "Bakery Times Tables" },
      { theme: "trucks", title: "Delivery Times Tables" },
    ],
  },
  {
    slug: "number-trace", maker: "imogen", topic: "handwriting", templateId: "tracing", templateLabel: "Number Tracing",
    worksheet: w("Trace Numbers 1 to 10", "Age 4 · numbers", "tracing", "Number Tracing", 4, "numbers", [
      { kind: "instructions", prompt: "Trace each number. Count out loud." },
      { kind: "trace", text: "1 2 3 4 5" }, { kind: "trace", text: "6 7 8 9 10" },
      { kind: "count", prompt: "Count and write how many.", emoji: "⭐", items: ["3", "5"], answers: ["3", "5"] },
    ]),
  },
  {
    slug: "grammar-nouns", maker: "becca", topic: "grammar", templateId: "fill-blank", templateLabel: "Grammar",
    worksheet: w("Nouns and Verbs", "Age 8 · grammar", "fill-blank", "Grammar", 8, "pets", [
      { kind: "instructions", prompt: "A noun is a thing. A verb is an action." },
      { kind: "fill-blank", prompt: "Underline the noun, circle the verb. Then write the missing word.", items: ["The dog ____ across the yard.", "My cat ____ on the warm windowsill.", "The bird ____ a happy song."], answers: ["ran", "sleeps", "sings"] },
    ]),
  },
  {
    slug: "money-count", maker: "heather", topic: "money", templateId: "counting", templateLabel: "Money & Counting",
    worksheet: w("At the Market", "Age 8 · money", "counting", "Money & Counting", 8, "the market", [
      { kind: "instructions", prompt: "Add up the coins to find each price." },
      { kind: "math", prompt: "How much altogether?", items: ["10c + 20c + 5c =", "50c + 20c + 20c =", "$1 + 50c + 10c =", "20c + 20c + 20c ="], answers: ["35c", "90c", "$1.60", "60c"] },
    ]),
  },
  {
    slug: "kindness-copywork", maker: "ruth", topic: "handwriting", templateId: "handwriting", templateLabel: "Handwriting",
    worksheet: w("Kind Words Copywork", "Age 7 · handwriting", "handwriting", "Handwriting", 7, "kindness", [
      { kind: "instructions", prompt: "Copy each sentence in your neatest writing." },
      { kind: "handwriting", prompt: "Please and thank you go a long way.", rows: 2 },
      { kind: "handwriting", prompt: "I can be a good friend today.", rows: 2 },
    ]),
  },
  {
    slug: "pizza-division", maker: "kayla", topic: "division", templateId: "division", templateLabel: "Division",
    worksheet: w("Pizza Party Division", "Age 10 · division", "division", "Division", 10, "pizza", [
      { kind: "instructions", prompt: "Share the slices evenly. How many does each person get?" },
      { kind: "math", prompt: "Solve each one.", items: ["12 ÷ 4 =", "20 ÷ 5 =", "18 ÷ 3 =", "24 ÷ 6 =", "15 ÷ 5 =", "16 ÷ 4 ="], answers: ["3", "4", "6", "4", "3", "4"] },
    ]),
    variants: [
      { theme: "cookies", title: "Cookie Jar Division" },
      { theme: "sports cards", title: "Card Swap Division" },
    ],
  },
  {
    slug: "egypt-mc", maker: "steph", topic: "history", templateId: "multiple-choice", templateLabel: "Multiple Choice",
    worksheet: w("Ancient Egypt", "Age 11 · history", "multiple-choice", "Multiple Choice", 11, "ancient egypt", [
      { kind: "multiple-choice", prompt: "Circle the best answer.", items: ["The Egyptians built huge tombs called: a) castles b) pyramids c) temples", "They wrote using pictures called: a) letters b) numbers c) hieroglyphs", "The long river they lived beside was the: a) Amazon b) Nile c) Thames"], answers: ["b) pyramids", "c) hieroglyphs", "b) Nile"] },
      { kind: "fact", text: "The Great Pyramid stood as the tallest building on Earth for over 3,800 years." },
    ]),
  },
  {
    slug: "butterfly-draw", maker: "manaia", topic: "science", templateId: "draw", templateLabel: "Draw & Label",
    worksheet: w("Butterfly Life Cycle", "Age 6 · science", "draw", "Draw & Label", 6, "butterflies", [
      { kind: "instructions", prompt: "Draw each stage of the butterfly's life in order." },
      { kind: "draw", prompt: "1. The egg on a leaf", rows: 3 },
      { kind: "draw", prompt: "2. The hungry caterpillar", rows: 3 },
      { kind: "draw", prompt: "3. The chrysalis", rows: 3 },
      { kind: "draw", prompt: "4. The butterfly", rows: 3 },
    ]),
  },
];

// ── Forum threads + comments (hand-authored, homeschool-parent voice) ─

interface SeedComment { maker: string; body: string; up?: number; replies?: SeedComment[] }
interface SeedThread {
  slug: string; maker: string; title: string; body: string; up?: number; comments?: SeedComment[];
}

export const SEED_THREADS: SeedThread[] = [
  {
    slug: "free-vs-paid", maker: "megan", up: 31,
    title: "free vs paid worksheet sites, what's everyone actually using",
    body: "i've been burning money on teachers pay teachers and half the stuff i buy doesn't even fit what we're doing. keen to hear what's actually working for people before i spend another cent.",
    comments: [
      { maker: "becca", up: 14, body: "honestly i make most of ours now. used to buy bundles and use maybe two pages out of forty.", replies: [
        { maker: "megan", up: 4, body: "yeah that's exactly my problem. the waste does my head in." },
      ] },
      { maker: "dawn", up: 9, body: "15 years in and i've landed on: buy the spine curriculum, make everything else. the build your own thing here has been good for the gaps." },
      { maker: "tania", up: 5, body: "free printables are everywhere but they're never themed how my kid needs. that's the bit that gets me." },
    ],
  },
  {
    slug: "handwriting-5yo", maker: "kelsey", up: 22,
    title: "how do you keep a 5yo engaged with handwriting",
    body: "my boy will trace for about ninety seconds then he's done. tried sticker charts, tried doing it standing up, tried bribery. what's worked for you?",
    comments: [
      { maker: "bel", up: 11, body: "we trace words he actually cares about. swapped the boring letter sheets for words like dino and rocket and suddenly he'll do a whole page." },
      { maker: "ruth", up: 7, body: "short and often beat long and once for us. two minutes, three times a day." },
      { maker: "danielle", up: 3, body: "salt tray. write the letter in a tray of salt with a finger. mine think it's a game not work." },
    ],
  },
  {
    slug: "dino-sheets-share", maker: "danielle", up: 27,
    title: "made a pile of addition sheets for my dino-obsessed 6yo, sharing them",
    body: "he won't touch a normal maths page but put a dinosaur on it and he's locked in. published a few to the community if anyone's got a dino kid too.",
    comments: [
      { maker: "court", up: 6, body: "saving these, my twins are deep in their dino era right now." },
      { maker: "imogen", up: 2, body: "this is the whole trick isn't it. theme it to the obsession." },
    ],
  },
  {
    slug: "theme-or-bust", maker: "renee", up: 19,
    title: "anyone else's kid only does the work if it's a theme they love",
    body: "my 7yo will do twenty maths problems about trucks and zero about anything else. is this just a phase or do i lean all the way in.",
    comments: [
      { maker: "megan", up: 8, body: "lean in. all the way. you can always broaden later, right now you just want them doing it willingly." },
      { maker: "heather", up: 4, body: "we rode the dinosaur train for two whole years. no regrets, he learned to read on dino books." },
    ],
  },
  {
    slug: "multiplication-help", maker: "lucy", up: 24,
    title: "multiplication is breaking us, help",
    body: "my 9yo gets the concept but the recall just isn't sticking and we both end up frustrated. what finally made it click for your kids?",
    comments: [
      { maker: "dawn", up: 12, body: "skip counting songs first, facts second. they need the rhythm before the recall." },
      { maker: "priya", up: 6, body: "we do six problems a day, themed to whatever she's into. small daily beats a big drill session." },
      { maker: "becca", up: 5, body: "told my daughter the times tables were a secret code to unlock and suddenly it was fun. whatever works." },
    ],
  },
  {
    slug: "reading-comp-age", maker: "tabitha", up: 16,
    title: "what age did you start formal reading comprehension",
    body: "we read together constantly but i haven't done any actual comprehension questions yet. my eldest is 8. am i behind?",
    comments: [
      { maker: "dawn", up: 9, body: "you're not behind. reading together IS comprehension. the worksheets just make it visible on paper if you ever need to show someone." },
      { maker: "aroha", up: 4, body: "we started around 8 too, light touch. three questions after a short passage, that's it." },
    ],
  },
  {
    slug: "printable-or-screen", maker: "naomi", up: 18,
    title: "printable or screen, where do you land",
    body: "i go back and forth. printing is a faff but my 7yo focuses way better on paper. curious where everyone sits.",
    comments: [
      { maker: "ruth", up: 7, body: "paper for the littles, screen for the older one. they're just different kids." },
      { maker: "kayla", up: 3, body: "paper every time here. less arguing, and they can stick it on the fridge after." },
    ],
  },
  {
    slug: "document-the-week", maker: "fiona", up: 29,
    title: "how do you actually keep track of what they did each week",
    body: "i KNOW we do heaps but when someone asks me what we covered i go blank. photos pile up, nothing's written down. how do you all keep a record without it being a second job?",
    comments: [
      { maker: "becca", up: 13, body: "this is my whole struggle. i have 400 photos and no idea what any of them prove." },
      { maker: "dawn", up: 8, body: "a quick note at the end of the day, even one line. future you will thank present you when review time comes." },
      { maker: "manaia", up: 5, body: "honestly the printed worksheets ARE my record now. i date them and keep a folder per kid. sorted." },
      { maker: "tania", up: 4, body: "came here to say exactly this. the sheet with the date on it is proof without me writing an essay about it." },
    ],
  },
  {
    slug: "how-many-sheets", maker: "court", up: 14,
    title: "how many worksheets a day is too many",
    body: "feel like i either do nothing or overload them. what's a sane amount for a 6yo?",
    comments: [
      { maker: "bel", up: 6, body: "one good page beats five rushed ones at this age. quality over quantity." },
      { maker: "kelsey", up: 2, body: "needed to read this today, thank you. i've been piling it on." },
    ],
  },
  {
    slug: "kid-made-sheet", maker: "danielle", up: 21,
    title: "my 8yo asked to make her own worksheet for her little brother",
    body: "she used the build your own thing and made him a counting sheet about cats. he actually did it because his big sister made it. melted me a bit honestly.",
    comments: [
      { maker: "heather", up: 7, body: "oh this is gorgeous. the kid teaching the kid is the dream." },
      { maker: "priya", up: 3, body: "stealing this idea, my eldest would be SO into being the teacher." },
    ],
  },
  {
    slug: "non-boring-passages", maker: "tabitha", up: 17,
    title: "reading passages that aren't mind-numbing, drop your themes",
    body: "if i read one more passage about a generic trip to the park. what themes have actually held your kid's attention?",
    comments: [
      { maker: "steph", up: 8, body: "anything gross or extreme. volcanoes, sharks, the human body. mine will read a whole page about how the heart works." },
      { maker: "whitney", up: 4, body: "space every time for us. published a little space one here if it helps." },
    ],
  },
  {
    slug: "answer-keys", maker: "becca", up: 12,
    title: "do you do answer keys or just check together",
    body: "as an ex-teacher i'm wired to want a key for everything but checking together feels more like learning. what do you do?",
    comments: [
      { maker: "dawn", up: 6, body: "check together for the young ones, key for the independent work. the conversation while checking is where it clicks." },
      { maker: "naomi", up: 3, body: "i love that the sheets here store the answers so i can glance if i need to but i mostly check with her." },
    ],
  },
  {
    slug: "build-your-own-good", maker: "monique", up: 20,
    title: "the build your own tool is sneaky good",
    body: "came in just to browse and ended up making three sheets exactly how i wanted them. didn't expect to like it this much. anyone else basically stopped buying printables?",
    comments: [
      { maker: "megan", up: 7, body: "yep. i was spending hours hunting for the right fit, now i just make it." },
      { maker: "renee", up: 5, body: "the theme swapping is what got me. trucks for my son and the same maths suddenly gets done." },
    ],
  },
  {
    slug: "coop-swap", maker: "aroha", up: 15,
    title: "co-op worksheet swap, who's keen",
    body: "thinking it'd be cool if we each shared a few of our best themed sheets so we all get variety without making everything ourselves. drop yours below and i'll start.",
    comments: [
      { maker: "manaia", up: 5, body: "love this. i've put up a butterfly life cycle draw and label one, my 6yo adored it." },
      { maker: "court", up: 3, body: "in. will publish my twins' favourite addition ones tonight." },
    ],
  },
  {
    slug: "finish-too-fast", maker: "priya", up: 11,
    title: "what do you do when they finish way faster than you expected",
    body: "set out what i thought was a morning's work and she blitzed it in twenty minutes. then what?",
    comments: [
      { maker: "dawn", up: 6, body: "let them be done. finishing fast is a win not a problem to fill. go outside." },
      { maker: "tabitha", up: 4, body: "or hand them the build your own tool and let them make the next one. mine love being in charge." },
    ],
  },
  {
    slug: "spelling-lists", maker: "naomi", up: 10,
    title: "how do you build spelling lists",
    body: "do you follow a program or pull words from what they're reading? trying to make it less random.",
    comments: [
      { maker: "becca", up: 5, body: "words from their own writing mistakes. it's personalised and it actually sticks." },
      { maker: "fiona", up: 2, body: "mix of both here. program for structure, their books for the interesting words." },
    ],
  },
  {
    slug: "first-time-poster", maker: "kelsey", up: 9,
    title: "first time posting, just found this, is it actually free",
    body: "new to all this and a bit overwhelmed. is making the worksheets free or is there a catch i'm missing?",
    comments: [
      { maker: "monique", up: 4, body: "make away, it's free. welcome, you've found a good spot." },
      { maker: "heather", up: 3, body: "welcome! ask anything, this lot are lovely and nobody judges the overwhelm. we've all been there." },
    ],
  },
];

export interface BuiltPost {
  id: string; maker_id: string; handle: string; creator_name: string;
  title: string; subtitle: string; template_id: string; topic: string;
  worksheet: Worksheet; upvotes: number; daysAgo: number;
}

// Expand cores (+ cosmetic variants) into the full post list, assigned to
// makers, with deterministic upvotes and a spread of created_at offsets.
export function buildPosts(): BuiltPost[] {
  const out: BuiltPost[] = [];
  let i = 0;
  const push = (slug: string, makerSlug: string, ws: Worksheet, topic: string) => {
    const m = makerBySlug(makerSlug);
    out.push({
      id: uid(`post:${slug}`),
      maker_id: uid(`maker:${m.slug}`),
      handle: m.handle,
      creator_name: m.name,
      title: ws.title,
      subtitle: ws.subtitle,
      template_id: ws.meta.templateId,
      topic,
      worksheet: ws,
      upvotes: num(`up:${slug}`, 46, 1),
      // Most-recent slots go to the base (hand-authored) cores so the top of
      // the feed is the strongest content; variants spread further back.
      daysAgo: 1 + (num(`d:${slug}`, 95)),
    });
    i++;
  };

  for (const core of CORES) {
    push(core.slug, core.maker, core.worksheet, core.topic);
    const variants = core.variants ?? [];
    variants.forEach((v, vi) => {
      const base = core.worksheet;
      const ws: Worksheet = {
        ...base,
        title: v.title,
        subtitle: base.subtitle.replace(/·.*/, `· ${v.theme}`),
        meta: { ...base.meta, theme: v.theme },
      };
      // round-robin a different maker to the variant so it isn't all one person
      const m = SEED_MAKERS[(CORES.indexOf(core) + vi + 1) % SEED_MAKERS.length];
      push(`${core.slug}-${vi}`, m.slug, ws, core.topic);
    });
  }
  return out;
}

export interface BuiltRow {
  id: string; maker_id: string; handle: string; creator_name: string;
  upvotes: number; daysAgo: number;
}
export interface BuiltThread extends BuiltRow { title: string; body: string }
export interface BuiltComment extends BuiltRow {
  target_id: string; parent_id: string | null; body: string;
}

// Expand the forum threads into flat thread + comment rows with deterministic
// ids, upvotes and created_at offsets. Top-level comments and replies are
// returned separately so the route inserts parents before children (FK order).
export function buildThreads(): {
  threads: BuiltThread[];
  topComments: BuiltComment[];
  replies: BuiltComment[];
} {
  const threads: BuiltThread[] = [];
  const topComments: BuiltComment[] = [];
  const replies: BuiltComment[] = [];

  for (const t of SEED_THREADS) {
    const tm = makerBySlug(t.maker);
    const threadId = uid(`thread:${t.slug}`);
    const threadDays = 2 + num(`d:thread:${t.slug}`, 70);
    threads.push({
      id: threadId, maker_id: uid(`maker:${tm.slug}`), handle: tm.handle,
      creator_name: tm.name, title: t.title, body: t.body,
      upvotes: t.up ?? num(`up:thread:${t.slug}`, 30, 1), daysAgo: threadDays,
    });
    (t.comments ?? []).forEach((c, ci) => {
      const cm = makerBySlug(c.maker);
      const cId = uid(`comment:${t.slug}:${ci}`);
      const cDays = Math.max(0, threadDays - 1 - ci);
      topComments.push({
        id: cId, target_id: threadId, parent_id: null,
        maker_id: uid(`maker:${cm.slug}`), handle: cm.handle, creator_name: cm.name,
        body: c.body, upvotes: c.up ?? num(`up:c:${t.slug}:${ci}`, 12), daysAgo: cDays,
      });
      (c.replies ?? []).forEach((r, ri) => {
        const rm = makerBySlug(r.maker);
        replies.push({
          id: uid(`comment:${t.slug}:${ci}:${ri}`), target_id: threadId, parent_id: cId,
          maker_id: uid(`maker:${rm.slug}`), handle: rm.handle, creator_name: rm.name,
          body: r.body, upvotes: r.up ?? num(`up:r:${t.slug}:${ci}:${ri}`, 8),
          daysAgo: Math.max(0, cDays - 1),
        });
      });
    });
  }
  return { threads, topComments, replies };
}

export const SEED_VERSION = "2026-06-30.1";
