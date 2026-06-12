"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSprout } from "@/lib/sprout/store";
import { fileToDataUrl } from "@/lib/sprout/image";
import { SUBJECTS } from "@/lib/sprout/subjects";
import { alpha } from "@/lib/sprout/color";
import type { SubjectId } from "@/lib/sprout/types";
import { KidAvatar } from "../_components/chips";
import { card, Overline } from "../_components/ui";

/* Capture. The whole job: photo or sentence in, tagged to a kid, under
   ten seconds. Everything optional except the moment itself. */

export default function NewMomentPage() {
  const router = useRouter();
  const { ready, kids, addEntry } = useSprout();

  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [note, setNote] = useState("");
  // null = untouched, defaults to every kid ("we did this together").
  const [pickedKids, setPickedKids] = useState<string[] | null>(null);
  const [subjectId, setSubjectId] = useState<SubjectId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedKids = pickedKids ?? kids.map((k) => k.id);
  const canSave = ready && selectedKids.length > 0 && (note.trim().length > 0 || photo);

  async function onPickFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setPhotoBusy(true);
    try {
      setPhoto(await fileToDataUrl(file));
    } catch {
      setError("That photo did not want to load. Try a different one.");
    } finally {
      setPhotoBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function toggleKid(id: string) {
    const next = selectedKids.includes(id)
      ? selectedKids.filter((k) => k !== id)
      : [...selectedKids, id];
    setPickedKids(next);
  }

  function save() {
    if (!canSave) return;
    const saved = addEntry({ kidIds: selectedKids, note, photo, subjectId });
    if (!saved) {
      setError("That could not be saved. Storage on this device might be full.");
      return;
    }
    router.push("/app/timeline");
  }

  return (
    <div className="pb-32">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          aria-label="Cancel"
          className="pressable grid size-10 place-items-center rounded-full border border-app-pine/[0.08] bg-white text-app-forest"
        >
          <X size={18} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <h1 className="font-display text-[18px] font-bold tracking-tight text-app-forest">
          Log a moment
        </h1>
        <span className="size-10" aria-hidden="true" />
      </div>

      <div className="mt-6">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          id="moment-photo"
          onChange={(e) => onPickFile(e.target.files?.[0])}
        />
        {photo ? (
          <div className="relative overflow-hidden rounded-3xl shadow-[0_2px_6px_-2px_rgba(16,40,28,0.08),0_24px_48px_-24px_rgba(16,40,28,0.2)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
            <img
              src={photo}
              alt="The photo you just added"
              className="aspect-[4/3] w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(20,46,34,0.07)]"
            />
            <button
              onClick={() => setPhoto(null)}
              aria-label="Remove photo"
              className="pressable absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-app-pine/70 text-white backdrop-blur"
            >
              <X size={15} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="moment-photo"
            className={cn(
              card,
              "pressable flex h-44 cursor-pointer flex-col items-center justify-center gap-2.5",
            )}
          >
            <span
              className="grid size-13 place-items-center rounded-full text-app-forest shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_14px_rgba(133,176,44,0.4)]"
              style={{ background: "linear-gradient(165deg, #cdf271 0%, #aad63e 90%)" }}
            >
              <Camera size={21} strokeWidth={2.25} aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-app-forest">
              {photoBusy ? "Getting the photo" : "Add a photo"}
            </span>
            <span className="text-xs text-app-pine/50">
              Or skip it, a note is enough
            </span>
          </label>
        )}
      </div>

      <div className="mt-5">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="What did they do? One line is plenty."
          className="w-full resize-none rounded-3xl border border-app-pine/[0.08] bg-white p-4 text-[15px] leading-relaxed text-app-pine shadow-[0_1px_1px_rgba(16,40,28,0.03)] transition-shadow placeholder:text-app-pine/35 focus:outline-none focus:ring-2 focus:ring-app-forest/35"
        />
      </div>

      <div className="mt-6">
        <Overline>Who</Overline>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {kids.map((kid) => {
            const active = selectedKids.includes(kid.id);
            return (
              <button
                key={kid.id}
                onClick={() => toggleKid(kid.id)}
                aria-pressed={active}
                className={cn(
                  "pressable flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                  active
                    ? "bg-app-forest text-app-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    : "border border-app-pine/[0.08] bg-white text-app-forest/70",
                )}
              >
                <KidAvatar kid={kid} size={20} />
                {kid.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Overline>What kind of thing</Overline>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {SUBJECTS.map((subject) => {
            const active = subjectId === subject.id;
            const Icon = subject.icon;
            return (
              <button
                key={subject.id}
                onClick={() => setSubjectId(active ? null : subject.id)}
                aria-pressed={active}
                className={cn(
                  "pressable flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors",
                  !active && "border-app-pine/[0.08] bg-white text-app-pine/65",
                )}
                style={
                  active
                    ? {
                        backgroundColor: alpha(subject.color, 0.08),
                        borderColor: alpha(subject.color, 0.4),
                        color: subject.color,
                      }
                    : undefined
                }
              >
                <Icon size={15} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
                <span className="truncate">{subject.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11.5px] text-app-pine/40">
          Optional. Plenty of learning fits nowhere tidy.
        </p>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#f6f1e3] via-[#f6f1e3]/95 to-transparent pt-8"
        style={{ paddingBottom: "max(1.1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto w-full max-w-lg px-5">
          {error && (
            <p className="mb-3 rounded-2xl bg-[#b04030]/10 px-4 py-3 text-[13px] font-medium text-[#8a2f22]">
              {error}
            </p>
          )}
          <button
            onClick={save}
            disabled={!canSave}
            className="pressable h-[52px] w-full rounded-full text-[15px] font-bold tracking-tight text-app-forest shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_20px_rgba(133,176,44,0.45)] transition-opacity disabled:opacity-40 disabled:shadow-none"
            style={{ background: "linear-gradient(165deg, #cdf271 0%, #aad63e 90%)" }}
          >
            Add to the week
          </button>
        </div>
      </div>
    </div>
  );
}
