import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export async function buildInvoicePdf(invoice: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText("AFKB Invoice", {
    x: 50,
    y: 800,
    size: 18,
    font: bold,
    color: rgb(0.1, 0.1, 0.1)
  });

  page.drawText(`Invoice: ${invoice.invoice_number}`, {
    x: 50,
    y: 770,
    size: 12,
    font
  });

  page.drawText(`Date: ${formatDate(invoice.invoice_date)}`, {
    x: 50,
    y: 750,
    size: 12,
    font
  });

  let y = 710;
  page.drawText("Items", { x: 50, y, size: 12, font: bold });
  y -= 16;

  (invoice.invoice_items ?? []).forEach((item: any) => {
    page.drawText(
      `${item.garment_name} | ${item.quantity} x ${item.rate} | ${formatCurrency(Number(item.amount))}`,
      { x: 50, y, size: 11, font }
    );
    y -= 14;
  });

  y -= 10;
  const amountDue = Math.max(Number(invoice.grand_total), 0);
  page.drawText(`Subtotal: ${formatCurrency(Number(invoice.subtotal))}`, {
    x: 50,
    y,
    size: 12,
    font
  });
  y -= 14;
  page.drawText(
    `Previous Balance: ${formatCurrency(Number(invoice.previous_balance))}`,
    { x: 50, y, size: 12, font }
  );
  y -= 14;
  page.drawText(`Credit Applied: ${formatCurrency(Number(invoice.credit_applied))}`, {
    x: 50,
    y,
    size: 12,
    font
  });
  y -= 14;
  page.drawText(`Amount Due: ${formatCurrency(amountDue)}`, {
    x: 50,
    y,
    size: 12,
    font: bold
  });

  return pdfDoc.save();
}
