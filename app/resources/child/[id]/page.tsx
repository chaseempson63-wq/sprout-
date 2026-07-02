"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { WorksheetDoc } from "../../_components/WorksheetDoc";
import { DocumentNudge } from "../../_components/DocumentNudge";
import { topicForTemplate } from "@/lib/resources/catalog";
import { AVATAR_COLORS, colorClasses, useResources } from "@/lib/resources/store";
import { printWorksheet } from "@/lib/resources/print-fit";
import { capName, firstImageKey } from "@/lib/resources/util";
import { GlassButton, GlassLink } from "@/components/ui/glass";
import type { SavedWorksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-[22px] bg-[#FFFDF6] ring-1 ring-[#2E5A35]/10 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_14px_30px_-14px_rgba(8,22,12,0.55),0_30px_60px_-30px_rgba(8,22,12,0.4)]";
const fieldCls = "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1B3722] outline-none focus:border-[#2E5A35]";

const LEARNING_STYLES = ["Hands-on", "Visual", "Listening & talking", "Reading & writing", "Movement", "Quiet & focused"];

async function downscaleImage(file: File, max = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("image failed"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ChildProfile() {
  const params = useParams();
  const raw = params?.id;
  const id = Array.isArray(raw) ? raw[0] : (raw ?? "");
  const router = useRouter();
  const { ready, getChild, worksheets, updateChild, removeChild, toggleFavorite, removeWorksheet } = useResources();

  const child = ready ? getChild(id) : undefined;
  const mine = ready ? worksheets.filter((w) => w.childId === id) : [];

  const [viewing, setViewing] = useState<SavedWorksheet | null>(null);
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({ name: "", age: "7", birthday: "", color: "lime", photo: "", interests: "", learningStyle: "" });
  const photoRef = useRef<HTMLInputElement>(null);

  if (!ready) return <div className="text-sprout-cream/60 py-20 text-center text-sm">Loading…</div>;
  if (!child) {
    return (
      <div className="py-20 text-center">
        <p className="text-sprout-cream/70">That child was not found.</p>
        <GlassLink href="/resources" className="mt-4 h-10 px-4">
          Back to the library
        </GlassLink>
      </div>
    );
  }

  const cc = colorClasses(child.color);
  const topicsCovered = new Set(mine.map((w) => topicForTemplate(w.meta.templateId)));
  const favorites = mine.filter((w) => w.favorite).length;

  // On web a child profile is just the worksheets made for them, newest first.
  const sortedWorksheets = [...mine].sort((a, b) => b.createdAt - a.createdAt);

  function startEdit() {
    setF({
      name: child!.name,
      age: String(child!.age),
      birthday: child!.birthday ?? "",
      color: child!.color,
      photo: child!.photo ?? "",
      interests: child!.interests.join(", "),
      learningStyle: child!.learningStyle ?? "",
    });
    setEditing(true);
  }
  function saveEdit() {
    updateChild(child!.id, {
      name: f.name.trim() || child!.name,
      age: Math.min(13, Math.max(3, parseInt(f.age, 10) || child!.age)),
      birthday: f.birthday || undefined,
      color: f.color,
      photo: f.photo || undefined,
      interests: f.interests.split(",").map((s) => s.trim()).filter(Boolean),
      learningStyle: f.learningStyle || undefined,
    });
    setEditing(false);
  }
  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await downscaleImage(file);
      setF((s) => ({ ...s, photo: data }));
    } catch {
      /* ignore bad image */
    }
  }
  function del() {
    if (typeof window !== "undefined" && window.confirm(`Remove ${child!.name}? Their saved worksheets stay in your library.`)) {
      removeChild(child!.id);
      router.push("/resources");
    }
  }

  return (
    <div>
      <GlassLink href="/resources" className="no-print mb-5 h-9 gap-1 px-3 text-sm">
        <ArrowLeft className="size-4" /> Library
      </GlassLink>

      <div className={`${lightCard} mb-6 p-6`}>
        {editing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button onClick={() => photoRef.current?.click()} className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full" aria-label="Photo">
                {f.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.photo} alt="" className="size-16 object-cover" />
                ) : (
                  <span className={`grid size-16 place-items-center rounded-full text-2xl font-bold ${colorClasses(f.color).bg}`}>{(f.name || child.name).charAt(0).toUpperCase()}</span>
                )}
                <span className="absolute inset-0 grid place-items-center bg-black/30 text-white opacity-0 transition hover:opacity-100">
                  <ImagePlus className="size-5" />
                </span>
              </button>
              <input ref={photoRef} type="file" accept="image/*" hidden onChange={pickPhoto} />
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <input className={fieldCls} value={f.name} onChange={(e) => setF((s) => ({ ...s, name: e.target.value }))} placeholder="Name" />
                <input className={fieldCls} type="number" min={3} max={13} value={f.age} onChange={(e) => setF((s) => ({ ...s, age: e.target.value }))} placeholder="Age" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#1B3722]/70">Birthday (optional)</span>
                <input className={fieldCls} type="date" value={f.birthday} onChange={(e) => setF((s) => ({ ...s, birthday: e.target.value }))} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#1B3722]/70">Interests and passions</span>
                <input className={fieldCls} value={f.interests} onChange={(e) => setF((s) => ({ ...s, interests: e.target.value }))} placeholder="dinosaurs, drawing, soccer" />
              </label>
            </div>
            <div>
              <span className="mb-1 block text-xs font-medium text-[#1B3722]/70">How they learn best</span>
              <div className="flex flex-wrap gap-1.5">
                {LEARNING_STYLES.map((ls) => (
                  <button
                    key={ls}
                    onClick={() => setF((s) => ({ ...s, learningStyle: s.learningStyle === ls ? "" : ls }))}
                    className={`rounded-full px-3 py-1 text-sm transition ${f.learningStyle === ls ? "bg-[#2E5A35] text-white" : "bg-black/5 text-[#1B3722]/70 hover:bg-black/10"}`}
                  >
                    {ls}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-1 block text-xs font-medium text-[#1B3722]/70">Avatar color</span>
              <div className="flex gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button key={c.key} onClick={() => setF((s) => ({ ...s, color: c.key }))} aria-label={c.key} className={`size-8 rounded-full ${c.bg} ${f.color === c.key ? "ring-2 ring-[#2E5A35] ring-offset-2" : ""}`} />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <GlassButton onClick={saveEdit} className="h-10 px-4 text-sm">
                <Check className="size-4" /> Save profile
              </GlassButton>
              <GlassButton onClick={() => setEditing(false)} className="h-10 px-4 text-sm">
                Cancel
              </GlassButton>
              {f.photo && (
                <GlassButton onClick={() => setF((s) => ({ ...s, photo: "" }))} className="h-10 px-4 text-sm">
                  Remove photo
                </GlassButton>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4">
              {child.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={child.photo} alt={child.name} className="size-16 shrink-0 rounded-full object-cover" />
              ) : (
                <span className={`grid size-16 shrink-0 place-items-center rounded-full text-2xl font-bold ${cc.bg}`}>{capName(child.name).charAt(0)}</span>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#1B3722]">{capName(child.name)}</h1>
                <p className="text-[#1B3722]/60">
                  Age {child.age}
                  {child.birthday ? ` · born ${new Date(child.birthday).toLocaleDateString()}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <GlassButton onClick={startEdit} aria-label="Edit" className="size-9">
                  <Pencil className="size-4" />
                </GlassButton>
                <GlassButton onClick={del} aria-label="Remove" className="size-9">
                  <Trash2 className="size-4" />
                </GlassButton>
              </div>
            </div>
            {(child.learningStyle || child.interests.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {child.learningStyle && <span className="rounded-full bg-[#2E5A35]/12 px-2.5 py-0.5 text-xs font-semibold text-[#2E5A35]">Learns best: {child.learningStyle}</span>}
                {child.interests.map((it) => (
                  <span key={it} className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-[#1B3722]/70">{it}</span>
                ))}
              </div>
            )}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { n: mine.length, l: "worksheets" },
                { n: topicsCovered.size, l: "topics" },
                { n: favorites, l: "favorites" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-[#2E5A35]/8 px-2 py-3 text-center">
                  <div className="text-xl font-bold text-[#2E5A35]">{s.n}</div>
                  <div className="text-[11px] text-[#1B3722]/60">{s.l}</div>
                </div>
              ))}
            </div>
            <GlassLink href="/resources" className="mt-5 h-10 px-4 text-sm">
              <Plus className="size-4" /> Make something for {capName(child.name)}
            </GlassLink>
          </>
        )}
      </div>

      {/* worksheets made for this child, newest first */}
      <h2 className="text-sprout-cream mb-3 text-xl font-bold">Worksheets for {capName(child.name)}</h2>
      {sortedWorksheets.length === 0 ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">No worksheets yet. Make one and it shows up here.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedWorksheets.map((w) => {
            const img = firstImageKey(w);
            return (
              <div key={w.id} className={`${lightCard} group flex flex-col overflow-hidden`}>
                {img && (
                  <button onClick={() => setViewing(w)} className="grid aspect-[4/3] w-full place-items-center overflow-hidden border-b border-black/5 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/resources/illustrations/${img}.webp`} alt="" className="size-full object-contain transition duration-500 group-hover:scale-105" />
                  </button>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <button onClick={() => setViewing(w)} className="min-w-0 flex-1 text-left">
                    <span className="flex items-center gap-2">
                      {w.favorite && <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                      <span className="truncate font-bold text-[#1B3722]">{w.title}</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-[#1B3722]/60">{w.subtitle} · {new Date(w.createdAt).toLocaleDateString()}</span>
                  </button>
                  <div className="mt-3 flex items-center justify-end gap-1 border-t border-black/5 pt-3">
                    <GlassButton onClick={() => toggleFavorite(w.id)} aria-label="Favorite" className="size-8">
                      <Star className={`size-4 ${w.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
                    </GlassButton>
                    <GlassButton onClick={() => removeWorksheet(w.id)} aria-label="Delete" className="size-8">
                      <Trash2 className="size-4" />
                    </GlassButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0F1A12]/80 backdrop-blur-sm">
          <div className="no-print sticky top-0 flex items-center justify-end gap-2 p-4">
            <GlassButton onClick={() => printWorksheet()} className="h-10 px-4 text-sm">
              Print / PDF
            </GlassButton>
            <GlassButton onClick={() => setViewing(null)} className="h-10 px-4 text-sm">
              <X className="size-4" /> Close
            </GlassButton>
          </div>
          <div className="mx-auto w-full max-w-3xl px-4 pb-16">
            <WorksheetDoc worksheet={viewing} />
            <DocumentNudge />
          </div>
        </div>
      )}
    </div>
  );
}
