import { useEffect, useRef, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import bodyHtml from "./body.html?raw";
import { initLegacy } from "./legacy";
import { supabase } from "@/integrations/supabase/client";
import evChargingVideo from "@/assets/ev-charging.mp4?url";
import evInteriorVideo from "@/assets/ev-interior.mp4?url";

const bodyWithLocalVideos = bodyHtml
  .replaceAll(
    "/__l5e/assets-v1/d47d36c1-5f2f-474b-8df1-f0d0a3a7c972/ev-charging.mp4",
    evChargingVideo,
  )
  .replaceAll(
    "/__l5e/assets-v1/6fb78e22-4195-40de-842f-88c772c23717/ev-interior.mp4",
    evInteriorVideo,
  );

const [headPart = "", rest = ""] = bodyWithLocalVideos.split('<main id="main">');
const [pagesPart = "", footPart = ""] = rest.split("</main>");

// Paths rendered by React routes rather than the static page markup.
const APP_PAGES = ["/account", "/admin", "/academy", "/team-invite", "/admin-setup", "/training-certification", "/sophia", "/request-energy-quote", "/policies", "/solutions"];

function pageName(pathname: string): string | null {
  if (APP_PAGES.some((p) => pathname.startsWith(p))) return null;
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  return slug === "" ? "home" : slug;
}

// Split the static markup into one chunk per page so each URL only carries its own content.
const PAGES: Record<string, string> = {};
for (const chunk of pagesPart.split(/(?=<div data-page=")/)) {
  const m = chunk.match(/^<div data-page="([^"]+)"/);
  if (m?.[1]) PAGES[m[1]] = chunk.replace(/<!--[\s\S]*?-->\s*$/, "");
}
const ALIASES: Record<string, string> = { "about-us": "about", paas: "power-as-a-service", diesel: "get-fuel", "cng-ev": "cng" };

function pageMarkup(name: string | null): { key: string; html: string } | null {
  if (!name) return null;
  const n = ALIASES[name] ?? name;
  const key = PAGES[n] ? n : "notfound";
  return { key, html: (PAGES[key] ?? "").replace(`<div data-page="${key}"`, `<div class="on" data-page="${key}"`) };
}

const val = (form: HTMLFormElement, sel: string) =>
  (form.querySelector(sel) as HTMLInputElement | null)?.value.trim() ?? "";

const SERVICE_NAMES: Record<string, string> = {
  electricity: "Get Electricity",
  bills: "Pay Bills",
  fuel: "Diesel Supply",
  cngbook: "CNG Conversion",
  ev: "EV Services",
  paas: "Power as a Service",
  training: "Training & Certification",
  community: "Community Electricity Vending",
  eea: "Energy E-Commerce Africa",
  contact: "Contact",
  careers: "Careers",
  invest: "Investment Enquiry",
  equipment: "Energy-Saving Equipment",
};

// Dropdown labels → names accepted by the electricity request function.
const DISCO_NAMES: Record<string, string> = {
  "Abuja Electricity (AEDC)": "Abuja Electricity Distribution Company",
  "Benin Electricity (BEDC)": "Benin Electricity Distribution Company",
  "Eko Electricity (EKEDC)": "Eko Electricity Distribution Company",
  "Enugu Electricity (EEDC)": "Enugu Electricity Distribution Company",
  "Ibadan Electricity (IBEDC)": "Ibadan Electricity Distribution Company",
  "Ikeja Electric (IE)": "Ikeja Electric",
  "Jos Electricity (JED)": "Jos Electricity Distribution Company",
  "Kaduna Electric (KAEDCO)": "Kaduna Electric",
  "Kano Electricity (KEDCO)": "Kano Electricity Distribution Company",
  "Port Harcourt Electricity (PHED)": "Port Harcourt Electricity Distribution Company",
  "Yola Electricity (YEDC)": "Yola Electricity Distribution Company",
  "Aba Power": "Aba Power",
};


export function LegacySite({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const page = pageMarkup(pageName(pathname));
  const pageRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ show: (n: string | null) => void; bind: (s: Element) => void } | null>(null);
  const navRef = useRef(navigate);
  navRef.current = navigate;

  useEffect(() => {
    api.current = initLegacy({
      async submit(form: HTMLFormElement, kind: string, lines: string[]) {
        try {
          if (kind === "login") {
            const { error } = await supabase.auth.signInWithPassword({
              email: val(form, "#li-user"),
              password: val(form, "#li-pw"),
            });
            if (error) return { error: error.message };
            navRef.current({ to: "/account" });
            return { done: true };
          }
          if (kind === "register") {
            const type = val(form, "#rg-type").toLowerCase();
            const { error } = await supabase.auth.signUp({
              email: val(form, "#rg-email"),
              password: val(form, "#rg-pw"),
              options: {
                emailRedirectTo: `${window.location.origin}/account`,
                data: {
                  full_name: `${val(form, "#rg-first")} ${val(form, "#rg-last")}`.trim(),
                  account_type: type === "business" ? "business" : "individual",
                  phone: val(form, "#rg-phone"),
                },
              },
            });
            return error ? { error: error.message } : {};
          }
          if (kind === "electricity") {
            const disco = val(form, "#el-disco");
            const meterType = (form.querySelector('input[name="metertype"]:checked') as HTMLInputElement | null)?.value ?? "Prepaid";
            const { data, error } = await supabase.rpc("submit_electricity_token_request", {
              p_full_name: val(form, "#el-name"),
              p_disco: DISCO_NAMES[disco] ?? disco,
              p_meter_type: meterType,
              p_meter_number: val(form, "#el-meter").replace(/\s/g, ""),
              p_amount_ngn: Math.round(Number(val(form, "#el-amt"))),
              p_phone: val(form, "#el-phone"),
              p_email: val(form, "#el-email"),
              p_state: val(form, "#el-state"),
              p_city_lga: val(form, "#el-city"),
              p_preferred_contact_method: val(form, "#el-contact"),
              p_consent: (form.querySelector("#el-consent") as HTMLInputElement | null)?.checked === true,
            });
            if (error) return { error: error.message || "Please try again in a moment." };
            return { reference: data as string };
          }
          const email = val(form, 'input[type="email"]');
          const nameEl = form.querySelector('input[id$="-name"]') as HTMLInputElement | null;
          const orgEl = form.querySelector('input[id$="-org"], input[id$="-company"]') as HTMLInputElement | null;
          const { data, error } = await supabase.rpc("submit_service_request", {
            p_request_type: kind,
            p_service_name: SERVICE_NAMES[kind] ?? kind,
            p_contact_name: nameEl?.value.trim() || email,
            p_contact_email: email,
            p_contact_phone: val(form, 'input[type="tel"]'),
            ...(orgEl?.value.trim() ? { p_company_name: orgEl.value.trim() } : {}),
            p_details: { lines },
          });
          if (error) return { error: "Please try again in a moment, or use the email option below." };
          return { reference: data as string };
        } catch {
          return { error: "Please check your connection and try again." };
        }
      },
    });

    // Internal links go through the app router.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/") || a.target || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      navRef.current({ to: href as "/" });
    };
    document.addEventListener("click", onClick);

    // Header "Log in" becomes "My account" when signed in.
    const syncLogin = (signedIn: boolean) => {
      document.querySelectorAll<HTMLAnchorElement>('a[href="/login"], a[href="/account"]').forEach((a) => {
        if (!a.closest("header.site")) return;
        a.setAttribute("href", signedIn ? "/account" : "/login");
        a.textContent = signedIn ? "My account" : "Log in";
      });
    };
    supabase.auth.getSession().then(({ data }) => syncLogin(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => syncLogin(!!s));
    return () => {
      document.removeEventListener("click", onClick);
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  // Wire up forms, tabs and widgets of the page that was just mounted.
  const pageKey = page?.key ?? null;
  useEffect(() => {
    const el = pageRef.current?.firstElementChild;
    if (el && api.current) { api.current.bind(el); (el.querySelector("form.gf") as HTMLElement | null)?.setAttribute("data-b", "1"); }
    console.log("bind", pageKey, !!el, !!api.current);
  }, [pageKey]);

  // Re-apply the visible page after every commit: React may re-apply the static
  // page markup on re-render, which would otherwise reset it to the first page loaded.
  useEffect(() => {
    api.current?.show(pageName(pathname));
    // Pre-select the contact subject from ?service=...
    const svc = new URLSearchParams(window.location.search).get("service");
    const map: Record<string, string> = {
      "mini-grid": "Mini-Grid",
      "power-as-a-service": "Power-as-a-Service",
      "distributed-power": "Distributed Power",
    };
    const sel = document.getElementById("ct-sub") as HTMLSelectElement | null;
    if (svc && sel && map[svc] && sel.value === "") {
      sel.value = map[svc];
    }
  });

  const isApp = pageName(pathname) === null;
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: headPart }} />
      <main id="main">
        {page && (
          <div key={page.key} ref={pageRef} style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: page.html }} />
        )}
        {isApp && <div className="corporate-content">{children}</div>}
      </main>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: footPart }} />
    </>
  );
}
