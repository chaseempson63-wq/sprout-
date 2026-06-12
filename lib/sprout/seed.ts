import type { Entry, Kid, SproutData, SubjectId } from "./types";

/* Demo family. Seeded on first open so the dashboard and timeline feel
   alive before a single real moment is logged. Notes are written the way
   a mom actually types them at 3pm: quick, lowercase, specific.

   Entries are placed relative to "now" so the demo always lands in the
   current week: a few scripted days this week (with one empty weekday,
   because real weeks have those), a full last week, and a lighter week
   before that to give the streak something to stand on. */

const KIDS: Kid[] = [
  { id: "maya", name: "Maya", age: 7, color: "#c2693d" },
  { id: "eli", name: "Eli", age: 10, color: "#38708a" },
];

interface Script {
  kidIds: string[];
  note: string;
  subjectId: SubjectId;
  /** Clock time on the scripted day. */
  at: [hour: number, minute: number];
  photoUrl?: string;
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const PHOTOS = {
  books: unsplash("photo-1481627834876-b7833e8f5570"),
  lego: unsplash("photo-1587654780291-39c9404d746b"),
  paint: unsplash("photo-1503454537195-1dcabb73ffb9"),
  baking: unsplash("photo-1556910103-1c02745aae4d"),
  forest: unsplash("photo-1441974231531-c6227db76b6e"),
  night: unsplash("photo-1462331940025-496dfbfc7564"),
  garden: unsplash("photo-1416879595882-3373a0480b5b"),
  beach: unsplash("photo-1507525428034-b723cf961d3e"),
};

/* This week: assigned to past weekdays in order, today handled separately. */
const THIS_WEEK_DAYS: Script[][] = [
  [
    {
      kidIds: ["eli"],
      note: "finished the hobbit. immediately asked if there is a sequel. oh buddy.",
      subjectId: "reading",
      at: [9, 20],
    },
    {
      kidIds: ["maya"],
      note: "skip counting by 7s in the car. got to 84 with zero help.",
      subjectId: "numbers",
      at: [11, 40],
    },
    {
      kidIds: ["eli"],
      note: "found saturn with the binoculars before bed. it was a tiny dot. he was thrilled anyway.",
      subjectId: "wondering",
      at: [21, 5],
      photoUrl: PHOTOS.night,
    },
  ],
  [
    {
      kidIds: ["maya"],
      note: "found a cicada shell on the morning walk. drew it when we got home and labeled every part.",
      subjectId: "nature",
      at: [9, 40],
      photoUrl: PHOTOS.forest,
    },
    {
      kidIds: ["eli"],
      note: "farmers market math. counted out $4.35 in change by himself, then triple checked it.",
      subjectId: "numbers",
      at: [11, 15],
    },
    {
      kidIds: ["maya"],
      note: "swim lesson. floated on her back the whole length without holding my hand.",
      subjectId: "movement",
      at: [16, 30],
    },
  ],
  [
    {
      kidIds: ["eli"],
      note: "lego bridge engineering. held 12 books before it gave up. he wants to try a truss design next.",
      subjectId: "making",
      at: [10, 5],
      photoUrl: PHOTOS.lego,
    },
    {
      kidIds: ["maya"],
      note: "painted the view from the back steps. mixed her own green and named it swamp juice.",
      subjectId: "art",
      at: [14, 20],
      photoUrl: PHOTOS.paint,
    },
    {
      kidIds: ["maya", "eli"],
      note: "banana bread afternoon. halving the recipe turned into a real fractions conversation.",
      subjectId: "life",
      at: [15, 45],
      photoUrl: PHOTOS.baking,
    },
  ],
];

/* Today: two moments, timed just behind "now" so they read as fresh. */
const TODAY: Omit<Script, "at">[] = [
  {
    kidIds: ["maya"],
    note: "library run before swim. came home with a stack taller than her chin.",
    subjectId: "reading",
    photoUrl: PHOTOS.books,
  },
  {
    kidIds: ["eli"],
    note: "asked how mirrors actually work at breakfast. twenty minutes down that rabbit hole, no regrets.",
    subjectId: "wondering",
  },
];

/* Last week: five documented days. dayOffset is days after that Monday. */
const LAST_WEEK: (Script & { dayOffset: number })[] = [
  {
    dayOffset: 0,
    kidIds: ["maya", "eli"],
    note: "planted the lettuce bed. measured the spacing with a ruler, her idea not mine.",
    subjectId: "nature",
    at: [10, 0],
    photoUrl: PHOTOS.garden,
  },
  {
    dayOffset: 1,
    kidIds: ["eli"],
    note: "took apart the broken keyboard to see what was inside. screws sorted into an egg carton.",
    subjectId: "making",
    at: [13, 30],
  },
  {
    dayOffset: 2,
    kidIds: ["maya"],
    note: "audiobook of james and the giant peach while she drew every character she heard.",
    subjectId: "reading",
    at: [11, 0],
  },
  {
    dayOffset: 2,
    kidIds: ["eli"],
    note: "bike loop around the park twice. timed his laps and wanted to beat them.",
    subjectId: "movement",
    at: [15, 0],
  },
  {
    dayOffset: 3,
    kidIds: ["eli"],
    note: "made lunch start to finish. grilled cheese, only one casualty.",
    subjectId: "life",
    at: [12, 15],
  },
  {
    dayOffset: 3,
    kidIds: ["maya"],
    note: "ukulele practice. three chords now, one of them on purpose.",
    subjectId: "art",
    at: [14, 0],
  },
  {
    dayOffset: 4,
    kidIds: ["maya"],
    note: "tide pools. crabs, anemones, and one very cold kid who refused to leave.",
    subjectId: "nature",
    at: [10, 30],
    photoUrl: PHOTOS.beach,
  },
  {
    dayOffset: 4,
    kidIds: ["maya", "eli"],
    note: "built a couch fort and read in it all afternoon. counting it.",
    subjectId: "reading",
    at: [13, 20],
  },
];

/* Two weeks back: four documented days, text only. Keeps the streak honest. */
const WEEK_BEFORE: (Script & { dayOffset: number })[] = [
  {
    dayOffset: 0,
    kidIds: ["eli"],
    note: "long division finally clicked. the trick was money examples.",
    subjectId: "numbers",
    at: [10, 30],
  },
  {
    dayOffset: 1,
    kidIds: ["maya"],
    note: "sorted all the laundry by owner without being asked twice. sock matching is pattern work.",
    subjectId: "life",
    at: [9, 45],
  },
  {
    dayOffset: 3,
    kidIds: ["maya", "eli"],
    note: "creek walk. collected 14 rocks, identified 3, carried home all 14.",
    subjectId: "nature",
    at: [11, 0],
  },
  {
    dayOffset: 4,
    kidIds: ["maya"],
    note: "read to her brother for twenty minutes so i could make dinner. win win.",
    subjectId: "reading",
    at: [17, 0],
  },
];

function startOfDay(t: number): Date {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Monday 00:00 of the week containing t. */
export function startOfWeek(t: number): number {
  const d = startOfDay(t);
  const shift = (d.getDay() + 6) % 7; // Mon=0 .. Sun=6
  d.setDate(d.getDate() - shift);
  return d.getTime();
}

const DAY = 24 * 60 * 60 * 1000;

function at(dayStart: number, [h, m]: [number, number]): number {
  const d = new Date(dayStart);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

export function buildSeed(now: number): SproutData {
  const entries: Entry[] = [];
  let n = 0;
  const push = (s: Omit<Script, "at">, createdAt: number) => {
    entries.push({
      id: `demo-${++n}`,
      kidIds: s.kidIds,
      note: s.note,
      photoUrl: s.photoUrl ?? null,
      subjectId: s.subjectId,
      createdAt,
    });
  };

  const monday = startOfWeek(now);
  const dow = Math.floor((startOfDay(now).getTime() - monday) / DAY);

  // Past weekdays this week, skipping one so the week reads real.
  // Slots are Mon, Tue, Thu when the week is far enough along.
  const slots = [0, 1, 3].filter((d) => d < dow);
  slots.forEach((dayIdx, i) => {
    const script = THIS_WEEK_DAYS[i % THIS_WEEK_DAYS.length];
    for (const s of script) push(s, at(monday + dayIdx * DAY, s.at));
  });

  // Today, timed just behind now.
  push(TODAY[0], now - 150 * 60 * 1000);
  push(TODAY[1], now - 40 * 60 * 1000);

  for (const s of LAST_WEEK) push(s, at(monday - 7 * DAY + s.dayOffset * DAY, s.at));
  for (const s of WEEK_BEFORE) push(s, at(monday - 14 * DAY + s.dayOffset * DAY, s.at));

  entries.sort((a, b) => b.createdAt - a.createdAt);

  return { version: 1, demo: true, kids: KIDS, entries };
}
