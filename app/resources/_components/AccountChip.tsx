"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Check, ImagePlus, UserCircle, X } from "lucide-react";
import { downscaleImage } from "@/lib/resources/image";
import { useResources } from "@/lib/resources/store";

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 24) || "me"
  );
}

export function AccountChip() {
  const { account, setAccount } = useResources();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await downscaleImage(file));
    } catch {
      /* ignore */
    }
  }
  function create() {
    const n = name.trim();
    if (!n) return;
    setAccount({ handle: slug(n), displayName: n, photo: photo || undefined, createdAt: Date.now() });
    setOpen(false);
  }

  if (account) {
    return (
      <Link href={`/resources/creator/${account.handle}`} className="bg-sprout-cream/10 border-sprout-cream/20 text-sprout-cream hover:bg-sprout-cream/15 flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 transition">
        {account.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={account.photo} alt="" className="size-7 rounded-full object-cover" />
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-[#F4EDE0] text-sm font-bold text-[#1B3722]">{account.displayName.charAt(0).toUpperCase()}</span>
        )}
        <span className="text-sm font-semibold">{account.displayName}</span>
      </Link>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-sprout-cream/10 border-sprout-cream/20 text-sprout-cream hover:bg-sprout-cream/15 inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold">
        <UserCircle className="size-4" /> Create profile
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0F1A12]/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#FBF7EE] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1B3722]">Create your creator profile</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-1 text-[#1B3722]/50 hover:bg-black/5">
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-[#1B3722]/60">This is the name shown on everything you make and publish.</p>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => fileRef.current?.click()} className="relative grid size-14 place-items-center overflow-hidden rounded-full bg-[#2E5A35]/10" aria-label="Add photo">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="" className="size-14 object-cover" />
                ) : (
                  <ImagePlus className="size-5 text-[#2E5A35]" />
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
              <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} placeholder="Your name" autoFocus className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-[#1B3722] outline-none focus:border-[#2E5A35]" />
            </div>
            <button onClick={create} disabled={!name.trim()} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#2E5A35] text-sm font-bold text-white disabled:opacity-50">
              <Check className="size-4" /> Create profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}
