import { SproutMascotIcon } from "../../_components/SproutMascotIcon";

// The cross-product loop: every worksheet quietly points back to the Sprout
// app. Print it, the kid does it, you snap a photo into the app and the work
// lands in their week. Screen-only (no-print) so the printout stays clean.
export function DocumentNudge() {
  return (
    <div className="no-print border-sprout-lime/30 text-sprout-cream mt-6 flex items-center gap-3 rounded-2xl border bg-gradient-to-br from-[#2E5A35] to-[#16331E] px-4 py-3.5 shadow-[0_18px_40px_-18px_rgba(15,32,20,0.9)] sm:gap-4 sm:px-5 sm:py-4">
      <span className="bg-sprout-cream/95 grid size-10 shrink-0 place-items-center rounded-xl shadow-sm sm:size-12">
        <SproutMascotIcon className="size-6 sm:size-7" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold sm:text-base">Snap it into the Sprout app when they&apos;re done.</p>
        <p className="text-sprout-cream/70 mt-0.5 text-xs leading-relaxed sm:text-sm">
          A few seconds, and the work lands in their week. That&apos;s how you watch it all add up.
        </p>
      </div>
    </div>
  );
}
