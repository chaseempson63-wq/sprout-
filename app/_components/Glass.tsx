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
  glow: _glow = "lime",
  soft = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: "lime" | "sage" | "warm";
  soft?: boolean;
}) {
  void _glow;
  const surface = soft
    ? "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)"
    : "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)";
  const borderColor = soft ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.18)";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: surface,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: `1px solid ${borderColor}`,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 24px -8px rgba(0,0,0,0.32), 0 20px 40px -16px rgba(0,0,0,0.20)",
      }}
    >
      <div className="relative">{children}</div>
    </div>
  );
}

export const GLASS_CARD_SOFT =
  "relative overflow-hidden bg-white/[0.06] backdrop-blur-2xl border border-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_24px_-8px_rgba(0,0,0,0.32),0_20px_40px_-16px_rgba(0,0,0,0.20)]";

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
          background: `
            radial-gradient(ellipse 85% 75% at 35% 35%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.14) 70%, rgba(255,255,255,0.08) 100%),
            linear-gradient(135deg, rgba(27,55,34,0.62) 0%, rgba(15,38,22,0.78) 100%)
          `,
          backdropFilter: "blur(60px) saturate(200%) brightness(95%) contrast(112%)",
          WebkitBackdropFilter: "blur(60px) saturate(200%) brightness(95%) contrast(112%)",
          border: "1px solid rgba(255,255,255,0.38)",
          boxShadow:
            "inset 2px 2px 0 rgba(255,255,255,0.55), inset -1px -1px 0 rgba(0,0,0,0.20), 0 24px 48px -8px rgba(0,0,0,0.70), 0 48px 96px -20px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 12% 12%, rgba(255,255,255,0.22) 0%, transparent 60%)",
          }}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
