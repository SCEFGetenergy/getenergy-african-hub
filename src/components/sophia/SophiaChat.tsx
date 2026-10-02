import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@/components/ai-elements/prompt-input";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { createSophiaThread, deleteSophiaThread, listSophiaThreads } from "@/lib/sophia.functions";
import { SophiaAvatar } from "./SophiaAvatar";

const QUICK = [
  "Request an Energy Solution", "Diesel / AGO", "CNG", "EV & Hybrid Mobility", "EV Charging",
  "Solar & Renewables", "Mini-Grid", "Power-as-a-Service", "Battery Storage / BESS",
  "Generators & Distributed Power", "Smart Metering", "Electricity Services", "Energy Advisory",
  "Training & Capacity Development", "Customer Service & Support", "Partnership / OEM",
  "Request a Callback", "Speak to GET Energy",
];

type ThreadRow = { id: string; title: string; updated_at: string };

export function SophiaChat({ threadId, token, initialMessages }: { threadId: string; token: string; initialMessages: UIMessage[] }) {
  const navigate = useNavigate();
  const list = useServerFn(listSophiaThreads);
  const create = useServerFn(createSophiaThread);
  const remove = useServerFn(deleteSophiaThread);
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const refresh = useCallback(() => list({ data: { token } }).then(setThreads).catch(() => {}), [list, token]);
  useEffect(() => { void refresh(); }, [refresh]);

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/sophia",
      body: () => ({ threadId, visitorToken: token, page: document.referrer ? new URL(document.referrer).pathname : "/sophia" }),
    }),
    onError: (e) => {
      const m = e.message || "";
      if (m.includes("429")) toast.error("SOPHIA is busy right now. Please try again in a moment.");
      else if (m.includes("402")) toast.error("SOPHIA is temporarily unavailable. Please contact us on WhatsApp.");
      else toast.error("SOPHIA couldn't reply. Check your connection or contact us on WhatsApp +234 818 074 2835.");
    },
    onFinish: () => { void refresh(); },
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => { inputRef.current?.focus(); }, [status, threadId]);

  const send = (t: string) => {
    const v = t.trim();
    if (!v || busy) return;
    sendMessage({ text: v });
    setText("");
  };

  const newThread = async () => {
    const id = await create({ data: { token } });
    navigate({ to: "/sophia/$threadId", params: { threadId: id } });
  };
  const del = async (id: string) => {
    await remove({ data: { token, threadId: id } });
    if (id === threadId) navigate({ to: "/sophia" });
    else void refresh();
  };

  return (
    <div className="sophia-shell mx-auto grid max-w-6xl gap-4 px-3 py-6 md:grid-cols-[240px_1fr]">
      <aside className="hidden flex-col gap-2 md:flex">
        <button type="button" onClick={newThread} className="btn" style={{ width: "100%" }}>
          <Plus className="size-4" /> New conversation
        </button>
        <nav aria-label="Your conversations" className="flex flex-col gap-1 overflow-y-auto">
          {threads.map((t) => (
            <div key={t.id} className={`group flex items-center rounded-md ${t.id === threadId ? "bg-secondary" : "hover:bg-secondary/60"}`}>
              <Link to="/sophia/$threadId" params={{ threadId: t.id }} className="flex min-h-11 flex-1 items-center gap-2 truncate px-2 text-sm text-foreground">
                <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{t.title}</span>
              </Link>
              <button type="button" aria-label="Delete conversation" onClick={() => del(t.id)} className="flex size-11 items-center justify-center text-muted-foreground hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </nav>
      </aside>

      <section className="flex h-[calc(100dvh-180px)] min-h-[480px] flex-col overflow-hidden rounded-xl border bg-background">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <SophiaAvatar className="size-10" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-tight text-foreground">SOPHIA</p>
            <p className="truncate text-xs text-muted-foreground">Your GET Energy Intelligent Energy Assistant</p>
          </div>
          <button type="button" onClick={newThread} className="flex min-h-11 items-center gap-1 rounded-md px-2 text-sm text-primary md:hidden">
            <Plus className="size-4" /> New
          </button>
          <a href="https://wa.me/2348180742835" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center rounded-md px-2 text-sm text-primary">
            WhatsApp a person
          </a>
        </header>

        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 && (
              <div className="space-y-4">
                <Message from="assistant">
                  <MessageContent>
                    <MessageResponse>
                      {"Hello, I'm **SOPHIA** — GET Energy's Intelligent Energy Assistant. I can help you find the right energy solution, request a quotation, register interest in training, get customer support, discuss a project or connect with our team. What can I help you with today?"}
                    </MessageResponse>
                  </MessageContent>
                </Message>
                <div className="flex flex-wrap gap-2">
                  {QUICK.map((q) => (
                    <button key={q} type="button" onClick={() => send(q)} className="min-h-11 rounded-full border border-primary/40 px-3 text-sm text-primary hover:bg-primary hover:text-primary-foreground">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <Message from={m.role} key={m.id}>
                <MessageContent>
                  {m.parts.map((p, i) => {
                    if (p.type === "text")
                      return m.role === "assistant" ? <MessageResponse key={i}>{p.text}</MessageResponse> : <p key={i} className="whitespace-pre-wrap">{p.text}</p>;
                    if (p.type === "tool-submit_enquiry") {
                      const out = p.state === "output-available" ? (p.output as { ok?: boolean; reference?: string }) : undefined;
                      return (
                        <div key={i} className="space-y-2">
                          {out?.ok && out.reference && (
                            <div className="rounded-lg border border-secondary bg-secondary/10 p-3 text-sm text-foreground">
                              Request submitted · Reference <strong>{out.reference}</strong>
                            </div>
                          )}
                          <Tool defaultOpen={false}>
                            <ToolHeader type={p.type} state={p.state} title="Submit enquiry" />
                            <ToolContent>
                              <ToolInput input={p.input} />
                              <ToolOutput output={p.output} errorText={p.errorText} />
                            </ToolContent>
                          </Tool>
                        </div>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))}
            {status === "submitted" && (
              <Message from="assistant"><MessageContent><Shimmer>SOPHIA is thinking…</Shimmer></MessageContent></Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t p-3">
          <PromptInput onSubmit={(msg) => send(msg.text)}>
            <PromptInputTextarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              placeholder="Tell SOPHIA about your energy requirement…"
              autoFocus
            />
            <PromptInputFooter>
              <PromptInputTools>
                <span className="px-2 text-xs text-muted-foreground">SOPHIA is an AI assistant; our team confirms all quotes.</span>
              </PromptInputTools>
              <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !text.trim()} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </section>
    </div>
  );
}
