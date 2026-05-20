/* ─────────────────────────────────────────────────────────────────────
   SproutMascotIcon — production port of Sprout Mascot.html
   from the Claude Design bundle (2026-05-20).

   Paths, gradients, and filters copied verbatim from the bundle.
   Render-time tweak values are FROZEN to the bundle's TWEAK_DEFAULTS:

     palette  = ["#5fa53a", "#3a7222", "#86c75c"]   // base, dark, light
     contrast = 0     // collapses light/dark gradient stops to base
     leafSize = 95    // scale around join (300, 270)
     eyeSize  = 109   // rx/ry scale on eye + catchlight + cheek dots
     showFace = true
     float    = N/A — idle motion comes from the parent pill in Mascot.tsx,
                      not from the SVG itself, so it isn't re-implemented here.

   Visible depth comes from the sheen + leaf highlight overlays, which
   use `shade(BASE, ...)`, NOT from the linear gradient stops (which all
   resolve to BASE at contrast=0). The gradient defs are kept anyway —
   they preserve the asset structure if Chase ever wants to dial contrast
   back up at render time.

   Gradient and filter ids are namespaced `sm-*` so they can't collide
   with the existing SproutLogo (Glass.tsx) or any future SVG asset.
   ───────────────────────────────────────────────────────────────────── */

// Frozen palette resolved at TWEAK_DEFAULTS.
const BASE = "#5fa53a";
// shade("#3a7222", -0.25) — used for vein strokes, stem shadow side, eye shade.
const DEEP = "#2b561a";
// shade(BASE, 0.35) — used by stem sheen.
const HIGHLIGHT_STRONG = "#97c47f";
// shade(BASE, 0.25) — used by leaf radial highlights.
const HIGHLIGHT_SOFT = "#87bb6b";

// Eye geometry at eyeSize=109. Original: rx=13, ry=16; catchlight rx=4, ry=5.
const E_RX = 13 * 1.09;     // 14.17
const E_RY = 16 * 1.09;     // 17.44
const C_RX = 4 * 1.09;      //  4.36
const C_RY = 5 * 1.09;      //  5.45
const CATCH_DX = 4 * 1.09;  //  catchlight x-offset from pupil center
const CATCH_DY = 8 * 1.09;  //  catchlight y-offset (subtracted, so it sits high)
const CHEEK_DX = 3.5 * 1.09;//  cheek-dot x-offset (subtracted, so it sits inner)
const CHEEK_DY = 5 * 1.09;  //  cheek-dot y-offset (added, sits low)
const CHEEK_R = 1.7 * 1.09; //  cheek-dot radius

