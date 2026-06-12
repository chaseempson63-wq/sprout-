import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* Shared surface recipe for the app interior. White card on cream, soft
   diffuse shadow, hairline border. Premium comes from restraint: one card
   style everywhere. */

export const card =
  "rounded-3xl border border-app-pine/[0.06] bg-white " +
  "shadow-[0_1px_1px_rgba(16,40,28,0.03),0_2px_6px_-2px_rgba(16,40,28,0.05),0_24px_48px_-24px_rgba(16,40,28,0.16)]";

export function Overline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.14em] text-app-pine/45",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-[19px] font-bold tracking-tight text-app-forest",
        className,
      )}
    >
      {children}
    </h2>
  );
}
