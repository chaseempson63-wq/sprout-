// Sprout Resources — social layer, SERVER ONLY.
//
// Every read/write for the community + forum goes through this module using
// the Supabase SERVICE-ROLE key (which bypasses RLS). The social tables are
// RLS-enabled with no policies, so the browser anon key cannot touch them —
// all access is here, server-side. Never import this from a client component.
//
// Mirrors the placeholder-tolerance of lib/supabase.ts: with no real env the
// helpers report "not configured" and the API routes degrade gracefully
// (return { disabled: true }) instead of throwing, so the live site is safe.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Comment, CommunityPost, ForumThread, MakerRef, VoteTarget, Worksheet } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder-service-key";

// True only when real (non-placeholder) Supabase + service-role env is present.
export function socialConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !SUPABASE_URL.includes("placeholder")
  );
}

// Hard kill: RESOURCES_SOCIAL_KILL=1 disables everything before any DB call.
export function killedByEnv(): boolean {
  return process.env.RESOURCES_SOCIAL_KILL === "1";
}

let _client: SupabaseClient | null = null;
export function serverSupabase(): SupabaseClient {
  if (!_client) _client = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  return _client;
}

// The single gate every route checks first. Off when killed-by-env,
// unconfigured, the SQL hasn't been run, or the kill switch row is false.
export async function socialEnabled(): Promise<boolean> {
  if (killedByEnv()) return false;
  if (!socialConfigured()) return false;
  try {
    const { data, error } = await serverSupabase()
      .from("resource_settings")
      .select("social_enabled")
      .eq("id", 1)
      .maybeSingle();
    if (error) return false; // tables not created yet, etc.
    return data?.social_enabled !== false;
  } catch {
    return false;
  }
}

// ── Auth + validation helpers ──

export function adminOk(req: Request): boolean {
  const token = req.headers.get("x-admin-token");
  return !!process.env.RESOURCES_ADMIN_TOKEN && token === process.env.RESOURCES_ADMIN_TOKEN;
}

export function isUuid(s: unknown): s is string {
  return typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export function clampText(s: unknown, max: number): string {
  return typeof s === "string" ? s.trim().slice(0, max) : "";
}

// clean() then clamp, tolerant of non-string input. Use for free-text user
// fields (comment bodies, thread titles/bodies, report reasons).
export function cleanClamp(raw: unknown, max: number): string {
  return clampText(typeof raw === "string" ? clean(raw) : "", max);
}

// Light hygiene only — strips control chars (keeping newlines) and masks a
// small set of the worst slurs/profanity. The real safety net is
// report + hide + kill switch, not this list. Deliberately conservative so
// ordinary words pass through. Code-point filter avoids control-char regex.
const PROFANITY = ["fuck", "cunt", "nigger", "faggot", "retard"];
const PROFANITY_RE = new RegExp(`\\b(${PROFANITY.join("|")})\\b`, "gi");
export function clean(s: string): string {
  let out = "";
  for (const ch of s) {
    const code = ch.codePointAt(0) ?? 0;
    if (ch === "\n") {
      out += ch;
      continue;
    }
    if (code < 0x20 || code === 0x7f) continue; // drop other control chars
    out += ch;
  }
  return out.replace(PROFANITY_RE, "***");
}

// Best-effort in-memory rate limit (per server instance). Not durable across
// serverless instances — a real limiter (Upstash / Vercel WAF) is the proper
// fix before heavy promotion. The kill switch is the backstop.
const buckets = new Map<string, number[]>();
export function rateLimit(key: string, max = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}

export function clientKey(req: Request, makerId?: string): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "ip";
  return `${ip}:${makerId ?? "anon"}`;
}

