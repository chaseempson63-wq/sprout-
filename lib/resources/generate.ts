// Sprout Resources — generation engine (server-side).
//
// Two paths:
//   aiResource()        -> calls Venice AI (OpenAI-compatible) when a key is set.
//   templateResource()  -> deterministic, no-AI fallback so the product works
//                          on day one with zero setup. Produces a real, printable
//                          resource from the child's profile + the parent's inputs.
//
// The API route (app/api/resources/generate/route.ts) tries AI first, falls
// back to template. Setting VENICE_API_KEY turns on real AI generation; nothing
// else has to change.

import { DIFFICULTY_LABEL, RESOURCE_META } from "./catalog";
import type { GeneratedResource, GenerateInput, ResourceSection } from "./types";

// ── helpers ────────────────────────────────────────────────────────────────

function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function primaryInterest(input: GenerateInput): string {
  return input.interests.find((i) => i.trim().length > 0)?.trim() || "their favorite things";
}

function ageLabel(age: number): string {
  return `Age ${age}`;
}

function baseResource(
  input: GenerateInput,
  sections: ResourceSection[],
  intro: string,
  answerKey?: string[],
): GeneratedResource {
  const meta = RESOURCE_META[input.type];
  const topic = input.topic.trim() || meta.sampleTopic;
  return {
    title: `${meta.label}: ${titleCase(topic)}`,
    subtitle: `For ${input.childName || "your child"} · ${ageLabel(input.age)} · ${DIFFICULTY_LABEL[input.difficulty]}`,
    intro,
    sections,
    answerKey,
    meta: {
      type: input.type,
      subject: input.subject.trim() || meta.defaultSubject,
      topic,
      ageLabel: ageLabel(input.age),
      difficulty: input.difficulty,
    },
  };
}

// ── math problem generation ──────────────────────────────────────────────────

function mathSet(input: GenerateInput): { problems: string[]; answers: string[] } {
  const t = `${input.subject} ${input.topic}`.toLowerCase();
  const age = input.age || 8;
  const bump = input.difficulty === "challenge" ? 1.7 : input.difficulty === "easier" ? 0.6 : 1;
  const problems: string[] = [];
  const answers: string[] = [];
  const push = (q: string, a: string) => {
    problems.push(q);
    answers.push(a);
  };

  let op: "mul" | "add" | "sub" | "div" | "frac" | "count" = "add";
  if (/multipl|times|×/.test(t)) op = "mul";
  else if (/divi|÷/.test(t)) op = "div";
  else if (/subtract|minus|take away/.test(t)) op = "sub";
  else if (/fraction/.test(t)) op = "frac";
  else if (/count|skip/.test(t)) op = "count";
  else if (/add|plus|\bsum\b/.test(t)) op = "add";

  const N = 10;
  if (op === "mul") {
    const fmax = age <= 7 ? 5 : age <= 9 ? 10 : 12;
    const fmax2 = Math.max(2, Math.round(fmax * bump));
    for (let i = 0; i < N; i++) {
      const a = rint(1, fmax2);
      const b = rint(1, Math.min(12, fmax));
      push(`${a} × ${b} = ______`, `${a * b}`);
    }
  } else if (op === "div") {
    const fmax = Math.max(2, Math.round((age <= 9 ? 6 : 10) * bump));
    for (let i = 0; i < N; i++) {
      const b = rint(2, fmax);
      const ans = rint(1, fmax);
      push(`${b * ans} ÷ ${b} = ______`, `${ans}`);
    }
  } else if (op === "sub") {
    const max = Math.round((age <= 6 ? 10 : age <= 8 ? 20 : age <= 10 ? 100 : 1000) * bump);
    for (let i = 0; i < N; i++) {
      const a = rint(2, max);
      const b = rint(1, a);
      push(`${a} − ${b} = ______`, `${a - b}`);
    }
  } else if (op === "frac") {
    for (let i = 0; i < N; i++) {
      const den = rint(2, age <= 9 ? 6 : 12);
      const num = rint(1, den - 1);
      push(`Shade ${num} of ${den} equal parts, then write the fraction: ______`, `${num}/${den}`);
    }
  } else if (op === "count") {
    for (let i = 0; i < N; i++) {
      const step = [2, 3, 5, 10][rint(0, 3)];
      const start = rint(0, 9) * step;
      push(
        `Skip count by ${step}: ${start}, ${start + step}, ____, ____, ____`,
        `${start + 2 * step}, ${start + 3 * step}, ${start + 4 * step}`,
      );
    }
  } else {
    const max = Math.round((age <= 6 ? 10 : age <= 8 ? 20 : age <= 10 ? 100 : 1000) * bump);
    for (let i = 0; i < N; i++) {
      const a = rint(1, max);
      const b = rint(1, max);
      push(`${a} + ${b} = ______`, `${a + b}`);
    }
  }
  return { problems, answers };
}

