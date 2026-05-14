import Link from "next/link";
import { Plus, Mic, Image as ImageIcon, FileText, ArrowRight, Check, Share2, Home as HomeIcon, BarChart3, Settings as SettingsIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   Sprout brand mark, Apple-emoji-inspired 🌱 in pure SVG.
   Two leaves + stem. Used in nav, footer, brand cards, app icon.
   Stupid simple. Matches the brand.
   ───────────────────────────────────────────────────────────────────── */
function SproutLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M12 22V13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 13.5C12 9.5 14.5 6 19 6C19 10 16.5 13.5 12 13.5Z" fill="currentColor" />
      <path d="M12 13.5C12 9.5 9.5 6 5 6C5 10 7.5 13.5 12 13.5Z" fill="currentColor" />
    </svg>
  );
}

/* Subtle internal glow inside the glass — just a hint, not a fill.
   Halved opacity from earlier version per Chase: cards must read as
   transparent glass with a slight color of glow, NOT a colored card. */
function GlassGlow({ tint = "lime" }: { tint?: "lime" | "sage" | "warm" }) {
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

/* ─── Liquid Glass card — true transparent glass ───
   The cards must NOT look like colored panels. They must look like
   physical glass that lets the green show through, refracted lighter.
   - Surface opacity is LOW (8-14% white) so green dominates underneath
   - Heavy backdrop-filter with strong brightness/saturate boost
     creates real refraction — the green behind LIFTS through the glass
   - Edge lighting (top-left bright, bottom-right dark) — the bevel
   - Soft specular highlight (top-left ambient light reflection)
   - Layered shadows for separation off the green
   - Internal glow (<GlassGlow />) is subtle hint only, not a fill */
function GlassCard({
  children,
  className = "",
  glow = "lime",
  soft = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "lime" | "sage" | "warm";
  soft?: boolean;
}) {
  // Much more transparent so green dominates and refracts through
  const surface = soft
    ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)"
    : "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)";
  const borderColor = soft ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.30)";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: surface,
        // Strong backdrop filter = real refraction. Brightness lifts the green
        // through the glass (the tint-shift trick). Saturation makes it pop.
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
      {/* Soft specular highlight — top-left ambient reflection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 45% at 10% 10%, rgba(255,255,255,0.16) 0%, transparent 55%)",
        }}
      />
      {/* Subtle internal glow */}
      <GlassGlow tint={glow} />
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}

/* FAQ <details> uses class string — same liquid-glass recipe */
const GLASS_CARD_SOFT = "relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/3 backdrop-blur-[70px] backdrop-saturate-[2.2] backdrop-brightness-[1.22] backdrop-contrast-[1.08] border border-white/20 shadow-[inset_1.5px_1.5px_0_rgba(255,255,255,0.55),inset_-1px_-1px_0_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.20),0_25px_60px_-10px_rgba(0,0,0,0.5),0_60px_120px_-30px_rgba(0,0,0,0.28)] before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_60%_45%_at_10%_10%,rgba(255,255,255,0.16)_0%,transparent_55%)]";

