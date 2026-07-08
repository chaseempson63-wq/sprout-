import * as React from 'react';
import { GradientCanvas } from './GradientCanvas';
import { GlassCard } from './GlassCard';

export interface TypographyCardProps {
  /** Heading above the specimen. Default "Sprout type". */
  title?: string;
  /** Aspect ratio of the card. Default "4 / 5". */
  aspectRatio?: string;
}

const TIERS: { label: string; weight: number; sample: string; size: string; track?: string }[] = [
  { label: 'Display · 800 · -0.02em', weight: 800, sample: 'Prove the week counted', size: '8.5cqw', track: '-0.02em' },
  { label: 'Subhead · 700', weight: 700, sample: 'One private place where the week is visible', size: '4.4cqw' },
  { label: 'Body · 400', weight: 400, sample: 'A weekly reflection of your child’s homeschool journey. Sunday-night relief, not 3am anxiety.', size: '3.2cqw' },
];

/**
 * The Sprout type system as a specimen card: one warm rounded family (Nunito),
 * hierarchy carried by weight and size, 800 Extra Bold display, 700 subhead,
 * 400 body. No second typeface, no serifs. Documentation for the design agent.
 */
export function TypographyCard({ title = 'Sprout type', aspectRatio = '4 / 5' }: TypographyCardProps) {
  return (
    <div className="sprout-poster" style={{ aspectRatio }}>
      <GradientCanvas contained={false} style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, padding: '7cqw', display: 'flex', flexDirection: 'column', gap: '4cqw' }}>
          <div>
            <p className="sprout-eyebrow" style={{ fontSize: '2.6cqw', color: 'var(--sprout-sage)', marginBottom: '1.5cqw' }}>Type · Nunito</p>
            <h2 className="sprout-display" style={{ fontSize: '7cqw' }}>{title}</h2>
          </div>
          <GlassCard padding="5cqw" radius="4cqw" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {TIERS.map((t) => (
              <div key={t.label}>
                <p className="sprout-eyebrow" style={{ fontSize: '2.1cqw', color: 'var(--sprout-sage)', marginBottom: '1.4cqw', letterSpacing: '0.1em' }}>{t.label}</p>
                <p style={{ fontWeight: t.weight, fontSize: t.size, letterSpacing: t.track ?? '-0.01em', lineHeight: 1.05, margin: 0, color: 'var(--sprout-cream)' }}>{t.sample}</p>
              </div>
            ))}
          </GlassCard>
        </div>
      </GradientCanvas>
    </div>
  );
}