function wordProblems(input: GenerateInput): string[] {
  const thing = primaryInterest(input);
  const name = input.childName || "Your child";
  const a = rint(2, 9);
  const b = rint(2, 9);
  return [
    `${name} is collecting ${thing}. There are ${a} sets with ${b} in each set. How many ${thing} altogether? ______`,
    `${name} had ${a * b} ${thing} and gave ${b} away. How many are left? ______`,
    `Write your own ${thing} word problem and solve it on the back of this page.`,
  ];
}

// ── per-type templates ───────────────────────────────────────────────────────

function templateSections(input: GenerateInput): {
  intro: string;
  sections: ResourceSection[];
  answerKey?: string[];
} {
  const interest = primaryInterest(input);
  const name = input.childName || "your child";
  const topic = input.topic.trim() || RESOURCE_META[input.type].sampleTopic;
  const minutes = Math.max(5, Math.min(25, input.age * 2));

  switch (input.type) {
    case "math": {
      const { problems, answers } = mathSet(input);
      return {
        intro: `A quick warm-up plus ${problems.length} practice problems on ${topic}, with a few ${interest}-themed word problems mixed in.`,
        sections: [
          {
            heading: "Warm up",
            items: [
              "Count out loud from 1 to 20 before you start.",
              "Say one thing you already know about today's topic.",
            ],
          },
          {
            heading: `Practice (${problems.length} problems)`,
            items: problems.map((p, i) => `${i + 1}. ${p}`),
          },
          {
            heading: `Word problems with ${interest}`,
            items: wordProblems(input),
          },
          {
            heading: "Star challenge (optional)",
            items: [`Make up the trickiest ${topic} problem you can about ${interest}, then solve it.`],
            note: "Earn a star for trying, whether or not it's right.",
          },
        ],
        answerKey: answers.map((a, i) => `${i + 1}. ${a}`),
      };
    }

    case "reading":
      return {
        intro: `A reading task on ${topic} that ${name} can do with any book, article, or page about ${interest}.`,
        sections: [
          {
            heading: "Before you read",
            items: [
              `Today's focus: ${topic}.`,
              `Find something to read about ${interest}. A book, a page, a website, anything.`,
              "Talk about what you already know for one minute.",
            ],
          },
          {
            heading: "Read",
            items: [`Read for about ${minutes} minutes. Underline any word you don't know.`],
          },
          {
            heading: "Comprehension questions",
            items: [
              "Who is the main character or subject?",
              "What happened first, next, and last?",
              "Where and when does it take place?",
              "Why did it happen? Use one detail from what you read.",
              "How did it make you feel, and why?",
            ],
          },
          {
            heading: "New words",
            items: [
              "Write 3 new words and what you think they mean.",
              "Use one of them in your own sentence.",
            ],
          },
          {
            heading: "Show what you know",
            items: ["Draw your favorite part and write one sentence about it."],
          },
        ],
      };

    case "writing":
      return {
        intro: `Writing prompts about ${interest} to get ${name} started, with sentence helpers and a checklist.`,
        sections: [
          {
            heading: "Pick a prompt",
            items: [
              `Write a short story where ${interest} saves the day.`,
              `Describe ${interest} to someone who has never seen it. Use all five senses.`,
              `If you could ask ${interest} one question, what would it be, and what might it answer?`,
            ],
          },
          {
            heading: "Sentence starters",
            items: ["It all started when...", "The most surprising thing was...", "In the end..."],
          },
          {
            heading: "Write",
            items: [`Write for about ${minutes} minutes. Don't worry about spelling on the first try.`],
          },
          {
            heading: "Check it",
            items: [
              "Does every sentence start with a capital letter?",
              "Does every sentence end with . ? or !",
              "Read it out loud. Does it make sense?",
            ],
          },
        ],
      };

    case "science":
      return {
        intro: `A hands-on science activity exploring ${topic}, themed around ${interest}.`,
        sections: [
          {
            heading: "You'll need",
            items: ["Things from around the house (paper, water, a container, household items)."],
            note: "No special kit required.",
          },
          {
            heading: "The question",
            items: [`What do we want to find out about ${topic}?`, "Write your guess (a hypothesis) here: ______"],
          },
          {
            heading: "Try it",
            items: [
              "Step 1: Set up your materials.",
              "Step 2: Make the change you want to test.",
              "Step 3: Watch closely and wait.",
            ],
          },
          {
            heading: "What happened?",
            items: ["Draw what you saw.", "Write one sentence describing what changed."],
          },
          {
            heading: "Why?",
            items: [`Talk about why this happened. How does it connect to ${interest}?`],
          },
        ],
      };

    case "unit-study":
      return {
        intro: `A one-week unit study with ${topic} as the theme, touching every subject. Built around ${interest}.`,
        sections: [
          { heading: "Reading", items: [`Find and read something about ${topic}.`, "Note 3 facts you learned."] },
          { heading: "Writing", items: [`Write a short paragraph explaining ${topic} to a friend.`] },
          {
            heading: "Math",
            items: [`Find the numbers hiding in ${topic} (counts, sizes, distances) and make 2 problems from them.`],
          },
          {
            heading: "Science or world",
            items: [`Ask one "why" or "how" question about ${topic} and try to answer it.`],
          },
          { heading: "Make something", items: [`Draw, build, or act out something about ${topic} and ${interest}.`] },
          { heading: "Share", items: ["Tell someone in the family one thing you learned this week."] },
        ],
      };

    case "lesson-plan":
      return {
        intro: `A simple, teach-it-today lesson plan on ${topic} for ${name}.`,
        sections: [
          { heading: "Objective", items: [`By the end, ${name} can explain or do ${topic}.`] },
          { heading: "Materials", items: ["Paper, pencil, and anything handy around the house."] },
          {
            heading: "Warm up (5 min)",
            items: [`Ask what ${name} already knows about ${topic}. Connect it to ${interest}.`],
          },
          { heading: "Teach (10 min)", items: [`Show one clear example of ${topic}. Do it together once.`] },
          { heading: "Practice (10 min)", items: [`${name} tries 3 to 5 on their own. You help only when stuck.`] },
          { heading: "Wrap up (5 min)", items: ["Ask: what was easy, what was tricky? One sentence each."] },
          { heading: "Quick check", items: [`Can ${name} do one example with no help? If yes, you're done.`] },
        ],
      };

    case "project":
      return {
        intro: `A project to sink into over a few days, on ${topic}, powered by ${interest}.`,
        sections: [
          { heading: "Driving question", items: [`What can we make or figure out about ${topic}?`] },
          { heading: "Plan it", items: ["List the steps.", "List what you need.", "Guess how long it'll take."] },
          { heading: "Build it", items: ["Work through your steps. It's fine to change the plan as you go."] },
          { heading: "The result", items: [`Show your finished ${topic} project. Connect it back to ${interest}.`] },
          { heading: "Reflect", items: ["What are you proud of?", "What would you do differently next time?"] },
        ],
      };
  }
}

