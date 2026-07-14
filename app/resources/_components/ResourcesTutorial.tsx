"use client";

// First-run tutorial for the Resources platform. A frosted-glass pop-up with a
// short 5-step how-to, shown ONCE per browser session, on the first Resources
// page load. It waits for the site-load intro (SiteIntro) to finish so the two
// never overlap. Dismiss by Skip, the X, clicking outside, Escape, or finishing.
// Not gated on JS for the page itself — it's a pure overlay on top.
//
// Each step carries a custom-built visual (real template illustrations, a mock
// of the actual age dial, the coming-soon chips) instead of a generic icon —
// the tour SHOWS the thing it's describing.

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { RESOURCES_DEMO } from "@/lib/resources/demo";

// Separate storage keys so the demo tour shows once now, and the full tour
// shows once again when the platform opens up at launch.
const KEY = RESOURCES_DEMO ? "sprout.res.tutorial.demo.v2" : "sprout.res.tutorial.v2";

/* ── Step visuals — small mocks of the real UI ─────────────────────── */

const band = "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E5A35] to-[#16331E] p-4";

function WelcomeVisual() {
  return (
    <div className={`${band} grid place-items-center py-6`}>
      <span className="grid size-20 place-items-center rounded-2xl bg-[#FFFDF6] shadow-lg">
        <SproutMascotIcon className="size-14" />
      </span>
    </div>
  );
}

// A mini wall of the real template illustrations — exactly what the library
// page looks like, shrunk down.
const SAMPLE_ART = ["apple", "clock", "butterfly-life-cycle", "brachiosaurus", "books", "earth"];

function TemplatesVisual() {
  return (
    <div className={band}>
      <div className="grid grid-cols-3 gap-2">
        {SAMPLE_ART.map((a, i) => (
          <span
            key={a}
            className="grid aspect-[4/3] place-items-center overflow-hidden rounded-lg bg-[#FFFDF6] shadow"
            style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static webp */}
            <img src={`/resources/illustrations/${a}.webp`} alt="" className="h-full w-full object-contain p-1" />
          </span>
        ))}
      </div>
    </div>
  );
}

