import { formatCurrency } from "@/lib/utils/format";

export function buildInvoiceWhatsAppMessage({
  invoiceNumber,
  outstanding
}: {
  invoiceNumber: string;
  outstanding: number;
}) {
  return `Dear Customer,\n\nInvoice ${invoiceNumber} has been generated.\n\nOutstanding Amount: ${formatCurrency(outstanding)}\n\nPlease find the invoice attached.\nThank you.`;
}

export function buildWhatsAppLink(phone: string, message: string) {
  const cleaned = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
