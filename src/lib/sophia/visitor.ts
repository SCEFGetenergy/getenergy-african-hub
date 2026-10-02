const KEY = "sophia-visitor-token";

/** Random per-browser token that owns this visitor's SOPHIA conversations. Browser only. */
export function getVisitorToken(): string {
  let t = window.localStorage.getItem(KEY);
  if (!t) {
    t = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
    window.localStorage.setItem(KEY, t);
  }
  return t;
}
