import type { Metadata } from "next";
import { CommunityHub, type CommunityTab } from "./CommunityHub";
import { RESOURCES_DEMO } from "@/lib/resources/demo";
import { ComingSoonPage } from "../_components/ComingSoon";

export const metadata: Metadata = {
  title: RESOURCES_DEMO ? "Community, coming soon · Sprout Resources" : "Community · Sprout Resources",
  description:
    "Worksheets and slideshows built and shared by Sprout parents, a chat to ask and swap ideas, and updates from the Sprout team.",
};

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if (RESOURCES_DEMO) return <ComingSoonPage feature="community" />;
  const { tab } = await searchParams;
  const initial: CommunityTab = tab === "chat" || tab === "announcements" || tab === "slideshows" ? tab : "worksheets";
  return <CommunityHub initialTab={initial} />;
}
