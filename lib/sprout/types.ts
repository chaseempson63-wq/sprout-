export type SubjectId =
  | "reading"
  | "numbers"
  | "nature"
  | "making"
  | "art"
  | "life"
  | "movement"
  | "wondering";

export interface Kid {
  id: string;
  name: string;
  age: number;
  /** Avatar + accent color, hex. */
  color: string;
}

export interface Entry {
  id: string;
  /** An entry can belong to one kid or several ("we did this together"). */
  kidIds: string[];
  note: string;
  /** User capture, stored as a downscaled JPEG data URL. */
  photo?: string | null;
  /** Demo entries only: remote photo with a graceful local fallback. */
  photoUrl?: string | null;
  subjectId?: SubjectId | null;
  createdAt: number;
}

export interface SproutData {
  version: 1;
  /** True while the seeded demo family is in place. */
  demo: boolean;
  demoNoticeDismissed?: boolean;
  kids: Kid[];
  entries: Entry[];
}
