"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { track } from "@vercel/analytics";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Download, Globe, LayoutGrid, Loader2, Minus, Plus, RefreshCw, Send, UserPlus } from "lucide-react";
import { WorksheetDoc } from "../_components/WorksheetDoc";
import { AddToKid } from "../_components/AddToKid";
import { DocumentNudge } from "../_components/DocumentNudge";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { getTemplate } from "@/lib/resources/catalog";
import { INPUT_VOCABULARY, presetPrompt } from "@/lib/resources/intent";
import { makerWire, publishWorksheet } from "@/lib/resources/social";
import { printWorksheet } from "@/lib/resources/print-fit";
import { useResources } from "@/lib/resources/store";
import { capName } from "@/lib/resources/util";
import { GlassButton, GlassLink, GlassPanel } from "@/components/ui/glass";
import type { ChatMessage, Worksheet } from "@/lib/resources/types";
import { RESOURCES_DEMO } from "@/lib/resources/demo";
import { ComingSoonPage } from "../_components/ComingSoon";

function summarize(w: Worksheet): string {
  const items = w.blocks.reduce((s, b) => s + (b.items?.length ?? (b.text ? 1 : 0)), 0);
  return `${w.blocks.length} sections · ${items} items`;
}

// Freeform welcome: short, then the starter chips below do the teaching.
const HOW_TO_PROMPT =
  "Tell me what you want and I'll build it. Include the topic, the age, and anything they love. Tap an example below to see how it works, or just start typing.";

// One-tap starter prompts for the freeform builder, written the way a parent
// would actually ask. Tapping one sends it straight in.
const STARTERS = [
  "a science sheet on how grass grows, age 6",
  "addition with dinosaurs, 12 problems, age 7",
  "a reading passage about the moon with 5 questions, age 9",
  "telling time, o'clock and half past, age 6",
  "label the butterfly life cycle, age 8",
  "a story starter about a dragon with lines to write on, age 10",
];

