import * as React from 'react';
import { GradientCanvas } from 'sprout-brand-kit';

/** The full canvas, gradient, noise, waves and orbs, with a headline over it. */
export function Default() {
  return (
    <div style={{ width: 460, height: 300 }}>
      <GradientCanvas style={{ height: '100%', borderRadius: 20 }}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: '9cqw' }}>
          <h2 className="sprout-display" style={{ fontSize: '11cqw', maxWidth: '80%' }}>Prove the week counted</h2>
        </div>
      </GradientCanvas>
    </div>
  );
}

/** Waves and orbs off, the plain gradient surface for busier compositions. */
export function Minimal() {
  return (
    <div style={{ width: 460, height: 300 }}>
      <GradientCanvas waves={false} orbs={false} style={{ height: '100%', borderRadius: 20 }}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', padding: '9cqw' }}>
          <p className="sprout-body" style={{ fontSize: '5cqw', color: 'rgba(253,253,253,0.85)' }}>Plain forest-green gradient, no waves, no orbs.</p>
        </div>
      </GradientCanvas>
    </div>
  );
}
