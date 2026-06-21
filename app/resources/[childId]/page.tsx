"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Check,
  ClipboardList,
  Download,
  FlaskConical,
  Hammer,
  Layers,
  Loader2,
  PenLine,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { GlassCard } from "../../_components/Glass";
import { RESOURCE_META, RESOURCE_ORDER } from "@/lib/resources/catalog";
import { colorClasses, useResources } from "@/lib/resources/store";
import type { Difficulty, GeneratedResource, GenerateInput, ResourceType, SavedResource } from "@/lib/resources/types";
import { ResourceDoc } from "../_components/ResourceDoc";

const ICONS: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  math: Calculator,
  reading: BookOpen,
  writing: PenLine,
  science: FlaskConical,
  "unit-study": Layers,
  "lesson-plan": ClipboardList,
  project: Hammer,
};

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: "easier", label: "Gentle" },
  { key: "on-level", label: "On level" },
  { key: "challenge", label: "Challenge" },
];

const inputCls =
  "w-full rounded-xl bg-sprout-cream/10 border border-sprout-cream/20 px-3 py-2.5 text-sm text-sprout-cream placeholder:text-sprout-cream/40 outline-none focus:border-sprout-cream/40 focus:bg-sprout-cream/15 transition-colors";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-sm hover:bg-[#FBF6EB] transition-colors disabled:opacity-50";
const glassBtn =
  "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-sprout-cream/10 border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors backdrop-blur-md disabled:opacity-50";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 h-11 px-4 rounded-full text-sprout-cream/80 text-sm font-semibold hover:text-sprout-cream hover:bg-sprout-cream/10 transition-colors";

export default function ChildSpace() {
  const params = useParams();
  const raw = params?.childId;
  const childId = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const router = useRouter();
  const { ready, getChild, resourcesFor, saveResource, toggleFavorite, removeResource } = useResources();

  const child = ready ? getChild(childId) : undefined;

  const [type, setType] = useState<ResourceType | null>(null);
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("on-level");
  const [interests, setInterests] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ resource: GeneratedResource; source: "ai" | "template" } | null>(null);
  const [viewing, setViewing] = useState<SavedResource | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (ready && !child) {
    return (
      <div className="py-20 text-center">
        <p className="text-sprout-cream/70">That child was not found.</p>
        <button className={`${primaryBtn} mt-4`} onClick={() => router.push("/resources")}>
          Back to children
        </button>
      </div>
    );
  }
  if (!ready || !child) {
    return <div className="text-sprout-cream/60 py-20 text-center text-sm">Loading…</div>;
  }

  const cc = colorClasses(child.color);
  const library = resourcesFor(child.id);

  function startType(t: ResourceType) {
    setType(t);
    setSubject(RESOURCE_META[t].defaultSubject);
    setTopic("");
    setDifficulty("on-level");
    setInterests(child!.interests.join(", "));
    setResult(null);
    setError(null);
    setViewing(null);
  }

  function resetToBrowse() {
    setType(null);
    setResult(null);
    setError(null);
    setViewing(null);
  }

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  }

  async function generate() {
    if (!type) return;
    setGenerating(true);
    setError(null);
    const input: GenerateInput = {
      type,
      childName: child!.name,
      age: child!.age,
      level: child!.level,
      subject,
      topic,
      interests: interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      difficulty,
    };
    try {
      const res = await fetch("/api/resources/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { resource: GeneratedResource; source: "ai" | "template" };
      setResult(data);
    } catch {
      setError("Something went wrong generating that. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  function save() {
    if (!result) return;
    saveResource(child!.id, result.resource, result.source);
    showToast(`Saved to ${child!.name}'s library`);
    resetToBrowse();
  }

  const showForm = type !== null && !result && !viewing;
  const showResult = result !== null && !viewing;
  const showBrowse = type === null && !result && !viewing;

  return (
    <div>
      {toast && (
        <div className="no-print text-sprout-cream border-sprout-cream/15 fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full border bg-[#0F1A12] px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="no-print mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid size-11 place-items-center rounded-full text-lg font-bold ${cc.bg}`}>
            {child.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-sprout-cream text-2xl leading-none font-bold tracking-[-0.02em]">{child.name}</h1>
            <p className="text-sprout-cream/60 mt-1 text-xs">
              Age {child.age}
              {child.level ? ` · ${child.level}` : ""}
            </p>
          </div>
        </div>
        <button className={ghostBtn} onClick={() => router.push("/resources")}>
          <ArrowLeft className="size-4" /> Switch child
        </button>
      </div>

      {viewing && (
        <ViewSaved
          resource={viewing}
          onBack={() => setViewing(null)}
          onPrint={() => window.print()}
          onFavorite={() => {
            toggleFavorite(viewing.id);
            setViewing({ ...viewing, favorite: !viewing.favorite });
          }}
          onDelete={() => {
            removeResource(viewing.id);
            setViewing(null);
            showToast("Deleted");
          }}
        />
      )}

      {showBrowse && (
        <>
          <h2 className="text-sprout-cream text-xl font-bold tracking-[-0.01em]">
            What would you like to make for {child.name} today?
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCE_ORDER.map((t) => {
              const Icon = ICONS[t];
              const m = RESOURCE_META[t];
              return (
                <button key={t} onClick={() => startType(t)} className="group block text-left transition hover:-translate-y-0.5">
                  <GlassCard className="rounded-2xl p-4" soft>
                    <div className="flex items-start gap-3">
                      <span className="bg-sprout-cream/10 grid size-10 shrink-0 place-items-center rounded-xl text-[#A4C9A8]">
                        <Icon className="size-5" />
                      </span>
                      <span>
                        <span className="text-sprout-cream block font-bold">{m.label}</span>
                        <span className="text-sprout-cream/60 mt-0.5 block text-xs">{m.tagline}</span>
                      </span>
                    </div>
                  </GlassCard>
                </button>
              );
            })}
          </div>

          <div className="mt-10">
            <h2 className="text-sprout-cream text-xl font-bold tracking-[-0.01em]">{child.name + "'s library"}</h2>
            {library.length === 0 ? (
              <p className="text-sprout-cream/60 mt-2 text-sm">Nothing saved yet. Make something above and save it here.</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {library.map((r) => (
                  <GlassCard key={r.id} className="rounded-xl p-3" soft>
                    <div className="flex items-center justify-between gap-3">
                      <button onClick={() => setViewing(r)} className="min-w-0 flex-1 text-left">
                        <span className="flex items-center gap-2">
                          {r.favorite && <Star className="size-3.5 fill-amber-300 text-amber-300" />}
                          <span className="text-sprout-cream truncate font-medium">{r.title}</span>
                        </span>
                        <span className="text-sprout-cream/55 mt-0.5 block text-xs">
                          {RESOURCE_META[r.meta.type].label} · {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </button>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(r.id)}
                          aria-label="Favorite"
                          className="text-sprout-cream/70 hover:bg-sprout-cream/10 hover:text-sprout-cream rounded-md p-1.5"
                        >
                          <Star className={`size-4 ${r.favorite ? "fill-amber-300 text-amber-300" : ""}`} />
                        </button>
                        <button
                          onClick={() => {
                            removeResource(r.id);
                            showToast("Deleted");
                          }}
                          aria-label="Delete"
                          className="text-sprout-cream/70 hover:bg-sprout-cream/10 hover:text-sprout-cream rounded-md p-1.5"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {showForm && type && (
        <GlassCard className="rounded-3xl p-5 sm:p-6" soft>
          <div className="text-sprout-cream flex items-center gap-2">
            {(() => {
              const Icon = ICONS[type];
              return <Icon className="size-5 text-[#A4C9A8]" />;
            })()}
            <h2 className="text-xl font-bold">{RESOURCE_META[type].label}</h2>
          </div>
          <p className="text-sprout-cream/70 mt-1 text-sm">
            For {child.name}, age {child.age}. Change anything below, then generate.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sprout-cream/90 mb-1.5 block text-sm font-medium">Topic</span>
              <input
                className={inputCls}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={RESOURCE_META[type].sampleTopic}
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-sprout-cream/90 mb-1.5 block text-sm font-medium">Subject</span>
              <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sprout-cream/90 mb-1.5 block text-sm font-medium">Interests</span>
              <input className={inputCls} value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="horses, space" />
            </label>
          </div>

          <div className="mt-4">
            <span className="text-sprout-cream/90 mb-1.5 block text-sm font-medium">Difficulty</span>
            <div className="border-sprout-cream/20 inline-flex rounded-xl border p-0.5">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    difficulty === d.key
                      ? "bg-[#F4EDE0] font-semibold text-[#1B3722]"
                      : "text-sprout-cream/70 hover:text-sprout-cream"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-rose-200">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            <button className={primaryBtn} onClick={generate} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Generate
                </>
              )}
            </button>
            <button className={ghostBtn} onClick={resetToBrowse} disabled={generating}>
              Cancel
            </button>
          </div>
        </GlassCard>
      )}

      {showResult && result && (
        <div>
          <div className="no-print mb-4 flex flex-wrap items-center gap-2">
            <button className={primaryBtn} onClick={save}>
              <Check className="size-4" /> {`Save to ${child.name}'s library`}
            </button>
            <button className={glassBtn} onClick={() => window.print()}>
              <Download className="size-4" /> Download PDF
            </button>
            <button className={glassBtn} onClick={generate} disabled={generating}>
              {generating ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Regenerate
            </button>
            <button className={ghostBtn} onClick={resetToBrowse}>
              Start over
            </button>
            {result.source === "template" && (
              <span className="text-sprout-cream/55 ml-auto text-xs">Sample mode · add a Venice key for full AI</span>
            )}
          </div>
          <ResourceDoc resource={result.resource} />
        </div>
      )}
    </div>
  );
}

function ViewSaved({
  resource,
  onBack,
  onPrint,
  onFavorite,
  onDelete,
}: {
  resource: SavedResource;
  onBack: () => void;
  onPrint: () => void;
  onFavorite: () => void;
  onDelete: () => void;
}) {
  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <button className={ghostBtn} onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </button>
        <button className={glassBtn} onClick={onPrint}>
          <Download className="size-4" /> Download PDF
        </button>
        <button className={glassBtn} onClick={onFavorite}>
          <Star className={`size-4 ${resource.favorite ? "fill-amber-300 text-amber-300" : ""}`} />{" "}
          {resource.favorite ? "Favorited" : "Favorite"}
        </button>
        <button className={ghostBtn} onClick={onDelete}>
          <Trash2 className="size-4" /> Delete
        </button>
      </div>
      <ResourceDoc resource={resource} />
    </div>
  );
}
