import { capName } from "@/lib/resources/util";

// One avatar, used everywhere an author appears (community cards, forum,
// comments) so the whole thing reads like a native social platform. Shows the
// maker's photo when they have one, otherwise a colored initial.
export function MakerAvatar({
  name,
  photo,
  px = 28,
  className = "",
}: {
  name: string;
  photo?: string;
  px?: number;
  className?: string;
}) {
  const style = { width: px, height: px };
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} alt="" style={style} className={`shrink-0 rounded-full object-cover ${className}`} />
    );
  }
  return (
    <span
      style={{ ...style, fontSize: Math.round(px * 0.42) }}
      className={`grid shrink-0 place-items-center rounded-full bg-[#2E5A35] font-bold text-white ${className}`}
      aria-hidden
    >
      {capName(name).charAt(0)}
    </span>
  );
}
