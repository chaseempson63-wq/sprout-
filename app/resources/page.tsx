"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AVATAR_COLORS, colorClasses, useResources } from "@/lib/resources/store";

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-sprout-forest focus:ring-2 focus:ring-sprout-forest/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function ResourcesHome() {
  const { ready, kids, resourcesFor, addChild } = useResources();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  if (!ready) {
    return <div className="text-muted-foreground py-20 text-center text-sm">Loading…</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-tight">Who are we making something for?</h1>
        <p className="text-muted-foreground mt-1">
          Pick a child to open their space, or add a new one. Each child keeps their own resources.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kids.map((c) => {
          const cc = colorClasses(c.color);
          const count = resourcesFor(c.id).length;
          return (
            <Link
              key={c.id}
              href={`/resources/${c.id}`}
              className="group border-border hover:border-sprout-forest/40 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className={`font-display grid size-12 place-items-center rounded-full text-xl ${cc.bg}`}>
                  {c.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{c.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Age {c.age}
                    {c.level ? ` · ${c.level}` : ""}
                  </p>
                </div>
              </div>
              {c.interests.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.interests.slice(0, 3).map((it) => (
                    <span key={it} className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                      {it}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {count} {count === 1 ? "resource" : "resources"}
                </span>
                <span className="text-sprout-forest inline-flex items-center gap-1 font-medium">
                  Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}

        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="border-sprout-forest/30 text-sprout-forest hover:border-sprout-forest/60 flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed bg-white/50 p-5 transition hover:bg-white"
          >
            <Plus className="size-6" />
            <span className="font-medium">Add a child</span>
          </button>
        )}
      </div>

      {adding && (
        <AddChildForm
          onCancel={() => setAdding(false)}
          onAdd={(data) => {
            const child = addChild(data);
            router.push(`/resources/${child.id}`);
          }}
        />
      )}
    </div>
  );
}

function AddChildForm({
  onAdd,
  onCancel,
}: {
  onAdd: (d: { name: string; age: number; interests: string[]; level: string; color: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("8");
  const [interests, setInterests] = useState("");
  const [level, setLevel] = useState("");
  const [color, setColor] = useState(AVATAR_COLORS[0].key);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      age: Math.min(18, Math.max(3, parseInt(age, 10) || 8)),
      interests: interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      level: level.trim(),
      color,
    });
  }

  return (
    <form onSubmit={submit} className="border-border mt-6 rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-display text-lg">Add a child</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mia" autoFocus />
        </Field>
        <Field label="Age">
          <input type="number" min={3} max={18} className={inputCls} value={age} onChange={(e) => setAge(e.target.value)} />
        </Field>
        <Field label="Interests (comma separated)">
          <input className={inputCls} value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="horses, space, dinosaurs" />
        </Field>
        <Field label="Level (optional)">
          <input className={inputCls} value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. Year 3, early reader" />
        </Field>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Color</p>
        <div className="flex gap-2">
          {AVATAR_COLORS.map((c) => (
            <button
              type="button"
              key={c.key}
              onClick={() => setColor(c.key)}
              aria-label={c.key}
              className={`size-8 rounded-full ${c.bg} ${color === c.key ? "ring-sprout-forest ring-2 ring-offset-2" : ""}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Button type="submit" size="lg" className="bg-sprout-forest text-sprout-cream hover:bg-sprout-forest/90">
          Add child
        </Button>
        <Button type="button" size="lg" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
