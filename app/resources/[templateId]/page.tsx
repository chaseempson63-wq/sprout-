"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Download, Loader2, Minus, Plus, RefreshCw, Send } from "lucide-react";
import { WorksheetDoc } from "../_components/WorksheetDoc";
import { getTemplate } from "@/lib/resources/catalog";
import { useResources } from "@/lib/resources/store";
import type { ChatMessage, Worksheet } from "@/lib/resources/types";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-sm hover:bg-[#FBF6EB] transition-colors disabled:opacity-50";
const glassBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-sprout-cream/10 border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors disabled:opacity-50";

export default function Builder() {
  const params = useParams();
  const raw = params?.templateId;
  const templateId = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const template = getTemplate(templateId);
  const { saveWorksheet } = useResources();

  const [age, setAge] = useState(() => (template ? Math.min(12, Math.max(3, Math.round((template.ageMin + template.ageMax) / 2))) : 7));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [source, setSource] = useState<"ai" | "template" | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const didInit = useRef(false);

  async function runGenerate(msgs: ChatMessage[], ageVal: number, kind: "init" | "send" | "silent") {
    if (!template) return;
    setLoading(true);
    try {
      const res = await fetch("/api/resources/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templateId: template.id, age: ageVal, messages: msgs }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { worksheet: Worksheet; source: "ai" | "template" };
      setWorksheet(data.worksheet);
      setSource(data.source);
      if (kind === "init") {
        setMessages([
          {
            role: "assistant",
            content: `Here is a ${data.worksheet.title} worksheet for age ${ageVal}. Tell me what to change: a theme like space or dinosaurs, make it harder or easier, or ask for more questions.`,
          },
        ]);
      } else if (kind === "send") {
        setMessages((prev) => [...prev, { role: "assistant", content: "Updated. Anything else you want changed?" }]);
      }
    } catch {
      if (kind !== "silent") setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Try that again." }]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (didInit.current || !template) return;
    didInit.current = true;
    void runGenerate([], age, "init");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!template) {
    return (
      <div className="py-20 text-center">
        <p className="text-sprout-cream/70">That template was not found.</p>
        <Link href="/resources" className={`${primaryBtn} mt-4`}>
          Back to the library
        </Link>
      </div>
    );
  }

  function send() {
    const text = input.trim();
    if (!text || loading) return;
    const msgs: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(msgs);
    setInput("");
    void runGenerate(msgs, age, "send");
  }

  function changeAge(delta: number) {
    const next = Math.min(12, Math.max(3, age + delta));
    if (next === age) return;
    setAge(next);
    void runGenerate(messages, next, "silent");
  }

  function showToast(m: string) {
    setToast(m);
    window.setTimeout(() => setToast(null), 2500);
  }

  function save() {
    if (!worksheet || !source) return;
    saveWorksheet(worksheet, source);
    showToast("Saved to your worksheets");
  }

  return (
    <div>
      {toast && (
        <div className="no-print text-sprout-cream border-sprout-cream/15 fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border bg-[#0F1A12] px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* header row */}
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/resources" className="text-sprout-cream/80 hover:text-sprout-cream inline-flex items-center gap-1 text-sm font-semibold">
            <ArrowLeft className="size-4" /> Library
          </Link>
          <span className="text-sprout-cream/40">/</span>
          <span className="text-sprout-cream flex items-center gap-2 font-bold">
            <span className="text-xl">{template.emoji}</span> {template.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sprout-cream border-sprout-cream/20 bg-sprout-cream/10 flex items-center gap-1 rounded-full border p-1">
            <button onClick={() => changeAge(-1)} aria-label="Younger" className="hover:bg-sprout-cream/10 grid size-7 place-items-center rounded-full">
              <Minus className="size-4" />
            </button>
            <span className="px-1 text-sm font-semibold">Age {age}</span>
            <button onClick={() => changeAge(1)} aria-label="Older" className="hover:bg-sprout-cream/10 grid size-7 place-items-center rounded-full">
              <Plus className="size-4" />
            </button>
          </div>
          <button onClick={save} disabled={!worksheet} className={primaryBtn}>
            <Check className="size-4" /> Save
          </button>
          <button onClick={() => window.print()} disabled={!worksheet} className={glassBtn}>
            <Download className="size-4" /> PDF
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* chat */}
        <div className="no-print border-sprout-cream/15 bg-sprout-cream/[0.06] flex h-[70vh] flex-col rounded-2xl border lg:sticky lg:top-20">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-[#F4EDE0] text-[#1B3722]" : "bg-sprout-cream/10 text-sprout-cream"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-sprout-cream/10 text-sprout-cream/80 inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm">
                  <Loader2 className="size-4 animate-spin" /> Working on it
                </div>
              </div>
            )}
          </div>

          {source === "template" && (
            <p className="text-sprout-cream/50 px-4 pb-1 text-[11px]">Sample mode. Add a Venice key for full AI generation.</p>
          )}

          <div className="border-sprout-cream/15 flex items-center gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="make it about space, make it harder..."
              className="text-sprout-cream placeholder:text-sprout-cream/40 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
            />
            <button onClick={send} disabled={loading || !input.trim()} aria-label="Send" className="bg-[#F4EDE0] text-[#1B3722] grid size-9 shrink-0 place-items-center rounded-full disabled:opacity-40">
              <Send className="size-4" />
            </button>
          </div>
        </div>

        {/* preview */}
        <div className="min-w-0">
          {worksheet ? (
            <WorksheetDoc worksheet={worksheet} />
          ) : (
            <div className="text-sprout-cream/60 flex h-[60vh] items-center justify-center rounded-2xl border border-dashed border-sprout-cream/20 text-sm">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Building your first worksheet
              </span>
            </div>
          )}
          {worksheet && (
            <div className="no-print mt-3 flex justify-center">
              <button onClick={() => runGenerate(messages, age, "silent")} disabled={loading} className={glassBtn}>
                <RefreshCw className="size-4" /> Regenerate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
