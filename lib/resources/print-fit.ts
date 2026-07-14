// Print a clean document that contains ONLY the worksheet.
//
// Printing the app page in place was broken three ways: the visibility-based
// print CSS hid the app shell but kept its layout, so the sheet printed below
// pages of invisible chrome; the sheet sat inside flex/grid ancestors, which
// Chrome cannot fragment reliably (everything after the first break got
// clipped); and the default @page margin framed the sheet in white and gave
// the browser room to draw its date/title header line.
//
// So instead of printing the page, clone the visible worksheet(s) into a
// hidden same-origin iframe whose body IS the sheet, copy the stylesheets so
// it renders exactly as on screen, and print the iframe. Zero @page margin
// puts the green banner at the true top of page one and leaves the browser
// nowhere to draw its header/footer. The app page itself never enters the
// print flow.

// A4 at 96 CSS px per inch.
const PAGE_W_PX = 794; // 210mm
const PAGE_H_PX = 1123; // 297mm
const MIN_SCALE = 0.8; // never shrink past this; readability floor
const ORPHAN_FRACTION = 0.35; // only pull back a last page this empty or emptier

const FRAME_ID = "sprout-print-frame";

// Injected last so it wins over the copied app stylesheets.
const PRINT_DOC_CSS = `
  @page { size: A4; margin: 0; }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #FFFEFB !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body * { visibility: visible !important; }
  .print-area {
    position: static !important;
    overflow: visible !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    zoom: var(--ws-print-scale, 1);
    /* bottom padding renders on the sheet's last page only */
    padding-bottom: 8mm;
  }
  /* several sheets at once (a kid's saved stack): one per page */
  .print-area + .print-area { break-before: page; }
`;

export function printWorksheet(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    window.print?.();
    return;
  }
  // Only the worksheet(s) actually on screen; SlideDeck's display:none print
  // target and anything inside closed modals stay out.
  const areas = Array.from(document.querySelectorAll<HTMLElement>(".print-area")).filter(
    (el) => el.getClientRects().length > 0,
  );
  if (areas.length === 0) {
    window.print();
    return;
  }
  void printInFrame(areas).catch(() => window.print());
}

async function printInFrame(areas: HTMLElement[]): Promise<void> {
  // One frame at a time. Never remove it on a timer — Chrome's print preview
  // dies if the source document disappears while the dialog is open.
  document.getElementById(FRAME_ID)?.remove();

  const frame = document.createElement("iframe");
  frame.id = FRAME_ID;
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  // Real layout width (so measurement and print see A4), but invisible.
  frame.style.cssText = `position:fixed;left:0;top:0;width:${PAGE_W_PX}px;height:${PAGE_H_PX}px;border:0;visibility:hidden;pointer-events:none;z-index:-1;`;
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  const win = frame.contentWindow;
  if (!doc || !win) {
    frame.remove();
    window.print();
    return;
  }

  doc.open();
  doc.write("<!doctype html><html><head></head><body></body></html>");
  doc.close();

  // Relative URLs (illustrations, fonts) resolve against the app, not about:blank.
  const base = doc.createElement("base");
  base.href = document.baseURI;
  doc.head.appendChild(base);
  doc.title = document.title;

  // The app's stylesheets, so the sheet renders exactly as on screen. The
  // next/font variables live in classes on <html>; mirror them.
  doc.documentElement.className = document.documentElement.className;
  const sheetLoads: Promise<unknown>[] = [];
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    const clone = node.cloneNode(true);
    if (clone instanceof HTMLLinkElement) {
      // An unloaded stylesheet at print time means an unstyled sheet — wait.
      sheetLoads.push(new Promise((r) => ((clone.onload = r), (clone.onerror = r))));
    }
    doc.head.appendChild(clone);
  });
  const printCss = doc.createElement("style");
  printCss.textContent = PRINT_DOC_CSS;
  doc.head.appendChild(printCss);

  for (const el of areas) doc.body.appendChild(el.cloneNode(true));

  // Let stylesheets land, THEN fonts (they only start loading once the CSS is
  // in) and images, before measuring or printing. Capped so a straggler can
  // never block the print.
  const settled = (async () => {
    await Promise.all(sheetLoads);
    await Promise.all([
      doc.fonts?.ready.catch(() => undefined) ?? Promise.resolve(),
      ...Array.from(doc.images).map((img) =>
        img.complete ? Promise.resolve() : new Promise<unknown>((r) => ((img.onload = r), (img.onerror = r))),
      ),
    ]);
  })();
  await Promise.race([settled, new Promise((r) => window.setTimeout(r, 4000))]);

  // Measured orphan fit: if a single sheet spills just past a page boundary,
  // shrink it slightly so it settles onto a whole number of pages.
  if (areas.length === 1) {
    const h = doc.body.scrollHeight;
    const pages = h / PAGE_H_PX;
    const whole = Math.floor(pages);
    const frac = pages - whole;
    if (whole >= 1 && frac > 0 && frac < ORPHAN_FRACTION) {
      const scale = (whole * PAGE_H_PX) / h;
      // Below the readability floor the shrink can't reach a whole page count
      // anyway — it would just make the text smaller AND leave a worse orphan.
      if (scale >= MIN_SCALE) doc.documentElement.style.setProperty("--ws-print-scale", String(scale));
    }
  }

  win.addEventListener("afterprint", () => {
    // Give the dialog a beat to fully close before tearing down.
    window.setTimeout(() => frame.remove(), 1000);
  });
  win.focus();
  win.print();
}
