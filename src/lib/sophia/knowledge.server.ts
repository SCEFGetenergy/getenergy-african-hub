import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { publishedEntries } from './intake';
import { createKnowledgeCache } from './knowledge-cache';
const cache = createKnowledgeCache();
export async function loadPublishedKnowledge(url: string, key: string) {
  const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
    headers.set('apikey', key);
    return fetch(input, { ...init, headers });
  } } });
  const version = await client.from('kb_revision').select('revision').eq('id', 1).single();
  if (version.error) throw new Error('Confirmed answers are temporarily unavailable. Please contact the team.');
  return cache(version.data.revision, async () => {
    const [entries, topics] = await Promise.all([
      client.from('kb_entries').select('id,topic_id,question,answer,keywords,link_label,link_href,status').eq('status','published').order('id'),
      client.from('kb_topics').select('id,slug,name,description,sort').eq('status','published').order('sort'),
    ]);
    if (entries.error || topics.error) throw new Error('Confirmed answers are temporarily unavailable.');
    return { entries: publishedEntries(entries.data ?? []), topics: topics.data ?? [] };
  });
}