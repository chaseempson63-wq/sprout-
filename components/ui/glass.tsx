"use client";

// Liquid-glass surface, built from the provided GlassEffect foundation.
// One look for every interactive control: a frosted white pane (backdrop blur +
// white tint + inset highlight) over a soft drop shadow, with the shared
// #glass-distortion SVG filter. Render <GlassFilter /> once per page.

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const GLASS_SHADOW = "0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)";
const GLASS_EASE = "cubic-bezier(0.175,0.885,0.32,2.2)";

// The three stacked glass layers, sized to the host's radius.
function GlassLayers({ radius }: { radius: string }) {
  return (
    <>
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-0", radius)}
        style={{
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-10", radius)}
        style={{ background: "rgba(255, 255, 255, 0.25)" }}
      />
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-20", radius)}
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
        }}
      />
    </>
  );
}

const base =
  "relative inline-flex items-center justify-center overflow-hidden cursor-pointer font-semibold text-[#10301a] transition-transform duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { radius?: string };

export function GlassButton({ className, children, radius = "rounded-full", style, ...props }: GlassButtonProps) {
  return (
    <button className={cn(base, radius, className)} style={{ boxShadow: GLASS_SHADOW, transitionTimingFunction: GLASS_EASE, ...style }} {...props}>
      <GlassLayers radius={radius} />
      <span className="relative z-30 inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}

type GlassLinkProps = React.ComponentProps<typeof Link> & { radius?: string };

export function GlassLink({ className, children, radius = "rounded-full", style, ...props }: GlassLinkProps) {
  return (
    <Link className={cn(base, radius, className)} style={{ boxShadow: GLASS_SHADOW, transitionTimingFunction: GLASS_EASE, ...style }} {...props}>
      <GlassLayers radius={radius} />
      <span className="relative z-30 inline-flex items-center justify-center gap-2">{children}</span>
    </Link>
  );
}

type GlassPanelProps = React.HTMLAttributes<HTMLDivElement> & { radius?: string };

// Non-button glass container (search bar, chat panel) so inputs stay interactive.
export function GlassPanel({ className, children, radius = "rounded-3xl", style, ...props }: GlassPanelProps) {
  return (
    <div className={cn("relative overflow-hidden", radius, className)} style={{ boxShadow: GLASS_SHADOW, ...style }} {...props}>
      <GlassLayers radius={radius} />
      <div className="relative z-30 h-full">{children}</div>
    </div>
  );
}

// The shared distortion filter. Render ONCE per page (e.g. in the layout).
export function GlassFilter() {
  return (
    <svg style={{ display: "none" }} aria-hidden>
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
        <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
