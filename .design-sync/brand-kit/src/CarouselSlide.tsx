import * as React from 'react';
import { GradientCanvas } from './GradientCanvas';
import { CtaButton } from './CtaButton';
import { Wordmark } from './_brand';

export interface CarouselSlideProps {
  /** Small tracking-wide label at the top (all-caps), e.g. a theme. */
  kicker?: string;
  /** The slide's main line. */
  headline: string;
  /** Optional supporting sentence. */
  body?: string;
  /** 1-based slide position, for the counter + progress dots. */
  index?: number;
  /** Total slides in the carousel. */
  total?: number;
  /** `cover` (big centred hook), `point` (a step in the arc), or `cta` (closing ask). Default `point`. */
  variant?: 'cover' | 'point' | 'cta';
  /** CTA label, used on the `cta` variant. Default "Save my spot". */
  cta?: string;
  /** Aspect ratio. Default "4 / 5" (IG portrait). */
  aspectRatio?: string;
}

/**
 * One slide of a Sprout IG/FB story-arc carousel, in the main brand system ,
 * forest-green canvas, Nunito rounded, frosted cream glass, cream CTA. No
 * serifs (the old Cormorant carousel style is retired). `variant` shapes the
 * slide: `cover` opens, `point` carries a beat, `cta` closes. Progress dots and
 * an "01 / 05" counter come from `index` + `total`.
 */
export function CarouselSlide({
  kicker,
  headline,
  body,
  index,
  total,
  variant = 'point',
  cta = 'Save my spot',
  aspectRatio = '4 / 5',
}: CarouselSlideProps) {
  const cover = variant === 'cover';
  const dots = total && total > 0
    ? Array.from({ length: total }, (_, i) => i)
    : [];

  return (
    <div className="sprout-poster" style={{ aspectRatio }}>
      <GradientCanvas contained={false} waves={cover} style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, padding: '8cqw', display: 'flex', flexDirection: 'column' }}>
          {/* top bar: wordmark + counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Wordmark style={{ fontSize: '3.6cqw' }} />
            {index && total && (
              <span className="sprout-eyebrow" style={{ fontSize: '2.8cqw', color: 'rgba(253,253,253,0.7)' }}>
                {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            )}
          </div>

          {/* body block */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4cqw' }}>
            {kicker && (
              <p className="sprout-eyebrow" style={{ fontSize: '3cqw', color: 'var(--sprout-sage)' }}>{kicker}</p>
            )}
            <h2 className="sprout-display" style={{ fontSize: cover ? '12cqw' : '9cqw' }}>{headline}</h2>
            {body && (
              <p className="sprout-body" style={{ fontSize: '4.2cqw', color: 'rgba(253,253,253,0.86)', maxWidth: '92%' }}>{body}</p>
            )}
            {variant === 'cta' && (
              <div style={{ marginTop: '2cqw' }}>
                <CtaButton style={{ fontSize: '3.6cqw', padding: '1em 1.9em' }}>{cta}</CtaButton>
              </div>
            )}
          </div>

          {/* progress dots + swipe hint */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1.6cqw' }}>
              {dots.map((i) => (
                <span
                  key={i}
                  style={{
                    width: '2.2cqw', height: '2.2cqw', borderRadius: '9999px',
                    background: index && i === index - 1 ? 'var(--sprout-cream)' : 'rgba(253,253,253,0.3)',
                  }}
                />
              ))}
            </div>
            {variant !== 'cta' && (
              <span className="sprout-body" style={{ fontSize: '2.8cqw', color: 'rgba(253,253,253,0.6)' }}>swipe →</span>
            )}
          </div>
        </div>
      </GradientCanvas>
    </div>
  );
}
