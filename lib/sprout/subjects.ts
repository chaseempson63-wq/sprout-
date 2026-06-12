import {
  BookOpen,
  Shapes,
  Leaf,
  Hammer,
  Palette,
  Utensils,
  Bike,
  Telescope,
  type LucideIcon,
} from "lucide-react";
import type { SubjectId } from "./types";

/* Life-shaped categories, not school subjects. Homeschool parents bristle
   at report-card framing (math/english/science columns); these describe
   how the learning actually happens. Colors are muted mid-tones that sit
   calmly on cream and white. */

export interface Subject {
  id: SubjectId;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const SUBJECTS: Subject[] = [
  { id: "reading", label: "Reading & stories", icon: BookOpen, color: "#a8552f" },
  { id: "numbers", label: "Numbers & logic", icon: Shapes, color: "#3e6c8d" },
  { id: "nature", label: "Nature & outside", icon: Leaf, color: "#4e7a47" },
  { id: "making", label: "Making & building", icon: Hammer, color: "#9a7420" },
  { id: "art", label: "Art & music", icon: Palette, color: "#95527e" },
  { id: "life", label: "Life skills", icon: Utensils, color: "#8a6a3f" },
  { id: "movement", label: "Movement & play", icon: Bike, color: "#2e7d6e" },
  { id: "wondering", label: "Big questions", icon: Telescope, color: "#5a5f9e" },
];

const byId = new Map(SUBJECTS.map((s) => [s.id, s]));

export function subjectById(id: SubjectId | null | undefined): Subject | null {
  return id ? (byId.get(id) ?? null) : null;
}
