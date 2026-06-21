"use client";

// Sprout Resources — client store (v0, local-first).
// Holds the parent's children and their saved/published worksheets in
// localStorage. Shape matches the planned Supabase tables for a clean swap.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ChildProfile, SavedWorksheet, Worksheet } from "./types";

const CHILDREN_KEY = "sprout.resources.children.v2";
const WORKSHEETS_KEY = "sprout.resources.worksheets.v2";

// Bright fills chosen to read clearly against the dark forest-green canvas.
export const AVATAR_COLORS: { key: string; bg: string }[] = [
  { key: "lime", bg: "bg-sprout-lime text-sprout-ink" },
  { key: "sage", bg: "bg-[#A4C9A8] text-[#1B3722]" },
  { key: "amber", bg: "bg-amber-300 text-[#1B3722]" },
  { key: "sky", bg: "bg-sky-300 text-[#0F1A12]" },
  { key: "rose", bg: "bg-rose-300 text-[#1B3722]" },
  { key: "violet", bg: "bg-violet-300 text-[#1B3722]" },
  { key: "cream", bg: "bg-[#F4EDE0] text-[#1B3722]" },
];

export function colorClasses(key: string) {
  return AVATAR_COLORS.find((c) => c.key === key) ?? AVATAR_COLORS[0];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface ResourcesContextValue {
  ready: boolean;
  kids: ChildProfile[];
  worksheets: SavedWorksheet[];
  addChild: (data: Omit<ChildProfile, "id" | "createdAt">) => ChildProfile;
  updateChild: (id: string, patch: Partial<Omit<ChildProfile, "id" | "createdAt">>) => void;
  removeChild: (id: string) => void;
  getChild: (id: string) => ChildProfile | undefined;
  saveWorksheet: (worksheet: Worksheet, source: "ai" | "template", childId?: string) => SavedWorksheet;
  toggleFavorite: (id: string) => void;
  togglePublish: (id: string) => void;
  removeWorksheet: (id: string) => void;
}

const ResourcesContext = createContext<ResourcesContextValue | null>(null);

export function ResourcesProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [kids, setKids] = useState<ChildProfile[]>(() => readJSON<ChildProfile[]>(CHILDREN_KEY, []));
  const [worksheets, setWorksheets] = useState<SavedWorksheet[]>(() =>
    readJSON<SavedWorksheet[]>(WORKSHEETS_KEY, []),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration gate flip after mount
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CHILDREN_KEY, JSON.stringify(kids));
  }, [kids, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(WORKSHEETS_KEY, JSON.stringify(worksheets));
  }, [worksheets, ready]);

  const addChild = useCallback((data: Omit<ChildProfile, "id" | "createdAt">) => {
    const child: ChildProfile = { ...data, id: uid(), createdAt: Date.now() };
    setKids((prev) => [...prev, child]);
    return child;
  }, []);

  const updateChild = useCallback((id: string, patch: Partial<Omit<ChildProfile, "id" | "createdAt">>) => {
    setKids((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const removeChild = useCallback((id: string) => {
    setKids((prev) => prev.filter((c) => c.id !== id));
    setWorksheets((prev) => prev.map((w) => (w.childId === id ? { ...w, childId: undefined } : w)));
  }, []);

  const getChild = useCallback((id: string) => kids.find((c) => c.id === id), [kids]);

  const saveWorksheet = useCallback(
    (worksheet: Worksheet, source: "ai" | "template", childId?: string) => {
      const saved: SavedWorksheet = {
        ...worksheet,
        id: uid(),
        childId,
        favorite: false,
        published: false,
        createdAt: Date.now(),
        source,
      };
      setWorksheets((prev) => [saved, ...prev]);
      return saved;
    },
    [],
  );

  const toggleFavorite = useCallback((id: string) => {
    setWorksheets((prev) => prev.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w)));
  }, []);

  const togglePublish = useCallback((id: string) => {
    setWorksheets((prev) => prev.map((w) => (w.id === id ? { ...w, published: !w.published } : w)));
  }, []);

  const removeWorksheet = useCallback((id: string) => {
    setWorksheets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const value = useMemo<ResourcesContextValue>(
    () => ({
      ready,
      kids,
      worksheets,
      addChild,
      updateChild,
      removeChild,
      getChild,
      saveWorksheet,
      toggleFavorite,
      togglePublish,
      removeWorksheet,
    }),
    [ready, kids, worksheets, addChild, updateChild, removeChild, getChild, saveWorksheet, toggleFavorite, togglePublish, removeWorksheet],
  );

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

export function useResources(): ResourcesContextValue {
  const ctx = useContext(ResourcesContext);
  if (!ctx) throw new Error("useResources must be used inside <ResourcesProvider>");
  return ctx;
}
