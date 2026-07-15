// Print a clean document that contains ONLY the worksheet, paginated into
// explicit A4 pages.
//
// Printing the app page in place was broken three ways: the visibility-based
// print CSS hid the app shell but kept its layout, so the sheet printed below
// pages of invisible chrome; the sheet sat inside flex/grid ancestors, which
// Chrome cannot fragment reliably (everything after the first break got
// clipped); and the default @page margin framed the sheet in white and gave
// the browser room to draw its date/title header line.
//
// The old fix cloned the sheet into an iframe as ONE tall flow and leaned on
// CSS fragmentation (break-inside) plus a zoom-based orphan squeeze. That was
// still fragile: zoom interacts badly with Chrome's fragmenter (the mangled
// page 2), and page 2+ printed with no Sprout header at all.
//
// Now the iframe document is built as REAL pages: fixed A4-height containers,
// each with a header (the full wave banner on page 1, a slim running Sprout
// header after) and, on multi-page sheets, a footer with the page number.
// Blocks are measured live and moved page to page; long lists split BETWEEN
// items, never through one. Every page is complete by construction, so there
// is nothing left for the browser's fragmenter to get wrong.

// A4 at 96 CSS px per inch.
const PAGE_W_PX = 794; // 210mm
const PAGE_H_PX = 1123; // 297mm
const MAX_PAGES = 40; // runaway guard; no real sheet gets near this

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
  /* Fallback path only (pagination bailed): print the sheet as one flow. */
  .print-area {
    position: static !important;
    overflow: visible !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding-bottom: 8mm;
  }
  .print-area + .print-area { break-before: page; }
  /* Paginated path: each .ws-page IS one A4 page. */
  .ws-page {
    position: relative;
    box-sizing: border-box;
    width: ${PAGE_W_PX}px;
    height: ${PAGE_H_PX}px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #FFFEFB;
    break-after: page;
    page-break-after: always;
    break-inside: avoid;
  }
  .ws-page:last-child { break-after: auto; page-break-after: auto; }
  .ws-page-body {
    flex: 1 1 auto;
    min-height: 0;
    box-sizing: border-box;
    padding: 16px 40px 8px;
  }
  .ws-page-foot { flex: 0 0 auto; margin-top: auto; padding: 6px 40px 14px; }
  /* Belt and braces: inside built pages nothing may re-fragment. */
  .ws-page .worksheet-blocks > * { break-inside: avoid; }
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
  // never block the print. Everything below measures live layout, so this
  // wait matters: unloaded webfonts or images would skew block heights.
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

  try {
    paginate(doc);
  } catch {
    // Anything unexpected: leave the flowed sheet in place — the fallback CSS
    // path still prints, just without the per-page chrome.
  }

  // Debug hook (QA): localStorage sprout-print-debug=1 shows the paginated
  // frame instead of opening the dialog, and stashes the doc HTML for
  // headless-Chrome PDF rendering.
  let debug = false;
  try {
    debug = window.localStorage.getItem("sprout-print-debug") === "1";
  } catch {
    /* storage blocked; not debugging */
  }
  if (debug) {
    frame.style.cssText = `position:fixed;right:0;top:0;width:${PAGE_W_PX}px;height:100%;border:0;visibility:visible;pointer-events:auto;z-index:2147483647;background:#fff;box-shadow:0 0 0 3px #C6881A;`;
    (window as unknown as Record<string, unknown>).__sproutPrintHTML = doc.documentElement.outerHTML;
    return;
  }

  win.addEventListener("afterprint", () => {
    // Give the dialog a beat to fully close before tearing down.
    window.setTimeout(() => frame.remove(), 1000);
  });
  win.focus();
  win.print();
}

// ── pagination ────────────────────────────────────────────────────────────────

interface PageCtx {
  page: HTMLElement;
  blocks: HTMLElement;
  body: HTMLElement;
}

const pageOverflows = (p: PageCtx) => p.body.scrollHeight > p.body.clientHeight;

