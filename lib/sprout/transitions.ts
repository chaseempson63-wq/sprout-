import { flushSync } from "react-dom";

/* Same-document view transitions. Used for the timeline's card/grid morph
   (per-entry shared elements), week slides, and filter crossfades. Falls
   back to an instant update where the API is missing or motion is reduced,
   so Safari/Firefox lose only the flourish, never the function. */

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export function withViewTransition(update: () => void, done?: () => void) {
  const doc = document as DocWithVT;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduced) {
    update();
    done?.();
    return;
  }
  doc
    .startViewTransition(() => {
      // The browser snapshots "old" at call time and "new" after this
      // callback; React must commit synchronously inside it.
      flushSync(update);
    })
    .finished.finally(() => done?.());
}

/** Commit a state change synchronously BEFORE snapshotting, e.g. attaching
    view-transition-names so they exist in the "old" capture. */
export function prepareViewTransition(update: () => void) {
  flushSync(update);
}

/** view-transition-name must be a valid CSS ident; entry ids are uuids. */
export function vtName(prefix: string, id: string): string {
  return `${prefix}-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
