"use client";

// The waitlist as a pop-up, so joining from the Resources library never
// navigates away from the page. Wraps the existing <Waitlist/> card (same
// Supabase backend) in a forest-green panel so its cream-on-dark styling
// reads right over the paper-and-desk library.

import { useEffect } from "react";
import { X } from "lucide-react";
import { Waitlist } from "../../_components/Waitlist";

export function WaitlistModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto bg-[#0F1A12]/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Join the waitlist"
    >
      <div
        className="animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-[#2E5A35] to-[#16331E] p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] duration-300 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-sprout-cream/60 hover:text-sprout-cream absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          <X className="size-4" />
        </button>
        <Waitlist compact />
      </div>
    </div>
  );
}
