import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Zap } from "lucide-react";
import { BRAND, SERVICES } from "@/lib/site";

const COMPANY_LINKS = [
  { label: "About GetEnergy", to: "/about" },
  { label: "Green Energy", to: "/green-energy" },
  { label: "Technology", to: "/technology" },
  { label: "Industries We Serve", to: "/industries" },
  { label: "Partners & Funders", to: "/partners" },
  { label: "Careers", to: "/careers" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;

export function Footer() {
  return (
    <footer className="hero-surface px-4 pt-14 pb-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-green text-brand-green-foreground">
                <Zap className="size-5" />
              </span>
              <span className="font-display text-lg font-bold text-primary-foreground">GetEnergy</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75">{BRAND.tagline}</p>
            <p className="mt-4 text-xs leading-relaxed text-primary-foreground/60">
              {BRAND.legalName} — a subsidiary of {BRAND.parent}.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary-foreground">Solutions</h3>
            <ul className="mt-4 space-y-2">
              {SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/${service.slug}`}
                    className="text-sm text-primary-foreground/75 transition-colors hover:text-brand-green-soft"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              {COMPANY_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-primary-foreground/75 transition-colors hover:text-brand-green-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={BRAND.eeaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-brand-green-soft"
                >
                  eea.africa
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary-foreground">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-green-soft" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-brand-green-soft">
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-green-soft" />
                <span>{BRAND.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green-soft" />
                <span>{BRAND.address}</span>
              </li>
              <li className="pt-1">
                <Link to="/auth" className="hover:text-brand-green-soft">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/15 pt-6">
          <p className="text-xs leading-relaxed text-primary-foreground/55">{BRAND.disclaimer}</p>
          <p className="mt-4 text-xs text-primary-foreground/55">
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
