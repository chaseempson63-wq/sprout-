"use client";

import { useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Check, ImagePlus, UserCircle, X } from "lucide-react";
import { downscaleImage } from "@/lib/resources/image";
import { useResources } from "@/lib/resources/store";
import { capName, newId } from "@/lib/resources/util";
import { GlassButton, GlassLink } from "@/components/ui/glass";

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
    setAccount({ id: newId(), handle: slug(n), displayName: n, photo: photo || undefined, createdAt: Date.now() });
    setOpen(false);
  }

  if (account) {
    return (
      <GlassLink href={`/resources/creator/${account.handle}`} className="h-9 shrink-0 gap-2 py-1 pr-3 pl-1">
        {account.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={account.photo} alt="" className="size-7 rounded-full object-cover" />
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-[#2E5A35] text-sm font-bold text-white">{capName(account.displayName).charAt(0)}</span>
        )}
        <span className="text-sm font-semibold">{capName(account.displayName)}</span>
      </GlassLink>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <GlassButton onClick={() => setOpen(true)} className="h-9 shrink-0 px-3 text-xs">
        <UserCircle className="size-4" /> Create profile
      </GlassButton>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-[#0F1A12]/80 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[101] max-h-[90vh] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-[#FBF7EE] p-6 shadow-2xl outline-none transition-all duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="text-lg font-bold text-[#1B3722]">Create your creator profile</Dialog.Title>
            <GlassButton onClick={() => setOpen(false)} aria-label="Close" className="size-8 shrink-0">
              <X className="size-4" />
            </GlassButton>
          </div>
          <Dialog.Description className="mt-1 text-sm text-[#1B3722]/60">This is the name shown on everything you make and publish.</Dialog.Description>
          <div className="mt-5 flex items-center gap-3">
            <GlassButton type="button" onClick={() => fileRef.current?.click()} aria-label="Add photo" className="size-14 shrink-0">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="absolute inset-0 z-40 size-14 rounded-full object-cover" />
              ) : (
                <ImagePlus className="size-5 text-[#2E5A35]" />
              )}
            </GlassButton>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
            <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} placeholder="Your name" autoFocus className="h-11 flex-1 rounded-lg border border-black/10 bg-white px-3 text-[#1B3722] outline-none focus:border-[#2E5A35]" />
          </div>
          <GlassButton type="button" onClick={create} disabled={!name.trim()} className="mt-5 h-11 w-full">
            <Check className="size-4" /> Create profile
          </GlassButton>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
