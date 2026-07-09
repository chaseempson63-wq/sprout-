import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog/posts";

const BASE = "https://hisprout.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/resources`, changeFrequency: "weekly", priority: 0.9 },
    // /resources/community returns to the sitemap when it opens (demo stage
    // shows a coming-soon tease there — not worth indexing).
    { url: `${BASE}/resources/how-to`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/partners`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
