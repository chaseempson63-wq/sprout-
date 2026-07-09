import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  posts,
  getPost,
  readingMinutes,
  formatDate,
} from "@/lib/blog/posts";
import { ArticleBody } from "../_components/ArticleBody";
import { ArticleCta, BackToBlog, BlogShell } from "../_components/BlogShell";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Sprout`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
      siteName: "Sprout",
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `https://hisprout.app/blog/${post.slug}`,
    author: { "@type": "Organization", name: "Sprout", url: "https://hisprout.app" },
    publisher: { "@type": "Organization", name: "Sprout", url: "https://hisprout.app" },
  };

  return (
    <BlogShell>
      <article className="max-w-3xl mx-auto w-full px-6 md:px-8 pt-8 md:pt-12 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <BackToBlog />

        <header className="mt-8">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#1B3722]/45 font-semibold">
            {formatDate(post.date)} · {readingMinutes(post)} min read
          </div>
          <h1
            className="mt-4 font-bold tracking-[-0.03em] text-[#1B3722]"
            style={{ fontSize: "clamp(30px, 4.8vw, 46px)", lineHeight: 1.12 }}
          >
            {post.title}
          </h1>
        </header>

        <div className="mt-10">
          <ArticleBody markdown={post.content} />
        </div>

        <ArticleCta />

        {related.length > 0 && (
          <section className="mt-14">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#1B3722]/50 font-semibold mb-5">
              Keep reading
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-2xl bg-white border border-[#1B3722]/8 hover:border-[#76A77A]/60 px-6 py-6 transition-colors"
                >
                  <h3
                    className="font-bold tracking-tight text-[#1B3722] group-hover:text-[#2A5132] transition-colors"
                    style={{ fontSize: "17px", lineHeight: 1.3 }}
                  >
                    {p.title}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[#2A5132] text-xs font-bold">
                    Read it
                    <ArrowRight
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                      strokeWidth={2.5}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </BlogShell>
  );
}
