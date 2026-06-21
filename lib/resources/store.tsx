"use client";

// Sprout Resources — client-side store (v0, local-first).
//
// Holds the parent's children (subaccounts) and each child's saved resources
// in localStorage so the whole product works on day one with no backend.
// The shape matches the planned Supabase tables, so swapping this for real
// auth + DB later is a drop-in: same methods, same data.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ChildProfile, GeneratedResource, SavedResource } from "./types";

const CHILDREN_KEY = "sprout.resources.children.v1";
const RESOURCES_KEY = "sprout.resources.saved.v1";

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
  addChild: (data: Omit<ChildProfile, "id" | "createdAt">) => ChildProfile;
  updateChild: (id: string, patch: Partial<Omit<ChildProfile, "id" | "createdAt">>) => void;
  removeChild: (id: string) => void;
  getChild: (id: string) => ChildProfile | undefined;
  resourcesFor: (childId: string) => SavedResource[];
  saveResource: (childId: string, gen: GeneratedResource, source: "ai" | "template") => SavedResource;
  toggleFavorite: (id: string) => void;
  removeResource: (id: string) => void;
}

const ResourcesContext = createContext<ResourcesContextValue | null>(null);

export function ResourcesProvider({ children }: { children: React.ReactNode }) {
  // Lazy-init from localStorage so children/resources are present on the first
  // client render (no setState-in-effect). The `ready` gate stays false until
  // after mount so the server render (empty) and first client render match,
  // avoiding a hydration mismatch.
  const [ready, setReady] = useState(false);
  const [kids, setKids] = useState<ChildProfile[]>(() => readJSON<ChildProfile[]>(CHILDREN_KEY, []));
  const [resources, setResources] = useState<SavedResource[]>(() =>
    readJSON<SavedResource[]>(RESOURCES_KEY, []),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration gate flip after mount
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CHILDREN_KEY, JSON.stringify(kids));
  }, [kids, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
  }, [resources, ready]);

  const addChild = useCallback((data: Omit<ChildProfile, "id" | "createdAt">) => {
    const child: ChildProfile = { ...data, id: uid(), createdAt: Date.now() };
    setKids((prev) => [...prev, child]);
    return child;
  }, []);

  const updateChild = useCallback(
    (id: string, patch: Partial<Omit<ChildProfile, "id" | "createdAt">>) => {
      setKids((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    [],
  );

  const removeChild = useCallback((id: string) => {
    setKids((prev) => prev.filter((c) => c.id !== id));
    setResources((prev) => prev.filter((r) => r.childId !== id));
  }, []);

  const getChild = useCallback((id: string) => kids.find((c) => c.id === id), [kids]);

  const resourcesFor = useCallback(
    (childId: string) =>
      resources
        .filter((r) => r.childId === childId)
        .sort((a, b) => b.createdAt - a.createdAt),
    [resources],
  );

  const saveResource = useCallback(
    (childId: string, gen: GeneratedResource, source: "ai" | "template") => {
      const saved: SavedResource = {
        ...gen,
        id: uid(),
        childId,
        favorite: false,
        createdAt: Date.now(),
        source,
      };
      setResources((prev) => [saved, ...prev]);
      return saved;
    },
    [],
  );

  const toggleFavorite = useCallback((id: string) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)));
  }, []);

  const removeResource = useCallback((id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const value = useMemo<ResourcesContextValue>(
    () => ({
      ready,
      kids,
      addChild,
      updateChild,
      removeChild,
      getChild,
      resourcesFor,
      saveResource,
      toggleFavorite,
      removeResource,
    }),
    [
      ready,
      kids,
      addChild,
      updateChild,
      removeChild,
      getChild,
      resourcesFor,
      saveResource,
      toggleFavorite,
      removeResource,
    ],
  );

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

export function useResources(): ResourcesContextValue {
  const ctx = useContext(ResourcesContext);
  if (!ctx) throw new Error("useResources must be used inside <ResourcesProvider>");
  return ctx;
}
