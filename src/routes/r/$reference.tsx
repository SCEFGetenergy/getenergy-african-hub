import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Section } from '@/components/site/ui-bits';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getIntakeForm, saveIntakeForm } from '@/lib/sophia/intake.functions';

export const Route = createFileRoute('/r/$reference')({
  validateSearch: (input: Record<string, unknown>) => ({ token: typeof input['token'] === 'string' && input['token'].length <= 128 ? input['token'] : '' }),
  head: () => ({ meta: [
    { title: 'Answer your request questions | GET Energy' },
    { name: 'description', content: 'Private follow-up questions for your GET Energy request.' },
    { property: 'og:title', content: 'Your request questions | GET Energy' },
    { property: 'og:description', content: 'Secure follow-up for an existing GET Energy enquiry.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex,nofollow' }, { name: 'referrer', content: 'no-referrer' },
  ] }),
  component: IntakePage,
});
function IntakePage() {
  const { reference } = Route.useParams();
  const { token } = Route.useSearch();
  const load = useServerFn(getIntakeForm);
  const save = useServerFn(saveIntakeForm);
  const qc = useQueryClient();
  const key = ['intake-form', reference, token];
  const form = useQuery({ queryKey: key, queryFn: () => load({ data: { reference, token } }), retry: false, gcTime: 0 });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  return <Section><div className="mx-auto max-w-2xl">
    <h1 className="text-2xl font-bold">Your request questions</h1>
    <p className="mt-2 text-sm text-muted-foreground">Reference: {reference}</p>
    {form.isPending ? <p className="mt-6">Loading questions…</p> : form.error ? <p role="alert" className="mt-6 text-destructive">{form.error.message}</p> : <form className="mt-6 space-y-6" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setNotice('');
      try {
        const values = Object.entries(answers).filter(([,answer]) => answer.trim()).map(([key,answer]) => ({ key, answer }));
        const result = await save({ data: { reference, token, answers: values, website } });
        setNotice(`Answers received. Your reference is ${result.reference}. No payment has been taken.`);
        setAnswers({}); await qc.invalidateQueries({ queryKey: key });
      } catch (error) { setNotice(error instanceof Error ? error.message : 'Your answers could not be saved. Please reply to your email.'); }
      finally { setBusy(false); }
    }}>
      <p className="text-muted-foreground">You can leave any question blank and reply to your email instead. Never include passwords, PINs, ID numbers or bank details.</p>
      <div aria-hidden="true" className="hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
      {form.data?.questions.map(question => <label key={question.key} className="block space-y-2 text-sm font-medium"><span>{question.text}</span><Textarea maxLength={2000} value={answers[question.key] || ''} onChange={event => setAnswers(current => ({ ...current, [question.key]: event.target.value }))} /></label>)}
      {form.data?.questions.length ? <Button disabled={busy} className="min-h-11" type="submit">{busy ? 'Saving…' : 'Send answers'}</Button> : <p>No further questions are waiting for your answer.</p>}
    </form>}
    {notice && <p className="mt-4" role="status">{notice}</p>}
    <p className="mt-8 text-sm text-muted-foreground">Questions? <a className="text-primary underline" href="mailto:ccgetenergy@gmail.com">ccgetenergy@gmail.com</a> · WhatsApp +234 818 074 2835</p>
  </div></Section>;
}