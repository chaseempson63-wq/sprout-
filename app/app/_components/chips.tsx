import type { Kid } from "@/lib/sprout/types";
import type { Subject } from "@/lib/sprout/subjects";

export function KidAvatar({ kid, size = 18 }: { kid: Kid; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: kid.color, fontSize: size * 0.5 }}
    >
      {kid.name[0]}
    </span>
  );
}

export function KidChip({ kid }: { kid: Kid }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <KidAvatar kid={kid} />
      <span className="text-xs font-medium text-app-pine/70">{kid.name}</span>
    </span>
  );
}

export function SubjectChip({ subject }: { subject: Subject }) {
  const Icon = subject.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
      style={{ backgroundColor: `${subject.color}14`, color: subject.color }}
    >
      <Icon size={12} strokeWidth={2.25} aria-hidden="true" />
      {subject.label}
    </span>
  );
}
