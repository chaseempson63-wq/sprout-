import type { Metadata } from "next";
import { getTemplate } from "@/lib/resources/catalog";

// Server wrapper so every template page carries real, indexable metadata
// (the builder itself is a client component and can't export it). The titles
// target the long-tail searches parents actually type.

export async function generateMetadata({ params }: { params: Promise<{ templateId: string }> }): Promise<Metadata> {
  const { templateId } = await params;
  const t = getTemplate(templateId);
  if (!t) return { title: "Sprout Resources" };
  const title =
    t.id === "custom"
      ? "Build your own worksheet · Sprout Resources"
      : `Free ${t.title.toLowerCase()} worksheet, ages ${t.ageMin}-${t.ageMax} · Sprout Resources`;
  const description =
    t.id === "custom"
      ? "Describe any worksheet in your own words and Sprout builds it in about a minute. Free, printable, and made to order for your kid."
      : `${t.blurb} Made to order for your kid's age, free to print. No account, no watermark, and your data stays yours.`;
  return {
    title,
    description,
    openGraph: { title, description, siteName: "Sprout Resources" },
  };
}

export default function TemplateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
