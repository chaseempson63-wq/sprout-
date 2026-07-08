import * as React from 'react';
import { GradientCanvas } from './GradientCanvas';
import { CtaButton } from './CtaButton';
import { Wordmark } from './_brand';

export interface SocialPostProps {
  /** Small tracking-wide label above the headline (all-caps). */
  eyebrow?: string;
  /** The hero line. Bold, confident, short. */
  headline: string;
  /** Optional supporting sentence under the headline. */
  body?: string;
  /** CTA pill label. Omit for no button. */
  cta?: string;
  /** Corner footnote, e.g. a URL. Default "hisprout.app". */
  footnote?: string;
  /** `square` (1:1, IG feed), `portrait` (4:5), or `story` (9:16). Default `square`. */
  format?: 'square' | 'portrait' | 'story';
  /** Text alignment. Default `left` (editorial). */
  align?: 'left' | 'center';
}

const RATIO = { square: '1 / 1', portrait: '4 / 5', story: '9 / 16' } as const;

/**
 * A ready-to-post Sprout social image in the landing-page aesthetic: forest-green
 * canvas, frosted-glass-free editorial layout, an 800-weight display headline in
 * Nunito, and a cream CTA. Generous negative space (the brand keeps 40%+ empty).
 * Swap `format` for IG feed / portrait / story. One CTA per post.
 */
export function SocialPost({
  eyebrow,
  headline,
  body,
  cta,
  footnote = 'hisprout.app',
  format = 'square',
  align = 'left',
}: SocialPostProps) {
  const center = align === 'center';
  return (
    <div className="sprout-poster" style={{ aspectRatio: RATIO[format] }}>
      <GradientCanvas contained={false} style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute', inset: 0, padding: '8cqw',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            textAlign: center ? 'center' : 'left', alignItems: center ? 'center' : 'flex-start',
          }}
        >
          <Wordmark style={{ fontSize: '4.2cqw' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5cqw', maxWidth: center ? '100%' : '86%' }}>
            {eyebrow && (
              <p className="sprout-eyebrow" style={{ fontSize: '3cqw', color: 'var(--sprout-sage)' }}>{eyebrow}</p>
            )}
            <h1 className="sprout-display" style={{ fontSize: format === 'story' ? '9.5cqw' : '11cqw' }}>{headline}</h1>
            {body && (
              <p className="sprout-body" style={{ fontSize: '4cqw', color: 'rgba(253,253,253,0.86)', maxWidth: '90%', alignSelf: center ? 'center' : 'flex-start' }}>{body}</p>
            )}
            {cta && (
              <div style={{ marginTop: '1cqw' }}>
                <CtaButton style={{ fontSize: '3.4cqw', padding: '1em 1.8em' }}>{cta}</CtaButton>
              </div>
            )}
          </div>

          <p className="sprout-body" style={{ fontSize: '2.8cqw', color: 'rgba(253,253,253,0.6)' }}>{footnote}</p>
        </div>
      </GradientCanvas>
    </div>
  );
}