export function templateResource(input: GenerateInput): GeneratedResource {
  const { intro, sections, answerKey } = templateSections(input);
  return baseResource(input, sections, intro, answerKey);
}

// ── AI path (Venice, OpenAI-compatible) ──────────────────────────────────────

export function buildMessages(input: GenerateInput) {
  const meta = RESOURCE_META[input.type];
  const system =
    "You are an expert homeschool resource designer. Create one ready-to-print educational resource. " +
    "Return ONLY valid minified JSON, no prose, matching exactly: " +
    '{"title":string,"subtitle":string,"intro":string,"sections":[{"heading":string,"items":[string],"note"?:string}],"answerKey"?:[string]}. ' +
    "Keep it age-appropriate, specific, and warm. Weave the child's interests in naturally. " +
    "For anything with questions or problems, include an answerKey aligned by number.";
  const user =
    `Resource type: ${meta.label}. ` +
    `Child: ${input.childName || "a child"}, age ${input.age}, level "${input.level || "not specified"}". ` +
    `Subject: ${input.subject || meta.defaultSubject}. Topic: ${input.topic || meta.sampleTopic}. ` +
    `Interests: ${input.interests.join(", ") || "general"}. Difficulty: ${input.difficulty}. ` +
    "Produce 8 to 14 items where appropriate.";
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function normalize(parsed: Record<string, unknown>, input: GenerateInput): GeneratedResource {
  const fallback = templateResource(input);
  const rawSections = Array.isArray(parsed.sections) ? parsed.sections : [];
  const sections: ResourceSection[] = rawSections
    .map((s): ResourceSection | null => {
      if (!s || typeof s !== "object") return null;
      const obj = s as Record<string, unknown>;
      const heading = typeof obj.heading === "string" ? obj.heading : "";
      const items = Array.isArray(obj.items)
        ? obj.items.filter((i): i is string => typeof i === "string")
        : [];
      if (!heading || items.length === 0) return null;
      return { heading, items, note: typeof obj.note === "string" ? obj.note : undefined };
    })
    .filter((s): s is ResourceSection => s !== null);

  if (sections.length === 0) return fallback;

  const answerKey = Array.isArray(parsed.answerKey)
    ? parsed.answerKey.filter((a): a is string => typeof a === "string")
    : undefined;

  return {
    title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title : fallback.title,
    subtitle:
      typeof parsed.subtitle === "string" && parsed.subtitle.trim() ? parsed.subtitle : fallback.subtitle,
    intro: typeof parsed.intro === "string" && parsed.intro.trim() ? parsed.intro : fallback.intro,
    sections,
    answerKey: answerKey && answerKey.length > 0 ? answerKey : undefined,
    meta: fallback.meta,
  };
}

export async function aiResource(input: GenerateInput, key: string): Promise<GeneratedResource | null> {
  const base = process.env.VENICE_BASE_URL || "https://api.venice.ai/api/v1";
  const model = process.env.VENICE_MODEL || "llama-3.3-70b";
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: buildMessages(input),
        temperature: 0.7,
        max_tokens: 1800,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return null;
    const parsed = extractJson(text);
    if (!parsed) return null;
    return normalize(parsed, input);
  } catch {
    return null;
  }
}
