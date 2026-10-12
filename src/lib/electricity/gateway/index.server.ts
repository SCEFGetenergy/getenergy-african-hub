import type { PaymentGateway } from "./types";
import { mockGateway } from "./mock.server";
import { vtpassIsLive } from "../vtpass.server";

const ADAPTERS: Record<string, PaymentGateway> = { mock: mockGateway };

export function getGateway(): PaymentGateway {
  const name = (process.env["PAYMENT_GATEWAY"] ?? "mock").toLowerCase();
  const g = ADAPTERS[name];
  if (!g) throw new Error(`Unknown payment gateway "${name}"`);
  // Safety: fake payments must never trigger real vending.
  if (g.name === "mock" && vtpassIsLive()) throw new Error("The mock gateway cannot be used with live VTpass");
  return g;
}
