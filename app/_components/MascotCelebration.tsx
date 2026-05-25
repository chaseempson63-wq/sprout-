"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────
   MascotCelebration — fires when someone submits the waitlist email.

   Polished version of the Sprout mascot (gradients, leaf highlights,
   eye-shade, filtered drop shadow) that hops on the Y-axis, double-
   spins, and throws off a ring of green sparkles around the peak.

   The animation runs once per mount. Re-mount via `playKey` to replay.
   Keyframes live in globals.css under the mascot-celebrate family.
   ───────────────────────────────────────────────────────────────────── */

const PALETTE = {
  base: "#5fa53a",
  dark: "#3a7222",
  light: "#86c75c",
  deep: "#2b561a",
  sparkle: "#3a7222",
};

/* Eight sparkles around the mascot's peak. tx/ty in pixels relative to
   the centre of the celebration container. Scaled for the ~140px size
   the celebration is rendered at inside the waitlist card. */
const SPARKLE_POINTS: { tx: number; ty: number; d: number; s: number }[] = [
  { tx: -70, ty: -60, d: 0.00, s: 1.1 },
  { tx: 75, ty: -65, d: 0.06, s: 1.0 },
  { tx: -85, ty: -10, d: 0.12, s: 0.85 },
  { tx: 80, ty: 0, d: 0.18, s: 0.95 },
  { tx: -45, ty: -90, d: 0.04, s: 0.8 },
  { tx: 55, ty: -95, d: 0.10, s: 0.9 },
  { tx: -20, ty: -100, d: 0.14, s: 0.7 },
  { tx: 30, ty: -100, d: 0.20, s: 0.75 },
];

const SPARKLE_PATH =
  "M12 1 L13.6 9.4 L22 12 L13.6 14.6 L12 23 L10.4 14.6 L2 12 L10.4 9.4 Z";

export function MascotCelebration({ size = 140 }: { size?: number }) {
  // Single-shot: re-mount via the key changes when someone resubmits in
  // the same session (shouldn't happen often given the form locks after
  // success, but the pattern is here if needed).
  const [playKey] = useState(0);

  // Force the animation to run on mount. The `key` on the hop div is what
  // triggers the keyframes; setting state on mount just exists as a hook
  // point if we later want manual re-triggering.
  useEffect(() => {
    /* no-op; mount triggers via key */
  }, []);

  return (
    <div
      className="relative grid place-items-center"
      style={{
        width: size,
        height: size,
        perspective: "650px",
        perspectiveOrigin: "50% 45%",
      }}
    >
      {/* Sparkles overlay — ring of 8 stars flying outward from centre. */}
      <div
        key={`sparkles-${playKey}`}
        className="absolute inset-0 grid place-items-center pointer-events-none animate-mascot-sparkle-hold"
      >
        {SPARKLE_POINTS.map((p, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute animate-mascot-sparkle-pop"
            style={{
              ["--tx" as string]: `${p.tx}px`,
              ["--ty" as string]: `${p.ty}px`,
              animationDelay: `${p.d}s`,
              width: `${14 * p.s}px`,
              height: `${14 * p.s}px`,
              color: PALETTE.sparkle,
            }}
          >
            <path d={SPARKLE_PATH} fill="currentColor" />
          </svg>
        ))}
      </div>

      {/* Mascot wrapper — handles jump + Y-spin via animate-mascot-celebrate. */}
      <div
        key={`hop-${playKey}`}
        className="grid place-items-center animate-mascot-celebrate"
        style={{
          width: "82%",
          height: "82%",
          transformStyle: "preserve-3d",
        }}
      >
        <SproutMascotPolished />
      </div>
    </div>
  );
}

/* The polished mascot SVG. Gradients on stem + leaves, leaf shadow filter,
   eye highlights + shade. transform-origin at the base so the spin and
   squash pivot around the foot, not the centre. */
