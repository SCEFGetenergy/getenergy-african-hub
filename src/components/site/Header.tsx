import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BRAND } from "@/lib/site";
import { useSession } from "@/hooks/use-session";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Electricity", to: "/electricity" },
  { label: "Diesel", to: "/diesel" },
  { label: "CNG", to: "/cng" },
  { label: "EV & Mobility", to: "/ev-mobility" },
  { label: "Green Energy", to: "/green-energy" },
  { label: "EEA", to: "/eea" },
  { label: "About", to: "/about" },
  { label: "Partners", to: "/partners" },
  { label: "Contact", to: "/contact" },
] as const;

const SECONDARY = [
  { label: "All solutions", to: "/#solutions" },
  { label: "Technology", to: "/technology" },
  { label: "Industries", to: "/industries" },
  { label: "Careers", to: "/careers" },
  { label: "FAQ", to: "/faq" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg green-surface">
            <Zap className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold text-brand">GetEnergy</span>
            <span className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
              Integrated Energy
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground [&.active]:text-brand-green"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {user ? (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/account">
                <LayoutDashboard className="size-4" />
                My account
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">
                <LogIn className="size-4" />
                Sign in
              </Link>
            </Button>
          )}
          <Button asChild size="sm" className="hidden bg-brand-green text-brand-green-foreground hover:bg-brand-green/90 md:inline-flex">
            <Link to="/contact">{BRAND.primaryCta}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto">
              <SheetTitle className="px-4 pt-4 font-display text-brand">GetEnergy</SheetTitle>
              <nav className="mt-4 flex flex-col px-2 pb-6">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                {SECONDARY.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 space-y-2 px-1">
                  <Button asChild className="w-full bg-brand-green text-brand-green-foreground hover:bg-brand-green/90">
                    <Link to="/contact" onClick={() => setOpen(false)}>
                      {BRAND.primaryCta}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={user ? "/account" : "/auth"} onClick={() => setOpen(false)}>
                      {user ? "My account" : "Sign in / Register"}
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
