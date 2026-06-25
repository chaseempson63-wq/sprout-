"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Download, Globe, LayoutGrid, Loader2, Minus, Plus, RefreshCw, Send, UserPlus } from "lucide-react";
import { WorksheetDoc } from "../_components/WorksheetDoc";
import { SproutMascotIcon } from "../../_components/SproutMascotIcon";
import { getTemplate } from "@/lib/resources/catalog";
import { INPUT_VOCABULARY, presetPrompt } from "@/lib/resources/intent";
import { makerWire, publishWorksheet } from "@/lib/resources/social";
import { useResources } from "@/lib/resources/store";
import { capName } from "@/lib/resources/util";
import { GlassButton, GlassLink, GlassPanel } from "@/components/ui/glass";
import type { ChatMessage, Worksheet } from "@/lib/resources/types";

function summarize(w: Worksheet): string {
  const items = w.blocks.reduce((s, b) => s + (b.items?.length ?? (b.text ? 1 : 0)), 0);
  return `${w.blocks.length} sections · ${items} items`;
}

// Shown first in the freeform builder so a blank input is never intimidating.
const HOW_TO_PROMPT =
  "Tell me what you want and I'll build it. The more you describe, the better it comes out. Try something like: \"a one-page worksheet on the water cycle for a 9-year-old, a short reading part then 5 questions\" or \"beginner addition with a dinosaur theme, 12 problems with answer boxes.\" Helpful to include: the topic, the age, how many questions, and any theme.";

