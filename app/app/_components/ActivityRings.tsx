"use client";

import { useEffect, useState, type ReactNode } from "react";
import { alpha, shade, tint } from "@/lib/sprout/color";

const STROKE = 13;
const GAP = 5;

export interface RingSpec {
  value: number;
  goal: number;
  color: string;
}

/* Concentric progress rings. The craft details that separate this from a
   generic donut chart: tracks are the ring's own color at low alpha (never
   gray), each stroke carries a subtle light-to-deep gradient so the sweep
   reads dimensional, and fills arrive on a long staggered ease-out. */

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
        <defs>
          {rings.map((r, i) => (
            <linearGradient
              key={i}
              id={`ring-grad-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={tint(r.color, 0.22)} />
              <stop offset="60%" stopColor={r.color} />
              <stop offset="100%" stopColor={shade(r.color, 0.12)} />
            </linearGradient>
          ))}
        </defs>
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
                stroke={alpha(r.color, 0.16)}
                strokeWidth={STROKE}
              />
              {pct > 0 && (
                <circle
                  cx={mid}
                  cy={mid}
                  r={radius}
                  fill="none"
                  stroke={`url(#ring-grad-${i})`}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={armed ? circumference * (1 - pct) : circumference}
                  style={{
                    transition: `stroke-dashoffset 1400ms cubic-bezier(0.22, 1, 0.36, 1) ${140 + i * 160}ms`,
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

/* A single small ring wrapped around content, e.g. a kid avatar showing
   their share of the week. */
export function MiniRing({
  pct,
  color,
  size = 44,
  stroke = 3.5,
  children,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
  children: ReactNode;
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
  const radius = mid - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(pct, 0), 1);

  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <circle cx={mid} cy={mid} r={radius} fill="none" stroke={alpha(color, 0.18)} strokeWidth={stroke} />
        {clamped > 0 && (
          <circle
            cx={mid}
            cy={mid}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={armed ? circumference * (1 - clamped) : circumference}
            style={{
              transition: "stroke-dashoffset 1100ms cubic-bezier(0.22, 1, 0.36, 1) 300ms",
            }}
          />
        )}
      </svg>
      {children}
    </div>
  );
}
