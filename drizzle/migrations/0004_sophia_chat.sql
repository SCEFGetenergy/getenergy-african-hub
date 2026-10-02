CREATE TABLE public.sophia_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_token text NOT NULL,
  user_id uuid,
  title text NOT NULL DEFAULT 'New conversation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.sophia_threads TO service_role;
ALTER TABLE public.sophia_threads ENABLE ROW LEVEL SECURITY;
CREATE INDEX sophia_threads_visitor_idx ON public.sophia_threads(visitor_token, updated_at DESC);

CREATE TABLE public.sophia_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.sophia_threads(id) ON DELETE CASCADE,
  message_id text NOT NULL,
  role text NOT NULL,
  message jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (thread_id, message_id)
);
GRANT ALL ON public.sophia_messages TO service_role;
ALTER TABLE public.sophia_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX sophia_messages_thread_idx ON public.sophia_messages(thread_id, created_at);