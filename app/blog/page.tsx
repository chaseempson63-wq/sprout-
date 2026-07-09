import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sortedPosts, readingMinutes, formatDate } from "@/lib/blog/posts";
import { BlogShell } from "./_components/BlogShell";

export const metadata: Metadata = {
  title: "The Sprout blog — homeschool documentation, answered straight",
  description:
    "Straight answers on homeschool record keeping, portfolios, and the questions every homeschool parent googles at 11pm. From the team building Sprout.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = sortedPosts();

  return (
    <BlogShell>
      <section className="max-w-3xl mx-auto w-full px-6 md:px-8 pt-10 md:pt-16 pb-20">
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#1B3722]/50 font-semibold mb-5">
          The Sprout blog
        </div>
        <h1
          className="font-bold tracking-[-0.03em] text-[#1B3722]"
          style={{ fontSize: "clamp(34px, 5.5vw, 54px)", lineHeight: 1.1 }}
        >
          The questions you google at 11pm, answered straight
        </h1>
        <p
          className="mt-5 text-[#1B3722]/70 leading-relaxed max-w-xl"
          style={{ fontSize: "18px" }}
        >
          Record keeping, portfolios, the am-I-doing-enough spiral. Plain
          writing for the parents doing the work, from the team building
          Sprout.
        </p>

        <div className="mt-12 space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-3xl bg-white border border-[#1B3722]/8 hover:border-[#76A77A]/60 px-7 py-7 md:px-9 md:py-8 transition-colors shadow-[0_1px_0_rgba(27,55,34,0.04)]"
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#1B3722]/45 font-semibold">
                {formatDate(post.date)} · {readingMinutes(post)} min read
              </div>
              <h2
                className="mt-3 font-bold tracking-tight text-[#1B3722] group-hover:text-[#2A5132] transition-colors"
                style={{ fontSize: "clamp(20px, 2.4vw, 26px)", lineHeight: 1.25 }}
              >
                {post.title}
              </h2>
              <p
                className="mt-3 text-[#1B3722]/70 leading-relaxed"
                style={{ fontSize: "16px" }}
              >
                {post.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-[#2A5132] text-sm font-bold">
                Read the article
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  strokeWidth={2.5}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </BlogShell>
  );
}
