import * as React from 'react';

export interface CtaButtonProps {
  children?: React.ReactNode;
  /** `cream` = cream pill, forest text (the premium default). `glass` = frosted secondary. */
  variant?: 'cream' | 'glass';
  /** `sm` | `md` | `lg`. Default `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** Render as a link when set; otherwise a `<button>`. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The Sprout call-to-action. Default is a CREAM pill with FOREST text, the
 * premium "Apple white-on-dark" move, never lime. Use `variant="glass"` for a
 * frosted secondary action (matches the landing nav's "Save my spot"). One CTA
 * per composition.
 */
export function CtaButton({
  children,
  variant = 'cream',
  size = 'md',
  href,
  onClick,
  className,
  style,
}: CtaButtonProps) {
  const cls = [
    'sprout-cta',
    variant === 'glass' && 'sprout-cta--glass',
    size === 'sm' && 'sprout-cta--sm',
    size === 'lg' && 'sprout-cta--lg',
    className,
  ].filter(Boolean).join(' ');

  if (href) {
    return <a href={href} className={cls} style={style} onClick={onClick}>{children}</a>;
  }
  return <button type="button" className={cls} style={style} onClick={onClick}>{children}</button>;
}
