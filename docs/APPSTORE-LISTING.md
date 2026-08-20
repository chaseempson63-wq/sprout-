# Sprout App Store Listing (paste-ready for App Store Connect)

*Drafted 2026-08-20. Within Apple's character limits. No em dashes, no exclamation marks.
Modeled on ~/Desktop/ember/APPSTORE-LISTING.md, the app currently in review.*

**CONFIRM BEFORE PASTING:** the price numbers below are the CLAUDE.md figures
($29.99/mo, $287.99/yr). Whatever is actually saved in App Store Connect wins.
Fix these lines if ASC says something different.

---

## App name (30 chars max)
**Sprout: Homeschool Journal** (27)

## Subtitle (30 chars max)
**Your kid's week, in one place** (29)

Alternates, all within 30:
- Where your kid's week lives (26)
- See what the week added up to (30)

## Category
Primary: Education. Secondary: Productivity.

## Age rating
4+. No user-generated content shown to others, no web browser, no ads.

## Keywords (100 chars max, commas, no spaces)
`homeschool,homeschooling,journal,record keeping,portfolio,learning log,kids,tracker,parent,school`

## Promotional text (170 chars max, changeable without review)
You did more than you think. Log the week as it happens, then scroll back and see the whole thing laid out. Proof for you, and proof your kid can see too.

## Description (4000 chars max)

Sprout is where your kid's week of learning lives.

You know the feeling. It's Sunday night, the week is gone, and you genuinely cannot say what your kid learned. Not because nothing happened. Because it happened in the car, at the kitchen table, halfway through a walk, and none of it got written down.

Sprout fixes that with the smallest possible habit.

CAPTURE IT IN TEN SECONDS
A photo of what they made. One sentence. A voice memo while you're still standing there. That's it. No lesson plans to fill in, no boxes to tick, no curriculum to pick. If it took longer than making a coffee, you wouldn't do it, and neither would we.

THE WEEK, LAID OUT
Everything you logged compiles itself into a timeline for each kid. Scroll it and the week is just there: what they did, when, in your own words and their own photos. Nothing is generated, nothing is invented. Sprout organizes what you put in and hands it back to you.

SIX WAYS KIDS GROW
Talk, Count, Ask, Make, Do, Explore. Every moment you log lands in one of them, so over a few weeks you can see the shape of what your kid is actually doing, including the parts that never look like school.

BUILT FOR MORE THAN ONE KID
Add every child. Log to one of them or to all of them at once. Each one gets their own timeline, their own avatar, their own week. One price for the whole family, no matter how many kids you have.

THEY CAN SEE IT TOO
Kids almost never get to see their own work stacking up. In Sprout they can. The same warm timeline, the same photos, the same streak. It turns out proof matters to a nine year old just as much as it matters to you.

WHAT YOU LOG STAYS YOURS
Your child's photos, notes, and voice memos stay on your phone. Sprout keeps no copy of them on any server. We do not sell your data and we do not train anything on your child's work. That is not a feature we might change later. It is the reason the app exists.

RECORDS, WITHOUT THE DREAD
If someone ever asks what your year looked like, you have it. Dated, in order, in your own words. Sprout is not a compliance product and it will never nag you about paperwork, but the paperwork gets easier anyway.

THE RESOURCE LIBRARY, INCLUDED
Your membership includes the full Sprout worksheet library at hisprout.app, hundreds of printable templates you can pull at any difficulty level. It normally sells on its own. Members get it at no extra cost.

You are not raising a student. You are raising a human, and you are keeping the proof.

Sprout membership is billed through your Apple Account and renews automatically until you cancel in your Apple Account settings. Terms of Use and Privacy Policy are linked in the app and at hisprout.app.

## Screenshot plan (7 ready at 1290x2796, captions baked in)
Assets: `~/Desktop/sprout-appstore/OFFICIAL SPROUT APP STORE CARD IMAGES/`
Order for the 6.9" slot (6.5" inherits, no iPad slot now that the build is iPhone-only):
1. card-1-payoff
2. card-2-capture
3. card-3-oneplace
4. card-4-recap
5. card-6-momentum
6. card-7-privacy
7. card-5-free (the included library, last, it is the upsell not the hook)

