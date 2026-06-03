import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export async function buildLedgerPdf(ledger: any[], shopName: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText(`Ledger - ${shopName}`, { x: 50, y: 800, size: 16, font: bold });
  let y = 770;
  ledger.forEach((line) => {
    page.drawText(
      `${formatDate(line.entry_date)} | ${line.description} | ${formatCurrency(line.debit)} | ${formatCurrency(line.credit)} | ${formatCurrency(line.balance)}`,
      { x: 50, y, size: 10, font }
    );
    y -= 14;
  });

  return pdfDoc.save();
}
