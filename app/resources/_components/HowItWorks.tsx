"use client";

// Light "how this works" teaching cards, in the resources card style. Used on
// the library home, on Start From Scratch, and when a template opens, to give
// context and show people how to ask for a good worksheet. Visual + copy only.
// Pass a dismissKey to make it a one-per-session hint (a "Got it" control).

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type HowStep = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
};

export function HowItWorks({
  eyebrow = "How this works",
  steps,
  dismissKey,
  className = "",
}: {
  eyebrow?: string;
  steps: HowStep[];
  dismissKey?: string;
  className?: string;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!dismissKey) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(dismissKey) === "1";
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only read of the per-session dismiss flag after mount
    if (dismissed) setHidden(true);
  }, [dismissKey]);

  if (hidden) return null;

  function dismiss() {
    if (dismissKey) {
      try {
        sessionStorage.setItem(dismissKey, "1");
      } catch {
        /* ignore */
      }
    }
    setHidden(true);
  }

  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sprout-lime/90 text-xs font-bold tracking-wide uppercase">{eyebrow}</span>
        {dismissKey && (
          <button onClick={dismiss} className="text-sprout-cream/45 hover:text-sprout-cream inline-flex items-center gap-1 text-xs">
            Got it <X className="size-3.5" />
          </button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 70}ms` }}
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both rounded-2xl border border-sprout-cream/12 bg-sprout-cream/[0.06] p-5 duration-500"
          >
            <span className="bg-sprout-lime text-sprout-ink grid size-10 place-items-center rounded-xl shadow-sm">
              <s.icon className="size-5" />
            </span>
            <h3 className="text-sprout-cream mt-3 font-bold">{s.title}</h3>
            <p className="text-sprout-cream/65 mt-1 text-sm leading-relaxed">{s.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