CHECK BEFORE UPLOAD: card-7-privacy must not say anything like "no accounts" or
"no login". The app has Sign in with Apple. A privacy claim that does not match
the build is what got Ember rejected the first time.

## App Privacy answers (accurate for this build)
- **Data used to track you:** NONE. No tracking, no ad identifiers, no third-party analytics.
- **Data linked to you:** NONE.
- **Data NOT linked to you:**
  - *Identifiers (User ID)*: the Sign in with Apple `sub`, sent to RevenueCat as the
    App User ID so a membership survives a new phone and resolves on the web library.
    Purpose: App Functionality.
  - *Purchases (Purchase History)*: via RevenueCat. Purpose: App Functionality.
- **Data NOT collected:** photos, audio, contacts, location, browsing, health,
  search history, diagnostics. Child content is on-device only and never transmitted.
- Email address: typed on the paywall and stored in UserDefaults on the device only.
  Not transmitted, so not declared as collected. If that ever changes, update this.

## App Review Information
- Contact: Chase Empson, +64 27 365 8034, hello@hisprout.app
- **Sign-in required: CHECKED.** The app uses Sign in with Apple, so provide the
  reviewer a sandbox Apple Account, or note that Apple's own reviewer account works
  with Sign in with Apple natively. Do not leave this unchecked. Ember could leave it
  unchecked because Ember has no login. Sprout does.

### Review notes (paste into ASC)
Sprout is a private journal for homeschooling parents. A parent logs short moments as
they happen, a photo, a sentence, or a voice memo, and Sprout compiles them into a
dated timeline for each child. Sprout does not generate content, does not use AI to
write anything, and does not provide curriculum or lesson plans.

SIGN IN WITH APPLE
Onboarding includes Sign in with Apple. It is used only to obtain a stable identifier
so a membership follows the user to a new device and resolves on our web resource
library. We do not store the name or email. The identifier is passed to RevenueCat as
the App User ID.

SUBSCRIPTION AND FREE TRIAL
Sprout is subscription only. The paywall appears at the end of onboarding and offers a
free trial followed by a monthly or yearly plan. Terms of Use and Privacy Policy are
linked directly on the paywall and again in Settings. Restore Purchases is available
on the paywall and in Settings.

PRIVACY
A child's photos, notes and voice memos are stored on the device and are never
uploaded. Nothing about a child's content reaches our servers.

- Version Release: **Manually release this version.** Approval must not auto-publish.
- Content Rights: no third-party content.

## Subscriptions to create in ASC (before the submission, not after)
One subscription group, "Sprout Membership". Entitlement in RevenueCat: `premium`.

| Product | Price | Intro offer | Notes |
|---|---|---|---|
| Monthly | $29.99 (confirm) | **7-day free trial** | must match `trialDays()` fallback of 7 |
| Yearly | $287.99 (confirm) | **14-day free trial** | must match `trialDays()` fallback of 14 |

**This is the highest-risk item in the whole submission.** `PaywallView.trialDays()`
falls back to 7 days monthly / 14 days yearly when a product has no introductory
offer. So if the intro offers are missing in ASC, the paywall still tells the user
they get a free trial and Apple charges them on day one. Ember hit this exact bug
before submitting. Every product needs: price, availability set for all regions,
localization, promo image, review screenshot, and the intro offer.

Also confirm whether a weekly plan still exists. The current paywall renders only
yearly and monthly cards, so a weekly product in ASC would be orphaned.

## Sequencing (from the Ember handoff, learned the hard way)
1. Rork Publish uploads the build only. It does NOT create an App Review submission.
2. Create the subscription products in ASC and get them to "Ready to submit".
3. Add the app version AND each individual subscription to the SAME draft submission
   via the "Add for Review" dropdown. Adding the group alone is not enough, each
   subscription must be added from its own page. It submits as one lot.
4. Pulling the app version back out of review knocks all the subscriptions out too.
5. First submission is 24 to 72 hours.

## URLs
- Support: https://hisprout.app (add a /support page if Apple pushes back)
- Marketing: https://hisprout.app
- Privacy Policy: https://hisprout.app/privacy (verified 200)
- Terms of Use: https://hisprout.app/terms (verified 200)
- Copyright: 2026 Sprout
