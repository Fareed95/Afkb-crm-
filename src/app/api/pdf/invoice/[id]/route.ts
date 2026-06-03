import { NextResponse } from "next/server";
import { getInvoiceById } from "@/lib/services/invoices";
import { buildInvoicePdf } from "@/lib/pdf/invoice";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  const pdfBytes = await buildInvoicePdf(invoice);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoice.invoice_number}.pdf`
    }
  });
}
