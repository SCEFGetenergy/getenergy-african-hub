// Small, dependency-free search over the SOPHIA knowledge base. Runs in the browser (/answers)
// and on the server (SOPHIA's search_knowledge tool). BM25 ranking over question, keywords and
// answer, with synonyms for local and everyday terms and tolerance for one-letter typos.
import { KNOWLEDGE, type KnowledgeEntry, type KnowledgeTopic } from "./knowledge";

const STOP = new Set(
  "a an and are as at be by can do does for from get getenergy energy how i if in is it its me my of on or our should the to we what when where which who will with you your about any there this that than then".split(" "),
);

// Each group maps to the first word, so a search for any word in the group matches the others.
const SYNONYM_GROUPS: string[][] = [
  ["ev", "electric", "evs", "bev"],
  ["car", "vehicle", "auto", "motor"],
  ["charge", "charging", "charger", "chargers", "charged", "recharge", "plug"],
  ["station", "point", "hub", "location", "site"],
  ["cost", "price", "fee", "fees", "tariff", "much", "naira", "expensive", "cheap", "cheaper", "afford"],
  ["power", "grid", "nepa", "phcn", "light", "electricity", "outage", "blackout"],
  ["course", "courses", "training", "programme", "program", "class", "classes", "lesson"],
  ["certificate", "certification", "certified", "accredited", "accreditation", "qualification"],
  ["buy", "purchase", "sell", "order", "acquire"],
  ["repair", "fix", "service", "maintenance", "mechanic", "workshop"],
  ["fleet", "fleets", "logistics"],
  ["home", "house", "residential", "domestic"],
  ["start", "begin", "commence", "intake", "cohort", "date"],
  ["pay", "payment", "paying", "instalment", "installment"],
];

const SYN = new Map<string, string>();
for (const group of SYNONYM_GROUPS) for (const w of group) if (!SYN.has(w)) SYN.set(w, group[0]!);

function stem(w: string): string {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && w.endsWith("es") && !w.endsWith("ses")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

function rawWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/₦/g, " naira ")
    .replace(/[^a-z0-9/%\s-]/g, " ")
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w));
}

const canonical = (w: string) => SYN.get(w) ?? SYN.get(stem(w)) ?? stem(w);

export function tokenize(text: string): string[] {
  return rawWords(text).map(canonical);
}

/** Edit distance with adjacent swaps counted as one edit; stops early once it exceeds max. */
function withinEdits(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i < rows; i++) {
    let rowMin = Infinity;
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2]![j - 2]! + 1);
      d[i]![j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return false;
  }
  return d[a.length]![b.length]! <= max;
}

type Doc = { entry: KnowledgeEntry; terms: Map<string, number>; length: number };

const FIELD_WEIGHTS = { question: 3, keywords: 2, answer: 1 } as const;

function buildDoc(entry: KnowledgeEntry): Doc {
  const terms = new Map<string, number>();
  const add = (text: string, weight: number) => {
    for (const t of tokenize(text)) terms.set(t, (terms.get(t) ?? 0) + weight);
  };
  add(entry.question, FIELD_WEIGHTS.question);
  add((entry.keywords ?? []).join(" "), FIELD_WEIGHTS.keywords);
  add(entry.answer, FIELD_WEIGHTS.answer);
  let length = 0;
  for (const v of terms.values()) length += v;
  return { entry, terms, length };
}

export type SearchResult = { entry: KnowledgeEntry; score: number };

export function createIndex(entries: KnowledgeEntry[]) {
  const docs = entries.map(buildDoc);
  const avgLen = docs.reduce((s, d) => s + d.length, 0) / Math.max(docs.length, 1);
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.terms.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  // Every spelling seen in the knowledge base (and in the synonym lists), mapped to its search term.
  const spellings = new Map<string, string>();
  for (const e of entries) for (const w of rawWords(`${e.question} ${(e.keywords ?? []).join(" ")} ${e.answer}`)) spellings.set(stem(w), canonical(w));
  for (const w of SYN.keys()) spellings.set(stem(w), canonical(w));
  const N = docs.length;
  const k1 = 1.4;
  const b = 0.6;

  /** Map a query word to search terms: itself if known, otherwise close spellings (typos). */
  const cache = new Map<string, { term: string; exact: boolean }[]>();
  const expand = (raw: string): { term: string; exact: boolean }[] => {
    const hit = cache.get(raw);
    if (hit) return hit;
    const result = expandUncached(raw);
    if (cache.size > 500) cache.clear();
    cache.set(raw, result);
    return result;
  };
  const expandUncached = (raw: string): { term: string; exact: boolean }[] => {
    const c = canonical(raw);
    if (df.has(c)) return [{ term: c, exact: true }];
    const w = stem(raw);
    if (w.length < 5) return [];
    const max = w.length >= 7 ? 2 : 1;
    const out = new Set<string>();
    for (const [spelling, term] of spellings) {
      // Typos rarely change the first letter; checking it first keeps search fast while typing.
      if (spelling[0] !== w[0] || spelling.length < 4 || Math.abs(spelling.length - w.length) > max || !df.has(term)) continue;
      if (withinEdits(w, spelling, max)) out.add(term);
    }
    return [...out].map((term) => ({ term, exact: false }));
  };

  return function search(query: string, opts: { topic?: KnowledgeTopic; limit?: number } = {}): SearchResult[] {
    const qTerms = [...new Set(rawWords(query))];
    if (!qTerms.length) return [];
    const scored: SearchResult[] = [];
    for (const d of docs) {
      if (opts.topic && d.entry.topic !== opts.topic) continue;
      let score = 0;
      let matched = 0;
      for (const q of qTerms) {
        let best = 0;
        for (const { term: t, exact } of expand(q)) {
          const tf = d.terms.get(t);
          if (!tf) continue;
          const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
          const s = (idf * (tf * (k1 + 1))) / (tf + k1 * (1 - b + (b * d.length) / avgLen));
          best = Math.max(best, exact ? s : s * 0.8); // typo matches count a little less
        }
        if (best > 0) matched++;
        score += best;
      }
      // Reward entries that match more of the query's words.
      if (score > 0) scored.push({ entry: d.entry, score: score * (0.5 + (0.5 * matched) / qTerms.length) });
    }
    scored.sort((x, y) => y.score - x.score);
    return scored.slice(0, opts.limit ?? 5);
  };
}

export const searchKnowledge = createIndex(KNOWLEDGE);
