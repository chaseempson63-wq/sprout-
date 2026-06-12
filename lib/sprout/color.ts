/* Tiny color helpers for the app's hex tokens. Everything stays in hex so
   subject/kid colors remain single source-of-truth strings. */

function channel(hex: string, i: number): number {
  return parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
}

/** Mix a hex color toward white. t=0 returns the color, t=1 returns white. */
export function tint(hex: string, t: number): string {
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  const [r, g, b] = [0, 1, 2].map((i) => mix(channel(hex, i)));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Mix a hex color toward black. t=0 returns the color, t=1 returns black. */
export function shade(hex: string, t: number): string {
  const mix = (c: number) => Math.round(c * (1 - t));
  const [r, g, b] = [0, 1, 2].map((i) => mix(channel(hex, i)));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Append an alpha channel to a 6-digit hex. a in [0, 1]. */
export function alpha(hex: string, a: number): string {
  return (
    hex +
    Math.round(Math.min(1, Math.max(0, a)) * 255)
      .toString(16)
      .padStart(2, "0")
  );
}
