import * as React from 'react';
import { SocialPost } from 'sprout-brand-kit';

/** Square IG-feed post, the default format. */
export function Square() {
  return (
    <div style={{ width: 380 }}>
      <SocialPost
        eyebrow="For homeschool families"
        headline="Prove the week counted"
        body="A weekly reflection of your child's homeschool journey. Sunday-night relief, not 3am anxiety."
        cta="Save my spot"
      />
    </div>
  );
}

/** Portrait 4:5, more vertical room for a longer hook. */
export function Portrait() {
  return (
    <div style={{ width: 340 }}>
      <SocialPost
        format="portrait"
        eyebrow="The wound"
        headline="Am I screwing my kid up?"
        body="You are not. You just can't see the week yet. Sprout makes it visible."
        cta="See how it works"
      />
    </div>
  );
}

/** Centred layout, no CTA, a quieter quote-style post. */
export function Centered() {
  return (
    <div style={{ width: 380 }}>
      <SocialPost
        align="center"
        eyebrow="What they built"
        headline="One private place where the week is visible"
        footnote="hisprout.app"
      />
    </div>
  );
}
