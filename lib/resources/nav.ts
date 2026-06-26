// The floating Resources bottom nav shows on EVERY Resources page now — the
// worksheet builder and Build your own included (founder's call). Shared by
// ResourcesNav (whether to render) and HelpMascot (whether to sit higher so the
// two don't overlap on mobile).

export function showsResourcesNav(pathname: string): boolean {
  return pathname.startsWith("/resources");
}
