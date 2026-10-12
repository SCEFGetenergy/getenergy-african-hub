import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useServerFn } from "@tanstack/react-start";
import { createOrder, getElectricityLiveConfig, getOrderStatus, mockCheckout, verifyMeter } from "@/lib/electricity.functions";
import { groupToken } from "@/lib/electricity/rules";

type Config = Awaited<ReturnType<typeof getElectricityLiveConfig>>;
type Status = Extract<Awaited<ReturnType<typeof getOrderStatus>>, { found: true }>;

// Live wording swaps, applied only when ELECTRICITY_LIVE is on.
const SWAPS: [string, string][] = [
  ["Electricity Tokens & Utility Payments — Launching Soon", "Electricity Tokens & Utility Payments — Buy Online"],
  ["— online payment launching soon.", "— buy online in minutes."],
  ["Tell us your DISCO, meter number and requested amount. We’ll record your enquiry and contact you about the next step; no payment is taken on this page.", "Choose your DISCO, verify your meter and pay securely. Your token appears on screen and is sent by email and SMS."],
  ["Electricity tokens · online payment launching soon", "Electricity tokens · buy online now"],
  ["Online token payment: launching soon", "Request a token (for DISCOs not yet available online)"],
  ["Online token payment is launching soon. Submit a request and our team will follow up.", "Buy prepaid tokens online, or send a request for DISCOs not yet available online."],
  ["Online payment launching soon", "Buy tokens online"],
  ["Online payment is launching soon; until then, send your request and our team will contact you to complete it.", "If your DISCO isn't available online yet, send a token request and our team will contact you."],
];
const PAGES_WITH_COPY = new Set(["/", "/get-electricity", "/faq"]);

function applySwaps() {
  const root = document.getElementById("main");
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    let t = n.nodeValue ?? "";
    for (const [a, b] of SWAPS) if (t.includes(a)) t = t.split(a).join(b);
    if (t !== n.nodeValue) n.nodeValue = t;
  }
  // The preparing-platform disclaimer no longer applies once live.
  root.querySelectorAll<HTMLElement>("[data-page='get-electricity'] p.status").forEach((p) => {
    if (p.textContent?.includes("is preparing its online electricity token vending")) p.textContent = "GetEnergy sells electricity tokens through its licensed vending partner. GetEnergy is not an electricity distribution company (DISCO).";
  });
}

export function ElectricityLive({ pathname }: { pathname: string }) {
  const [cfg, setCfg] = useState<Config | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const fetchCfg = useServerFn(getElectricityLiveConfig);

  useEffect(() => {
    if (!PAGES_WITH_COPY.has(pathname)) return;
    let on = true;
    fetchCfg().then((c) => on && setCfg(c)).catch(() => {});
    return () => { on = false; };
  }, [pathname, fetchCfg]);

  // Runs after every commit: legacy markup can be re-applied, so re-check copy and mount point.
  useEffect(() => {
    if (!cfg?.live || !PAGES_WITH_COPY.has(pathname)) return;
    applySwaps();
    if (pathname !== "/get-electricity") return;
    // Hero: show live state; if no DISCO is confirmed yet, its button still routes to the request form.
    const off = document.querySelector<HTMLElement>("[data-ehero='off']");
    const on = document.querySelector<HTMLElement>("[data-ehero='on']");
    if (off && on) {
      off.hidden = true;
      on.hidden = false;
      const buy = on.querySelector<HTMLAnchorElement>("[data-ehero-buy]");
      if (buy && !cfg.discos.some((d) => d.confirmed)) { buy.textContent = "Request a token"; buy.href = "#elecform"; }
    }
    const form = document.getElementById("elecform");
    const grid = form?.parentElement;
    if (!grid) return;
    let el = document.getElementById("elec-live-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "elec-live-root";
      el.className = "wrap";
      el.style.paddingTop = "32px";
      grid.parentElement?.insertBefore(el, grid);
    }
    if (el !== host) setHost(el);
  });

  if (!cfg?.live || pathname !== "/get-electricity" || !host) return null;
  return createPortal(<BuyFlow cfg={cfg} />, host);
}

