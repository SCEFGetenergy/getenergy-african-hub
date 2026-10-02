// Server-only helpers for calling the Lovable AI Gateway (Responses API) with run-ID correlation.
const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolved = false;
  let resolve: (v: string | undefined) => void = () => {};
  const ready = new Promise<string | undefined>((r) => (resolve = r));
  const publish = (v?: string) => {
    const next = v?.trim() || undefined;
    if (!runId && next) runId = next;
    if (!resolved) {
      resolved = true;
      resolve(runId);
    }
  };
  if (runId) publish(runId);
  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      try {
        const res = await fetch(input, { ...init, headers });
        publish(res.headers.get(RUN_ID_HEADER) ?? undefined);
        return res;
      } catch (e) {
        publish(undefined);
        throw e;
      }
    },
    getRunId: () => runId,
    waitForRunId: () => (runId ? Promise.resolve(runId) : ready),
  };
}

export function getRequestRunId(request: Request) {
  return request.headers.get(RUN_ID_HEADER)?.trim() || undefined;
}

export async function withRunIdHeader(
  response: Response,
  gw: { waitForRunId: () => Promise<string | undefined>; getRunId: () => string | undefined },
) {
  if (!response.body) return response;
  const reader = response.body.getReader();
  const first = reader.read();
  const runId = await gw.waitForRunId();
  const headers = new Headers(response.headers);
  if (runId) {
    headers.set(RUN_ID_HEADER, runId);
    headers.set("Access-Control-Expose-Headers", RUN_ID_HEADER);
  }
  const body = new ReadableStream({
    async start(controller) {
      try {
        const f = await first;
        if (f.done) return controller.close();
        controller.enqueue(f.value);
        while (true) {
          const c = await reader.read();
          if (c.done) break;
          controller.enqueue(c.value);
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
    cancel: (r) => reader.cancel(r),
  });
  return new Response(body, { status: response.status, statusText: response.statusText, headers });
}
