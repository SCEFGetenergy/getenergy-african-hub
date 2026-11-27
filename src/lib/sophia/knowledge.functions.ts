import { createServerFn } from '@tanstack/react-start';
export const getPublishedKnowledge = createServerFn({ method: 'GET' }).handler(async () => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Confirmed answers are temporarily unavailable.');
  const { loadPublishedKnowledge } = await import('./knowledge.server');
  const data = await loadPublishedKnowledge(url, key);
  return { entries: data.entries, topics: data.topics };
});