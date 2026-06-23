// Simple support contact. A mailto, zero infra. Upgrade to a real form later if
// volume warrants it.
//
// NOTE: support@hisprout.app only delivers if email receiving/forwarding is set
// up on the hisprout.app domain (e.g. Cloudflare Email Routing -> your inbox).
// If that's not configured yet, point this at a known-good inbox instead, or
// these messages go nowhere.

const SUPPORT_EMAIL = "support@hisprout.app";

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
