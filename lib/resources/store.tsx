"use client";

// Sprout Resources — client store (v0, local-first).
// Holds the account/creator, children, learning moments, saved/published
// worksheets, and likes in localStorage. Shape matches the planned Supabase
// tables so a real multi-user backend is a drop-in swap later.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { capName, newId } from "./util";
import type { ChildProfile, CreatorProfile, LearningMoment, SavedWorksheet, Worksheet } from "./types";

const CHILDREN_KEY = "sprout.resources.children.v2";
const WORKSHEETS_KEY = "sprout.resources.worksheets.v2";
const MOMENTS_KEY = "sprout.resources.moments.v1";
const ACCOUNT_KEY = "sprout.resources.account.v1";
const LIKES_KEY = "sprout.resources.likes.v1";
const MYLIKES_KEY = "sprout.resources.mylikes.v1";
const FOLLOWING_KEY = "sprout.resources.following.v1";

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

export type FollowedMaker = { handle: string; name: string; photo?: string };

// Stable pseudo follower count per handle. Placeholder until a real follow
// backend exists, so a profile reads as "23 followers" not a flat zero. Same
// handle always yields the same number; following adds one (see followerCount).
function baseFollowers(handle: string): number {
  let h = 2166136261;
  for (let i = 0; i < handle.length; i++) h = Math.imul(h ^ handle.charCodeAt(i), 16777619) >>> 0;
  return 4 + (h % 38);
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
  account: CreatorProfile | null;
  kids: ChildProfile[];
  worksheets: SavedWorksheet[];
  moments: LearningMoment[];
  setAccount: (profile: CreatorProfile) => void;
  addChild: (data: Omit<ChildProfile, "id" | "createdAt">) => ChildProfile;
  updateChild: (id: string, patch: Partial<Omit<ChildProfile, "id" | "createdAt">>) => void;
  removeChild: (id: string) => void;
  getChild: (id: string) => ChildProfile | undefined;
  addMoment: (childId: string, data: { text: string; photo?: string }) => void;
  removeMoment: (id: string) => void;
  momentsFor: (childId: string) => LearningMoment[];
  saveWorksheet: (worksheet: Worksheet, source: "ai" | "template", childId?: string) => SavedWorksheet;
  toggleFavorite: (id: string) => void;
  togglePublish: (id: string) => void;
  removeWorksheet: (id: string) => void;
  toggleLike: (id: string) => void;
  likeCount: (id: string) => number;
  likedByMe: (id: string) => boolean;
  following: FollowedMaker[];
  isFollowing: (handle: string) => boolean;
  toggleFollow: (maker: FollowedMaker) => void;
  followerCount: (handle: string) => number;
}

const ResourcesContext = createContext<ResourcesContextValue | null>(null);

