// Measured print fit for worksheets.
//
// window.print() alone can spill a sliver of content onto a near-empty trailing
// page. Pure print CSS can't prevent that. This measures the worksheet at the
// real A4 print width, works out how many pages it spans, and if it overflows
// just past a page boundary, applies a small uniform zoom so it settles onto a
// whole number of pages (no orphan). Genuinely-multi-page content is left alone.
//
// A4 at 12mm margins (the @page in WorksheetDoc), 96 CSS px / inch for print:
//   printable width  = 210 - 24 = 186mm = 7.32in  ≈ 703px
//   printable height = 297 - 24 = 273mm = 10.75in ≈ 1032px

const PAGE_PX = 1032;
const WIDTH_PX = 703;
const MIN_SCALE = 0.8; // never shrink past this; readability floor
const ORPHAN_FRACTION = 0.35; // only pull back a last page this empty or emptier

export function printWorksheet(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    window.print?.();
    return;
  }
  // Only fit when exactly one worksheet is on the page; multi-sheet pages just
  // print normally (one scale can't be right for several independent sheets).
  const areas = document.querySelectorAll<HTMLElement>(".print-area");
  if (areas.length !== 1) {
    window.print();
    return;
  }
  const el = areas[0];

  let scale = 1;
  try {
    // Measure at the print content width (off-screen so the page doesn't jump).
    const prev = el.style.cssText;
    el.style.position = "absolute";
    el.style.left = "-10000px";
    el.style.top = "0";
    el.style.width = `${WIDTH_PX}px`;
    el.style.maxWidth = "none";
    const h = el.scrollHeight; // reading this forces the reflow we need
    el.style.cssText = prev;

    const pages = h / PAGE_PX;
    const whole = Math.floor(pages);
    const frac = pages - whole;
    if (whole >= 1 && frac > 0 && frac < ORPHAN_FRACTION) {
      scale = Math.max(MIN_SCALE, (whole * PAGE_PX) / h);
    }
  } catch {
    scale = 1; // any measurement hiccup → print unscaled
  }

  const root = document.documentElement;
  root.style.setProperty("--ws-print-scale", String(scale));
  const cleanup = () => {
    root.style.removeProperty("--ws-print-scale");
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
  // afterprint is unreliable on some browsers; reset shortly after regardless.
  window.setTimeout(cleanup, 2000);
}
