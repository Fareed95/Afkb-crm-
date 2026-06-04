import { formatCurrency } from "@/lib/utils/format";

export function buildInvoiceWhatsAppMessage({
  invoiceNumber,
  outstanding,
  invoicePdfUrl
}: {
  invoiceNumber: string;
  outstanding: number;
  invoicePdfUrl: string;
}) {
  return `Dear Customer,\n\nInvoice *${invoiceNumber}* has been generated.\n\nOutstanding Amount: *${formatCurrency(outstanding)}*\n\nYou can download the PDF invoice here:\n${invoicePdfUrl}\n\nThank you for your business!`;
}

export function buildWhatsAppLink(phone: string, message: string) {
  const cleaned = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
