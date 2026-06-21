// Small shared helpers used by both the server engine and the client UI.

// Capitalize a child's (or creator's) name regardless of how it was typed:
// "chase" -> "Chase", "mary jane" -> "Mary Jane". A lowercase name should
// never show anywhere in the product.
export function capName(s?: string): string {
  const t = (s ?? "").trim();
  if (!t) return "";
  return t
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .slice(0, 40);
}
