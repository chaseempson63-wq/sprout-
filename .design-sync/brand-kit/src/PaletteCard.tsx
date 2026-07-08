import * as React from 'react';
import { GradientCanvas } from './GradientCanvas';
import { GlassCard } from './GlassCard';

export interface PaletteCardProps {
  /** Heading above the swatch grid. Default "Sprout palette". */
  title?: string;
  /** Aspect ratio of the card. Default "4 / 5". */
  aspectRatio?: string;
}

const SWATCHES: { name: string; hex: string; use: string }[] = [
  { name: 'Forest', hex: '#1F4D2E', use: 'Primary brand · headings' },
  { name: 'Deep',   hex: '#0F2614', use: 'Deepest green · footers' },
  { name: 'Mid',    hex: '#3A5F3F', use: 'Mid-tone gradients' },
  { name: 'Sage',   hex: '#A4C9A8', use: 'Soft accents · a whisper' },
  { name: 'Cream',  hex: '#FDFDFD', use: 'Text on green · CTAs' },
  { name: 'Ink',    hex: '#0F1311', use: 'Text on light surfaces' },
];

/**
 * The locked Sprout colour palette as a browsable specimen card, six named
 * swatches with hex codes and usage, on the brand canvas. Documentation, not a
 * layout primitive: use it to keep the palette in front of the design agent.
 */
export function PaletteCard({ title = 'Sprout palette', aspectRatio = '4 / 5' }: PaletteCardProps) {
  return (
    <div className="sprout-poster" style={{ aspectRatio }}>
      <GradientCanvas contained={false} style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, padding: '7cqw', display: 'flex', flexDirection: 'column', gap: '4cqw' }}>
          <div>
            <p className="sprout-eyebrow" style={{ fontSize: '2.6cqw', color: 'var(--sprout-sage)', marginBottom: '1.5cqw' }}>Colour · locked</p>
            <h2 className="sprout-display" style={{ fontSize: '7cqw' }}>{title}</h2>
          </div>
          <GlassCard padding="4cqw" radius="4cqw" style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3cqw', height: '100%' }}>
              {SWATCHES.map((s) => (
                <div key={s.name} className="sprout-swatch" style={{ borderRadius: '2.5cqw' }}>
                  <div className="sprout-swatch__chip" style={{ background: s.hex }} />
                  <div className="sprout-swatch__label" style={{ padding: '2cqw 2.4cqw' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1cqw' }}>
                      <span className="sprout-subhead" style={{ fontSize: '3cqw' }}>{s.name}</span>
                      <span className="sprout-body" style={{ fontSize: '2.2cqw', color: 'rgba(253,253,253,0.6)' }}>{s.hex}</span>
                    </div>
                    <p className="sprout-body" style={{ fontSize: '2.1cqw', color: 'rgba(253,253,253,0.62)', marginTop: '0.4cqw' }}>{s.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </GradientCanvas>
    </div>
  );
}
