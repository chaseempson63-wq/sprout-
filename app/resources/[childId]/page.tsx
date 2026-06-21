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
import { Button } from "@/components/ui/button";
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
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-sprout-forest focus:ring-2 focus:ring-sprout-forest/20";

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
        <p className="text-muted-foreground">That child was not found.</p>
        <Button className="mt-4" onClick={() => router.push("/resources")}>
          Back to children
        </Button>
      </div>
    );
  }
  if (!ready || !child) {
    return <div className="text-muted-foreground py-20 text-center text-sm">Loading…</div>;
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
        <div className="no-print bg-sprout-ink text-sprout-cream fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="no-print mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`font-display grid size-11 place-items-center rounded-full text-lg ${cc.bg}`}>
            {child.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl leading-none tracking-tight">{child.name}</h1>
            <p className="text-muted-foreground text-xs">
              Age {child.age}
              {child.level ? ` · ${child.level}` : ""}
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => router.push("/resources")}>
          <ArrowLeft className="size-4" /> Switch child
        </Button>
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
          <h2 className="font-display text-xl">What would you like to make for {child.name} today?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCE_ORDER.map((t) => {
              const Icon = ICONS[t];
              const m = RESOURCE_META[t];
              return (
                <button
                  key={t}
                  onClick={() => startType(t)}
                  className="group border-border hover:border-sprout-forest/40 flex items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                >
                  <span className="bg-sprout-forest/10 text-sprout-forest grid size-10 shrink-0 place-items-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{m.label}</span>
                    <span className="text-muted-foreground mt-0.5 block text-xs">{m.tagline}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl">{child.name + "'s library"}</h2>
            {library.length === 0 ? (
              <p className="text-muted-foreground mt-2 text-sm">
                Nothing saved yet. Make something above and save it here.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {library.map((r) => (
                  <div key={r.id} className="border-border flex items-center justify-between gap-3 rounded-xl border bg-white p-3 shadow-sm">
                    <button onClick={() => setViewing(r)} className="min-w-0 flex-1 text-left">
                      <span className="flex items-center gap-2">
                        {r.favorite && <Star className="size-3.5 fill-amber-400 text-amber-400" />}
                        <span className="truncate font-medium">{r.title}</span>
                      </span>
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        {RESOURCE_META[r.meta.type].label} · {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => toggleFavorite(r.id)}
                        aria-label="Favorite"
                        className="hover:bg-muted text-muted-foreground rounded-md p-1.5"
                      >
                        <Star className={`size-4 ${r.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                      <button
                        onClick={() => {
                          removeResource(r.id);
                          showToast("Deleted");
                        }}
                        aria-label="Delete"
                        className="hover:bg-muted text-muted-foreground rounded-md p-1.5"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {showForm && type && (
        <div className="border-border rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="text-sprout-forest flex items-center gap-2">
            {(() => {
              const Icon = ICONS[type];
              return <Icon className="size-5" />;
            })()}
            <h2 className="font-display text-xl">{RESOURCE_META[type].label}</h2>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            For {child.name}, age {child.age}. Change anything below, then generate.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">Topic</span>
              <input
                className={inputCls}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={RESOURCE_META[type].sampleTopic}
                autoFocus
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Subject</span>
              <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Interests</span>
              <input
                className={inputCls}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="horses, space"
              />
            </label>
          </div>

          <div className="mt-4">
            <span className="mb-1 block text-sm font-medium">Difficulty</span>
            <div className="border-border inline-flex rounded-lg border p-0.5">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    difficulty === d.key ? "bg-sprout-forest text-sprout-cream" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-destructive mt-4 text-sm">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="lg"
              onClick={generate}
              disabled={generating}
              className="bg-sprout-lime text-sprout-ink hover:bg-sprout-lime/90"
            >
              {generating ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Generate
                </>
              )}
            </Button>
            <Button size="lg" variant="ghost" onClick={resetToBrowse} disabled={generating}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showResult && result && (
        <div>
          <div className="no-print mb-4 flex flex-wrap items-center gap-2">
            <Button size="lg" onClick={save} className="bg-sprout-forest text-sprout-cream hover:bg-sprout-forest/90">
              <Check className="size-4" /> {`Save to ${child.name}'s library`}
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.print()}>
              <Download className="size-4" /> Download PDF
            </Button>
            <Button size="lg" variant="outline" onClick={generate} disabled={generating}>
              {generating ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Regenerate
            </Button>
            <Button size="lg" variant="ghost" onClick={resetToBrowse}>
              Start over
            </Button>
            {result.source === "template" && (
              <span className="text-muted-foreground ml-auto text-xs">Sample mode · add a Venice key for full AI</span>
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
        <Button size="lg" variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button size="lg" variant="outline" onClick={onPrint}>
          <Download className="size-4" /> Download PDF
        </Button>
        <Button size="lg" variant="outline" onClick={onFavorite}>
          <Star className={`size-4 ${resource.favorite ? "fill-amber-400 text-amber-400" : ""}`} />{" "}
          {resource.favorite ? "Favorited" : "Favorite"}
        </Button>
        <Button size="lg" variant="ghost" onClick={onDelete}>
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>
      <ResourceDoc resource={resource} />
    </div>
  );
}
