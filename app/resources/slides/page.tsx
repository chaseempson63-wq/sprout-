import type { Metadata } from "next";
import { SlidesStudio } from "./SlidesStudio";
import { RESOURCES_DEMO } from "@/lib/resources/demo";
import { ComingSoonPage } from "../_components/ComingSoon";

export const metadata: Metadata = {
  title: RESOURCES_DEMO ? "Slideshows, coming soon · Sprout Resources" : "Slideshow generator · Sprout Resources",
  description:
    "Type a topic, set your kid's age, and Sprout builds a warm, illustrated teaching slideshow you can present full screen or print. Free, and your data stays yours.",
};

export default function SlidesPage() {
  if (RESOURCES_DEMO) return <ComingSoonPage feature="slides" />;
  return <SlidesStudio />;
}
