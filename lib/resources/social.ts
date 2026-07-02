// Sprout Resources — social layer client helpers.
//
// Typed wrappers around the /api/resources/* routes. Every call catches network
// errors and returns a safe, "disabled" shape so a down or unconfigured backend
// never throws into the React render tree — the UI degrades to read-only.

import type {
  Comment,
  CommunityPost,
  CreatorProfile,
  ForumThread,
  MakerRef,
  VoteTarget,
  Worksheet,
} from "./types";

const JSON_HEADERS = { "content-type": "application/json" };

// Build the maker payload sent with every write, from the local account.
export function makerWire(account: CreatorProfile): MakerRef {
  return {
    id: account.id,
    handle: account.handle,
    displayName: account.displayName,
    photo: account.photo,
    bio: account.bio,
  };
}

async function getJSON<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function postJSON<T>(url: string, body: unknown, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { method: "POST", headers: JSON_HEADERS, body: JSON.stringify(body) });
    const data = (await res.json().catch(() => null)) as T | null;
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

// ── Community ──

export function listCommunity(
  opts: { creator?: string; topic?: string; q?: string; mine?: string } = {},
): Promise<{ posts: CommunityPost[]; disabled: boolean }> {
  const p = new URLSearchParams();
  if (opts.creator) p.set("creator", opts.creator);
  if (opts.topic && opts.topic !== "all") p.set("topic", opts.topic);
  if (opts.q?.trim()) p.set("q", opts.q.trim());
  if (opts.mine) p.set("mine", opts.mine);
  const qs = p.toString();
  return getJSON(`/api/resources/community${qs ? `?${qs}` : ""}`, { posts: [], disabled: true });
}

export function getCommunityPost(
  id: string,
  me?: string,
): Promise<{ post: CommunityPost | null; comments: Comment[]; votedIds: string[]; disabled: boolean }> {
  const qs = me ? `?me=${encodeURIComponent(me)}` : "";
  return getJSON(`/api/resources/community/${id}${qs}`, { post: null, comments: [], votedIds: [], disabled: true });
}

export function publishWorksheet(
  maker: MakerRef,
  worksheet: Worksheet,
): Promise<{ id: string | null; error?: string; disabled?: boolean }> {
  return postJSON(`/api/resources/community`, { maker, worksheet }, { id: null, disabled: true });
}

// ── Forum ──

export function listThreads(
  opts: { q?: string; sort?: "new" | "top" } = {},
): Promise<{ threads: ForumThread[]; disabled: boolean }> {
  const p = new URLSearchParams();
  if (opts.q?.trim()) p.set("q", opts.q.trim());
  if (opts.sort) p.set("sort", opts.sort);
  const qs = p.toString();
  return getJSON(`/api/resources/threads${qs ? `?${qs}` : ""}`, { threads: [], disabled: true });
}

export function getThread(
  id: string,
  me?: string,
): Promise<{ thread: ForumThread | null; comments: Comment[]; votedIds: string[]; disabled: boolean }> {
  const qs = me ? `?me=${encodeURIComponent(me)}` : "";
  return getJSON(`/api/resources/threads/${id}${qs}`, { thread: null, comments: [], votedIds: [], disabled: true });
}

export function createThread(
  maker: MakerRef,
  title: string,
  body: string,
): Promise<{ id: string | null; error?: string; disabled?: boolean }> {
  return postJSON(`/api/resources/threads`, { maker, title, body }, { id: null, disabled: true });
}

// ── Comments ──

export function postComment(
  maker: MakerRef,
  targetType: "post" | "thread",
  targetId: string,
  body: string,
  parentId?: string,
): Promise<{ comment: Comment | null; error?: string; disabled?: boolean }> {
  return postJSON(
    `/api/resources/comments`,
    { maker, targetType, targetId, parentId, body },
    { comment: null, disabled: true },
  );
}

// ── Votes ──

export function toggleVote(
  maker: MakerRef,
  targetType: VoteTarget,
  targetId: string,
): Promise<{ voted: boolean; upvotes: number; disabled?: boolean }> {
  return postJSON(`/api/resources/vote`, { maker, targetType, targetId }, { voted: false, upvotes: 0, disabled: true });
}

// ── Announcement hearts ──

export function listAnnouncementHearts(
  me?: string,
): Promise<{ counts: Record<string, number>; mine: string[]; disabled?: boolean }> {
  const p = me ? `?maker=${encodeURIComponent(me)}` : "";
  return getJSON(`/api/resources/announcement-hearts${p}`, { counts: {}, mine: [], disabled: true });
}

export function toggleAnnouncementHeart(
  maker: MakerRef,
  announcementId: string,
): Promise<{ hearted: boolean; count: number; disabled?: boolean }> {
  return postJSON(`/api/resources/announcement-hearts`, { maker, announcementId }, { hearted: false, count: 0, disabled: true });
}

// ── Profile ──

export function saveProfile(maker: MakerRef): Promise<{ ok: boolean }> {
  return postJSON(`/api/resources/profile`, { maker }, { ok: false });
}

// ── Follows ──

export function getFollowInfo(
  handle: string,
  me?: string,
): Promise<{ count: number; following: boolean; disabled?: boolean }> {
  const p = new URLSearchParams({ handle });
  if (me) p.set("follower", me);
  return getJSON(`/api/resources/follow?${p.toString()}`, { count: 0, following: false, disabled: true });
}

export function toggleFollowServer(
  maker: MakerRef,
  targetHandle: string,
): Promise<{ following: boolean; count: number; disabled?: boolean }> {
  return postJSON(`/api/resources/follow`, { maker, targetHandle }, { following: false, count: 0, disabled: true });
}

// ── Reports ──

export function reportTarget(
  maker: MakerRef | null,
  targetType: VoteTarget,
  targetId: string,
  reason?: string,
): Promise<{ ok: boolean }> {
  return postJSON(`/api/resources/report`, { maker, targetType, targetId, reason }, { ok: false });
}

// ── Owner self-hide (folded into the resource POST routes via op:"hide") ──

export function hideOwn(maker: MakerRef, targetType: VoteTarget, targetId: string): Promise<{ ok: boolean }> {
  const route = targetType === "post" ? "community" : targetType === "thread" ? "threads" : "comments";
  return postJSON(`/api/resources/${route}`, { op: "hide", maker, id: targetId }, { ok: false });
}
