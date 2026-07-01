import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Bookmark,
  ChevronDown,
  Globe,
  LayoutGrid,
  MessagesSquare,
  PenLine,
  Printer,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from "lucide-react";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";

export const metadata: Metadata = {
  title: "How Sprout Resources works",
  description:
    "Make a worksheet for your kid in about a minute. The four steps, what else you can do, and the questions people usually ask.",
};

/* Content lives in plain data so the copy reads native and stays easy to edit.
   Strings (not JSX text) keep apostrophes clean and lint-safe. */

const STEPS = [
  {
    icon: LayoutGrid,
    title: "Pick a worksheet",
    body: "Browse the templates and tap one. Or hit Build your own and describe anything you want in plain words.",
  },
  {
    icon: SlidersHorizontal,
    title: "Set your kid's age",
    body: "Use the minus and plus next to Age. That's the dial for how hard the sheet is. Save a kid's profile and Sprout sets the age for you next time.",
  },
  {
    icon: Sparkles,
    title: "Sprout builds it",
    body: "It writes the whole worksheet in a second or two. Watch it come together, then it's ready to change.",
  },
  {
    icon: Wand2,
    title: "Tweak it with one tap",
    body: "Under the sheet is a row of presets: harder, easier, more questions, or a theme like space or dinosaurs. Tap one and it rebuilds that way in a second. Tap a few and they stack. Want something specific? Just type it in the chat.",
  },
  {
    icon: Printer,
    title: "Print it or save it",
    body: "Download PDF opens your print screen to print or save as a PDF. Save keeps it in My worksheets for later. No watermark, no catch.",
  },
];

const EXTRAS = [
  {
    icon: PenLine,
    title: "Build your own",
    body: "Don't see what you need? Describe it from scratch and Sprout builds it. The age, the topic, how many questions, any theme.",
  },
  {
    icon: Baby,
    title: "Add your kids",
    body: "Save a profile for each kid so their age and their worksheets are one tap away.",
  },
  {
    icon: Bookmark,
    title: "Save for later",
    body: "Anything you make can be saved to My worksheets and reopened whenever you want.",
  },
  {
    icon: Globe,
    title: "Share with other parents",
    body: "Built something good? Publish it to the Community. Only the sheets you build yourself can be shared.",
  },
  {
    icon: MessagesSquare,
    title: "Ask for more",
    body: "Want a pack that doesn't exist yet? Drop it in the Community and we'll build it.",
  },
];

const FAQS = [
  {
    q: "Is it free?",
    a: "Yes. No account, no card, no limits. Make and print as many as you want.",
  },
  {
    q: "Is my data safe? Do you train AI on it?",
    a: "No, and no. Worksheets are built by Venice AI, and nothing you type is stored or used to train anything. Your worksheets and your kids' profiles are saved in your browser, on your device, not on our servers. It's all yours.",
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
    a: "Not to make and print. You only add a name if you want to publish a worksheet or post in the Community. No email, no password, just a name.",
  },
  {
    q: "What's the Community? Can people see my kid's stuff?",
    a: "It's worksheets other parents chose to share. Nothing of yours goes public unless you build your own sheet and tap Publish. Your saved sheets and your kids' profiles never leave your browser.",
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
        Pick a worksheet, tell Sprout about your kid, and print it. Here&apos;s the whole thing, start to
        finish, plus the questions people usually ask.
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
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <s.icon className="size-5 shrink-0 text-[#2A5132]" /> {s.title}
              </h2>
              <p className="mt-1 leading-relaxed text-[#1B3722]/75">{s.body}</p>
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
            <e.icon className="text-sprout-lime size-6" />
            <h3 className="text-sprout-cream mt-3 font-bold">{e.title}</h3>
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
          Pop a question in the Community. Real Sprout parents and the team answer.
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/resources"
            className="bg-sprout-cream inline-flex h-12 items-center gap-2 rounded-full px-6 font-bold text-[#1B3722] transition-transform hover:-translate-y-0.5"
          >
            Start making <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/resources/forum"
            className="border-sprout-cream/25 text-sprout-cream hover:bg-sprout-cream/10 inline-flex h-12 items-center gap-2 rounded-full border px-6 font-bold transition-colors"
          >
            Open the Community
          </Link>
        </div>
      </div>
    </div>
  );
}
