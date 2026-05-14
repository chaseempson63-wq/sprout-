# Sprout

A weekly reflection app for AU/NZ homeschool parents (multi-child, ages 5-17). One job: turn a chaotic homeschool week into a beautiful, AI-generated weekly artifact (per kid) that proves the week counted. Replaces 3am parental anxiety with Sunday-night relief.

@AGENTS.md

## Source of truth

- **[`docs/MASTER.md`](docs/MASTER.md)** — full A-Z product/strategy spec. Read it before making any product, scope, or positioning decision. When in doubt, MASTER wins.
- **[`docs/BRAND.md`](docs/BRAND.md)** — visual brand spec (palette, typography, premium-feel rules, paste-ready image gen prompts). Read before making any design, copy, or asset-generation decision.

## Quick orientation

- **The wedge**: parental anxiety ("am I screwing my kid up?"), not curriculum
- **The mechanic**: welcomed-not-required daily inputs (voice/photo/text) → AI-generated weekly report (per kid, every Sunday night) → beautiful shareable artifact
- **Pricing**: AUD $29/mo or $249/yr, 7-day trial, first weekly report unlocked-and-shareable forever (shareability = marketing)
- **Multi-child from day one**: parent → kids[], inputs tagged per-kid or "all," reports per-kid, flat per-family pricing
- **Scope**: relentlessly tight — no curriculum, no lesson plans, no rego paperwork, no kid logins, no streaks/gamification, no native mobile app

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Geist Sans · Lucide. Planned (add when needed): Supabase (AU region) · Anthropic Claude API · Resend · Stripe.

## Brand at a glance

Three moods, one brand:
- **Marketing/landing**: light + confident (white, deep forest green, lime accents, bold sans)
- **App interior**: dark + immersive + glassmorphic (deep almost-black, frosted cards, lime CTAs)
- **Weekly report artifact**: light + warm + shareable (cream/white, forest green headers, designed for screenshot + print)

Voice: direct & confident. Linear/Vercel register. AU/NZ English. No exclamation marks. No emojis-as-decoration. Warmth comes from what we say, not how excitedly we say it.

## Working agreement

Push back on scope creep, premature feature work, anti-shareability monetization, and overconfident market claims. Don't gas the founder up. Don't reference Chase's other projects — Sprout only.

12-month north star: **100 paying users.**