// Upsert the anonymous maker identity from a request body on every write.
// Returns false when the identity is unusable (no uuid / no name).
export async function upsertMaker(m: MakerRef | undefined): Promise<boolean> {
  if (!m || !isUuid(m.id)) return false;
  const displayName = clampText(m.displayName, 60);
  if (!displayName) return false;
  const { error } = await serverSupabase().from("resource_makers").upsert({
    id: m.id,
    handle: clampText(m.handle, 40) || "maker",
    display_name: displayName,
    photo: typeof m.photo === "string" ? m.photo.slice(0, 500_000) : null,
    bio: clampText(m.bio, 500) || null,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

// Validate a worksheet being published. Only build-your-own ('custom') sheets
// may publish (defense in depth — the UI enforces it too). The renderer is
// tolerant of block shape, so we mainly cap sizes and check the gate.
export function coerceWorksheet(input: unknown): Worksheet | null {
  if (!input || typeof input !== "object") return null;
  const w = input as { title?: unknown; blocks?: unknown; meta?: { templateId?: unknown } };
  if (w.meta?.templateId !== "custom") return null;
  if (!Array.isArray(w.blocks) || w.blocks.length === 0 || w.blocks.length > 80) return null;
  if (typeof w.title !== "string" || !w.title.trim()) return null;
  return input as Worksheet;
}

// ── Row → wire mappers (DB is snake_case; the client wants camelCase) ──

interface MakerEmbed {
  photo: string | null;
}
interface PostRow {
  id: string;
  maker_id: string;
  handle: string;
  creator_name: string;
  title: string;
  subtitle: string | null;
  template_id: string;
  topic: string;
  worksheet: Worksheet;
  upvotes: number | null;
  comment_count: number | null;
  created_at: string;
  maker?: MakerEmbed | MakerEmbed[] | null;
}
interface ThreadRow {
  id: string;
  maker_id: string;
  handle: string;
  creator_name: string;
  title: string;
  body: string | null;
  upvotes: number | null;
  comment_count: number | null;
  created_at: string;
}
interface CommentRow {
  id: string;
  target_type: "post" | "thread";
  target_id: string;
  parent_id: string | null;
  maker_id: string;
  handle: string;
  creator_name: string;
  body: string;
  upvotes: number | null;
  created_at: string;
}

const ms = (t: string | null): number => (t ? new Date(t).getTime() : 0);

export function mapPost(r: PostRow): CommunityPost {
  const m = Array.isArray(r.maker) ? r.maker[0] : r.maker;
  return {
    id: r.id,
    makerId: r.maker_id,
    handle: r.handle,
    creatorName: r.creator_name,
    photo: m?.photo ?? undefined,
    title: r.title,
    subtitle: r.subtitle ?? "",
    templateId: r.template_id,
    topic: r.topic,
    worksheet: r.worksheet,
    upvotes: r.upvotes ?? 0,
    commentCount: r.comment_count ?? 0,
    createdAt: ms(r.created_at),
  };
}

export function mapThread(r: ThreadRow): ForumThread {
  return {
    id: r.id,
    makerId: r.maker_id,
    handle: r.handle,
    creatorName: r.creator_name,
    title: r.title,
    body: r.body ?? "",
    upvotes: r.upvotes ?? 0,
    commentCount: r.comment_count ?? 0,
    createdAt: ms(r.created_at),
  };
}

export function mapComment(r: CommentRow): Comment {
  return {
    id: r.id,
    targetType: r.target_type,
    targetId: r.target_id,
    parentId: r.parent_id ?? null,
    makerId: r.maker_id,
    handle: r.handle,
    creatorName: r.creator_name,
    body: r.body,
    upvotes: r.upvotes ?? 0,
    createdAt: ms(r.created_at),
  };
}

export type { PostRow, ThreadRow, CommentRow };

// Assemble flat (already-mapped, non-hidden) comments into a Reddit-style tree.
// A reply whose parent was hidden/removed re-roots to the top level.
export function buildCommentTree(flat: Comment[]): Comment[] {
  const byId = new Map<string, Comment>();
  flat.forEach((c) => byId.set(c.id, { ...c, replies: [] }));
  const roots: Comment[] = [];
  for (const c of byId.values()) {
    const parent = c.parentId ? byId.get(c.parentId) : undefined;
    if (parent) parent.replies!.push(c);
    else roots.push(c);
  }
  const walk = (list: Comment[]) => {
    list.sort((a, b) => a.createdAt - b.createdAt);
    list.forEach((c) => walk(c.replies!));
  };
  walk(roots);
  return roots;
}

// Flatten a comment tree to a list of ids (post + comments need per-user
// vote state on the detail pages).
export function collectCommentIds(tree: Comment[]): string[] {
  const out: string[] = [];
  const walk = (list: Comment[]) => list.forEach((c) => {
    out.push(c.id);
    if (c.replies) walk(c.replies);
  });
  walk(tree);
  return out;
}

// Which of these targets has this maker already upvoted? Used to seed the
// upvote buttons on the detail pages so a reload shows the right state (and a
// click toggles correctly instead of silently removing an existing vote).
export async function votedSet(
  makerId: string | null | undefined,
  self: { type: VoteTarget; id: string },
  commentIds: string[],
): Promise<string[]> {
  if (!makerId || !isUuid(makerId)) return [];
  const sb = serverSupabase();
  const out: string[] = [];
  const { data: selfVote } = await sb
    .from("resource_votes")
    .select("target_id")
    .eq("maker_id", makerId)
    .eq("target_type", self.type)
    .eq("target_id", self.id);
  if (selfVote) out.push(...(selfVote as { target_id: string }[]).map((r) => r.target_id));
  if (commentIds.length) {
    const { data: cv } = await sb
      .from("resource_votes")
      .select("target_id")
      .eq("maker_id", makerId)
      .eq("target_type", "comment")
      .in("target_id", commentIds);
    if (cv) out.push(...(cv as { target_id: string }[]).map((r) => r.target_id));
  }
  return out;
}

// Shared helper: fetch + tree-build all visible comments for one target.
export async function commentsFor(targetType: "post" | "thread", targetId: string): Promise<Comment[]> {
  const { data, error } = await serverSupabase()
    .from("resource_comments")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("hidden", false)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return buildCommentTree((data as CommentRow[]).map(mapComment));
}

// Shared helper: set hidden=true only when the caller owns the row. Used by the
// owner self-hide branch in the write routes (admin hide lives in /admin).
export async function hideIfOwner(
  table: "resource_posts" | "resource_threads" | "resource_comments",
  id: string,
  makerId: string,
): Promise<boolean> {
  if (!isUuid(id) || !isUuid(makerId)) return false;
  const { data, error } = await serverSupabase()
    .from(table)
    .update({ hidden: true })
    .eq("id", id)
    .eq("maker_id", makerId)
    .select("id");
  return !error && !!data && data.length > 0;
}
