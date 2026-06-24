import { Camera, Image as ImageIcon, FileText, User, Baby } from "lucide-react";

/* The four "how it works" visuals, recreated to match the app onboarding's
   feature walkthrough. Illustrative, not pixel app captures, the copy beside
   them does the explaining. Each is its own little composition. */

export function OnboardingVisual({
  variant,
}: {
  variant: "capture" | "sort" | "report" | "together";
}) {
  return (
    <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#A4C9A8]/25 via-[#94BC8E]/12 to-transparent blur-3xl -z-10" />
      {variant === "capture" && <Capture />}
      {variant === "sort" && <Sort />}
      {variant === "report" && <Report />}
      {variant === "together" && <Together />}
    </div>
  );
}

/* 01 — one captured moment: a photo + a couple of note lines, camera badge. */
function Capture() {
  return (
    <div className="relative">
      <div className="w-60 rounded-3xl bg-sprout-cream/[0.08] backdrop-blur-xl border border-sprout-cream/15 p-5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] -rotate-3">
        <div className="h-40 rounded-2xl bg-gradient-to-b from-[#A4C9A8]/55 to-[#76A77A]/30 flex items-center justify-center mb-4">
          <ImageIcon className="w-12 h-12 text-sprout-cream/85" strokeWidth={1.75} />
        </div>
        <div className="h-2.5 rounded-full bg-sprout-cream/45 w-[82%] mb-2" />
        <div className="h-2.5 rounded-full bg-sprout-cream/25 w-[55%]" />
      </div>
      <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-b from-[#A4C9A8] to-[#76A77A] flex items-center justify-center shadow-[0_10px_24px_-6px_rgba(127,168,107,0.7)] border-2 border-[#1B3722]/15 p-4">
        <Camera className="w-full h-full text-[#1B3722]" strokeWidth={2.25} />
      </div>
    </div>
  );
}

/* 02 — moments sorting into tidy, colour-coded domain rows. */
function Sort() {
  const rows = [
    { c: "#4F86C6", w: "90%" },
    { c: "#3DA59B", w: "58%" },
    { c: "#E0795B", w: "74%" },
  ];
  return (
    <div className="w-72 rounded-3xl bg-sprout-cream/[0.08] backdrop-blur-xl border border-sprout-cream/15 p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] space-y-5">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="w-9 h-9 rounded-full shrink-0" style={{ backgroundColor: r.c }} />
          <span className="h-5 rounded-full" style={{ width: r.w, backgroundColor: r.c, opacity: 0.85 }} />
        </div>
      ))}
    </div>
  );
}

/* 03 — a printable report: cream paper, domain bars, ready for any review. */
function Report() {
  const bars: [string, string][] = [
    ["#D8A23C", "76%"],
    ["#4F86C6", "58%"],
    ["#E0795B", "66%"],
  ];
  return (
    <div className="w-64 rounded-2xl bg-[#F7F2E7] p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] rotate-3 border border-[#1B3722]/10">
      <div className="flex items-center justify-between mb-5">
        <div className="h-3 rounded-full bg-[#CBA85A] w-16" />
        <FileText className="w-5 h-5 text-[#CBA85A]" strokeWidth={2.25} />
      </div>
      {bars.map(([c, w], i) => (
        <div key={i} className="flex items-center gap-2.5 mb-3">
          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c }} />
          <span className="h-2.5 rounded-full" style={{ width: w, backgroundColor: c, opacity: 0.7 }} />
        </div>
      ))}
      <div className="h-2.5 rounded-full bg-[#20271F]/15 w-14 mt-4" />
    </div>
  );
}

/* 04 — for you, and for them: parent + kid, both seeing it. */
function Together() {
  return (
    <div className="flex items-center -space-x-6">
      <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#1F4D2E] to-[#143420] flex items-center justify-center shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] border-2 border-sprout-cream/25 p-7">
        <User className="w-full h-full text-sprout-cream" strokeWidth={1.75} />
      </div>
      <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#A4C9A8] to-[#76A77A] flex items-center justify-center shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] border-2 border-sprout-cream/25 p-7">
        <Baby className="w-full h-full text-[#1B3722]" strokeWidth={1.75} />
      </div>
    </div>
  );
}
