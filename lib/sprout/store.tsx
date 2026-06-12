"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Entry, Kid, SproutData, SubjectId } from "./types";
import { buildSeed } from "./seed";

/* Local-first store. Everything lives in localStorage on this device:
   no account, no server, nothing leaves the browser. That IS the pitch,
   and it makes the thin slice usable the moment it loads. */

const KEY = "sprout.app.v1";

export interface NewEntry {
  kidIds: string[];
  note: string;
  photo?: string | null;
  subjectId?: SubjectId | null;
}

interface SproutStore {
  ready: boolean;
  kids: Kid[];
  entries: Entry[];
  demo: boolean;
  demoNoticeDismissed: boolean;
  lastAddedId: string | null;
  addEntry: (input: NewEntry) => Entry | null;
  startClean: () => void;
  dismissDemoNotice: () => void;
}

const Ctx = createContext<SproutStore | null>(null);

function load(): SproutData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SproutData;
    if (data?.version !== 1 || !Array.isArray(data.entries)) return null;
    return data;
  } catch {
    return null;
  }
}

function persist(data: SproutData): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    // Quota exceeded, almost always a photo. Caller surfaces it.
    return false;
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function SproutProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SproutData | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    const existing = load();
    if (existing) {
      setData(existing);
      return;
    }
    const seeded = buildSeed(Date.now());
    persist(seeded);
    setData(seeded);
  }, []);

  const addEntry = useCallback(
    (input: NewEntry): Entry | null => {
      if (!data) return null;
      const entry: Entry = {
        id: newId(),
        kidIds: input.kidIds,
        note: input.note.trim(),
        photo: input.photo ?? null,
        subjectId: input.subjectId ?? null,
        createdAt: Date.now(),
      };
      const next: SproutData = { ...data, entries: [entry, ...data.entries] };
      if (!persist(next)) {
        if (!entry.photo) return null;
        // Retry without the photo rather than losing the moment.
        const slim = { ...entry, photo: null };
        const retry: SproutData = { ...data, entries: [slim, ...data.entries] };
        if (!persist(retry)) return null;
        setData(retry);
        setLastAddedId(slim.id);
        return slim;
      }
      setData(next);
      setLastAddedId(entry.id);
      return entry;
    },
    [data],
  );

  const startClean = useCallback(() => {
    if (!data) return;
    const next: SproutData = { ...data, demo: false, entries: [] };
    persist(next);
    setData(next);
  }, [data]);

  const dismissDemoNotice = useCallback(() => {
    if (!data) return;
    const next: SproutData = { ...data, demoNoticeDismissed: true };
    persist(next);
    setData(next);
  }, [data]);

  const value: SproutStore = {
    ready: data !== null,
    kids: data?.kids ?? [],
    entries: data?.entries ?? [],
    demo: data?.demo ?? false,
    demoNoticeDismissed: data?.demoNoticeDismissed ?? false,
    lastAddedId,
    addEntry,
    startClean,
    dismissDemoNotice,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSprout(): SproutStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSprout must be used inside SproutProvider");
  return ctx;
}
