"use client";

import { useEffect, useState, type ReactNode } from "react";

const STROKE = 13;
const GAP = 5;

export interface RingSpec {
  value: number;
  goal: number;
  color: string;
}

/* Concentric progress rings, fitness-app style. Outer ring is the hero
   metric. Fills sweep in on mount with a slight stagger; respects
   prefers-reduced-motion by snapping straight to the final state. */

export function ActivityRings({
  rings,
  size = 168,
  center,
}: {
  rings: RingSpec[];
  size?: number;
  center?: ReactNode;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setArmed(true);
      return;
    }
    const raf = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const mid = size / 2;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {rings.map((r, i) => {
          const radius = mid - STROKE / 2 - i * (STROKE + GAP);
          const circumference = 2 * Math.PI * radius;
          const pct = r.goal > 0 ? Math.min(r.value / r.goal, 1) : 0;
          return (
            <g key={i}>
              <circle
                cx={mid}
                cy={mid}
                r={radius}
                fill="none"
                stroke="#142e22"
                strokeOpacity={0.07}
                strokeWidth={STROKE}
              />
              {pct > 0 && (
                <circle
                  cx={mid}
                  cy={mid}
                  r={radius}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={armed ? circumference * (1 - pct) : circumference}
                  style={{
                    transition: `stroke-dashoffset 1100ms cubic-bezier(0.25, 1, 0.35, 1) ${i * 140}ms`,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>
      {center && (
        <div className="absolute inset-0 grid place-items-center">{center}</div>
      )}
    </div>
  );
}