function SproutMascotPolished() {
  const { base, dark, light, deep } = PALETTE;

  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sprout mascot celebrating"
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
        transformOrigin: "50% 90%",
      }}
    >
      <defs>
        <linearGradient id="celStemBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <linearGradient id="celStemSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="celLeafLeft"
          x1="180"
          y1="100"
          x2="320"
          y2="270"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={light} />
          <stop offset="50%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <radialGradient
          id="celLeafLeftHL"
          cx="225"
          cy="135"
          r="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="celLeafRight"
          x1="420"
          y1="100"
          x2="280"
          y2="270"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={light} />
          <stop offset="50%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <radialGradient
          id="celLeafRightHL"
          cx="375"
          cy="135"
          r="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="celEyeShade" cx="0.5" cy="0.55" r="0.5">
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor={deep} stopOpacity="0.3" />
        </radialGradient>
        <filter
          id="celLeafShadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="5" result="b" />
          <feComponentTransfer in="b" result="b2">
            <feFuncA type="linear" slope="0.25" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* STEM */}
      <g>
        <path
          d="M 282 540 C 274 540, 268 534, 268 525 L 268 290 C 268 270, 282 258, 300 258 C 318 258, 332 270, 332 290 L 332 525 C 332 534, 326 540, 318 540 Z"
          fill="url(#celStemBody)"
        />
        <path
          d="M 278 295 C 278 278, 287 268, 296 266 L 296 532 C 287 532, 278 524, 278 514 Z"
          fill="url(#celStemSheen)"
        />
        <path
          d="M 322 296 L 322 520 C 322 530, 316 536, 310 537 L 310 268 C 316 272, 322 284, 322 296 Z"
          fill={deep}
          opacity="0.18"
        />
      </g>

      {/* LEAVES */}
      <g>
        <g filter="url(#celLeafShadow)">
          <path
            d="M 300 270 C 200 260, 145 200, 152 110 C 158 95, 175 92, 200 105 C 260 138, 300 200, 300 270 Z"
            fill="url(#celLeafLeft)"
          />
          <path
            d="M 300 270 C 200 260, 145 200, 152 110 C 158 95, 175 92, 200 105 C 260 138, 300 200, 300 270 Z"
            fill="url(#celLeafLeftHL)"
          />
          <path
            d="M 300 268 C 240 240, 190 195, 158 118"
            stroke={deep}
            strokeOpacity="0.28"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <g filter="url(#celLeafShadow)">
          <path
            d="M 300 270 C 400 260, 455 200, 448 110 C 442 95, 425 92, 400 105 C 340 138, 300 200, 300 270 Z"
            fill="url(#celLeafRight)"
          />
          <path
            d="M 300 270 C 400 260, 455 200, 448 110 C 442 95, 425 92, 400 105 C 340 138, 300 200, 300 270 Z"
            fill="url(#celLeafRightHL)"
          />
          <path
            d="M 300 268 C 360 240, 410 195, 442 118"
            stroke={deep}
            strokeOpacity="0.28"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>

      {/* FACE */}
      <g>
        <ellipse cx="287" cy="370" rx="13" ry="16" fill="#13260e" />
        <ellipse cx="318" cy="370" rx="13" ry="16" fill="#13260e" />
        <ellipse cx="291" cy="362" rx="4" ry="5" fill="#ffffff" />
        <ellipse cx="322" cy="362" rx="4" ry="5" fill="#ffffff" />
        <circle cx="283.5" cy="375" r="1.7" fill="#ffffff" opacity="0.9" />
        <circle cx="314.5" cy="375" r="1.7" fill="#ffffff" opacity="0.9" />
        <ellipse
          cx="287"
          cy="370"
          rx="14.5"
          ry="17.5"
          fill="url(#celEyeShade)"
          opacity="0.55"
        />
        <ellipse
          cx="318"
          cy="370"
          rx="14.5"
          ry="17.5"
          fill="url(#celEyeShade)"
          opacity="0.55"
        />
        <path
          d="M 295 414 Q 302.5 421 310 414"
          stroke="#13260e"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
