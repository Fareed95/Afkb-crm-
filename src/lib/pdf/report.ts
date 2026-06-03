import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function buildReportPdf(title: string, lines: string[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText(title, {
    x: 50,
    y: 800,
    size: 18,
    font: titleFont,
    color: rgb(0.1, 0.1, 0.1)
  });

  let y = 760;
  lines.forEach((line) => {
    page.drawText(line, { x: 50, y, size: 12, font });
    y -= 18;
    if (y < 60) {
      y = 760;
    }
  });

  return pdfDoc.save();
}