export default function Home() {
  return (
    <main className="text-sprout-cream min-h-screen overflow-x-hidden relative">

      {/* Continuous green canvas across the entire page (lightened ~15% from v3) */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132] via-[#3D6643] to-[#1B3722]" />
        <div className="absolute inset-0 opacity-[0.10] mix-blend-overlay pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'a\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23a)\'/%3E%3C/svg%3E")'
        }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col">

        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4D7B53]/40 via-transparent to-[#2A5132]/60" />
          <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,400 C320,280 480,520 720,420 C960,320 1120,560 1440,440 L1440,900 L0,900 Z" fill="#76A77A" opacity="0.15" />
            <path d="M0,560 C240,460 560,640 880,540 C1120,460 1280,620 1440,560 L1440,900 L0,900 Z" fill="#4D7B53" opacity="0.4" />
            <path d="M0,700 C320,620 720,800 1100,720 C1300,680 1380,740 1440,720 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.7" />
          </svg>
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[#94BC8E]/15 blur-3xl animate-drift-1" />
          <div className="absolute bottom-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-[#76A77A]/10 blur-3xl animate-drift-2" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-2 text-sprout-cream font-bold text-lg">
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </div>
          <Link
            href="#start"
            className="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/20 text-sprout-cream text-sm font-semibold hover:bg-sprout-cream/15 transition-colors"
          >
            Start free trial
          </Link>
        </nav>

        <div className="relative z-10 flex items-center justify-between px-6 md:px-12 text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <Plus className="w-2.5 h-2.5" strokeWidth={1.5} />
            <span>VOL.01 · ISSUE 26</span>
          </div>
          <div className="flex items-center gap-3">
            <span>AU · NZ · MAY 2026</span>
            <Plus className="w-2.5 h-2.5" strokeWidth={1.5} />
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-3xl w-full">

            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-xs uppercase tracking-[0.25em] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
                For homeschool mums · AU + NZ
              </div>
            </div>

            <h1 className="text-center font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                style={{ fontSize: "clamp(48px, 9vw, 120px)" }}>
              You did more<br />than you think.
            </h1>

            <p className="mt-10 text-center text-sprout-cream/85 leading-relaxed max-w-xl mx-auto"
               style={{ fontSize: "clamp(17px, 1.6vw, 21px)" }}>
              It&apos;s Sunday night and you&apos;re wondering if this week counted.
              Sprout turns the chaos of your week (the voice memos, the photos,
              the bits you scribbled at 9pm) into a beautiful weekly reflection.
              Every Sunday, before bed.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
              <Link
                href="#start"
                className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-base hover:bg-[#FBF6EB] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sprout-cream/40"
              >
                Start your first week free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </Link>
              <p className="text-sm text-sprout-cream/60">
                7 days free · no card required · cancel anytime
              </p>
            </div>

          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between px-6 md:px-12 pb-8 text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <SproutLogo className="w-3 h-3 text-sprout-cream/50" />
            <span>SPROUT·CO</span>
          </div>
          <div className="flex items-center gap-2">
            <span>SCROLL</span>
            <span className="block w-px h-8 bg-sprout-cream/30" />
          </div>
          <div className="font-mono text-[9px]">
            ‖‖‖ ‖‖ ‖‖‖‖ ‖ ‖‖‖
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THE 3AM MOMENT, headline 25% smaller per Chase
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D6643]/0 via-[#4D7B53]/40 to-[#3D6643]/0" />
          <svg className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/3 translate-x-1/3 opacity-30" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="280" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="220" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="160" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="100" fill="#A4C9A8" opacity="0.08" />
          </svg>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#76A77A]/15 blur-3xl animate-drift-1" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          <div className="flex items-center gap-3 mb-12">
            <span className="block w-12 h-px bg-sprout-cream/40" />
            <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">01 · The reason Sprout exists</span>
          </div>

          {/* Headline scaled down 25% per Chase: was clamp(40px,8vw,110px) → now clamp(30px,6vw,82px) */}
          <div className="space-y-2 mb-16">
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              It&apos;s 11:42 PM.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream/65"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              You&apos;re staring
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream/65"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              at the ceiling.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-sprout-cream pt-6 headline-lit"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              Wondering if<br />today counted.
            </h2>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <p className="text-sprout-cream/80 leading-relaxed" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
                You baked. You walked to the library. She wouldn&apos;t stop asking
                about volcanoes. You answered the phone twice during her maths.
                You think she got through one page. Maybe two. The washing&apos;s
                still on the line.
              </p>
              <p className="mt-6 text-sprout-cream leading-relaxed font-bold" style={{ fontSize: "clamp(20px, 2vw, 26px)" }}>
                None of it felt like school.<br />All of it was.
              </p>
            </div>

            {/* Liquid glass quote card */}
            <div className="md:col-span-5">
              <GlassCard className="p-8 rounded-3xl" glow="warm">
                <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/65 font-bold mb-4">
                  ✱ A real homeschool mum
                </div>
                <p className="text-sprout-cream leading-relaxed italic" style={{ fontSize: "clamp(15px, 1.4vw, 17px)" }}>
                  &ldquo;I envision all the other parents judging me and thinking
                  I&apos;m a horrible teacher who is failing my kids. When I hear
                  my daughter stumble over words I was reading at her age, I worry.&rdquo;
                </p>
                <div className="mt-6 text-xs text-sprout-cream/65 uppercase tracking-widest">
                  Verbatim · Hess UnAcademy
                </div>
              </GlassCard>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DIFFERENTIATOR, headline 30% smaller per Chase
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tl from-[#2A5132]/40 via-[#3D6643]/30 to-[#4D7B53]/20" />
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,400 C320,300 720,500 1080,380 C1280,320 1380,400 1440,380 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.4" />
          </svg>
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-[#76A77A]/10 blur-3xl animate-drift-2" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <span className="block w-12 h-px bg-sprout-cream/40" />
            <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">02 · Why Sprout, not another tool</span>
          </div>

          {/* Headline scaled down 30% per Chase: was clamp(36px,6.5vw,88px) → now clamp(25px,4.5vw,62px) */}
          <div className="space-y-2 mb-12">
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream/65"
                style={{ fontSize: "clamp(25px, 4.5vw, 62px)" }}>
              Your iPhone Notes are scattered.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream/65"
                style={{ fontSize: "clamp(25px, 4.5vw, 62px)" }}>
              ChatGPT forgets by next week.
            </h2>
            <h2 className="font-bold tracking-[-0.04em] leading-[0.95] text-sprout-cream pt-4 headline-lit"
                style={{ fontSize: "clamp(25px, 4.5vw, 62px)" }}>
              Sprout remembers everything.
            </h2>
          </div>

          <p className="text-sprout-cream/75 leading-relaxed max-w-2xl mb-20" style={{ fontSize: "clamp(17px, 1.6vw, 20px)" }}>
            You can have all the notes app entries in the world. The draft email
            you keep adding sentences to. The Notion doc, the spreadsheet, the
            ChatGPT chats saved in a folder. None of them <em className="not-italic text-sprout-cream">remember</em> Charlie
            from week to week. None connect this Tuesday to six weeks ago.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

            {[
              {
                title: "iPhone Notes",
                you: "Type fast. Promise to come back to it.",
                get: "A list you scroll past. Forgotten by Friday.",
              },
              {
                title: "ChatGPT",
                you: "Re-explain who Charlie is. Every. Single. Time.",
                get: "An answer that&apos;s gone next session. No memory.",
              },
              {
                title: "Spreadsheets",
                you: "Fill cells. Format columns. Maintain it.",
                get: "Data you don&apos;t read. Another guilt.",
              },
            ].map((alt) => (
              <GlassCard key={alt.title} className="p-7 rounded-3xl" glow="sage" soft>
                <div className="text-sprout-cream/65 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">The alternative</div>
                <h3 className="font-bold tracking-tight text-sprout-cream/90 mb-6" style={{ fontSize: "22px" }}>
                  {alt.title}
                </h3>
                <div className="space-y-4 text-sprout-cream/80" style={{ fontSize: "13.5px", lineHeight: "1.6" }}>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-sprout-cream/65 mb-1">What you do</div>
                    <div dangerouslySetInnerHTML={{ __html: alt.you }} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-sprout-cream/65 mb-1">What you get</div>
                    <div dangerouslySetInnerHTML={{ __html: alt.get }} />
                  </div>
                </div>
              </GlassCard>
            ))}

            {/* Sprout featured card, cream-tinted (30% less creamy: F4EDD9 → F4EDE0) */}
            <div className="relative p-7 rounded-3xl bg-[#F4EDE0] backdrop-blur-xl border-2 border-[#F4EDE0] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5),0_30px_60px_-20px_rgba(0,0,0,0.3)]">
              <div className="text-[#1B3722]/70 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">The Sprout way</div>
              <h3 className="font-bold tracking-tight text-[#1B3722] mb-6 flex items-center gap-2" style={{ fontSize: "22px" }}>
                <SproutLogo className="w-5 h-5 text-[#1B3722]" />
                Sprout
              </h3>
              <div className="space-y-4 text-[#1B3722]/85" style={{ fontSize: "13.5px", lineHeight: "1.6" }}>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#1B3722]/55 mb-1">What you do</div>
                  <div>Drop in a moment. Voice memo, photo, sentence.</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#1B3722]/55 mb-1">What you get</div>
                  <div>A weekly report that knows your kid, references prior weeks, lands Sunday night.</div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-16 max-w-3xl">
            <p className="text-sprout-cream/85 leading-relaxed italic" style={{ fontSize: "clamp(20px, 2.2vw, 28px)" }}>
              &ldquo;To all the mums doing home-based learning and feeling like they are failing.
              I see you. I feel you. I am you.&rdquo;
            </p>
            <div className="mt-4 text-xs text-sprout-cream/65 uppercase tracking-[0.25em]">
              Verbatim · Mum Central · Australia
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS, Apple glass step cards
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4D7B53]/30 via-[#76A77A]/20 to-[#2A5132]/40" />
          <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 C320,100 720,300 1080,180 C1280,120 1380,200 1440,180 L1440,0 L0,0 Z" fill="#76A77A" opacity="0.2" />
            <path d="M0,800 C320,720 720,860 1100,800 C1300,770 1380,820 1440,800 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.5" />
          </svg>
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-[#A4C9A8]/8 blur-3xl animate-drift-1" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <span className="block w-12 h-px bg-sprout-cream/40" />
            <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">03 · How it works</span>
          </div>

          <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream max-w-3xl headline-lit"
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            Three stupid<br />simple steps.
          </h2>

          <p className="mt-8 text-sprout-cream/70 max-w-xl leading-relaxed" style={{ fontSize: "clamp(17px, 1.5vw, 19px)" }}>
            Built for the mum who&apos;s already doing too much.
            No daily goals. No streaks. No guilt.
          </p>

          <div className="mt-20 grid md:grid-cols-3 gap-6">

            {[
              {
                num: "01",
                icon: Mic,
                title: "Drop in a moment.",
                body: "Voice memo while you fold the washing. Photo of her drawing. One sentence at 9pm. Tag which kid (or the whole family).",
              },
              {
                num: "02",
                icon: ImageIcon,
                title: "Your moments stack up.",
                body: "Each one saved with the kid it belongs to. No reminders. No 'you missed a day' guilt. Just there when Sunday comes.",
              },
              {
                num: "03",
                icon: FileText,
                title: "Sunday becomes art.",
                body: "Your week becomes a beautiful reflection, one per kid. Builds into monthly snapshots and a full year of growth.",
              },
            ].map((step, i) => (
              <GlassCard
                key={step.num}
                className={`p-8 md:p-10 rounded-3xl group ${i === 1 ? "md:translate-y-12" : ""}`}
                glow={i === 0 ? "lime" : i === 1 ? "sage" : "warm"}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="text-sprout-cream/70 text-[10px] uppercase tracking-[0.3em] font-bold">Step {step.num}</div>
                  <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center border border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    <step.icon className="w-5 h-5 text-sprout-cream" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-bold tracking-tight text-sprout-cream leading-[1.05] mb-4" style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}>
                  {step.title}
                </h3>
                <p className="text-sprout-cream/85 leading-relaxed" style={{ fontSize: "15px" }}>
                  {step.body}
                </p>
              </GlassCard>
            ))}

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THE ARTIFACT, RICH new phone mockup, real app feel
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-bl from-[#76A77A]/30 via-[#4D7B53]/20 to-[#3D6643]/40" />
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,150 C480,30 960,270 1440,130 L1440,0 L0,0 Z" fill="#A4C9A8" opacity="0.15" />
            <path d="M0,750 C480,650 960,890 1440,730 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.4" />
          </svg>
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#94BC8E]/10 blur-3xl animate-drift-2" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="grid md:grid-cols-12 gap-12 items-center">

            <div className="md:col-span-6">
              <div className="flex items-center gap-3 mb-8">
                <span className="block w-12 h-px bg-sprout-cream/40" />
                <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">04 · The Sunday-night moment</span>
              </div>

              <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                  style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
                Watch your week<br />become<br /><em className="not-italic text-[#A4C9A8]">their growth.</em>
              </h2>

              <p className="mt-10 text-sprout-cream/75 leading-relaxed max-w-md" style={{ fontSize: "clamp(17px, 1.5vw, 19px)" }}>
                Every Sunday, a beautiful weekly reflection of what your kid actually
                learned, even if your week felt like chaos. Weeks compile into
                months. Months into a year of growth.
              </p>

              <ul className="mt-10 space-y-4">
                {[
                  "Reframes everyday moments as legitimate learning",
                  "One report per kid, Charlie's grows separately to Emma's",
                  "Print it, share it, show your kid Monday morning",
                  "Compiles into monthly snapshots and a year-end retrospective",
                  "Doubles as a record of learning if your registration officer ever asks",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sprout-cream/85" style={{ fontSize: "16px" }}>
                    <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-sprout-cream/15 flex items-center justify-center border border-sprout-cream/10">
                      <Check className="w-3 h-3 text-sprout-cream" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ─────────── 3D phone mockup with hand reaching in + floating cards ─────────── */}
            <div className="md:col-span-6 flex justify-center md:justify-end">
              {/* Perspective container — gives the whole composition real 3D depth */}
              <div className="relative" style={{ perspective: "1800px", perspectiveOrigin: "50% 50%" }}>

                {/* Soft ambient halo behind everything */}
                <div className="absolute -inset-20 rounded-full bg-gradient-to-br from-[#A4C9A8]/30 via-[#94BC8E]/20 to-[#76A77A]/15 blur-3xl -z-10 animate-breathe" />

                {/* HAND silhouette reaching up from bottom-right (suggests human use)
                    Stylized SVG silhouette. Swap for real photo render later. */}
                <svg className="absolute -bottom-32 -right-10 w-[260px] h-[340px] pointer-events-none -z-[5] opacity-95"
                     viewBox="0 0 260 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="handGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0A1208" />
                      <stop offset="100%" stopColor="#040806" />
                    </linearGradient>
                    <filter id="handBlur" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="0.6" />
                    </filter>
                  </defs>
                  {/* Forearm + hand silhouette curving up from bottom-right */}
                  <path filter="url(#handBlur)" fill="url(#handGrad)" d="M260,340 L260,80 C235,75 215,85 195,105 C170,130 155,165 145,195 C140,210 135,220 128,225 C120,230 110,228 105,220 C95,205 90,180 85,160 C80,145 70,140 60,148 C48,158 42,180 45,210 C48,240 60,275 75,300 C95,325 130,340 160,340 Z" />
                  {/* Thumb */}
                  <path filter="url(#handBlur)" fill="url(#handGrad)" d="M195,105 C188,100 178,102 172,112 C165,125 162,140 165,155 C168,170 178,178 188,170 C198,160 200,140 198,125 C197,118 196,112 195,105 Z" />
                </svg>

                {/* PHONE — tilted in 3D space */}
                <div
                  className="relative w-[300px] md:w-[340px] aspect-[9/19.5] rounded-[48px] bg-gradient-to-b from-[#0F1A12] to-[#050A07] p-[3px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.75),0_80px_160px_-40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.1)]"
                  style={{
                    transform: "rotateY(-9deg) rotateX(3deg) rotateZ(-1deg)",
                    transformStyle: "preserve-3d",
                  }}
                >

                  <div className="relative w-full h-full rounded-[46px] bg-[#0A1208] p-[2px]">

                    {/* Screen, premium gradient surface */}
                    <div className="relative w-full h-full rounded-[44px] overflow-hidden bg-gradient-to-b from-[#FBF8EE] via-[#F6F1E0] to-[#EFE7CF]">

                      {/* Status bar */}
                      <div className="absolute top-0 inset-x-0 h-12 px-7 flex items-center justify-between text-[10px] font-bold text-[#1B3722] z-20">
                        <span>9:41</span>
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-7 rounded-full bg-black" />
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-2.5" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="2.5" height="4" rx="0.5"/><rect x="4" y="4" width="2.5" height="6" rx="0.5"/><rect x="8" y="2" width="2.5" height="8" rx="0.5"/><rect x="12" y="0" width="2.5" height="10" rx="0.5"/></svg>
                          <svg className="w-3.5 h-3" viewBox="0 0 16 12" fill="currentColor"><path d="M8 12L10 9.5C9.5 9 8.8 8.7 8 8.7C7.2 8.7 6.5 9 6 9.5L8 12ZM4 7.5L5.5 9C6.2 8.3 7 8 8 8C9 8 9.8 8.3 10.5 9L12 7.5C11 6.5 9.5 6 8 6C6.5 6 5 6.5 4 7.5ZM0 3.5L2 5.5C3.5 4 5.7 3 8 3C10.3 3 12.5 4 14 5.5L16 3.5C13.7 1.3 11 0 8 0C5 0 2.3 1.3 0 3.5Z"/></svg>
                          <svg className="w-5 h-2.5" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="19" height="9" rx="2" stroke="currentColor"/><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor"/><rect x="20" y="3" width="1.5" height="4" rx="0.5" fill="currentColor"/></svg>
                        </div>
                      </div>

                      {/* App content */}
                      <div className="absolute inset-0 pt-14 pb-16 px-4 flex flex-col">

                        {/* Top app header */}
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-1.5 text-[#1B3722]">
                            <SproutLogo className="w-4 h-4" />
                            <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Sprout</span>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center border border-[#1B3722]/8 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.1)]" aria-label="Share">
                            <Share2 className="w-3.5 h-3.5 text-[#1B3722]" strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* HERO CARD, kid + week + completion */}
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3D6643] via-[#2A5132] to-[#1B3722] p-4 mb-3 shadow-[0_8px_24px_-6px_rgba(27,55,34,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]">
                          {/* Decorative glow inside hero */}
                          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#94BC8E]/30 blur-3xl pointer-events-none" />
                          <div className="absolute -bottom-16 -left-12 w-32 h-32 rounded-full bg-[#76A77A]/25 blur-3xl pointer-events-none" />

                          <div className="relative">
                            {/* Top row: avatar + kid name */}
                            <div className="flex items-center gap-2.5 mb-3.5">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A4C9A8] to-[#76A77A] flex items-center justify-center font-bold text-[#1B3722] text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_8px_-2px_rgba(0,0,0,0.3)]">
                                C
                              </div>
                              <div className="flex-1">
                                <div className="text-[8px] uppercase tracking-[0.2em] text-[#A4C9A8] font-bold">Week 12 of 52</div>
                                <div className="text-[14px] font-bold text-[#FBF8EE] leading-tight">Charlie&apos;s week</div>
                              </div>
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#A4C9A8]/20 border border-[#A4C9A8]/40">
                                <span className="w-1 h-1 rounded-full bg-[#A4C9A8]" />
                                <span className="text-[7px] uppercase tracking-wider text-[#A4C9A8] font-bold">On track</span>
                              </div>
                            </div>

                            {/* 4 mini-rings, Apple Fitness style */}
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { label: "Curiosity", val: 95 },
                                { label: "Numeracy", val: 78 },
                                { label: "Communication", val: 88 },
                                { label: "Self-dir.", val: 82 },
                              ].map((s) => {
                                const circ = 2 * Math.PI * 14;
                                const offset = circ * (1 - s.val / 100);
                                return (
                                  <div key={s.label} className="flex flex-col items-center">
                                    <div className="relative w-11 h-11">
                                      <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                                        <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(164,201,168,0.18)" strokeWidth="3" />
                                        <circle cx="16" cy="16" r="14" fill="none" stroke="url(#ringGrad)" strokeWidth="3" strokeLinecap="round"
                                                strokeDasharray={circ} strokeDashoffset={offset} />
                                        <defs>
                                          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#A4C9A8" />
                                            <stop offset="100%" stopColor="#FBF8EE" />
                                          </linearGradient>
                                        </defs>
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#FBF8EE]">
                                        {s.val}
                                      </div>
                                    </div>
                                    <div className="text-[7px] uppercase tracking-wider text-[#A4C9A8]/80 font-bold mt-1">{s.label}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* HIGHLIGHTS eyebrow */}
                        <div className="flex items-center justify-between px-1 mb-2">
                          <div className="text-[8px] uppercase tracking-[0.25em] text-[#1B3722]/60 font-bold">Highlights this week</div>
                          <div className="text-[8px] text-[#1B3722]/40 font-medium">2 of 5</div>
                        </div>

                        {/* Highlight card 1 */}
                        <div className="rounded-2xl bg-white/85 backdrop-blur-sm border border-[#1B3722]/6 p-2.5 mb-1.5 shadow-[0_4px_12px_-3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]">
                          <div className="flex items-start gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F4EDE0] to-[#E6DDC2] flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                              <span className="text-base">🍪</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] font-bold text-[#1B3722]">Tuesday</span>
                                <span className="text-[8px] text-[#1B3722]/40">·</span>
                                <span className="text-[9px] text-[#1B3722]/70 font-medium">Baking</span>
                              </div>
                              <p className="text-[9px] leading-snug text-[#1B3722]/75">
                                Maths through cookies, fractions, sequencing, patience.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Highlight card 2 */}
                        <div className="rounded-2xl bg-white/85 backdrop-blur-sm border border-[#1B3722]/6 p-2.5 shadow-[0_4px_12px_-3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]">
                          <div className="flex items-start gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F4EDE0] to-[#E6DDC2] flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                              <span className="text-base">🌋</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] font-bold text-[#1B3722]">Wednesday</span>
                                <span className="text-[8px] text-[#1B3722]/40">·</span>
                                <span className="text-[9px] text-[#1B3722]/70 font-medium">Volcano doc</span>
                              </div>
                              <p className="text-[9px] leading-snug text-[#1B3722]/75">
                                90 mins of unprompted Earth-science questions.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1" />

                        {/* Big share CTA, premium, dopamine-trigger */}
                        <button className="w-full h-10 rounded-full bg-gradient-to-b from-[#2A5132] to-[#1B3722] text-[#F4EDE0] text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-[0_6px_16px_-2px_rgba(27,55,34,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]">
                          <Share2 className="w-3 h-3" strokeWidth={2.5} />
                          Share Charlie&apos;s week
                        </button>
                      </div>

                      {/* Tab bar, premium with active pill */}
                      <div className="absolute bottom-0 inset-x-0 h-16 px-3 pb-3 pt-2 flex items-center justify-around bg-gradient-to-t from-[#FBF8EE] via-[#FBF8EE]/95 to-[#FBF8EE]/40 backdrop-blur-xl border-t border-[#1B3722]/5">
                        <div className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-full bg-[#1B3722]">
                          <HomeIcon className="w-3.5 h-3.5 text-[#F4EDE0]" strokeWidth={2.5} />
                          <span className="text-[7px] uppercase tracking-wider text-[#F4EDE0] font-bold">Today</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 px-3 py-1">
                          <BarChart3 className="w-3.5 h-3.5 text-[#1B3722]/35" strokeWidth={2} />
                          <span className="text-[7px] uppercase tracking-wider text-[#1B3722]/35 font-medium">Weeks</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 px-3 py-1">
                          <SettingsIcon className="w-3.5 h-3.5 text-[#1B3722]/35" strokeWidth={2} />
                          <span className="text-[7px] uppercase tracking-wider text-[#1B3722]/35 font-medium">Family</span>
                        </div>
                      </div>

                      {/* Home indicator */}
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-[#1B3722]/40" />
                    </div>
                  </div>
                </div>

                {/* ─── Floating glass card #1: NOTIFICATION (top-left, breaks the bezel) ─── */}
                <div
                  className="absolute -top-6 -left-16 md:-left-24 w-[210px] z-20 hidden md:block"
                  style={{
                    transform: "rotateY(12deg) rotateX(-4deg) rotateZ(-3deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl p-3.5"
                       style={{
                         background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
                         backdropFilter: "blur(50px) saturate(220%) brightness(125%)",
                         WebkitBackdropFilter: "blur(50px) saturate(220%) brightness(125%)",
                         border: "1px solid rgba(255,255,255,0.30)",
                         boxShadow: "inset 1.5px 1.5px 0 rgba(255,255,255,0.55), inset -1px -1px 0 rgba(0,0,0,0.10), 0 20px 40px -8px rgba(0,0,0,0.55), 0 40px 80px -20px rgba(0,0,0,0.35)",
                       }}>
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: "radial-gradient(ellipse 60% 50% at 12% 12%, rgba(255,255,255,0.18) 0%, transparent 55%)" }} />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-md bg-[#F4EDE0] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                          <SproutLogo className="w-3 h-3 text-[#1B3722]" />
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-sprout-cream/85 font-bold">Sprout</span>
                        <span className="ml-auto text-[8px] text-sprout-cream/55">2m ago</span>
                      </div>
                      <p className="text-[12px] font-bold text-sprout-cream leading-tight mb-0.5">
                        Charlie just learned 🌋
                      </p>
                      <p className="text-[10px] text-sprout-cream/75 leading-snug">
                        Volcano doc sparked 90 mins of Earth-science questions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ─── Floating glass card #2: THIS WEEK SO FAR (right side, mid-phone) ─── */}
                <div
                  className="absolute top-1/3 -right-12 md:-right-20 w-[220px] z-20 hidden md:block"
                  style={{
                    transform: "rotateY(-14deg) rotateX(2deg) rotateZ(4deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl p-4"
                       style={{
                         background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
                         backdropFilter: "blur(50px) saturate(220%) brightness(125%)",
                         WebkitBackdropFilter: "blur(50px) saturate(220%) brightness(125%)",
                         border: "1px solid rgba(255,255,255,0.30)",
                         boxShadow: "inset 1.5px 1.5px 0 rgba(255,255,255,0.55), inset -1px -1px 0 rgba(0,0,0,0.10), 0 20px 40px -8px rgba(0,0,0,0.55), 0 40px 80px -20px rgba(0,0,0,0.35)",
                       }}>
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: "radial-gradient(ellipse 60% 50% at 12% 12%, rgba(255,255,255,0.18) 0%, transparent 55%)" }} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-sprout-cream/85 font-bold">This week so far</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#A4C9A8]/30 border border-[#A4C9A8]/40">
                          <span className="w-1 h-1 rounded-full bg-[#A4C9A8]" />
                          <span className="text-[7px] uppercase tracking-wider text-sprout-cream font-bold">On track</span>
                        </span>
                      </div>
                      {/* 4 mini rings */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { label: "Cur", val: 95 },
                          { label: "Num", val: 78 },
                          { label: "Com", val: 88 },
                          { label: "Self", val: 82 },
                        ].map((s) => {
                          const circ = 2 * Math.PI * 12;
                          const offset = circ * (1 - s.val / 100);
                          return (
                            <div key={s.label} className="flex flex-col items-center">
                              <div className="relative w-9 h-9">
                                <svg viewBox="0 0 28 28" className="w-full h-full -rotate-90">
                                  <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" />
                                  <circle cx="14" cy="14" r="12" fill="none" stroke="#A4C9A8" strokeWidth="2.5" strokeLinecap="round"
                                          strokeDasharray={circ} strokeDashoffset={offset} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-sprout-cream">
                                  {s.val}
                                </div>
                              </div>
                              <div className="text-[7px] uppercase tracking-wider text-sprout-cream/70 font-bold mt-0.5">{s.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editorial accent, vertical text label */}
                <div className="hidden xl:block absolute -right-8 -top-8 text-sprout-cream/45 text-[9px] uppercase tracking-[0.3em] font-bold rotate-90 origin-left">
                  Sample · charlie · week 12
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING, Annual card cream-tinted (30% less creamy)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D6643]/30 via-[#2A5132]/40 to-[#1B3722]/50" />
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,300 C480,180 960,420 1440,280 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.5" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto">

          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="block w-8 h-px bg-sprout-cream/40" />
              <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">05 · Pricing</span>
              <span className="block w-8 h-px bg-sprout-cream/40" />
            </div>

            <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
                style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
              Less than $1 a day.
            </h2>
            <p className="mt-8 text-sprout-cream/70 max-w-xl mx-auto leading-relaxed" style={{ fontSize: "17px" }}>
              All your kids. Every week. One flat price. No per-child upsells.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            <GlassCard className="p-8 md:p-10 rounded-3xl" glow="warm">
              <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/75 font-bold mb-4">Monthly</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-sprout-cream font-bold" style={{ fontSize: "60px" }}>$29</span>
                <span className="text-sprout-cream/70 text-base">/month</span>
              </div>
              <p className="text-sprout-cream/85 mb-8 leading-relaxed text-sm">
                Pay as you go. Cancel anytime. Your first weekly report is yours
                forever, even if you cancel.
              </p>
              <Link
                href="#start"
                className="block text-center w-full h-12 leading-[3rem] rounded-full bg-white/20 backdrop-blur border border-white/40 text-sprout-cream font-semibold hover:bg-white/25 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
              >
                Start free trial
              </Link>
            </GlassCard>

            <div className="relative p-8 md:p-10 rounded-3xl bg-[#F4EDE0] backdrop-blur-xl border-2 border-[#F4EDE0] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5),0_30px_60px_-20px_rgba(0,0,0,0.3)]">
              <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#1B3722] text-sprout-cream text-[10px] uppercase tracking-[0.2em] font-bold">
                Save $99/yr
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#1B3722]/70 font-bold mb-4">Annual</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[#1B3722] font-bold" style={{ fontSize: "60px" }}>$249</span>
                <span className="text-[#1B3722]/60 text-base">/year</span>
              </div>
              <p className="text-[#1B3722]/80 mb-8 leading-relaxed text-sm">
                Less than $0.68 a day. Most mums pick this once they&apos;ve felt
                the first Sunday land.
              </p>
              <Link
                href="#start"
                className="block text-center w-full h-12 leading-[3rem] rounded-full bg-[#1B3722] text-[#F4EDE0] font-bold hover:bg-[#0F2614] transition-colors"
              >
                Start free trial
              </Link>
            </div>

          </div>

          <p className="text-center mt-10 text-sprout-cream/50 text-sm">
            7 days free · No card required · Works with all your kids · AU + NZ
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          OBJECTIONS, research-backed real questions, simpler answers
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3D6643]/40 via-[#4D7B53]/30 to-[#76A77A]/20" />
          <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#A4C9A8]/8 blur-3xl animate-drift-1" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-[#76A77A]/10 blur-3xl animate-drift-2" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <span className="block w-12 h-px bg-sprout-cream/40" />
            <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">06 · What mums actually ask first</span>
          </div>

          <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream mb-16 headline-lit"
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            Pulled from real forum<br />threads. Answered straight.
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Is this another subscription that&apos;ll drain my budget?",
                a: "$29/mo covers all your kids on one price. Your first weekly report is yours forever, even if you cancel mid-trial. You&apos;ll know within seven days if it&apos;s worth keeping.",
              },
              {
                q: "How is Sprout different from my Notes app or ChatGPT?",
                a: "Notes apps don&apos;t compile your week, they give you a longer scroll. ChatGPT forgets every session. Sprout remembers every moment and references back. Continuity is the whole product.",
              },
              {
                q: "What if I forget to log for a week?",
                a: "Then your weekly report is shorter. That&apos;s it. No streaks. No guilt. No nagging notifications.",
              },
              {
                q: "Will Sprout help with my state&apos;s record-keeping?",
                a: "Indirectly, yes. NSW NESA, QLD HEU, VIC VRQA, NZ MoE all want a 'record of learning.' Sprout&apos;s monthly and yearly compilations give you that, without you scrambling the night before review. It&apos;s not the headline, but it&apos;s there.",
              },
              {
                q: "I&apos;m not techy. Will I be able to use it?",
                a: "If you can send a voice memo or take a photo, you can use Sprout. No setup. No dashboard. Open, drop in, close.",
              },
              {
                q: "What if I unschool? My week doesn&apos;t look like school.",
                a: "Even better. Sprout translates the cooking, the questions, the YouTube rabbit holes, into the developmental skills your kid is actually building. We don&apos;t measure curriculum.",
              },
              {
                q: "I have three kids. Do I pay three times?",
                a: "No. $29/mo covers your whole family. Each kid gets their own weekly report. One flat price.",
              },
            ].map((item, i) => (
              <details key={i} className={`${GLASS_CARD_SOFT} group rounded-2xl`}>
                <GlassGlow tint={i % 2 === 0 ? "lime" : "sage"} />
                <summary className="relative cursor-pointer list-none p-6 flex items-start justify-between gap-6">
                  <span className="font-bold text-sprout-cream leading-tight" style={{ fontSize: "clamp(17px, 1.5vw, 19px)" }} dangerouslySetInnerHTML={{ __html: item.q }} />
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-sprout-cream font-bold group-open:rotate-45 transition-transform border border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                </summary>
                <div className="relative px-6 pb-6 -mt-2 text-sprout-cream/85 leading-relaxed" style={{ fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: item.a }} />
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════════ */}
      <section id="start" className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A5132]/60 via-[#3D6643]/40 to-[#1B3722]/80" />
          <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,500 C320,400 720,600 1080,480 C1280,420 1380,500 1440,480 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.6" />
          </svg>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#76A77A]/12 blur-3xl animate-breathe" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-xs uppercase tracking-[0.25em] font-semibold mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
            Your first Sunday is on us
          </div>

          <h2 className="font-bold tracking-[-0.03em] leading-[0.95] text-sprout-cream headline-lit"
              style={{ fontSize: "clamp(48px, 8vw, 110px)" }}>
            Sleep on Sunday.
          </h2>

          <p className="mt-10 text-sprout-cream/80 max-w-xl mx-auto leading-relaxed" style={{ fontSize: "clamp(17px, 1.6vw, 21px)" }}>
            Try Sprout free for 7 days. Get one full weekly report, yours
            to keep forever, even if you cancel.
          </p>

          <Link
            href="https://app.sprout.example/signup"
            className="group inline-flex items-center justify-center gap-2 mt-12 h-16 px-10 rounded-full bg-[#F4EDE0] text-[#1B3722] font-bold text-lg hover:bg-[#FBF6EB] transition-colors shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)]"
          >
            Start your first week free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
          </Link>

          <p className="mt-6 text-sm text-sprout-cream/50">
            No card required · Cancel anytime · For homeschool families AU + NZ
          </p>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative bg-[#0F1A12] text-sprout-cream/70 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sprout-cream font-bold">
            <SproutLogo className="w-5 h-5 text-sprout-cream" />
            <span>Sprout</span>
          </div>
          <div className="text-xs uppercase tracking-[0.3em]">
            For homeschool families · AU & NZ · Made with care
          </div>
          <div className="text-xs uppercase tracking-[0.3em]">
            © 2026 · vol.01 · issue 26
          </div>
        </div>
      </footer>

    </main>
  );
}
