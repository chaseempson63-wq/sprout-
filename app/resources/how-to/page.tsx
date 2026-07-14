import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { RESOURCES_DEMO } from "@/lib/resources/demo";

export const metadata: Metadata = {
  title: "How Sprout Resources works",
  description:
    "Make a worksheet for your kid in about a minute. The four steps, what else you can do, and the questions people usually ask.",
};

/* Content lives in plain data so the copy reads native and stays easy to edit.
   Strings (not JSX text) keep apostrophes clean and lint-safe.

   Steps carry small custom visuals (real template illustrations, a mock of
   the actual age dial) instead of generic icon glyphs — show, don't decorate. */

// A tiny strip of the real template wall.
function MiniTemplates() {
  return (
    <div className="mt-3 flex items-center gap-2">
      {["apple", "clock", "brachiosaurus", "books"].map((a, i) => (
        <span
          key={a}
          className="grid h-14 w-[72px] place-items-center overflow-hidden rounded-lg bg-white shadow ring-1 ring-[#1B3722]/10"
          style={{ transform: `rotate(${i % 2 ? 1.4 : -1.4}deg)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static webp */}
          <img src={`/resources/illustrations/${a}.webp`} alt="" className="h-full w-full object-contain p-1" />
        </span>
      ))}
    </div>
  );
}

// The age dial as it appears in the builder.
function MiniAgeDial() {
  return (
    <div className="mt-3 flex w-fit items-center gap-3 rounded-full bg-white px-4 py-1.5 shadow ring-1 ring-[#1B3722]/10">
      <span className="grid size-7 place-items-center rounded-full bg-[#2E5A35]/10 text-base font-extrabold text-[#2E5A35]">−</span>
      <span className="text-sm font-extrabold text-[#1B3722]">
        Age <span className="text-[#2E5A35]">7</span>
      </span>
      <span className="grid size-7 place-items-center rounded-full bg-[#2E5A35]/10 text-base font-extrabold text-[#2E5A35]">+</span>
    </div>
  );
}

// The preset chips row from the builder.
function MiniPresets() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {["harder", "easier", "longer", "more questions", "dinosaurs"].map((p) => (
        <span key={p} className="rounded-full border border-[#2E5A35]/20 bg-white px-2.5 py-1 text-[11px] font-bold text-[#2E5A35] shadow-sm">
          {p}
        </span>
      ))}
    </div>
  );
}

const STEPS: { title: string; body: string; visual?: ReactNode }[] = [
  {
    title: "Pick a worksheet",
    body: RESOURCES_DEMO
      ? "Browse the templates and tap one. Addition, reading, handwriting, telling time, and plenty more."
      : "Browse the templates and tap one. Or hit Build your own and describe anything you want in plain words.",
    visual: <MiniTemplates />,
  },
  {
    title: "Set your kid's age",
    body: "Use the minus and plus next to Age. That's the dial for how hard the sheet is. Save a kid's profile and Sprout sets the age for you next time.",
    visual: <MiniAgeDial />,
  },
  {
    title: "Sprout builds it",
    body: "It writes the whole worksheet in a second or two. Watch it come together, then it's ready to change.",
  },
  {
    title: "Tweak it with one tap",
    body: "Above the chat box is a row of presets: harder, easier, longer, shorter, more questions. Tap one and it rebuilds that way in a second. Tap a few and they stack. Want a theme like space or dinosaurs, or anything specific? Just type it in the chat.",
    visual: <MiniPresets />,
  },
  {
    title: "Print it or save it",
    body: "Download PDF opens your print screen to print or save as a PDF. Save keeps it in My worksheets for later. No watermark, no catch.",
  },
];

const EXTRAS = [
  {
    title: RESOURCES_DEMO ? "Build your own (coming soon)" : "Build your own",
    body: RESOURCES_DEMO
      ? "Describe any worksheet from scratch and Sprout builds it. Nearly ready. Tap Build on the library page for a sneak peek."
      : "Don't see what you need? Describe it from scratch and Sprout builds it. The age, the topic, how many questions, any theme.",
  },
  {
    title: "Add your kids",
    body: "Save a profile for each kid so their age and their worksheets are one tap away.",
  },
  {
    title: "Save for later",
    body: "Anything you make can be saved to My worksheets and reopened whenever you want.",
  },
  {
    title: RESOURCES_DEMO ? "The community (coming soon)" : "Share with other parents",
    body: RESOURCES_DEMO
      ? "Worksheets other parents built and shared, a chat to swap ideas, and updates from the team. Opening soon. Tap Community for a peek."
      : "Built something good? Publish it to the Community. Only the sheets you build yourself can be shared.",
  },
  {
    title: RESOURCES_DEMO ? "Slideshows (coming soon)" : "Ask for more",
    body: RESOURCES_DEMO
      ? "Type a topic, get a warm illustrated mini lesson to present full screen or print. On the way."
      : "Want a pack that doesn't exist yet? Drop it in the Community and we'll build it.",
  },
];

const FAQS = [
  {
    q: "Is it free?",
    a: "Yes. No account, no card, no limits. We're parents building this for parents, not a company mining you for data to sell on. Make and print as many as you want.",
  },
  {
    q: "Is my data safe? Do you train AI on it?",
    a: "Yes, and no. This is the whole reason Sprout exists. Worksheets are built by Venice AI, and nothing you type is stored or used to train anything. Your worksheets and your kids' profiles are saved in your browser, on your device, not on our servers. The tech giants take everything. Here, your kid's stuff stays yours.",
  },
  {
    q: "Where do my worksheets live? Could I lose them?",
    a: "They're saved in this browser, on this device. That's the privacy promise, your stuff never touches our servers. The trade-off: they don't follow you to another device yet, and clearing your browser clears them. Download the PDFs you want to keep.",
  },
  {
    q: "What ages does it work for?",
    a: "Three to thirteen. The age you set is the dial for how hard the sheet comes out.",
  },
  {
    q: "The difficulty looks off. Why?",
    a: "It follows the age in the stepper, not your kid's profile on its own. Nudge the age up or down and it rebuilds. Picking a kid just sets the age to theirs.",
  },
  {
    q: "Can I print it or save a PDF?",
    a: "Yes. Download PDF opens your print screen, where you can save it as a PDF or send it straight to a printer. No watermark on it.",
  },
  {
    q: "Do I need an account?",
    a: RESOURCES_DEMO
      ? "No. There's nothing to sign up for. Pick a template, print it, done."
      : "Not to make and print. You only add a name if you want to publish a worksheet or post in the Community. No email, no password, just a name.",
  },
  {
    q: RESOURCES_DEMO ? "When do build-your-own, slideshows, and the community open?" : "What's the Community? Can people see my kid's stuff?",
    a: RESOURCES_DEMO
      ? "Soon. They open alongside the Sprout app. Tap any of the coming-soon previews and join the waitlist right there, you'll hear the day it happens. The templates stay free either way."
      : "One place with three rooms: worksheets other parents chose to share, a chat to ask and swap ideas, and updates from the team. Nothing of yours goes public unless you build your own sheet and tap Publish, or post in the chat. Your saved sheets and your kids' profiles never leave your browser.",
  },
  {
    q: "Could I lose my saved stuff if I clear my browser?",
    a: "Yes, that's the honest trade-off of keeping it off our servers. So there's a Back up button in the Profiles card on the library page. It downloads one file with everything; Restore brings it back on any device.",
  },
  {
    q: "It's slow, or it threw an error.",
    a: "Most sheets land in a second or two. If one trips, you'll see a try that again message. Just send it again.",
  },
];

export default function HowToPage() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <span className="bg-sprout-cream/95 grid size-16 shrink-0 place-items-center rounded-2xl shadow-md sm:size-20">
          <SproutMascotIcon className="h-11 w-11 sm:h-14 sm:w-14" />
        </span>
        <div>
          <p className="text-sprout-lime text-xs font-bold tracking-[0.2em] uppercase">How it works</p>
          <h1 className="text-sprout-cream mt-1 text-4xl font-bold tracking-[-0.02em] sm:text-5xl">
            Make a worksheet in about a minute
          </h1>
        </div>
      </div>
      <p className="text-sprout-cream/75 mt-5 text-lg leading-relaxed">
        Pick a worksheet, tell Sprout about your kid, and print it. That&apos;s the whole thing. 100+ templates,
        no account, nothing sold off behind your back, no catch. You&apos;re in with the parents who wanted their
        own corner of the internet to do this, one the tech giants don&apos;t get to touch. Here&apos;s how it all
        works, start to finish, plus the questions people usually ask.
      </p>

      {/* Steps */}
      <ol className="mt-10 space-y-3.5">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="flex items-start gap-4 rounded-2xl bg-[#F4EDE0] p-5 text-[#1B3722] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.3)]"
          >
            <span className="bg-sprout-lime grid size-9 shrink-0 place-items-center rounded-full text-[15px] font-extrabold text-[#1B3722]">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold">{s.title}</h2>
              <p className="mt-1 leading-relaxed text-[#1B3722]/75">{s.body}</p>
              {s.visual}
            </div>
          </li>
        ))}
      </ol>

      {/* A few other things you can do */}
      <h2 className="text-sprout-cream mt-14 text-2xl font-bold tracking-[-0.01em]">
        A few other things you can do
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {EXTRAS.map((e) => (
          <div
            key={e.title}
            className="border-sprout-cream/15 bg-sprout-cream/10 rounded-2xl border p-5 backdrop-blur-sm"
          >
            <h3 className="text-sprout-cream font-bold">{e.title}</h3>
            <p className="text-sprout-cream/70 mt-1 text-sm leading-relaxed">{e.body}</p>
          </div>
        ))}
      </div>

      {/* Questions */}
      <h2 className="text-sprout-cream mt-14 text-2xl font-bold tracking-[-0.01em]">Questions</h2>
      <div className="mt-5 space-y-2.5">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl bg-[#F4EDE0] text-[#1B3722] open:shadow-[0_15px_40px_-12px_rgba(0,0,0,0.3)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-extrabold [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="size-5 shrink-0 text-[#2A5132] transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-[#1B3722]/80">{f.a}</p>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="border-sprout-cream/15 bg-sprout-cream/10 mt-14 flex flex-col items-center gap-4 rounded-3xl border p-8 text-center backdrop-blur-sm">
        <h2 className="text-sprout-cream text-2xl font-bold">Still stuck?</h2>
        <p className="text-sprout-cream/75 max-w-md">
          Pop a question in the Community. Real Sprout parents and the team answer. You&apos;re not doing this
          on your own anymore.
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/resources"
            className="bg-sprout-cream inline-flex h-12 items-center gap-2 rounded-full px-6 font-bold text-[#1B3722] transition-transform hover:-translate-y-0.5"
          >
            Start making <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/resources/community"
            className="border-sprout-cream/25 text-sprout-cream hover:bg-sprout-cream/10 inline-flex h-12 items-center gap-2 rounded-full border px-6 font-bold transition-colors"
          >
            Open the Community
          </Link>
        </div>
      </div>
    </div>
  );
}