export function ResourcesProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [account, setAccountState] = useState<CreatorProfile | null>(() => readJSON<CreatorProfile | null>(ACCOUNT_KEY, null));
  const [kids, setKids] = useState<ChildProfile[]>(() => readJSON<ChildProfile[]>(CHILDREN_KEY, []));
  const [worksheets, setWorksheets] = useState<SavedWorksheet[]>(() => readJSON<SavedWorksheet[]>(WORKSHEETS_KEY, []));
  const [moments, setMoments] = useState<LearningMoment[]>(() => readJSON<LearningMoment[]>(MOMENTS_KEY, []));
  const [likes, setLikes] = useState<Record<string, number>>(() => readJSON<Record<string, number>>(LIKES_KEY, {}));
  const [myLikes, setMyLikes] = useState<string[]>(() => readJSON<string[]>(MYLIKES_KEY, []));
  const [following, setFollowing] = useState<FollowedMaker[]>(() => readJSON<FollowedMaker[]>(FOLLOWING_KEY, []));

  useEffect(() => {
    // One-time hydration after mount. Also backfill a stable account id for
    // accounts created before the social layer existed, so they can post,
    // comment, and vote (and converge to a real maker id) on first load.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration + id backfill after mount
    setAccountState((a) => (a && !a.id ? { ...a, id: newId() } : a));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }, [account, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(CHILDREN_KEY, JSON.stringify(kids));
  }, [kids, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(WORKSHEETS_KEY, JSON.stringify(worksheets));
  }, [worksheets, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(MOMENTS_KEY, JSON.stringify(moments));
  }, [moments, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  }, [likes, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(MYLIKES_KEY, JSON.stringify(myLikes));
  }, [myLikes, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(FOLLOWING_KEY, JSON.stringify(following));
  }, [following, ready]);

  const setAccount = useCallback(
    (profile: CreatorProfile) =>
      setAccountState({ ...profile, id: profile.id || newId(), displayName: capName(profile.displayName) || profile.displayName }),
    [],
  );

  const addChild = useCallback((data: Omit<ChildProfile, "id" | "createdAt">) => {
    const child: ChildProfile = { ...data, name: capName(data.name) || data.name, id: uid(), createdAt: Date.now() };
    setKids((prev) => [...prev, child]);
    return child;
  }, []);

  const updateChild = useCallback((id: string, patch: Partial<Omit<ChildProfile, "id" | "createdAt">>) => {
    const next = patch.name !== undefined ? { ...patch, name: capName(patch.name) || patch.name } : patch;
    setKids((prev) => prev.map((c) => (c.id === id ? { ...c, ...next } : c)));
  }, []);

  const removeChild = useCallback((id: string) => {
    setKids((prev) => prev.filter((c) => c.id !== id));
    setMoments((prev) => prev.filter((m) => m.childId !== id));
    setWorksheets((prev) => prev.map((w) => (w.childId === id ? { ...w, childId: undefined } : w)));
  }, []);

  const getChild = useCallback((id: string) => kids.find((c) => c.id === id), [kids]);

  const addMoment = useCallback((childId: string, data: { text: string; photo?: string }) => {
    const moment: LearningMoment = { id: uid(), childId, text: data.text, photo: data.photo, createdAt: Date.now() };
    setMoments((prev) => [moment, ...prev]);
  }, []);

  const removeMoment = useCallback((id: string) => {
    setMoments((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const momentsFor = useCallback(
    (childId: string) => moments.filter((m) => m.childId === childId).sort((a, b) => b.createdAt - a.createdAt),
    [moments],
  );

  const saveWorksheet = useCallback(
    (worksheet: Worksheet, source: "ai" | "template", childId?: string) => {
      const saved: SavedWorksheet = {
        ...worksheet,
        id: uid(),
        childId,
        favorite: false,
        published: false,
        creatorHandle: account?.handle,
        creatorName: account?.displayName,
        createdAt: Date.now(),
        source,
      };
      setWorksheets((prev) => [saved, ...prev]);
      return saved;
    },
    [account],
  );

  const toggleFavorite = useCallback((id: string) => {
    setWorksheets((prev) => prev.map((w) => (w.id === id ? { ...w, favorite: !w.favorite } : w)));
  }, []);

  const togglePublish = useCallback((id: string) => {
    setWorksheets((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, published: !w.published, creatorHandle: w.creatorHandle ?? account?.handle, creatorName: w.creatorName ?? account?.displayName }
          : w,
      ),
    );
  }, [account]);

  const removeWorksheet = useCallback((id: string) => {
    setWorksheets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const toggleLike = useCallback((id: string) => {
    setMyLikes((prev) => {
      const has = prev.includes(id);
      setLikes((lk) => ({ ...lk, [id]: Math.max(0, (lk[id] ?? 0) + (has ? -1 : 1)) }));
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, []);

  const likeCount = useCallback((id: string) => likes[id] ?? 0, [likes]);
  const likedByMe = useCallback((id: string) => myLikes.includes(id), [myLikes]);

  const isFollowing = useCallback((handle: string) => following.some((f) => f.handle === handle), [following]);
  const toggleFollow = useCallback((maker: FollowedMaker) => {
    setFollowing((prev) => (prev.some((f) => f.handle === maker.handle) ? prev.filter((f) => f.handle !== maker.handle) : [...prev, maker]));
  }, []);
  const followerCount = useCallback((handle: string) => baseFollowers(handle) + (following.some((f) => f.handle === handle) ? 1 : 0), [following]);

  const value = useMemo<ResourcesContextValue>(
    () => ({
      ready,
      account,
      kids,
      worksheets,
      moments,
      setAccount,
      addChild,
      updateChild,
      removeChild,
      getChild,
      addMoment,
      removeMoment,
      momentsFor,
      saveWorksheet,
      toggleFavorite,
      togglePublish,
      removeWorksheet,
      toggleLike,
      likeCount,
      likedByMe,
      following,
      isFollowing,
      toggleFollow,
      followerCount,
    }),
    [
      ready, account, kids, worksheets, moments, setAccount, addChild, updateChild, removeChild, getChild,
      addMoment, removeMoment, momentsFor, saveWorksheet, toggleFavorite, togglePublish, removeWorksheet,
      toggleLike, likeCount, likedByMe, following, isFollowing, toggleFollow, followerCount,
    ],
  );

  return <ResourcesContext.Provider value={value}>{children}</ResourcesContext.Provider>;
}

export function useResources(): ResourcesContextValue {
  const ctx = useContext(ResourcesContext);
  if (!ctx) throw new Error("useResources must be used inside <ResourcesProvider>");
  return ctx;
}
