"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Pencil, Plus, Sparkles, Star, Trash2, X } from "lucide-react";
import { WorksheetDoc } from "../../_components/WorksheetDoc";
import { topicForTemplate } from "@/lib/resources/catalog";
import { AVATAR_COLORS, colorClasses, useResources } from "@/lib/resources/store";
import { capName } from "@/lib/resources/util";
import type { LearningMoment, SavedWorksheet } from "@/lib/resources/types";

const lightCard =
  "rounded-2xl bg-[#FBF7EE] border border-[#2E5A35]/15 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.7)]";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-sm hover:bg-[#FBF6EB] transition-colors disabled:opacity-50";
const glassBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-sprout-cream/10 border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors";
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
  const { ready, getChild, worksheets, updateChild, removeChild, toggleFavorite, removeWorksheet, momentsFor, addMoment, removeMoment } = useResources();

  const child = ready ? getChild(id) : undefined;
  const mine = ready ? worksheets.filter((w) => w.childId === id) : [];
  const moments = ready ? momentsFor(id) : [];

  const [viewing, setViewing] = useState<SavedWorksheet | null>(null);
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({ name: "", age: "7", birthday: "", color: "lime", photo: "", interests: "", learningStyle: "" });
  const [momentText, setMomentText] = useState("");
  const [momentPhoto, setMomentPhoto] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);
  const momentPhotoRef = useRef<HTMLInputElement>(null);

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

  // feed = creations + moments, newest first
  const feed: ({ kind: "worksheet"; w: SavedWorksheet } | { kind: "moment"; m: LearningMoment })[] = [
    ...mine.map((w) => ({ kind: "worksheet" as const, w, createdAt: w.createdAt })),
    ...moments.map((m) => ({ kind: "moment" as const, m, createdAt: m.createdAt })),
  ]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(({ createdAt: _c, ...rest }) => rest);

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
  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>, target: "profile" | "moment") {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await downscaleImage(file);
      if (target === "profile") setF((s) => ({ ...s, photo: data }));
      else setMomentPhoto(data);
    } catch {
      /* ignore bad image */
    }
  }
  function postMoment() {
    const text = momentText.trim();
    if (!text && !momentPhoto) return;
    addMoment(child!.id, { text: text || "A moment worth keeping.", photo: momentPhoto || undefined });
    setMomentText("");
    setMomentPhoto("");
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
              <input ref={photoRef} type="file" accept="image/*" hidden onChange={(e) => pickPhoto(e, "profile")} />
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
              <button onClick={saveEdit} className={primaryBtn}>
                <Check className="size-4" /> Save profile
              </button>
              <button onClick={() => setEditing(false)} className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-[#1B3722]/60 hover:bg-black/5">
                Cancel
              </button>
              {f.photo && (
                <button onClick={() => setF((s) => ({ ...s, photo: "" }))} className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-[#1B3722]/60 hover:bg-black/5">
                  Remove photo
                </button>
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
              <div className="flex items-center gap-1">
                <button onClick={startEdit} aria-label="Edit" className="rounded-md p-2 text-[#1B3722]/60 hover:bg-black/5">
                  <Pencil className="size-4" />
                </button>
                <button onClick={del} aria-label="Remove" className="rounded-md p-2 text-[#1B3722]/60 hover:bg-black/5">
                  <Trash2 className="size-4" />
                </button>
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
            <div className="mt-5 grid grid-cols-4 gap-3">
              {[
                { n: mine.length, l: "worksheets" },
                { n: topicsCovered.size, l: "topics" },
                { n: favorites, l: "favorites" },
                { n: moments.length, l: "moments" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-[#2E5A35]/8 px-2 py-3 text-center">
                  <div className="text-xl font-bold text-[#2E5A35]">{s.n}</div>
                  <div className="text-[11px] text-[#1B3722]/60">{s.l}</div>
                </div>
              ))}
            </div>
            <Link href="/resources" className={`${primaryBtn} mt-5`}>
              <Plus className="size-4" /> Make something for {capName(child.name)}
            </Link>
          </>
        )}
      </div>

      {/* moment composer */}
      <div className={`${lightCard} mb-6 p-4`}>
        <div className="flex items-start gap-3">
          <Sparkles className="mt-2 size-5 shrink-0 text-[#2E5A35]" />
          <div className="flex-1">
            <textarea
              value={momentText}
              onChange={(e) => setMomentText(e.target.value)}
              placeholder={`Capture a learning moment for ${capName(child.name)}. What they did, said, or made.`}
              rows={2}
              className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1B3722] outline-none focus:border-[#2E5A35]"
            />
            {momentPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={momentPhoto} alt="" className="mt-2 h-28 rounded-lg object-cover" />
            )}
            <div className="mt-2 flex items-center gap-2">
              <button onClick={() => momentPhotoRef.current?.click()} className="inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1.5 text-sm font-medium text-[#1B3722]/70 hover:bg-black/10">
                <ImagePlus className="size-4" /> Photo
              </button>
              <input ref={momentPhotoRef} type="file" accept="image/*" hidden onChange={(e) => pickPhoto(e, "moment")} />
              <button onClick={postMoment} disabled={!momentText.trim() && !momentPhoto} className={`${primaryBtn} ml-auto`}>
                Add moment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* feed */}
      <h2 className="text-sprout-cream mb-3 text-xl font-bold">{capName(child.name) + "'s story"}</h2>
      {feed.length === 0 ? (
        <div className={`${lightCard} p-8 text-center`}>
          <p className="text-[#1B3722]/70">Nothing yet. Make a worksheet or add a learning moment and it shows up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feed.map((entry) =>
            entry.kind === "worksheet" ? (
              <div key={entry.w.id} className={`${lightCard} flex items-center justify-between gap-3 p-4`}>
                <button onClick={() => setViewing(entry.w)} className="min-w-0 flex-1 text-left">
                  <span className="text-[11px] font-semibold tracking-wide text-[#2E5A35] uppercase">Worksheet</span>
                  <span className="flex items-center gap-2">
                    {entry.w.favorite && <Star className="size-3.5 fill-amber-400 text-amber-400" />}
                    <span className="truncate font-bold text-[#1B3722]">{entry.w.title}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-[#1B3722]/60">{entry.w.subtitle} · {new Date(entry.w.createdAt).toLocaleDateString()}</span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => toggleFavorite(entry.w.id)} aria-label="Favorite" className="rounded-md p-1.5 text-[#1B3722]/60 hover:bg-black/5">
                    <Star className={`size-4 ${entry.w.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                  <button onClick={() => removeWorksheet(entry.w.id)} aria-label="Delete" className="rounded-md p-1.5 text-[#1B3722]/60 hover:bg-black/5">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div key={entry.m.id} className={`${lightCard} p-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wide text-[#2E5A35] uppercase">Learning moment</span>
                  <button onClick={() => removeMoment(entry.m.id)} aria-label="Delete" className="rounded-md p-1 text-[#1B3722]/50 hover:bg-black/5">
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mt-1 text-[15px] leading-relaxed text-[#1B3722]">{entry.m.text}</p>
                {entry.m.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={entry.m.photo} alt="" className="mt-2 max-h-64 rounded-lg object-cover" />
                )}
                <p className="mt-2 text-xs text-[#1B3722]/50">{new Date(entry.m.createdAt).toLocaleString()}</p>
              </div>
            ),
          )}
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
