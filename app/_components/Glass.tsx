import type { ReactNode } from "react";

export function SproutLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M12 22V13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 13.5C12 9.5 14.5 6 19 6C19 10 16.5 13.5 12 13.5Z" fill="currentColor" />
      <path d="M12 13.5C12 9.5 9.5 6 5 6C5 10 7.5 13.5 12 13.5Z" fill="currentColor" />
    </svg>
  );
}

export function GlassGlow({ tint = "lime" }: { tint?: "lime" | "sage" | "warm" }) {
  const colors = {
    lime: "from-[#94BC8E]/12 via-transparent to-[#76A77A]/4",
    sage: "from-[#A4C9A8]/10 via-transparent to-[#94BC8E]/3",
    warm: "from-[#F4EDE0]/10 via-transparent to-[#94BC8E]/4",
  };
  return (
    <>
      <div className={`absolute -top-24 -right-20 w-72 h-72 rounded-full bg-gradient-to-br ${colors[tint]} blur-3xl pointer-events-none`} />
      <div className={`absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-gradient-to-tr ${colors[tint]} blur-3xl pointer-events-none opacity-50`} />
    </>
  );
}

export function GlassCard({
  children,
  className = "",
  glow = "lime",
  soft = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: "lime" | "sage" | "warm";
  soft?: boolean;
}) {
  const surface = soft
    ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)"
    : "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)";
  const borderColor = soft ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.30)";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: surface,
        backdropFilter: "blur(70px) saturate(220%) brightness(122%) contrast(108%)",
        WebkitBackdropFilter: "blur(70px) saturate(220%) brightness(122%) contrast(108%)",
        border: `1px solid ${borderColor}`,
        boxShadow: `
          inset 1.5px 1.5px 0 rgba(255,255,255,0.55),
          inset -1px -1px 0 rgba(0,0,0,0.10),
          0 2px 6px rgba(0,0,0,0.20),
          0 30px 80px -10px rgba(0,0,0,0.55),
          0 80px 160px -40px rgba(0,0,0,0.30)
        `,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 10% 10%, rgba(255,255,255,0.16) 0%, transparent 55%)",
        }}
      />
      <GlassGlow tint={glow} />
      <div className="relative">{children}</div>
    </div>
  );
}

export const GLASS_CARD_SOFT =
  "relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/3 backdrop-blur-[70px] backdrop-saturate-[2.2] backdrop-brightness-[1.22] backdrop-contrast-[1.08] border border-white/20 shadow-[inset_1.5px_1.5px_0_rgba(255,255,255,0.55),inset_-1px_-1px_0_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.20),0_25px_60px_-10px_rgba(0,0,0,0.5),0_60px_120px_-30px_rgba(0,0,0,0.28)] before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_60%_45%_at_10%_10%,rgba(255,255,255,0.16)_0%,transparent_55%)]";

export function FloatingGlass({
  children,
  className = "",
  tilt,
}: {
  children: ReactNode;
  className?: string;
  tilt?: string;
}) {
  return (
    <div className={className} style={tilt ? { transform: tilt, transformStyle: "preserve-3d" } : undefined}>
      <div
        className="relative overflow-hidden rounded-2xl p-3.5"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
          backdropFilter: "blur(50px) saturate(220%) brightness(125%)",
          WebkitBackdropFilter: "blur(50px) saturate(220%) brightness(125%)",
          border: "1px solid rgba(255,255,255,0.30)",
          boxShadow:
            "inset 1.5px 1.5px 0 rgba(255,255,255,0.55), inset -1px -1px 0 rgba(0,0,0,0.10), 0 20px 40px -8px rgba(0,0,0,0.55), 0 40px 80px -20px rgba(0,0,0,0.35)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 12% 12%, rgba(255,255,255,0.18) 0%, transparent 55%)",
          }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
