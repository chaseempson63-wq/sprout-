"use client";

// Public maker profile: everything this creator has published to the community.
// Reads the shared DB; falls back to the local + sample showcase when the social
// layer is off so the page never breaks.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBigUp, ArrowLeft, MessageSquare } from "lucide-react";
import { COMMUNITY_SAMPLES } from "@/lib/resources/samples";
import { listCommunity } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName, cardTint, firstImageKey, timeAgo } from "@/lib/resources/util";
import { GlassLink } from "@/components/ui/glass";
import { FollowButton } from "../../_components/FollowButton";
import type { CommunityPost } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";

// A unified card shape so the DB feed and the offline fallback render the same.
type Card = { id: string; title: string; subtitle: string; createdAt: number; upvotes: number; commentCount: number; href?: string; imageKey?: string };

export default function CreatorProfile() {
  const params = useParams();
  const raw = params?.handle;
  const handle = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const { ready, account, worksheets, following, followerCount, loadFollowerCount } = useResources();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [off, setOff] = useState(false);
  const [loading, setLoading] = useState(true);

  const isMe = account?.handle === handle;

  useEffect(() => {
    if (!ready) return;
    let live = true;
    loadFollowerCount(handle);
    listCommunity({ creator: handle }).then((res) => {
      if (!live) return;
      setPosts(res.posts);
      setOff(res.disabled);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, [ready, handle, loadFollowerCount]);

  // Offline fallback: this maker's own local published sheets + matching samples.
  const sampleMatch = COMMUNITY_SAMPLES.find((s) => s.creatorHandle === handle);
  const fallbackCards: Card[] = [
    ...worksheets
      .filter((w) => w.published && w.meta.templateId === "custom" && (isMe || w.creatorHandle === handle))
      .map((w) => ({ id: w.id, title: w.title, subtitle: w.subtitle, createdAt: w.createdAt, upvotes: 0, commentCount: 0, imageKey: firstImageKey(w) })),
    ...COMMUNITY_SAMPLES.filter((s) => s.creatorHandle === handle).map((s) => ({
      id: s.id,
      title: s.worksheet.title,
      subtitle: s.worksheet.subtitle,
      createdAt: 0,
      upvotes: 0,
      commentCount: 0,
      imageKey: firstImageKey(s.worksheet),
    })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  const cards: Card[] = off
    ? fallbackCards
    : posts.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        createdAt: p.createdAt,
        upvotes: p.upvotes,
        commentCount: p.commentCount,
        href: `/resources/community/${p.id}`,
        imageKey: firstImageKey(p.worksheet),
      }));

  const displayName = isMe ? (account?.displayName ?? handle) : (posts[0]?.creatorName ?? sampleMatch?.creatorName ?? handle);
  const photo = isMe ? account?.photo : posts[0]?.photo;

  if (!ready || loading) return <div className="text-sprout-cream/60 py-20 text-center text-sm">Loading…</div>;

  return (
    <div>
      <GlassLink href="/resources" className="mb-5 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

      <div className={`${lightCard} mb-6 p-6`}>
        <div className="flex flex-wrap items-center gap-4">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={capName(displayName)} className="size-16 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#2E5A35] text-2xl font-bold text-white">
              {capName(displayName).charAt(0)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-[#1B3722]">{capName(displayName)}</h1>
            <p className="text-sm text-[#1B3722]/55">@{handle}{isMe ? " · this is you" : ""}</p>
          </div>
          {!isMe && <FollowButton handle={handle} name={displayName} photo={photo} />}
        </div>
        <p className="mt-4 text-sm font-medium text-[#2E5A35]">
          {followerCount(handle)} {followerCount(handle) === 1 ? "follower" : "followers"} · {cards.length} published {cards.length === 1 ? "worksheet" : "worksheets"}
        </p>
        {isMe && cards.length === 0 && (
          <p className="mt-2 text-sm text-[#1B3722]/60">
            You have not published anything yet. Build a worksheet from scratch, then hit Publish to share it here.
          </p>
        )}
      </div>

      {isMe && following.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sprout-cream mb-3 text-xl font-bold">Following</h2>
          <div className="flex flex-wrap gap-3">
            {following.map((f) => (
              <Link key={f.handle} href={`/resources/creator/${f.handle}`} className={`${lightCard} flex items-center gap-2.5 p-2.5 pr-4 transition hover:-translate-y-0.5`}>
                {f.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.photo} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#2E5A35] text-sm font-bold text-white">{capName(f.name).charAt(0)}</span>
                )}
                <span className="font-semibold text-[#1B3722]">{capName(f.name)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-sprout-cream mb-3 text-xl font-bold">Creations</h2>
      {cards.length === 0 ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">No public creations yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => {
            const body = (
              <>
                {c.imageKey && (
                  <div className="aspect-[16/10] w-full overflow-hidden border-b border-black/5 bg-white/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/resources/illustrations/${c.imageKey}.webp`} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="truncate font-bold text-[#1B3722]">{c.title}</h3>
                  {c.subtitle && <p className="mt-0.5 text-xs text-[#1B3722]/60">{c.subtitle}</p>}
                  {c.href && (
                    <div className="mt-3 flex items-center gap-3 border-t border-black/5 pt-3 text-xs text-[#1B3722]/55">
                      <span className="inline-flex items-center gap-0.5">
                        <ArrowBigUp className="size-3.5" />
                        {c.upvotes}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <MessageSquare className="size-3.5" />
                        {c.commentCount}
                      </span>
                      {c.createdAt > 0 && <span className="text-[#1B3722]/40">· {timeAgo(c.createdAt)}</span>}
                    </div>
                  )}
                </div>
              </>
            );
            return c.href ? (
              <Link key={c.id} href={c.href} className={`${cardTint(i)} group block overflow-hidden transition hover:-translate-y-0.5`}>
                {body}
              </Link>
            ) : (
              <div key={c.id} className={`${cardTint(i)} group overflow-hidden`}>
                {body}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
