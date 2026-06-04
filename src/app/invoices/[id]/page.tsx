import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInvoiceById } from "@/lib/services/invoices";
import { buildInvoiceWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Scissors, Printer, Download, MessageCircle, FileText, Shirt } from "lucide-react";
import { PrintButton } from "@/components/ui/print-button";

export default async function InvoiceDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  const amountDue = Math.max(Number(invoice.grand_total), 0);
  const creditCarry = Math.max(-Number(invoice.grand_total), 0);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const invoicePdfUrl = `${baseUrl}/api/pdf/invoice/${invoice.id}`;

  const message = buildInvoiceWhatsAppMessage({
    shopName: invoice.shops?.shop_name || "Customer",
    invoiceNumber: invoice.invoice_number,
    outstanding: amountDue,
    invoicePdfUrl
  });

  const whatsappLink = invoice.shops?.phone_number
    ? buildWhatsAppLink(invoice.shops.phone_number, message)
    : null;

  // Calculate garment summaries
  const garmentSummaries = new Map<string, { qty: number; amount: number }>();
  (invoice.invoice_items ?? []).forEach((item: any) => {
    const existing = garmentSummaries.get(item.garment_name) || { qty: 0, amount: 0 };
    garmentSummaries.set(item.garment_name, {
      qty: existing.qty + Number(item.quantity),
      amount: existing.amount + Number(item.amount)
    });
  });

  // Group detailed work entries by work_date, garment_name, and rate (no time)
  const groupedEntries = new Map<string, { date: string; garment: string; rate: number; qty: number; amount: number }>();
  (invoice.invoice_items ?? []).forEach((item: any) => {
    const dateKey = item.work_date;
    const key = `${dateKey}_${item.garment_name}_${item.rate}`;
    if (groupedEntries.has(key)) {
      const existing = groupedEntries.get(key)!;
      existing.qty += Number(item.quantity);
      existing.amount += Number(item.amount);
    } else {
      groupedEntries.set(key, {
        date: dateKey,
        garment: item.garment_name,
        rate: Number(item.rate),
        qty: Number(item.quantity),
        amount: Number(item.amount)
      });
    }
  });

  const consolidatedItems = Array.from(groupedEntries.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 print:hidden sm:flex-row sm:items-center sm:p-6">
        <div className="min-w-0">
          <h1 className="break-words font-display text-xl font-bold sm:text-2xl">Invoice {invoice.invoice_number}</h1>
          <p className="text-sm text-muted-foreground mt-1">Review, print, or share this professional statement.</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:items-center">
          <div className="flex-1 sm:flex-none">
            <PrintButton downloadUrl={`/api/pdf/invoice/${invoice.id}`} />
          </div>
          {whatsappLink ? (
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none">
              <Button className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-md rounded-xl">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
            </a>
          ) : null}
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="mx-auto max-w-[850px] overflow-hidden rounded-sm bg-white text-black shadow-2xl print:m-0 print:w-full print:max-w-full print:overflow-visible print:border-none print:shadow-none">

        {/* Invoice Header */}
        <div className="flex flex-col items-start justify-between gap-6 bg-slate-900 p-5 text-white print:flex-row print:bg-slate-900 print:p-10 print:text-white sm:flex-row sm:p-8 lg:p-10" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-lg sm:h-16 sm:w-16">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <Shirt className="h-8 w-8 relative z-10" />
              <Scissors className="h-5.5 w-5.5 absolute bottom-2.5 right-2.5 opacity-80 z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">AFKB</h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-foreground/80 sm:text-sm">Garment Processing</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <h1 className="text-3xl font-black uppercase tracking-widest text-white/90 sm:text-4xl">Invoice</h1>
            <p className="text-white/60 font-medium mt-2">{invoice.invoice_number}</p>
            <p className="text-white/60 font-medium">Date: {formatDate(invoice.invoice_date)}</p>
            {invoice.timestamp_from && invoice.timestamp_to && (
              <p className="text-white/50 text-xs mt-3 bg-white/10 px-3 py-1.5 rounded-lg inline-block text-left">
                <span className="block font-bold text-white/70 mb-0.5">BILLING PERIOD</span>
                {new Date(invoice.timestamp_from).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                <span className="mx-1">→</span><br className="sm:hidden" />
                {new Date(invoice.timestamp_to).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-7 p-4 sm:p-8 lg:space-y-10 lg:p-10">

          {/* Customer & Shop Details */}
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
              <h3 className="text-xl font-bold text-slate-800">{invoice.shops?.shop_name}</h3>
              {invoice.shops?.phone_number && <p className="text-slate-600 mt-1">{invoice.shops.phone_number}</p>}
              {invoice.shops?.email && <p className="text-slate-600">{invoice.shops.email}</p>}
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Generated By</p>
              <p className="text-slate-800 font-semibold">AFKB System</p>
              <p className="text-slate-500 text-sm mt-1">Authorized Signatory</p>
            </div>
          </div>

          {/* Account Summary Highlight */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Previous Billing Summary
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Previous Bill</p>
                  <p className="font-bold text-slate-800">
                    {invoice.previous_invoice ? formatCurrency(Number(invoice.previous_invoice.subtotal)) : "₹0"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {invoice.previous_invoice ? `No: ${invoice.previous_invoice.invoice_number} | Date: ${formatDate(invoice.previous_invoice.invoice_date)}` : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Last Payment</p>
                  <p className="font-bold text-emerald-600">
                    {invoice.last_payment ? formatCurrency(Number(invoice.last_payment.amount)) : "₹0"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {invoice.last_payment ? `Date: ${formatDate(invoice.last_payment.payment_date)}` : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Outstanding Carried</p>
                  <p className="font-bold text-rose-600">{formatCurrency(Number(invoice.previous_balance))}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Past balance forward</p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-2 rounded-xl border border-primary/10 bg-primary/5 p-3 md:-mb-2 md:-mr-2 md:-mt-2">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Current Charges</p>
                  <p className="font-bold text-slate-800">{formatCurrency(Number(invoice.subtotal))}</p>
                </div>
                <div className="pt-2 border-t border-primary/20">
                  <p className="text-xs text-primary font-bold uppercase mb-1">Final Amount Due</p>
                  <p className="text-xl font-black text-primary">{formatCurrency(amountDue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Work Entries Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Detailed Work Entries</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Garment</th>
                    <th className="py-3 px-4 font-bold text-right">Qty</th>
                    <th className="py-3 px-4 font-bold text-right">Rate</th>
                    <th className="py-3 px-4 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consolidatedItems.map((item: any, idx: number) => {
                    const dt = new Date(item.date);
                    const formattedDate = dt.toLocaleDateString("en-IN", { day: '2-digit', month: 'short' });

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 print:break-inside-avoid">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">{formattedDate}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">{item.garment}</td>
                        <td className="py-3 px-4 text-right text-slate-600">{Number(item.qty)}</td>
                        <td className="py-3 px-4 text-right text-slate-600">₹{Number(item.rate)}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-800">₹{Number(item.amount)}</td>
                      </tr>
                    );
                  })}
                  {consolidatedItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">No entries found for this invoice.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Garment Summary Table */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Garment Summary</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="py-2 px-4 font-bold">Item</th>
                      <th className="py-2 px-4 font-bold text-right">Total Qty</th>
                      <th className="py-2 px-4 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Array.from(garmentSummaries.entries()).map(([name, stats]) => (
                      <tr key={name}>
                        <td className="py-2 px-4 font-medium text-slate-700">{name}</td>
                        <td className="py-2 px-4 text-right font-semibold text-slate-800">{stats.qty}</td>
                        <td className="py-2 px-4 text-right font-bold text-slate-800">₹{stats.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t border-slate-200">
                    <tr>
                      <td className="py-2 px-4 text-slate-800">Total</td>
                      <td className="py-2 px-4 text-right text-slate-800">
                        {Array.from(garmentSummaries.values()).reduce((sum, s) => sum + s.qty, 0)}
                      </td>
                      <td className="py-2 px-4 text-right text-primary">
                        {formatCurrency(Number(invoice.subtotal))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Final Calculations */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Current Charges</span>
                <span className="font-bold text-slate-800">{formatCurrency(Number(invoice.subtotal))}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Previous Balance</span>
                <span className="font-bold text-rose-600">{formatCurrency(Number(invoice.previous_balance))}</span>
              </div>
              {Number(invoice.credit_applied) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-600 font-medium">Credit Applied</span>
                  <span className="font-bold text-emerald-600">-{formatCurrency(Number(invoice.credit_applied))}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-center">
                <span className="font-black text-slate-900 uppercase tracking-wider">Grand Total</span>
                <span className="text-2xl font-black text-primary">{formatCurrency(amountDue)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-slate-200 bg-slate-100 p-5 text-center print:break-inside-avoid sm:p-8">
          <p className="text-slate-800 font-bold text-lg mb-1">Thank you for your business!</p>
          <p className="text-slate-500 text-sm mb-6">Prompt payment is highly appreciated to maintain your account standing.</p>

          <div className="mt-12 flex flex-col gap-8 border-t border-slate-300 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-left">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">System Generated</p>
              <p className="text-[10px] text-slate-400 mt-1">Generated on {new Date().toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="w-40 border-b-2 border-slate-300 mb-2"></div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Authorized Signature</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
