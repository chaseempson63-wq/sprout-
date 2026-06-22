// Small shared helpers used by both the server engine and the client UI.

// Capitalize a child's (or creator's) name regardless of how it was typed:
// "chase" -> "Chase", "mary jane" -> "Mary Jane". A lowercase name should
// never show anywhere in the product.
export function capName(s?: string): string {
  const t = (s ?? "").trim();
  if (!t) return "";
  return t
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .slice(0, 40);
}

// Soft, on-brand card tints (green / cream / mint / lime) so the grid reads warm
// and playful instead of flat white. Same gentle shadow + inset highlight on each;
// only the fill and border shift. Cycled by index across the whole grid so
// templates, the Build-your-own card, and Community sheets feel cohesive.
const CARD_SHADOW = "rounded-2xl border shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";
const CARD_TINTS = [
  "bg-[#FBF7EE] border-[#2E5A35]/15", // cream
  "bg-[#ECF4E9] border-[#3C6B3F]/20", // mint
  "bg-[#F4F7E6] border-[#5E7E2F]/18", // pale lime
  "bg-[#E9F2EE] border-[#2E6A5A]/16", // cool sage
  "bg-[#F7F2E2] border-[#9A7A3A]/16", // warm sand
];

export function cardTint(i: number): string {
  return `${CARD_SHADOW} ${CARD_TINTS[((i % CARD_TINTS.length) + CARD_TINTS.length) % CARD_TINTS.length]}`;
}
