"use client";

// The profiles area: manage your own profile and your kids' in one place.
// Linked from the Profiles card on the library page. Everything here lives in
// the browser (the privacy promise) — backup/restore sits at the bottom as the
// escape hatch.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus, Pencil, Plus, X } from "lucide-react";
import { BackupControl } from "../_components/BackupControl";
import { sheet } from "../_components/paper";
import { downscaleImage } from "@/lib/resources/image";
import { colorClasses, useResources } from "@/lib/resources/store";
import { capName, newId } from "@/lib/resources/util";
import { RESOURCES_DEMO } from "@/lib/resources/demo";
import { cn } from "@/lib/utils";

const fieldCls = "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1B3722] outline-none focus:border-[#2E5A35]";

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 24) || "me"
  );
}

export default function ProfilesPage() {
  const { ready, account, setAccount, kids, worksheets, addChild } = useResources();
  const router = useRouter();

  // account edit/create state
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // add-kid state
  const [adding, setAdding] = useState(false);
  const [kName, setKName] = useState("");
  const [kAge, setKAge] = useState("7");

  if (!ready) return <div className="text-sprout-cream/60 py-20 text-center text-sm">Loading…</div>;

  function startEdit() {
    setName(account?.displayName ?? "");
    setPhoto(account?.photo ?? "");
    setEditing(true);
  }

  async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await downscaleImage(file));
    } catch {
      /* ignore */
    }
  }

  function saveAccount() {
    const n = name.trim();
    if (!n) return;
    if (account) {
      setAccount({ ...account, displayName: n, photo: photo || undefined });
    } else {
      setAccount({ id: newId(), handle: slug(n), displayName: n, photo: photo || undefined, createdAt: Date.now() });
    }
    setEditing(false);
  }

  function addKid() {
    const nm = kName.trim();
    if (!nm) return;
    const k = addChild({ name: nm, age: Math.min(13, Math.max(3, parseInt(kAge, 10) || 7)), interests: [], color: "lime" });
    setKName("");
    setAdding(false);
    router.push(`/resources/child/${k.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* header */}
      <div className="mb-8 flex items-center gap-3">
        <Link href="/resources" className="border-sprout-cream/20 bg-sprout-cream/10 text-sprout-cream hover:bg-sprout-cream/20 inline-flex h-9 items-center gap-1 rounded-full border px-3 text-sm font-semibold transition">
          <ArrowLeft className="size-4" /> Library
        </Link>
        <h1 className="text-sprout-cream text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Profiles</h1>
      </div>

      {/* your profile */}
      <div className={cn(sheet, "p-5 sm:p-6")}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold tracking-[0.18em] text-[#2E5A35] uppercase">Your profile</span>
          {account && !editing && (
            <button onClick={startEdit} className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-[#2E5A35] transition hover:bg-[#2E5A35]/8">
              <Pencil className="size-3.5" /> Edit
            </button>
          )}
        </div>

        {!editing && account && (
          <div className="mt-4 flex items-center gap-4">
            {account.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={account.photo} alt="" className="size-16 rounded-full object-cover" />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-[#2E5A35] text-2xl font-bold text-white">{capName(account.displayName).charAt(0)}</span>
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-[#1B3722]">{capName(account.displayName)}</p>
              <p className="text-sm text-[#1B3722]/55">@{account.handle}</p>
              {!RESOURCES_DEMO && (
                <Link href={`/resources/creator/${account.handle}`} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#2E5A35] hover:underline">
                  View public page <ArrowRight className="size-3" />
                </Link>
              )}
            </div>
          </div>
        )}

        {!editing && !account && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#1B3722]/70">No profile yet. It puts your name on what you make, right here in your browser.</p>
            <button onClick={startEdit} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#2E5A35] px-4 text-sm font-bold text-white transition hover:bg-[#346a3f]">
              <Plus className="size-4" /> Create profile
            </button>
          </div>
        )}

        {editing && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} aria-label="Add photo" className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-dashed border-[#2E5A35]/30 text-[#2E5A35] transition hover:border-[#2E5A35]/60">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
                ) : (
                  <ImagePlus className="size-5" />
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
              <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveAccount()} placeholder="Your name" autoFocus className={fieldCls} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={saveAccount} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#2E5A35] px-4 text-sm font-bold text-white transition hover:bg-[#346a3f]">
                <Check className="size-4" /> Save
              </button>
              <button onClick={() => setEditing(false)} className="inline-flex h-10 items-center rounded-full px-4 text-sm font-bold text-[#1B3722]/60 transition hover:bg-[#2E5A35]/8">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* your kids */}
      <div className={cn(sheet, "mt-5 p-5 sm:p-6")}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold tracking-[0.18em] text-[#2E5A35] uppercase">Your kids</span>
          {!adding && (
            <button onClick={() => setAdding(true)} className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-[#2E5A35] transition hover:bg-[#2E5A35]/8">
              <Plus className="size-3.5" /> Add a child
            </button>
          )}
        </div>

        {adding && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-[#2E5A35]/12 bg-white p-3">
            <input value={kName} onChange={(e) => setKName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKid()} placeholder="Name" autoFocus className="h-9 min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-2 text-sm text-[#1B3722] outline-none focus:border-[#2E5A35]" />
            <input type="number" min={3} max={13} value={kAge} onChange={(e) => setKAge(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addKid()} aria-label="Age" className="h-9 w-16 rounded-lg border border-black/10 bg-white px-2 text-sm text-[#1B3722] outline-none focus:border-[#2E5A35]" />
            <button onClick={addKid} className="inline-flex h-9 items-center gap-1 rounded-full bg-[#2E5A35] px-3 text-xs font-bold text-white">
              <Check className="size-3.5" /> Add
            </button>
            <button onClick={() => setAdding(false)} aria-label="Cancel" className="rounded-md p-1.5 text-[#1B3722]/50 hover:bg-black/5">
              <X className="size-4" />
            </button>
          </div>
        )}

        {kids.length === 0 && !adding ? (
          <p className="mt-4 text-sm leading-relaxed text-[#1B3722]/60">
            No kids yet. Add one and every worksheet you make for them lands on their page, with their name and the right age already set.
          </p>
        ) : (
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {kids.map((k) => {
              const cc = colorClasses(k.color);
              const count = worksheets.filter((w) => w.childId === k.id).length;
              return (
                <Link key={k.id} href={`/resources/child/${k.id}`} className="group flex items-center gap-3 rounded-2xl border border-[#2E5A35]/12 bg-white p-3 transition hover:border-[#2E5A35]/35">
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-full text-base font-bold", cc.bg)}>{capName(k.name).charAt(0)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-[#1B3722]">{capName(k.name)}</span>
                    <span className="block text-xs text-[#1B3722]/55">
                      age {k.age} · {count} worksheet{count === 1 ? "" : "s"}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-[#2E5A35] transition group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* backup — the escape hatch, tucked down here instead of the library card */}
      <div className={cn(sheet, "mt-5 p-5 sm:p-6")}>
        <span className="text-[11px] font-bold tracking-[0.18em] text-[#2E5A35] uppercase">Backup</span>
        <p className="mt-2 text-sm leading-relaxed text-[#1B3722]/60">
          Everything here lives in your browser, never on our servers. Download a copy to move it to another device or keep it safe.
        </p>
        <div className="mt-3">
          <BackupControl />
        </div>
      </div>
    </div>
  );
}
