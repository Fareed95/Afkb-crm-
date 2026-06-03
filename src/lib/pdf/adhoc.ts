import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export async function buildAdhocReceiptPdf(receipt: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText("AFKB Receipt", { x: 50, y: 800, size: 16, font: bold });
  page.drawText(`Customer: ${receipt.customer_name}`, {
    x: 50,
    y: 770,
    size: 12,
    font
  });
  page.drawText(`Date: ${formatDate(receipt.receipt_date)}`, {
    x: 50,
    y: 750,
    size: 12,
    font
  });
  page.drawText(`Amount: ${formatCurrency(Number(receipt.amount))}`, {
    x: 50,
    y: 730,
    size: 12,
    font
  });
  page.drawText(`Work: ${receipt.work_description}`, {
    x: 50,
    y: 710,
    size: 12,
    font
  });

  return pdfDoc.save();
}
