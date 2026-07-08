import * as React from 'react';
import { GradientCanvas, CtaButton } from 'sprout-brand-kit';

/** Cream pill, forest text (the premium default) and the frosted glass variant. */
export function Variants() {
  return (
    <div style={{ width: 460, height: 220 }}>
      <GradientCanvas style={{ height: '100%' }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', justifyContent: 'center' }}>
          <CtaButton>Save my spot</CtaButton>
          <CtaButton variant="glass">See how it works</CtaButton>
        </div>
      </GradientCanvas>
    </div>
  );
}

/** The three sizes, cream variant. */
export function Sizes() {
  return (
    <div style={{ width: 460, height: 220 }}>
      <GradientCanvas style={{ height: '100%' }}>
        <div style={{ height: '100%', display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
          <CtaButton size="sm">Small</CtaButton>
          <CtaButton size="md">Medium</CtaButton>
          <CtaButton size="lg">Large</CtaButton>
        </div>
      </GradientCanvas>
    </div>
  );
}
