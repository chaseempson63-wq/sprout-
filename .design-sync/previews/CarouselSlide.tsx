import * as React from 'react';
import { CarouselSlide } from 'sprout-brand-kit';

/** Opening cover slide, big centred hook. */
export function Cover() {
  return (
    <div style={{ width: 340 }}>
      <CarouselSlide
        variant="cover"
        kicker="A thread for homeschool mums"
        headline="The Sunday-night spiral"
        index={1}
        total={5}
      />
    </div>
  );
}

/** A middle beat in the story arc. */
export function Point() {
  return (
    <div style={{ width: 340 }}>
      <CarouselSlide
        kicker="Sound familiar?"
        headline="Your system is a notes app and your memory"
        body="Three half-filled exercise books. A camera roll you never scroll. And the nagging feeling you're forgetting something."
        index={3}
        total={5}
      />
    </div>
  );
}

/** Closing slide with the CTA. */
export function Cta() {
  return (
    <div style={{ width: 340 }}>
      <CarouselSlide
        variant="cta"
        kicker="One private place"
        headline="See the week build up"
        body="No AI writing it for you. Just what your kid actually did, all in one place."
        cta="Save my spot"
        index={5}
        total={5}
      />
    </div>
  );
}
