import Link from "next/link";
import { Plus, Mic, Image as ImageIcon, FileText, ArrowRight, Check, Share2, Home as HomeIcon, BarChart3, Settings as SettingsIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────
   Sprout brand mark — Apple-emoji-inspired 🌱 in pure SVG.
   Two leaves + stem. Used in nav, footer, brand cards, app icon.
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

/* ─── GLASS_CARD: new transparent frosted recipe per Chase's brief ───
   Per spec: bg-white/5 to /10, backdrop-blur-2xl, border-white/15-20,
   soft shadow + thin bright inset top edge (the "Ask anything" gloss).
   ZERO green color values on the card. The green comes through from
   the section bg (which now has visible variation behind glass cards).
   Used by: 3am quote, step cards, monthly pricing, FAQ details. */
const GLASS_CARD = "relative overflow-hidden bg-white/[0.08] backdrop-blur-2xl border border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_30px_-5px_rgba(0,0,0,0.30),0_25px_50px_-15px_rgba(0,0,0,0.20)]";

/* GLASS_CARD_SOFT: identical to GLASS_CARD, only shadow differs. Used by comparison
   section's 3 alternative cards (out of scope for changes per brief). */
const GLASS_CARD_SOFT = "relative overflow-hidden bg-white/[0.08] backdrop-blur-2xl border border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_30px_-10px_rgba(0,0,0,0.35),0_30px_60px_-20px_rgba(0,0,0,0.2)]";

export default function Home() {
  return (
    <main className="text-sprout-cream min-h-screen overflow-x-hidden relative">

      {/* Continuous green canvas behind every section */}
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
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[#94BC8E]/15 blur-3xl" />
          <div className="absolute bottom-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-[#76A77A]/10 blur-3xl" />
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

        <div className="relative z-10 flex items-center justify-between px-6 md:px-12 text-sprout-cream/45 text-[10px] uppercase tracking-[0.3em]">
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

            <h1 className="font-display text-center font-extrabold leading-[0.95] text-sprout-cream"
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

        <div className="relative z-10 flex items-end justify-between px-6 md:px-12 pb-8 text-sprout-cream/40 text-[10px] uppercase tracking-[0.3em]">
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
          THE 3AM MOMENT
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          {/* Bg variation: bright sage glow top-left + dark forest zone bottom-right.
              Gives transparent glass cards something to refract through. */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 65% 55% at 18% 22%, rgba(164,201,168,0.42) 0%, transparent 55%), radial-gradient(ellipse 60% 55% at 85% 80%, rgba(15,38,20,0.55) 0%, transparent 60%)"
          }} />

          {/* Cream blob behind the quote card in the right column — sits behind glass cards so backdrop-blur picks up cream contrast. */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle 380px at 78% 65%, rgba(244,241,234,0.35) 0%, rgba(244,241,234,0) 60%)"
          }} />
          <svg className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/3 translate-x-1/3 opacity-30" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="280" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="220" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="160" fill="none" stroke="#A4C9A8" strokeWidth="0.5" opacity="0.5" />
            <circle cx="300" cy="300" r="100" fill="#A4C9A8" opacity="0.08" />
          </svg>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#76A77A]/15 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          <div className="flex items-center gap-3 mb-12">
            <span className="block w-12 h-px bg-sprout-cream/40" />
            <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">01 · The reason Sprout exists</span>
          </div>

          <div className="space-y-2 mb-16">
            <h2 className="font-display font-extrabold leading-[0.9] text-sprout-cream"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              It&apos;s 11:42 PM.
            </h2>
            <h2 className="font-display font-extrabold leading-[0.9] text-sprout-cream/55"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              You&apos;re staring
            </h2>
            <h2 className="font-display font-extrabold leading-[0.9] text-sprout-cream/55"
                style={{ fontSize: "clamp(30px, 6vw, 82px)" }}>
              at the ceiling.
            </h2>
            <h2 className="font-display font-extrabold leading-[0.9] text-sprout-cream pt-6"
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

            <div className="md:col-span-5">
              <div className={`${GLASS_CARD} p-8 rounded-3xl`}>
                <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/60 font-bold mb-4">
                  ✱ A real homeschool mum
                </div>
                <p className="text-sprout-cream/95 leading-relaxed italic" style={{ fontSize: "clamp(15px, 1.4vw, 17px)" }}>
                  &ldquo;I envision all the other parents judging me and thinking
                  I&apos;m a horrible teacher who is failing my kids. When I hear
                  my daughter stumble over words I was reading at her age, I worry.&rdquo;
                </p>
                <div className="mt-6 text-xs text-sprout-cream/55 uppercase tracking-widest">
                  Verbatim · Hess UnAcademy
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DIFFERENTIATOR
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tl from-[#2A5132]/40 via-[#3D6643]/30 to-[#4D7B53]/20" />
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,400 C320,300 720,500 1080,380 C1280,320 1380,400 1440,380 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.4" />
          </svg>
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-[#76A77A]/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <span className="block w-12 h-px bg-sprout-cream/40" />
            <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">02 · Why Sprout, not another tool</span>
          </div>

          <div className="space-y-2 mb-12">
            <h2 className="font-display font-extrabold leading-[0.95] text-sprout-cream/55"
                style={{ fontSize: "clamp(25px, 4.5vw, 62px)" }}>
              Your iPhone Notes are scattered.
            </h2>
            <h2 className="font-display font-extrabold leading-[0.95] text-sprout-cream/55"
                style={{ fontSize: "clamp(25px, 4.5vw, 62px)" }}>
              ChatGPT forgets by next week.
            </h2>
            <h2 className="font-display font-extrabold leading-[0.95] text-sprout-cream pt-4"
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
              <div key={alt.title} className={`${GLASS_CARD_SOFT} p-7 rounded-3xl`}>
                <div className="text-sprout-cream/55 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">The alternative</div>
                <h3 className="font-display font-bold text-sprout-cream/85 mb-6" style={{ fontSize: "22px" }}>
                  {alt.title}
                </h3>
                <div className="space-y-4 text-sprout-cream/70" style={{ fontSize: "13.5px", lineHeight: "1.6" }}>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-sprout-cream/55 mb-1">What you do</div>
                    <div dangerouslySetInnerHTML={{ __html: alt.you }} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-sprout-cream/55 mb-1">What you get</div>
                    <div dangerouslySetInnerHTML={{ __html: alt.get }} />
                  </div>
                </div>
              </div>
            ))}

            {/* Sprout featured cream card */}
            <div className="relative p-7 rounded-3xl bg-[#F4EDE0] backdrop-blur-xl border-2 border-[#F4EDE0] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5),0_30px_60px_-20px_rgba(0,0,0,0.3)]">
              <div className="text-[#1B3722]/70 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">The Sprout way</div>
              <h3 className="font-display font-bold text-[#1B3722] mb-6 flex items-center gap-2" style={{ fontSize: "22px" }}>
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
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          {/* Bg variation: bright sage glow top-left + dark forest zone bottom-right.
              Gives transparent glass cards something to refract through. */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 65% 55% at 18% 22%, rgba(164,201,168,0.42) 0%, transparent 55%), radial-gradient(ellipse 60% 55% at 85% 80%, rgba(15,38,20,0.55) 0%, transparent 60%)"
          }} />

          {/* 3 cream blobs, one behind each step card (middle one lower per md:translate-y-12) — sits behind glass cards so backdrop-blur picks up cream contrast. */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle 380px at 17% 55%, rgba(244,241,234,0.35) 0%, rgba(244,241,234,0) 60%), radial-gradient(circle 380px at 50% 70%, rgba(244,241,234,0.35) 0%, rgba(244,241,234,0) 60%), radial-gradient(circle 380px at 83% 55%, rgba(244,241,234,0.35) 0%, rgba(244,241,234,0) 60%)"
          }} />
          <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 C320,100 720,300 1080,180 C1280,120 1380,200 1440,180 L1440,0 L0,0 Z" fill="#76A77A" opacity="0.2" />
            <path d="M0,800 C320,720 720,860 1100,800 C1300,770 1380,820 1440,800 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.5" />
          </svg>
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-[#A4C9A8]/8 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <span className="block w-12 h-px bg-sprout-cream/40" />
            <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">03 · How it works</span>
          </div>

          <h2 className="font-display font-extrabold leading-[0.95] text-sprout-cream max-w-3xl"
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            Three stupid<br />simple steps.
          </h2>

          <p className="mt-8 text-sprout-cream/70 max-w-xl leading-relaxed" style={{ fontSize: "clamp(17px, 1.5vw, 19px)" }}>
            Built for the mum who&apos;s already doing too much.
            No daily goals. No streaks. No guilt.
          </p>

          <div className="mt-20 grid md:grid-cols-3 gap-6">

            {[
              { num: "01", icon: Mic, title: "Drop in a moment.", body: "Voice memo while you fold the washing. Photo of her drawing. One sentence at 9pm. Tag which kid (or the whole family)." },
              { num: "02", icon: ImageIcon, title: "Your moments stack up.", body: "Each one saved with the kid it belongs to. No reminders. No 'you missed a day' guilt. Just there when Sunday comes." },
              { num: "03", icon: FileText, title: "Sunday becomes art.", body: "Your week becomes a beautiful reflection, one per kid. Builds into monthly snapshots and a full year of growth." },
            ].map((step, i) => (
              <div key={step.num} className={`${GLASS_CARD} p-8 md:p-10 rounded-3xl ${i === 1 ? "md:translate-y-12" : ""}`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="text-sprout-cream/60 text-[10px] uppercase tracking-[0.3em] font-bold">Step {step.num}</div>
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                    <step.icon className="w-5 h-5 text-sprout-cream" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-display font-extrabold text-sprout-cream leading-[1.05] mb-4" style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}>
                  {step.title}
                </h3>
                <p className="text-sprout-cream/75 leading-relaxed" style={{ fontSize: "15px" }}>
                  {step.body}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THE ARTIFACT — flat phone mockup (v12 state)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-bl from-[#76A77A]/30 via-[#4D7B53]/20 to-[#3D6643]/40" />
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,150 C480,30 960,270 1440,130 L1440,0 L0,0 Z" fill="#A4C9A8" opacity="0.15" />
            <path d="M0,750 C480,650 960,890 1440,730 L1440,900 L0,900 Z" fill="#1B3722" opacity="0.4" />
          </svg>
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#94BC8E]/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">

          <div className="grid md:grid-cols-12 gap-12 items-center">

            <div className="md:col-span-6">
              <div className="flex items-center gap-3 mb-8">
                <span className="block w-12 h-px bg-sprout-cream/40" />
                <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">04 · The Sunday-night moment</span>
              </div>

              <h2 className="font-display font-extrabold leading-[0.95] text-sprout-cream"
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

            <div className="md:col-span-6 flex justify-center md:justify-end">
              <div className="relative">

                <div className="absolute -inset-12 rounded-full bg-[#A4C9A8]/15 blur-3xl -z-10" />

                <div className="relative w-[280px] md:w-[320px] aspect-[9/19] rounded-[44px] bg-[#0A1810] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
                  <div className="relative w-full h-full rounded-[34px] bg-[#F8F6EE] overflow-hidden">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-[#0A1810]" />

                    <div className="pt-12 px-5 pb-6 h-full flex flex-col">
                      <div className="text-[8px] uppercase tracking-[0.3em] text-sprout-forest font-bold mb-2">
                        Week 12 · 8 to 14 May
                      </div>

                      <h4 className="font-display font-extrabold leading-[0.95] text-sprout-ink mb-4" style={{ fontSize: "32px" }}>
                        Charlie&apos;s<br />week.
                      </h4>

                      <div className="inline-flex self-start items-center gap-1.5 px-2 py-1 rounded-full bg-sprout-forest/10 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-sprout-forest" />
                        <span className="text-[9px] uppercase tracking-wider text-sprout-forest font-bold">On track</span>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        {[
                          { label: "Curiosity", val: 95 },
                          { label: "Numeracy", val: 78 },
                          { label: "Communication", val: 88 },
                          { label: "Self-direction", val: 82 },
                        ].map((s) => (
                          <div key={s.label} className="flex items-center gap-2">
                            <div className="text-[9px] text-sprout-ink/70 w-20 flex-shrink-0">{s.label}</div>
                            <div className="flex-1 h-1.5 rounded-full bg-sprout-ink/5 overflow-hidden">
                              <div className="h-full bg-sprout-forest rounded-full" style={{ width: `${s.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[8px] uppercase tracking-[0.3em] text-sprout-forest/70 font-bold mt-1 mb-1.5">Highlights</div>
                      <p className="text-[10px] leading-snug text-sprout-ink/80 mb-2">
                        Baking cookies on Tuesday touched maths (fractions,
                        sequencing) and life skills (patience, following steps).
                      </p>
                      <p className="text-[10px] leading-snug text-sprout-ink/80 mb-3">
                        Watched a volcano documentary Wednesday, sparked
                        90 mins of unprompted questions about Earth science.
                      </p>

                      <div className="mt-auto pt-3 border-t border-sprout-ink/10 flex items-center justify-between text-[8px] uppercase tracking-widest text-sprout-ink/40">
                        <span>Made with Sprout 🌱</span>
                        <span>1 of 52</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block absolute -right-8 top-12 text-sprout-cream/40 text-[9px] uppercase tracking-[0.3em] font-bold rotate-90 origin-left">
                  Sample · charlie · week 12
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          {/* Bg variation: bright sage glow top-left + dark forest zone bottom-right.
              Gives transparent glass cards something to refract through. */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 65% 55% at 18% 22%, rgba(164,201,168,0.42) 0%, transparent 55%), radial-gradient(ellipse 60% 55% at 85% 80%, rgba(15,38,20,0.55) 0%, transparent 60%)"
          }} />

          {/* Cream blob behind the monthly glass card (Annual cream card needs no blob) — sits behind glass cards so backdrop-blur picks up cream contrast. */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle 380px at 32% 65%, rgba(244,241,234,0.35) 0%, rgba(244,241,234,0) 60%)"
          }} />
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

            <h2 className="font-display font-extrabold leading-[0.95] text-sprout-cream"
                style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
              Less than $1 a day.
            </h2>
            <p className="mt-8 text-sprout-cream/70 max-w-xl mx-auto leading-relaxed" style={{ fontSize: "17px" }}>
              All your kids. Every week. One flat price. No per-child upsells.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            <div className={`${GLASS_CARD} p-8 md:p-10 rounded-3xl`}>
              <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/60 font-bold mb-4">Monthly</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display font-extrabold text-sprout-cream" style={{ fontSize: "60px" }}>$29</span>
                <span className="text-sprout-cream/60 text-base">/month</span>
              </div>
              <p className="text-sprout-cream/70 mb-8 leading-relaxed text-sm">
                Pay as you go. Cancel anytime. Your first weekly report is yours
                forever, even if you cancel.
              </p>
              <Link
                href="#start"
                className="block text-center w-full h-12 leading-[3rem] rounded-full bg-white/15 backdrop-blur border border-white/30 text-sprout-cream font-semibold hover:bg-white/20 transition-colors"
              >
                Start free trial
              </Link>
            </div>

            <div className="relative p-8 md:p-10 rounded-3xl bg-[#F4EDE0] backdrop-blur-xl border-2 border-[#F4EDE0] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_40px_-10px_rgba(0,0,0,0.5),0_30px_60px_-20px_rgba(0,0,0,0.3)]">
              <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#1B3722] text-sprout-cream text-[10px] uppercase tracking-[0.2em] font-bold">
                Save $99/yr
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#1B3722]/70 font-bold mb-4">Annual</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display font-extrabold text-[#1B3722]" style={{ fontSize: "60px" }}>$249</span>
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
          OBJECTIONS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 md:px-12 py-32 md:py-48 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          {/* Bg variation: bright sage glow top-left + dark forest zone bottom-right.
              Gives transparent glass cards something to refract through. */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 65% 55% at 18% 22%, rgba(164,201,168,0.42) 0%, transparent 55%), radial-gradient(ellipse 60% 55% at 85% 80%, rgba(15,38,20,0.55) 0%, transparent 60%)"
          }} />

          {/* 3 cream blobs distributed vertically through the FAQ stack so each card has one nearby — sits behind glass cards so backdrop-blur picks up cream contrast. */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle 450px at 28% 20%, rgba(244,241,234,0.35) 0%, rgba(244,241,234,0) 60%), radial-gradient(circle 450px at 72% 50%, rgba(244,241,234,0.35) 0%, rgba(244,241,234,0) 60%), radial-gradient(circle 450px at 32% 82%, rgba(244,241,234,0.35) 0%, rgba(244,241,234,0) 60%)"
          }} />
          <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#A4C9A8]/8 blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-[#76A77A]/10 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <span className="block w-12 h-px bg-sprout-cream/40" />
            <span className="text-sprout-cream/60 text-xs uppercase tracking-[0.3em] font-bold">06 · What mums actually ask first</span>
          </div>

          <h2 className="font-display font-extrabold leading-[0.95] text-sprout-cream mb-16"
              style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            Pulled from real forum<br />threads. Answered straight.
          </h2>

          <div className="space-y-4">
            {[
              { q: "Is this another subscription that&apos;ll drain my budget?", a: "$29/mo covers all your kids on one price. Your first weekly report is yours forever, even if you cancel mid-trial. You&apos;ll know within seven days if it&apos;s worth keeping." },
              { q: "How is Sprout different from my Notes app or ChatGPT?", a: "Notes apps don&apos;t compile your week, they give you a longer scroll. ChatGPT forgets every session. Sprout remembers every moment and references back. Continuity is the whole product." },
              { q: "What if I forget to log for a week?", a: "Then your weekly report is shorter. That&apos;s it. No streaks. No guilt. No nagging notifications." },
              { q: "Will Sprout help with my state&apos;s record-keeping?", a: "Indirectly, yes. NSW NESA, QLD HEU, VIC VRQA, NZ MoE all want a 'record of learning.' Sprout&apos;s monthly and yearly compilations give you that, without you scrambling the night before review. It&apos;s not the headline, but it&apos;s there." },
              { q: "I&apos;m not techy. Will I be able to use it?", a: "If you can send a voice memo or take a photo, you can use Sprout. No setup. No dashboard. Open, drop in, close." },
              { q: "What if I unschool? My week doesn&apos;t look like school.", a: "Even better. Sprout translates the cooking, the questions, the YouTube rabbit holes, into the developmental skills your kid is actually building. We don&apos;t measure curriculum." },
              { q: "I have three kids. Do I pay three times?", a: "No. $29/mo covers your whole family. Each kid gets their own weekly report. One flat price." },
            ].map((item, i) => (
              <details key={i} className={`${GLASS_CARD} group rounded-2xl`}>
                <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-6">
                  <span className="font-display font-bold text-sprout-cream leading-tight" style={{ fontSize: "clamp(17px, 1.5vw, 19px)" }} dangerouslySetInnerHTML={{ __html: item.q }} />
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-sprout-cream font-bold group-open:rotate-45 transition-transform border border-white/20">
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                </summary>
                <div className="px-6 pb-6 -mt-2 text-sprout-cream/80 leading-relaxed" style={{ fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: item.a }} />
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
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#76A77A]/12 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sprout-cream/10 backdrop-blur-md border border-sprout-cream/15 text-sprout-cream/90 text-xs uppercase tracking-[0.25em] font-semibold mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-sprout-cream" />
            Your first Sunday is on us
          </div>

          <h2 className="font-display font-extrabold leading-[0.95] text-sprout-cream"
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
