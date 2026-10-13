import { DISCOS, SITE_MIN_NGN } from "@/lib/electricity/rules";

export const QUICK_AMOUNTS = [1000, 2000, 5000, 10000] as const;
export const START_KEY = "getenergy-electricity-start";
export type QuickStart = { serviceId: string; meter: string; amount: string };
export type ElectricityConfig = { live: boolean; discos: { serviceId: string; confirmed: boolean }[] };

export function canPurchase(cfg: ElectricityConfig, serviceId: string) {
  return cfg.live && cfg.discos.some((d) => d.serviceId === serviceId && d.confirmed);
}
export function electricityDestination(cfg: ElectricityConfig, serviceId = "") {
  const ready = serviceId ? canPurchase(cfg, serviceId) : cfg.live && cfg.discos.some((d) => d.confirmed);
  return `/get-electricity#${ready ? "elec-live-root" : "elecform"}`;
}
export function validateQuickStart(value: QuickStart) {
  if (!DISCOS.some((d) => d.serviceId === value.serviceId)) return "Choose your electricity company.";
  if (!/^\d{11,13}$/.test(value.meter)) return "Enter a meter number with 11 to 13 digits.";
  if (!/^\d+$/.test(value.amount) || Number(value.amount) < SITE_MIN_NGN) return "Enter an amount of at least ₦1,000.";
  return "";
}
export function stickyVisible(panelVisible: boolean, inputFocused: boolean, menuOpen: boolean) {
  return !panelVisible && !inputFocused && !menuOpen;
}

export const HOME_ELECTRICITY_COPY = {
  live: { label: "Buy electricity", headline: "Buy electricity now.", support: "Pick your electricity company, enter your meter number and pay. Your token arrives by SMS and email.", banner: "Need electricity? It takes about a minute." },
  off: { label: "Request electricity token", headline: "Get your electricity token.", support: "Tell us your electricity company, meter number and amount. Our team contacts you to complete your request.", banner: "Send your meter details in a minute." },
};