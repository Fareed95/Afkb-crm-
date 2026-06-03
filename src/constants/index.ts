export const roles = ["owner", "staff"] as const;
export type Role = (typeof roles)[number];

export const paymentModes = [
  "cash",
  "upi",
  "bank_transfer",
  "cheque"
] as const;

export type PaymentMode = (typeof paymentModes)[number];

export const paymentModeLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque"
};
