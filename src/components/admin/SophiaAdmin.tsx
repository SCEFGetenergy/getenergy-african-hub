import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';

type Entry = Database['public']['Tables']['kb_entries']['Row'];
type QuestionSet = Database['public']['Tables']['intake_question_sets']['Row'];
const topicOptions = async () => { const result = await supabase.from('kb_topics').select('id,name').order('sort'); if (result.error) throw result.error; return result.data; };
const handleError = (error: unknown) => toast.error(error instanceof Error ? error.message : 'Could not save.');

export function KnowledgeBaseAdmin() {
  const qc = useQueryClient();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Entry | null | undefined>(undefined);
  const topics = useQuery({ queryKey: ['kb-admin-topics'], queryFn: topicOptions });
  const entries = useQuery({ queryKey: ['kb-admin-entries'], queryFn: async () => {
    const result = await supabase.from('kb_entries').select('*').order('updated_at', { ascending: false }).limit(500);
    if (result.error) throw result.error; return result.data;
  } });
  return <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Knowledge base</h2><Button onClick={() => setEditing(null)}>Add entry</Button></div>
    <Input aria-label="Search knowledge base" placeholder="Search questions, topics or answers" value={query} onChange={event => setQuery(event.target.value)} />
    {entries.error && <p role="alert" className="text-destructive">{entries.error.message}</p>}
    {editing !== undefined && <EntryEditor key={editing?.id ?? 'new'} entry={editing} topics={topics.data ?? []} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); void qc.invalidateQueries({ queryKey: ['kb-admin-entries'] }); void qc.invalidateQueries({ queryKey: ['published-knowledge'] }); }} />}
    <div className="divide-y divide-border">{entries.data?.filter(entry => `${entry.question} ${entry.answer} ${entry.topic_id}`.toLowerCase().includes(query.toLowerCase())).map(entry => <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="min-w-0 flex-1"><p className="font-semibold break-words">{entry.question}</p><p className="text-xs text-muted-foreground">{entry.topic_id} · {entry.status} · {entry.source}</p></div><Button variant="outline" onClick={() => setEditing(entry)}>Edit</Button></div>)}</div>
    <QuestionSetsAdmin />
  </section>;
}
function EntryEditor({ entry, topics, onClose, onSaved }: { entry: Entry | null; topics: { id: string; name: string }[]; onClose: () => void; onSaved: () => void }) {
  const [topic, setTopic] = useState(entry?.topic_id ?? topics[0]?.id ?? 'solutions');
  const [question, setQuestion] = useState(entry?.question ?? '');
  const [answer, setAnswer] = useState(entry?.answer ?? '');
  const [keywords, setKeywords] = useState(entry?.keywords.join(', ') ?? '');
  const [href, setHref] = useState(entry?.link_href ?? '');
  const [label, setLabel] = useState(entry?.link_label ?? '');
  const [busy, setBusy] = useState(false);
  const save = async (status: 'draft' | 'published') => {
    setBusy(true);
    try {
      const row = { topic_id: topic, question: question.trim(), answer: answer.trim(), keywords: keywords.split(',').map(word => word.trim()).filter(Boolean).slice(0,50), link_href: href.trim() || null, link_label: label.trim() || null, status, source: entry?.source ?? 'team' };
      const result = entry ? await supabase.from('kb_entries').update(row).eq('id',entry.id) : await supabase.from('kb_entries').insert(row);
      if (result.error) throw result.error; toast.success(status === 'published' ? 'Answer published.' : 'Draft saved.'); onSaved();
    } catch (error) { handleError(error); } finally { setBusy(false); }
  };
  return <div className="space-y-3 rounded-lg border border-border p-4">
    <label className="block text-sm">Topic<select className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3" value={topic} onChange={event => setTopic(event.target.value)}>{topics.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label className="block text-sm">Question<Input value={question} maxLength={500} onChange={event => setQuestion(event.target.value)} /></label>
    <label className="block text-sm">Confirmed answer<Textarea className="min-h-36" value={answer} maxLength={12000} onChange={event => setAnswer(event.target.value)} /></label>
    <label className="block text-sm">Keywords, separated by commas<Input value={keywords} onChange={event => setKeywords(event.target.value)} /></label>
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Link label<Input value={label} onChange={event => setLabel(event.target.value)} /></label><label className="text-sm">Site link<Input value={href} placeholder="/contact" onChange={event => setHref(event.target.value)} /></label></div>
    <div className="flex flex-wrap gap-2"><Button disabled={busy} variant="outline" onClick={() => void save('draft')}>Save draft</Button><Button disabled={busy || question.trim().length < 2 || !answer.trim() || answer.trim() === 'To confirm with the team'} onClick={() => void save('published')}>Publish</Button><Button variant="ghost" onClick={onClose}>Cancel</Button></div>
  </div>;
}
function QuestionSetsAdmin() {
  const sets = useQuery({ queryKey: ['intake-admin-sets'], queryFn: async () => { const result = await supabase.from('intake_question_sets').select('*').order('sort'); if (result.error) throw result.error; return result.data; } });
  return <details className="border-t border-border pt-6"><summary className="cursor-pointer font-semibold">Intake question sets</summary><div className="mt-4 space-y-6">{sets.data?.map(set => <SetEditor key={set.id} row={set} />)}</div></details>;
}
function SetEditor({ row }: { row: QuestionSet }) {
  const qc = useQueryClient();
  const [questions, setQuestions] = useState(JSON.stringify(row.questions,null,2));
  const [published, setPublished] = useState(row.status === 'published');
  const [busy, setBusy] = useState(false);
  return <div className="space-y-2"><h3 className="font-semibold">{row.name}</h3><Textarea aria-label={`${row.name} questions`} className="min-h-40 font-mono text-xs" value={questions} onChange={event => setQuestions(event.target.value)} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={event => setPublished(event.target.checked)} />Published</label><Button disabled={busy} variant="outline" onClick={async () => {
    setBusy(true); try {
      const value = z.array(z.object({ key: z.string().min(1).max(80), text: z.string().min(2).max(1000), required: z.boolean() })).max(30).parse(JSON.parse(questions));
      if (new Set(value.map(question => question.key)).size !== value.length) throw new Error('Question keys must be unique.');
      const result = await supabase.from('intake_question_sets').update({ questions: value, status: published ? 'published' : 'draft' }).eq('id', row.id);
      if (result.error) throw result.error; toast.success('Questions saved.'); void qc.invalidateQueries({ queryKey: ['intake-admin-sets'] });
    } catch (error) { handleError(error); } finally { setBusy(false); }
  }}>Save questions</Button></div>;
}
export function UnansweredAdmin() {
  const qc = useQueryClient();
  const [answer, setAnswer] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [topic, setTopic] = useState('solutions');
  const [busy, setBusy] = useState(false);
  const topics = useQuery({ queryKey: ['kb-admin-topics'], queryFn: topicOptions });
  const queue = useQuery({ queryKey: ['unanswered-admin'], queryFn: async () => { const result = await supabase.from('unanswered_questions').select('*').order('created_at',{ascending:false}).limit(200); if (result.error) throw result.error; return result.data; } });
  return <section className="space-y-4"><h2 className="text-xl font-bold">Unanswered questions</h2>{queue.error && <p role="alert">{queue.error.message}</p>}
    {!queue.data?.length && <p className="text-muted-foreground">No unanswered questions.</p>}
    <Button variant="outline" onClick={() => void qc.invalidateQueries({queryKey:['unanswered-admin']})}>Refresh</Button>
    <div className="divide-y divide-border">{queue.data?.map(row => <div key={row.id} className="space-y-3 py-4"><p className="font-semibold break-words">{row.question}</p><p className="text-sm text-muted-foreground">{row.page} · {row.status} · {row.visitor_email || 'No visitor email'} · {new Date(row.created_at).toLocaleString()}</p><p className="text-xs text-muted-foreground">Team email: {row.alert_status}{row.alert_provider_status ? ` (${row.alert_provider_status})` : ''} · Visitor answer: {row.reply_status}{row.reply_provider_status ? ` (${row.reply_provider_status})` : ''}</p>
      {row.status === 'new' && <div className="flex gap-2"><Button variant="outline" onClick={() => { setSelected(row.id); setAnswer(''); }}>Answer</Button><Button variant="ghost" onClick={async () => { const result = await supabase.from('unanswered_questions').update({status:'dismissed'}).eq('id',row.id); if(result.error) handleError(result.error); else void qc.invalidateQueries({queryKey:['unanswered-admin']}); }}>Dismiss</Button></div>}
      {selected === row.id && <div className="space-y-3"><select aria-label="Answer topic" className="min-h-11 w-full border border-input bg-background px-3" value={topic} onChange={event => setTopic(event.target.value)}>{topics.data?.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><Textarea aria-label="Confirmed answer to publish" value={answer} maxLength={12000} onChange={event => setAnswer(event.target.value)} /><Button disabled={busy || !answer.trim()} onClick={async () => { setBusy(true); try { const result = await supabase.rpc('answer_publish_unanswered',{p_id:row.id,p_topic:topic,p_answer:answer.trim(),p_link_label:'Answers',p_link_href:'/answers'}); if(result.error) throw result.error; toast.success('Answer published. Email delivery depends on the configured sender.'); setSelected(null); void qc.invalidateQueries({queryKey:['unanswered-admin']}); void qc.invalidateQueries({queryKey:['kb-admin-entries']}); void qc.invalidateQueries({queryKey:['published-knowledge']}); } catch(error) { handleError(error); } finally {setBusy(false);} }}>Answer & publish</Button></div>}
    </div>)}</div>
  </section>;
}
export function IntakeAnswersAdmin() {
  const [reference,setReference] = useState('');
  const rows = useQuery({queryKey:['intake-admin-answers',reference],enabled:reference.trim().length>2,queryFn:async()=>{const result=await supabase.from('intake_answers').select('*').eq('request_reference',reference.trim()).order('created_at'); if(result.error) throw result.error; return result.data;}});
  return <section className="space-y-4"><h2 className="text-xl font-bold">Intake answers</h2><Input aria-label="Request reference" placeholder="Request reference" value={reference} onChange={event=>setReference(event.target.value)} />{rows.error && <p role="alert">{rows.error.message}</p>}{rows.data?.map(row=><div key={row.id} className="border-b border-border py-3"><p className="font-semibold">{row.question_text}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{row.answer}</p><p className="mt-1 text-xs text-muted-foreground">{row.answered_via} · {new Date(row.created_at).toLocaleString()}</p></div>)}{rows.data?.length===0 && <p>No saved answers for this reference.</p>}</section>;
}