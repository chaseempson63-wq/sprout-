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
    slug: "free-homeschool-worksheets",
    title: "Free Homeschool Worksheets for the Gaps in Your Day",
    description:
      "What to do with the in-between moments of a homeschool day: no-prep ideas that count as learning, when a worksheet is the right call, and a free worksheet builder with no email wall.",
    keyword: "free homeschool worksheets",
    date: "2026-07-14",
    content: `
Every homeschool day has gaps. One kid finishes the math page at 10:12 and the next thing isn't until 11. The read-aloud ends early because somebody needed a snack, then a bandage, then a completely different snack. The dentist appointment eats the middle of the morning and you come home to two kids who've lost the thread entirely.

Nobody warns you about the gaps. The curriculum catalogs sell you the lessons. The in-between is yours to figure out, usually live, usually while you're still mid-something with the other kid.

This is about what to do with those moments, and about the honest place worksheets have in them.

## The gaps are not a failure

First, the reframe. School is mostly gaps. Lining up, waiting for 25 kids to settle, handing out papers, packing up early because the bell system says so. A classroom fills its gaps with logistics and calls it a day of learning.

At home the gaps are visible, so they feel like holes in your teaching. They're not. They're just the texture of a real day. The goal isn't to eliminate them. It's to have a small set of things you can reach for without prep, so a gap doesn't turn into an hour of negotiating about screens.

## No-prep things that count

A few that work between things, none of which need a printer or a plan:

- **Hand over a real job with numbers in it.** Doubling the muffin recipe so everyone gets two. Working out the change at the store. Measuring the shelf twice before Dad cuts once. Ten minutes of real-life math beats a page of drills the kid didn't need.
- **Follow the morning's question.** Whatever they asked at breakfast, that's the thread. Why the moon follows the car. Whether fish sleep. Pull it up together, read one thing about it, let it run until it runs out.
- **The quiet anchors.** Reading to the little brother. Reading to the cat, who sits still for it. The sketchbook that lives on the table. A kid who defaults to one of these when a gap opens has learned something schools spend years failing to teach.
- **Let one gap just be a gap.** The trampoline counts. Boredom counts. Some of the best afternoons start with twenty unscheduled minutes and end with a fort.

## When a worksheet is actually the right call

Here's the honest version, because homeschool parents can smell busywork a mile off.

A worksheet is the wrong tool for introducing anything. It's the right tool for exactly three moments:

- **Practice.** The kid who just got fractions needs fifteen quiet minutes of actually doing fractions. Repetition is how it sticks, and a page is the calmest way to get it.
- **Independence while you're with the other kid.** This is the multi-kid reality. You cannot be in two rooms at once. A sheet pitched at the right level is twenty minutes where one kid works alone and doesn't need you, which is twenty minutes the other kid gets you fully.
- **The wobble days.** Somebody's sick, the plumber is here, the morning fell apart. A familiar page keeps the thread of the day without asking anything of you. That's not lazy. That's triage, and every homeschool family runs it.

The trap is when the worksheet becomes the curriculum. It shouldn't be the meal. It's the thing that holds the day together between meals.

## The problem with "free printables"

Search for free homeschool worksheets and you'll find thousands. Then the routine starts: the "free" download that wants your email first, the newsletter you didn't ask for, the pack that's the wrong level so you're back to searching, the five open tabs, the $6 you pay on a teachers marketplace anyway because it's 9pm and you just need a fractions page for tomorrow.

The sheets aren't the expensive part. The finding is.

## A free builder instead

So we built one and made it free. The [Sprout resource builder](/resources) has 30 worksheet templates across math, reading, spelling, and handwriting. You pick the topic, set your kid's age, and print. The difficulty tunes itself to the age you set, so a multiplication page for your 7-year-old and one for your 12-year-old come out looking like they belong to different kids, because they do.

No account. No email wall. No newsletter. You need a sharks reading page because that's the current obsession, you make a sharks reading page, you print it, you're done before the kettle boils.

Keep a small stack of them in a drawer for the wobble days. Make one the night before when you know tomorrow has a dentist-shaped hole in it. That's the whole system.

## The gaps are where the good stuff hides

One last thing. Some of what your kids will remember about homeschooling won't be the lessons. It'll be the in-between: the question that took over a morning, the recipe math, the fort. The gaps aren't the weak part of your day. Handled loosely, with a couple of calm tools in the drawer, they're the part school could never give them.

[Sprout](/) exists for families who teach through life, not textbooks, and the resource builder is our way of handing the community something genuinely useful for free. We don't sell your data, we don't train AI on your kids, and the worksheets are yours to print forever. Make your first one at [hisprout.app/resources](/resources) and keep the drawer stocked.
`,
  },
  {
    slug: "how-to-start-homeschooling",
    title: "How to Start Homeschooling When You Have No Idea Where to Begin",
    description:
      "A calm, honest guide to starting homeschooling: the one legal step, why not to buy curriculum first, what deschooling is, and how to find your rhythm.",
    keyword: "how to start homeschooling",
    date: "2026-07-11",
    content: `
You've either just decided, or you're standing at the edge of deciding, and your stomach is somewhere around your knees. What if you get it wrong. What if you miss something that matters. What if the kid who was fine, mostly, ends up behind because of a choice you made at a kitchen table one night.

Breathe. Every homeschool parent you admire started exactly here, knowing nothing, sure they were unqualified. The difference between them and you is about six months, not some quality you're missing. This is the honest guide to those first months: the one legal thing you actually have to do, the thing everyone does too early, and how to start in a way that doesn't require you to become a teacher overnight.

## First, the part the checklists skip

Search "how to start homeschooling" and you'll get a dozen listicles that open with "Step 1: choose your curriculum." That's the wrong first step, and it's why so many new homeschoolers burn out by October. They buy a boxed program built for a classroom of thirty, try to run it at their kitchen table for one tired kid, and conclude they're failing at week three.

You are not starting a school. You're taking one specific child, who you know better than any teacher ever will, out of a system and into your home. That is a smaller and more human thing than "run a school," and the guides that treat it like launching an institution are the reason you feel overwhelmed before you've begun.

For a lot of you, this started because school stopped working. As one mom put it, describing the term before she pulled her son out:

> "Term 2 of year 3, we'd had a full term of sitting in the car at the school gate each morning, never going in."
— Louise, School Can't Australia

If that's your story, know this: you are not choosing homeschool over a working option. The working option already failed. You're choosing your kid over a building. That reframe matters, because it takes the pressure off "being as good as school." You've already cleared that bar.

## Step one: the legal part, and it's smaller than the fear

Do this first, because it's the only step with actual rules, and getting it done quiets the loudest worry. The good news: in most places, the legal requirement to homeschool is far less than you imagine.

The specifics depend entirely on where you live. In some US states you file a one-page notice of intent and you're done. Others ask for a portfolio or an annual evaluation. A few ask for standardized testing. In New Zealand you apply to the Ministry of Education for an exemption. In Australia you register with your state. None of it requires a teaching degree, and almost none of it requires you to prove anything before you begin.

If your child is currently enrolled in a school, there's usually one concrete action: a formal letter of withdrawal, so the school stops marking your kid absent and reporting it. Look up your specific state or country's requirement, do the paperwork, keep a copy. That's the whole legal mountain, and from up close it's a hill. (When you're ready for what to actually keep on file after this, we wrote [the honest guide to homeschool record keeping](/blog/homeschool-record-keeping).)

## Step two: don't start school yet

This is the step no checklist tells you about, and it's the one that saves families. It's called deschooling.

When a kid comes out of a classroom, they carry the classroom with them for a while. They wait to be told what to do. They ask if something will be graded before they'll try it. They think learning is the thing that happens when an adult stands at the front, and that the rest of the day is just waiting. Deschooling is the deliberate pause where that wiring loosens.

The rough rule of thumb passed around homeschool circles is one month of deschooling for every year your child was in school, though most families find a few weeks to a couple of months does it. During that time you do not do "school." You go to the library and let them pick anything. You bake and let the measuring cups teach fractions without saying the word fractions. You follow the questions they ask in the car. You watch what they reach for when nobody is assigning anything, because that is the single most useful piece of information you will get about how your kid actually learns.

Parents deschool too. You've spent your whole life believing education looks like a worksheet and a bell. Letting go of that takes a minute. Give yourself the same grace you're giving the kid.

## Step three: start with your child, not a curriculum

Here's the reframe that makes all of this easier. You are not trying to recreate a school day. You're trying to raise a human who stays curious. Those are different jobs, and the second one is the one you actually signed up for.

So before you buy anything, watch. The kid who takes the vacuum apart on the kitchen floor to see how it works is telling you something. The one who reads the same three books until the spines give out is telling you something. The one who won't stop asking why the moon follows the car is telling you the most important thing of all, that their mind still works the way it's supposed to, reaching for the world. Your job at the start is not to fill them. It's to notice them, and to build the days around what you notice.

This is also where the quiet fear lives, the "am I doing enough" question that will visit you at 11pm more than once. We wrote a [whole piece on that one](/blog/am-i-doing-enough-homeschooling), because it deserves a real answer and not a pep talk. The short version: if your kid is asking questions and someone is engaging with them, the education is already happening.

## Step four: a rhythm beats a schedule

New homeschoolers love a color-coded timetable. It feels like control. It survives about a week.

A rhythm survives, because it bends. A rhythm is "we read together after breakfast, we do something with numbers before lunch, the afternoon is for making and moving and going places." Inside that, the specifics can collapse and rebuild around a sick day, a good day, a day the whole thing falls apart and everyone eats cereal on the couch. A homeschool day that genuinely covers the ground a classroom covers usually takes two or three focused hours, not six, because you're not managing a crowd or waiting in any lines. The empty hours are not wasted. They're where the actual childhood happens.

## Step five: curriculum comes later, and lighter than you think

Now, finally, the thing the other guides put first. Once you've deschooled and watched your kid for a few weeks, you'll know far more about what to buy, and you'll waste far less money.

Most families anchor on two things at the start: something for reading and writing, and something for math, because those two build in sequence and benefit from a spine. Everything else, science, history, art, the world, can be led by curiosity and library books and real life for a good long while. You do not need a boxed set for every subject. You do not need to spend hundreds of dollars before you know your kid as a learner. Start with less than you think, add only what you reach for and miss.

If you want ready-made worksheets and activities without paying for a full curriculum you might not stick with, [Sprout's worksheet library is free](/resources): pick a topic, set your kid's age, print it. It's a low-stakes way to put something real on the table on the days you want structure, without committing to a program before you're ready.

## Do I need to be a teacher?

No. This is the fear that keeps the most people from starting, and it's built on a misunderstanding of what teaching a class and raising a learner have in common, which is less than you'd think. A classroom teacher's hardest skill is managing thirty children at once. You have one, or a few, and you love them. What you actually need is to stay one step ahead, be willing to look things up alongside them, and know when to hand a subject to a book, a video, a tutor, or a co-op. Homeschooling is less "teach everything" and more "make sure learning keeps happening, by whatever means."

## What about socialization?

The question everyone at the supermarket will ask you, usually with a frown. The honest answer is that homeschooled kids socialize through co-ops, sports, clubs, playgrounds, siblings, neighbors, and the actual adult world, often across more ages than a classroom of same-age peers ever offers. Socialization was never the strong argument for school. Find your local homeschool groups, say yes to the park days, and this worry quietly disappears within a term.

## Can homeschooled kids get into college?

Yes, and admissions offices have gotten good at reading homeschool applications. Homeschooled students go to community colleges, state universities, and the most selective schools in the country every year. What they hand in instead of a standard transcript is a record of what they actually did: the books, the projects, the courses, the real work. Which is one more reason to keep that record from the start rather than reconstruct four years of it the summer before applications are due. The fear is real, but it's a solved problem, and it's years away besides.

## You will want to quit in month two

Nearly everyone does, so let's name it now. There's a stretch, usually a few weeks to a couple of months in, where the newness wears off, the kid pushes back, the house is a wreck, and you're certain you've ruined everything. This is not a sign you're failing. It is the most predictable phase of the entire thing, and it passes. The families who are still going years later are not the ones who never hit that wall. They're the ones who lowered the bar for a week, went outside more, and let the wall pass instead of quitting into it. Protect your own energy like it's part of the curriculum, because it is.

## The one habit that saves you later

Here's the thing nobody tells the beginner, and it costs you nothing to start on day one: keep a light record of what your kid actually does.

Not a lesson plan. Not a gradebook. Just a photo of the thing they built, a voice memo while you fold the laundry about the question that took two coffees to answer, one line at 9pm about the chapter that finally clicked. Do it from the very first week, and two things happen. When the 11pm doubt comes, you have something real to scroll instead of an anxious blank. And when a portfolio or an evaluation eventually asks what you've been doing, you're not scrambling, because the record built itself out of the life you were already living. (If you want to see what a finished one looks like, here are [real homeschool portfolio examples](/blog/homeschool-portfolio-examples).)

That capture habit is the entire reason we're building [Sprout](/): the photos and voice memos you already take, compiled into one timeline per kid, so the invisible week becomes visible and "did we do enough" becomes a question you can answer by looking. Nothing gets sold, nothing trains an AI, your family's week stays yours.

## Start smaller than you think

You do not need to have it figured out. You need to do the one legal step, give everyone room to breathe, watch your kid, and begin. The families who are years in and thriving are not smarter than you. They just started, badly and unsure, and adjusted as they went. That's the whole method.

Sprout stands for the parents raising humans, not students, and for the ones lying awake at the start wondering if they can do this. You can. [Make a free worksheet](/resources) for tomorrow, keep a record of how it goes, and take the first small step tonight.
`,
  },
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
