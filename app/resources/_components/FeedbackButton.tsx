"use client";

import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { getTemplate } from "@/lib/resources/catalog";
import { GlassButton } from "@/components/ui/glass";

const FEEDBACK_EMAIL = "chaseempson63@gmail.com";

// Describe the screen the user is on, so feedback arrives with context.
function screenLabel(path: string | null): string {
  if (!path) return "Sprout Resources";
  if (path === "/resources") return "Library";
  if (path.startsWith("/resources/child/")) return "Child profile";
  if (path.startsWith("/resources/creator/")) return "Creator profile";
  if (path.startsWith("/resources/")) {
    const id = path.split("/").filter(Boolean).pop() ?? "";
    const t = getTemplate(id);
    return t ? `Template: ${t.title}` : `Template: ${id}`;
  }
  return "Sprout Resources";
}

export function FeedbackButton() {
  const pathname = usePathname();

  function openMail() {
    const screen = screenLabel(pathname);
    const subject = `Sprout Resources feedback (${screen})`;
    const body = `Screen: ${screen}\nPage: ${pathname ?? ""}\n\nWhat's working / what's not:\n\n`;
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <GlassButton onClick={openMail} aria-label="Send feedback" className="h-9 px-3 text-xs">
      <MessageSquare className="size-4" /> Feedback
    </GlassButton>
  );
}
