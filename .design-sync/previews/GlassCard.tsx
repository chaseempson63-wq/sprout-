import * as React from 'react';
import { GradientCanvas, GlassCard } from 'sprout-brand-kit';

/** Standard frosted cream glass card, floating on the green canvas. */
export function Default() {
  return (
    <div style={{ width: 460, height: 300 }}>
      <GradientCanvas style={{ height: '100%' }}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <GlassCard padding="24px" style={{ maxWidth: 320 }}>
            <p className="sprout-eyebrow" style={{ fontSize: 12, color: 'var(--sprout-sage)', marginBottom: 10 }}>This week</p>
            <p className="sprout-subhead" style={{ fontSize: 22, marginBottom: 8 }}>14 moments logged</p>
            <p className="sprout-body" style={{ fontSize: 15, color: 'rgba(253,253,253,0.8)' }}>Voice memos, photos, and a maths worksheet. All in one place.</p>
          </GlassCard>
        </div>
      </GradientCanvas>
    </div>
  );
}

/** The lighter `soft` tint, for secondary surfaces or dense stacks of cards. */
export function Soft() {
  return (
    <div style={{ width: 460, height: 300 }}>
      <GradientCanvas style={{ height: '100%' }}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <GlassCard soft padding="24px" style={{ maxWidth: 320 }}>
            <p className="sprout-subhead" style={{ fontSize: 20, marginBottom: 8 }}>Soft glass</p>
            <p className="sprout-body" style={{ fontSize: 15, color: 'rgba(253,253,253,0.8)' }}>Cream at ~7% with a fainter border. Use when cards stack.</p>
          </GlassCard>
        </div>
      </GradientCanvas>
    </div>
  );
}
