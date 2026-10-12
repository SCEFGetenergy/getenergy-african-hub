// Swappable payment-gateway adapter. Add a real provider by implementing this interface
// and registering it in gateway/index.server.ts; select it with the PAYMENT_GATEWAY secret.

export type CreatePaymentInput = { orderReference: string; amountNgn: number; email: string; phone: string; returnUrl: string };
export type CreatePaymentResult = { gatewayReference: string; checkoutUrl: string };
export type VerifyResult = { status: "paid" | "pending" | "failed"; amountNgn: number | null; raw: unknown };
export type WebhookResult = { valid: boolean; eventId?: string | undefined; gatewayReference?: string | undefined; raw?: unknown };
export type RefundResult = { refundReference: string | null; status: "succeeded" | "pending" | "failed"; raw: unknown };
export type GatewayPayment = { gatewayReference: string; amountNgn: number; status: string; at: string };

export interface PaymentGateway {
  name: string;
  createPayment(i: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(gatewayReference: string): Promise<VerifyResult>;
  /** Must verify the provider signature over the raw body before trusting anything. */
  handleWebhook(rawBody: string, headers: Headers): Promise<WebhookResult>;
  refund(i: { gatewayReference: string; amountNgn: number; reason: string }): Promise<RefundResult>;
  /** Payments settled on a Lagos calendar day, for reconciliation. */
  listPayments(dayIso: string): Promise<GatewayPayment[]>;
}
