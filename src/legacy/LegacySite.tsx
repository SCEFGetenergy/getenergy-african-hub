import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import bodyHtml from "./body.html?raw";
import { initLegacy } from "./legacy";
import { supabase } from "@/integrations/supabase/client";

const [headPart = "", rest = ""] = bodyHtml.split('<main id="main">');
const [pagesPart = "", footPart = ""] = rest.split("</main>");

// Paths rendered by React routes rather than the static page markup.
const APP_PAGES = ["/account", "/company", "/sophia"];

function pageName(pathname: string): string | null {
  if (APP_PAGES.some((p) => pathname.startsWith(p))) return null;
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  return slug === "" ? "home" : slug;
}

function withActivePage(markup: string, name: string | null) {
  if (!name) return markup;
  const re = new RegExp(`<div data-page="${name}"`);
  const target = re.test(markup) ? name : "notfound";
  return markup.replace(`<div data-page="${target}"`, `<div class="on" data-page="${target}"`);
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
};

export function LegacySite({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [initialPages] = useState(() => withActivePage(pagesPart, pageName(pathname)));
  const api = useRef<{ show: (n: string | null) => void } | null>(null);
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
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: initialPages }} />
        {isApp && <div className="corporate-content">{children}</div>}
      </main>
      <nav className="corporate-links" aria-label="More about GetEnergy">
        <div className="wrap">
          <span>Explore more about GetEnergy</span>
          <div>
            <Link to="/company/about">Our story</Link>
            <Link to="/company/green-energy">Energy transition</Link>
            <Link to="/company/industries">Industries</Link>
            <Link to="/company/technology">Technology</Link>
            <Link to="/company/partners">Partners & funders</Link>
            <Link to="/company/solutions">Detailed solutions</Link>
            <Link to="/company/faq">More questions</Link>
            <Link to="/company/careers">More careers</Link>
            <Link to="/company/contact">More contact options</Link>
          </div>
        </div>
      </nav>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: footPart }} />
    </>
  );
}