// Big finish buttons mirrored at the bottom of the worksheet, where your hand
// already is when you're done. They sit on the green desk, so per the brand
// rule they're CREAM pills with forest text (see _components/paper.tsx).
const finishBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FFFDF6] px-6 text-base font-bold text-[#1B3722] shadow-[0_14px_30px_-12px_rgba(8,22,12,0.65),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

export default function Builder() {
  const params = useParams();
  const raw = params?.templateId;
  const templateId = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const template = getTemplate(templateId);
  const isCustom = template?.id === "custom"; // freeform "Build your own" entry point

  // Demo stage: build-your-own is teased, not open. Templates stay free.
  if (RESOURCES_DEMO && isCustom) return <ComingSoonPage feature="build" />;
  const { kids, addChild, getChild, saveWorksheet, togglePublish, account } = useResources();

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
  const [publishedIdx, setPublishedIdx] = useState<number | null>(null); // which variant was published (custom only)
  const [savedIdxs, setSavedIdxs] = useState<number[]>([]); // variants already saved, so Save can't double-save
  const didInit = useRef(false);
  const variantsRef = useRef<Worksheet[]>([]);
  const genSeq = useRef(0); // only the latest request's result is applied (kills the race)
  const ageTimer = useRef<number | null>(null); // debounce: stepper taps settle before regenerating
  const chatEnd = useRef<HTMLDivElement>(null);

  const child = getChild(childId);
  const childName = child?.name;
  const worksheet = idx >= 0 ? variants[idx] : null;
  const isSaved = savedIdxs.includes(idx);
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const agentSteps = buildSteps(template?.title ?? "worksheet", age, lastUser);

  // Keep the conversation pinned to the newest message.
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages, loading]);

  function pushVariant(ws: Worksheet) {
    const next = [...variantsRef.current, ws];
    variantsRef.current = next;
    setVariants(next);
    setIdx(next.length - 1);
  }

  async function runGenerate(msgs: ChatMessage[], ageVal: number, kind: "init" | "send" | "silent", nameVal?: string, nudge?: string) {
    if (!template) return;
    const myseq = ++genSeq.current; // claim the latest slot
    setLoading(true);
    const start = Date.now();
    const sent = nudge ? [...msgs, { role: "user" as const, content: nudge }] : msgs;
    try {
      const res = await fetch("/api/resources/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templateId: template.id, age: ageVal, childName: nameVal, messages: sent }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { worksheet: Worksheet; source: "ai" | "template" };
      if (myseq !== genSeq.current) return; // a newer request superseded this one; drop it
      pushVariant(data.worksheet);
      setSource(data.source);
      track("resources_generate", { template: template.id, age: ageVal, source: data.source });
      if (kind === "init") {
        setMessages([
          {
            role: "assistant",
            content: `Fresh worksheet ready below. Tell me what to change: a theme like space or dinosaurs, make it harder or easier, or add more questions. Or use the arrows to flick through new versions.`,
          },
        ]);
      } else if (kind === "send") {
        setMessages((prev) => [...prev, { role: "assistant", content: "Done, here is the updated version. Anything else?" }]);
      }
    } catch {
      if (myseq === genSeq.current && kind !== "silent") setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Try that again." }]);
    } finally {
      if (myseq === genSeq.current) {
        // Templates render instantly (deterministic engine, no AI call), so show
        // them the moment they land. Only the freeform "build your own" path has
        // a real wait worth cushioning with a minimum beat.
        if (template.id === "custom") {
          const elapsed = Date.now() - start;
          if (elapsed < 900) await new Promise((r) => window.setTimeout(r, 900 - elapsed));
        }
        if (myseq === genSeq.current) setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (didInit.current || !template) return;
    didInit.current = true;
    if (template.id === "custom") {
      // The library's prompt bar hands its text over via ?prompt= — build it
      // straight away so the hero action lands in one step. Otherwise teach
      // how to prompt and wait (never auto-generate a blank freeform sheet).
      const handed = new URLSearchParams(window.location.search).get("prompt")?.trim();
      if (handed) {
        const promptAge = parseAge(handed);
        if (promptAge) setAge(promptAge);
        const msgs: ChatMessage[] = [{ role: "user", content: handed }];
        setMessages(msgs);
        void runGenerate(msgs, promptAge ?? age, "send", undefined);
      } else {
        setMessages([{ role: "assistant", content: HOW_TO_PROMPT }]);
      }
    } else {
      void runGenerate([], age, "init", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!template) {
    return (
      <div className="py-20 text-center">
        <p className="text-sprout-cream/70">That template was not found.</p>
        <GlassLink href="/resources" className="mt-4 h-10 px-4">
          Back to the library
        </GlassLink>
      </div>
    );
  }

  function send(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text) return; // never block on loading: a new send supersedes the in-flight one
    // Age comes from the prompt too: if they name one, it drives the stepper.
    const promptAge = parseAge(text);
    if (promptAge) setAge(promptAge);
    const msgs: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(msgs);
    if (!preset) setInput("");
    void runGenerate(msgs, promptAge ?? age, "send", childName);
  }

  // An edit chip: the bubble shows the one word, Venice receives a fuller,
  // template-specific instruction built from the current stepper age.
  function sendPreset(word: string) {
    if (!template) return;
    const masked = presetPrompt(word, template.id, age);
    const msgs: ChatMessage[] = [...messages, { role: "user", content: masked, display: word }];
    setMessages(msgs);
    void runGenerate(msgs, age, "send", childName);
  }

  function regenerate() {
    if (loading) return;
    void runGenerate(messages, age, "silent", childName, "Make a fresh, different version of this worksheet with different numbers, examples and wording.");
  }

  function nextVariant() {
    if (idx < variants.length - 1) setIdx(idx + 1);
    else regenerate();
  }

  // The stepper is the difficulty dial (the locked rule: it is the ONLY thing
  // that drives difficulty). Taps settle for a beat, then the sheet rebuilds at
  // the new age. Before the first sheet exists it just sets the number.
  function stepAge(next: number) {
    const a = Math.min(13, Math.max(3, next));
    setAge(a);
    if (ageTimer.current) window.clearTimeout(ageTimer.current);
    if (idx >= 0) {
      ageTimer.current = window.setTimeout(() => {
        void runGenerate(messages, a, "silent", childName);
      }, 650);
    }
  }

  // Picking a kid MAY set the stepper to their age, but never overrides it after.
  function selectKid(id: string, kidAge: number, kidName: string) {
    setChildId(id);
    setAge(kidAge);
    // Don't auto-generate before the user has made a sheet.
    if (idx >= 0) void runGenerate(messages, kidAge, "silent", kidName);
  }

  function addKid() {
    const name = newName.trim();
    if (!name) return;
    const a = Math.min(13, Math.max(3, parseInt(newAge, 10) || 7));
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
    if (!worksheet || !source || isSaved) return;
    saveWorksheet(worksheet, source, childId || undefined);
    setSavedIdxs((p) => [...p, idx]);
    track("resources_save", { template: template?.id ?? "" });
    showToast("Saved to your worksheets");
  }

  function print() {
    track("resources_print", { template: template?.id ?? "" });
    printWorksheet();
  }

  // Only build-your-own sheets are publish-eligible. Saves a local copy and
  // publishes it to the shared community DB (degrades gracefully when off).
  async function publishCustom() {
    if (!worksheet || !source || !isCustom) return;
    if (!account) {
      showToast("Add your name first. Tap Create profile, top right.");
      return;
    }
    const saved = saveWorksheet(worksheet, source, childId || undefined);
    togglePublish(saved.id);
    setPublishedIdx(idx);
    const res = await publishWorksheet(makerWire(account), worksheet);
    if (res.id) {
      track("resources_publish", {});
      showToast("Published to the community");
    } else if (res.disabled) showToast("Saved to your worksheets. The community is offline right now.");
    else showToast(res.error || "Saved to your worksheets. Could not publish right now.");
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
        <div className="flex min-w-0 items-center gap-3">
          <GlassLink href="/resources" className="h-9 shrink-0 gap-1 px-3 text-sm">
            <ArrowLeft className="size-4" /> Library
          </GlassLink>
          <span className="text-sprout-cream flex min-w-0 items-center gap-2.5 text-lg font-bold sm:text-2xl">
            {isCustom && (
              <span className="bg-sprout-cream grid size-8 shrink-0 place-items-center rounded-xl shadow-sm sm:size-9">
                <SproutMascotIcon className="size-5 sm:size-6" />
              </span>
            )}
            <span className="truncate">{template.title}</span>
          </span>
        </div>
        {/* One pill, three actions — icons that pop their label out on hover, like the nav. */}
        <div className="border-sprout-cream/20 bg-sprout-cream/10 flex shrink-0 items-center gap-1 rounded-full border p-1 backdrop-blur-sm">
          <ActionItem icon={Check} label={isSaved ? "Saved" : "Save"} onClick={save} disabled={!worksheet || isSaved} />
          {isCustom && (
            <ActionItem icon={Globe} label={publishedIdx === idx ? "Published" : "Publish"} onClick={() => void publishCustom()} disabled={!worksheet || publishedIdx === idx} />
          )}
          <ActionItem icon={Download} label="PDF" onClick={print} disabled={!worksheet} />
        </div>
      </div>

      {/* who is this for + the difficulty dial. The stepper age is the ONLY
          thing that drives difficulty; a kid chip just sets it to their age. */}
      <div className="no-print mb-6 flex flex-wrap items-center gap-2">
        <div className="border-sprout-cream/20 bg-sprout-cream/10 flex items-center gap-0.5 rounded-full border p-1">
          <button
            type="button"
            onClick={() => stepAge(age - 1)}
            disabled={age <= 3}
            aria-label="Younger"
            className="text-sprout-cream hover:bg-sprout-cream hover:text-sprout-ink grid size-8 place-items-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-35"
          >
            <Minus className="size-4" />
          </button>
          <span className="text-sprout-cream min-w-[3.6rem] text-center text-sm font-bold">Age {age}</span>
          <button
            type="button"
            onClick={() => stepAge(age + 1)}
            disabled={age >= 13}
            aria-label="Older"
            className="text-sprout-cream hover:bg-sprout-cream hover:text-sprout-ink grid size-8 place-items-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-35"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <span className="text-sprout-cream/60 ml-1 text-sm">Making for:</span>
        {kids.map((k) => (
          <GlassButton
            key={k.id}
            onClick={() => selectKid(k.id, k.age, k.name)}
            className={`h-9 px-3 text-sm ${childId === k.id ? "ring-2 ring-[#2E5A35]/45" : ""}`}
          >
            {capName(k.name)} <span className="opacity-60">· {k.age}</span>
          </GlassButton>
        ))}
        {addingKid ? (
          <GlassPanel radius="rounded-full" className="text-[#1B3722]">
            <div className="flex items-center gap-1 p-1">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKid()} placeholder="Name" autoFocus className="h-7 w-24 bg-transparent px-2 text-sm text-[#1B3722] outline-none placeholder:text-[#1B3722]/45" />
              <input value={newAge} onChange={(e) => setNewAge(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKid()} type="number" min={3} max={13} className="h-7 w-12 bg-transparent px-1 text-sm text-[#1B3722] outline-none" />
              <button onClick={addKid} aria-label="Add" className="grid size-7 place-items-center rounded-full hover:bg-black/10">
                <Check className="size-4" />
              </button>
            </div>
          </GlassPanel>
        ) : (
          <GlassButton onClick={() => setAddingKid(true)} className="h-9 gap-1 px-3 text-sm">
            <UserPlus className="size-4" /> Add child
          </GlassButton>
        )}
      </div>

      {/* Mobile shows the worksheet first (the thing you came for) with the chat
          right under it; desktop keeps the sticky chat rail on the left. */}
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8">
        {/* chat — a warm paper sheet, like passing notes with Sprout. The
            assistant writes on paper (soft sage bubbles + mini mascot); you
            write in forest. */}
        <div className="no-print order-2 flex flex-col rounded-[22px] bg-[#FFFDF6] ring-1 ring-[#2E5A35]/10 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_14px_30px_-14px_rgba(8,22,12,0.55)] lg:order-1 lg:sticky lg:top-20 lg:h-[70vh]">
          <div className="flex items-center gap-2 border-b border-[#2E5A35]/10 px-4 py-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-[#2E5A35]/8">
              <SproutMascotIcon className="size-5" />
            </span>
            <span className="text-sm font-bold text-[#1B3722]">Sprout</span>
            <span className="text-xs text-[#1B3722]/45">tell it what to change</span>
          </div>
          <div className="max-h-72 flex-1 space-y-3 overflow-y-auto p-4 lg:max-h-none">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-1 flex justify-end duration-200">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#2E5A35] px-3 py-2 text-sm leading-relaxed text-white">{m.display ?? m.content}</div>
                </div>
              ) : (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-1 flex justify-start duration-200">
                  <AssistantBubble text={m.content} />
                </div>
              ),
            )}
            {/* Freeform starters: teach by example until the first sheet exists. */}
            {isCustom && variants.length === 0 && !loading && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-2xl border border-[#2E5A35]/20 bg-white/70 px-3 py-1.5 text-left text-xs leading-snug text-[#1B3722]/80 transition hover:bg-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="animate-in fade-in flex justify-start">
                <div className="rounded-2xl bg-[#F1F6EC] px-3.5 py-3">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          {(!isCustom || variants.length > 0) && (
            <div className="no-print flex flex-wrap gap-1.5 border-t border-[#2E5A35]/10 px-3 pt-2">
              {INPUT_VOCABULARY.edits.slice(0, 5).map((k) => (
                <button
                  key={k.word}
                  onClick={() => sendPreset(k.word)}
                  title={k.does}
                  className="inline-flex h-7 items-center rounded-full border border-[#2E5A35]/20 bg-white/70 px-3 text-[11px] font-bold text-[#2E5A35] transition hover:bg-white active:scale-95"
                >
                  {k.word}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 border-t border-[#2E5A35]/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder={isCustom ? "Describe the worksheet you want to build..." : "make it about space, add more questions, harder..."}
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#1B3722] outline-none placeholder:text-[#1B3722]/40"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              aria-label="Send"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-[#2E5A35] text-white shadow-sm transition hover:bg-[#346a3f] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
          </div>
        </div>

        {/* preview */}
        <div className="order-1 min-w-0 lg:order-2">
          {/* variation controls */}
          {(!isCustom || variants.length > 0) && (
          <div className="no-print mb-3 flex flex-wrap items-center justify-center gap-2">
            <GlassButton
              onClick={() => {
                setView("editor");
                if (idx > 0) setIdx(idx - 1);
              }}
              disabled={idx <= 0 || loading}
              aria-label="Previous"
              className="size-10"
            >
              <ChevronLeft className="size-4" />
            </GlassButton>
            <span className="text-sprout-cream/70 min-w-[110px] text-center text-sm">{worksheet ? `Variation ${idx + 1} of ${variants.length}` : "…"}</span>
            <GlassButton
              onClick={() => {
                setView("editor");
                nextVariant();
              }}
              disabled={loading}
              aria-label="Next / new"
              className="size-10"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ChevronRight className="size-4" />}
            </GlassButton>
            <GlassButton onClick={regenerate} disabled={loading} className="ml-2 h-10 px-4 text-sm">
              <RefreshCw className="size-4" /> New version
            </GlassButton>
            {variants.length > 1 && (
              <GlassButton onClick={() => setView(view === "gallery" ? "editor" : "gallery")} className="h-10 px-4 text-sm">
                <LayoutGrid className="size-4" /> {view === "gallery" ? "Editor" : `All ${variants.length}`}
              </GlassButton>
            )}
          </div>
          )}

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
          ) : loading ? (
            isCustom ? (
              <ThinkingTrace steps={agentSteps} />
            ) : (
              <div className="py-20 text-center text-sm text-[#1B3722]/50">Building it…</div>
            )
          ) : worksheet ? (
            <div key={idx} className="animate-in fade-in zoom-in-95 slide-in-from-bottom-3 fill-mode-both duration-500">
              <WorksheetDoc worksheet={worksheet} />
              <div className="no-print mt-5 flex flex-wrap items-center justify-center gap-3">
                <button onClick={save} disabled={isSaved} className={finishBtn}>
                  <Check className="size-5" /> {isSaved ? "Saved" : "Save"}
                </button>
                <AddToKid worksheet={worksheet} source={source ?? "ai"} className="h-12 px-6 text-base" />
                {isCustom && (
                  <button onClick={() => void publishCustom()} disabled={publishedIdx === idx} className={finishBtn}>
                    <Globe className="size-5" /> {publishedIdx === idx ? "Published" : "Publish"}
                  </button>
                )}
                <button onClick={print} className={finishBtn}>
                  <Download className="size-5" /> Download PDF
                </button>
              </div>
              <DocumentNudge />
            </div>
          ) : (
            <div className="text-sprout-cream/60 flex h-[38vh] items-center justify-center rounded-2xl border border-dashed border-sprout-cream/20 px-6 text-center text-sm lg:h-[60vh]">
              {isCustom ? "Describe a worksheet in the chat and I'll build it here." : "Pick a child or hit New version and Sprout will build one."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Agentic build steps, shaped by what the parent just asked for.
function buildSteps(templateTitle: string, age: number, lastUser: string): string[] {
  const u = lastUser.toLowerCase();
  const steps = [`Reading the ${templateTitle.toLowerCase()} intent`];
  const theme = INPUT_VOCABULARY.themes.find((t) => u.includes(t.label.toLowerCase()) || u.includes(t.key));
  if (theme) steps.push(`Theming it around ${theme.label.toLowerCase()}`);
  if (u.includes("harder") || u.includes("challeng")) steps.push("Turning up the difficulty");
  else if (u.includes("easier") || u.includes("simpl")) steps.push("Making it a little gentler");
  if (u.includes("more")) steps.push("Adding more problems");
  steps.push(`Writing real problems for age ${age}`, "Laying out the page", "Giving it a final check");
  return steps;
}

// Pull an age out of the prompt ("for a 7 year old", "age 9", "9yo") so the
// builder sizes difficulty from what the parent typed.
function parseAge(text: string): number | null {
  const t = text.toLowerCase();
  const m =
    t.match(/\bage\s*(\d{1,2})\b/) ||
    t.match(/\b(\d{1,2})\s*[-\s]?\s*year[\s-]*olds?\b/) ||
    t.match(/\b(\d{1,2})\s*yo\b/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 3 && n <= 13 ? n : null;
}

// One action in the builder's segmented pill — icon at rest, label pops out on
// hover (mobile keeps the label inline so the buttons stay legible without hover).
function ActionItem({ icon: Icon, label, onClick, disabled }: { icon: ComponentType<{ className?: string }>; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="group/act text-sprout-cream/90 hover:bg-sprout-cream hover:text-sprout-ink flex items-center rounded-full px-2.5 py-2 text-sm font-bold transition-colors disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon className="size-4 shrink-0" />
      <span className="max-w-[5rem] overflow-hidden pl-1.5 whitespace-nowrap opacity-100 transition-all duration-200 md:max-w-0 md:pl-0 md:opacity-0 md:group-hover/act:max-w-[5rem] md:group-hover/act:pl-1.5 md:group-hover/act:opacity-100">
        {label}
      </span>
    </button>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 animate-bounce rounded-full bg-[#2E5A35]/50" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </span>
  );
}

// Reveals the assistant message word-by-word so replies feel typed, not pasted.
function AssistantBubble({ text }: { text: string }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const words = text.split(" ");
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setShown(words.slice(0, i).join(" "));
      if (i >= words.length) {
        window.clearInterval(t);
        setDone(true);
      }
    }, 32);
    return () => window.clearInterval(t);
  }, [text]);
  return (
    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#F1F6EC] px-3 py-2 text-sm leading-relaxed text-[#1B3722]">
      {shown || "​"}
      {!done && <span className="ml-0.5 inline-block h-3.5 w-px -translate-y-px animate-pulse bg-[#2E5A35]/70 align-middle" />}
    </div>
  );
}

// The live "agent at work" trace that plays where the worksheet will land.
function ThinkingTrace({ steps }: { steps: string[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (active >= steps.length - 1) return;
    const t = window.setTimeout(() => setActive((a) => Math.min(a + 1, steps.length - 1)), 720);
    return () => window.clearTimeout(t);
  }, [active, steps.length]);
  return (
    <div className="border-sprout-cream/20 bg-sprout-cream/[0.04] flex h-[38vh] items-center justify-center rounded-2xl border border-dashed p-6 lg:h-[60vh]">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="bg-sprout-cream/95 grid size-11 shrink-0 place-items-center rounded-2xl shadow">
            <SproutMascotIcon className="animate-mascot-float h-7 w-7" />
          </span>
          <div>
            <p className="text-sprout-cream font-semibold">Sprout is building it</p>
            <p className="text-sprout-cream/50 text-xs">grounded in real examples, never filler</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {steps.slice(0, active + 1).map((s, i) => {
            const current = i === active;
            return (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both flex items-center gap-2.5 duration-300">
                {current ? (
                  <Loader2 className="text-sprout-lime size-4 shrink-0 animate-spin" />
                ) : (
                  <span className="bg-sprout-lime/20 text-sprout-lime grid size-4 shrink-0 place-items-center rounded-full">
                    <Check className="size-3" />
                  </span>
                )}
                <span className={`text-sm ${current ? "text-sprout-cream" : "text-sprout-cream/55"}`}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
