import { createServerFn } from '@tanstack/react-start';
import { formSchema, saveSchema } from './intake';
import type { IntakeForm } from './types';

export const getIntakeForm = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => formSchema.parse(input))
  .handler(async ({ data }) => {
    const { intakeContext } = await import('./intake.server');
    const { client, userId, bucket } = await intakeContext();
    const result = await client.rpc('get_intake_form', { p_reference: data.reference, p_token: data.token, p_user_id: userId, p_bucket: bucket });
    if (result.error) throw new Error(result.error.message);
    return result.data as unknown as IntakeForm;
  });

export const saveIntakeForm = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) throw new Error('Please try again.');
    const { intakeContext } = await import('./intake.server');
    const { client, userId, bucket } = await intakeContext();
    const result = await client.rpc('save_intake_answers', { p_reference: data.reference, p_token: data.token, p_user_id: userId, p_bucket: bucket, p_answers: data.answers, p_via: 'web' });
    if (result.error) throw new Error(result.error.message);
    return { reference: data.reference, saved: result.data };
  });