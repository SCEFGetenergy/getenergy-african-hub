import { z } from 'zod';
export const SERVICE_KEYS = ['academy','careers','diesel','power_solar_minigrid','cng','ev_fleet','smart_metering','partners_investors','energy_saving_equipment','corporate_training','internship','volunteering'] as const;
export const answerSchema = z.object({ key: z.string().min(1).max(80), answer: z.string().trim().min(1).max(2000) });
export const formSchema = z.object({ reference: z.string().min(3).max(100), token: z.string().max(128).default('') });
export const saveSchema = formSchema.extend({ answers: z.array(answerSchema).max(30), website: z.string().max(200).default('') });
export function publishedEntries(rows: { id: string; topic_id: string; question: string; answer: string; keywords: string[]; link_label: string | null; link_href: string | null; status: string }[]) {
  return rows.filter(row => row.status === 'published').map(row => ({ id: row.id, topic: row.topic_id, question: row.question, answer: row.answer, keywords: row.keywords, ...(row.link_href ? { link: { href: row.link_href, label: row.link_label || 'Read more' } } : {}) }));
}