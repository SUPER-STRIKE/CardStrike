/**
 * Init.ts — Last file in build order. Exposes the `GM` namespace as a
 * global on `window` so the browser-side `cardTest.html` can read it.
 */
namespace GM.Init {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g: any = typeof globalThis !== "undefined" ? globalThis : {};
  g.GM = GM;
}
