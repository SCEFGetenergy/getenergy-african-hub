import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getElectricityLiveConfig } from "@/lib/electricity.functions";
import { DISCOS } from "@/lib/electricity/rules";
import { canPurchase, electricityDestination, HOME_ELECTRICITY_COPY, QUICK_AMOUNTS, START_KEY, stickyVisible, validateQuickStart, type ElectricityConfig, type QuickStart } from "@/lib/home-electricity";

function track(event: string, live: boolean) {
  window.__lovableEvents?.track?.(event, { electricity_live: live, device_type: window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop" });
}

export function HomeElectricity({ pathname }: { pathname: string }) {
  const fetchConfig = useServerFn(getElectricityLiveConfig);
  const [cfg, setCfg] = useState<ElectricityConfig>({ live: false, discos: [] });
  const [hosts, setHosts] = useState<Partial<Record<"header" | "hero" | "banner" | "final", HTMLElement>>>({});
  const [sticky, setSticky] = useState(false);
  const home = pathname === "/";

  useEffect(() => { let active = true; fetchConfig().then((c) => { if (active) setCfg(c); }).catch(() => {}); return () => { active = false; }; }, [fetchConfig]);
  useEffect(() => {
    const next: Partial<Record<"header" | "hero" | "banner" | "final", HTMLElement>> = {};
    for (const slot of ["header", "hero", "banner", "final"] as const) {
      const el = document.getElementById(`home-electricity-${slot}`);
      if (el) { if (slot === "header") el.querySelector("a")?.remove(); next[slot] = el; }
    }
    setHosts(next);
  }, [pathname]);

  useEffect(() => {
    if (!home) return;
    document.body.classList.add("electricity-home");
    let panelVisible = true;
    const update = () => setSticky(stickyVisible(panelVisible, !!document.activeElement?.matches("input,select,textarea,[contenteditable=true]"), document.body.classList.contains("nav-open")));
    const observer = new IntersectionObserver(([entry]) => { panelVisible = entry?.isIntersecting ?? true; update(); }, { rootMargin: "-80px 0px 0px 0px" });
    const panel = document.getElementById("home-quick-start");
    if (panel) observer.observe(panel);
    const mutation = new MutationObserver(update);
    mutation.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => { document.body.classList.remove("electricity-home"); observer.disconnect(); mutation.disconnect(); document.removeEventListener("focusin", update); document.removeEventListener("focusout", update); };
  }, [home, hosts]);

  // Only read the homepage handoff on its destination. The existing request fields
  // and submit handler remain untouched, and meter details never enter a URL.
  useEffect(() => {
    if (pathname !== "/get-electricity") return;
    let value: QuickStart;
    try { const raw = sessionStorage.getItem(START_KEY); if (!raw) return; value = JSON.parse(raw); } catch { return; }
    if (validateQuickStart(value)) return;
    const disco = DISCOS.find((d) => d.serviceId === value.serviceId);
    const fill = () => {
      const select = document.querySelector<HTMLSelectElement>("#el-disco");
      const meter = document.querySelector<HTMLInputElement>("#el-meter");
      const amount = document.querySelector<HTMLInputElement>("#el-amt");
      if (!select || !meter || !amount || !disco || select.options.length < 2) return;
      select.value = disco.label; meter.value = value.meter; amount.value = value.amount;
    };
    fill();
    const observer = new MutationObserver(fill);
    const form = document.getElementById("elecform");
    if (form) observer.observe(form, { childList: true, subtree: true });
    const retry = window.setTimeout(fill, 500);
    const settle = window.setTimeout(() => { fill(); observer.disconnect(); }, 1000);
    const filled = new WeakSet<Element>();
    const fillLive = () => {
      if (!canPurchase(cfg, value.serviceId)) return;
      const root = document.getElementById("elec-live-root");
      if (!root) return;
      for (const [label, data] of [["Electricity company (DISCO)", value.serviceId], ["Meter number", value.meter], ["Amount (₦)", value.amount]] as const) {
        const field = Array.from(root.querySelectorAll("label")).find((el) => el.textContent?.trim().startsWith(label))?.querySelector("input,select");
        if (!field || filled.has(field)) continue;
        const proto = field instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(field, data);
        field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
        filled.add(field);
      }
    };
    fillLive();
    const liveObserver = new MutationObserver(fillLive);
    const main = document.getElementById("main");
    if (main) liveObserver.observe(main, { childList: true, subtree: true });
    return () => { window.clearTimeout(retry); window.clearTimeout(settle); observer.disconnect(); liveObserver.disconnect(); };
  }, [pathname, cfg]);

  const copy = cfg.live ? HOME_ELECTRICITY_COPY.live : HOME_ELECTRICITY_COPY.off;
  const action = (placement: string, large = false) => <Button asChild className={`electricity-action${large ? " electricity-action-large" : ""}`}><a href={electricityDestination(cfg)} onClick={() => track(placement, cfg.live)}>{copy.label}<ArrowRight aria-hidden="true" /></a></Button>;
  return <>
    {hosts.header && createPortal(<Button asChild className="electricity-action"><a href={electricityDestination(cfg)} onClick={() => track("electricity_header_click", cfg.live)}><span className="electricity-desktop-label">{copy.label}</span><span className="electricity-mobile-label">{cfg.live ? "Buy electricity" : "Get token"}</span><ArrowRight aria-hidden="true" /></a></Button>, hosts.header)}
    {home && hosts.hero && createPortal(<Hero cfg={cfg} />, hosts.hero)}
    {home && hosts.banner && createPortal(<section className="electricity-repeat"><div className="electricity-wrap"><p>{copy.banner}</p>{action("electricity_banner_click")}</div></section>, hosts.banner)}
    {home && hosts.final && createPortal(<section className="electricity-final"><div className="electricity-wrap"><p className="electricity-eyebrow">GETENERGY · ELECTRICITY SERVICES</p><h2>Your next token starts here.</h2><p>{cfg.live ? "Choose your electricity company and start with your meter details." : "Send your meter details. Our team will contact you to complete your request."}</p>{action("electricity_bottom_click", true)}<a className="electricity-diesel" href="/get-fuel#fuel-form">Need diesel for a business? Request a diesel quote <ArrowRight aria-hidden="true" /></a></div></section>, hosts.final)}
    {home && <div className={`electricity-sticky${sticky ? " is-visible" : ""}`} aria-hidden={!sticky} inert={!sticky}>{action("electricity_mobile_bar_click")}</div>}
  </>;
}

function Hero({ cfg }: { cfg: ElectricityConfig }) {
  const [value, setValue] = useState<QuickStart>({ serviceId: "", meter: "", amount: "1000" });
  const [error, setError] = useState("");
  const started = useRef(false);
  const copy = cfg.live ? HOME_ELECTRICITY_COPY.live : HOME_ELECTRICITY_COPY.off;
  const change = (key: keyof QuickStart, next: string) => {
    if (!started.current) { started.current = true; track("electricity_hero_started", cfg.live); }
    setValue((v) => ({ ...v, [key]: next })); setError("");
  };
  const unconfirmed = cfg.live && value.serviceId && !canPurchase(cfg, value.serviceId);
  return <section className="electricity-hero"><div className="electricity-wrap electricity-hero-grid">
    <div className="electricity-hero-copy"><p className="electricity-eyebrow"><Zap size={16} aria-hidden="true" /> GETENERGY · ELECTRICITY FOR EVERY DAY</p><h1>{copy.headline}</h1><p className="electricity-support">{copy.support}</p><p className="electricity-availability"><span aria-hidden="true" />{cfg.live ? "Online purchase for confirmed electricity companies" : "Online payment launching soon · No payment taken"}</p></div>
    <div className="electricity-start-area">
      <div className="electricity-ticket" aria-hidden="true"><Zap /><span>GETENERGY</span><span>PREPAID ELECTRICITY</span><div className="electricity-ticket-perforation" /><div className="electricity-ticket-bars" /></div>
      <form id="home-quick-start" className="electricity-panel" noValidate onSubmit={(e) => {
        e.preventDefault(); const message = validateQuickStart(value); setError(message);
        if (message) return;
        sessionStorage.setItem(START_KEY, JSON.stringify(value));
        track("electricity_hero_submitted", cfg.live);
        window.location.assign(electricityDestination(cfg, value.serviceId));
      }}>
        <div className="electricity-panel-heading"><span className="electricity-panel-icon"><Zap aria-hidden="true" /></span><div><h2>Start with your meter</h2><p>{cfg.live ? "Prepaid electricity, made simple." : "Your details. One simple request."}</p></div></div>
        <label htmlFor="home-disco">Electricity company</label><select id="home-disco" value={value.serviceId} onChange={(e) => change("serviceId", e.target.value)} required aria-describedby={error ? "home-start-error" : undefined}><option value="">Select your electricity company</option>{DISCOS.map((d) => <option key={d.serviceId} value={d.serviceId}>{d.label}{cfg.live && !canPurchase(cfg, d.serviceId) ? " — Request a token" : ""}</option>)}</select>
        <label htmlFor="home-meter">Meter number</label><input id="home-meter" inputMode="numeric" pattern="[0-9]*" autoComplete="off" placeholder="Enter your meter number" maxLength={13} value={value.meter} onChange={(e) => change("meter", e.target.value.replace(/\D/g, ""))} required aria-describedby={error ? "home-start-error" : undefined} />
        <label htmlFor="home-amount">Amount (₦)</label><input id="home-amount" inputMode="numeric" pattern="[0-9]*" value={value.amount} onChange={(e) => change("amount", e.target.value.replace(/\D/g, ""))} required aria-describedby={error ? "home-start-error" : undefined} />
        <div className="electricity-amounts" role="group" aria-label="Quick amount"><>{QUICK_AMOUNTS.map((amount) => <Button variant="outline" type="button" key={amount} aria-pressed={value.amount === String(amount)} onClick={() => change("amount", String(amount))}>₦{amount.toLocaleString("en-NG")}</Button>)}</></div>
        {error && <p id="home-start-error" className="electricity-error" role="alert">{error}</p>}
        {unconfirmed && <p className="electricity-request-note" role="status">Request a token — online purchase is not yet available for this company.</p>}
        <Button className="electricity-action electricity-submit" type="submit">{unconfirmed ? HOME_ELECTRICITY_COPY.off.label : copy.label}<ArrowRight aria-hidden="true" /></Button>
        <p className="electricity-panel-note"><Check size={14} aria-hidden="true" />{cfg.live ? "Your meter details continue on the next page." : "No payment taken. Our team will follow up."}</p>
      </form>
    </div>
    <div className="electricity-hero-under"><p><b>From ₦1,000</b><span> · 12 electricity companies</span></p><ul className="electricity-companies" aria-label="Supported electricity companies">{DISCOS.map((d) => <li key={d.serviceId}>{d.short === "IE" ? "Ikeja Electric" : d.short === "Aba" ? "Aba Power" : d.short}</li>)}</ul><a className="electricity-diesel" href="/get-fuel#fuel-form">Need diesel for a business? Request a diesel quote <ArrowRight aria-hidden="true" /></a></div>
  </div></section>;
}