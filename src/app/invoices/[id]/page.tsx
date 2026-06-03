import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInvoiceById } from "@/lib/services/invoices";
import { buildInvoiceWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export default async function InvoiceDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  const amountDue = Math.max(Number(invoice.grand_total), 0);
  const creditCarry = Math.max(-Number(invoice.grand_total), 0);

  const message = buildInvoiceWhatsAppMessage({
    invoiceNumber: invoice.invoice_number,
    outstanding: amountDue
  });

  const whatsappLink = invoice.shops?.phone_number
    ? buildWhatsAppLink(invoice.shops.phone_number, message)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice ${invoice.invoice_number}`}
        description="Review invoice details and share with the customer."
        actions={
          <div className="flex gap-2">
            <Link href={`/api/pdf/invoice/${invoice.id}`}>
              <Button className="btn-lg" variant="outline">
                Download PDF
              </Button>
            </Link>
            {whatsappLink ? (
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <Button className="btn-lg">WhatsApp</Button>
              </a>
            ) : null}
          </div>
        }
      />
      <Card className="space-y-3">
        <p><strong>Date:</strong> {formatDate(invoice.invoice_date)}</p>
        <p><strong>Subtotal:</strong> {formatCurrency(Number(invoice.subtotal))}</p>
        <p><strong>Previous Balance:</strong> {formatCurrency(Number(invoice.previous_balance))}</p>
        <p><strong>Credit Applied:</strong> {formatCurrency(Number(invoice.credit_applied))}</p>
        <p><strong>Amount Due:</strong> {formatCurrency(amountDue)}</p>
        {creditCarry > 0 ? (
          <p><strong>Credit Carry Forward:</strong> {formatCurrency(creditCarry)}</p>
        ) : null}
        <p>
          <strong>Previous Invoice:</strong> {invoice.previous_invoice?.invoice_number ?? "-"}
        </p>
        <p>
          <strong>Previous Invoice Amount:</strong>{" "}
          {invoice.previous_invoice
            ? formatCurrency(Number(invoice.previous_invoice.subtotal))
            : "-"}
        </p>
        <p>
          <strong>Last Payment:</strong>{" "}
          {invoice.last_payment
            ? `${formatCurrency(Number(invoice.last_payment.amount))} on ${formatDate(
                invoice.last_payment.payment_date
              )}`
            : "-"}
        </p>
      </Card>
      <div className="section-card">
        <h3 className="font-display text-lg font-semibold">Invoice Items</h3>
        <ul className="mt-3 space-y-2">
          {(invoice.invoice_items ?? []).map((item: any) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>{item.garment_name} ({item.quantity} x {item.rate})</span>
              <span>{formatCurrency(Number(item.amount))}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
