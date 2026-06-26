// Small custom line-icons drawn for Sprout, so the "how it works" row doesn't
// lean on the same stock icon set every other site uses. Stroke = currentColor.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Pick or describe — a prompt bubble with two lines of writing.
export function DescribeIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M4 5.5h16v9H9.5L5.5 18v-3.5H4z" />
      <path d="M8 9h8M8 11.8h5" />
    </svg>
  );
}

// Make it theirs — a little sprout, on brand: grow it for them.
export function SproutStepIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M12 21v-8" />
      <path d="M12 13.5c0-3.2-2.4-5.3-6-5.3 0 3.2 2.4 5.3 6 5.3z" />
      <path d="M12 11.5c0-3.2 2.4-5.3 6-5.3 0 3.2-2.4 5.3-6 5.3z" />
    </svg>
  );
}

// Print or share — a sheet with an outward arrow.
export function ShareSheetIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden>
      <path d="M13 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <path d="M15.5 3.5l4 4-4 4" />
      <path d="M19.5 7.5H12" />
    </svg>
  );
}