function paginate(doc: Document): void {
  const areas = Array.from(doc.body.querySelectorAll<HTMLElement>(".print-area"));
  // Validate EVERY sheet before mutating anything: pagination moves nodes out
  // of the source sheets, so a mid-run bail would leave duplicated content.
  // One unexpected sheet keeps them all on the (correct, just plainer) flow path.
  for (const area of areas) {
    if (!area.querySelector(".ws-banner") || !area.querySelector(".worksheet-blocks") || !area.querySelector(".worksheet-body")) {
      return;
    }
  }
  const built = areas.map((area) => paginateSheet(doc, area));
  for (const area of areas) area.remove();
  for (const pages of built) {
    const n = pages.length;
    pages.forEach((page, i) => {
      const num = page.querySelector<HTMLElement>(".ws-page-num");
      if (num) num.textContent = `Page ${i + 1} of ${n}`;
      // A single-page sheet keeps today's exact look: no page-number footer.
      if (n === 1) page.querySelector(".ws-page-foot")?.remove();
    });
  }
}

function paginateSheet(doc: Document, area: HTMLElement): HTMLElement[] {
  const banner = area.querySelector<HTMLElement>(".ws-banner") as HTMLElement;
  const blocksWrap = area.querySelector<HTMLElement>(".worksheet-blocks") as HTMLElement;
  const runTpl = area.querySelector<HTMLElement>(".ws-running-header > div");
  const footTpl = area.querySelector<HTMLElement>(".ws-page-footer > div");

  // Content in print order: intro, every block, then the sheet footer.
  const content: HTMLElement[] = [];
  const intro = area.querySelector<HTMLElement>(".ws-intro");
  if (intro) content.push(intro);
  content.push(...(Array.from(blocksWrap.children) as HTMLElement[]));
  const sheetFooter = area.querySelector<HTMLElement>(".worksheet-footer");
  if (sheetFooter) content.push(sheetFooter as HTMLElement);

  const pages: HTMLElement[] = [];
  const newPage = (first: boolean): PageCtx => {
    const page = doc.createElement("div");
    page.className = "ws-page";
    // Header: page 1 gets the real wave banner (moved, so its mascot keeps its
    // unique SVG ids); later pages get a clone of the slim running header.
    if (first) {
      page.appendChild(banner);
    } else if (runTpl) {
      page.appendChild(runTpl.cloneNode(true));
    }
    const pageBody = doc.createElement("div");
    pageBody.className = "ws-page-body";
    const blocks = doc.createElement("div");
    // Same wrapper class as on screen so the block spacing rules (space-y-9)
    // and any .worksheet-blocks selectors keep applying inside pages.
    blocks.className = blocksWrap.className;
    pageBody.appendChild(blocks);
    page.appendChild(pageBody);
    if (footTpl) {
      const foot = doc.createElement("div");
      foot.className = "ws-page-foot";
      foot.appendChild(footTpl.cloneNode(true));
      page.appendChild(foot);
    }
    // Attached immediately: fit checks below measure live layout.
    doc.body.appendChild(page);
    pages.push(page);
    return { page, blocks, body: pageBody };
  };

  let cur = newPage(true);
  for (const node of content) {
    if (pages.length > MAX_PAGES) break;
    cur.blocks.appendChild(node);
    if (!pageOverflows(cur)) continue;
    cur.blocks.removeChild(node);

    // A long list block splits BETWEEN items across pages.
    if (node.classList.contains("ws-splittable") && splitAcross(node, cur, () => (cur = newPage(false)))) continue;

    // Whole block onto a fresh page. If the page it lands on is empty and the
    // block STILL overflows, grow that page rather than clip content.
    if (cur.blocks.childElementCount > 0) cur = newPage(false);
    cur.blocks.appendChild(node);
    if (pageOverflows(cur)) {
      cur.page.style.height = "auto";
      cur = newPage(false);
    }
  }

  // Drop trailing empty pages the loop may have opened.
  while (pages.length > 1) {
    const last = pages[pages.length - 1];
    const blocks = last.querySelector(".worksheet-blocks");
    if (blocks && blocks.childElementCount === 0) {
      last.remove();
      pages.pop();
    } else break;
  }
  return pages;
}

