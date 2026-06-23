// A quiet, minimal "how it works" row: a small icon, a short title, one line.
// Deliberately NOT a frosted feature-card grid — just calm wayfinding with lots
// of air around it. Presentational only.

import type { ComponentType } from "react";

export type HowStep = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
};

export function HowItWorks({ steps, className = "" }: { steps: HowStep[]; className?: string }) {
  return (
    <section className={className}>
      <div className="grid gap-8 sm:grid-cols-3 sm:gap-12">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3.5">
            <span className="bg-sprout-lime/15 text-sprout-lime grid size-10 shrink-0 place-items-center rounded-full">
              <s.icon className="size-5" />
            </span>
            <div className="pt-0.5">
              <h3 className="text-sprout-cream font-semibold">{s.title}</h3>
              <p className="text-sprout-cream/55 mt-1 text-sm leading-relaxed">{s.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
