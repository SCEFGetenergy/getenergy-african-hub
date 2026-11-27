import { describe, expect, it, vi } from 'vitest';
import { createKnowledgeCache } from './knowledge-cache';
import { publishedEntries, saveSchema } from './intake';

describe('published database knowledge', () => {
  it('indexes published entries only, never drafts', () => {
    const entries = publishedEntries(['published','draft'].map((status,index) => ({id:`entry-${index}`,topic_id:'payments',question:'Is the wallet ready?',answer:'Wallet pending configuration',keywords:['wzip'],link_href:'/technology',link_label:'Technology',status})));
    expect(entries.map(entry=>entry.id)).toEqual(['entry-0']);
  });
  it('refreshes after five minutes', async () => {
    const cache=createKnowledgeCache(); const load=vi.fn(async()=>({entries:[],topics:[]}));
    await cache(1,load,0); await cache(1,load,299999); expect(load).toHaveBeenCalledTimes(1);
    await cache(1,load,300000); expect(load).toHaveBeenCalledTimes(2);
  });
  it('refreshes immediately after a publication version change', async () => {
    const cache=createKnowledgeCache(); const load=vi.fn(async()=>({entries:[],topics:[]}));
    await cache(1,load,0); await cache(2,load,1); expect(load).toHaveBeenCalledTimes(2);
  });
  it('does not use a stale fallback when database loading fails', async () => {
    const cache=createKnowledgeCache(); await cache(1,async()=>({entries:[],topics:[]}),0);
    await expect(cache(2,async()=>{throw new Error('offline');},1)).rejects.toThrow('offline');
  });
});
describe('online answer input',()=>{
  it('limits answers to 2000 characters',()=>{expect(saveSchema.safeParse({reference:'GE-TEST-1',answers:[{key:'q1',answer:'x'.repeat(2000)}]}).success).toBe(true);expect(saveSchema.safeParse({reference:'GE-TEST-1',answers:[{key:'q1',answer:'x'.repeat(2001)}]}).success).toBe(false);});
  it('permits skipping all questions',()=>{expect(saveSchema.parse({reference:'GE-TEST-1',answers:[]}).answers).toEqual([]);});
});