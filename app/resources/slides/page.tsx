import type { Metadata } from "next";
import { SlidesStudio } from "./SlidesStudio";

export const metadata: Metadata = {
  title: "Slideshow generator · Sprout Resources",
  description:
    "Type a topic, set your kid's age, and Sprout builds a warm, illustrated teaching slideshow you can present full screen or print. Free, and your data stays yours.",
};

export default function SlidesPage() {
  return <SlidesStudio />;
}
