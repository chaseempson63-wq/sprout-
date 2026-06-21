"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { WorksheetDoc } from "../../_components/WorksheetDoc";
import { topicForTemplate, TOPICS } from "@/lib/resources/catalog";
import { colorClasses, useResources } from "@/lib/resources/store";
import type { SavedWorksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-sm hover:bg-[#FBF6EB] transition-colors";
const glassBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-sprout-cream/10 border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors";

export default function ChildProfile() {
  const params = useParams();
  const raw = params?.id;
  const id = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const router = useRouter();
  const { ready, getChild, worksheets, updateChild, removeChild, toggleFavorite, removeWorksheet } = useResources();

  const child = ready ? getChild(id) : undefined;
  const mine = ready ? worksheets.filter((w) => w.childId === id).sort((a, b) => b.createdAt - a.createdAt) : [];

  const [viewing, setViewing] = useState<SavedWorksheet | null>(null);
  const [editing, setEditing] = useState(false);
  const [eName, setEName] = useState("");
  const [eAge, setEAge] = useState("7");

  if (!ready) return <div className="text-sprout-cream/60 py-20 text-center text-sm">Loading…</div>;

  if (!child) {
    return (
      <div className="py-20 text-center">
        <p className="text-sprout-cream/70">That child was not found.</p>
        <Link href="/resources" className={`${primaryBtn} mt-4`}>
          Back to the library
        </Link>
      </div>
    );
  }

  const cc = colorClasses(child.color);
  const topicsCovered = new Set(mine.map((w) => topicForTemplate(w.meta.templateId)));
  const favorites = mine.filter((w) => w.favorite).length;

  function startEdit() {
    setEName(child!.name);
    setEAge(String(child!.age));
    setEditing(true);
  }
  function saveEdit() {
    updateChild(child!.id, { name: eName.trim() || child!.name, age: Math.min(13, Math.max(3, parseInt(eAge, 10) || child!.age)) });
    setEditing(false);
  }
  function del() {
    if (typeof window !== "undefined" && window.confirm(`Remove ${child!.name}? Their saved worksheets stay in your library.`)) {
      removeChild(child!.id);
      router.push("/resources");
    }
  }

  return (
    <div>
      <Link href="/resources" className="no-print text-sprout-cream/80 hover:text-sprout-cream mb-5 inline-flex items-center gap-1 text-sm font-semibold">
        <ArrowLeft className="size-4" /> Library
      </Link>

      {/* profile header */}
      <div className={`${lightCard} mb-6 p-6`}>
        <div className="flex flex-wrap items-center gap-4">
          <span className={`grid size-16 shrink-0 place-items-center rounded-full text-2xl font-bold ${cc.bg}`}>
            {child.name.charAt(0).toUpperCase()}
          </span>
          {editing ? (
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <input value={eName} onChange={(e) => setEName(e.target.value)} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-lg font-bold text-[#1B3722] outline-none" />
              <input type="number" min={3} max={13} value={eAge} onChange={(e) => setEAge(e.target.value)} className="w-16 rounded-lg border border-black/10 bg-white px-2 py-2 text-[#1B3722] outline-none" />
              <button onClick={saveEdit} className="grid size-9 place-items-center rounded-full bg-[#2E5A35] text-white">
                <Check className="size-4" />
              </button>
              <button onClick={() => setEditing(false)} className="grid size-9 place-items-center rounded-full bg-black/5 text-[#1B3722]">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#1B3722]">{child.name}</h1>
              <p className="text-[#1B3722]/60">Age {child.age}</p>
            </div>
          )}
          {!editing && (
            <div className="flex items-center gap-1">
              <button onClick={startEdit} aria-label="Edit" className="rounded-md p-2 text-[#1B3722]/60 hover:bg-black/5">
                <Pencil className="size-4" />
              </button>
              <button onClick={del} aria-label="Remove" className="rounded-md p-2 text-[#1B3722]/60 hover:bg-black/5">
                <Trash2 className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { n: mine.length, l: mine.length === 1 ? "worksheet" : "worksheets" },
            { n: topicsCovered.size, l: topicsCovered.size === 1 ? "topic" : "topics" },
            { n: favorites, l: "favorites" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-[#2E5A35]/8 px-3 py-3 text-center">
              <div className="text-2xl font-bold text-[#2E5A35]">{s.n}</div>
              <div className="text-xs text-[#1B3722]/60">{s.l}</div>
            </div>
          ))}
        </div>

        {topicsCovered.size > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {[...topicsCovered].map((t) => {
              const topic = TOPICS.find((x) => x.key === t);
              return (
                <span key={t} className="rounded-full bg-[#2E5A35]/10 px-2.5 py-0.5 text-xs font-medium text-[#2E5A35]">
                  {topic?.emoji} {topic?.label ?? t}
                </span>
              );
            })}
          </div>
        )}

        <Link href="/resources" className={`${primaryBtn} mt-5`}>
          <Plus className="size-4" /> Make something for {child.name}
        </Link>
      </div>

      {/* their worksheets */}
      <h2 className="text-sprout-cream mb-3 text-xl font-bold">{child.name + "'s worksheets"}</h2>
      {mine.length === 0 ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">Nothing saved for {child.name} yet. Make a worksheet and save it to build up their collection.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((w) => (
            <div key={w.id} className={`${lightCard} flex items-center justify-between gap-3 p-4`}>
              <button onClick={() => setViewing(w)} className="min-w-0 flex-1 text-left">
                <span className="flex items-center gap-2">
                  {w.favorite && <Star className="size-3.5 fill-amber-400 text-amber-400" />}
                  <span className="truncate font-bold text-[#1B3722]">{w.title}</span>
                </span>
                <span className="mt-0.5 block text-xs text-[#1B3722]/60">
                  {w.subtitle} · {new Date(w.createdAt).toLocaleDateString()}
                </span>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => toggleFavorite(w.id)} aria-label="Favorite" className="rounded-md p-1.5 text-[#1B3722]/60 hover:bg-black/5">
                  <Star className={`size-4 ${w.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
                </button>
                <button onClick={() => removeWorksheet(w.id)} aria-label="Delete" className="rounded-md p-1.5 text-[#1B3722]/60 hover:bg-black/5">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0F1A12]/80 backdrop-blur-sm">
          <div className="no-print sticky top-0 flex items-center justify-end gap-2 p-4">
            <button onClick={() => window.print()} className={glassBtn}>
              Print / PDF
            </button>
            <button onClick={() => setViewing(null)} className={glassBtn}>
              <X className="size-4" /> Close
            </button>
          </div>
          <div className="mx-auto w-full max-w-3xl px-4 pb-16">
            <WorksheetDoc worksheet={viewing} />
          </div>
        </div>
      )}
    </div>
  );
}