// Split a .ws-splittable block between its items (li / .ws-item), moving whole
// items page to page. The prompt paragraph stays with the first fragment only.
// Returns false without touching the DOM if the block can't be split safely
// (caller then places it whole).
//
// Fragments are cloned from a PRISTINE shell built once up front — never from
// the live block, which drains as its items are moved out (re-cloning it for
// fragment 2 was the bug that scrambled multi-page sheets: the clone walk no
// longer matched and items landed in a dead fragment).
function splitAcross(block: HTMLElement, first: PageCtx, nextPage: () => PageCtx): boolean {
  const ITEM_SEL = "li, .ws-item";
  const CONT_ATTR = "data-ws-cont";
  const topLevel = (root: HTMLElement) =>
    Array.from(root.querySelectorAll<HTMLElement>(ITEM_SEL)).filter(
      // only top-level items: an item nested inside another item moves with its parent
      (el) => el.parentElement && el.parentElement.closest(ITEM_SEL) === null,
    );

  const items = topLevel(block);
  if (items.length < 2) return false;

  // Tag each item container on the original so every shell clone carries an
  // addressable copy, then record which container each item belongs to.
  const containers: HTMLElement[] = [];
  for (const it of items) {
    const p = it.parentElement as HTMLElement;
    if (!containers.includes(p)) containers.push(p);
  }
  containers.forEach((c, i) => c.setAttribute(CONT_ATTR, String(i)));
  const itemHome = items.map((it) => containers.indexOf(it.parentElement as HTMLElement));

  // The shell: the block minus its items, cloned while the block is untouched.
  const shell = block.cloneNode(true) as HTMLElement;
  for (const it of topLevel(shell)) it.remove();

  const makeFragment = (withPrompt: boolean): { frag: HTMLElement; conts: HTMLElement[] } => {
    const frag = shell.cloneNode(true) as HTMLElement;
    const conts: HTMLElement[] = new Array(containers.length);
    frag.querySelectorAll<HTMLElement>(`[${CONT_ATTR}]`).forEach((c) => {
      conts[Number(c.getAttribute(CONT_ATTR))] = c;
    });
    if (conts.some((c) => !c)) return { frag, conts: [] }; // impossible-shape guard
    if (!withPrompt) frag.querySelector(":scope > p:first-child")?.remove();
    return { frag, conts };
  };

  let made = makeFragment(true);
  if (made.conts.length === 0) {
    containers.forEach((c) => c.removeAttribute(CONT_ATTR));
    return false;
  }

  const finishFragment = (f: HTMLElement, c: HTMLElement[]) => {
    // Containers that got no items would print as stray empty boxes — drop them.
    for (const cont of c) if (cont.childElementCount === 0) cont.remove();
    if (f.childElementCount === 0) f.remove();
    f.querySelectorAll(`[${CONT_ATTR}]`).forEach((el) => el.removeAttribute(CONT_ATTR));
  };

  let target = first;
  target.blocks.appendChild(made.frag);
  let placedInFragment = 0;
  for (const [i, item] of items.entries()) {
    made.conts[itemHome[i]].appendChild(item);
    if (!pageOverflows(target)) {
      placedInFragment++;
      continue;
    }
    made.conts[itemHome[i]].removeChild(item);
    if (placedInFragment === 0) {
      // Not even one item fit beside the shell here; retry on a fresh page.
      made.frag.remove();
    } else {
      finishFragment(made.frag, made.conts);
    }
    target = nextPage();
    made = makeFragment(false);
    target.blocks.appendChild(made.frag);
    made.conts[itemHome[i]].appendChild(item);
    placedInFragment = 1;
    if (pageOverflows(target)) {
      // A single item taller than an empty page: grow rather than clip.
      target.page.style.height = "auto";
    }
  }
  finishFragment(made.frag, made.conts);
  containers.forEach((c) => c.removeAttribute(CONT_ATTR));
  return true;
}
