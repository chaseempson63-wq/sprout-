"use client";

// Back up / restore everything Sprout keeps in this browser (kids, worksheets,
// account, follows). The privacy promise is that private data never touches a
// server — the honest trade-off is that a cleared browser clears it. This is
// the escape hatch: one tap downloads a JSON copy, one tap restores it, and
// nothing goes anywhere except the user's own file system.

import { useRef, useState } from "react";
import { DownloadCloud, UploadCloud } from "lucide-react";

const PREFIX = "sprout.resources.";
const FILE_KIND = "sprout-resources-backup";

export function BackupControl() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<string | null>(null);

  function say(m: string) {
    setNote(m);
    window.setTimeout(() => setNote(null), 3000);
  }

  function exportAll() {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) data[key] = localStorage.getItem(key) ?? "";
    }
    const payload = { kind: FILE_KIND, exportedAt: new Date().toISOString(), data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sprout-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    say("Backup downloaded. Keep it somewhere safe.");
  }

  async function importAll(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as { kind?: string; data?: Record<string, string> };
      if (parsed.kind !== FILE_KIND || !parsed.data || typeof parsed.data !== "object") throw new Error("not a backup");
      const entries = Object.entries(parsed.data).filter(([k]) => k.startsWith(PREFIX));
      if (entries.length === 0) throw new Error("empty");
      for (const [k, v] of entries) localStorage.setItem(k, v);
      say("Restored. Reloading...");
      window.setTimeout(() => window.location.reload(), 700);
    } catch {
      say("That file doesn't look like a Sprout backup.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#1B3722]/55">
      <span>Lives in this browser only.</span>
      <button type="button" onClick={exportAll} className="inline-flex items-center gap-1 font-semibold text-[#2E5A35] underline-offset-2 hover:underline">
        <DownloadCloud className="size-3.5" /> Back up
      </button>
      <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1 font-semibold text-[#2E5A35] underline-offset-2 hover:underline">
        <UploadCloud className="size-3.5" /> Restore
      </button>
      <input ref={fileRef} type="file" accept="application/json" hidden onChange={importAll} />
      {note && <span className="basis-full text-[#2E5A35]">{note}</span>}
    </div>
  );
}
