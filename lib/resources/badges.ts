// Sprout Resources — badge definitions.
// NOTE: labels are PLACEHOLDERS — rename to the real brand voice.

export interface CreatorStats {
  published: number;
  totalLikes: number;
  worksheetsMade: number;
  kids: number;
  moments: number;
}

export interface BadgeDef {
  id: string;
  label: string; // placeholder
  desc: string;
  emoji: string;
  test: (s: CreatorStats) => boolean;
}

export const BADGES: BadgeDef[] = [
  { id: "first", label: "First Sprout", emoji: "🌱", desc: "Published your first worksheet", test: (s) => s.published >= 1 },
  { id: "sharer", label: "Sharer", emoji: "📤", desc: "Published 3 worksheets", test: (s) => s.published >= 3 },
  { id: "maker", label: "Maker", emoji: "🛠️", desc: "Made 5 worksheets", test: (s) => s.worksheetsMade >= 5 },
  { id: "loved", label: "Loved", emoji: "💚", desc: "Earned 10 likes", test: (s) => s.totalLikes >= 10 },
  { id: "popular", label: "Popular", emoji: "⭐", desc: "Earned 50 likes", test: (s) => s.totalLikes >= 50 },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧", desc: "Added 2 children", test: (s) => s.kids >= 2 },
  { id: "storyteller", label: "Storyteller", emoji: "📖", desc: "Logged 5 learning moments", test: (s) => s.moments >= 5 },
];

export function earnedBadges(s: CreatorStats): BadgeDef[] {
  return BADGES.filter((b) => b.test(s));
}
