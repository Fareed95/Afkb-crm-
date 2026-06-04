import PdfPrinter from 'pdfmake';

var fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};
var printer = new PdfPrinter(fonts);
var docDefinition = {
  content: [
    'First paragraph',
    'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
  ],
  defaultStyle: {
    font: 'Helvetica'
  }
};
var pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.end();
console.log("Success");
