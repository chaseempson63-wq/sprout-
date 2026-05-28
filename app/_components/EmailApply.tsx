"use client";

import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";

/* The copy-paste note a creator sends to apply. Kept deliberately short —
   four questions, no friction. Plain string so apostrophes are fine here. */
const TEMPLATE = `Hi Chase,

I'd love to join the Sprout partner program.

– Who I am:
– Where I post (platform + handle):
– My audience size:
– What got me interested:

Cheers,`;

export function EmailApply({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked — the template is on screen to copy by hand.
    }
  };

  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    "Sprout partner application",
  )}&body=${encodeURIComponent(TEMPLATE)}`;

  return (
    <div className="rounded-3xl bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 p-6 md:p-8">
      <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-4">
        Copy this, fill the gaps, send it
      </div>

      <pre className="whitespace-pre-wrap font-sans text-sprout-cream/90 leading-relaxed text-[15px] md:text-base rounded-2xl bg-[#0F1A12]/40 border border-sprout-cream/10 p-5">{TEMPLATE}</pre>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-sm hover:bg-[#FBF6EB] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sprout-cream/40"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" strokeWidth={2.5} />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" strokeWidth={2.5} />
              Copy the template
            </>
          )}
        </button>

        <a
          href={mailto}
          className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-sprout-cream/10 border border-sprout-cream/20 text-sprout-cream font-semibold text-sm hover:bg-sprout-cream/15 transition-colors"
        >
          <Mail className="w-4 h-4" strokeWidth={2.5} />
          Open in email
        </a>
      </div>

      <p className="mt-4 text-sprout-cream/55 text-xs">
        Or email{" "}
        <a href={`mailto:${email}`} className="underline hover:text-sprout-cream/80">
          {email}
        </a>{" "}
        directly.
      </p>
    </div>
  );
}
