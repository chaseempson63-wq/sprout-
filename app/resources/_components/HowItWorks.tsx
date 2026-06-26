// "How it works" — each step on its own card so it reads as a distinct beat,
// not floating text on the canvas. Presentational only.

import type { ComponentType } from "react";

export type HowStep = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
};

export function HowItWorks({ steps, className = "" }: { steps: HowStep[]; className?: string }) {
  return (
    <section className={className}>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {steps.map((s, i) => (
          <div key={i} className="border-sprout-cream/12 bg-sprout-cream/[0.06] rounded-2xl border p-5 backdrop-blur-sm sm:p-6">
            <span className="bg-sprout-lime/15 text-sprout-lime grid size-11 place-items-center rounded-2xl">
              <s.icon className="size-6" />
            </span>
            <h3 className="text-sprout-cream mt-4 font-bold">{s.title}</h3>
            <p className="text-sprout-cream/60 mt-1.5 text-sm leading-relaxed">{s.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
