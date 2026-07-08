// Internal brand primitives shared across templates. NOT exported from the
// package barrel, so they never register as their own design-system cards.
import * as React from 'react';

/** The Sprout leaf mark (two leaves on a stem). Inherits `currentColor`. */
export function SproutMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path d="M12 22V13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 13.5C12 9.5 14.5 6 19 6C19 10 16.5 13.5 12 13.5Z" fill="currentColor" />
      <path d="M12 13.5C12 9.5 9.5 6 5 6C5 10 7.5 13.5 12 13.5Z" fill="currentColor" />
    </svg>
  );
}

/** "🌱 Sprout" wordmark lockup used in the corner of poster templates. */
export function Wordmark({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--sprout-cream)', ...style }}>
      <SproutMark style={{ width: '1em', height: '1em' }} />
      <span>Sprout</span>
    </div>
  );
}

/** The three organic wave bands from the landing hero (verbatim paths). */
export function CanvasWaves() {
  return (
    <svg className="sprout-canvas__waves" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,400 C320,280 480,520 720,420 C960,320 1120,560 1440,440 L1440,900 L0,900 Z" fill="#76A77A" opacity="0.15" />
      <path d="M0,560 C240,460 560,640 880,540 C1120,460 1280,620 1440,560 L1440,900 L0,900 Z" fill="#4D7B53" opacity="0.4" />
      <path d="M0,700 C320,620 720,800 1100,720 C1300,680 1380,740 1440,720 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.7" />
    </svg>
  );
}

/** Two soft blurred accent orbs (sage-green), scaled to the canvas width. */
export function CanvasOrbs() {
  return (
    <>
      <div className="sprout-canvas__orb" style={{ top: '12%', right: '-10%', width: '55cqw', height: '55cqw', background: 'rgba(148,188,142,0.15)' }} />
      <div className="sprout-canvas__orb" style={{ bottom: '14%', left: '-12%', width: '44cqw', height: '44cqw', background: 'rgba(118,167,122,0.10)' }} />
    </>
  );
}
