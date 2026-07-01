// Small shared helpers used by both the server engine and the client UI.

// A canonical UUID, used for the stable per-browser maker id. crypto.randomUUID
// exists in browsers (secure contexts) and Node 19+; the fallback keeps UUID
// format so Supabase's uuid columns accept it either way.
export function newId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    /* fall through to the manual builder */
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
  "bg-[#FDFCF7] border-[#2E5A35]/10", // cream
  "bg-[#F5F9F2] border-[#3C6B3F]/10", // mint
  "bg-[#F9FBF0] border-[#5E7E2F]/10", // pale lime
  "bg-[#F3F9F5] border-[#2E6A5A]/10", // cool sage
  "bg-[#FBF8EE] border-[#9A7A3A]/10", // warm sand
  "bg-[#FDF6F0] border-[#B5683C]/10", // soft peach
  "bg-[#FDF4F3] border-[#B54C4C]/10", // soft rose
  "bg-[#F9F5FC] border-[#7A5AA0]/10", // soft lavender
  "bg-[#F2F8FC] border-[#3A6E97]/10", // soft sky
  "bg-[#F1F9F5] border-[#2E8A76]/10", // soft teal
  "bg-[#FDF8E9] border-[#B59A3A]/10", // soft butter
  "bg-[#F8F9ED] border-[#6E7E2F]/10", // soft olive
  "bg-[#FDF2F7] border-[#B54C86]/10", // soft pink
];

export function cardTint(i: number): string {
  return `${CARD_SHADOW} ${CARD_TINTS[((i % CARD_TINTS.length) + CARD_TINTS.length) % CARD_TINTS.length]}`;
}

// Stable pseudo-random tint from a string seed (e.g. a post id), so every
// community card gets its own colour that stays put across re-sorts.
export function cardTintFor(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  return cardTint(h);
}

// Short relative time for community/forum timestamps: "just now", "5m", "3h",
// "2d", then a plain date. Takes ms-epoch. Safe when passed 0 / NaN.
// The first illustration on a worksheet, so cards can show a real picture
// instead of reading like a plain document. Undefined when it has no image.
export function firstImageKey(w: { blocks?: { imageKey?: string }[] } | null | undefined): string | undefined {
  return w?.blocks?.find((b) => b.imageKey)?.imageKey;
}

export function timeAgo(ms: number): string {
  if (!ms || !Number.isFinite(ms)) return "";
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  if (s < 604800) return `${Math.round(s / 86400)}d`;
  return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
