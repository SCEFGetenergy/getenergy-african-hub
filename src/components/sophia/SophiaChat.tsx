import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import { BatteryCharging, Bolt, ChevronRight, Flame, Fuel, GraduationCap, Headset, Lightbulb, MessageCircle, Phone, Plus, ReceiptText, SolarPanel, Trash2, TruckElectric, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const SERVICE_ACTIONS = [
  { label: "Diesel / AGO Supply", prompt: "I need Diesel / AGO Supply", icon: Fuel },
  { label: "CNG Solutions", prompt: "I am interested in CNG Solutions", icon: Flame },
  { label: "EV & Mobility", prompt: "I am interested in EV & Hybrid Mobility", icon: TruckElectric },
  { label: "Solar & Renewables", prompt: "I need Solar & Renewables", icon: SolarPanel },
  { label: "Battery Storage (BESS)", prompt: "I need Battery Storage / BESS", icon: BatteryCharging },
  { label: "Generators & Distributed Power", prompt: "I need Generators & Distributed Power", icon: Bolt },
  { label: "Mini-Grid", prompt: "I am interested in Mini-Grid Solutions", icon: Zap },
  { label: "Power-as-a-Service", prompt: "I am interested in Power-as-a-Service", icon: Lightbulb },
  { label: "Smart Metering & Electricity", prompt: "I need Smart Metering or Electricity Services", icon: ReceiptText },
  { label: "Energy Advisory", prompt: "I need Energy Advisory", icon: Lightbulb },
  { label: "Training & Capacity Development", prompt: "I am interested in Training & Capacity Development", icon: GraduationCap },
  { label: "Partnership / OEM", prompt: "I want to discuss a Partnership / OEM opportunity", icon: Users },
];
const SUPPORT_ACTIONS = [
  { label: "Customer Support", prompt: "I need Customer Service & Support", icon: Headset },
  { label: "Request a Quote", prompt: "I would like to request a quotation", icon: ReceiptText },
  { label: "Request a Callback", prompt: "Please arrange a callback", icon: Phone },
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

  const send = (t: string) => {
    const v = t.trim();
    if (!v || busy) return;
    sendMessage({ text: v });
    setText("");
    inputRef.current?.focus({ preventScroll: true });
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
    <div className="sophia-shell mx-auto grid max-w-6xl gap-4 px-3 py-4 md:grid-cols-[210px_minmax(0,1fr)] md:py-8">
      <aside className="hidden flex-col gap-2 md:flex">
        <Button type="button" onClick={newThread} className="min-h-11 w-full">
          <Plus className="size-4" /> New conversation
        </Button>
        <nav aria-label="Your conversations" className="flex flex-col gap-1 overflow-y-auto">
          {threads.map((t) => (
            <div key={t.id} className={`group flex items-center rounded-md ${t.id === threadId ? "bg-secondary" : "hover:bg-secondary/60"}`}>
              <Link to="/sophia/$threadId" params={{ threadId: t.id }} className="flex min-h-11 flex-1 items-center gap-2 truncate px-2 text-sm text-foreground">
                <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{t.title}</span>
              </Link>
              <Button type="button" variant="ghost" size="icon" aria-label="Delete conversation" onClick={() => del(t.id)} className="size-11 text-muted-foreground hover:text-destructive">
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </nav>
      </aside>

      <section className="flex h-[calc(100dvh-125px)] min-h-[520px] flex-col overflow-hidden rounded-lg border bg-background shadow-sm md:h-[min(850px,calc(100dvh-135px))]">
        <header className="flex items-center gap-3 border-b bg-background px-4 py-3">
          <SophiaAvatar className="size-10" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-tight text-foreground">SOPHIA</p>
            <p className="text-xs text-muted-foreground">GET Energy's Intelligent Energy Assistant</p>
          </div>
          <Button type="button" variant="ghost" onClick={newThread} className="min-h-11 px-2 text-primary md:hidden">
            <Plus className="size-4" /> New
          </Button>
          <a href="https://wa.me/2348180742835" target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center rounded-md px-2 text-sm text-primary sm:flex">Talk to a person</a>
        </header>

        <div className="flex-1 overflow-y-auto" role="log">
          <div className="flex flex-col gap-8 p-4">
            {messages.length === 0 && (
              <div className="space-y-7 pb-5">
                <div className="sophia-welcome relative overflow-hidden rounded-md px-4 py-6 sm:px-8">
                  <div className="relative z-10">
                    <p className="text-sm font-semibold uppercase text-primary">GET ENERGY</p>
                    <h1 className="mt-4 text-4xl font-bold text-primary sm:text-5xl">SOPHIA</h1>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground sm:text-base">Your GET Energy Intelligent Energy Assistant</p>
                    <div className="mt-6 flex items-start gap-3 sm:gap-4">
                      <SophiaAvatar className="size-10 shrink-0 sm:size-16" />
                      <div className="max-w-lg rounded-md border bg-background p-4 shadow-sm">
                        <p className="text-sm leading-relaxed text-foreground sm:text-base">Hello, I’m SOPHIA — GET Energy’s Intelligent Energy Assistant. I can help you find the right energy solution, request a quotation, get customer support, explore training programmes or connect you with our team.</p>
                        <p className="mt-3 font-semibold text-primary">What can I help you with today?</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="min-w-0 text-xl font-semibold text-foreground">Explore GET Energy Services</h2><Link to="/our-services" className="text-sm font-semibold text-primary">View all →</Link></div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICE_ACTIONS.map(({ label, prompt, icon: Icon }) => <Button key={label} type="button" variant="outline" onClick={() => send(prompt)} className="h-auto min-h-16 justify-start whitespace-normal px-3 py-3 text-left text-foreground"><Icon className="size-6 shrink-0 text-primary" /><span className="flex-1 text-sm">{label}</span><ChevronRight className="size-4 shrink-0 text-primary" /></Button>)}
                  </div>
                </div>
                <div>
                  <h2 className="mb-3 text-xl font-semibold text-foreground">Customer Support</h2>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {SUPPORT_ACTIONS.map(({ label, prompt, icon: Icon }) => <Button key={label} type="button" variant="outline" onClick={() => send(prompt)} className="h-auto min-h-16 justify-start whitespace-normal px-3 py-3 text-left text-foreground"><Icon className="size-6 shrink-0 text-primary" /><span className="flex-1 text-sm">{label}</span><ChevronRight className="size-4 shrink-0 text-primary" /></Button>)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 border-t pt-4">
                  {QUICK.slice(0, 3).map((q) => <Button key={q} type="button" variant="secondary" onClick={() => send(q)} className="h-auto min-h-11 whitespace-normal text-left text-xs">{q}</Button>)}
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
          </div>
        </div>

        <div className="border-t bg-background p-3">
          <PromptInput onSubmit={(msg) => send(msg.text)}>
            <PromptInputTextarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              placeholder="Type your message…"
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
