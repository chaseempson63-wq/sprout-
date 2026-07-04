import {
  Eye,
  MousePointerClick,
  Users,
  Heart,
  MessageCircle,
  ArrowUpRight,
  TrendingUp,
  Repeat,
} from "lucide-react";
import { SproutLogo } from "./Glass";

/*
  A mock of the partner dashboard a creator gets. Pure presentation, no
  interactivity (server component, ships zero JS). It makes the value loop
  visible: one post → views → link taps → families joined → money that pays
  every month for a year. Example figures are honest at $4.64 a family/mo
  (see EarningsCalculator + docs/AFFILIATE.md). Real screenshots replace
  this once the app and dashboard exist.
*/

// One small step in the post-to-income funnel.
function FunnelStep({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div
        className={
          highlight
            ? "shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-[#CDEFA0]/15 text-[#CDEFA0]"
            : "shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-sprout-cream/8 text-sprout-cream/70"
        }
      >
        {icon}
      </div>
      <div>
        <div
          className={
            highlight
              ? "font-display font-extrabold leading-none text-[#CDEFA0] text-2xl"
              : "font-display font-extrabold leading-none text-sprout-cream text-2xl"
          }
        >
          {value}
        </div>
        <div className="text-sprout-cream/55 text-xs mt-1">{label}</div>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-sprout-cream/[0.05] border border-sprout-cream/10 p-3.5 md:p-4">
      <div className="flex items-center gap-1.5 text-sprout-cream/55 mb-2">
        <span className="shrink-0">{icon}</span>
        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.08em] md:tracking-[0.16em] font-bold leading-tight">
          {label}
        </span>
      </div>
      <div className="font-display font-extrabold text-sprout-cream text-lg md:text-2xl leading-none whitespace-nowrap">
        {value}
      </div>
    </div>
  );
}

export function PartnerDashboard() {
  return (
    <div className="rounded-[28px] border border-sprout-cream/10 bg-[#0C1610]/85 backdrop-blur-xl shadow-[0_40px_100px_-35px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-sprout-cream/10">
        <div className="flex items-center gap-2 text-sprout-cream/85 font-bold text-sm">
          <SproutLogo className="w-4 h-4" />
          Partner dashboard
        </div>
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#CDEFA0]/80 font-bold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#CDEFA0] opacity-60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#CDEFA0]" />
          </span>
          Live
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Hero stat + sparkline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-7">
          <div>
            <div className="text-sprout-cream/55 text-xs uppercase tracking-[0.25em] font-bold mb-3">
              Earned this month
            </div>
            <div className="flex items-end gap-3">
              <div className="font-display font-extrabold leading-none text-[#CDEFA0] text-[clamp(44px,7vw,68px)]">
                $1,285
              </div>
              <div className="inline-flex items-center gap-1 text-[#CDEFA0] text-sm font-bold mb-2">
                <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                18%
              </div>
            </div>
          </div>

          {/* Sparkline */}
          <svg
            viewBox="0 0 220 64"
            className="w-full sm:w-56 h-16 shrink-0"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CDEFA0" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#CDEFA0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,54 L26,50 L52,52 L78,40 L104,44 L130,30 L156,32 L182,18 L208,12 L220,8"
              stroke="#CDEFA0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0,54 L26,50 L52,52 L78,40 L104,44 L130,30 L156,32 L182,18 L208,12 L220,8 L220,64 L0,64 Z"
              fill="url(#spark)"
            />
          </svg>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatChip
            icon={<Users className="w-4 h-4" strokeWidth={2.5} />}
            value="277"
            label="Active families"
          />
          <StatChip
            icon={<TrendingUp className="w-4 h-4" strokeWidth={2.5} />}
            value="41"
            label="Joined this mo"
          />
          <StatChip
            icon={<Repeat className="w-4 h-4" strokeWidth={2.5} />}
            value="12 mo"
            label="Paid per family"
          />
        </div>

        {/* The post → income funnel */}
        <div className="text-[10px] uppercase tracking-[0.3em] text-sprout-cream/45 font-bold mb-4">
          Your last post
        </div>

        <div className="grid md:grid-cols-[minmax(0,260px)_1fr] gap-6 items-center">
          {/* IG post mock */}
          <div className="rounded-2xl bg-[#0F1B13] border border-sprout-cream/10 overflow-hidden">
            <div className="flex items-center gap-2.5 px-3.5 py-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9FD16A] to-[#3D6643] shrink-0" />
              <div className="min-w-0">
                <div className="text-sprout-cream text-[13px] font-bold leading-tight truncate">
                  thehomeschool.mama
                </div>
                <div className="text-sprout-cream/45 text-[11px] leading-tight">
                  2h
                </div>
              </div>
            </div>

            {/* Image: the app shown inside her post */}
            <div className="relative aspect-square bg-gradient-to-br from-[#2A5132] via-[#1B3722] to-[#0F2614] grid place-items-center px-5">
              <div className="w-full rounded-xl bg-[#0C1610]/70 border border-sprout-cream/12 backdrop-blur-sm p-3.5">
                <div className="flex items-center gap-1.5 text-sprout-cream/90 text-[11px] font-bold mb-2.5">
                  <SproutLogo className="w-3 h-3" />
                  This week
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 rounded-full bg-[#CDEFA0]/70 w-[85%]" />
                  <div className="h-1.5 rounded-full bg-sprout-cream/30 w-[60%]" />
                  <div className="h-1.5 rounded-full bg-sprout-cream/30 w-[72%]" />
                </div>
              </div>
              <div className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.15em] font-bold text-sprout-cream/70 bg-black/30 rounded-full px-2 py-0.5">
                Reel
              </div>
            </div>

            <div className="px-3.5 py-3">
              <div className="flex items-center justify-between text-sprout-cream/80 mb-2">
                <div className="flex items-center gap-3.5">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold">
                    <Heart className="w-4 h-4 fill-current text-[#E58B8B]" strokeWidth={0} />
                    1,284
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold">
                    <MessageCircle className="w-4 h-4" strokeWidth={2} />
                    96
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#CDEFA0]">
                  View post
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              </div>
              <p className="text-sprout-cream/70 text-[11px] leading-snug">
                <span className="text-sprout-cream/90 font-bold">
                  thehomeschool.mama
                </span>{" "}
                took a photo when she finished her leaf collection and sprout
                sorted the rest. link in bio.
              </p>
            </div>
          </div>

          {/* Funnel */}
          <div className="space-y-4">
            <FunnelStep
              icon={<Eye className="w-5 h-5" strokeWidth={2.5} />}
              value="12,400"
              label="views on the post"
            />
            <div className="ml-5 h-4 w-px bg-sprout-cream/15" />
            <FunnelStep
              icon={<MousePointerClick className="w-5 h-5" strokeWidth={2.5} />}
              value="540"
              label="tapped her link"
            />
            <div className="ml-5 h-4 w-px bg-sprout-cream/15" />
            <FunnelStep
              icon={<Users className="w-5 h-5" strokeWidth={2.5} />}
              value="31"
              label="families joined"
            />
            <div className="ml-5 h-4 w-px bg-[#CDEFA0]/30" />
            <FunnelStep
              icon={<TrendingUp className="w-5 h-5" strokeWidth={2.5} />}
              value="$144/mo"
              label="paying her every month, for a year"
              highlight
            />
          </div>
        </div>
      </div>
    </div>
  );
}
