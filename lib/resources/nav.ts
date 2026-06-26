// Where the floating Resources bottom nav appears. It shows on the hub and the
// browse/info pages, and HIDES on the worksheet builder (/resources/[templateId]
// and /resources/custom) so it never fights the builder's own bottom chat input.
// Shared by ResourcesNav (whether to render) and HelpMascot (whether to sit
// higher so the two don't overlap on mobile).

const NAV_PAGES = ["forum", "privacy", "how-to", "community", "creator", "child"];

export function showsResourcesNav(pathname: string): boolean {
  if (!pathname.startsWith("/resources")) return false;
  const seg = pathname.split("/")[2];
  if (!seg) return true; // the hub itself, /resources
  return NAV_PAGES.includes(seg); // builder segments (template ids, "custom") fall through to false
}
