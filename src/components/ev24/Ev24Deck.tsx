import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type TouchEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink, List, Square, Volume2, X } from "lucide-react";
import hubImage from "@/assets/ev24-hub.webp.asset.json";
import eeaImage from "@/assets/ev24-eea.webp.asset.json";
import bulbWideImage from "@/assets/ev24-bulbwide.webp.asset.json";
import bulbImage from "@/assets/ev24-bulb.webp.asset.json";
import traineeImage from "@/assets/ev24-trainee.webp.asset.json";
import { chapterProgress, clampSlide, EV24_SLIDE_COUNT, slideFromHash } from "./navigation";
import "./ev24.css";

const CHAPTERS = ["Opening", "Why partner", "The joint offer", "Lagos pilot", "Terms & next steps"];
const LOGO = "/images/getenergylogo.svg";

type Slide = { chapter: number; title: string; cover?: boolean; split?: boolean; content: ReactNode };

function Head({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="ev24-head">
      <div className="ev24-eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {lead ? <p className="ev24-lead">{lead}</p> : null}
    </div>
  );
}

function ListItems({ items }: { items: string[] }) {
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function Note({ children, label = "Note" }: { children: ReactNode; label?: string }) {
  return <div className="ev24-note"><b>{label}</b><span>{children}</span></div>;
}

function Card({ title, items, children }: { title?: string; items?: string[]; children?: ReactNode }) {
  return (
    <article className="ev24-card">
      {title ? <h3>{title}</h3> : null}
      {items ? <ListItems items={items} /> : null}
      {children}
    </article>
  );
}

function Figure({ src, alt, caption = "getenergy.ng", className = "" }: { src: string; alt: string; caption?: string; className?: string }) {
  return (
    <figure className={`ev24-figure ${className}`}>
      <img src={src} alt={alt} />
      <figcaption><span>{alt}</span><span>{caption}</span></figcaption>
    </figure>
  );
}

function Tag({ children, tone = "" }: { children: ReactNode; tone?: "g" | "a" | "" }) {
  return <span className={`ev24-tag ${tone}`}>{children}</span>;
}

const OWNERSHIP_ROWS = [
  ["Vehicle sourcing and import", "EV24.africa", "Operating", "g"],
  ["Customs, registration, delivery", "EV24.africa", "Operating", "g"],
  ["Home charger survey and installation", "GET Charge Home", "Pilot", "a"],
  ["Public, destination and fleet charging", "GET Charge network (Vision Lagos 2029)", "Pilot sites in development", "a"],
  ["Backup power: solar, BESS, hybrid", "GET Energy Power as a Service", "Early stage", "a"],
  ["Technician and installer training", "GET Energy Academy", "Dates to be confirmed", "a"],
  ["Discovery, RFQs, suppliers, financing leads", "Independent EEA54.Africa marketplace", "Lagos pilot", "a"],
] as const;

const JOURNEY = [
  [1, "Discover", "EV24 · EEA54", "Buyer finds a model on EV24.africa or through a proposed EEA54.Africa listing."],
  [2, "Quote", "EV24 + GETS", "Quote shows the vehicle plus the optional charge-ready add-on."],
  [3, "Pay and import", "EV24", "Order, shipping by RoRo or container, and tracking."],
  [4, "Survey and install", "GETS", "Home or depot survey and charger installation while the car is at sea."],
  [5, "Clear and register", "EV24", "Customs clearance and local registration."],
  [6, "Deliver", "EV24", "Door-to-door delivery to a charge-ready home or depot."],
  [7, "Charge", "GETS", "At home, and at GET Charge sites as the network opens."],
  [8, "Service and grow", "GETS · EEA54", "Support, trained technicians, add-ons, and the next vehicle or fleet order."],
] as const;

const COMMERCIAL_ROWS = [
  ["Buyers referred to EV24", "Referral fee per completed vehicle sale referred by GET Energy or through EEA54.Africa; rate agreed in the pilot letter"],
  ["Charge-ready add-ons", "Referral fee or margin share to EV24 for each installation sold through EV24.africa"],
  ["EEA54 listings", "Free during the proposed pilot; standard listing or transaction fee afterwards, subject to EEA54's agreement"],
  ["Public charging", "Charging revenue stays with the site operator and host under GET Charge site terms"],
  ["Fleet contracts", "Priced case by case; each party invoices for its own vehicles or services"],
];

const SLIDES: Slide[] = [
  {
    chapter: 0,
    title: "Buy the EV. Charge it in Lagos.",
    cover: true,
    content: (
      <>
        <div className="ev24-cover-text">
          <div className="ev24-brand"><img src={LOGO} alt="GetEnergy.ng" /></div>
          <div className="ev24-eyebrow">Partnership proposal for EV24.africa · For discussion · November 2026</div>
          <h1>Buy the EV. <em>Charge it in Lagos.</em></h1>
          <p className="ev24-tagline">GET Energy × EEA54.Africa × EV24.africa</p>
          <p className="ev24-lead">A proposed non-exclusive pilot that pairs EV24.africa's sourcing, import and delivery with GET Energy's charging, installation and after-sales support in Nigeria, and with participation in the independent EEA54.Africa energy marketplace.</p>
          <p className="ev24-small ev24-muted">Prepared by GET Energy Trading Services Ltd (RC 6929126), a subsidiary of Pancokrato Integrated Services Ltd. Non-binding discussion document. No partnership has been agreed.</p>
        </div>
        <Figure src={hubImage.url} alt="GET Energy EV charging hub, concept visual" />
      </>
    ),
  },
  {
    chapter: 0,
    title: "Each brings a different part of EV ownership",
    content: (
      <>
        <Head eyebrow="Proposed roles" title="Each brings a different part of EV ownership" />
        <div className="ev24-cols ev24-grow" style={{ "--ev24-columns": 3 } as CSSProperties}>
          <Card title="EV24.africa" items={[
            "Online marketplace for electric vehicles for Africa; a product of AUTO24.africa and Africar Group.",
            "Wide brand range, including BYD, Tesla, Leapmotor, XPeng, Geely and Changan, plus commercial vans.",
            "RoRo or container shipping, customs clearance, registration and door-to-door delivery.",
            "Footprint across 54 African markets, as stated by EV24.",
          ]} />
          <Card title="GET Energy" items={[
            "Lagos energy company operating since 2023 in diesel supply and community electricity vending.",
            "Building GET Charge: Vision Lagos 2029 proposes 400 public charging locations.",
            "GET Charge Home wallbox installation, Power as a Service, CNG, and GET Energy Academy training.",
            "A subsidiary of Pancokrato Integrated Services Ltd.",
          ]}>
            <img className="ev24-thumb" src={hubImage.url} alt="GET Energy EV charging hub concept" />
            <Link to="/ev" hash="vehicle-showroom" className="ev24-button secondary">Explore Vehicle Showroom <ArrowRight aria-hidden /></Link>
          </Card>
          <Card title="EEA54.Africa" items={[
            "Energy E-Commerce Africa: an independent marketplace for Africa's energy economy.",
            "Products, suppliers, RFQs, professionals and financing, built for all 54 African countries.",
            "GET Energy participates only as a supplier, partner and solution provider; it does not own or operate EEA54.",
            "Pilot interest is being gathered in Lagos across diesel, solar, metering, EV and CNG.",
          ]}>
            <img className="ev24-thumb" src={eeaImage.url} alt="EEA54 energy marketplace concept" />
          </Card>
        </div>
        <Note label="Source">Facts about EV24.africa come from its public website and the supplied proposal. Please correct anything we have wrong.</Note>
      </>
    ),
  },
  {
    chapter: 1,
    title: "Buying the car is solved. Owning it in Nigeria is not.",
    content: (
      <>
        <Head eyebrow="The gap" title="Buying the car is solved. Owning it in Nigeria is not." lead="A Lagos EV buyer still needs a safe home charger, places to charge away from home, backup power and trained technicians. These are the services GET Energy is building." />
        <div className="ev24-table-wrap ev24-grow">
          <table>
            <thead><tr><th>Ownership step</th><th>Proposed responsibility</th><th>Status</th></tr></thead>
            <tbody>{OWNERSHIP_ROWS.map(([step, who, status, tone]) => <tr key={step}><td>{step}</td><td>{who}</td><td><Tag tone={tone}>{status}</Tag></td></tr>)}</tbody>
          </table>
        </div>
        <Note label="Basis">EV24.africa's public site does not describe charging or after-sales services. Those roles are assumptions for discussion, not claims about EV24. GET Energy statuses are shown as they actually stand.</Note>
      </>
    ),
  },
  {
    chapter: 1,
    title: "Two pan-African platforms, one starting city",
    content: (
      <>
        <Head eyebrow="54 + 54" title="Two pan-African platforms, one starting city" />
        <div className="ev24-cols">
          <div className="ev24-stack">
            <div className="ev24-stats">
              <div className="ev24-stat"><b>54</b><span>African markets in EV24.africa's stated footprint</span></div>
              <div className="ev24-stat"><b>54</b><span>African countries EEA54.Africa is built to serve</span></div>
            </div>
            <p>EV24.africa moves the vehicle across borders. EEA54.Africa independently connects buyers to energy products, suppliers and professionals. GET Energy would prove its part of the model on the ground in Lagos first.</p>
            <ListItems items={[
              "Start in Lagos, where GET Energy operates and its charging pipeline sits.",
              "Prove buyer demand, installation quality and economics in one city.",
              "Replicate in other markets only where EV24 sales and EEA54 suppliers both show demand.",
            ]} />
          </div>
          <Figure src={bulbWideImage.url} alt="Powering a cleaner, stronger Africa" />
        </div>
      </>
    ),
  },
  {
    chapter: 2,
    title: "Four things we would build together",
    content: (
      <>
        <Head eyebrow="The offer" title="Four things we would build together" />
        <div className="ev24-cols ev24-grow">
          <Card title="Charge-ready EV bundle" items={[
            "Optional add-on when a Nigerian buyer orders through EV24.africa.",
            "GET Energy surveys the home or office before the car lands.",
            "Appropriately rated 7 kW single-phase or 11–22 kW three-phase wallbox, installed and tested.",
            "Test record, warranty and a local support line at handover.",
          ]} />
          <Card title="Fleet electrification package" items={[
            "Commercial EVs from EV24.africa, including vans and light trucks.",
            "Depot charging design and a fleet charging contract from GET Energy.",
            "Backup power through Power as a Service where the grid is weak.",
            "Driver and technician training through GET Energy Academy.",
          ]} />
          <Card title="GET Charge network access" items={[
            "EV24 buyers onboarded to GET Charge public and destination sites as each opens.",
            "Priority invitations to pilot sites in Lagos.",
            "One support contact for charging questions.",
          ]} />
          <Card title="Proposed EEA54.Africa listing" items={[
            "Nigerian-deliverable EV24 models listed subject to EEA54's approval, with RFQs routed to EV24.",
            "Chargers, solar and storage from vetted EEA54 suppliers.",
            "Financing and insurance leads, where available.",
          ]} />
        </div>
        <Note>Charger ratings depend on the vehicle and an electrical survey. Installation is quoted per site; public sites open only after commissioning and safety tests.</Note>
      </>
    ),
  },
  {
    chapter: 2,
    title: "From first click to the first full charge",
    content: (
      <>
        <Head eyebrow="Customer journey" title="From first click to the first full charge" lead="Each party would handle its own step. The buyer sees one connected service." />
        <div className="ev24-gates ev24-grow">
          {JOURNEY.map(([number, title, who, description]) => (
            <article className="ev24-gate" key={number}>
              <b>{number}</b><h3>{title}</h3><Tag tone={who.includes("GETS") ? "g" : ""}>{who}</Tag><p>{description}</p>
            </article>
          ))}
        </div>
      </>
    ),
  },
  {
    chapter: 3,
    title: "A 90-day Lagos pilot",
    content: (
      <>
        <Head eyebrow="Pilot design" title="A 90-day Lagos pilot" lead="Small enough to start quickly. Large enough to prove the bundle works." />
        <div className="ev24-cols">
          <div className="ev24-stack"><h3>Proposed scope</h3><ListItems items={[
            "EV24.africa orders delivered to Lagos during the pilot.",
            "Up to 10 charge-ready home or office installations.",
            "Up to 5 GET Charge pilot sites offering access to EV24 buyers as they open.",
            "EV24 models proposed for EEA54.Africa listings, subject to its approval.",
            "Introductions to fleet operators in GET Energy's Lagos pipeline.",
          ]} /></div>
          <div className="ev24-stack"><h3>Proposed timeline</h3><div className="ev24-phase">
            <b>Days 1–15</b><span>Sign a non-binding pilot letter. Agree brand, data and referral rules. Share charging specs for the top models shipped to Nigeria.</span>
            <b>Days 16–45</b><span>Launch the charge-ready add-on or referral form. Seek EEA54 listing approval. Hold the first fleet meetings.</span>
            <b>Days 46–90</b><span>Complete first installs before handover. Onboard buyers to charging. Run the joint review.</span>
          </div></div>
        </div>
        <Note label="Scope">Pilot site counts are upper limits, not commitments. Each site and installation goes through survey, safety and approval checks first.</Note>
      </>
    ),
  },
  {
    chapter: 3,
    title: "What we would measure together",
    content: (
      <>
        <Head eyebrow="Success measures" title="What we would measure together" lead="Targets would be set jointly at kickoff. No performance targets are being published before then." />
        <div className="ev24-cols ev24-grow" style={{ "--ev24-columns": 3 } as CSSProperties}>
          <Card title="Demand" items={["Qualified leads exchanged each way.", "Quotes that include the charge-ready add-on.", "Fleet meetings that become proposals."]} />
          <Card title="Delivery" items={["Vehicles handed over with a charger already installed.", "Days from order to installed charger.", "Installations passing inspection first time."]} />
          <Card title="Experience" items={["Buyer satisfaction at handover and after 30 days.", "Charging sessions by pilot buyers.", "Support requests resolved, and how fast."]} />
        </div>
        <div className="ev24-cols" style={{ "--ev24-columns": 3 } as CSSProperties}>
          <div className="ev24-stack ev24-rule"><Tag tone="g">Scale</Tag><p className="ev24-small">Extend to more Lagos sites, then Abuja and other cities.</p></div>
          <div className="ev24-stack ev24-rule"><Tag tone="a">Adjust</Tag><p className="ev24-small">Change the bundle, pricing or process and run a second phase.</p></div>
          <div className="ev24-stack ev24-rule"><Tag>Stop</Tag><p className="ev24-small">End cleanly, with each party keeping its own customers.</p></div>
        </div>
        <Note label="Review">The day-90 review would decide one of the three paths above, based on the shared measures.</Note>
      </>
    ),
  },
  {
    chapter: 4,
    title: "Simple, two-way and proposed for discussion",
    content: (
      <>
        <Head eyebrow="Commercial model" title="Simple, two-way and proposed for discussion" />
        <div className="ev24-table-wrap">
          <table><thead><tr><th>Flow</th><th>Proposed basis</th></tr></thead><tbody>
            {COMMERCIAL_ROWS.map(([flow, basis]) => <tr key={flow}><td>{flow}</td><td>{basis}</td></tr>)}
          </tbody></table>
        </div>
        <div className="ev24-cols">
          <div className="ev24-stack ev24-rule"><h3>Tracking</h3><p className="ev24-small">Referral links or codes and a shared lead sheet, reconciled monthly.</p></div>
          <div className="ev24-stack ev24-rule"><h3>Money</h3><p className="ev24-small">Each party invoices its own customers. No pooled funds, and no party collects payment for another.</p></div>
        </div>
        <Note label="Status">All rates and fees are to be agreed. Nothing here is an offer capable of acceptance.</Note>
      </>
    ),
  },
  {
    chapter: 4,
    title: "How the partnership protects each party",
    content: (
      <>
        <Head eyebrow="Principles" title="How the proposed partnership would protect each party" />
        <div className="ev24-cols ev24-grow">
          <Card title="Independence" items={["Non-exclusive. Each party remains free to work with others.", "No party signs, quotes or commits on behalf of another.", "Each party keeps its own customers if the pilot ends."]} />
          <Card title="Brand" items={["Each party keeps its own brand and logo.", "Co-branded material only with written approval from every party involved.", "GET Charge remains the consumer name for GET Energy charging."]} />
          <Card title="Customer data" items={["Shared only with the customer's consent.", "Handled in line with the Nigeria Data Protection Act.", "Used only for the pilot purposes agreed in writing."]} />
          <Card title="Responsibility" items={["EV24.africa: vehicle import, customs, registration and delivery.", "GET Energy: electrical surveys, installation standards and charging operations.", "EEA54.Africa remains independent and controls its own marketplace decisions.", "Confidentiality is the only proposed binding term until a full agreement is signed."]} />
        </div>
      </>
    ),
  },
  {
    chapter: 4,
    title: "What we propose next",
    content: (
      <>
        <Head eyebrow="The ask" title="What we propose next" />
        <div className="ev24-cols ev24-grow">
          <div className="ev24-stack"><h3>From EV24.africa</h3><ListItems items={[
            "A 45-minute call or workshop with your Nigeria lead.",
            "Charging specifications (onboard AC rating, connector) for the models you ship most to Nigeria.",
            "A referral link or checkout option for the charge-ready add-on.",
            "Agreement on a short, non-binding pilot letter.",
          ]} /></div>
          <div className="ev24-stack"><h3>From GET Energy and proposed marketplace participation</h3><ListItems items={[
            "Charge-readiness surveys for EV24 buyers in Lagos.",
            "Proposed EEA54.Africa listings for Nigerian-deliverable models, subject to EEA54 approval.",
            "Introductions to fleet operators in our Lagos pipeline.",
            "A GET Energy Academy module for installers and technicians, subject to programme scheduling.",
          ]} /></div>
        </div>
        <img className="ev24-thumb" src={traineeImage.url} alt="GET Energy trainee technician" style={{ aspectRatio: "6 / 1" }} />
      </>
    ),
  },
  {
    chapter: 4,
    title: "Every EV24 car, charge-ready in Lagos.",
    cover: true,
    split: true,
    content: (
      <>
        <div className="ev24-cover-text">
          <div className="ev24-brand"><img src={LOGO} alt="GetEnergy.ng" /></div>
          <div className="ev24-eyebrow">Next step</div>
          <h1>Every EV24 car, <em>charge-ready</em> in Lagos.</h1>
          <ListItems items={["Agree a call date and the people on each side.", "Exchange charging specs and the draft pilot letter.", "Launch the pilot within 15 days of signing."]} />
          <div className="ev24-stack ev24-small"><p><b>Babashola Santos Aderibigbe</b>, Founder, GET Energy Trading Services Ltd</p><p className="ev24-muted">19 Godwin Okigbo Street, Masha Kilo, Surulere, Lagos</p></div>
          <div className="ev24-cover-actions">
            <Link to="/contact" className="ev24-button">Discuss this proposal <ArrowRight aria-hidden /></Link>
            <a href="https://ev24.africa" target="_blank" rel="noopener noreferrer" className="ev24-button secondary">Visit EV24.africa <ExternalLink aria-hidden /></a>
          </div>
          <p className="ev24-small ev24-muted"><b className="ev24-green-text">getenergy.ng</b> · Non-binding discussion document. Images are GET Energy brand and concept visuals. EV24.africa and EEA54.Africa are independent third-party platforms; no partnership or endorsement is implied.</p>
        </div>
        <Figure src={bulbImage.url} alt="Energy for today. A cleaner tomorrow." />
      </>
    ),
  },
];

const CHAPTER_COUNTS = CHAPTERS.map((_, chapter) => SLIDES.filter((slide) => slide.chapter === chapter).length);

export function Ev24Deck() {
  const [index, setIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(true);
  const [rate, setRate] = useState(1);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const slideRef = useRef<HTMLDivElement>(null);
  const chaptersButtonRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slide = SLIDES[index] ?? SLIDES[0]!;

  const go = useCallback((next: number) => {
    const target = clampSlide(next);
    setIndex(target);
    if (window.location.hash !== `#s${target + 1}`) window.history.replaceState(null, "", `#s${target + 1}`);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    window.setTimeout(() => chaptersButtonRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    const restore = () => setIndex(slideFromHash(window.location.hash));
    restore();
    window.addEventListener("hashchange", restore);
    setSpeechAvailable(typeof window.speechSynthesis !== "undefined");
    return () => window.removeEventListener("hashchange", restore);
  }, []);

  useEffect(() => {
    slideRef.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("input,select,textarea,button,a")) return;
      if (drawerOpen) {
        if (event.key === "Escape") closeDrawer();
        return;
      }
      if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(index + 1); }
      else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); go(index - 1); }
      else if (event.key === "Home") go(0);
      else if (event.key === "End") go(EV24_SLIDE_COUNT - 1);
      else if (event.key.toLowerCase() === "c") setDrawerOpen(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer, drawerOpen, go, index]);

  useEffect(() => {
    if (!drawerOpen) return;
    window.setTimeout(() => document.querySelector<HTMLButtonElement>(".ev24-panel-group [aria-current='step']")?.focus(), 0);
  }, [drawerOpen]);

  useEffect(() => {
    if (!listening) return;
    const synth = window.speechSynthesis;
    if (!synth || !slideRef.current) { setListening(false); return; }
    const nodes = slideRef.current.querySelectorAll("h1,h2,h3,p,li,.ev24-stat,tr,figcaption > span:first-child");
    const phrases = Array.from(nodes).map((node) => {
      if (node.closest("li") && node.tagName !== "LI") return "";
      if (node.tagName === "P" && node.closest(".ev24-stat")) return "";
      const text = node.tagName === "TR"
        ? Array.from(node.children).map((child) => child.textContent).join(". ")
        : node.textContent;
      return (text ?? "").replace(/·/g, ",").replace(/\s+/g, " ").trim();
    }).filter(Boolean);
    let cancelled = false;
    let timer = 0;
    let position = 0;
    const voices = synth.getVoices();
    const voice = voices.find((item) => /en-NG/i.test(item.lang)) ?? voices.find((item) => /en-GB/i.test(item.lang)) ?? voices.find((item) => /^en/i.test(item.lang));
    const next = () => {
      if (cancelled) return;
      if (position >= phrases.length) {
        if (autoAdvance && index < EV24_SLIDE_COUNT - 1) timer = window.setTimeout(() => { if (!cancelled) go(index + 1); }, 500);
        else setListening(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(phrases[position++] ?? "");
      utterance.rate = rate;
      if (voice) { utterance.voice = voice; utterance.lang = voice.lang; } else utterance.lang = "en-GB";
      utterance.onend = next;
      utterance.onerror = (event) => { if (!cancelled && event.error !== "interrupted" && event.error !== "canceled") next(); };
      synth.speak(utterance);
    };
    synth.cancel();
    next();
    return () => { cancelled = true; window.clearTimeout(timer); synth.cancel(); };
  }, [autoAdvance, go, index, listening, rate]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && !(event.target as HTMLElement).closest(".ev24-table-wrap")) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="ev24-page">
      <header className="ev24-bar">
        <div className="ev24-brand"><img src={LOGO} alt="GetEnergy.ng" /></div>
        <div className="ev24-chapter-name">{CHAPTERS[slide.chapter]}</div>
        <span className="ev24-count">{index + 1} / {EV24_SLIDE_COUNT}</span>
        <button ref={chaptersButtonRef} type="button" className="ev24-button" aria-haspopup="dialog" aria-label="Open chapters" onClick={() => setDrawerOpen(true)}>
          <List aria-hidden /><span className="ev24-button-label">Chapters</span><span className="ev24-sr-only">Open chapters</span>
        </button>
        <button type="button" className={`ev24-button ${listening ? "is-on" : ""}`} aria-label={listening ? "Stop narration" : "Listen to this slide"} aria-pressed={listening} disabled={!speechAvailable} onClick={() => setListening((value) => !value)}>
          {listening ? <Square aria-hidden /> : <Volume2 aria-hidden />}<span className="ev24-button-label">{speechAvailable ? (listening ? "Stop" : "Listen") : "No voice"}</span>
          <span className="ev24-sr-only">{listening ? "Stop narration" : "Listen to this slide"}</span>
        </button>
      </header>

      <div
        className="ev24-stage"
        aria-live="polite"
        onTouchStart={(event) => { const touch = event.changedTouches[0]; if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY }; }}
        onTouchEnd={onTouchEnd}
      >
        <section className={`ev24-slide ${slide.cover ? "ev24-cover" : ""} ${slide.split ? "ev24-split" : ""}`} aria-label={`Slide ${index + 1} of ${EV24_SLIDE_COUNT}: ${slide.title}`}>
          <div className="ev24-slide-inner" ref={slideRef} key={index}>{slide.content}</div>
          <div className="ev24-slide-foot"><span><img src={LOGO} alt="" />{CHAPTERS[slide.chapter]}</span><span>{String(index + 1).padStart(2, "0")} / {EV24_SLIDE_COUNT}</span></div>
        </section>
      </div>

      <footer className="ev24-controls">
        <button type="button" className="ev24-button" aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)}><ArrowLeft aria-hidden /><span className="ev24-button-label">Back</span><span className="ev24-sr-only">Previous slide</span></button>
        <div className="ev24-progress" aria-label="Presentation chapters">
          {CHAPTERS.map((chapter, chapterIndex) => (
            <button
              type="button"
              key={chapter}
              title={chapter}
              aria-label={`Go to ${chapter}`}
              style={{ "--ev24-weight": CHAPTER_COUNTS[chapterIndex], "--ev24-progress": `${chapterProgress(index, chapterIndex, SLIDES.map((item) => item.chapter)) * 100}%` } as CSSProperties}
              onClick={() => go(SLIDES.findIndex((item) => item.chapter === chapterIndex))}
            />
          ))}
        </div>
        <button type="button" className="ev24-button" aria-label="Next slide" disabled={index === EV24_SLIDE_COUNT - 1} onClick={() => go(index + 1)}><span className="ev24-button-label">Next</span><ArrowRight aria-hidden /><span className="ev24-sr-only">Next slide</span></button>
      </footer>

      {drawerOpen ? (
        <div className="ev24-drawer" role="dialog" aria-modal="true" aria-label="Presentation chapters" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDrawer(); }}>
          <nav className="ev24-panel">
            <div className="ev24-panel-head"><h2>Chapters</h2><button type="button" className="ev24-button" aria-label="Close chapters" onClick={closeDrawer}><X aria-hidden /></button></div>
            <div className="ev24-voice-options">
              <label>Voice speed <select value={rate} onChange={(event) => setRate(Number(event.target.value))}><option value={0.85}>0.85×</option><option value={1}>1×</option><option value={1.15}>1.15×</option><option value={1.3}>1.3×</option></select></label>
              <label><input type="checkbox" checked={autoAdvance} onChange={(event) => setAutoAdvance(event.target.checked)} /> Auto-advance while listening</label>
            </div>
            {CHAPTERS.map((chapter, chapterIndex) => (
              <div className="ev24-panel-group" key={chapter}>
                <h3>{chapter}</h3>
                {SLIDES.map((item, slideIndex) => item.chapter === chapterIndex ? (
                  <button type="button" key={item.title} aria-current={slideIndex === index ? "step" : undefined} onClick={() => { go(slideIndex); closeDrawer(); }}>
                    <span>{String(slideIndex + 1).padStart(2, "0")}</span>{item.title}
                  </button>
                ) : null)}
              </div>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
