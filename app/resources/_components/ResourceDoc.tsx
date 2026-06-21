// Presentational render of a generated resource. Pure (no state), so it works
// in the client page and is also the print target (wrapped in .print-area).

import { RESOURCE_META } from "@/lib/resources/catalog";
import type { GeneratedResource } from "@/lib/resources/types";

export function ResourceDoc({ resource }: { resource: GeneratedResource }) {
  return (
    <article className="print-area rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <header className="border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-wide text-sprout-forest uppercase">
          <span className="rounded-full bg-sprout-forest/10 px-2 py-0.5">
            {RESOURCE_META[resource.meta.type].label}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{resource.meta.subject}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{resource.meta.ageLabel}</span>
        </div>
        <h1 className="font-display mt-3 text-2xl tracking-tight text-sprout-ink sm:text-3xl">{resource.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{resource.subtitle}</p>
      </header>

      <p className="mt-4 text-[15px] leading-relaxed text-sprout-ink/80">{resource.intro}</p>

      <div className="mt-6 space-y-6">
        {resource.sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-display text-lg text-sprout-forest">{s.heading}</h2>
            <ul className="mt-2 space-y-2.5">
              {s.items.map((item, j) => (
                <li key={j} className="text-[15px] leading-relaxed text-sprout-ink/90">
                  {item}
                </li>
              ))}
            </ul>
            {s.note && <p className="mt-2 text-xs text-muted-foreground italic">{s.note}</p>}
          </section>
        ))}
      </div>

      {resource.answerKey && resource.answerKey.length > 0 && (
        <details className="no-print mt-6 rounded-lg border border-border bg-muted/40 p-3">
          <summary className="cursor-pointer text-sm font-medium text-sprout-forest">
            Answer key (for the grown-up)
          </summary>
          <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-cols-3">
            {resource.answerKey.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </details>
      )}

      <footer className="mt-8 border-t border-border pt-3 text-center text-xs text-muted-foreground">
        Made with Sprout · hisprout.app
      </footer>
    </article>
  );
}
