import * as React from 'react';
import { CanvasWaves, CanvasOrbs } from './_brand';

export interface GradientCanvasProps {
  /** Content laid over the canvas. Cream text by default. */
  children?: React.ReactNode;
  /** Show the three organic wave bands at the base. Default true. */
  waves?: boolean;
  /** Show the two soft blurred accent orbs. Default true. */
  orbs?: boolean;
  /** Sets `container-type: inline-size` so children can scale in `cqw`. Default true. */
  contained?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The continuous forest-green canvas every Sprout marketing image sits on.
 * One fixed gradient (`#2A5132 → #3D6643 → #1B3722`) plus a faint fractal-noise
 * overlay, with optional wave bands and blurred sage orbs, the exact surface
 * from the landing page (hisprout.app). Wrap any composition in this to put it
 * on-brand; text inside inherits Sprout Cream.
 */
export function GradientCanvas({
  children,
  waves = true,
  orbs = true,
  contained = true,
  className,
  style,
}: GradientCanvasProps) {
  return (
    <div
      className={['sprout-canvas', className].filter(Boolean).join(' ')}
      style={{ containerType: contained ? 'inline-size' : undefined, ...style }}
    >
      <div className="sprout-canvas__noise" />
      {orbs && <CanvasOrbs />}
      {waves && <CanvasWaves />}
      <div className="sprout-canvas__content">{children}</div>
    </div>
  );
}
