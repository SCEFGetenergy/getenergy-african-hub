import { createIndex } from './search';
import type { KnowledgeEntry, KnowledgeTopicRow } from './types';
export function createKnowledgeCache() {
  let cached: { revision: number; at: number; entries: KnowledgeEntry[]; topics: KnowledgeTopicRow[]; search: ReturnType<typeof createIndex> } | undefined;
  return async (revision: number, load: () => Promise<{ entries: KnowledgeEntry[]; topics: KnowledgeTopicRow[] }>, now = Date.now()) => {
    if (cached && cached.revision === revision && now - cached.at < 300000) return cached;
    const data = await load();
    cached = { ...data, revision, at: now, search: createIndex(data.entries) };
    return cached;
  };
}