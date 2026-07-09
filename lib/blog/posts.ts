/* The Sprout blog library. Each post is plain markdown (subset: ## headings,
   > blockquotes with a trailing "— attribution" line, - bullets, **bold**,
   *italic*, [links](url)) rendered by app/blog/_components/ArticleBody.tsx.

   Voice rules (locked): no em dashes, no exclamation marks, US English,
   verbatim quotes stay verbatim (typos and all), every post closes with the
   stand. New posts come from the ContentHQ pipeline: draft lands in
   sprout-content-hq/data/articles/, gets ported here, ships to /blog/[slug]. */

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** The Google keyword this post targets (internal, for the keyword map). */
  keyword: string;
  date: string; // YYYY-MM-DD
  content: string;
};

export const posts: BlogPost[] = [
  {
    slug: "homeschool-record-keeping",
    title: "Homeschool Record Keeping That Doesn't Take Over Your Life",
    description:
      "A homeschool record keeping method that takes ten seconds a day: what to actually keep, what to skip, and what evaluators really look at.",
    keyword: "homeschool record keeping",
    date: "2026-07-09",
    content: `
Ask ten homeschool moms how they keep records and you'll get ten different answers, and at least eight of them will end with "but I'm behind on it."

That's not a discipline problem. It's a design problem. Most record keeping systems were built for the evaluator, not for you, so they feel like homework you assigned yourself. This article is about flipping that: a record that's useful to you first, and happens to satisfy anyone official who ever asks second.

## Why record keeping feels like box-checking

A homeschool parent in New Zealand, ten years in, put it better than any consultant ever has:

> "10yrs in, I literally see absolutely no benefit besides box-checking should the govt require it. Do you ever actually refer back to them? If you do, is it purposefully? Like, do you find it *useful*? Does it actually guide what you do next? Or is it strictly about insurance lest you face ERO or the like?"
— A real homeschool parent, New Zealand homeschool group

That's the real question. If your records exist only as insurance, of course you avoid them. Nobody enjoys filing insurance paperwork. The fix is not more discipline. The fix is a record that gives something back: the ability to actually see what your kid did this month, to answer "what did you guys do this week" without your mind going blank, and to end the week feeling like it counted. The compliance folder becomes a side effect.

## What you actually need to keep

Strip away the panic and there are only three audiences for your records:

- **You.** So the week doesn't disappear. So you can see that the kid who "did nothing" actually rebuilt a bike chain, read four chapters, and asked a question about why ice floats that took two cups of coffee to answer.
- **An evaluator or state official**, if your state requires one. They want evidence of regular learning across subjects. Samples, dates, a sense of progression. Not a teacher's gradebook.
- **Future you**, when it's transcript time for a high schooler, or when a kid moves back into a classroom and the school asks what they've covered.

Notice what's not on the list: a daily lesson log with times and objectives. Unless your specific state requires hours (a few do), minute-by-minute logging is effort spent on a reader who doesn't exist.

## The three systems, honestly compared

**The binder.** Print photos, file worksheets, add a note per week. Works, and evaluators like physical portfolios. The failure mode: it depends on a weekly filing session that survives about six weeks of real life.

**The camera roll plus notes app.** This is what most moms actually run. You already take the photos. The problem is nothing connects: the photo of the science experiment lives nowhere near the voice memo about the reading breakthrough, and in March you cannot reconstruct September. A camera roll is storage. It isn't a record.

**A dedicated system.** Anything that puts captures in one place, organized by kid and by date, wins by default, because the record assembles itself from things you were already doing. The bar is simple: if it takes more than ten seconds to capture a moment, you'll stop using it by week three.

## The ten-second habit that replaces all of it

Here's the whole method. When something happens that felt like learning, capture it once, in the moment: a photo, a voice memo while you fold the laundry, or one sentence typed at 9pm. Tag which kid. Done.

That's the entire input. No sit-down documentation session, no Sunday scramble, no catching up from the year before. A week of ten-second captures adds up to more evidence than a binder you're three months behind on, because the bits you captured add up to more than you remember.

## What evaluators actually look at

Parents who've been through reviews report the same pattern: the reviewer spends minutes, not hours. They want to see regular activity, a spread across subjects, and a parent who can talk about their kid's learning. A dated stream of real moments, photos of the built things, the read books, the math worked out in flour on the counter, answers all three. It reads as a real education because it is one.

If you want to see what a finished collection looks like, we walked through three real formats in [what a homeschool portfolio actually looks like](/blog/homeschool-portfolio-examples).

## Where Sprout fits

We're building [Sprout](/) for exactly this: the photos and voice memos you already take, compiled into one timeline per kid that you can scroll by week, month, or year. The record writes itself from the life you already live, and both you and your kid can see the week add up. No lesson plans, no daily goals, nothing to keep up with. Proof of learning, not proof of schooling.

Sprout stands for the parents who teach through life, not textbooks, and we don't sell your family's week to anyone. If that's your kind of record keeping, join the waitlist and stand with the families holding the line.
`,
  },
  {
    slug: "am-i-doing-enough-homeschooling",
    title: "Am I Doing Enough Homeschooling? Read This Before You Answer",
    description:
      "Every homeschool parent asks it eventually. Where the feeling comes from, what enough actually means, and the proof that dissolves the 11pm audit.",
    keyword: "am I doing enough homeschooling",
    date: "2026-07-09",
    content: `
It's late. The kids are asleep. And you're running the tally again: we didn't finish the math page, the science kit is still in its box, and the most educational thing that happened today might have been an argument about whether ants have feelings.

So you type the question into Google, the one every homeschool parent types eventually. Am I doing enough?

Here's the honest answer up front: the fact that you're asking is the strongest evidence available that you are. The parents who genuinely aren't doing enough are not awake at 11pm auditing themselves. But let's do better than reassurance, because you've heard reassurance before and it bounces off. Let's look at why the feeling exists and what actually fixes it.

## Where the feeling comes from

A homeschool mom named Charlene Hess wrote [the sentence](https://hessunacademy.com/am-i-doing-enough-for-my-kids-homeschool-mom/) that thousands of parents recognize on sight:

> "I envision all the other parents judging me and thinking I'm a horrible teacher who is failing my kids."
— Charlene Hess, Hess UnAcademy

Notice what that sentence is about. It isn't about her kids' reading levels. It's about being seen, judged, and found wanting. The "am I doing enough" question is almost never a curriculum question. It's an identity question, because when you homeschool, "good parent" and "good teacher" collapse into one job, and every wobbly day feels like evidence against you in both.

There's a second mechanic underneath it. School comes with built-in proof: report cards, worksheets in the backpack, a teacher saying "she had a great week." You fired the school, so you fired the proof department too. The learning still happens. The evidence just evaporates by dinnertime.

## Why your brain says the week was nothing

Try this tonight: write down everything from yesterday that involved your kid learning something. Not school things. Anything.

Most parents who do this stall at first, then the list runs off the page. The recipe that got doubled and the fractions that came with it. The forty minutes watching a bird at the feeder. The chapter read aloud in the car. The question about why the sky goes pink, and then why pink, and then why that wavelength. The lawn mowed badly for the first time, which is its own curriculum.

None of it felt like school. All of it was. Your brain files these moments under "just life" because they didn't come with a worksheet, so when you ask yourself what you did this week, memory returns nothing, and the anxiety fills the gap. The problem was never the doing. It's that the doing is invisible.

## What "enough" actually means

Researchers who study home education keep landing on the same finding: the inputs that matter are conversation, reading, curiosity followed to its end, and a parent who's paying attention. Hours-at-desk is a school metric, ported into a home where it doesn't apply. A focused homeschool day of two or three hours routinely covers what a classroom stretches across six, because nobody's waiting in line or getting the class settled.

So "enough" is not six hours. Enough is: your kid asked questions this week and somebody engaged with them. They read, or were read to. They built, cooked, counted, argued, noticed. If that describes your week, the education is happening. What's missing is the record of it, not the substance.

## The fix is proof, not more pressure

Here's what actually dissolves the 11pm audit: evidence you can see. The parents who feel steady aren't doing more than you. They just have somewhere the week adds up, so on the hard days they can scroll back and watch the proof stack up instead of interrogating their memory in the dark.

That can be a note on the fridge. It can be one photo a day. The tool matters less than the loop: capture the moment when it happens, see it again when you doubt. If you want a simple structure for the capturing side, start with [record keeping that doesn't take over your life](/blog/homeschool-record-keeping).

That loop is the entire reason we're building [Sprout](/). The photos and voice memos you already take, compiled into a timeline per kid, so the invisible week becomes visible and "did we do enough" becomes a question you can answer by looking. Your kid sees what they built. You see that it counted. Nothing gets sold, nothing trains an AI, your week stays yours.

Sprout stands for the parents raising humans, not students, and for the ones lying awake asking if they're enough. You are. Join the waitlist and be part of the movement making the proof visible.
`,
  },
  {
    slug: "homeschool-portfolio-examples",
    title:
      "Homeschool Portfolio Examples: What a Real One Looks Like (Not the Pinterest Version)",
    description:
      "What a real homeschool portfolio looks like: three formats that work, what reviewers actually check, and how to build one from photos you already take.",
    keyword: "homeschool portfolio examples",
    date: "2026-07-09",
    content: `
Search "homeschool portfolio examples" and you'll find color-coded binders with laminated dividers and hand-lettered subject tabs. Beautiful. Also mostly fiction. The portfolios that actually get families through evaluations look messier, take a fraction of the time, and do the job just as well.

Here's what a real portfolio contains, three formats that work, and what reviewers actually spend their two minutes looking at.

## What a portfolio is (and isn't)

A homeschool portfolio is a curated sample of your kid's learning over a period, usually a school year. The key word is sample. It is not every worksheet, not a daily log, and not a scrapbook of your best moments arranged for judgment.

Depending on your state, it might be legally required and reviewed (Florida requires a portfolio with a log and samples, Pennsylvania requires one reviewed by an evaluator, New York requires quarterly reports that a portfolio feeds), or it might be purely for you. Either way the structure is the same, which is convenient: build it for yourself and compliance comes free.

## Example 1: the shoebox-to-binder portfolio

The classic. One physical container per kid. Through the year, drop in: a few work samples per subject per quarter, ticket stubs and brochures from field trips, photos of built and made things, a reading list.

At year end, transfer the keepers into a binder with loose sections: reading, writing, math, science and nature, art and making, life skills. Done in an afternoon.

- **Good:** evaluators like paper, kids love flipping through their own year.
- **Risk:** depends on you remembering to feed the box. An empty June box means an August scramble.

## Example 2: the photo-first digital portfolio

The version built on what you already do, which is take photos. The dirt-bike engine in pieces on the tarp is your mechanics sample. The bread that didn't rise is chemistry, and the second loaf is the retest. The map traced with a finger before the road trip is geography. One mom described her whole system as a phone camera plus one sentence of caption, and her evaluation took eight minutes.

Add a voice memo layer for the things photos can't hold: the kid explaining what they figured out, the big question from the back seat. Date-stamped captures, organized per kid, are a portfolio that assembles itself.

- **Good:** near-zero extra effort, captures the learning that never touches paper.
- **Risk:** if it all lives loose in a camera roll, you have storage, not a portfolio. It needs one place where it compiles.

## Example 3: the quarterly sampler

For parents who hate ongoing systems. Four times a year, spend one evening gathering: three to five work samples per subject, ten photos, the reading list, and one honest paragraph about the quarter, including the messy parts. The meltdown over a sentence that wouldn't come, and the week off that followed, is a truthful record of how real education moves.

- **Good:** contained, predictable, four evenings a year.
- **Risk:** reconstructing a quarter from memory means the quiet wins get lost.

## What reviewers actually look at

Parents who've sat through evaluations report the same three checks: Is there regular activity across the year, not a September binge? Is there a spread across subjects, interpreted generously? Can the parent talk about where the kid is and where they're heading? That's the whole exam. A dated stream of real moments passes all three without trying. (The capture habit that feeds it is covered in [record keeping that doesn't take over your life](/blog/homeschool-record-keeping).)

One New Zealand mom, two years in, explained why she documents everything:

> "School was very traumatic for my son, and so for our entire family, we can't afford to risk ever loosing our homeschooling exemption."
— A real homeschool mom, New Zealand homeschool group

That fear is real and worth honoring. But notice the shape of her solution: document everything, all the time, so the review is never a scramble. The portfolio that protects you is the one that already exists.

## The version we're building

[Sprout](/) turns the photo-first portfolio into the default. Photos, voice memos, one-line notes, all compiled into a per-kid timeline you can scroll by week, month, or year, so portfolio season becomes "open the app" instead of a night of panic-assembly. Your kid can scroll their own year too, like seeing their own step count. And none of it trains an AI or gets sold, because your family's record belongs to your family.

Sprout stands for the parents who teach through life and still have to prove it to a system that only counts what it can see. We're making it visible on your terms. Join the waitlist, and keep your year yours.
`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Newest first for the index; same-day posts keep their authored order. */
export function sortedPosts(): BlogPost[] {
  return [...posts].sort((a, b) =>
    a.date === b.date ? 0 : a.date < b.date ? 1 : -1,
  );
}

export function readingMinutes(post: BlogPost): number {
  const words = post.content.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
