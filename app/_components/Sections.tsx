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

// Real + audience-voiced homeschool-parent lines. Name only, no attribution.
// Fed into the looping TestimonialRail below.
const TESTIMONIALS: { name: string; quote: string }[] = [
  { name: "Charlene", quote: "I envision all the other parents judging me and thinking I'm a horrible teacher who is failing my kids. When I hear my daughter stumble over words I was reading at her age, I worry." },
  { name: "Jenna", quote: "Today was shit." },
  { name: "Sara", quote: "I'm having the time of my life. Thank God I chose this." },
  { name: "Mara", quote: "some days I have no idea if any of it is sticking. then she reads a whole sign out loud and I nearly cry." },
  { name: "Priya", quote: "three notebooks, a notes app, and my memory. my memory is cooked." },
  { name: "Danielle", quote: "everyone asks how homeschool is going and I never know what to say. we did heaps, I just can't prove it." },
  { name: "Renee", quote: "the review is in six weeks and I have nothing written down. classic me." },
  { name: "Grace", quote: "he taught himself more about sharks in a week than I learned in a year of school." },
  { name: "Tarah", quote: "I quit my job for this. some nights I lie awake wondering if I ruined everything." },
  { name: "Karen", quote: "hardest thing I've ever done. also the best. both at once, every day." },
];

// A horizontal rail of parent quotes that auto-scrolls and loops. Two identical
// sets in one track; the CSS animation translates -50% for a seamless loop (see
// .animate-marquee in globals.css). Pauses on hover, still on reduced motion.
export function TestimonialRail() {
  return (
    <div className="relative overflow-hidden" aria-label="What homeschool parents say">
      <div className="animate-marquee flex w-max">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <div key={i} className="mr-5 w-[280px] shrink-0 md:w-[360px]" aria-hidden={i >= TESTIMONIALS.length}>
            <VerbatimCard name={t.name} quote={t.quote} />
          </div>
        ))}
      </div>
    </div>
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
