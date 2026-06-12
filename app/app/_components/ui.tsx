import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* Shared surface recipe for the app interior. White card on cream, soft
   diffuse shadow, hairline border. Premium comes from restraint: one card
   style everywhere. */

export const card =
  "rounded-3xl border border-app-pine/[0.07] bg-white " +
  "shadow-[0_1px_2px_rgba(16,40,28,0.03),0_16px_40px_-20px_rgba(16,40,28,0.14)]";

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
