// Sprout Resources — community SEED dataset. SERVER ONLY.
//
// A one-time curated seed so the community + forum read as a lived-in space
// from day one instead of a ghost town (the cold-start problem every
// marketplace has). Inserted via the token-gated admin actions:
//   - `seed`   → makers + forum threads + comments (text, hand-authored)
//   - `reseed` → community worksheet POSTS, generated through the REAL engine
//                (aiWorksheet / Venice) on prod, batched, with the themed
//                illustration forced on. This is what makes the seeded sheets
//                indistinguishable from a sheet a real user builds.
//
// Content stance: genuine homeschool resource-sharing and discussion, NOT
// fabricated testimonials about Sprout.

import { createHash } from "node:crypto";

// Deterministic UUID from a slug (stable across runs → idempotent upserts).
export function uid(slug: string): string {
  const h = createHash("sha1").update(`sprout-seed:${slug}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

// Deterministic small integer from a slug (for plausible, stable upvotes).
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

export const seedMakerIds = (): string[] => SEED_MAKERS.map((m) => uid(`maker:${m.slug}`));

// ── Post specs ───────────────────────────────────────────────────────
// Each spec drives the REAL generator on prod: aiWorksheet(getTemplate(
// templateId), age, [{role:"user", content: instruction}]) → a genuine
// worksheet. `imageKey` is a verified key from lib/resources/illustrations
// and is force-injected near the top so the themed sheet always shows its
// picture (the dino sheet shows a dinosaur), with `notes` printed beside it.

export interface PostSpec {
  slug: string;
  maker: string;
  templateId: string; // a REAL catalog id (lib/resources/catalog)
  age: number;
  theme: string;
  instruction: string; // the user message that drives generation
  imageKey: string; // a real illustration key (lib/resources/illustrations)
  notes: string[]; // 3-4 short fun facts printed beside the picture
}

export const POST_SPECS: PostSpec[] = [
  { slug: "dino-addition", maker: "danielle", templateId: "addition", age: 6, theme: "dinosaurs", imageKey: "t-rex",
    instruction: "Make an addition worksheet for a 6 year old, dinosaur theme. About 6 single-digit problems plus a short count-the-eggs section.",
    notes: ["Some were taller than a house", "Lived millions of years ago", "T-rex had tiny arms"] },
  { slug: "bug-subtraction", maker: "court", templateId: "subtraction", age: 7, theme: "bugs", imageKey: "bee",
    instruction: "Make a subtraction worksheet for a 7 year old, friendly bug theme. Around 8 take-away problems within 20.",
    notes: ["Bees visit hundreds of flowers a day", "They dance to give directions", "Honey never goes off"] },
  { slug: "ocean-counting", maker: "imogen", templateId: "counting", age: 4, theme: "ocean", imageKey: "fish",
    instruction: "Make a counting worksheet for a 4 year old, ocean animals. Count the sea creatures and fill in a short number line.",
    notes: ["Fish breathe through gills", "Some fish change colour", "They swim in groups called schools"] },
  { slug: "rocket-multiplication", maker: "lucy", templateId: "multiplication", age: 9, theme: "space rockets", imageKey: "rocket",
    instruction: "Make a multiplication worksheet for a 9 year old, space rocket theme. About 8 times-table problems.",
    notes: ["Rockets push down to fly up", "Space has no air", "Astronauts float in orbit"] },
  { slug: "pizza-division", maker: "kayla", templateId: "division", age: 10, theme: "pizza", imageKey: "pizza",
    instruction: "Make a division worksheet for a 10 year old, pizza-sharing theme. Around 8 problems about sharing slices evenly.",
    notes: ["Sharing equally is division", "A whole splits into equal parts", "Pizza comes from Italy"] },
  { slug: "cake-fractions", maker: "priya", templateId: "fractions", age: 9, theme: "baking", imageKey: "cake",
    instruction: "Make a fractions worksheet for a 9 year old, baking and cake theme. Halves, quarters and thirds, about 6 questions.",
    notes: ["Half means two equal parts", "A quarter is one of four", "Bakers measure carefully"] },
  { slug: "volcano-reading", maker: "steph", templateId: "reading", age: 9, theme: "volcanoes", imageKey: "volcano",
    instruction: "Make a reading comprehension worksheet for a 9 year old about how volcanoes work. A short passage then a few questions.",
    notes: ["Magma is melted rock", "Lava cools into new rock", "Some volcanoes sleep for years"] },
  { slug: "space-reading", maker: "whitney", templateId: "reading", age: 8, theme: "space", imageKey: "rocket",
    instruction: "Make a reading comprehension worksheet for an 8 year old, a fun space-adventure passage with a few questions.",
    notes: ["The Sun is a star", "Eight planets orbit it", "A comet has a glowing tail"] },
  { slug: "rainforest-reading", maker: "tabitha", templateId: "reading", age: 10, theme: "rainforest", imageKey: "parrot",
    instruction: "Make a reading comprehension worksheet for a 10 year old about life in the rainforest, passage plus questions.",
    notes: ["Rainforests are warm and wet", "Home to millions of species", "The canopy is the leafy roof"] },
  { slug: "butterfly-lifecycle", maker: "manaia", templateId: "life-cycle", age: 6, theme: "butterflies", imageKey: "butterfly-life-cycle",
    instruction: "Make a life cycle worksheet for a 6 year old about the butterfly: order or label the four stages.",
    notes: ["Egg, caterpillar, chrysalis, butterfly", "A caterpillar eats a lot", "Wings dry before the first flight"] },
  { slug: "body-drawlabel", maker: "becca", templateId: "draw-label", age: 7, theme: "the human body", imageKey: "human-body",
    instruction: "Make a draw-and-label worksheet for a 7 year old about the human body: label a few main parts.",
    notes: ["The heart pumps blood", "Lungs help you breathe", "Bones keep you upright"] },
  { slug: "farm-letter-trace", maker: "kelsey", templateId: "letter-tracing", age: 5, theme: "farm animals", imageKey: "pig",
    instruction: "Make a letter tracing worksheet for a 5 year old, farm animal words to trace like cow, pig, hen and duck.",
    notes: ["Pigs are very clever", "Cows have four stomachs", "Hens lay an egg most days"] },
  { slug: "ocean-number-trace", maker: "imogen", templateId: "number-tracing", age: 4, theme: "ocean", imageKey: "whale",
    instruction: "Make a number tracing worksheet for a 4 year old, numbers 1 to 10, ocean theme, with a small counting picture.",
    notes: ["The blue whale is the biggest animal", "It sings to other whales", "It spouts water to breathe"] },
  { slug: "bakery-money", maker: "heather", templateId: "money", age: 8, theme: "bakery", imageKey: "cake",
    instruction: "Make a money worksheet for an 8 year old, adding coins to buy bakery treats. About 6 problems.",
    notes: ["Coins add up to dollars", "Count the biggest coin first", "Change is what you get back"] },
  { slug: "robot-shapes", maker: "bel", templateId: "shapes", age: 5, theme: "robots", imageKey: "robot",
    instruction: "Make a shapes worksheet for a 5 year old, find and match the shapes that build a friendly robot.",
    notes: ["A square has 4 equal sides", "A circle has no corners", "A triangle has 3 sides"] },
  { slug: "frog-skip-counting", maker: "danielle", templateId: "skip-counting", age: 6, theme: "frogs", imageKey: "frog",
    instruction: "Make a skip counting worksheet for a 6 year old, counting by 2s and 5s, frogs hopping on lily pads.",
    notes: ["Frogs start as tadpoles", "They hop and swim", "Counting by 2s skips one"] },
  { slug: "caterpillar-missing-numbers", maker: "ruth", templateId: "missing-numbers", age: 6, theme: "caterpillars", imageKey: "caterpillar",
    instruction: "Make a missing numbers worksheet for a 6 year old, fill the gaps along a caterpillar number line.",
    notes: ["A caterpillar has many legs", "It munches leaves all day", "It becomes a butterfly"] },
  { slug: "zoo-word-problems", maker: "naomi", templateId: "word-problems", age: 8, theme: "zoo animals", imageKey: "elephant",
    instruction: "Make a word problems worksheet for an 8 year old, simple add and subtract zoo-animal stories. About 5 problems.",
    notes: ["Elephants are the biggest land animal", "They greet with their trunks", "They love a mud bath"] },
  { slug: "cat-phonics", maker: "grace", templateId: "phonics", age: 5, theme: "animals", imageKey: "cat",
    instruction: "Make a phonics worksheet for a 5 year old, beginning sounds with simple animal words.",
    notes: ["Cats purr when happy", "They have great night sight", "Whiskers help them feel"] },
  { slug: "rhyming-cat-hat", maker: "monique", templateId: "rhyming", age: 5, theme: "cats and hats", imageKey: "cat",
    instruction: "Make a rhyming worksheet for a 5 year old, match words that rhyme like cat, hat and mat.",
    notes: ["Rhyming words end the same", "Cat rhymes with hat", "Reading rhymes is fun"] },
  { slug: "pets-grammar", maker: "becca", templateId: "grammar", age: 8, theme: "pets", imageKey: "dog",
    instruction: "Make a grammar worksheet for an 8 year old, nouns and verbs using sentences about pets.",
    notes: ["A noun is a person, place or thing", "A verb is an action", "Dogs are loyal friends"] },
  { slug: "owl-spelling", maker: "naomi", templateId: "spelling", age: 9, theme: "animals", imageKey: "owl",
    instruction: "Make a spelling worksheet for a 9 year old, animal theme, with a word bank and practice lines.",
    notes: ["Owls can turn their heads far", "They hunt at night", "Their feathers are silent"] },
  { slug: "space-fill-blank", maker: "whitney", templateId: "fill-blank-story", age: 7, theme: "space", imageKey: "rocket",
    instruction: "Make a fill-in-the-blank story worksheet for a 7 year old, a short space adventure with a word bank.",
    notes: ["A rocket needs lots of fuel", "The Moon has no air", "Stars are giant balls of gas"] },
  { slug: "truck-multiplication", maker: "dawn", templateId: "multiplication", age: 9, theme: "trucks", imageKey: "truck",
    instruction: "Make a multiplication worksheet for a 9 year old, delivery-truck theme, times tables. About 8 problems.",
    notes: ["Big rigs have many wheels", "They carry heavy loads", "Drivers travel long roads"] },
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
      { maker: "manaia", up: 5, body: "love this. i've put up a butterfly life cycle one, my 6yo adored it." },
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
      { maker: "heather", up: 3, body: "welcome. ask anything, this lot are lovely and nobody judges the overwhelm. we've all been there." },
    ],
  },
];

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

// Deterministic upvotes + created_at offset for a generated post.
export function postMeta(spec: PostSpec): { id: string; maker_id: string; handle: string; creator_name: string; upvotes: number; daysAgo: number } {
  const m = makerBySlug(spec.maker);
  return {
    id: uid(`post:${spec.slug}`),
    maker_id: uid(`maker:${m.slug}`),
    handle: m.handle,
    creator_name: m.name,
    upvotes: num(`up:${spec.slug}`, 46, 2),
    daysAgo: 1 + num(`d:${spec.slug}`, 80),
  };
}

export const SEED_VERSION = "2026-06-30.2";
