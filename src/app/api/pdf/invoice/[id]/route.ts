import { NextResponse } from "next/server";
import { getInvoiceById } from "@/lib/services/invoices";
import { InvoiceDocument } from "@/lib/pdf/invoice-document";
import { renderToStream } from "@react-pdf/renderer";

async function generatePdfBuffer(element: React.ReactElement): Promise<Buffer> {
  // @ts-expect-error: React 19 type mismatch with @react-pdf/renderer
  const stream = await renderToStream(element);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  
  // Call it as a standard function so we don't need .tsx extension in this file
  const element = InvoiceDocument({ invoice });
  const pdfBytes = await generatePdfBuffer(element as any);

  return new NextResponse(pdfBytes as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoice.invoice_number}.pdf`
    }
  });
}