const inp = "w-full min-h-12 rounded-lg border border-input bg-background px-3 text-base";
const btn = "btn primary";

function BuyFlow({ cfg }: { cfg: Config }) {
  const verify = useServerFn(verifyMeter);
  const create = useServerFn(createOrder);
  const status = useServerFn(getOrderStatus);
  const mock = useServerFn(mockCheckout);
  const confirmed = cfg.discos.filter((d) => d.confirmed);

  const [serviceId, setServiceId] = useState(confirmed[0]?.serviceId ?? "");
  const [meterType, setMeterType] = useState<"prepaid" | "postpaid">("prepaid");
  const [meter, setMeter] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accept, setAccept] = useState(false);
  const [stage, setStage] = useState<"form" | "verifying" | "confirm" | "creating" | "pay" | "result">("form");
  const [msg, setMsg] = useState("");
  const [customer, setCustomer] = useState<{ customerName: string; address: string; minAmount: number } | null>(null);
  const [orderRef, setOrderRef] = useState("");
  const [result, setResult] = useState<Status | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  // Return from a gateway (or the mock checkout) with ?order=
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const ref = q.get("order");
    const saved = sessionStorage.getItem("getelec-contact") ?? "";
    if (ref) { setOrderRef(ref); setStage(q.get("mockpay") ? "pay" : "result"); if (saved) void poll(ref, saved); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function poll(ref: string, contact: string) {
    for (let i = 0; i < 40; i++) {
      const r = await status({ data: { orderReference: ref, contact } }).catch(() => null);
      if (r?.found) {
        setResult(r);
        if (!["awaiting_payment", "paid", "vending"].includes(r.status) || (r.status === "awaiting_payment" && r.gatewayReference)) return r;
      } else if (r && !r.found) { setMsg("We couldn't find that order. Check the reference and the email or phone you used."); return null; }
      await new Promise((res) => setTimeout(res, 3000));
    }
    return null;
  }

  const digits = (s: string) => s.replace(/\D/g, "");

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!serviceId || digits(meter).length < 6) return setMsg("Choose your DISCO and enter your meter number.");
    setStage("verifying");
    const r = await verify({ data: { serviceId, meterType, meterNumber: digits(meter) } }).catch(() => ({ ok: false as const, message: "Please check your connection and try again." }));
    if (!r.ok) { setMsg(r.message); setStage("form"); return; }
    setCustomer(r);
    setStage("confirm");
  }

  async function onBuy(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) return;
    const amt = Math.round(Number(amount));
    if (!(amt >= customer.minAmount)) return setMsg(`The minimum for this meter is ₦${customer.minAmount.toLocaleString("en-NG")}.`);
    if (digits(phone).length < 10) return setMsg("Enter a phone number with at least 10 digits.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return setMsg("Enter a valid email address.");
    if (!accept) return setMsg("Please accept the terms and refund policy to continue.");
    setMsg("");
    setStage("creating");
    const r = await create({ data: { serviceId, meterType, meterNumber: digits(meter), amount: amt, phone: digits(phone), email: email.trim(), accept: true } }).catch(() => ({ ok: false as const, message: "Please try again in a moment." }));
    if (!r.ok) { setMsg(r.message); setStage("confirm"); return; }
    sessionStorage.setItem("getelec-contact", email.trim().toLowerCase());
    setOrderRef(r.orderReference);
    if (r.checkoutUrl.startsWith("/")) { setStage("pay"); window.history.replaceState(null, "", r.checkoutUrl); }
    else window.location.href = r.checkoutUrl;
  }

  async function onMock(outcome: "pay" | "fail" | "wrong_amount") {
    setStage("result");
    setResult(null);
    await mock({ data: { orderReference: orderRef, outcome } }).catch(() => null);
    window.history.replaceState(null, "", `/get-electricity?order=${orderRef}`);
    await poll(orderRef, sessionStorage.getItem("getelec-contact") ?? email.trim().toLowerCase());
  }

  const disco = cfg.discos.find((d) => d.serviceId === serviceId);

  return (
    <section aria-labelledby="buy-h" className="gf" style={{ maxWidth: 640, margin: "0 auto" }}>
      <p className="live">Buy a token online</p>
      <h3 id="buy-h">Buy electricity</h3>
      <p role="status" aria-live="polite" className="mt-2 text-sm" style={{ color: msg ? "var(--destructive, #b42318)" : undefined }}>{msg}</p>

      {(stage === "form" || stage === "verifying") && (
        <form onSubmit={onVerify} noValidate className="mt-3 grid gap-4">
          {confirmed.length === 0 ? (
            <p>Online purchase will open for each DISCO once testing is complete. Please send a token request below.</p>
          ) : (
            <>
              <label className="grid gap-1 font-semibold">Electricity company (DISCO)
                <select className={inp} value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                  {confirmed.map((d) => <option key={d.serviceId} value={d.serviceId}>{d.label}</option>)}
                </select>
              </label>
              <p className="text-sm">Not listed? {cfg.discos.filter((d) => !d.confirmed).map((d) => d.label.replace(/ \(.*\)/, "")).join(", ") || "—"}: <a href="#elecform">Request a token</a>.</p>
              <fieldset className="grid gap-1"><legend className="font-semibold">Meter type</legend>
                <div className="seg">
                  {(["prepaid", "postpaid"] as const).map((t) => (
                    <label key={t}><input type="radio" name="live-mt" checked={meterType === t} onChange={() => setMeterType(t)} />{t === "prepaid" ? "Prepaid" : "Postpaid"}</label>
                  ))}
                </div>
              </fieldset>
              <label className="grid gap-1 font-semibold">Meter number
                <input className={inp} inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={meter} onChange={(e) => setMeter(digits(e.target.value).slice(0, 15))} />
              </label>
              <button className={btn} type="submit" disabled={stage === "verifying"}>{stage === "verifying" ? "Verifying meter…" : "Verify meter →"}</button>
            </>
          )}
        </form>
      )}

      {(stage === "confirm" || stage === "creating") && customer && (
        <form onSubmit={onBuy} noValidate className="mt-3 grid gap-4">
          <div className="rounded-lg border border-border p-3">
            <p className="text-sm text-muted-foreground">{disco?.label} · {meterType} · meter {meter}</p>
            <p className="mt-1 text-lg font-bold">{customer.customerName}</p>
            {customer.address ? <p className="text-sm">{customer.address}</p> : null}
            <p className="mt-2 text-sm">Minimum purchase for this meter: <b>₦{customer.minAmount.toLocaleString("en-NG")}</b></p>
            <button type="button" className="mt-2 min-h-11 text-sm underline" onClick={() => { setCustomer(null); setStage("form"); }}>Not you? Change meter</button>
          </div>
          <label className="grid gap-1 font-semibold">Amount (₦)
            <input className={inp} inputMode="numeric" pattern="[0-9]*" value={amount} onChange={(e) => setAmount(digits(e.target.value).slice(0, 7))} placeholder={String(customer.minAmount)} />
          </label>
          <label className="grid gap-1 font-semibold">Phone number
            <input className={inp} type="tel" inputMode="numeric" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value.slice(0, 16))} />
          </label>
          <label className="grid gap-1 font-semibold">Email for your receipt
            <input className={inp} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value.slice(0, 255))} />
          </label>
          <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} style={{ width: 22, height: 22, flex: "none" }} />
            <span>I agree to the <a href="/policies/terms" target="_blank" rel="noopener">Terms</a> and <a href="/policies/refunds" target="_blank" rel="noopener">Refund policy</a>, and I have read the <a href="/policies/privacy" target="_blank" rel="noopener">Privacy notice</a>.</span>
          </label>
          <button className={btn} type="submit" disabled={stage === "creating"}>{stage === "creating" ? "Preparing payment…" : `Pay ₦${Number(amount || 0).toLocaleString("en-NG")} →`}</button>
        </form>
      )}

      {stage === "pay" && (
        <div className="mt-3 grid gap-3">
          <p><b>Awaiting payment</b> · Order {orderRef}</p>
          <p className="text-sm">Test checkout — no real money moves. Choose an outcome:</p>
          <button className={btn} onClick={() => onMock("pay")}>Simulate successful payment</button>
          <button className="btn ghost" onClick={() => onMock("fail")}>Simulate failed payment</button>
          <button className="btn ghost" onClick={() => onMock("wrong_amount")}>Simulate wrong amount paid</button>
        </div>
      )}

      {stage === "result" && <Result orderRef={orderRef} r={result} />}

      <div className="mt-6 border-t border-border pt-4">
        <button type="button" className="min-h-11 text-sm font-semibold underline" aria-expanded={lookupOpen} onClick={() => setLookupOpen(!lookupOpen)}>Token not received?</button>
        {lookupOpen && <Lookup onFound={(r) => { setOrderRef(r.orderReference); setResult(r); setStage("result"); }} />}
      </div>
    </section>
  );
}

