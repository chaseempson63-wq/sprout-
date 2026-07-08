import * as React from 'react';

export interface GlassCardProps {
  children?: React.ReactNode;
  /** Lighter tint + border (cream at ~7% instead of ~10%). Default false. */
  soft?: boolean;
  /** Inner padding (any CSS length). Default `1.5rem`. */
  padding?: string;
  /** Corner radius (any CSS length). Default `24px`. */
  radius?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A frosted cream glass card that floats on the green canvas: cream at 8–15%
 * opacity, heavy backdrop blur, a hairline cream border, and the layered inset
 * highlight + drop shadow from the landing page. Cream text inside, high
 * contrast. Only reads correctly over the GradientCanvas (or any dark green).
 */
export function GlassCard({
  children,
  soft = false,
  padding = '1.5rem',
  radius = '24px',
  className,
  style,
}: GlassCardProps) {
  return (
    <div
      className={['sprout-glass', soft && 'sprout-glass--soft', className].filter(Boolean).join(' ')}
      style={{ padding, borderRadius: radius, ...style }}
    >
      {children}
    </div>
  );
}
