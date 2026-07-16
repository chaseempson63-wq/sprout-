"use client";

import { useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Check, ImagePlus, Shuffle, UserCircle, X } from "lucide-react";
import { downscaleImage } from "@/lib/resources/image";
import { useResources } from "@/lib/resources/store";
import Link from "next/link";
import { capName, newId } from "@/lib/resources/util";
import { GlassButton } from "@/components/ui/glass";
import { pill } from "@/lib/resources/pill";
import { RESOURCES_DEMO } from "@/lib/resources/demo";

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 24) || "me"
  );
}

// Friendly, kid-safe two-word pseudonyms for parents who'd rather stay
// anonymous (a few AU/NZ critters in the mix).
const ANON_ADJ = ["Brave", "Quiet", "Sunny", "Clever", "Gentle", "Merry", "Swift", "Cosy", "Bright", "Curious", "Kind", "Bold", "Happy", "Wild", "Calm", "Wandering"];
const ANON_NOUN = ["Otter", "Wren", "Maple", "Fox", "Robin", "Willow", "Sparrow", "Badger", "Heron", "Finch", "Hare", "Wombat", "Koala", "Possum", "Magpie", "Quokka"];
function randomTwoWordName(): string {
  return `${ANON_ADJ[Math.floor(Math.random() * ANON_ADJ.length)]} ${ANON_NOUN[Math.floor(Math.random() * ANON_NOUN.length)]}`;
}

export function AccountChip() {
  const { account, setAccount } = useResources();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [anon, setAnon] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function toggleAnon() {
    if (anon) {
      setAnon(false);
      setName("");
    } else {
      setAnon(true);
      setPhoto("");
      setName(randomTwoWordName());
    }
  }

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
    setAccount({ id: newId(), handle: slug(n), displayName: n, photo: photo || undefined, bio: bio.trim() || undefined, createdAt: Date.now() });
    setOpen(false);
  }

  if (account) {
    // Demo stage: the public creator pages live behind the community (coming
    // soon), so your own chip goes to the profiles area instead of a tease.
    return (
      <Link href={RESOURCES_DEMO ? "/resources/profile" : `/resources/creator/${account.handle}`} className={pill(false, "h-9 shrink-0 py-1 pr-1.5 pl-1 text-sm sm:pr-3")}>
        {account.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={account.photo} alt="" className="size-7 rounded-full object-cover" />
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-[#2E5A35] text-sm font-bold text-white">{capName(account.displayName).charAt(0)}</span>
        )}
        <span className="hidden font-semibold sm:inline">{capName(account.displayName)}</span>
      </Link>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <button onClick={() => setOpen(true)} aria-label="Create profile" className={pill(false, "h-9 shrink-0 px-3 text-xs")}>
        <UserCircle className="size-4" />
        <span className="hidden sm:inline">Create profile</span>
      </button>
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
          {anon ? (
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#2E5A35]/20 bg-[#2E5A35]/5 px-3 py-2.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#2E5A35] text-base font-bold text-white">{name.charAt(0)}</span>
              <span className="min-w-0 flex-1 truncate font-semibold text-[#1B3722]">{name}</span>
              <button type="button" onClick={() => setName(randomTwoWordName())} aria-label="Shuffle name" className="grid size-9 shrink-0 place-items-center rounded-full text-[#2E5A35] transition hover:bg-[#2E5A35]/10">
                <Shuffle className="size-4" />
              </button>
            </div>
          ) : (
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
          )}

          {/* Bio: optional. A line or two about you. People can use it to share
              what they do (e.g. "I tutor maths, email me") — it shows on your
              public profile. */}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 280))}
            placeholder="A short bio (optional). What you do, what you offer, how to reach you."
            rows={3}
            className="mt-3 w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#1B3722] outline-none focus:border-[#2E5A35]"
          />
          <p className="mt-1 text-right text-[11px] text-[#1B3722]/40">{bio.length}/280</p>

          {/* Anonymous: a random two-word name, no photo. */}
          <button type="button" onClick={toggleAnon} role="switch" aria-checked={anon} className="mt-3 flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1 text-left">
            <span>
              <span className="block text-sm font-semibold text-[#1B3722]">Stay anonymous</span>
              <span className="block text-xs text-[#1B3722]/55">Use a random name, no photo.</span>
            </span>
            <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${anon ? "bg-[#2E5A35]" : "bg-black/15"}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${anon ? "left-[1.375rem]" : "left-0.5"}`} />
            </span>
          </button>
          <GlassButton type="button" onClick={create} disabled={!name.trim()} className="mt-5 h-11 w-full">
            <Check className="size-4" /> Create profile
          </GlassButton>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
