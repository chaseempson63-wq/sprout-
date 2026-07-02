// Sticky-note tints for chat threads. A warm spread of paper pastels, picked
// stably per thread id (FNV-1a hash) so a thread keeps its colour across
// re-sorts, and so the same colour follows the thread onto its detail page.
// Wide palette on purpose — with only a few tints most notes collided and read
// as one colour.

export const NOTE_TINTS = [
  "bg-[#FDF6DF]", // cream-yellow
  "bg-[#F1F6EC]", // pale green
  "bg-[#FFF1E2]", // pale peach
  "bg-[#EAF2F8]", // pale blue
  "bg-[#FBEDED]", // pale rose
  "bg-[#F1ECF9]", // pale lavender
  "bg-[#E8F5EC]", // pale mint
  "bg-[#FCF3D6]", // pale lemon
  "bg-[#FBEAF0]", // pale pink
  "bg-[#EAF4F2]", // pale aqua
  "bg-[#F4EEDD]", // pale sand
  "bg-[#EDF3E1]", // pale sage
  "bg-[#F8EEE4]", // pale apricot
  "bg-[#ECEFF7]", // pale periwinkle
] as const;

export function noteTint(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619) >>> 0;
  return NOTE_TINTS[h % NOTE_TINTS.length];
}
