"use client";

// Types one word, holds, deletes just that word, types the next, loops.
// Fed only the word list (the lead-in is static text beside it).

import { useEffect, useRef, useState } from "react";

export function Typewriter({
  words,
  className = "",
  typeMs = 80,
  deleteMs = 40,
  holdMs = 3000,
}: {
  words: string[];
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setText(words[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduced.current || words.length === 0) return;
    const word = words[i % words.length] ?? "";
    let t: number;
    if (phase === "typing") {
      if (text.length < word.length) t = window.setTimeout(() => setText(word.slice(0, text.length + 1)), typeMs);
      else t = window.setTimeout(() => setPhase("holding"), 0);
    } else if (phase === "holding") {
      t = window.setTimeout(() => setPhase("deleting"), holdMs);
    } else {
      if (text.length > 0) t = window.setTimeout(() => setText(word.slice(0, text.length - 1)), deleteMs);
      else {
        setI((p) => (p + 1) % words.length);
        setPhase("typing");
        return;
      }
    }
    return () => window.clearTimeout(t);
  }, [text, phase, i, words, typeMs, deleteMs, holdMs]);

  return (
    <span className={className}>
      {text}
      <span aria-hidden className="bg-sprout-lime ml-1 inline-block h-[0.85em] w-[3px] -translate-y-[0.04em] rounded-full align-middle motion-safe:animate-pulse" />
    </span>
  );
}
