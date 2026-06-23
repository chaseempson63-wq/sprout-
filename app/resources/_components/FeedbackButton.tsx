"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Check, Copy, MessageSquare, X } from "lucide-react";
import { getTemplate } from "@/lib/resources/catalog";
import { GlassButton } from "@/components/ui/glass";

const FEEDBACK_EMAIL = "sprout.humanintelligence@gmail.com";

function screenLabel(path: string | null): string {
  if (!path) return "Sprout Resources";
  if (path === "/resources") return "Library";
  if (path.startsWith("/resources/child/")) return "Child profile";
  if (path.startsWith("/resources/creator/")) return "Creator profile";
  if (path.startsWith("/resources/privacy")) return "Privacy";
  if (path.startsWith("/resources/")) {
    const id = path.split("/").filter(Boolean).pop() ?? "";
    const t = getTemplate(id);
    return t ? `Template: ${t.title}` : `Template: ${id}`;
  }
  return "Sprout Resources";
}

export function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState("");

  function openDialog() {
    const screen = screenLabel(pathname);
    setText(`Screen: ${screen}\n\nWhat I love:\n\n\nWhat's confusing or broken:\n\n\nWhat I wish Sprout did:\n\n`);
    setCopied(false);
    setOpen(true);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for contexts where the async clipboard API is blocked.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing more we can do */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <GlassButton onClick={openDialog} aria-label="Message us privately" className="hidden h-9 px-3 text-xs sm:inline-flex">
        <MessageSquare className="size-4" /> Message us
      </GlassButton>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-[#0F1A12]/80 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[101] max-h-[90vh] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-[#FBF7EE] p-6 shadow-2xl outline-none transition-all duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="text-lg font-bold text-[#1B3722]">Help Sprout grow</Dialog.Title>
            <GlassButton onClick={() => setOpen(false)} aria-label="Close" className="size-8 shrink-0">
              <X className="size-4" />
            </GlassButton>
          </div>
          <Dialog.Description className="mt-1 text-sm leading-relaxed text-[#1B3722]/70">
            For ideas and requests, post in the Forum so other parents can chime in and upvote. For something private like a bug or your account, copy this note and email us at{" "}
            <span className="font-semibold text-[#2E5A35]">{FEEDBACK_EMAIL}</span>.
          </Dialog.Description>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            className="mt-4 w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm leading-relaxed text-[#1B3722] outline-none focus:border-[#2E5A35]"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <GlassButton onClick={copy} className="h-10 px-4 text-sm">
              {copied ? (
                <>
                  <Check className="size-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Copy template
                </>
              )}
            </GlassButton>
            <span className="text-xs text-[#1B3722]/55">Then paste it into an email to {FEEDBACK_EMAIL}.</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
