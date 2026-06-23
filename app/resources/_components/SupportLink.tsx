// Simple support contact. A mailto, zero infra. Upgrade to a real form later if
// volume warrants it. Points at the shared Sprout inbox (same place feedback
// lands). Swap to a branded support@hisprout.app once domain email routing
// (e.g. Cloudflare Email Routing) is set up.

const SUPPORT_EMAIL = "sprout.humanintelligence@gmail.com";

export function SupportLink({ className }: { className?: string }) {
  const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Sprout Resources — need help")}`;
  return (
    <a
      href={href}
      className={className ?? "hover:text-sprout-cream underline-offset-2 hover:underline"}
    >
      Need help?
    </a>
  );
}