// Big green finish buttons mirrored at the bottom of the worksheet, where your
// hand already is when you're done.
const greenBtn =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2E5A35] px-6 text-base font-bold text-white shadow-[0_12px_28px_-10px_rgba(46,90,53,0.7)] transition hover:-translate-y-0.5 hover:bg-[#346a3f] active:scale-95 disabled:pointer-events-none disabled:opacity-50";

export default function Builder() {
  const params = useParams();
  const raw = params?.templateId;
  const templateId = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const template = getTemplate(templateId);
  const isCustom = template?.id === "custom"; // freeform "Build your own" entry point
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
  const didInit = useRef(false);
  const variantsRef = useRef<Worksheet[]>([]);
  const genSeq = useRef(0); // only the latest request's result is applied (kills the race)
  const ageTimer = useRef<number | null>(null);
  const pendingAge = useRef(age); // tracks the target age across rapid stepper clicks

  const child = getChild(childId);
  const childName = child?.name;
  const worksheet = idx >= 0 ? variants[idx] : null;
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const agentSteps = buildSteps(template?.title ?? "worksheet", age, lastUser);

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
        const elapsed = Date.now() - start;
        if (elapsed < 900) await new Promise((r) => window.setTimeout(r, 900 - elapsed));
        if (myseq === genSeq.current) setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (didInit.current || !template) return;
    didInit.current = true;
    if (template.id === "custom") {
      // Freeform: don't auto-generate a blank sheet — teach how to prompt and wait.
      setMessages([{ role: "assistant", content: HOW_TO_PROMPT }]);
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

  function send() {
    const text = input.trim();
    if (!text) return; // never block on loading: a new send supersedes the in-flight one
    const msgs: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(msgs);
    setInput("");
    void runGenerate(msgs, age, "send", childName);
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

  function changeAge(delta: number) {
    const next = Math.min(13, Math.max(3, pendingAge.current + delta));
    if (next === pendingAge.current) return;
    pendingAge.current = next;
    setAge(next);
    // Only regenerate if a sheet already exists. On Build-your-own, changing the
    // age before the user has prompted must NOT auto-generate a default sheet.
    if (idx < 0) return;
    // Debounce: rapid stepper clicks fire ONE request at the final age (no race).
    if (ageTimer.current) window.clearTimeout(ageTimer.current);
    ageTimer.current = window.setTimeout(() => void runGenerate(messages, next, "silent", childName), 350);
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
    pendingAge.current = kidAge;
    if (ageTimer.current) window.clearTimeout(ageTimer.current);
    // Same guard: don't auto-generate before the user has made a sheet.
    if (idx >= 0) void runGenerate(messages, kidAge, "silent", kidName);
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
    if (res.id) showToast("Published to the community");
    else if (res.disabled) showToast("Saved to your worksheets. The community is offline right now.");
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
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <GlassLink href="/resources" className="h-9 gap-1 px-3 text-sm">
            <ArrowLeft className="size-4" /> Library
          </GlassLink>
          <span className="text-sprout-cream/40">/</span>
          <span className="text-sprout-cream flex items-center gap-2 font-bold">
            <span className="text-xl">{template.emoji}</span> {template.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GlassPanel radius="rounded-full" className="text-[#1B3722]">
            <div className="flex items-center gap-1 p-1">
              <button onClick={() => changeAge(-1)} aria-label="Younger" className="grid size-7 place-items-center rounded-full hover:bg-black/10">
                <Minus className="size-4" />
              </button>
              <span className="px-1 text-sm font-semibold">Age {age}</span>
              <button onClick={() => changeAge(1)} aria-label="Older" className="grid size-7 place-items-center rounded-full hover:bg-black/10">
                <Plus className="size-4" />
              </button>
            </div>
          </GlassPanel>
          <GlassButton onClick={save} disabled={!worksheet} className="h-10 px-4 text-sm">
            <Check className="size-4" /> Save
          </GlassButton>
          {isCustom && (
            <GlassButton onClick={() => void publishCustom()} disabled={!worksheet || publishedIdx === idx} className="h-10 px-4 text-sm">
              <Globe className="size-4" /> {publishedIdx === idx ? "Published" : "Publish"}
            </GlassButton>
          )}
          <GlassButton onClick={() => window.print()} disabled={!worksheet} className="h-10 px-4 text-sm">
            <Download className="size-4" /> PDF
          </GlassButton>
        </div>
      </div>

      {/* who is this for */}
      <div className="no-print mb-7 flex flex-wrap items-center gap-2">
        <span className="text-sprout-cream/60 text-sm">Making for:</span>
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
              <input value={newAge} onChange={(e) => setNewAge(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKid()} type="number" min={3} max={12} className="h-7 w-12 bg-transparent px-1 text-sm text-[#1B3722] outline-none" />
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

      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* chat */}
        <div className="no-print border-sprout-cream/15 bg-sprout-cream/[0.06] flex h-[70vh] flex-col rounded-2xl border lg:sticky lg:top-20">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-1 flex justify-end duration-200">
                  <div className="max-w-[85%] rounded-2xl bg-[#F4EDE0] px-3 py-2 text-sm leading-relaxed text-[#1B3722]">{m.display ?? m.content}</div>
                </div>
              ) : (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-1 flex justify-start duration-200">
                  <AssistantBubble text={m.content} />
                </div>
              ),
            )}
            {loading && (
              <div className="animate-in fade-in flex justify-start">
                <div className="bg-sprout-cream/10 rounded-2xl px-3.5 py-3">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {(!isCustom || variants.length > 0) && (
            <div className="no-print border-sprout-cream/15 flex flex-wrap gap-1.5 border-t px-3 pt-2">
              {INPUT_VOCABULARY.edits.slice(0, 5).map((k) => (
                <GlassButton key={k.word} onClick={() => sendPreset(k.word)} title={k.does} className="h-7 gap-1 px-3 text-[11px]">
                  {k.word}
                </GlassButton>
              ))}
            </div>
          )}
          <div className="border-sprout-cream/15 flex items-center gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder={isCustom ? "Describe the worksheet you want to build..." : "make it about space, add more questions, harder..."}
              className="text-sprout-cream placeholder:text-sprout-cream/40 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
            />
            <GlassButton onClick={send} disabled={!input.trim()} aria-label="Send" className="size-9 shrink-0">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </GlassButton>
          </div>
        </div>

        {/* preview */}
        <div className="min-w-0">
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
            <ThinkingTrace steps={agentSteps} />
          ) : worksheet ? (
            <div key={idx} className="animate-in fade-in zoom-in-95 slide-in-from-bottom-3 fill-mode-both duration-500">
              <WorksheetDoc worksheet={worksheet} />
              <div className="no-print mt-5 flex flex-wrap items-center justify-center gap-3">
                <button onClick={save} className={greenBtn}>
                  <Check className="size-5" /> Save
                </button>
                {isCustom && (
                  <button onClick={() => void publishCustom()} disabled={publishedIdx === idx} className={greenBtn}>
                    <Globe className="size-5" /> {publishedIdx === idx ? "Published" : "Publish"}
                  </button>
                )}
                <button onClick={() => window.print()} className={greenBtn}>
                  <Download className="size-5" /> Download PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sprout-cream/60 flex h-[60vh] items-center justify-center rounded-2xl border border-dashed border-sprout-cream/20 px-6 text-center text-sm">
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
  steps.push(`Writing real problems for age ${age}`, "Laying out the page", "Checking the answer key");
  return steps;
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="bg-sprout-cream/60 size-1.5 animate-bounce rounded-full" style={{ animationDelay: `${i * 150}ms` }} />
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
    <div className="bg-sprout-cream/10 text-sprout-cream max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed">
      {shown || "​"}
      {!done && <span className="bg-sprout-cream/70 ml-0.5 inline-block h-3.5 w-px -translate-y-px animate-pulse align-middle" />}
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
    <div className="border-sprout-cream/20 bg-sprout-cream/[0.04] flex h-[60vh] items-center justify-center rounded-2xl border border-dashed p-6">
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