// The actual age dial, mocked: minus / Age 7 / plus, with the sheet lines
// beneath hinting that the page rebuilds around it.
function AgeVisual() {
  return (
    <div className={band}>
      <div className="mx-auto flex w-fit items-center gap-3 rounded-full bg-[#FFFDF6] px-4 py-2 shadow-lg">
        <span className="grid size-8 place-items-center rounded-full bg-[#2E5A35]/10 text-lg font-extrabold text-[#2E5A35]">−</span>
        <span className="text-sm font-extrabold text-[#1B3722]">
          Age <span className="text-[#2E5A35]">7</span>
        </span>
        <span className="grid size-8 place-items-center rounded-full bg-[#2E5A35]/10 text-lg font-extrabold text-[#2E5A35]">+</span>
      </div>
      <div className="mx-auto mt-3 w-4/5 rounded-lg bg-[#FFFDF6] p-3">
        <div className="h-2 w-1/2 rounded-full bg-[#1B3722]/60" />
        <div className="mt-2 h-1.5 w-4/5 rounded-full bg-[#1B3722]/15" />
        <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-[#1B3722]/15" />
      </div>
    </div>
  );
}

// The three teased features as they appear on the page, lime badge and all.
function SoonVisual() {
  return (
    <div className={`${band} space-y-2`}>
      {["Build your own", "Slideshows", "The community"].map((t) => (
        <div key={t} className="flex items-center justify-between rounded-xl bg-[#FFFDF6] px-3.5 py-2.5 shadow">
          <span className="text-[13px] font-bold text-[#1B3722]">{t}</span>
          <span className="bg-sprout-lime rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-[0.14em] text-[#1B3722] uppercase">
            Soon
          </span>
        </div>
      ))}
    </div>
  );
}

// Your stuff stays on your device: a little browser window holding the
// worksheet, and nothing leaving it.
function PrivacyVisual() {
  return (
    <div className={band}>
      <div className="mx-auto w-4/5 overflow-hidden rounded-xl bg-[#FFFDF6] shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-[#1B3722]/10 px-3 py-2">
          <span className="size-2 rounded-full bg-[#1B3722]/15" />
          <span className="size-2 rounded-full bg-[#1B3722]/15" />
          <span className="size-2 rounded-full bg-[#1B3722]/15" />
          <span className="ml-2 text-[10px] font-bold text-[#1B3722]/45">your browser</span>
        </div>
        <div className="p-3">
          <div className="h-2 w-1/2 rounded-full bg-[#1B3722]/60" />
          <div className="mt-2 h-1.5 w-4/5 rounded-full bg-[#1B3722]/15" />
          <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-[#1B3722]/15" />
        </div>
      </div>
      <p className="text-sprout-cream/80 mt-2.5 text-center text-[11px] font-bold">
        saved here, never on our servers
      </p>
    </div>
  );
}

type Step = { visual: React.ReactNode; title: string; body: string };

const FULL_STEPS: Step[] = [
  {
    visual: <WelcomeVisual />,
    title: "Welcome to your worksheet maker",
    body: "Make any worksheet or slideshow for your kid, free to print. Here's the 30-second version.",
  },
  {
    visual: <TemplatesVisual />,
    title: "Just say what you want",
    body: "Type it plain, like \"addition with dinosaurs\" or \"a reading passage about the moon.\" Or pick a template to start from.",
  },
  {
    visual: <AgeVisual />,
    title: "Set the age",
    body: "The age dial is how hard the sheet is. Nudge it up or down and the sheet rebuilds to fit your kid. That's the only setting that changes difficulty.",
  },
  {
    visual: <SoonVisual />,
    title: "See what other parents made",
    body: "The Community is full of sheets to browse, print, and remix. Ask a question in Chat any time. Publish your own to share it back.",
  },
  {
    visual: <PrivacyVisual />,
    title: "Your stuff stays yours",
    body: "Your kids' names and worksheets live in your own browser. Never sold, never used to train AI. That's the whole promise.",
  },
];

// Demo-stage tour: the templates are the product, the rest is teased.
const DEMO_STEPS: Step[] = [
  {
    visual: <WelcomeVisual />,
    title: "Welcome to the free resource library",
    body: "100+ worksheet templates, tailored to your kid's age, free to print. Here's the 30-second version.",
  },
  {
    visual: <TemplatesVisual />,
    title: "Pick a template",
    body: "Addition, reading, handwriting, telling time, and plenty more. Tap one and it builds itself for your kid.",
  },
  {
    visual: <AgeVisual />,
    title: "Set the age",
    body: "The age dial is how hard the sheet is. Nudge it up or down and the sheet rebuilds to fit your kid. That's the only setting that changes difficulty.",
  },
  {
    visual: <SoonVisual />,
    title: "More is on the way",
    body: "Build-your-own worksheets, slideshows, and the community are coming soon. Tap any of them for a sneak peek. The templates are free while you wait.",
  },
  {
    visual: <PrivacyVisual />,
    title: "Your stuff stays yours",
    body: "Your kids' names and worksheets live in your own browser. Never sold, never used to train AI. That's the whole promise.",
  },
];

const STEPS: Step[] = RESOURCES_DEMO ? DEMO_STEPS : FULL_STEPS;

export function ResourcesTutorial() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const shownRef = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  // Decide whether to show: once per session, after the intro finishes.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      /* storage blocked — treat as first run, still session-safe below */
    }

    const root = document.documentElement;
    let cancelled = false;

    const reveal = () => {
      if (cancelled || shownRef.current) return;
      shownRef.current = true;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    };

    const introDone = () => {
      const s = root.getAttribute("data-site-intro");
      return s === null || s === "off";
    };

    if (introDone()) {
      const t = window.setTimeout(reveal, 500);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
      };
    }

    // Wait for the intro's data attribute to settle to "off".
    const obs = new MutationObserver(() => {
      if (introDone()) {
        obs.disconnect();
        window.setTimeout(reveal, 450);
      }
    });
    obs.observe(root, { attributes: true, attributeFilter: ["data-site-intro"] });
    // Fail-safe: never wait forever on a wedged intro.
    const safety = window.setTimeout(() => {
      obs.disconnect();
      reveal();
    }, 6000);

    return () => {
      cancelled = true;
      obs.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-label="How Sprout Resources works">
      {/* frosted backdrop — click anywhere outside to dismiss */}
      <button aria-label="Close tutorial" onClick={close} className="absolute inset-0 cursor-default bg-[#0F1A12]/50 backdrop-blur-md" />

      <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-md rounded-[28px] bg-[#FFFDF6] p-6 shadow-[0_40px_90px_-24px_rgba(8,22,12,0.75)] ring-1 ring-[#2E5A35]/10 duration-300 sm:p-8">
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 inline-flex h-8 items-center gap-1 rounded-full bg-[#FFFDF6]/90 px-3 text-xs font-bold text-[#1B3722]/45 transition hover:bg-[#2E5A35]/8 hover:text-[#1B3722]"
        >
          Skip <X className="size-3.5" />
        </button>

        {s.visual}

        <h2 className="mt-5 text-2xl font-bold tracking-[-0.01em] text-[#1B3722]">{s.title}</h2>
        <p className="mt-2 leading-relaxed text-[#1B3722]/70">{s.body}</p>

        {/* dots + controls — flex-wrap + ml-auto so the buttons drop to their
            own right-aligned line on narrow screens instead of clipping. */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={
                  i === step
                    ? "h-2 w-5 rounded-full bg-[#2E5A35] transition-all"
                    : "size-2 rounded-full bg-[#2E5A35]/20 transition-all"
                }
              />
            ))}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex h-11 items-center gap-1 rounded-full border border-[#2E5A35]/20 bg-white/60 px-4 text-sm font-bold whitespace-nowrap text-[#1B3722]/75 transition hover:bg-white"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
            )}
            <button
              onClick={() => (last ? close() : setStep((s) => Math.min(STEPS.length - 1, s + 1)))}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#2E5A35] px-5 text-sm font-bold whitespace-nowrap text-white shadow-[0_12px_28px_-10px_rgba(46,90,53,0.7)] transition hover:-translate-y-0.5 hover:bg-[#346a3f] active:scale-95"
            >
              {last ? "Start making" : "Next"}
              {!last && <ArrowRight className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