export function SproutMascotIcon({ className = "" }: { className?: string }) {
  return (
    // Tight viewBox below (135 85 330 460): hugs the character (leaves
    // x=145-455, stem to y=540, top of leaves at y=92) with ~10px margin
    // for the leaf drop-shadow halo. Replaces the original 0 0 600 600
    // viewBox so the SVG renders edge-to-edge as the character — no empty
    // padding inside its wrapper.
    <svg
      viewBox="135 85 330 460"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* stem body — flat BASE at contrast=0 */}
        <linearGradient id="sm-stemBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={BASE} />
          <stop offset="45%"  stopColor={BASE} />
          <stop offset="100%" stopColor={BASE} />
        </linearGradient>
        {/* vertical sheen on the stem's left side */}
        <linearGradient id="sm-stemSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={HIGHLIGHT_STRONG} stopOpacity="0.55" />
          <stop offset="60%" stopColor={HIGHLIGHT_STRONG} stopOpacity="0" />
        </linearGradient>

        {/* left leaf — flat at contrast=0 */}
        <linearGradient
          id="sm-leafLeft"
          x1="180" y1="100" x2="320" y2="270"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor={BASE} />
          <stop offset="50%"  stopColor={BASE} />
          <stop offset="100%" stopColor={BASE} />
        </linearGradient>
        <radialGradient
          id="sm-leafLeftHL"
          cx="225" cy="135" r="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor={HIGHLIGHT_SOFT} stopOpacity="0.7" />
          <stop offset="100%" stopColor={HIGHLIGHT_SOFT} stopOpacity="0" />
        </radialGradient>

        {/* right leaf — flat at contrast=0 */}
        <linearGradient
          id="sm-leafRight"
          x1="420" y1="100" x2="280" y2="270"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor={BASE} />
          <stop offset="50%"  stopColor={BASE} />
          <stop offset="100%" stopColor={BASE} />
        </linearGradient>
        <radialGradient
          id="sm-leafRightHL"
          cx="375" cy="135" r="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor={HIGHLIGHT_SOFT} stopOpacity="0.7" />
          <stop offset="100%" stopColor={HIGHLIGHT_SOFT} stopOpacity="0" />
        </radialGradient>

        {/* eye sphere shading */}
        <radialGradient id="sm-eyeShade" cx="0.5" cy="0.55" r="0.5">
          <stop offset="60%"  stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor={DEEP}    stopOpacity="0.30" />
        </radialGradient>

        {/* soft drop-shadow under each leaf */}
        <filter id="sm-leafShadow" x="-30%" y="-30%" width="160%" height="160%">
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

      {/* ── STEM ──────────────────────────────────────────────── */}
      <g>
        <path
          d="M 282 540 C 274 540, 268 534, 268 525 L 268 290 C 268 270, 282 258, 300 258 C 318 258, 332 270, 332 290 L 332 525 C 332 534, 326 540, 318 540 Z"
          fill="url(#sm-stemBody)"
        />
        <path
          d="M 278 295 C 278 278, 287 268, 296 266 L 296 532 C 287 532, 278 524, 278 514 Z"
          fill="url(#sm-stemSheen)"
        />
        <path
          d="M 322 296 L 322 520 C 322 530, 316 536, 310 537 L 310 268 C 316 272, 322 284, 322 296 Z"
          fill={DEEP}
          opacity="0.18"
        />
      </g>

      {/* ── LEAVES — scaled 0.95 around the join (300, 270) ───── */}
      <g transform="translate(300 270) scale(0.95) translate(-300 -270)">
        {/* left leaf */}
        <g filter="url(#sm-leafShadow)">
          <path
            d="M 300 270 C 200 260, 145 200, 152 110 C 158 95, 175 92, 200 105 C 260 138, 300 200, 300 270 Z"
            fill="url(#sm-leafLeft)"
          />
          <path
            d="M 300 270 C 200 260, 145 200, 152 110 C 158 95, 175 92, 200 105 C 260 138, 300 200, 300 270 Z"
            fill="url(#sm-leafLeftHL)"
          />
          <path
            d="M 300 268 C 240 240, 190 195, 158 118"
            stroke={DEEP}
            strokeOpacity="0.28"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* right leaf */}
        <g filter="url(#sm-leafShadow)">
          <path
            d="M 300 270 C 400 260, 455 200, 448 110 C 442 95, 425 92, 400 105 C 340 138, 300 200, 300 270 Z"
            fill="url(#sm-leafRight)"
          />
          <path
            d="M 300 270 C 400 260, 455 200, 448 110 C 442 95, 425 92, 400 105 C 340 138, 300 200, 300 270 Z"
            fill="url(#sm-leafRightHL)"
          />
          <path
            d="M 300 268 C 360 240, 410 195, 442 118"
            stroke={DEEP}
            strokeOpacity="0.28"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>

      {/* ── FACE — eyeSize=109 ────────────────────────────────── */}
      <g>
        {/* pupils */}
        <ellipse cx={287} cy={370} rx={E_RX} ry={E_RY} fill="#13260e" />
        <ellipse cx={318} cy={370} rx={E_RX} ry={E_RY} fill="#13260e" />
        {/* catchlights (upper-outer) */}
        <ellipse cx={287 + CATCH_DX} cy={370 - CATCH_DY} rx={C_RX} ry={C_RY} fill="#ffffff" />
        <ellipse cx={318 + CATCH_DX} cy={370 - CATCH_DY} rx={C_RX} ry={C_RY} fill="#ffffff" />
        {/* lower-inner cheek dots */}
        <circle cx={287 - CHEEK_DX} cy={370 + CHEEK_DY} r={CHEEK_R} fill="#ffffff" opacity="0.9" />
        <circle cx={318 - CHEEK_DX} cy={370 + CHEEK_DY} r={CHEEK_R} fill="#ffffff" opacity="0.9" />
        {/* eye sphere shading */}
        <ellipse cx={287} cy={370} rx={E_RX + 1.5} ry={E_RY + 1.5} fill="url(#sm-eyeShade)" opacity="0.55" />
        <ellipse cx={318} cy={370} rx={E_RX + 1.5} ry={E_RY + 1.5} fill="url(#sm-eyeShade)" opacity="0.55" />
        {/* mouth */}
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