function Result({ orderRef, r }: { orderRef: string; r: Status | null }) {
  const [copied, setCopied] = useState(false);
  if (!r) return <p className="mt-3" role="status"><b>Processing</b> · Order {orderRef}</p>;
  return (
    <div className="mt-3 grid gap-3" role="status" aria-live="polite">
      <p className="text-lg font-bold">{r.label}</p>
      {r.status === "delivered" && r.meterType === "prepaid" && r.token ? (
        <div className="rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">Your token</p>
          <p className="my-2 font-mono text-3xl font-bold tracking-wider" style={{ wordBreak: "break-word" }}>{groupToken(r.token)}</p>
          {r.units ? <p className="text-sm">{r.units} units</p> : null}
          <button className="btn primary mt-2" onClick={() => { void navigator.clipboard.writeText(r.token ?? ""); setCopied(true); }}>{copied ? "Copied" : "Copy token"}</button>
        </div>
      ) : null}
      {r.status === "delivered" && r.meterType === "postpaid" ? <p>Payment confirmed for {r.customerName}. VTpass reference: <b>{r.vtpassReference}</b></p> : null}
      <p className="text-sm">Order reference: <b>{r.orderReference}</b> · {r.disco} · meter {r.meter} · ₦{r.amount.toLocaleString("en-NG")}</p>
      {r.status === "delivered" ? <p className="text-sm">A receipt is being sent to your email and phone.</p> : null}
    </div>
  );
}

function Lookup({ onFound }: { onFound: (r: Status) => void }) {
  const status = useServerFn(getOrderStatus);
  const [ref, setRef] = useState("");
  const [contact, setContact] = useState("");
  const [err, setErr] = useState("");
  return (
    <form className="mt-3 grid gap-3" onSubmit={async (e) => {
      e.preventDefault();
      setErr("");
      const r = await status({ data: { orderReference: ref.trim().toUpperCase(), contact: contact.trim().toLowerCase() } }).catch(() => null);
      if (r?.found) onFound(r); else setErr("We couldn't find that order. Check the reference and the email or phone you used.");
    }}>
      <label className="grid gap-1 text-sm font-semibold">Order reference<input className={inp} value={ref} onChange={(e) => setRef(e.target.value)} placeholder="GETELEC-20261012-ABC123" /></label>
      <label className="grid gap-1 text-sm font-semibold">Email or phone used<input className={inp} value={contact} onChange={(e) => setContact(e.target.value)} /></label>
      {err ? <p className="text-sm" role="alert">{err}</p> : null}
      <button className="btn ghost" type="submit">Find my order</button>
    </form>
  );
}
