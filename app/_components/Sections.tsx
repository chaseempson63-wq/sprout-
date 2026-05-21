import type { ReactNode } from "react";
import { GlassCard } from "./Glass";

export function SectionEyebrow({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="block w-12 h-px bg-sprout-cream/40" />
      <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">
        {number} · {label}
      </span>
    </div>
  );
}

export function CenteredEyebrow({ number, label }: { number: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-3 mb-8">
      <span className="block w-8 h-px bg-sprout-cream/40" />
      <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">
        {number} · {label}
      </span>
      <span className="block w-8 h-px bg-sprout-cream/40" />
    </div>
  );
}

export function FeatureBlock({
  index,
  eyebrow,
  title,
  body,
  visual,
  reverse = false,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
      <div className={`md:col-span-6 ${reverse ? "md:order-2" : ""}`}>
        <div className="flex items-center gap-3 mb-6">
          <span className="block w-8 h-px bg-sprout-cream/40" />
          <span className="text-sprout-cream/55 text-[10px] uppercase tracking-[0.3em] font-bold">
            {index} · {eyebrow}
          </span>
        </div>
        <h3
          className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream mb-8 headline-lit"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
        >
          {title}
        </h3>
        <div
          className="text-sprout-cream/80 leading-relaxed"
          style={{ fontSize: "clamp(16px, 1.4vw, 18px)" }}
        >
          {body}
        </div>
      </div>
      <div className={`md:col-span-6 flex justify-center ${reverse ? "md:justify-start md:order-1" : "md:justify-end"}`}>
        {visual}
      </div>
    </div>
  );
}

export function VerbatimCard({
  quote,
  name,
  location,
}: {
  quote: string;
  name: string;
  location?: string;
}) {
  return (
    <GlassCard className="p-6 md:p-7 rounded-3xl h-full" glow="warm" soft>
      <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-4">
        ✱ {name}
      </div>
      <p
        className="text-sprout-cream leading-relaxed italic"
        style={{ fontSize: "clamp(14px, 1.2vw, 16px)" }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      {location && (
        <div className="mt-6 text-[10px] text-sprout-cream/65 uppercase tracking-[0.25em]">
          {location}
        </div>
      )}
    </GlassCard>
  );
}

export function StatTile({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <GlassCard className="p-6 md:p-8 rounded-2xl" glow="lime" soft>
      <div
        className="font-bold tracking-[-0.02em] leading-none text-sprout-cream headline-lit mb-3"
        style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
      >
        {value}
      </div>
      <div className="text-sprout-cream/70 text-[11px] uppercase tracking-[0.25em] font-bold leading-snug">
        {label}
      </div>
    </GlassCard>
  );
}
