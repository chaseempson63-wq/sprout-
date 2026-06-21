"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { GlassCard } from "../_components/Glass";
import { AVATAR_COLORS, colorClasses, useResources } from "@/lib/resources/store";

const inputCls =
  "w-full rounded-xl bg-sprout-cream/10 border border-sprout-cream/20 px-3 py-2.5 text-sm text-sprout-cream placeholder:text-sprout-cream/40 outline-none focus:border-sprout-cream/40 focus:bg-sprout-cream/15 transition-colors";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-sm hover:bg-[#FBF6EB] transition-colors disabled:opacity-50";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 h-11 px-4 rounded-full text-sprout-cream/80 text-sm font-semibold hover:text-sprout-cream hover:bg-sprout-cream/10 transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sprout-cream/90 mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function ResourcesHome() {
  const { ready, kids, resourcesFor, addChild } = useResources();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  if (!ready) {
    return <div className="text-sprout-cream/60 py-20 text-center text-sm">Loading…</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-sprout-cream font-bold tracking-[-0.02em]" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>
          Who are we making something for?
        </h1>
        <p className="text-sprout-cream/70 mt-2 max-w-xl leading-relaxed">
          Pick a child to open their space, or add a new one. Each child keeps their own resources.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kids.map((c) => {
          const cc = colorClasses(c.color);
          const count = resourcesFor(c.id).length;
          return (
            <Link key={c.id} href={`/resources/${c.id}`} className="group block transition hover:-translate-y-0.5">
              <GlassCard className="rounded-3xl p-5" soft>
                <div className="flex items-center gap-3">
                  <span className={`grid size-12 place-items-center rounded-full text-xl font-bold ${cc.bg}`}>
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sprout-cream truncate font-bold">{c.name}</p>
                    <p className="text-sprout-cream/60 text-xs">
                      Age {c.age}
                      {c.level ? ` · ${c.level}` : ""}
                    </p>
                  </div>
                </div>
                {c.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.interests.slice(0, 3).map((it) => (
                      <span key={it} className="bg-sprout-cream/10 text-sprout-cream/80 rounded-full px-2 py-0.5 text-xs">
                        {it}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-sprout-cream/60">
                    {count} {count === 1 ? "resource" : "resources"}
                  </span>
                  <span className="text-sprout-cream inline-flex items-center gap-1 font-semibold">
                    Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </GlassCard>
            </Link>
          );
        })}

        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="border-sprout-cream/25 bg-sprout-cream/[0.04] text-sprout-cream/80 hover:border-sprout-cream/45 hover:bg-sprout-cream/[0.07] hover:text-sprout-cream flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-3xl border border-dashed transition"
          >
            <Plus className="size-6" />
            <span className="font-semibold">Add a child</span>
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
    <form onSubmit={submit} className="mt-6">
      <GlassCard className="rounded-3xl p-5 sm:p-6" soft>
        <h2 className="text-sprout-cream text-lg font-bold">Add a child</h2>
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
          <p className="text-sprout-cream/90 mb-2 text-sm font-medium">Color</p>
          <div className="flex gap-2">
            {AVATAR_COLORS.map((c) => (
              <button
                type="button"
                key={c.key}
                onClick={() => setColor(c.key)}
                aria-label={c.key}
                className={`size-8 rounded-full ${c.bg} ${color === c.key ? "ring-sprout-cream ring-2 ring-offset-2 ring-offset-[#2A5132]" : ""}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button type="submit" className={primaryBtn}>
            Add child
          </button>
          <button type="button" className={ghostBtn} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </GlassCard>
    </form>
  );
}
