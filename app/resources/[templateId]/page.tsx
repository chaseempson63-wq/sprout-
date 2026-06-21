"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Download, LayoutGrid, Loader2, Minus, Plus, RefreshCw, Send, UserPlus } from "lucide-react";
import { WorksheetDoc } from "../_components/WorksheetDoc";
import { getTemplate } from "@/lib/resources/catalog";
import { INPUT_VOCABULARY } from "@/lib/resources/intent";
import { useResources } from "@/lib/resources/store";
import type { ChatMessage, Worksheet } from "@/lib/resources/types";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-sm hover:bg-[#FBF6EB] transition-colors disabled:opacity-50";
const glassBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-sprout-cream/10 border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors disabled:opacity-50";

function summarize(w: Worksheet): string {
  const items = w.blocks.reduce((s, b) => s + (b.items?.length ?? (b.text ? 1 : 0)), 0);
  return `${w.blocks.length} sections · ${items} items`;
}

export default function Builder() {
  const params = useParams();
  const raw = params?.templateId;
  const templateId = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const template = getTemplate(templateId);
  const { kids, addChild, getChild, saveWorksheet } = useResources();

  const [childId, setChildId] = useState("");
  const [age, setAge] = useState(() => (template ? Math.min(13, Math.max(3, Math.round((template.ageMin + template.ageMax) / 2))) : 7));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [variants, setVariants] = useState<Worksheet[]>([]);
  const [idx, setIdx] = useState(-1);
  const [view, setView] = useState<"editor" | "gallery">("editor");
  const [source, setSource] = useState<"ai" | "template" | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [addingKid, setAddingKid] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("7");
  const didInit = useRef(false);
  const variantsRef = useRef<Worksheet[]>([]);

  const child = getChild(childId);
  const childName = child?.name;
  const worksheet = idx >= 0 ? variants[idx] : null;

  function pushVariant(ws: Worksheet) {
    const next = [...variantsRef.current, ws];
    variantsRef.current = next;
    setVariants(next);
    setIdx(next.length - 1);
  }

  async function runGenerate(msgs: ChatMessage[], ageVal: number, kind: "init" | "send" | "silent", nameVal?: string, nudge?: string) {
    if (!template) return;
    setLoading(true);
    const sent = nudge ? [...msgs, { role: "user" as const, content: nudge }] : msgs;
    try {
      const res = await fetch("/api/resources/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templateId: template.id, age: ageVal, childName: nameVal, messages: sent }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { worksheet: Worksheet; source: "ai" | "template" };
      pushVariant(data.worksheet);
      setSource(data.source);
      if (kind === "init") {
        setMessages([
          {
            role: "assistant",
            content: `Here is a ${data.worksheet.title} worksheet for age ${ageVal}. Tell me what to change: a theme like space or dinosaurs, make it harder or easier, add more questions, or hit the arrows to flick through fresh versions.`,
          },
        ]);
      } else if (kind === "send") {
        setMessages((prev) => [...prev, { role: "assistant", content: "Done, here is the updated version. Anything else?" }]);
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
    void runGenerate([], age, "init", undefined);
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
    void runGenerate(msgs, age, "send", childName);
  }

  function changeAge(delta: number) {
    const next = Math.min(13, Math.max(3, age + delta));
    if (next === age) return;
    setAge(next);
    void runGenerate(messages, next, "silent", childName);
  }

  function regenerate() {
    if (loading) return;
    void runGenerate(messages, age, "silent", childName, "Make a fresh, different version of this worksheet with different numbers, examples and wording.");
  }

  function nextVariant() {
    if (idx < variants.length - 1) setIdx(idx + 1);
    else regenerate();
  }

  function selectKid(id: string, kidAge: number, kidName: string) {
    setChildId(id);
    setAge(kidAge);
    void runGenerate(messages, kidAge, "silent", kidName);
  }

  function addKid() {
    const name = newName.trim();
    if (!name) return;
    const a = Math.min(12, Math.max(3, parseInt(newAge, 10) || 7));
    const k = addChild({ name, age: a, interests: [], color: "lime" });
    setAddingKid(false);
    setNewName("");
    selectKid(k.id, k.age, k.name);
  }

  function showToast(m: string) {
    setToast(m);
    window.setTimeout(() => setToast(null), 2500);
  }

  function save() {
    if (!worksheet || !source) return;
    saveWorksheet(worksheet, source, childId || undefined);
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
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
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

      {/* who is this for */}
      <div className="no-print mb-5 flex flex-wrap items-center gap-2">
        <span className="text-sprout-cream/60 text-sm">Making for:</span>
        {kids.map((k) => (
          <button
            key={k.id}
            onClick={() => selectKid(k.id, k.age, k.name)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              childId === k.id ? "bg-[#F4EDE0] text-[#1B3722]" : "text-sprout-cream/80 hover:text-sprout-cream bg-sprout-cream/10 border border-sprout-cream/15"
            }`}
          >
            {k.name} <span className="opacity-60">· {k.age}</span>
          </button>
        ))}
        {addingKid ? (
          <span className="border-sprout-cream/20 bg-sprout-cream/10 inline-flex items-center gap-1 rounded-full border p-1">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKid()} placeholder="Name" autoFocus className="text-sprout-cream placeholder:text-sprout-cream/40 h-7 w-24 bg-transparent px-2 text-sm outline-none" />
            <input value={newAge} onChange={(e) => setNewAge(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKid()} type="number" min={3} max={12} className="text-sprout-cream h-7 w-12 bg-transparent px-1 text-sm outline-none" />
            <button onClick={addKid} className="bg-[#F4EDE0] text-[#1B3722] grid size-7 place-items-center rounded-full">
              <Check className="size-4" />
            </button>
          </span>
        ) : (
          <button onClick={() => setAddingKid(true)} className="text-sprout-cream/80 hover:text-sprout-cream bg-sprout-cream/10 border-sprout-cream/15 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium">
            <UserPlus className="size-4" /> Add child
          </button>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* chat */}
        <div className="no-print border-sprout-cream/15 bg-sprout-cream/[0.06] flex h-[70vh] flex-col rounded-2xl border lg:sticky lg:top-20">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-[#F4EDE0] text-[#1B3722]" : "bg-sprout-cream/10 text-sprout-cream"}`}>{m.content}</div>
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

          {source === "template" && <p className="text-sprout-cream/50 px-4 pb-1 text-[11px]">Sample mode. Add the Venice key in Vercel for full AI generation.</p>}

          <div className="no-print border-sprout-cream/15 flex flex-wrap gap-1.5 border-t px-3 pt-2">
            {INPUT_VOCABULARY.edits.slice(0, 5).map((k) => (
              <button
                key={k.word}
                onClick={() => setInput(k.word)}
                title={k.does}
                className="bg-sprout-cream/10 text-sprout-cream/80 hover:bg-sprout-cream/20 rounded-full px-2 py-0.5 text-[11px] transition"
              >
                {k.word}
              </button>
            ))}
            {INPUT_VOCABULARY.themes.slice(0, 4).map((t) => (
              <button
                key={t.key}
                onClick={() => setInput(`make it about ${t.label.toLowerCase()}`)}
                className="bg-sprout-cream/10 text-sprout-cream/80 hover:bg-sprout-cream/20 rounded-full px-2 py-0.5 text-[11px] transition"
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          <div className="border-sprout-cream/15 flex items-center gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="make it about space, add more questions, harder..."
              className="text-sprout-cream placeholder:text-sprout-cream/40 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
            />
            <button onClick={send} disabled={loading || !input.trim()} aria-label="Send" className="bg-[#F4EDE0] text-[#1B3722] grid size-9 shrink-0 place-items-center rounded-full disabled:opacity-40">
              <Send className="size-4" />
            </button>
          </div>
        </div>

        {/* preview */}
        <div className="min-w-0">
          {/* variation controls */}
          <div className="no-print mb-3 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                setView("editor");
                if (idx > 0) setIdx(idx - 1);
              }}
              disabled={idx <= 0 || loading}
              aria-label="Previous"
              className={`${glassBtn} size-10 px-0`}
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sprout-cream/70 min-w-[110px] text-center text-sm">{worksheet ? `Variation ${idx + 1} of ${variants.length}` : "—"}</span>
            <button
              onClick={() => {
                setView("editor");
                nextVariant();
              }}
              disabled={loading}
              aria-label="Next / new"
              className={`${glassBtn} size-10 px-0`}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ChevronRight className="size-4" />}
            </button>
            <button onClick={regenerate} disabled={loading} className={`${glassBtn} ml-2`}>
              <RefreshCw className="size-4" /> New version
            </button>
            {variants.length > 1 && (
              <button onClick={() => setView(view === "gallery" ? "editor" : "gallery")} className={glassBtn}>
                <LayoutGrid className="size-4" /> {view === "gallery" ? "Editor" : `All ${variants.length}`}
              </button>
            )}
          </div>

          {view === "gallery" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIdx(i);
                    setView("editor");
                  }}
                  className={`rounded-2xl bg-[#FBF7EE] p-4 text-left shadow-[0_12px_30px_-14px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 ${
                    i === idx ? "ring-2 ring-[#F4EDE0]" : "border border-[#2E5A35]/15"
                  }`}
                >
                  <div className="text-[11px] font-semibold tracking-wide text-[#2E5A35] uppercase">Variation {i + 1}</div>
                  <h3 className="mt-1 truncate font-bold text-[#1B3722]">{v.title}</h3>
                  <p className="text-xs text-[#1B3722]/60">{v.subtitle}</p>
                  <p className="mt-2 text-xs text-[#1B3722]/70">{summarize(v)}</p>
                </button>
              ))}
            </div>
          ) : worksheet ? (
            <WorksheetDoc worksheet={worksheet} />
          ) : (
            <div className="text-sprout-cream/60 flex h-[60vh] items-center justify-center rounded-2xl border border-dashed border-sprout-cream/20 text-sm">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Building your first worksheet
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
