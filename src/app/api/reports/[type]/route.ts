import { NextResponse } from "next/server";
import { buildReportPdf } from "@/lib/pdf/report";
import { getDailyClosingReport } from "@/lib/services/reports";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { formatCurrency } from "@/lib/utils/format";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const supabase = await getSupabaseServerClient();

  let title = "Report";
  let lines: string[] = [];

  if (type === "daily-closing") {
    title = "Daily Closing Report";
    const report = await getDailyClosingReport(date);
    lines = [
      `Date: ${date}`,
      `Work value: ${formatCurrency(report.workValue)}`,
      `Invoices generated: ${report.invoicesGenerated}`,
      `Payments received: ${formatCurrency(report.paymentsReceived)}`,
      `Outstanding added: ${formatCurrency(report.outstandingAdded)}`,
      `Top shop: ${report.topShop}`,
      `Top garment: ${report.topGarment}`
    ];
  } else if (type === "monthly-closing") {
    title = "Monthly Closing Report";
    const month = date.slice(0, 7);
    const { data: payments } = await supabase
      .from("payments")
      .select("amount, payment_date")
      .like("payment_date", `${month}%`);
    const { data: invoices } = await supabase
      .from("invoices")
      .select("subtotal, invoice_date")
      .like("invoice_date", `${month}%`);

    const revenue = (payments ?? []).reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const invoiced = (invoices ?? []).reduce(
      (sum, inv) => sum + Number(inv.subtotal),
      0
    );

    lines = [
      `Month: ${month}`,
      `Invoices total: ${formatCurrency(invoiced)}`,
      `Payments total: ${formatCurrency(revenue)}`
    ];
  } else if (type === "payment") {
    title = "Payment Report";
    const { data } = await supabase
      .from("payments")
      .select("payment_date, amount")
      .order("payment_date", { ascending: false })
      .limit(20);
    lines = (data ?? []).map(
      (row) => `${row.payment_date} - ${formatCurrency(Number(row.amount))}`
    );
  } else if (type === "invoice") {
    title = "Invoice Report";
    const { data } = await supabase
      .from("invoices")
      .select("invoice_number, invoice_date, subtotal")
      .order("invoice_date", { ascending: false })
      .limit(20);
    lines = (data ?? []).map(
      (row) => `${row.invoice_number} - ${row.invoice_date} - ${formatCurrency(Number(row.subtotal))}`
    );
  } else if (type === "outstanding") {
    title = "Outstanding Report";
    const { data } = await supabase
      .from("ledger_entries")
      .select("shop_id, debit, credit");
    const balances = new Map<string, number>();
    (data ?? []).forEach((entry) => {
      const total = (balances.get(entry.shop_id) ?? 0) +
        Number(entry.debit) -
        Number(entry.credit);
      balances.set(entry.shop_id, total);
    });
    lines = Array.from(balances.entries()).map(
      ([shopId, balance]) => `${shopId} - ${formatCurrency(balance)}`
    );
  } else if (type === "garment") {
    title = "Garment Report";
    const { data } = await supabase
      .from("work_entry_items")
      .select("garment_name, quantity");
    const totals = new Map<string, number>();
    (data ?? []).forEach((item) => {
      totals.set(
        item.garment_name,
        (totals.get(item.garment_name) ?? 0) + Number(item.quantity)
      );
    });
    lines = Array.from(totals.entries()).map(
      ([name, quantity]) => `${name} - ${quantity}`
    );
  } else {
    title = "Shop Report";
    const { data } = await supabase
      .from("shops")
      .select("shop_name, phone_number")
      .order("shop_name")
      .limit(20);
    lines = (data ?? []).map(
      (row) => `${row.shop_name} - ${row.phone_number}`
    );
  }

  const pdfBytes = await buildReportPdf(title, lines);
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${type}-report.pdf`
    }
  });
}
