import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server';
export async function intakeContext() {
  setResponseHeader('Cache-Control', 'no-store');
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const authorization = getRequestHeader('authorization') || '';
  // A nil UUID cannot be an Auth account; it never matches a nullable request owner.
  let userId = '00000000-0000-0000-0000-000000000000';
  if (authorization.startsWith('Bearer ')) {
    const user = await supabaseAdmin.auth.getUser(authorization.slice(7));
    if (!user.error && user.data.user) userId = user.data.user.id;
  }
  const bucket = getRequestHeader('cf-connecting-ip') || getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return { client: supabaseAdmin, userId, bucket };
}