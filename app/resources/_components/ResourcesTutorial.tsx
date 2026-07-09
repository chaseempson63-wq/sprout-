"use client";

// First-run tutorial for the Resources platform. A frosted-glass pop-up with a
// short 5-step how-to, shown ONCE per browser session, on the first Resources
// page load. It waits for the site-load intro (SiteIntro) to finish so the two
// never overlap. Dismiss by Skip, the X, clicking outside, Escape, or finishing.
// Not gated on JS for the page itself — it's a pure overlay on top.

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, PencilLine, ShieldCheck, SlidersHorizontal, Sparkles, Users, X } from "lucide-react";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { RESOURCES_DEMO } from "@/lib/resources/demo";

// Separate storage keys so the demo tour shows once now, and the full tour
// shows once again when the platform opens up at launch.
const KEY = RESOURCES_DEMO ? "sprout.res.tutorial.demo.v1" : "sprout.res.tutorial.v1";

type Step = { icon: React.ReactNode; title: string; body: string };

const FULL_STEPS: Step[] = [
  {
    icon: "mascot",
    title: "Welcome to your worksheet maker",
    body: "Make any worksheet or slideshow for your kid, free to print. Here's the 30-second version.",
  },
  {
    icon: <PencilLine className="size-6" />,
    title: "Just say what you want",
    body: "Type it plain, like \"addition with dinosaurs\" or \"a reading passage about the moon.\" Or pick a template to start from.",
  },
  {
    icon: <SlidersHorizontal className="size-6" />,
    title: "Set the age",
    body: "The age dial is how hard the sheet is. Nudge it up or down and the sheet rebuilds to fit your kid. That's the only setting that changes difficulty.",
  },
  {
    icon: <Users className="size-6" />,
    title: "See what other parents made",
    body: "The Community is full of sheets to browse, print, and remix. Ask a question in Chat any time. Publish your own to share it back.",
  },
  {
    icon: <ShieldCheck className="size-6" />,
    title: "Your stuff stays yours",
    body: "Your kids' names and worksheets live in your own browser. Never sold, never used to train AI. That's the whole promise.",
  },
];

// Demo-stage tour: the templates are the product, the rest is teased.
const DEMO_STEPS: Step[] = [
  {
    icon: "mascot",
    title: "Welcome to the free worksheet library",
    body: "30 worksheet templates, tailored to your kid's age, free to print. Here's the 30-second version.",
  },
  {
    icon: <PencilLine className="size-6" />,
    title: "Pick a template",
    body: "Addition, reading, handwriting, telling time, and plenty more. Tap one and it builds itself for your kid.",
  },
  {
    icon: <SlidersHorizontal className="size-6" />,
    title: "Set the age",
    body: "The age dial is how hard the sheet is. Nudge it up or down and the sheet rebuilds to fit your kid. That's the only setting that changes difficulty.",
  },
  {
    icon: <Sparkles className="size-6" />,
    title: "More is on the way",
    body: "Build-your-own worksheets, slideshows, and the community are coming soon. Tap any of them for a sneak peek. The templates are free while you wait.",
  },
  {
    icon: <ShieldCheck className="size-6" />,
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
          className="absolute top-4 right-4 inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-bold text-[#1B3722]/45 transition hover:bg-[#2E5A35]/8 hover:text-[#1B3722]"
        >
          Skip <X className="size-3.5" />
        </button>

        <span className="grid size-14 place-items-center rounded-2xl bg-[#2E5A35]/10 text-[#2E5A35] ring-1 ring-[#2E5A35]/10 sm:size-16">
          {s.icon === "mascot" ? <SproutMascotIcon className="size-9 sm:size-10" /> : s.icon}
        </span>

        <h2 className="mt-5 text-2xl font-bold tracking-[-0.01em] text-[#1B3722]">{s.title}</h2>
        <p className="mt-2 leading-relaxed text-[#1B3722]/70">{s.body}</p>

        {/* dots + controls */}
        <div className="mt-7 flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex h-11 items-center gap-1 rounded-full border border-[#2E5A35]/20 bg-white/60 px-4 text-sm font-bold text-[#1B3722]/75 transition hover:bg-white"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
            )}
            <button
              onClick={() => (last ? close() : setStep((s) => Math.min(STEPS.length - 1, s + 1)))}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#2E5A35] px-5 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(46,90,53,0.7)] transition hover:-translate-y-0.5 hover:bg-[#346a3f] active:scale-95"
            >
              {last ? "Start making" : "Next"}
              {last ? <Sparkles className="size-4" /> : <ArrowRight className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
