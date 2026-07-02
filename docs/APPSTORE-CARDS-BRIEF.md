# Sprout — App Store screenshot cards, master brief (redo)

The first set was close in places but not selling. This is a from-scratch redo.
Read all of it before you touch a card.

## The job

App Store screenshots are the ad, not documentation. A parent thumb-scrolling
the store decides in ~3 seconds. So the set has to sell the PAYOFF first, then
prove it with real app UI and real use cases. Study the reference gallery at
https://before.click and the top habit / kid / family trackers on the store
(the winning pattern is always: card 1 = the payoff, card 2 = app UI + social
proof, card 3+ = concrete use cases, each showing the real app doing a real
thing). Copy that structure, not the visuals.

## Hard rules (the first set broke these)

1. **Each card is a bespoke composition.** Do NOT stamp one template across all
   cards. Different layout, different focal point per card.
2. **Use the REAL app UI**, rendered in a clean device frame, captured from the
   actual Swift screens. Native-looking, current build.
3. **No cartoon-as-photo.** The capture screen must show a REAL photo of real
   kid work (a painting, a lego build, a worksheet on the table). The cartoon
   penguin / mascot-style illustrations are NOT what a parent's camera produces.
   Cartoon worksheet illustrations are fine ONLY on the resource-library card,
   because those literally are the product.
4. **Headlines: Title Case, and make the key word POP** (bigger / lime accent /
   heavier weight). The payoff word is the hero of the card. No sentence-case
   flatness. No periods needed. No em dashes. No exclamation marks. US English.
5. **Every card needs a reason-to-care**, not just a UI dump. Lead with the
   benefit; the UI is the proof underneath.
6. Voice is Sprout: plain, warm, confident, movement-not-corporate. Never
   "transform / empower / unlock your journey" marketing mush.
7. You can ship up to 10 screenshots per device size on the App Store. Aim for
   6-7 strong ones. Do not cap at 5.
8. Sizes: 1290x2796 (6.7") minimum; also export 6.9" if the pipeline allows.
   Reuse the headless-Chrome HTML->PNG pipeline in ~/Desktop/sprout-appstore
   (read its PHILOSOPHY.md first), or build native, your call — but each card
   bespoke.

## Copy anchors you can pull from (Sprout's real lines)

- The payoff: "Save 3+ hours a week." / "Ten seconds a moment." / "Stop
  wondering if the week counted."
- The one-place line: "Everything your kid learned, all in one place."
- The permanence line: "Your child's permanent learning record."
- The wound: "Am I doing enough?" answered with proof, not vibes.
- The offer: a $197 resource builder, free.

## The cards, one by one

### Card 1 — THE PAYOFF (full redo)
The first set opened on a raw dashboard with no reason-to-care. Card 1 must be
the logical return on investment. What does the parent GET?
- Hero headline, key word popping. e.g. "Get Back **3+ Hours** a Week" or
  "Stop Wondering If the Week **Counted**".
- A visual proof of the payoff: a big stat / before-after / a calm "week, done"
  moment. Not a data dump. The feeling is relief.
- One sub-line of plain benefit. This card sells the outcome, full stop.

### Card 2 — APP UI + SOCIAL PROOF
Show the real capture flow in a device frame, with a review / star rating.
- Headline reworked from "Ten seconds, and it's kept" — keep the speed promise,
  make it Title Case with the number popping, e.g. "Kept in **10 Seconds**".
- Device shows the REAL capture screen with a REAL photo of kid work (not the
  cartoon penguin). Snap, one sentence, saved.
- Add a short real-sounding parent review + stars to build trust here.

### Card 3 — EVERYTHING IN ONE PLACE (needs the most work)
The first set just popped "6 things / 14 moments" with zero context. Redo it as
the one-place / permanent-record use case.
- Headline: "Everything They Learned, **One Place**" or "Your Child's
  **Permanent** Record".
- Show a real app view that proves it: the calendar / week view, or per-kid
  rows (each kid, what they did on each day). Visually show the app organizing a
  real week. "Plan your week in seconds, see it all in one place."
- This is the card that makes a parent go "oh, THAT's what it does."

### Card 4 — THE RECAP (needs touch-up)
"Sunday night answered" is the right idea but the recap looked bland and basic.
- Headline Title Case, key word popping, e.g. "Sunday Night, **Answered**".
- Show a recap that actually looks worth sending: the shareable weekly card with
  real content, warmth, a kid's name, real moments. Make it feel like proof a
  parent would screenshot and send to grandma. Less empty, more alive.

### Card 5 — THE $197 BUILDER, FREE (nearly right, fix the polish)
This was the best one. Keep the composition, fix:
- Title Case headline.
- Make "**FREE**" the hero — all caps, big, popping (lime), with the $197
  struck through. It should read as the best deal on the store.
- Keep the wall-of-worksheets visual. This card sells the bonus; let it sell.

### Card 6 — PRIVACY (recut or drop)
The first "never leaves your phone" card read as a confusing joke. Either:
- Recut it as a clean, confident privacy statement over real UI: "Yours. Never
  Sold, Never Used to Train **AI**." with a simple on-brand lock/shield visual
  and a line of real UI behind it. Make it a trust card, not a gag.
- Or drop it and end on a stronger use-case card. Your call, but only keep it if
  it lands as a real differentiator (privacy IS Sprout's moat, so a good version
  is worth having).

## Order (the scroll)
1 payoff → 2 UI + proof → 3 everything-in-one-place → 4 recap → 5 free builder →
6 privacy (if it's strong). Every card must show the app doing something real.

## Definition of done
- 6-7 bespoke cards, 1290x2796, real app UI, real photos where a photo is
  implied, Title Case headlines with the key word popping, benefit-led copy in
  Sprout voice, "FREE" popping on card 5.
- Note your final lineup + reasoning in docs/FABLE-AUDIT.md.
