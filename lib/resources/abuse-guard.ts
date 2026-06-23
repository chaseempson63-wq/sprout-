// Stopgap protection for POST /api/resources/generate while the real subscriber
// gate (Apple identity + RevenueCat entitlement) is being built.
//
// The endpoint calls Venice (real money) and is currently reachable by anyone on
// the internet. This is NOT the security model — it is a bleed-stopper:
//   1. Origin/Referer allowlist — blocks drive-by curl/bots that hit the API
//      directly without coming from the site. Spoofable by a determined caller,
//      but it kills the casual "anyone can POST and burn Venice" exposure.
//   2. Best-effort per-IP rate limit — in-memory, per server instance. A thin
//      second layer only; a durable distributed limit lands with the real gate.
//
// Both get replaced by the entitlement check in the v1 gate. Keep this file as
// the clean seam: delete it when the real gate enforces identity + entitlement.

const ALLOWED_HOSTS = new Set([
  "hisprout.app",
  "www.hisprout.app",
  "localhost",
  "127.0.0.1",
  ...(process.env.RESOURCES_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean),
]);

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

function hostAllowed(host: string | null): boolean {
  if (!host) return false;
  // Vercel preview deploys (our own) serve from *.vercel.app and fall back to
  // the offline template anyway (Venice key is production-scoped), so allow them
  // rather than 403 our own preview testing.
  return ALLOWED_HOSTS.has(host) || host.endsWith(".vercel.app");
}

function originAllowed(request: Request): boolean {
  const origin = hostOf(request.headers.get("origin"));
  const referer = hostOf(request.headers.get("referer"));
  // A real browser fetch from our own site sends at least one of these. A bare
  // curl sends neither — that is exactly the drive-by case we reject.
  if (!origin && !referer) return false;
  return hostAllowed(origin) || hostAllowed(referer);
}

// ── Best-effort in-memory rate limit (per server instance) ───────────────────
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20; // generous for a human; caps a hammering client
const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function rateLimited(request: Request): boolean {
  const ip = clientIp(request);
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded across long uptimes.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

export function guardResourcesRequest(
  request: Request,
): { ok: true } | { ok: false; status: number; error: string } {
  if (!originAllowed(request)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  if (rateLimited(request)) {
    return { ok: false, status: 429, error: "Too many requests. Try again in a minute." };
  }
  return { ok: true };
}
