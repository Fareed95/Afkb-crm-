import { formatCurrency } from "@/lib/utils/format";

export function buildInvoiceWhatsAppMessage({
  shopName,
  invoiceNumber,
  outstanding,
  invoicePdfUrl
}: {
  shopName: string;
  invoiceNumber: string;
  outstanding: number;
  invoicePdfUrl: string;
}) {
  return `Dear *${shopName}*,\n\nInvoice *${invoiceNumber}* has been generated.\n\nThe pending amount is *${formatCurrency(outstanding)}*. Please pay the bill on time.\n\nYou can download the PDF invoice here:\n${invoicePdfUrl}\n\nThank you!`;
}

export function buildWhatsAppLink(phone: string, message: string) {
  const cleaned = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
