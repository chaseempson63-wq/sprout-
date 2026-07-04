import type { Metadata } from "next";
import { CommunityHub, type CommunityTab } from "./CommunityHub";

export const metadata: Metadata = {
  title: "Community · Sprout Resources",
  description:
    "Worksheets and slideshows built and shared by Sprout parents, a chat to ask and swap ideas, and updates from the Sprout team.",
};

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const initial: CommunityTab = tab === "chat" || tab === "announcements" || tab === "slideshows" ? tab : "worksheets";
  return <CommunityHub initialTab={initial} />;
}
